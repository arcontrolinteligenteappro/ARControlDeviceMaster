// src/main/ipc.ts

// --- Tipos de datos compartidos ---

/**
 * Representa un único mapeo de una tecla a una coordenada en la pantalla.
 */
export interface KeyMapping {
  key: string; // Ej: 'w', 'space', 'f1'
  x: number;
  y: number;
}

/**
 * Representa un perfil de mapeo de teclas, que es un array de mapeos individuales.
 */
export type KeyMappingProfile = KeyMapping[];

// --- Canales y Eventos IPC ---

// Canales de comunicación para invocar desde el renderer al main y esperar una respuesta
export const enum IpcChannel {
  GET_APP_STATE = 'get-app-state',
  LIST_DEVICES = 'list-devices',
  START_SCRCPY = 'start-scrcpy',
  STOP_SCRCPY = 'stop-scrcpy',
  REBOOT_DEVICE = 'reboot-device',
  START_FORENSIC_DUMP = 'start-forensic-dump',
  START_KEYMAPPER = 'start-keymapper',
  STOP_KEYMAPPER = 'stop-keymapper',
  INSTALL_APK = 'install-apk',

  // Canales para perfiles de Keymapper
  LOAD_KEYMAP_PROFILE = 'load-keymap-profile',
  SAVE_KEYMAP_PROFILE = 'save-keymap-profile',

  // Canal especial para el diálogo de archivos
  OPEN_FILE_DIALOG_APK = 'open-file-dialog-for-apk',
}

// Canales de comunicación para enviar eventos desde el main al renderer (sin esperar respuesta)
export const enum IpcEvent {
  APP_STATE_CHANGED = 'app-state-changed',
  DEVICES_LIST_UPDATED = 'devices-list-updated',
  SCRCPY_SESSION_STARTED = 'scrcpy-session-started',
  SCRCPY_SESSION_ENDED = 'scrcpy-session-ended',
  TERMINAL_OUTPUT = 'terminal-output',
  FORENSIC_PROGRESS = 'forensic-progress',
}
