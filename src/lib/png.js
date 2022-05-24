import fs from 'fs';
import PNG from 'pngjs3/dist/pngjs3';

import { verifyInputFile, createOutputFileName, verifyOutputFile } from '../utils/files';
import { callIfExists } from '../utils/generic';
import { processImage } from './process';

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
        callIfExists(options.onPngProcessError, e, inputFile, outputFile, options);
      })
      .on('parsed', function () {
        try {
          processImage(this, options);

          try {
            callIfExists(options.onWriteOutputFileStart, outputFile, options);
            this.pack().pipe(fs.createWriteStream(outputFile));
            callIfExists(options.onWriteOutputFileEnd, outputFile, options);
          } catch (e) {
            callIfExists(options.onWriteOutputFileError, e, outputFile, options);
          }
          
          callIfExists(options.onPngProcessEnd, inputFile, outputFile, options);
        } catch (e) {
          callIfExists(options.onPngProcessError, e, inputFile, outputFile, options);        }
      })
  } catch (e) {
    callIfExists(options.onPngProcessError, e, inputFile, outputFile, options);
  }
}