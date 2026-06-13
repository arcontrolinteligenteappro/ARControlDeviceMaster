// src/main/modules/bridge/SyncServer.ts
import express from 'express';
import { createServer, Server as HttpServer } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { join } from 'path';
import { BrowserWindow } from 'electron';

// Interfaz de Telemetría (debe ser idéntica a la del DeviceManager)
type DeviceType =
  | 'Smartphone'
  | 'Tablet'
  | 'Android TV'
  | 'FireOS'
  | 'VR'
  | 'Unknown';
interface MonitoredDevice {
  id: string;
  type: DeviceType;
  model: string;
  brand: string;
  android: string;
  root: boolean;
  knox: string;
  mdm: string;
  connection: 'USB' | 'WiFi';
}

export class SyncServer {
  private app: express.Application;
  private httpServer: HttpServer;
  private io: SocketIoServer;
  private mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.app = express();
    this.httpServer = createServer(this.app);
    this.io = new SocketIoServer(this.httpServer, {
      cors: {
        origin: '*', // Permitir cualquier origen para la conexión de la Tablet
        methods: ['GET', 'POST'],
      },
    });

    // Servir la carpeta de la interfaz de renderer como estática.
    const rendererBuildPath = join(__dirname, '../../../renderer');
    this.app.use(express.static(rendererBuildPath));

    // Fallback a index.html para Single Page Application (React)
    this.app.get('*', (req, res) => {
      res.sendFile(join(rendererBuildPath, 'index.html'));
    });

    this.httpServer.listen(3000, () => {
      console.log(
        '[SyncServer] Bridge para Sinergia Móvil escuchando en puerto 3000',
      );
    });

    this.io.on('connection', (socket: Socket) => {
      console.log(`[SyncServer] Cliente Móvil Conectado: ${socket.id}`);
      socket.on('disconnect', () => {
        console.log(`[SyncServer] Cliente Móvil Desconectado: ${socket.id}`);
      });
    });
  }

  /**
   * Emite la telemetría a todas las Tablets conectadas y al proceso de renderizado principal.
   * @param data Array de dispositivos monitoreados.
   */
  public broadcastTelemetry(data: MonitoredDevice[]): void {
    // Broadcast to mobile clients
    this.io.emit('telemetry-update', data);

    // Send to the main Electron window (renderer process)
    if (this.mainWindow) {
      this.mainWindow.webContents.send('telemetry-update', data);
    }
  }
}
