import * as url from 'url';
import path from 'path'
import htmlPlugin from '@chialab/esbuild-plugin-html'

import { generateEsbuildConfig, build } from '@transparentize/common/esbuild/index.js'

import packageInfo from '../package.json' assert {type: "json"}

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const args = process.argv.slice(2)
const isDev = args.includes('--dev')

let config = generateEsbuildConfig(packageInfo)

config.assetNames = 'assets/[name]-[hash]'
config.chunkNames = '[ext]/[name]'

config.inject = [
  path.join(__dirname, 'build-buffer-shim.js')
]

config.define = {
  IS_DEV: isDev,
  ...config.define || {},
}

config.plugins = [
  htmlPlugin(),
  ...config.plugins || [],
]

build(config)