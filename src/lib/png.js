import fs from 'fs';
import PNG from 'pngjs3/dist/pngjs3';

import { verifyInputFile, createOutputFileName, verifyOutputFile } from '../utils/files';
import { callIfExists } from '../utils/generic';
import { processImage } from './process';
import { throwBestError, PngProcessError, WriteOutputFileError, PngParseError } from './errors';

export async function processPng(inputFile, outputFile, options) {
  try {
    callIfExists(options.onPngProcessStart, inputFile, outputFile, options);
    
    verifyInputFile(inputFile, options)

    if(!outputFile) {
      outputFile = createOutputFileName(inputFile, options)
    }
    
    await verifyOutputFile(outputFile, options)

    fs.createReadStream(inputFile)
      .pipe(
        new PNG({
          filterType: 4,
          inputColorType: 6,
          colorType: 6,
        }),
      )
      .on('error', function (e) {
        throwBestError(e, new PngParseError(inputFile, options, e))
      })
      .on('parsed', function () {
        try {
          processImage(this, options);
          try {
            callIfExists(options.onWriteOutputFileStart, outputFile, options);
            this.pack().pipe(fs.createWriteStream(outputFile));
            callIfExists(options.onWriteOutputFileEnd, outputFile, options);
          } catch (e) {
            throwBestError(e, new WriteOutputFileError(outputFile, options, e));
          }
          
          callIfExists(options.onPngProcessEnd, inputFile, outputFile, options);
        } catch (e) {
          throwBestError(e, new PngProcessError(inputFile, outputFile, options, e))
        }
      })
  } catch (e) {
    throwBestError(e, new PngProcessError(inputFile, outputFile, options, e))
  }
}