import { defineConfig } from 'rolldown'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  input: 'src/index.ts',
  plugins: [vue()],
})
