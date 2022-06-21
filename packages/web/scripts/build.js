import htmlPlugin from '@chialab/esbuild-plugin-html'

import { generateEsbuildConfig, build } from '@transparentize/common/esbuild/index.js'

import packageInfo from '../package.json' assert {type: "json"}

const args = process.argv.slice(2)
const isDev = args.includes('--dev')

let config = generateEsbuildConfig(packageInfo)

config.assetNames = 'assets/[name]-[hash]'
config.chunkNames = '[ext]/[name]'

config.define = {
  IS_DEV: isDev,
  ...config.define || {},
}

config.plugins = [
  htmlPlugin(),
  ...config.plugins || [],
]

build(config)