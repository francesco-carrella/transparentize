import fs from 'fs'

import { encode as encodePng, decode as decodePng } from 'fast-png';
import { readFileAsync, writeFileAsync } from '../../utils/files';

const png = {
  name: 'png',
  fileExtensions: ['.png'],
  read: async (inputFile, options) => {
    const imageBuffer = await readFileAsync(inputFile);
    const image = decodePng(imageBuffer);
    return image;
  },
  write: async (image, outputFile, options) => {
    const imageData = encodePng(image);
    await writeFileAsync(outputFile, imageData);
  },
  validate: (inputFile) => {
    let buffer = Buffer.alloc(8);
    const fileDescriptor = fs.openSync(inputFile, 'r');
    const bytesRead = fs.readSync(fileDescriptor, buffer, { length: 8 });
  
    return (
      bytesRead === 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4E &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0D &&
      buffer[5] === 0x0A &&
      buffer[6] === 0x1A &&
      buffer[7] === 0x0A
    )
  },
}

export default png;