#!/usr/bin/env node

import { program } from 'commander';

import packageInfo from '../../package.json';
import handlers from './handlers';
import { processPng } from '../lib';

function run() {
  program
    .name(packageInfo.name)
    .description(packageInfo.description)
    .version(packageInfo.version);

  program
    .argument('<input_file>', 'png image file to make it transparent')
    .argument('[output_file]', 'output Png file; if not specified `<input_file>-transparent.png` will be used')
    // TODO: add output file override flag
    // TODO: add background color option
    // TODO: add quiet mode option

  program
    .action((inputFile, outputFile, cliOptions) => {
      const options = {
        ...cliOptions,
        ...handlers,
      };
      processPng(inputFile, outputFile, options);
    })

  program.parse()
}

run()