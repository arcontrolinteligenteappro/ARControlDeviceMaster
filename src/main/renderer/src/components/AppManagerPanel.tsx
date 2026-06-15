export const AppManagerPanel: React.FC<AppManagerPanelProps> = ({
  deviceId,
  onBack,
}) => {
  // ... (toda tu lógica de estados y funciones handle se mantiene igual)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>
            GESTOR DE APLICACIONES E INYECTOR APK
          </h2>
          <span className={styles.deviceInfo}>DISPOSITIVO: {deviceId}</span>
        </div>
        <button onClick={onBack} className={styles.backButton}>
          VOLVER
        </button>
      </div>

      <div className={styles.injectorWrapper}>
        <div className={styles.injectorSection}>
          <h4 className={styles.injectTitle}>
            INYECCIÓN DIRECTA DE ARCHIVO APK
          </h4>
          <form onSubmit={handleInstall} className={styles.injectForm}>
            <input
              type="text"
              placeholder="Ruta física absoluta del archivo"
              value={apkPath}
              onChange={(e) => setApkPath(e.target.value)}
              className={styles.inputPath}
            />
            <button
              type="submit"
              disabled={isProcessing}
              className={styles.installBtn}
            >
              INSTALAR
            </button>
          </form>
        </div>
      </div>

      {statusMsg && (
        <div className={styles.statusBox}>
          [ESTADO TRANSMISIÓN]: {statusMsg}
        </div>
      )}

      <div className={styles.pkgContainer}>
        <div className={styles.filterBar}>
          <button
            onClick={() => setFilter('third-party')}
            className={
              filter === 'third-party' ? styles.installBtn : styles.backButton
            }
          >
            TERCEROS
          </button>
          <button
            onClick={() => setFilter('system')}
            className={
              filter === 'system' ? styles.purgeBtn : styles.backButton
            }
          >
            SISTEMA (DEBLOAT)
          </button>
          <button
            onClick={() => setFilter('all')}
            className={styles.backButton}
          >
            TODOS
          </button>
        </div>

        <div className={styles.pkgList}>
          {packages.length === 0 ? (
            <div className={styles.loadingText}>
              LEYENDO TABLA DE PAQUETES...
            </div>
          ) : (
            packages.map((pkg) => (
              <div key={pkg} className={styles.pkgItem}>
                <span className={styles.pkgLabel}>{pkg}</span>
                {filter === 'system' && (
                  <button
                    onClick={() => handleDebloat(pkg)}
                    className={styles.purgeBtn}
                  >
                    FORZAR PURGA
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
