import { showProgressMessage, showConfirm, showProgressBar, chalk } from './ui';

let progressBar;

const handlers = {
  onOutputFileExists: async (outputFile, options) => {
    if(options.overrideInput) {
      return await showConfirm(`Are you sure you want to replace the input file '${chalk.underline(outputFile)}' with the transparentized version?`);
    } else {
      return await showConfirm(`The output file '${chalk.underline(outputFile)}' already exists. Do you want to overwrite it?`);
    }
  },
  onReadInputFileStart: (inputFilename, options) => {
    if(options.quiet) return
    showProgressMessage(`⏳  Reading input file '${chalk.underline(inputFilename)}'...`);
  },
  // onReadInputFileEnd: (inputFilename, options) => {},
  // onPngProcessStart: (inputFile, outputFile, options) => {},
  // onPngProcessEnd: (inputFile, outputFile, options) => {},
  onImageProcessStart: (image, options) => {
    if(options.quiet) return
    progressBar = showProgressBar(image.width * image.height, '⏳  Processing image...')
  },
  // onImageProcessEnd: (image, options) => {},
  // onPixelProcessStart: (image, x, y, options) => {},
  onPixelProcessEnd: (image, x, y, options) => {
    if(options.quiet) return
    progressBar.tick();
  },
  onWriteOutputFileStart: (outputFile, options) => {
    if(options.quiet) return
    showProgressMessage(`⏳  Writing output file '${chalk.underline(outputFile)}'...`);
  },
  onWriteOutputFileEnd: (outputFile, options) => {
    if(options.quiet) return
    showProgressMessage(`✨  Image transparentited successfully. The output file is '${chalk.underline(outputFile)}'.\n`);
  },
}

export default handlers;