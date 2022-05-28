import { applyDefaultOptions } from '.';
import { transparentify, validRgbColor } from '../utils/color';
import { callIfExists } from '../utils/generic';
import { throwBestError, ImageProcessError, InvalidBgColorError, InvalidBgColorAlphaError } from './errors';

function verifyBgColor(bgColor, options) {
  if(!validRgbColor(bgColor)) {
    throwBestError(new InvalidBgColorError(bgColor, options));
  }
  if(bgColor.a < 255) {
    throwBestError(new InvalidBgColorAlphaError(bgColor, options));
  }
}

export function processImage(image, options) {
  applyDefaultOptions(options)
  try {
    callIfExists(options.onImageProcessStart, image, options);

    verifyBgColor(options.bgColor, options);

    for (var x = 0; x < image.width; x++) {
      for (var y = 0; y < image.height; y++) {
        processPixel(image, x, y, options);
      }
    }

    callIfExists(options.onImageProcessEnd, image, options);
  } catch (e) {
    throwBestError(e, new ImageProcessError(image, options, e))
  }
}

export function processPixel(image, x, y, options) {
  callIfExists(options.onPixelProcessStart, image, x, y, options);

  var idx = (image.width * y + x) * 4;
  
  const pixelColor = {
    r: image.data[idx], 
    g: image.data[idx + 1], 
    b: image.data[idx + 2],
    a: image.data[idx + 3]
  }
  
  const newColor = transparentify(pixelColor, options.bgColor);
  
  image.data[idx] = newColor.r
  image.data[idx + 1] = newColor.g
  image.data[idx + 2] = newColor.b
  image.data[idx + 3] = newColor.a

  callIfExists(options.onPixelProcessEnd, image, x, y, options);
}