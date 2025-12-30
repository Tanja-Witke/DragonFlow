import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const repoBase = process.env.GITHUB_REPOSITORY?.split('/')[1] || 'DragonFlow';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? `/${repoBase}/` : '/',
  plugins: [
    vue(), 
    tailwindcss(),
  ],
})
