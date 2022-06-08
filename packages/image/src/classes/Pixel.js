import { GenericError, throwBestError } from '@transparentize/common/src/errors'
import { callHandler } from '@transparentize/common/src/utils/handlers'

import { RGBA_INDEXES, RGB_INDEXES, ALPHA_INDEX } from '../constants'
import { ColorProcessError } from '../errors'
import { getOptions } from '../options'

export default class Pixel {

  static transparentize(frameData, pixelIdx, options, disableChecks) {
    const pixelStartPos = pixelIdx * RGBA_INDEXES.length
    try {
      if (!disableChecks) options = getOptions(options)

      if (options.onProcessPixelStart) {
        [frameData, pixelIdx, options] = callHandler(options.onProcessPixelStart, frameData, pixelIdx, options)
      }

      const pixelAlphaPos = pixelStartPos + ALPHA_INDEX

      if (frameData[pixelAlphaPos] < 255 && options.initialBackgroundColor) {
        Pixel.solidifyPixelColor(frameData, pixelIdx, options.initialBackgroundColor)
      }

      Pixel.transparentizePixelColor(frameData, pixelIdx, options.backgroundColor)

      if (options.onProcessPixelEnd) {
        [frameData, pixelIdx, options] = callHandler(options.onProcessPixelEnd, frameData, pixelIdx, options)
      }
    } catch (e) {
      throwBestError(e, new ColorProcessError(null, frameData.slice(pixelStartPos, pixelStartPos + RGBA_INDEXES.length), options))
    }
  }

  static solidifyPixelColor(frameData, pixelIdx, backgroundColor) {
    const pixelStartPos = pixelIdx * RGBA_INDEXES.length
    const pixelAlphaPos = pixelStartPos + ALPHA_INDEX

    for (let channelPos = 0; channelPos < RGB_INDEXES.length; channelPos++) {
      const pixelChannelPos = pixelStartPos + channelPos
      frameData[pixelChannelPos] = backgroundColor[channelPos] + (frameData[pixelChannelPos] - backgroundColor[channelPos]) * (frameData[pixelAlphaPos] / 255) //eslint-disable-line max-len
    }
    frameData[pixelAlphaPos] = 255
  }


  static transparentizePixelColor(frameData, pixelIdx, backgroundColor) {
    const pixelStartPos = pixelIdx * RGBA_INDEXES.length

    // find the maximum applicable alpha
    let maxAlpha = 0
    for (let channelPos = 0; channelPos < RGB_INDEXES.length; channelPos++) {
      const pixelChannelPos = pixelStartPos + channelPos
      const maxChannelAlpha = (frameData[pixelChannelPos] - backgroundColor[channelPos]) / ((frameData[pixelChannelPos] - backgroundColor[channelPos] > 0 ? 255 : 0) - backgroundColor[channelPos]) * 255 //eslint-disable-line max-len
      if (!isNaN(maxChannelAlpha) && maxChannelAlpha > maxAlpha) {
        maxAlpha = maxChannelAlpha
      }
    }

    // Calculate the resulting color applying the alpha value
    for (let channelPos = 0; channelPos < RGB_INDEXES.length; channelPos++) {
      const pixelChannelPos = pixelStartPos + channelPos
      frameData[pixelChannelPos] = !maxAlpha ?
        backgroundColor[channelPos] :
        backgroundColor[channelPos] + (frameData[pixelChannelPos] - backgroundColor[channelPos]) / (maxAlpha / 255)
    }
    const pixelAlphaPos = pixelStartPos + ALPHA_INDEX
    frameData[pixelAlphaPos] = maxAlpha
  }

  constructor() {
    throw new GenericError('Pixel is an static class and cannot be instantiated.')
  }
}
