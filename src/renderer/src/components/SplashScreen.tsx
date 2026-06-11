// src/renderer/src/components/SplashScreen.tsx
import video from '../assets/animacion.mp4'

type Props = {
  onFinish: () => void
}

export default function SplashScreen({ onFinish }: Props) {
  return (
    <div className="w-full h-screen bg-black">
      <video
        src={video}
        autoPlay
        muted
        onEnded={onFinish}
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-4 right-4">
        <button
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          onClick={onFinish}
        >
          [ OVERRIDE ]
        </button>
      </div>
    </div>
  )
}