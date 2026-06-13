import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function DeviceCard({ device }: any) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaSource = new MediaSource();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener('sourceopen', () => {
      const sourceBuffer = mediaSource.addSourceBuffer(
        'video/mp4; codecs="avc1.42E01E"',
      );

      window.api.scrcpyH264(device.id);

      window.api.onH264((_: any, data: any) => {
        if (data.id !== device.id) return;
        const chunk = Uint8Array.from(atob(data.data), (c) => c.charCodeAt(0));
        if (!sourceBuffer.updating) {
          sourceBuffer.appendBuffer(chunk);
        }
      });
    });

    window.api.scrcpyAudio(device.id);

    window.api.onAudio((_: any, data: any) => {
      const audio = new Audio('data:audio/wav;base64,' + data);
      audio.play();
    });
  }, []);

  return (
    <div className="border p-2 bg-black text-cyan-400">
      <p className="text-xs truncate">{device.id}</p>
      <p className="text-xs font-bold">{device.model}</p>

      <video ref={videoRef} autoPlay muted className="w-full h-36 my-2" />

      {/* Security Info */}
      <div className="text-xs grid grid-cols-3 gap-1 mb-2">
        <span
          className={device.security?.root ? 'text-red-500' : 'text-green-500'}
        >
          Root: {device.security?.root ? t('yes') : t('no')}
        </span>
        <span title={device.security?.knox}>
          Knox: {device.security?.knox === '0x0' ? 'OK' : 'Void'}
        </span>
        <span>MDM: {device.security?.mdm}</span>
      </div>

      <div className="flex gap-1 mt-2 text-xs">
        <button onClick={() => window.api.volumeUp(device.id)}>VOL+</button>
        <button onClick={() => window.api.volumeDown(device.id)}>VOL-</button>
        <button onClick={() => window.api.power(device.id)}>PWR</button>
        <button onClick={() => window.api.home(device.id)}>HOME</button>
        <button onClick={() => window.api.back(device.id)}>BACK</button>
      </div>
    </div>
  );
}
