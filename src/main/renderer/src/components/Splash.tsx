import React from 'react';

export default function Splash({ onFinish }: any) {
  return (
    <div className="h-screen w-full relative bg-black">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src="/intro.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-[#02050A]/60" />

      <button
        onClick={onFinish}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 border border-cyan-400 px-6 py-2 text-cyan-400"
        title="override"
        aria-label="override"
      >
        [ OVERRIDE ]
      </button>
    </div>
  );
}
