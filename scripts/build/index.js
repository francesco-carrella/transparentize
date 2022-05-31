/* eslint-disable no-console */

import { build } from 'esbuild'
import { Command, Option } from 'commander'
import chalk from 'chalk'

import { PackageArgument } from '../commander.js'
import { defaultBuilderOptions } from './config.js'

async function defaultBuilder(cliOptions) {
  return await build(defaultBuilderOptions(cliOptions))
}

const customBuilders = {
  // 'my-package': async (cliOptions) => {
  //   return await build({
  //     ...defaultBuilderOptions(cliOptions),
  //     myOtherSpecialCongif: true,
  //   })
  // }
}

function run() {
  const program = new Command()

  program
    .addArgument(
      new PackageArgument('[package...]', 'the packages to build')
        .filterPackages(['common'])
        .default('all', '"all"')
    )
    .addOption(
      new Option('-e, --env', 'the environment to build for', 'production')
        .default('production', 'production')
        .choices(['production', 'development'])
    )
    .addOption(
      new Option('-w, --watch', 'continue watching and rebuild at any change of the source code')
    )
    .action(async (packagesToBuild, cliOptions) => {
      console.log([
        'Building the following',
        `${packagesToBuild.length > 1 ? 'packages' : 'package'}:`,
        packagesToBuild.map((file) => { return chalk.bold(file) }).join(', ')
      ].join(' '))

      await Promise.all(packagesToBuild.map((name) => {
        const builder = customBuilders[name] || defaultBuilder
        return builder({ ...cliOptions, packageName: name })
      }))
    })

  program.parse()
}

run()