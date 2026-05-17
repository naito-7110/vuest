import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  test: {
    projects: [
      {
        plugins: [vue()],
        test: {
          name: 'unit',
          environment: 'happy-dom',
          include: ['packages/**/*.test.ts'],
        },
      },
    ],
  },
})
