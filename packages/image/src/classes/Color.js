import { GenericError, throwBestError } from '@transparentize/common/src/errors'
import { isInt, isIterable, isObjectWithKeys, runWithoutErrors } from '@transparentize/common/src/utils/generics'

import { RGBA_CHANNELS, RGB_CHANNELS, ALPHA_INDEX } from '../constants'
import { InvalidColorError, InvalidBackgroundColorError, UnsupportedBackgroundColorAlphaError } from '../errors'

export default class Color {

  static validateInput(...args) {
    let input = args.length > 1 ? [...args] : args[0] // normalize arguments as input to ease further checks

    if (isObjectWithKeys(input, RGB_CHANNELS)) {
      input = RGBA_CHANNELS.map(channel => input[channel])
      if (!isInt(input[ALPHA_INDEX])) input[ALPHA_INDEX] = 255
    } else if (isIterable(input) && input.length === RGB_CHANNELS.length) {   // if it seems an rgb color, add the alpha channel
      input[ALPHA_INDEX] = 255
    }

    // TODO: add [[r,g,b], 127] and [{r,g,b}, 127] for custom alpha ?

    if (!input || !isIterable(input) || input.length !== RGBA_CHANNELS.length) {
      throwBestError(new InvalidColorError(null, input))
    }

    return input
  }

  static validateInputForBackground(...args) {
    let input
    try {
      input = Color.validateInput(...args)
    } catch (e) {
      throwBestError(new InvalidBackgroundColorError(null, args, null, e))
    }
    if (input[ALPHA_INDEX] < 255) {
      throwBestError(new UnsupportedBackgroundColorAlphaError(null, input, null))
    }
    return input
  }

  static isValidInput = runWithoutErrors.bind(null, Color.validateInput)
  static isValidInputForBackground = runWithoutErrors.bind(null, Color.validateInputForBackground)

  static from(...args) {
    const input = Color.validateInput(...args)
    if (input instanceof Buffer) return input
    return Buffer.from(input)
  }

  static fromBackground(...args) {
    const input = Color.validateInputForBackground(...args)
    if (input instanceof Buffer) return input
    return Buffer.from(input)
  }

  static clone(...args) {
    const input = Color.validateInput(...args)
    if (!(input instanceof Buffer)) {
      throwBestError(new InvalidColorError(null, input))
    }
    return Buffer.from(input)
  }

  constructor() {
    throw new GenericError('Color is an static class and cannot be instantiated. Use .from() instead in order to create a new Color<Buffer>.')
  }
}
