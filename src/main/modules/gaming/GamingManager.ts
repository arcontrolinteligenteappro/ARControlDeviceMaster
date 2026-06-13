import { Worker } from 'worker_threads';
import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { scrcpyManager } from '../control/ScrcpyManager';

export class GamingManager {
  private activeKeymappers: Map<string, Worker> = new Map();
  private profilesDir: string;

  constructor() {
    // The actual initialization is done in the async init() method.
    this.profilesDir = ''; // Will be set in init()
  }

  public async init() {
    this.profilesDir = path.join(app.getPath('userData'), 'keymap_profiles');
    try {
      await fs.mkdir(this.profilesDir, { recursive: true });
      console.log(
        `[GamingManager] Profiles directory ensured at: ${this.profilesDir}`,
      );
    } catch (error) {
      console.error(
        '[GamingManager] Error creating profiles directory:',
        error,
      );
    }
  }

  public startSession(deviceId: string): void {
    if (this.activeKeymappers.has(deviceId)) {
      console.warn(
        `[GamingManager] Keymapper for ${deviceId} is already active.`,
      );
      return;
    }

    console.log(`[GamingManager] Starting game session for ${deviceId}...`);

    const onScrcpyClose = () => {
      console.log(
        `[GamingManager] Scrcpy session ended for ${deviceId}, stopping keymapper worker.`,
      );
      this.stopSession(deviceId);
    };

    const scrcpyOptions = {
      maxFps: 60,
      bitRate: '16M',
      windowTitle: `GAME - ${deviceId}`,
      stayAwake: true,
    };

    const scrcpyStarted = scrcpyManager.start(
      deviceId,
      scrcpyOptions,
      onScrcpyClose,
    );
    if (!scrcpyStarted) {
      console.error(
        `[GamingManager] Failed to start scrcpy session for ${deviceId}. Aborting game session.`,
      );
      return;
    }

    const workerPath = path.join(__dirname, '../workers/Keymapper.worker.js');
    const worker = new Worker(workerPath, { workerData: { deviceId } });

    worker.on('message', (msg) => {
      if (msg === 'ready')
        console.log(
          `[GamingManager] Keymapper worker for ${deviceId} is ready.`,
        );
    });
    worker.on('error', (err) => {
      console.error(`[GamingManager] Worker for ${deviceId} error:`, err);
      this.stopSession(deviceId);
    });
    worker.on('exit', (code) => {
      console.log(
        `[GamingManager] Worker for ${deviceId} exited with code ${code}.`,
      );
      this.activeKeymappers.delete(deviceId);
    });

    this.activeKeymappers.set(deviceId, worker);
  }

  public stopSession(deviceId: string): void {
    console.log(`[GamingManager] Stopping game session for ${deviceId}.`);
    scrcpyManager.stop(deviceId);
    const worker = this.activeKeymappers.get(deviceId);
    if (worker) {
      worker.terminate();
      console.log(
        `[GamingManager] Terminated keymapper worker for ${deviceId}.`,
      );
    }
  }

  public updateWorkerMappings(deviceId: string, mappings: any[]): void {
    const worker = this.activeKeymappers.get(deviceId);
    if (worker) {
      worker.postMessage({ type: 'UPDATE_MAPPINGS', mappings });
    }
  }

  public sendInput(deviceId: string, input: any): void {
    const worker = this.activeKeymappers.get(deviceId);
    if (worker) {
      worker.postMessage(input);
    }
  }

  public async saveProfile(
    profileName: string,
    mappings: any,
  ): Promise<boolean> {
    if (!profileName || !/^[a-zA-Z0-9_-]+$/.test(profileName)) {
      console.error('[GamingManager] Invalid profile name.');
      return false;
    }
    try {
      const filePath = path.join(this.profilesDir, `${profileName}.json`);
      await fs.writeFile(filePath, JSON.stringify(mappings, null, 2));
      console.log(
        `[GamingManager] Profile '${profileName}' saved successfully.`,
      );
      return true;
    } catch (error) {
      console.error(
        `[GamingManager] Error saving profile '${profileName}':`,
        error,
      );
      return false;
    }
  }

  public async loadProfile(profileName: string): Promise<any | null> {
    try {
      const filePath = path.join(this.profilesDir, `${profileName}.json`);
      const data = await fs.readFile(filePath, 'utf-8');
      console.log(
        `[GamingManager] Profile '${profileName}' loaded successfully.`,
      );
      return JSON.parse(data);
    } catch (error) {
      console.error(
        `[GamingManager] Error loading profile '${profileName}':`,
        error,
      );
      return null;
    }
  }

  public async listProfiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.profilesDir);
      return files
        .filter((file) => file.endsWith('.json'))
        .map((file) => path.basename(file, '.json'));
    } catch (error) {
      console.error('[GamingManager] Error listing profiles:', error);
      return [];
    }
  }
}

export const gamingManager = new GamingManager();
