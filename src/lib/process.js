import { transparentify } from '../utils/color';
import { callIfExists } from '../utils/generic';
import { ImageProcessError, throwBestError } from './errors';

export function processImage(image, options) {
  
  try {
    callIfExists(options.onImageProcessStart, image, options);

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
  
  const newColor = transparentify(pixelColor);
  
  image.data[idx] = newColor.r
  image.data[idx + 1] = newColor.g
  image.data[idx + 2] = newColor.b
  image.data[idx + 3] = newColor.a

  callIfExists(options.onPixelProcessEnd, image, x, y, options);
}