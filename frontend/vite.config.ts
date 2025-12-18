/// <reference types="vitest" />
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    exclude: [
      ...configDefaults.exclude, 
      '**/e2e/**'
    ],
  },
})