import { decode as decodeTiff } from 'tiff';
import { readFileAsync, readChunk } from '../../utils/files';
import { convertRgbBufferToRgba } from '../../utils/color';
import { throwBestError, UnsupportedTiffImageFormatError, InvalidTiffPageError } from '../errors';


const tiff = {
  name: 'tiff',
  fileExtensions: ['.tif', '.tiff'],
  read: async (inputFile, options) => {
    const imageBuffer = await readFileAsync(inputFile);
    let pages

    try {
      pages = await decodeTiff(imageBuffer);
    } catch (e) {
      if (e.message.match(/unsupported/i)) {
        throw throwBestError(e, new UnsupportedTiffImageFormatError(inputFile, options, e))
      }
      throw e;
    }

    if (
      isNaN(options.page) ||
      typeof options.page === 'number' && (options.page < 1 || options.page > pages.length)
    ) {
      throwBestError(new InvalidTiffPageError(inputFile, pages.length, options));
    }

    const image = pages[options.page ? options.page - 1 : 0]

    if (image.samplesPerPixel === 3) {
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