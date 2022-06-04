
import { throwBestError } from '@transparentize/common/src/errors.js'
import { callHandler } from '@transparentize/common/src/utils/handlers'

import { RGBA_CHANNELS } from './constants'
import { solidifyColor, transparentizeColor } from './functions'
import { getOptions } from './options'
import { Color, FrameData, Image } from './classes'
import { ImageProcessError, FrameDataProcessError, ColorProcessError, UnsupportedBackgroundColorAlphaError } from './errors'

// TODO: Where to move it ?
function ensureBackgroundColor(backgroundColor, options) {
  backgroundColor = Color.cast(backgroundColor)

  if (backgroundColor[3] < 255) {
    throwBestError(new UnsupportedBackgroundColorAlphaError(null, backgroundColor, options))
  }

  return backgroundColor
}

export function processImage(image, options) {
  try {
    if (options.onProcessImageStart) {
      [image, options] = callHandler(options.onProcessImageStart, image, options)
    }

    image = Image.cast(image)

    image.data = processFrameData(image.data, options)

    if (options.onProcessImageEnd) {
      [image, options] = callHandler(options.onProcessImageEnd, image, options)
    }
    return image
  } catch (e) {
    throwBestError(e, new ImageProcessError(image, options, e))
  }
}

export function processFrameData(frameData, options) {
  try {
    if (options.onProcessFrameDataStart) {
      [frameData, options] = callHandler(options.onProcessFrameDataStart, frameData, options)
    }

    frameData = FrameData.cast(frameData)

    // process every pixel (aka color) in the frameData
    const pixelsCount = frameData.length / RGBA_CHANNELS.length
    for (let pixelIdx = 0; pixelIdx < pixelsCount; pixelIdx++) {
      const pixelColor = frameData.colorAt(pixelIdx)
      const processedColor = processColor(pixelColor, options)
      frameData.replaceAt(pixelIdx, processedColor)
    }

    if (options.onProcessFrameDataEnd) {
      [frameData, options] = callHandler(options.onProcessFrameDataEnd, frameData, options)
    }
    return frameData
  } catch (e) {
    throwBestError(e, new FrameDataProcessError(null, frameData, options, e))
  }
}

export function processColor(color, options) {
  try {
    if (options.onProcessColorStart) {
      [color, options] = callHandler(options.onProcessColorStart, color, options)
    }

    color = Color.cast(color)
    options = getOptions(options)

    let { backgroundColor, initialBackgroundColor } = options
    backgroundColor = ensureBackgroundColor(backgroundColor)

    // first of all remove new color alpha multiplying it by the bottom color (mimiking the multiply blend mode)
    if (color[3] < 255 && initialBackgroundColor) {
      initialBackgroundColor = ensureBackgroundColor(initialBackgroundColor)
      color = solidifyColor(color, initialBackgroundColor)
    }

    color = transparentizeColor(color, backgroundColor)

    if (options.onProcessColorEnd) {
      [color, backgroundColor, options] = callHandler(options.onProcessColorEnd, color, backgroundColor, options)
    }
    return color
  } catch (e) {
    throwBestError(e, new ColorProcessError(null, color, options, e))
  }
}