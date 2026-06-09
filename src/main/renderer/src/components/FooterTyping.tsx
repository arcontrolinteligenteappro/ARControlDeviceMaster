import { useEffect, useState } from "react"

const TEXT = "Elaborado Por ChrisRey91  /  www.arcontrolinteligente.com"

export default function FooterTyping() {

  const [index, setIndex] = useState(0)
  const [mode, setMode] = useState("write")

  useEffect(() => {

    const interval = setInterval(() => {

      if (mode === "write") {
        setIndex((i) => {
          if (i >= TEXT.length) {
            setTimeout(() => setMode("delete"), 20000)
            return i
          }
          return i + 1
        })
      }

      if (mode === "delete") {
        setIndex((i) => {
          if (i <= 0) {
            setMode("write")
            return 0
          }
          return i - 1
        })
      }

    }, 80)

    return () => clearInterval(interval)

  }, [mode])

  return (
    <div className="fixed bottom-0 w-full text-center py-2 border-t border-cyan-500 bg-black text-green-400 text-sm">
      {TEXT.slice(0, index)}
    </div>
  )
}