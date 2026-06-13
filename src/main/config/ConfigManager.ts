import * as fs from 'fs';
import * as path from 'path';

// Tipos para la configuración de IoT
interface TuyaConfig {
  accessId: string;
  accessKey: string;
  secret: string;
  region: string;
}

interface SmartThingsConfig {
  apiKey: string;
}

interface HomeAssistantConfig {
  host: string;
  token: string;
}

interface IoTConfig {
  tuya: TuyaConfig;
  smartthings: SmartThingsConfig;
  yeelight: {};
  homeassistant: HomeAssistantConfig;
}

interface AppConfig {
  iot: IoTConfig;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    const configPath = path.join(process.cwd(), 'config.json');
    try {
      const rawConfig = fs.readFileSync(configPath, 'utf-8');
      this.config = JSON.parse(rawConfig) as AppConfig;
      console.log('[ConfigManager] Configuración cargada correctamente.');
    } catch (error) {
      console.error(
        '[ConfigManager] Error al leer o parsear config.json:',
        error,
      );
      this.config = {
        iot: {
          tuya: { accessId: '', accessKey: '', secret: '', region: '' },
          smartthings: { apiKey: '' },
          yeelight: {},
          homeassistant: { host: '', token: '' },
        },
      };
    }
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getIotConfig(): IoTConfig {
    return this.config.iot;
  }
}

export const configManager = ConfigManager.getInstance();
