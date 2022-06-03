import { throwBestError } from '@transparentize/common/src/errors.js'
import { callHandler } from '@transparentize/common/src/utils/handlers'

import { ImageProcessError, FrameDataProcessError, ColorProcessError, UnsupportedBackgroundColorAlphaError } from './errors'
import { Color, FrameData, Image } from './classes'

export const whiteColor = new Color([255, 255, 255, 255])
export const defaultBackgroundColor = whiteColor

export function processImage(image, backgroundColor = defaultBackgroundColor, options = {}) {
  try {
    if (options.onProcessImageStart) {
      [image, backgroundColor, options] = callHandler(options.onProcessImageStart, image, backgroundColor, options)
    }
    image = Image.cast(image)
    backgroundColor = Color.cast(backgroundColor)

    if (backgroundColor[3] < 255) {
      throwBestError(new UnsupportedBackgroundColorAlphaError(null, backgroundColor, options))
    }

    image.data = processFrameData(image.data, backgroundColor, options)

    if (options.onProcessImageEnd) {
      [image, backgroundColor, options] = callHandler(options.onProcessImageEnd, image, backgroundColor, options)
    }
    return image
  } catch (e) {
    throwBestError(e, new ImageProcessError(image, options, e))
  }
}


export function processFrameData(frameData, backgroundColor = defaultBackgroundColor, options = {}) {
  try {
    if (options.onProcessFrameDataStart) {
      [frameData, backgroundColor, options] = callHandler(options.onProcessFrameDataStart, frameData, backgroundColor, options)
    }
    frameData = FrameData.cast(frameData)

    backgroundColor = Color.cast(backgroundColor)

    if (backgroundColor[3] < 255) {
      throwBestError(new UnsupportedBackgroundColorAlphaError(null, backgroundColor, options))
    }

    const pixelsCount = frameData.length / Color.rgbaChannels.length

    // process every pixel (aka color) in the frameData
    for (let pixelIdx = 0; pixelIdx < pixelsCount; pixelIdx++) {
      const pixelColor = frameData.colorAt(pixelIdx)
      const processedColor = processColor(pixelColor, backgroundColor, options)
      frameData.replaceAt(pixelIdx, processedColor)
    }

    if (options.onProcessFrameDataEnd) {
      [frameData, backgroundColor, options] = callHandler(options.onProcessFrameDataEnd, frameData, backgroundColor, options)
    }
    return frameData
  } catch (e) {
    throwBestError(e, new FrameDataProcessError(null, frameData, options, e))
  }
}

export function processColor(frontColor, backgroundColor = defaultBackgroundColor, options = {}) {
  try {
    if (options.onProcessColorStart) {
      [frontColor, backgroundColor, options] = callHandler(options.onProcessColorStart, frontColor, backgroundColor, options)
    }

    frontColor = Color.cast(frontColor)
    backgroundColor = Color.cast(backgroundColor)

    if (backgroundColor[3] < 255) {
      throwBestError(new UnsupportedBackgroundColorAlphaError(null, backgroundColor, options))
    }

    // first of all remove new color alpha multiplying it by the bottom color (mimiking the multiply blend mode)
    if (frontColor[3] < 255) {
      (Color.rgbIndexes).forEach(function (channel) {
        frontColor[channel] = backgroundColor[channel] + (frontColor[channel] - backgroundColor[channel]) * (frontColor[3] / 255)
      })
      frontColor[3] = 255
    }

    // find the maximum applicable alpha
    let maxAlpha = Math.max(...Color.rgbIndexes.map(function (channel) {
      return (
        (frontColor[channel] - backgroundColor[channel]) / ((frontColor[channel] - backgroundColor[channel] > 0 ? 255 : 0) - backgroundColor[channel]) * 255 //eslint-disable-line max-len
      )
    }).filter(a => !isNaN(a)))

    // Calculate the resulting color appling the alpha value
    Color.rgbIndexes.forEach(function (channel) {
      frontColor[channel] = !maxAlpha ?
        backgroundColor[channel] :
        backgroundColor[channel] + (frontColor[channel] - backgroundColor[channel]) / (maxAlpha / 255)
    })
    frontColor[3] = maxAlpha

    if (options.onProcessColorEnd) {
      [frontColor, backgroundColor, options] = callHandler(options.onProcessColorEnd, frontColor, backgroundColor, options)
    }
    return frontColor
  } catch (e) {
    throwBestError(e, new ColorProcessError(null, frontColor, backgroundColor, options, e))
  }
}