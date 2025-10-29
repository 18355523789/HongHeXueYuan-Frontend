import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 3000,
        host: '0.0.0.0'
    },
    define: {
        'import.meta.env.VITE_BASE_API_URL': JSON.stringify('http://localhost:8080/api')
    }
})