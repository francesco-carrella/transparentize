import { Color } from './classes'

export const whiteColor = Color.from([255, 255, 255, 255])

export const defaultOptions = {
  backgroundColor: whiteColor,
  initialBackgroundColor: whiteColor,
  // onProcessImageStart: (image, options) => { }
  // onProcessImageEnd: (image, options) => { }
  // onProcessFrameDataStart: (frameData, options) => { }
  // onProcessFrameDataEnd: (frameData, options) => { }
  // onProcessPixelStart: (frameData, pixelIdx, options) => { }
  // onProcessPixelEnd: (frameData, pixelIdx, options) => { }
}

export function getOptions(options = {}) {
  for (let key in defaultOptions) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultOptions[key]
    }
  }

  options.backgroundColor = Color.fromBackground(options.backgroundColor)
  if (options.initialBackgroundColor) {
    options.initialBackgroundColor = Color.fromBackground(options.initialBackgroundColor)
  }

  return options
}