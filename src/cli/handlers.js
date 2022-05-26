import { showProgressMessage, showConfirm, showProgressBar, chalk } from './ui';

let progressBar;

const handlers = {
  onReadInputFileStart: (inputFilename, options) => {
    if(options.quiet) return
    showProgressMessage(`⏳  Reading input file '${chalk.underline(inputFilename)}'...`);
  },
  onImageProcessStart: (image, options) => {
    if(options.quiet) return
    progressBar = showProgressBar(image.width * image.height, '⏳  Processing image...')
  },
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