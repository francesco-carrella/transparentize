import { throwBestError } from '@transparentize/common/src/errors.js'
import { callIfExists } from '@transparentize/common/src/utils/generics.js'
import { rgbChannels, clampColorValue } from '@transparentize/common/src/utils/colors.js'

import { applyDefaultOptions } from '.'
import { ImageProcessError } from './errors'
import { verifyBgColor, verifyColor } from './verifications.js'

export function processImage(image, options) {
  applyDefaultOptions(options)
  try {
    callIfExists(options.onImageProcessStart, image, options)

    verifyBgColor(options.bgColor, options)

    for (let x = 0; x < image.width; x++) {
      for (let y = 0; y < image.height; y++) {
        processPixel(image, x, y, options)
      }
    }

    callIfExists(options.onImageProcessEnd, image, options)
    return image
  } catch (e) {
    throwBestError(e, new ImageProcessError(image, options, e))
  }
}

export function processPixel(image, x, y, options) {
  callIfExists(options.onPixelProcessStart, image, x, y, options)

  let idx = (image.width * y + x) * 4

  const pixelColor = {
    r: image.data[idx],
    g: image.data[idx + 1],
    b: image.data[idx + 2],
    a: image.data[idx + 3]
  }

  const newColor = transparentizeColor(pixelColor, options.bgColor)

  image.data[idx] = newColor.r
  image.data[idx + 1] = newColor.g
  image.data[idx + 2] = newColor.b
  image.data[idx + 3] = newColor.a

  callIfExists(options.onPixelProcessEnd, image, x, y, options)
}

export function transparentizeColor(top, bottom) {

  // TODO: check performance issues on large images
  verifyColor(top)
  verifyBgColor(bottom)

  // first of all remove top color alpha multiplying it by the bottom color (mimiking the multiply blend mode)
  if (top.a < 255) {
    rgbChannels.forEach(function (channel) {
      top[channel] = clampColorValue(bottom[channel] + (top[channel] - bottom[channel]) * (top.a / 255))
    })
    top.a = 255
  }

  // find the maximum applicable alpha
  let maxAlpha = Math.max(...rgbChannels.map(function (channel) {
    return (top[channel] - bottom[channel]) / ((0 < (top[channel] - bottom[channel]) ? 255 : 0) - bottom[channel]) * 255
  }).filter(a => !isNaN(a)))

  // Calculate the resulting color appling the alpha value
  function transparentifyChannel(channel) {
    if (!maxAlpha) return bottom[channel]
    return clampColorValue(bottom[channel] + (top[channel] - bottom[channel]) / (maxAlpha / 255))
  }

  return {
    r: transparentifyChannel('r'),
    g: transparentifyChannel('g'),
    b: transparentifyChannel('b'),
    a: clampColorValue(maxAlpha)
  }
}