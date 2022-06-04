import { throwBestError } from '@transparentize/common/src/errors'
import { isInt, isIterable, isObject, isObjectWithKeys, runWithoutErrors } from '@transparentize/common/src/utils/generics'

import { RGBA_CHANNELS, RGB_CHANNELS } from '../constants'
import { InvalidColorConstructorValueError } from '../errors'

export default class Color extends Uint8ClampedArray {

  static rgbaChannels = ['r', 'g', 'b', 'a']
  static rgbaIndexes = [0, 1, 2, 3]
  static rgbChannels = ['r', 'g', 'b']
  static rgbIndexes = [0, 1, 2]

  static validateInput = validateInput
  static isValidInput = runWithoutErrors.bind(null, Color.validateInput)

  static cast(value) {
    if (value instanceof Color) return value
    return new Color(value)
  }

  constructor(...args) {
    let input = Color.validateInput(...args)
    super(input)
  }

  toString() {
    return `Color(${super.toString()})`
  }
}

function validateInput(...args) {
  let input = args.length > 1 ? [...args] : args[0] // normalize arguments as input to ease further checks

  if (isIterable(input)) {
    if (input.length === 3) {   // if it seems an rgb color, add the alpha channel
      input[3] = 255
    }
    if (input.length !== 4) {
      throwBestError(new InvalidColorConstructorValueError(`Invalid number of channels for the Color contructor. Expected ${RGBA_CHANNELS.length}, got ${input.length}`, input))
    }
  } else if (isObject(input)) {
    if (isObjectWithKeys(input, RGB_CHANNELS)) {
      input = RGBA_CHANNELS.map(channel => input[channel])
      if (!isInt(input[3])) input[3] = 255
    } else {
      throwBestError(new InvalidColorConstructorValueError(
        `Invalid value '${JSON.stringify(input)}' as {r,g,b,a?} object for Color constructor.`,
        input
      ))
    }
  } else {
    throwBestError(new InvalidColorConstructorValueError(null, input))
  }

  return input
}
