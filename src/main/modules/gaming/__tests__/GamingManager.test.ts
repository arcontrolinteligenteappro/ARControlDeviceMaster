import { vol } from 'memfs';
import path from 'path';
import { GamingManager } from '../GamingManager';

const mockFs = {
  mkdir: jest.fn(() => Promise.resolve()),
  writeFile: jest.fn(() => Promise.resolve()),
  readFile: jest.fn((path: any) => vol.promises.readFile(path)),
  readdir: jest.fn((path: any) => vol.promises.readdir(path)),
};

jest.doMock('fs/promises', () => mockFs);

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn((name) => `/${name}`),
  },
}));

describe('GamingManager', () => {
  let gamingManager: GamingManager;
  const profilesDir = '/userData/keymap_profiles';

  beforeEach(async () => {
    vol.reset();
    jest.clearAllMocks();

    await jest.isolateModulesAsync(async () => {
      const { gamingManager: newManager } = await import('../GamingManager');
      gamingManager = newManager;
      await gamingManager.init();
    });

    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('should save a keymap profile correctly', async () => {
    const profile = { name: 'test-profile', mappings: [{ key: 'a', x: 1, y: 2, type: 'tap' }] };
    const result = await gamingManager.saveProfile(profile.name, profile.mappings);
    expect(result).toBe(true);
    expect(mockFs.writeFile).toHaveBeenCalledWith(
      path.join(profilesDir, 'test-profile.json'),
      JSON.stringify(profile.mappings, null, 2)
    );
  });

  it('should not save a profile with an invalid name', async () => {
    const result = await gamingManager.saveProfile('invalid/name', []);
    expect(result).toBe(false);
    expect(mockFs.writeFile).not.toHaveBeenCalled();
  });

  it('should list all available profiles', async () => {
    vol.fromJSON({ 'profile1.json': '', 'profile2.json': '' }, profilesDir);
    const profiles = await gamingManager.listProfiles();
    expect(profiles).toContain('profile1');
    expect(profiles).toContain('profile2');
  });

  it('should load a keymap profile', async () => {
    const mappings = [{ key: 'b', x: 3, y: 4, type: 'swipe' }];
    vol.fromJSON({ 'load-test.json': JSON.stringify(mappings) }, profilesDir);
    const loadedMappings = await gamingManager.loadProfile('load-test');
    expect(loadedMappings).toEqual(mappings);
  });

  it('should return null when loading a non-existent profile', async () => {
    const result = await gamingManager.loadProfile('non-existent');
    expect(result).toBeNull();
  });

  it('should return an empty array if listing profiles fails', async () => {
    mockFs.readdir.mockRejectedValue(new Error('ENOENT'));
    const profiles = await gamingManager.listProfiles();
    expect(profiles).toEqual([]);
  });
});
