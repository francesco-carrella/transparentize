import { BaseError } from '@transparentize/common/src/errors.js'

export class InvalidColorConstructorValueError extends BaseError {
  constructor(message, valueContructor, options, originalError) {
    if (!message) message = valueContructor ?
      `Invalid input value '${valueContructor}' in Color contructor.` :
      'Invalid input value for Color contructor.'
    super(message, options, originalError)
    this.name = 'InvalidColorConstructorValueError'
    this.valueContructor = valueContructor
  }
}

export class InvalidFrameDataConstructorValueError extends BaseError {
  constructor(message, valueContructor, options, originalError) {
    if (!message) message = valueContructor ?
      `Invalid input value '${valueContructor}' in FrameData contructor.` :
      'Invalid input value for FrameData contructor.'
    super(message, options, originalError)
    this.name = 'InvalidFrameDataConstructorValueError'
    this.valueContructor = valueContructor
  }
}

export class InvalidImageConstructorAttributeError extends BaseError {
  constructor(message, attributeName, attributeValue, options, originalError) {
    if (!message) message = attributeName ?
      `Invalid input value '${attributeValue}' for attribute '${attributeName}' in Image contructor.` :
      'Invalid input value for Image contructor.'
    super(message, options, originalError)
    this.name = 'InvalidImageConstructorAttributeError'
    this.attributeName = attributeName
    this.attributeValue = attributeValue
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
  constructor(message, frontColor, backgroundColor, options, originalError) {
    if (!message) message = 'Error processing the color.'
    super(message, options, originalError)
    this.name = 'ColorProcessError'
    this.frontColor = frontColor
    this.backgroundColor = backgroundColor
  }
}

export class UnsupportedBackgroundColorAlphaError extends BaseError {
  constructor(message, color, options, originalError) {
    if (!message) message = `Background color with alpha are not supported (yet): '${color}'.`
    super(message, options, originalError)
    this.name = 'UnsupportedBackgroundColorAlphaError'
    this.color = color
  }
}



// export class InvalidColorError extends BaseError {
//   constructor(color, options, originalError) {
//     const message = `Invalid color: '${JSON.stringify(color)}'.`
//     super(message, options, originalError)
//     this.name = 'InvalidColorError'
//     this.color = color
//   }
// }

// export class InvalidBgColorError extends BaseError {
//   constructor(bgColor, options, originalError) {
//     const message = `Invalid background color: '${JSON.stringify(bgColor)}'.`
//     super(message, options, originalError)
//     this.name = 'InvalidBgColorError'
//     this.bgColor = bgColor
//   }
// }
