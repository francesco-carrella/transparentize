import packageInfo from '../../package.json';
import { callIfExists } from '../utils/generic';
import { showMessage, showConfirm, showProgressBar, exitWithError } from './ui';

let progressBar

const handlers = {
  onInputFileNotFoundError: (inputFile, options) => {
    exitWithError(`The input file '${inputFile}' does not exists. Please check the <input_file> argument and retry.`);
  },
  onInputFileNotValidError: (inputFile, options) => {
    exitWithError(`The input file '${inputFile}' does not seem to be a valid PNG file. Please check the <input_file> argument and retry.`);
  },
  onOutputFileExists: async (outputFile, options) => {
    const overrideOutputFile = await showConfirm(`The output file '${outputFile}' already exists. Do you want to overwrite it?`);
    if(!overrideOutputFile) {
      callIfExists(options.onOutputFileExistsError, outputFile, options);
    }
  },
  onOutputFileExistsError: (outputFile, options) => {
    exitWithError(`The output file '${outputFile}' already exists. Please check the <output_file> argument and retry.`);
  },
  // onPngProcessStart: (inputFile, outputFile, options) => {},
  // onPngProcessEnd: (inputFile, outputFile, options) => {},
  onPngProcessError: (e, inputFile, outputFile, options) => {
    exitWithError(`Impossible to read the input file '${inputFile}'. Please check the <input_file> argument and retry.`, e); 
  },
  onImageProcessStart: (image, options) => {
    showMessage(`Processing image...`);
    progressBar = showProgressBar(image.width * image.height)
  },
  // onImageProcessEnd: (image, options) => {},
  onImageProcessError: (error, options, e) => {
    exitWithError(`An error occurred while processing the image. Please report the issue at ${packageInfo.author.email}`, e);
  },
  // onPixelProcessStart: (image, x, y, options) => {},
  onPixelProcessEnd: (image, x, y, options) => {
    progressBar.tick();
  },
  // onWriteOutputFileStart: (outputFile, options) => {},
  onWriteOutputFileEnd: (outputFile, options) => {
    showMessage(`Image processed successfully. The output file is '${outputFile}'.`);
  },
  onWriteOutputFileError: (outputFile, options, e) => {
    exitWithError(`Impossible to write the output file '${outputFile}'. Please check the <output_file> argument and retry.`, e);
  },
}

export default handlers;
