#!/usr/bin/env node 

import { program } from 'commander';

import packageInfo from '../package.json';
import main from './main';

program
  .name(packageInfo.name)
  .description(packageInfo.description)
  .version(packageInfo.version);

  program
  .argument('<input_file>', 'png image file to make it transparent')
  .argument('[output_file]', 'output Png file; if not specified `<input_file>-transparent.png` will be used')
  // TODO: add output override flag
  // TODO: add background color option
  .action(main)


program.parse()