/* eslint-disable no-console */

import filesize from 'filesize'
import path from 'path'
import Time from 'time-diff'
import chalk from 'chalk'

function formatFileName(file) {
  const { dir, base } = path.parse(file)
  return [dir, path.sep, chalk.bold(base)].join('')
}

function formatFileSize(size) {
  return chalk.cyan(filesize(size, { base: 2 }))
}

// function formatElapsedTime(ms) {
//   return chalk.cyan(ms)
// }

const esbuildPluginBuildSummary = {
  name: 'build-summary',
  setup(build) {
    let time = new Time()
    build.onStart(() => {
      time.start('build')
      const { globalName } = build.initialOptions
      console.log('')
      console.log(`🔨 Building package${globalName ? ': ' + chalk.bold(build.initialOptions.globalName) : '...'}\n`)
    })
    build.onEnd((result) => {
      Object.keys(result.metafile?.outputs || []).forEach((output) => {
        const fileName = formatFileName(output)
        const fileSize = formatFileSize(result.metafile.outputs[output].bytes)
        console.log(`   ${fileName}  ${fileSize}`)
      })
      console.log('')
      // console.log('  ⚡️ in', formatElapsedTime(time.end('build')))
      if (build.initialOptions.watch) {
        console.log('')
        console.log('🔎 Continue watching...')
      }
    })
  },
}

export default esbuildPluginBuildSummary