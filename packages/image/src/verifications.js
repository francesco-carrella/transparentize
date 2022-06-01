import { validRgbColor } from '@transparentize/common/src/utils/colors.js'
import { throwBestError } from '@transparentize/common/src/errors.js'

import { InvalidColorError, InvalidBgColorError, UnsupportedBgColorAlphaError } from './errors.js'

export function verifyColor(color, options) {
  if (!validRgbColor(color)) {
    throwBestError(new InvalidColorError(color, options))
  }
}

export function verifyBgColor(bgColor, options) {
  if (!validRgbColor(bgColor)) {
    throwBestError(new InvalidBgColorError(bgColor, options))
  }
  if (bgColor.a < 255) {
    throwBestError(new UnsupportedBgColorAlphaError(bgColor, options))
  }
}