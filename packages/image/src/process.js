
import { throwBestError } from '@transparentize/common/src/errors.js'
import { callHandler } from '@transparentize/common/src/utils/handlers'

import { RGBA_INDEXES, ALPHA_INDEX } from './constants'
import { solidifyColor, transparentizeColor } from './functions'
import { getOptions } from './options'
import { FrameData, Image } from './classes'
import { ImageProcessError, FrameDataProcessError, ColorProcessError } from './errors'

export function processImage(image, options, disableChecks) {
  if (!disableChecks) options = getOptions(options)

  try {
    if (options.onProcessImageStart) {
      [image, options] = callHandler(options.onProcessImageStart, image, options)
    }

    if (!disableChecks && !(image instanceof Image)) {
      image = new Image(image)
    }

    image.data = processFrameData(image.data, options)

    if (options.onProcessImageEnd) {
      [image, options] = callHandler(options.onProcessImageEnd, image, options)
    }
    return image
  } catch (e) {
    throwBestError(e, new ImageProcessError(null, image, options, e))
  }
}


export function processFrameData(frameData, options, disableChecks) {
  if (!disableChecks) options = getOptions(options)

  try {
    if (options.onProcessFrameDataStart) {
      [frameData, options] = callHandler(options.onProcessFrameDataStart, frameData, options)
    }

    if (!disableChecks && !(FrameData.isValidRgbaInput(frameData) || FrameData.isValidRgbInput(frameData))) {
      throwBestError(new FrameDataProcessError(null, frameData, options))
    }

    // process every pixel (aka color) in the frameData
    FrameData.forEachPixel(frameData, (pixelIdx) => {
      processColor(frameData, pixelIdx, options, true)
    })

    if (options.onProcessFrameDataEnd) {
      [frameData, options] = callHandler(options.onProcessFrameDataEnd, frameData, options)
    }

    return frameData
  } catch (e) {
    throwBestError(e, new FrameDataProcessError(null, frameData, options, e))
  }
}

export function processColor(frameData, pixelIdx, options, disableChecks) {
  const pixelStartPos = pixelIdx * RGBA_INDEXES.length
  try {
    if (!disableChecks) options = getOptions(options)

    if (options.onProcessColorStart) {
      [frameData, pixelIdx, options] = callHandler(options.onProcessColorStart, frameData, pixelIdx, options)
    }

    const pixelAlphaPos = pixelStartPos + ALPHA_INDEX

    if (frameData[pixelAlphaPos] < 255 && options.initialBackgroundColor) {
      solidifyColor(frameData, pixelIdx, options.initialBackgroundColor)
    }

    transparentizeColor(frameData, pixelIdx, options.backgroundColor)

    if (options.onProcessColorEnd) {
      [frameData, pixelIdx, options] = callHandler(options.onProcessColorEnd, frameData, pixelIdx, options)
    }
  } catch (e) {
    throwBestError(e, new ColorProcessError(null, frameData.slice(pixelStartPos, pixelStartPos + RGBA_INDEXES.length), options))
  }

}