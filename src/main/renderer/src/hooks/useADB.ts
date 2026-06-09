import { useEffect, useState } from "react"

export default function useADB() {

  const [devices, setDevices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const scan = async () => {
      const list = await (window as any).api.getDevices()
      setDevices(list || [])
      setLoading(false)
    }

    scan()

    const interval = setInterval(scan, 3000)

    return () => clearInterval(interval)

  }, [])

  return { devices, loading }
}