import { configManager } from '../../config/ConfigManager';

class HomeAssistantModule {
  private host: string;
  private token: string;

  constructor() {
    const iotConfig = configManager.getIotConfig();
    this.host = iotConfig.homeassistant.host;
    this.token = iotConfig.homeassistant.token;

    if (this.host && this.token) {
      console.log('[HomeAssistantModule] Módulo inicializado.');
    } else {
      console.log(
        '[HomeAssistantModule] Host o token no configurados. Módulo inactivo.',
      );
    }
  }

  // Ejemplo de una función que podría interactuar con la API de Home Assistant
  public async getStates() {
    if (!this.host || !this.token) return;

    try {
      const response = await fetch(`${this.host}/api/states`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('[HomeAssistantModule] Estados obtenidos:', data.length);
      return data;
    } catch (error) {
      console.error('[HomeAssistantModule] Error al obtener estados:', error);
    }
  }
}

export const homeAssistantModule = new HomeAssistantModule();
