// src/main/modules/keymapper/KeymapperManager.ts
import { ipcMain, app } from 'electron';
import { Worker } from 'worker_threads';
import path from 'path';
import fs from 'fs/promises';
import { IpcChannel, KeyMappingProfile } from '../../ipc';

const PROFILES_DIR = path.join(app.getPath('userData'), 'keymapper_profiles');

export class KeymapperManager {
  private worker: Worker | null = null;
  private currentDeviceId: string | null = null;

  constructor() {
    this.initProfilesDir();
  }

  private async initProfilesDir() {
    try {
      await fs.mkdir(PROFILES_DIR, { recursive: true });
    } catch (error) {
      console.error(
        '[KeymapperManager] Failed to create profiles directory:',
        error,
      );
    }
  }

  public registerIpcHandlers() {
    ipcMain.handle(
      IpcChannel.START_KEYMAPPER,
      (
        _,
        {
          deviceId,
          mappings,
        }: { deviceId: string; mappings: KeyMappingProfile },
      ) => {
        console.log(
          `[KeymapperManager] Request to START keymapper for ${deviceId}`,
        );
        this.stop(); // Detiene cualquier worker anterior

        this.currentDeviceId = deviceId;
        const workerPath = path.join(
          __dirname,
          '../../workers/keymapper.worker.js',
        );

        this.worker = new Worker(workerPath);

        this.worker.on('message', (result) => {
          console.log(`[KeymapperWorker] Message:`, result);
          // Aquí se podrían manejar notificaciones al frontend, como errores
        });
        this.worker.on('error', (err) => {
          console.error(`[KeymapperWorker] Critical Error:`, err);
          this.stop(); // Detener en caso de error crítico
        });
        this.worker.on('exit', (code) => {
          if (code !== 0) {
            console.error(`[KeymapperWorker] Exited with code ${code}`);
          }
        });

        this.worker.postMessage({
          command: 'start',
          payload: { deviceId, mappings },
        });

        console.log(`[KeymapperManager] Worker started for ${deviceId}`);
        return true;
      },
    );

    ipcMain.handle(IpcChannel.STOP_KEYMAPPER, () => {
      console.log('[KeymapperManager] Request to STOP keymapper');
      this.stop();
      return true;
    });

    ipcMain.handle(
      IpcChannel.LOAD_KEYMAP_PROFILE,
      async (_, name: string): Promise<KeyMappingProfile | null> => {
        const profilePath = path.join(PROFILES_DIR, `${name}.json`);
        console.log(`[KeymapperManager] Loading profile: ${profilePath}`);
        try {
          const data = await fs.readFile(profilePath, 'utf-8');
          return JSON.parse(data) as KeyMappingProfile;
        } catch (error) {
          console.warn(
            `[KeymapperManager] Profile not found or failed to read: ${name}.json`,
          );
          return []; // Devuelve un perfil vacío si no se encuentra
        }
      },
    );

    ipcMain.handle(
      IpcChannel.SAVE_KEYMAP_PROFILE,
      async (
        _,
        { name, mappings }: { name: string; mappings: KeyMappingProfile },
      ): Promise<boolean> => {
        const profilePath = path.join(PROFILES_DIR, `${name}.json`);
        console.log(`[KeymapperManager] Saving profile: ${profilePath}`);
        try {
          await fs.writeFile(profilePath, JSON.stringify(mappings, null, 2));
          return true;
        } catch (error) {
          console.error(
            `[KeymapperManager] Failed to save profile ${name}.json:`,
            error,
          );
          return false;
        }
      },
    );
  }

  public stop() {
    if (this.worker) {
      console.log(
        `[KeymapperManager] Terminating worker for device ${this.currentDeviceId}`,
      );
      this.worker.terminate();
      this.worker = null;
      this.currentDeviceId = null;
      console.log('[KeymapperManager] Worker terminated.');
    }
  }
}
