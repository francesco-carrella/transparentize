#!/usr/bin/env node

import { program } from 'commander';

import packageInfo from '../../package.json';
import { processPng } from '../lib';
import handlers from './handlers';
import handleError from './handleError';
import { setupUi, exitWithError } from './ui';

function run() {
  program
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

  program
    .argument('<input_file>', 'png image file to make it transparent')
    .argument('[output_file]', 'output Png file; if not specified `<input_file>-transparent.png` will be used')
    .option('-n, --no-colors', 'Suppress status messages colors and emoji') // remove colors from the output using chalk: https://github.com/chalk/chalk#supportscolor
    .option('-q, --quiet', 'Suppress status messages logging', false)
    .option('-o, --override-input', 'Override input file with the transparetised version. Incompatible with [output_file] argument.')
    .option('-y, --allow-override', 'Override existing files without further confirmation.')
    // TODO: add background color option

  program
    .action(async (inputFile, outputFile, cliOptions) => {
      const options = {
        ...cliOptions,
        ...handlers,
      }
      try {
        setupUi(options);

        if(cliOptions.overrideInput) {
          if(outputFile) {
            exitWithError('Incompatible arguments: [output_file] and -o/--override-input');
          }
          outputFile = inputFile;
        }

        await processPng(inputFile, outputFile, options);
      } catch(e) {
        handleError(e, options)
      }
    })

  program.parse()
}

run()