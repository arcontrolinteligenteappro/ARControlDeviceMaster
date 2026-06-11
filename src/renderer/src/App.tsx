// src/renderer/src/App.tsx
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next' // Import useTranslation
import SplashScreen from './components/SplashScreen'
import ActiveControlGrid from './components/ActiveControlGrid'
import bgSinDispositivos from './assets/bg_sindispositivos.png'
import { useSync } from './hooks/useSync'

export default function App() {
  const { t } = useTranslation() // Initialize the translation hook
  const [showSplash, setShowSplash] = useState(true)
  
  // State for devices detected locally by Electron's main process
  const [localDevices, setLocalDevices] = useState([]) 
  
  // Hook for Mobile Synergy. Provides device list from the SyncServer.
  const { devices: mobileDevices, isMobile } = useSync();
  
  // The definitive list of devices depends on the environment (Electron vs Browser)
  const devices = isMobile ? mobileDevices : localDevices;

  if (showSplash) return <SplashScreen onFinish={() => setShowSplash(false)} />

  return (
    <div className="w-screen h-screen bg-[#02050A] text-white font-mono flex flex-col">
      {devices.length === 0 ? (
        // MODO ESPERA: No devices connected, show status panel
        <div 
          className="flex-1 w-full h-full bg-cover bg-center bg-no-repeat flex flex-col relative"
          style={{ backgroundImage: `url(${bgSinDispositivos})` }}
        >
          <div className="absolute top-4 left-4 border border-cyan-900/50 bg-black/80 p-3 text-[9px] flex flex-col gap-1 tracking-widest z-20 backdrop-blur-md">
            <p>{t('adbService')}: <span className="text-green-400 animate-pulse">{t('online')}</span></p>
            <p>{t('usbListener')}: <span className="text-green-400">{t('active')}</span></p>
            {isMobile ? (
              <p>{t('syncBridge')}: <span className="text-cyan-400 animate-pulse">{t('connected')}</span></p>
            ) : (
              <p>{t('tcpIp')}: <span className="text-cyan-400">{t('discovery')}</span></p>
            )}
          </div>
        </div>
      ) : (
        // MODO ACTIVO: Devices are connected, show the tactical grid
        <ActiveControlGrid devices={devices} />
      )}
    </div>
  )
}
