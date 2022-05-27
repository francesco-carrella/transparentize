import { encode as encodeJpeg, decode as decodeJpeg } from 'jpeg-js';
import { readFileAsync, writeFileAsync, readChunk } from '../../utils/files';

const jpeg = {
  name: 'jpeg',
  fileExtensions: ['.jpg', '.jpeg'],
  read: async (inputFile, options) => {
    const imageBuffer = await readFileAsync(inputFile);
    const image = decodeJpeg(imageBuffer);
    return image;
  },
  write: async (image, outputFile, options) => {
    const imageData = encodeJpeg(image);
    await writeFileAsync(outputFile, imageData);
  },
  validate: (inputFile) => {
    const buffer = readChunk(inputFile, 3)
    
    return buffer[0] === 255
      && buffer[1] === 216
      && buffer[2] === 255;
  },
}

export default jpeg;