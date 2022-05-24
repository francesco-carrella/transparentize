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
    this.name = 'InputFileNotFoundError'
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

export class PngFileNotValidError extends BaseError {
  constructor(pngFile, options) {
    const message = `The file '${pngFile}' does seems to be in a valid png format.`;
    super(message, options)
    this.name = 'InputFileNotValidError'
    this.inputFile = pngFile
  }
}

export class OutputFileExistsError extends BaseError {
  constructor(outputFile, options) {
    const message = `The output file '${outputFile}' already exists.`;
    super(message, options)
    this.name = 'OutputFileExistsError'
    this.outputFile = outputFile
  }
}

export class PngParseError extends BaseError {
  constructor(inputFile, options, originalError) {
    const message = `Error parsing the png input file '${inputFile}'.`;
    super(message, options, originalError)
    this.name = 'PngParseError'
    this.inputFile = inputFile
  }
}
export class PngProcessError extends BaseError {
  constructor(inputFile, outputFile, options, originalError) {
    const message = `Error processing the png input file '${inputFile}'.`;
    super(message, options, originalError)
    this.name = 'PngProcessError'
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