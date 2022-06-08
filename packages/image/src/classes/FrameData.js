import { isIterable, runWithoutErrors } from '@transparentize/common/src/utils/generics'
import { callHandler } from '@transparentize/common/src/utils/handlers'
import { throwBestError, GenericError } from '@transparentize/common/src/errors'

import { RGBA_CHANNELS, RGB_CHANNELS, ALPHA_INDEX } from '../constants'
import { InvalidFrameDataError, FrameDataProcessError } from '../errors'
import { getOptions } from '../options'
import Pixel from './Pixel'

export default class FrameData {

  static validateRgbInput(...args) {
    let [input, alpha = 255] =
      args.length > 2 ? args :
        args.length === 2 ? [args[0], args[1]] :
          [args[0]]
    if (!input || !isIterable(input) || input.length % RGB_CHANNELS.length !== 0) {
      // TODO: specific error
      throwBestError(new InvalidFrameDataError(null, input))
    }
    return [input, alpha]
  }

  static validateRgbaInput(...args) {
    let input =
      args.length > 1 ?
        args :
        args[0] // normalize arguments as input to ease further checks
    if (!input || !isIterable(input) || input.length % RGBA_CHANNELS.length !== 0) {
      // TODO: specific error
      throwBestError(new InvalidFrameDataError(null, input))
    }
    return input
  }

  static isValidRgbInput = runWithoutErrors.bind(FrameData, FrameData.validateRgbInput)

  static isValidRgbaInput = runWithoutErrors.bind(FrameData, FrameData.validateRgbaInput)

  static fromRgb(...args) {
    const [input, alpha] = FrameData.validateRgbInput(...args)
    if (input instanceof Buffer) return input
    const rgbaBuffer = Buffer.alloc(pixelsCount * RGBA_CHANNELS.length)
    const pixelsCount = input.length / RGB_CHANNELS.length
    for (let pixelIndex = 0; pixelIndex < pixelsCount; pixelIndex++) {
      const rgbIdx = pixelIndex * ALPHA_INDEX
      const rgbaIdx = pixelIndex * RGBA_CHANNELS.length
      rgbaBuffer[rgbaIdx] = input[rgbIdx]
      rgbaBuffer[rgbaIdx + 1] = input[rgbIdx + 1]
      rgbaBuffer[rgbaIdx + 2] = input[rgbIdx + 2]
      rgbaBuffer[rgbaIdx + 3] = alpha
    }
    return rgbaBuffer
  }

  static fromRgba(...args) {
    const input = FrameData.validateRgbaInput(...args)
    if (input instanceof Buffer) return input
    return Buffer.from(input)
  }

  // forEachPixel(buffer, (buffer, pixelIdx, pixelStartPos, alphaChannelPos) => {}))
  static forEachPixel(frameData, callback) {
    const pixelsCount = frameData.length / RGBA_CHANNELS.length
    for (let pixelIdx = 0; pixelIdx < pixelsCount; pixelIdx++) {
      callback(pixelIdx)
    }
  }

  static transparentize(frameData, options, disableChecks) {
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
        Pixel.transparentize(frameData, pixelIdx, options, true)
      })

      if (options.onProcessFrameDataEnd) {
        [frameData, options] = callHandler(options.onProcessFrameDataEnd, frameData, options)
      }

      return frameData
    } catch (e) {
      throwBestError(e, new FrameDataProcessError(null, frameData, options, e))
    }
  }

  constructor() {
    throw new GenericError('FrameData is an static class and cannot be instantiated. Use .fromRgba() or .fromRgb() instead in order to create a new FrameData buffer.')
  }

}