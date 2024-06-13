import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({command,mode})=>{
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: { port: env.VITE_PORT },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
