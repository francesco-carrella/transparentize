import { isPositiveInt, isIterable, runWithoutErrors, isObjectWithKeys } from '@transparentize/common/src/utils/generics'
import { callHandler } from '@transparentize/common/src/utils/handlers'
import { throwBestError } from '@transparentize/common/src/errors'

import { RGBA_CHANNELS, RGB_CHANNELS } from '../constants'
import { InvalidImageError, ImageProcessError } from '../errors'
import { getOptions } from '../options'
import FrameData from './FrameData'

export default class Image {

  static validateInput(...args) {
    const input = args[0]
    if (!isObjectWithKeys(args[0], ['width', 'height', 'data'])) {
      throwBestError(new InvalidImageError(`Invalid input value for Image constructor. It should have a structure like { width, height, data }. Got ${input}`))
    }

    let { width, height, data } = input
    if (!isPositiveInt(width)) {
      throwBestError(new InvalidImageError('Invalid width attribute for Image constructor', input))
    }

    if (!isPositiveInt(height)) {
      throwBestError(new InvalidImageError('Invalid height attribute for Image constructor', input))
    }

    if (!isIterable(data)) {
      throwBestError(new InvalidImageError('Invalid data attribute for Image constructor. It should be a buffer (preferably) or an iterable', input))
    }

    // ensure the data buffer length is accord with the expected pixels count, in either RGB or RGBA format
    const pixelCount = width * height
    const rgbaDataLength = pixelCount * RGBA_CHANNELS.length
    const rgbDataLength = pixelCount * RGB_CHANNELS.length
    if (data.length !== rgbaDataLength && data.length !== rgbDataLength) {
      throwBestError(new InvalidImageError(`Invalid data attribute for Image constructor. Expected length of ${rgbaDataLength} (for rgba) or ${rgbDataLength} (for rgb), got ${data.length}`, input))
    }

    return input
  }

  static isValidInput = runWithoutErrors.bind(null, Image.validateInput)

  constructor(...args) {
    const input = Image.validateInput(...args)
    if (input instanceof Image) return input
    const { width, height, data } = input
    this.width = width
    this.height = height
    const pixelsCount = this.width * this.height
    const rgbDataLength = pixelsCount * RGB_CHANNELS.length
    this.data = data.length === rgbDataLength ?
      FrameData.fromRgb(data) :
      FrameData.fromRgba(data)
  }

  transparentize(options, disableChecks) {
    if (!disableChecks) options = getOptions(options)

    try {
      if (options.onProcessImageStart) {
        [options] = callHandler(options.onProcessImageStart, this, options)
      }

      this.data = FrameData.transparentize(this.data, options, true)

      if (options.onProcessImageEnd) {
        [options] = callHandler(options.onProcessImageEnd, this, options)
      }

      return this
    } catch (e) {
      throwBestError(e, new ImageProcessError(null, this, options, e))
    }
  }

  toString() {
    return `Image(width: ${this.width}, height: ${this.height}, data: ${this.data})`
  }
}
