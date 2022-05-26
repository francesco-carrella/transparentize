#!/usr/bin/env node

import { program } from 'commander';

import packageInfo from '../../package.json';
import { processPng } from '../lib';
import { ensureOutputFile } from './utils/outputFilename';
import handlers from './handlers';
import handleError from './handleError';
import { setupUi, exitWithError, chalk } from './ui';

function run() {
  program
    .name(packageInfo.name)
    .description(packageInfo.description)
    
  program
    .argument('<input_file>', 'Png image file to make it transparent.')
    .argument('[output]', 'Output path or file; if not specified `<input_file>-transparent.png` will be used.')
    .option('-r, --replace-input', 'Replace the input file with the transparetised version. Incompatible with [output_file] argument.')
    .option('-o, --allow-override', 'Override existing files without further confirmation.')
    .option('-n, --no-colors', 'Suppress status messages colors and emoji.') // remove colors from the output using chalk: https://github.com/chalk/chalk#supportscolor
    .option('-q, --quiet', 'Suppress status messages logging.')
    .version(packageInfo.version, '-v, --version', 'Output the current version.')
    .helpOption('-h, --help', 'Display help for command.')
    // TODO: add background color option

  program
    .action(async (inputFile, outputFile, cliOptions) => {
      const options = {
        ...cliOptions,
        ...handlers,
      }
      try {
        setupUi(options);

        if(cliOptions.replaceInput && outputFile) {
          exitWithError(`Incompatible arguments: ${chalk.underline('output_file')} and ${chalk.underline('-o')}/${chalk.underline('--override-input')}`);
        }

        outputFile = await ensureOutputFile(inputFile, outputFile, options);

        await processPng(inputFile, outputFile, options);
      } catch(e) {
        handleError(e, options)
      }
    })

  program.parse()
}

run()