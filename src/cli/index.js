#!/usr/bin/env node

import { program } from 'commander';

import packageInfo from '../../package.json';
import { processPng } from '../lib';
import handlers from './handlers';
import handleError from './handleError';
import { setupUi } from './ui';

function run() {
  program
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

  program
    .argument('<input_file>', 'png image file to make it transparent')
    .argument('[output_file]', 'output Png file; if not specified `<input_file>-transparent.png` will be used')
    // TODO: add output file override flag
    .option('-n, --no-colors', 'Suppress status messages colors and emoji') // remove colors from the output using chalk: https://github.com/chalk/chalk#supportscolor
    .option('-q, --quiet', 'Suppress status messages logging', false)
    // TODO: add background color option

  program
    .action(async (inputFile, outputFile, cliOptions) => {
      try {
        const options = {
          ...cliOptions,
          ...handlers,
        };
        setupUi(options);
        await processPng(inputFile, outputFile, options);
      } catch(e) {
        handleError(e)
      }
    })

  program.parse()
}

run()