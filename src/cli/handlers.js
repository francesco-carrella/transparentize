import { OutputFileExistsError, throwBestError } from '../lib';
import { showMessage, showConfirm, showProgressBar } from './ui';

let progressBar;

const handlers = {
  onOutputFileExists: async (outputFile, options) => {
    const overrideOutputFile = await showConfirm(`The output file '${outputFile}' already exists. Do you want to overwrite it?`);
    if(!overrideOutputFile) {
      throwBestError(new OutputFileExistsError(outputFile, options))
    }
  },
  // onPngProcessStart: (inputFile, outputFile, options) => {},
  // onPngProcessEnd: (inputFile, outputFile, options) => {},
  onImageProcessStart: (image, options) => {
    showMessage(`Processing image...`);
    progressBar = showProgressBar(image.width * image.height)
  },
  // onImageProcessEnd: (image, options) => {},
  // onPixelProcessStart: (image, x, y, options) => {},
  onPixelProcessEnd: (image, x, y, options) => {
    progressBar.tick();
  },
  // onWriteOutputFileStart: (outputFile, options) => {},
  onWriteOutputFileEnd: (outputFile, options) => {
    showMessage(`Image processed successfully. The output file is '${outputFile}'.`);
  },
}

export default handlers;