// src/main/workers/telemetry.worker.ts
import { parentPort, workerData } from 'worker_threads';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const { deviceId } = workerData;

const POLL_INTERVAL = 2000; // 2 seconds

interface TelemetryData {
  cpu: { usage: number | null };
  ram: { free: number | null; total: number | null };
  battery: { level: number | null; voltage: number | null; status: string };
  temp: number | null;
}

async function getDeviceTelemetry(id: string): Promise<TelemetryData> {
  const data: TelemetryData = {
    cpu: { usage: null },
    ram: { free: null, total: null },
    battery: { level: null, voltage: null, status: 'Unknown' },
    temp: null,
  };

  try {
    // Get Battery Info
    const { stdout: batteryOutput } = await execAsync(
      `adb -s ${id} shell dumpsys battery`,
    );
    const levelMatch = batteryOutput.match(/level: (\d+)/);
    const voltageMatch = batteryOutput.match(/voltage: (\d+)/);
    const statusMatch = batteryOutput.match(/status: (\d+)/);

    if (levelMatch) data.battery.level = parseInt(levelMatch[1], 10);
    if (voltageMatch) data.battery.voltage = parseInt(voltageMatch[1], 10);
    if (statusMatch) {
      const statusMap = [
        'Unknown',
        'Charging',
        'Discharging',
        'Not charging',
        'Full',
      ];
      data.battery.status =
        statusMap[parseInt(statusMatch[1], 10) - 1] || 'Unknown';
    }
  } catch (e) {
    /* Ignore */
  }

  try {
    // Get CPU & RAM Info (top is a bit heavy, but gives both)
    const { stdout: topOutput } = await execAsync(
      `adb -s ${id} shell top -n 1`,
    );
    const lines = topOutput.split('\n');
    const memLine = lines.find((line) => line.includes('Mem'));
    const cpuLine = lines.find((line) => line.includes('CPU'));
    if (memLine) {
      const parts = memLine.split(/\s+/).filter(Boolean);
      data.ram.total = parseInt(parts[1].replace('K', ''), 10);
      data.ram.free = parseInt(parts[3].replace('K', ''), 10);
    }
    if (cpuLine) {
      const cpuParts = cpuLine.split(/\s+/).filter(Boolean);
      const idle = parseFloat(cpuParts[4]);
      data.cpu.usage = 100 - idle;
    }
  } catch (e) {
    /* Ignore */
  }

  try {
    // Get Temperature
    const { stdout: tempOutput } = await execAsync(
      `adb -s ${id} shell cat /sys/class/thermal/thermal_zone0/temp`,
    );
    const tempValue = parseFloat(tempOutput);
    if (!isNaN(tempValue)) {
      data.temp = tempValue / 1000.0; // The value is in milli-Celsius
    }
  } catch (e) {
    /* Ignore */
  }

  return data;
}

async function startPolling() {
  if (!parentPort) return;

  setInterval(async () => {
    const telemetry = await getDeviceTelemetry(deviceId);
    parentPort.postMessage(telemetry);
  }, POLL_INTERVAL);
}

startPolling();
