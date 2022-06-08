import { Color } from './classes'

export const whiteColor = Color.from([255, 255, 255, 255])

export const defaultOptions = {
  backgroundColor: whiteColor,
  initialBackgroundColor: whiteColor,
  // onProcessImageStart (image, options) => [image, options] | undefined
  // onProcessImageEnd (image, options) => [image, options] | undefined
  // onProcessFrameDataStart (frameData, options) => [frameData, options] | undefined
  // onProcessFrameDataEnd (frameData, options) => [frameData, options] | undefined
  // onProcessColorStart (frameData, pixelIdx, options) => [frameData, pixelIdx, options] | undefined
  // onProcessColorEnd (frameData, pixelIdx, options) => [frameData, pixelIdx, options] | undefined
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