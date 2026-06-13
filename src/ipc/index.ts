export enum IpcChannel {
  // Canales relacionados con ADB y dispositivos
  LIST_DEVICES = 'list-devices',
  DEVICE_STATUS = 'device-status',
  CONNECT_DEVICE = 'connect-device',
  DISCONNECT_DEVICE = 'disconnect-device',

  // Canales para el modo de juego y mapeo de teclas
  START_GAMING_MODE = 'start-gaming-mode',
  STOP_GAMING_MODE = 'stop-gaming-mode',
  SAVE_KEYMAP_PROFILE = 'save-keymap-profile',
  LOAD_KEYMAP_PROFILE = 'load-keymap-profile',
  LIST_KEYMAP_PROFILES = 'list-keymap-profiles',
  START_KEYMAPPER = 'start-keymapper',
  STOP_KEYMAPPER = 'stop-keymapper',
  GAMING_INPUT = 'gaming-input', // Para enviar eventos de teclado/ratón al backend

  // Canales para Scrcpy
  START_SCRCPY = 'start-scrcpy',
  STOP_SCRCPY = 'stop-scrcpy',
  SCRCPY_OUTPUT = 'scrcpy-output', // Para transmitir el feedback de Scrcpy

  // Canales generales
  SHOW_ERROR_DIALOG = 'show-error-dialog',
}
