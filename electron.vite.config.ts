import { defineConfig } from "electron-vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({

  main: {
    entry: "src/main/index.ts",
  },

  preload: {
    input: {
      preload: path.join(__dirname, "src/preload/index.ts")
    }
  },

  renderer: {
    root: path.join(__dirname, "src/main/renderer"),
    plugins: [react()],
    build: {
      rollupOptions: {
        input: path.join(__dirname, "src/main/renderer/index.html")
      }
    }
  }

})import { defineConfig } from "electron-vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({

  main: {
    build: {
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, "src/main/index.ts")
        }
      }
    }
  },

  preload: {
    build: {
      rollupOptions: {
        input: {
          preload: path.resolve(__dirname, "src/preload/index.ts")
        }
      }
    }
  },

  renderer: {
    root: path.resolve(__dirname, "src/main/renderer"),
    plugins: [react()],
    build: {
      rollupOptions: {
        input: path.resolve(__dirname, "src/main/renderer/index.html")
      }
    }
  }

})