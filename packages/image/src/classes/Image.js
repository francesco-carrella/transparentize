import { isPositiveInt, isIterable, isInt, runWithoutErrors } from '@transparentize/common/src/utils/generics'
import { throwBestError } from '@transparentize/common/src/errors'

import { InvalidImageConstructorAttributeError } from '../errors'
import FrameData from './FrameData'
import Color from './Color'

export default class Image {


  static validateInput = validateInput

  static isValidInput = runWithoutErrors.bind(null, validateInput)

  static cast(value) {
    if (value instanceof Image) return value
    return new Image(value)
  }

  constructor(...args) {
    const { width, height, data } = Image.validateInput(...args)
    this.width = width
    this.height = height
    const pixelsCount = this.width * this.height
    const rgbDataLength = pixelsCount * Color.rgbChannels.length
    this.data = data.length === rgbDataLength ?
      FrameData.fromRgbData(data) :
      FrameData.cast(data)
  }

  toString() {
    return `Image(width: ${this.width}, height: ${this.height}, data: ${this.data.toString()})`
  }
}

function validateInput(...args) {
  if (args.length !== 1) {
    throwBestError(new InvalidImageConstructorAttributeError(`Invalid number of arguments for Image contructor. Expected 1, got ${args.length}`))
  }

  const input = args[0]
  if (!input || typeof input !== 'object') {
    throwBestError(new InvalidImageConstructorAttributeError(`Invalid input value for Image contructor. It should have a structure like { width, height, data }. Got ${input}`))
  }

  let { width, height, data } = input
  if (!isPositiveInt(width)) {
    throwBestError(new InvalidImageConstructorAttributeError(null, 'width', width))
  }
  if (!isPositiveInt(height)) {
    throwBestError(new InvalidImageConstructorAttributeError(null, 'height', height))
  }

  const pixelCount = width * height
  if (data) {
    if (isIterable(data) || isInt(data)) {
      const rgbaDataLength = pixelCount * Color.rgbaChannels.length
      const rgbDataLength = pixelCount * Color.rgbChannels.length
      const dataLength = isIterable(data) ? data.length : data
      if (dataLength !== rgbaDataLength && dataLength !== rgbDataLength) {
        throwBestError(new InvalidImageConstructorAttributeError(
          `Invalid input for attribute 'data' in Image contructor. Expected length of ${rgbaDataLength} (rgba) or ${rgbDataLength} (rgb), got ${data.length}`,
          'data', data
        ))
      }
    } else {
      throwBestError(new InvalidImageConstructorAttributeError(
        `Invalid input value '${data}' for attribute 'data' in Image contructor. It should be an iterable, or a nullish to create an empty image.`,
        'data', data
      ))
    }
  } else {
    data = Buffer.alloc(pixelCount * Color.rgbaChannels.length)
  }

  return { width, height, data }
}