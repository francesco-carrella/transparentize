
export const defaultOptions = {
  // backgroundColor: whiteColor,
  // initialBackgroundColor: whiteColor,
  // onProcessFIleStart (input, output, options) => [input, options] | undefined
  // onProcessFIleEnd (input, output, options) => [input, output, options] | undefined
  // onReadFileStart (input, options) => [input, options] | undefined
  // onReadFileEnd (input, options) => [input, options] | undefined
  // onWriteFileStart (output, options) => [input, options] | undefined
  // onWriteFileEnd (output, options) => [output, options] | undefined
  // async onOutputFileExists(output, options)
}

export function getOptions(options = {}) {
  for (let key in defaultOptions) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) {
      options[key] = defaultOptions[key]
    }
  }

  // TODO: normalize options

  return options
}