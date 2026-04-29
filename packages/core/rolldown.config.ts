import { defineConfig } from 'rolldown'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  input: 'src/index.ts',
  plugins: [Vue()],
})
