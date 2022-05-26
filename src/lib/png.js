import { encode as encodePng, decode as decodePng } from 'fast-png';

import { readFileAsync, writeFileAsync, verifyInputFile, verifyOutputFile } from '../utils/files';
import { callIfExists } from '../utils/generic';
import { processImage } from './process';
import { throwBestError, PngProcessError, WriteOutputFileError, PngParseError } from './errors';

async function readPng(inputFilename, options) {
  try {
    callIfExists(options.onReadInputFileStart, inputFilename, options)
    const imageBuffer = await readFileAsync(inputFilename);
    const image = decodePng(imageBuffer);
    callIfExists(options.onReadInputFileEnd, inputFilename, options)
    return image
  } catch (e) {
    throwBestError(e, new PngParseError(inputFilename, options, e));
  }
}

async function writePng(image, outputFile, options) {
  try {
    callIfExists(options.onWriteOutputFileStart, outputFile, options);
    const imageData = encodePng(image);
    await writeFileAsync(outputFile, imageData);
    callIfExists(options.onWriteOutputFileEnd, outputFile, options);
  } catch (e) {
    throwBestError(e, new WriteOutputFileError(outputFile, options, e));
  }
}

export async function processPng(inputFile, outputFile, options) {
  try {
    callIfExists(options.onPngProcessStart, inputFile, outputFile, options);
    
    verifyInputFile(inputFile, options);

    verifyOutputFile(outputFile, options);

    const image = await readPng(inputFile, options);
    processImage(image, options);
    await writePng(image, outputFile, options);

    callIfExists(options.onPngProcessEnd, inputFile, outputFile, options);
  } catch (e) {
    throwBestError(e, new PngProcessError(inputFile, outputFile, options, e))
  }
}