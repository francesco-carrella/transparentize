import { BaseError } from '@transparentize/common/src/errors.js'

export class ImageProcessError extends BaseError {
  constructor(image, options, originalError) {
    const message = 'Error processing the image.'
    super(message, options, originalError)
    this.name = 'ImageProcessError'
    this.image = image
  }
}

export class InvalidColorError extends BaseError {
  constructor(color, options, originalError) {
    const message = `Invalid color: '${JSON.stringify(color)}'.`
    super(message, options, originalError)
    this.name = 'InvalidColorError'
    this.color = color
  }
}

export class InvalidBgColorError extends BaseError {
  constructor(bgColor, options, originalError) {
    const message = `Invalid background color: '${JSON.stringify(bgColor)}'.`
    super(message, options, originalError)
    this.name = 'InvalidBgColorError'
    this.bgColor = bgColor
  }
}

export class UnsupportedBgColorAlphaError extends BaseError {
  constructor(bgColor, options, originalError) {
    const message = `Background color with alpha are not supported: '${JSON.stringify(bgColor)}'.`
    super(message, options, originalError)
    this.name = 'UnsupportedBgColorAlphaError'
    this.bgColor = bgColor
  }
}