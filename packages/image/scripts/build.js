import { generateEsbuildConfig, build } from '@transparentize/common/esbuild/index.js'

import packageInfo from '../package.json' assert {type: "json"}

const config = generateEsbuildConfig(packageInfo)

build(config)