export * from '@transparentize/image/src/errors'

import { BaseError } from '@transparentize/common/src/errors'


// export class InvalidPathError extends BaseError {
//   constructor(message, path, options, originalError) {
//     if (!message) message = `Invalid path '${path}'.`
//     super(message, options, originalError)
//     this.name = 'InvalidPathError'
//     this.path = path
//   }
// }

export class ImageProcessError extends BaseError {
  constructor(image, options, originalError) {
    const message = 'Error processing the image.'
    super(message, options, originalError)
    this.name = 'ImageProcessError'
    this.image = image
  }
}

// export class InvalidBgColorError extends BaseError {
//   constructor(bgColor, options, originalError) {
//     const message = `Invalid background color: '${JSON.stringify(bgColor)}'.`
//     super(message, options, originalError)
//     this.name = 'InvalidBgColorError'
//     this.bgColor = bgColor
//   }
// }

// export class InvalidBgColorAlphaError extends BaseError {
//   constructor(bgColor, options, originalError) {
//     const message = `Background color with alpha are not supported: '${JSON.stringify(bgColor)}'.`
//     super(message, options, originalError)
//     this.name = 'InvalidBgColorAlphaError'
//     this.bgColor = bgColor
//   }
// }

export class FileProcessError extends BaseError {
  constructor(inputFile, options, originalError) {
    const message = `The input file '${inputFile}' does not exists.`
    super(message, options, originalError)
    this.name = 'FileProcessError'
    this.inputFile = inputFile
  }
}

export class InputFileNotFoundError extends BaseError {
  constructor(inputFile, options, originalError) {
    const message = `The input file '${inputFile}' does not exists.`
    super(message, options, originalError)
    this.name = 'InputFileNotFoundError'
    this.inputFile = inputFile
  }
}

export class InputFileNotValidError extends BaseError {
  constructor(inputFile, options, originalError) {
    const message = `The file '${inputFile}' does seems to be in a valid ${options.inputFormat} format.`
    super(message, options, originalError)
    this.name = 'InputFileNotValidError'
    this.inputFile = inputFile
  }
}

export class InputFileParseError extends BaseError {
  constructor(inputFile, options, originalError) {
    const message = `Error parsing the input file '${inputFile}'.`
    super(message, options, originalError)
    this.name = 'InputFileParseError'
    this.inputFile = inputFile
  }
}

export class UnsupportedImageFormatError extends BaseError {
  constructor(imageFormatKey, filePath, options, originalError) {
    const message =
      imageFormatKey && filePath ? `Unsupported image format '${imageFormatKey}' for the file '${filePath}'.` :
        imageFormatKey ? `Unsupported image format: '${imageFormatKey}'.` :
          filePath ? `Unsupported image format for the file '${filePath}'.` :
            'Unsupported image format.'
    super(message, options, originalError)
    this.name = 'UnsupportedImageFormat'
    if (filePath) this.filePath = filePath
    if (imageFormatKey) this.imageFormatKey = imageFormatKey
  }
}

// export class UnsupportedTiffImageFormatError extends BaseError {
//   constructor(inputFile, options, originalError) {
//     const message = `Unsupported TIFF image format on file ${inputFile}. ${originalError.message}.`
//     super(message, options, originalError)
//     this.name = 'UnsupportedTiffImageFormatError'
//     if (inputFile) this.inputFile = inputFile
//   }
// }

// export class InvalidTiffPageError extends BaseError {
//   constructor(inputFile, documentPages, options, originalError) {
//     const message = `Invalid page '${options.page}'. The input file '${inputFile}' has ${documentPages} pages.`
//     super(message, options, originalError)
//     this.name = 'InvalidTiffPageError'
//     if (inputFile) this.inputFile = inputFile
//     if (documentPages) this.documentPages = documentPages
//   }
// }

export class OutputPathNotValidError extends BaseError {
  constructor(outputFile, options, originalError) {
    const message = `The output file '${outputFile}' is not a valid file path.`
    super(message, options, originalError)
    this.name = 'OutputPathNotValidError'
    this.outputFile = outputFile
  }
}

export class OutputDirectoryNotValidError extends BaseError {
  constructor(outputFile, options, originalError) {
    const message = `The output directory '${outputFile}' is not valid.`
    super(message, options, originalError)
    this.name = 'OutputDirectoryNotValidError'
    this.outputFile = outputFile
  }
}

export class OutputDirectoryNotWritableError extends BaseError {
  constructor(outputFile, options, originalError) {
    const message = `The output directory '${outputFile}' is not writeable.`
    super(message, options, originalError)
    this.name = 'OutputDirectoryNotWritableError'
    this.outputFile = outputFile
  }
}

export class OutputFileAlreadyExistsError extends BaseError {
  constructor(outputFile, options, originalError) {
    const message = `The output file '${outputFile}' already exists.`
    super(message, options, originalError)
    this.name = 'OutputFileAlreadyExistsError'
    this.outputFile = outputFile
  }
}

export class WriteOutputFileError extends BaseError {
  constructor(outputFile, options, originalError) {
    const message = `Error writing the output file '${outputFile}'.`
    super(message, options, originalError)
    this.name = 'WriteOutputFileError'
    this.outputFile = outputFile
  }
}