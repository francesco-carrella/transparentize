
export const defaultOptions = {
  allowOverride: false,
  // onReadInputFileStart(inputFilename, options) => { }
  // onReadInputFileEnd(inputFilename, options) => { }
  // onWriteOutputFileStart(outputFile, options) => { }
  // onWriteOutputFileEnd(outputFile, options) => { }
  // onProcessFileStart(fileInstance, options) => { }
  // onProcessFileEnd(fileInstance, options) => { }

  // - inherit by @transparentize/image package
  // backgroundColor: whiteColor,
  // initialBackgroundColor: whiteColor,
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

  return options
}