import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  outDir: 'out',
  format: ['cjs'],
  shims: false,
  dts: false,
  external: [
    'vscode',
  ],
})
