export * from './errors'
export * from './process'

import { whiteColor } from '@transparentize/common/src/utils/colors'

export const defaultOptions = {
  bgColor: whiteColor
}

export function applyDefaultOptions(options = {}) {
  Object.keys(defaultOptions).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultOptions[key]
    }
  })
}