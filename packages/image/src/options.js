import { Color } from './classes'

export const whiteColor = new Color([255, 255, 255, 255])

export const defaultOptions = {
  backgroundColor: whiteColor,
  initialBackgroundColor: whiteColor,
}

export function getOptions(options = {}) {
  for (let key in defaultOptions) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultOptions[key]
    }
  }
  return options
}