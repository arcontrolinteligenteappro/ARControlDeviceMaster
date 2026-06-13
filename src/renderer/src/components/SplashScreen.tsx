// src/renderer/src/components/SplashScreen.tsx
import { useEffect, useRef } from 'react';

type Props = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleVideoEnd = () => {
        onFinish();
      };

      video.addEventListener('ended', handleVideoEnd);

      // In case the video is paused by the user or other interruptions
      const handlePlay = () => {
        video.play().catch((error) => {
          console.error('Video play failed:', error);
          // If autoplay fails, fallback to finishing the splash screen
          onFinish();
        });
      };

      handlePlay();

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    } else {
      // Fallback if the video element is not available
      const timer = setTimeout(() => {
        onFinish();
      }, 3000); // Default timeout if video fails
      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src="./resources/introcompleto.mp4"
        className="w-full h-full object-cover"
        playsInline
        muted // Muted is often necessary for autoplay to work in browsers
      />
    </div>
  );
}
