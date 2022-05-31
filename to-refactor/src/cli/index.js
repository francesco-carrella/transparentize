#!/usr/bin/env node

import { program } from 'commander';

import packageInfo from '../../package.json';
import { processFile, supportedImageFormat } from '../lib';
import { ensureOutputFile } from './utils/outputFilename';
import { ensureBgColor } from './utils/bgColor';
import handlers from './handlers';
import handleError from './handleError';
import { setupUi, exitWithError, chalk } from './ui';

function run() {
  program
    .name(packageInfo.name)
    .description(packageInfo.description)
    
  program
    .argument('<input_file>', `Image file to be 'transparentized'. Supported formats: ${supportedImageFormat.join(', ')}.`)
    .argument('[output]', 'Output path or file; if not specified `<input_file>-transparent.png` will be used.')
    // .option('-c, --color <color>', 'Background color to be used to calculate transparency. Can be a color name (like `black`, `cyan`, ...), hexadecimal color code (like `#fff`, `#FF0000`, ...), rgb(a) color code (like `rgb(80, 120, 160)`, `rgba(80, 120, 160, .5)`, ...) . Default: white.')
    .option('-b, --bgColor <color>', [
      'Background color to be used to calculate transparency.', 
      'Can be as a:',
      '- name, like `black`, `cyan`, `tomato` (see www.w3schools.com/colors/colors_names.asp)',
      '- hexadecimal, like `#000`, `#00FFFF`, `#FF6347`',
      '- rgb, like `rgb(0,0,0)`, `rgb(0,255,255)`, `rgb(255,99,71)`',
      '- hls, like `hsl(0,0%,0%)`, `hsl(180,100%,50%)`, `hsl(9,100%,64%)`',
      'Default: `white`.'
    ].join('\n'))
    .option('-r, --replace-input', 'Replace the input file with the transparetised version. Cannot be used with [output_file] argument.')
    .option('-o, --allow-override', 'Allow to override files without confirmation.')
    .option('-p, --page <page>', 'Specific for TIFF format. Specify the page number to be processed.', parseInt)
    .option('-n, --no-stdout-colors', 'Suppress colors and emoji on the messages/prompts.') // remove colors from the output using chalk: https://github.com/chalk/chalk#supportscolor
    .option('-q, --quiet', 'Suppress status messages logging.')
    .version(packageInfo.version, '-v, --version', 'Output the current version.')
    .helpOption('-h, --help', 'Display help for command.')


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

        if(options.bgColor) {
          options.bgColor = ensureBgColor(options.bgColor)
        }

        outputFile = await ensureOutputFile(inputFile, outputFile, options);

        await processFile(inputFile, outputFile, options);
      } catch(e) {
        handleError(e, options)
      }
    })

  program.parse()
}

run()