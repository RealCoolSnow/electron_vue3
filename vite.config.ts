/**
 * 参考链接: https://github.com/vitejs/vite/blob/master/src/node/config.ts
 */
import path from 'path'
import { createMockServer } from 'vite-plugin-mock'
import { UserConfig } from 'vite'
import dotenv from 'dotenv'
import rollupResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

dotenv.config({ path: path.join(__dirname, '.env') })
const renderDir = 'src/render'

const config: UserConfig = {
  root: path.join(__dirname, renderDir),
  port: +process.env.PORT,
  outDir: path.join(__dirname, 'dist/render'),
  alias: {
    '/@/': path.resolve(__dirname, renderDir),
  },
  optimizeDeps: {
    // 这里不加也没事，用 require 的形式就能避开 import 被编译成 /@modules/fs?import
    // allowNodeBuiltins: ['electron-is-dev', 'electron-store', 'electron']
  },
  plugins: [
    createMockServer({
      mockPath: 'mock',
      watchFiles: true,
      localEnabled: process.env.NODE_ENV === 'development',
    }),
  ],
  rollupInputOptions: {
    external: [
      'crypto',
      'assert',
      'fs',
      'util',
      'os',
      'events',
      'child_process',
      'http',
      'https',
      'path',
      'electron',
    ],
    plugins: [
      rollupResolve({ browser: true }),
      commonjs(),
      {
        name: '@rollup/plugin-cjs2esm',
        transform(code, filename) {
          if (filename.includes('/node_modules/')) return code
          const cjsRegexp = /(const|let|var)[\n\s]+(\w+)[\n\s]*=[\n\s]*require\(["|'](.+)["|']\)/g
          const res = code.match(cjsRegexp)
          if (res) {
            // const Store = require('electron-store') -> import Store from 'electron-store'
            // eslint-disable-next-line quotes
            code = code.replace(cjsRegexp, `import $2 from '$3'`)
          }
          return code
        },
      },
    ],
  },
  rollupOutputOptions: {
    format: 'commonjs',
  },
}

export default config
