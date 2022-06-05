export * from '@transparentize/common/src/errors'

import { BaseError } from '@transparentize/common/src/errors.js'

export class InvalidImageError extends BaseError {
  constructor(message, input, options, originalError) {
    if (!message) message = `Invalid Image with input '${input}'.`
    super(message, options, originalError)
    this.name = 'InvalidImageError'
    this.input = input
  }
}

export class InvalidFrameDataError extends BaseError {
  constructor(message, input, options, originalError) {
    if (!message) message = `Invalid FrameData with input '${input}'.`
    super(message, options, originalError)
    this.name = 'InvalidFrameDataError'
    this.input = input
  }
}

export class InvalidColorError extends BaseError {
  constructor(message, input, options, originalError) {
    if (!message) message = `Invalid Color with input '${input}'.`
    super(message, options, originalError)
    this.name = 'InvalidColorError'
    this.input = input
  }
}

export class ImageProcessError extends BaseError {
  constructor(message, image, options, originalError) {
    if (!message) message = 'Error processing the image.'
    super(message, options, originalError)
    this.name = 'ImageProcessError'
    this.image = image
  }
}

export class FrameDataProcessError extends BaseError {
  constructor(message, frameData, options, originalError) {
    if (!message) message = 'Error processing the frame data.'
    super(message, options, originalError)
    this.name = 'FrameDataProcessError'
    this.frameData = frameData
  }
}

export class ColorProcessError extends BaseError {
  constructor(message, color, options, originalError) {
    if (!message) message = 'Error processing the color.'
    super(message, options, originalError)
    this.name = 'ColorProcessError'
    this.color = color
  }
}

export class InvalidBackgroundColorError extends BaseError {
  constructor(message, input, options, originalError) {
    if (!message) message = `Invalid Background Color with input '${input}'.`
    super(message, options, originalError)
    this.name = 'InvalidBackgroundColorError'
    this.input = input
  }
}

export class UnsupportedBackgroundColorAlphaError extends BaseError {
  constructor(message, input, options, originalError) {
    if (!message) message = `Unsupported Background Color with (semi)transparent Alpha Channel for input '${input}'.`
    super(message, options, originalError)
    this.name = 'UnsupportedBackgroundColorAlphaError'
    this.input = input
  }
}