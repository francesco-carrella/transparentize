import ExtendableError from 'es6-error'

import packageInfo from '../../package.json';

export class BaseError extends ExtendableError {
  constructor(message, options, originalError) {
    super(message);
    if(options) this.options = options;
    if(originalError) this.originalError = originalError;
  }
}

export class GenericError extends BaseError {
  constructor(options, originalError) {
    const message = `An error occurred. Please report the issue at ${packageInfo.author.email}`;
    super(message, options, originalError)
    this.name = 'GenericError'
  }
}

export class InputFileNotFoundError extends BaseError {
  constructor(inputFile, options) {
    const message = `The input file '${inputFile}' does not exists.`;
    super(message, options)
    this.name = 'InputFileNotFoundError'
    this.inputFile = inputFile
  }
}

export class InputFileNotValidError extends BaseError {
  constructor(inputFile, options) {
    const message = `The file '${inputFile}' does seems to be in a valid ${options.inputFormat} format.`;
    super(message, options)
    this.name = 'InputFileNotValidError'
    this.inputFile = inputFile
  }
}

export class UnsupportedImageFormatError extends BaseError {
  constructor(imageFormatKey, filePath, options) {
    const message = 
      imageFormatKey && filePath ? `Unsupported image format '${imageFormatKey}' for the file '${filePath}'.` :
      imageFormatKey ? `Unsupported image format: '${imageFormatKey}'.` :
      filePath ? `Unsupported image format for the file '${filePath}'.` : 
      `Unsupported image format.`;
    super(message, options)
    this.name = 'UnsupportedImageFormat'
    if(filePath) this.filePath = filePath
    if(imageFormatKey) this.imageFormatKey = imageFormatKey
  }
} 

export class UnsupportedTiffImageFormatError extends BaseError {
  constructor(inputFile, options, originalError) {
    const message = `Unsupported TIFF image format on file ${inputFile}. ${originalError.message}.`;
    super(message, options, originalError)
    this.name = 'UnsupportedTiffImageFormatError'
    if(inputFile) this.inputFile = inputFile
  }
} 

export class OutputPathNotValidError extends BaseError {
  constructor(outputFile, options) {
    const message = `The output file '${outputFile}' is not a valid file path.`;
    super(message, options)
    this.name = 'OutputPathNotValidError'
    this.outputFile = outputFile
  }
}

export class OutputDirectoryNotValidError extends BaseError {
  constructor(outputFile, options) {
    const message = `The output directory '${outputFile}' is not valid.`;
    super(message, options)
    this.name = 'OutputDirectoryNotValidError'
    this.outputFile = outputFile
  }
}

export class OutputDirectoryNotWritableError extends BaseError {
  constructor(outputFile, options) {
    const message = `The output directory '${outputFile}' is not writeable.`;
    super(message, options)
    this.name = 'OutputDirectoryNotWritableError'
    this.outputFile = outputFile
  }
}

export class OutputFileAlreadyExistsError extends BaseError {
  constructor(outputFile, options) {
    const message = `The output file '${outputFile}' already exists.`;
    super(message, options)
    this.name = 'OutputFileAlreadyExistsError'
    this.outputFile = outputFile
  }
}

export class InputFileParseError extends BaseError {
  constructor(inputFile, options, originalError) {
    const message = `Error parsing the input file '${inputFile}'.`;
    super(message, options, originalError)
    this.name = 'InputFileParseError'
    this.inputFile = inputFile
  }
}
export class FileProcessError extends BaseError {
  constructor(inputFile, outputFile, options, originalError) {
    const message = `Error processing the input file '${inputFile}'.`;
    super(message, options, originalError)
    this.name = 'FileProcessError'
    this.inputFile = inputFile
    this.outputFile = outputFile
  }
}

export class ImageProcessError extends BaseError {
  constructor(image, options, originalError) {
    const message = `Error processing the image.`;
    super(message, options, originalError)
    this.name = 'ImageProcessError'
    this.image = image
  }
}

export class WriteOutputFileError extends BaseError {
  constructor(outputFile, options, originalError) {
    const message = `Error writing the output file '${outputFile}'.`;
    super(message, options, originalError)
    this.name = 'WriteOutputFileError'
    this.outputFile = outputFile
  }
}

export function throwBestError(...errors) {
  errors.forEach((error) => {
    if(error instanceof BaseError) {
      throw error;
    }
  })
  throw new GenericError(null, errors[0]);
}