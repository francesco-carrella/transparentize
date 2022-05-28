import { verifyInputFile, verifyOutputFile, getFileExtension } from '../utils/files';
import { callIfExists } from '../utils/generic';
import { applyDefaultOptions } from '.';
import { getImageFormat, getBestImageFormatNameForFile } from './imageFormats';
import { processImage } from './process';
import { throwBestError, FileProcessError, WriteOutputFileError, InputFileParseError } from './errors';

async function readFile(inputFilename, options) {
  try {
    callIfExists(options.onReadInputFileStart, inputFilename, options)

    const inputImageFormat = getImageFormat(options.inputFormat);
    const image = inputImageFormat.read(inputFilename, options);

    callIfExists(options.onReadInputFileEnd, inputFilename, options)
    return image
  } catch (e) {
    throwBestError(e, new InputFileParseError(inputFilename, options, e));
  }
}

async function writeFile(image, outputFile, options) {
  try {
    const outputImageFormat = getImageFormat('png');
    callIfExists(options.onWriteOutputFileStart, outputFile, options);

    outputImageFormat.write(image, outputFile, options);
    
    callIfExists(options.onWriteOutputFileEnd, outputFile, options);
  } catch (e) {
    throwBestError(e, new WriteOutputFileError(outputFile, options, e));
  }
}

export async function processFile(inputFile, outputFile, options) {
  applyDefaultOptions(options)
  try {
    callIfExists(options.onProcessFileStart, inputFile, outputFile, options);
    
    if(!options.inputFormat) {
      options.inputFormat = getBestImageFormatNameForFile(inputFile, options);
    }

    verifyInputFile(inputFile, options);

    verifyOutputFile(outputFile, options);

    const image = await readFile(inputFile, options);
    // console.time('processImage');
    processImage(image, options);
    // console.timeEnd('processImage');
    await writeFile(image, outputFile, options);

    callIfExists(options.onProcessFileEnd, inputFile, outputFile, options);
  } catch (e) {
    throwBestError(e, new FileProcessError(inputFile, outputFile, options, e))
  }
}