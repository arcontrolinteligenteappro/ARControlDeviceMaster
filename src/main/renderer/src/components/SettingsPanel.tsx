import React from 'react';

export default function SettingsPanel() {
  const handleExport = async () => {
    const path = prompt('Ruta destino (ej: C:/backup/config.json)');
    if (!path) return;

    await window.api.exportConfig(path);
    alert('Configuración exportada');
  };

  const handleImport = async () => {
    const path = prompt('Ruta del archivo a importar');
    if (!path) return;

    await window.api.importConfig(path);
    alert('Configuración importada');
  };

  return (
    <div className="p-4 border border-cyan-500 text-cyan-400">
      <h2 className="mb-2">CONFIGURACIÓN</h2>

      <button onClick={handleExport}>Exportar Config</button>
      <button onClick={handleImport}>Importar Config</button>
    </div>
  );
}
