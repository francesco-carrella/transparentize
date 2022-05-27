import { decode as decodeTiff } from 'tiff';
import { readFileAsync, readChunk } from '../../utils/files';
import { convertRgbBufferToRgba } from '../../utils/color';
import { throwBestError, UnsupportedTiffImageFormatError } from '../errors';


const tiff = {
  name: 'tiff',
  fileExtensions: ['.tif', '.tiff'],
  read: async (inputFile, options) => {
    const imageBuffer = await readFileAsync(inputFile);

    try {
      image = await decodeTiff(imageBuffer, { onlyFirst: true })[0];
    } catch (e) {
      if(e.message.match(/unsupported/i)) {
        throw throwBestError(e, new UnsupportedTiffImageFormatError(inputFile, options, e))
      }
      throw e;
    }

    if(image.samplesPerPixel === 3) {
      image.data = convertRgbBufferToRgba(image.data);
    }

    return image
  },
  validate: (inputFile) => {
    const buffer = readChunk(inputFile, 4)
    
    return (
      buffer[0] === 73
      && buffer[1] === 73
      && buffer[2] === 42
      && buffer[3] === 0
    ) || (
      buffer[0] === 77
      && buffer[1] === 77
      && buffer[2] === 0
      && buffer[3] === 42
    );
  },
}

export default tiff;