import { throwBestError } from '@transparentize/common/src/errors'
import { isPositiveInt, isIterable, isInt, runWithoutErrors } from '@transparentize/common/src/utils/generics'

import { RGBA_CHANNELS, RGB_CHANNELS } from '../constants'
import { InvalidFrameDataConstructorValueError } from '../errors'
import Color from './Color'

export default class FrameData extends Uint8ClampedArray {

  static validateInput = validateInput
  static validateFromRgbDataInput = validateFromRgbDataInput

  static isValidInput = runWithoutErrors.bind(null, FrameData.validateInput)
  static isValidFromRgbDataInput = runWithoutErrors.bind(null, FrameData.validateFromRgbDataInput)

  static fromRgbData(rgbData, alpha = 255) {
    [rgbData, alpha] = FrameData.validateFromRgbDataInput(rgbData, alpha)
    const pixelsCount = rgbData.length / RGB_CHANNELS.length
    const rgbaBuffer = new Uint8Array(pixelsCount * RGBA_CHANNELS.length)
    for (let pixelIndex = 0; pixelIndex < pixelsCount; pixelIndex++) {
      const rgbIdx = pixelIndex * 3
      const rgbaIdx = pixelIndex * 4
      rgbaBuffer[rgbaIdx] = rgbData[rgbIdx]
      rgbaBuffer[rgbaIdx + 1] = rgbData[rgbIdx + 1]
      rgbaBuffer[rgbaIdx + 2] = rgbData[rgbIdx + 2]
      rgbaBuffer[rgbaIdx + 3] = alpha
    }
    return new FrameData(rgbaBuffer)
  }

  static cast(value) {
    if (value instanceof FrameData) return value
    return new FrameData(value)
  }

  constructor(...args) {
    let input = FrameData.validateInput(...args)
    super(input)
  }

  colorAt(pixelIndex) {
    // return this.slice(pixelIndex * FrameData.rgbaChannels.length, (pixelIndex + 1) * FrameData.rgbaChannels.length)
    const pixel = new Color(0, 0, 0, 0)
    const byteIdx = pixelIndex * RGBA_CHANNELS.length
    for (let channelIdx = 0; channelIdx < RGBA_CHANNELS.length; channelIdx++) {
      pixel[channelIdx] = this[byteIdx + channelIdx]
    }
    return pixel
  }

  replaceAt(pixelIndex, chunk) {
    // this.set(chunk, pixelIndex * FrameData.rgbaChannels.length)
    if (chunk.length !== RGBA_CHANNELS.length) {
      throw new Error(`Invalid chunk size. Expected ${RGBA_CHANNELS.length}, got ${chunk.length}.`)
    }
    const byteIdx = pixelIndex * RGBA_CHANNELS.length
    for (let channelIdx = 0; channelIdx < RGBA_CHANNELS.length; channelIdx++) {
      this[byteIdx + channelIdx] = chunk[channelIdx]
    }
  }

  toString() {
    return `FrameData(${super.toString()})`
  }
}

function validateInput(...args) {
  let input = args.length > 1 ? [...args] : args[0] // normalize arguments as input to ease further checks
  if (!input) {
    throwBestError(new InvalidFrameDataConstructorValueError('Invalid number of arguments for the FrameData constructor. Expected at least 1, gotten 0.', input))
  } else if (isInt(input)) {
    input = Buffer.alloc(RGBA_CHANNELS.length * input)
  } else if (isIterable(input)) {
    if (!isPositiveInt(input.length) || input.length % RGBA_CHANNELS.length !== 0) {
      throwBestError(new InvalidFrameDataConstructorValueError(`Invalid number of elements for the FrameData constructor. The input size should be a multiple of ${RGBA_CHANNELS.length}, got ${dataLength}.`, input))
    }
  }

  return input
}

function validateFromRgbDataInput(...args) {
  const [input, alpha] = args
  if (!input || !isIterable(input)) {
    throwBestError(new InvalidFrameDataConstructorValueError(`Invalid first arguments for the FrameData.fromRgbData constructor. Expected an iterable, got ${input}.`, input))
  }

  if (!isPositiveInt(input.length) || input.length % RGB_CHANNELS.length !== 0) {
    throwBestError(new InvalidFrameDataConstructorValueError(`Invalid number of elements for the FrameData.fromRgbData constructor. The input size should be a multiple of 3, got ${input.length}.`, input))
  }

  return [input, alpha]
}