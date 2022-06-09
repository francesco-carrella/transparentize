import path from 'path'
import isValidFilename from 'valid-filename'

import { runWithoutErrors } from '@transparentize/common/src/utils/generics'
import { callHandler } from '@transparentize/common/src/utils/handlers'
import { Image } from '@transparentize/image/src/classes'

import { getOptions } from '../options'
import { pathExists, isDirectory, isDirectoryWritable } from '../utils'
import {
  throwBestError, InputFileNotFoundError, InputFileNotValidError, InputFileParseError, UnsupportedImageFormatError,
  OutputPathNotValidError, OutputDirectoryNotValidError, OutputDirectoryNotWritableError, OutputFileAlreadyExistsError,
  WriteOutputFileError, FileProcessError
} from '../errors'

import { FileExecutor } from '.'

export default class File {

  static validateInputFile(inputFile, options) {

    if (!pathExists(inputFile)) {
      throwBestError(new InputFileNotFoundError(inputFile, options))
    }

    const fileType = FileExecutor.byFile(inputFile) // TODO rename

    if (!fileType) {
      throwBestError(new UnsupportedImageFormatError(null, inputFile, options))
    }

    if (fileType.validate && !fileType.validate(inputFile)) {
      throwBestError(new InputFileNotValidError(inputFile, options))
    }

    return inputFile
  }

  static validateOutputFile(outputFile, options) {

    const outputDir = path.dirname(outputFile || '.')
    const outputFilename = path.basename(outputFile)

    if (!pathExists(outputDir) || !isDirectory(outputDir)) {
      throwBestError(new OutputDirectoryNotValidError(outputDir, options))
    }

    if (!isDirectoryWritable(outputDir)) {
      throwBestError(new OutputDirectoryNotWritableError(outputDir, options))
    }

    if (!isValidFilename(outputFilename)) {
      throwBestError(new OutputPathNotValidError(outputFile, options))
    }

    if (!options.allowOverride && pathExists(outputFile)) {
      throwBestError(new OutputFileAlreadyExistsError(outputFile, options))
    }

    return outputFile
  }

  static isValidInputFile = runWithoutErrors.bind(null, File.validateInputFile)
  static isValidOutputFile = runWithoutErrors.bind(null, File.validateOutputFile)

  static fromImage(image, outputFile, options) {
    return new File(new Image(image), outputFile, options)
  }

  constructor(inputFileOrImage, outputFile, options) {
    if (inputFileOrImage instanceof Image) {
      this.image = inputFileOrImage
    } else {
      this.inputFile = File.validateInputFile(inputFileOrImage, options)
    }
    this.outputFile = File.validateOutputFile(outputFile, options)
    this.options = options
  }

  read() {
    try {
      callHandler(this.options.onReadInputFileStart, this.inputFile, this.options)

      const imageData = FileExecutor.read(this.inputFile, this.options)
      this.image = new Image(imageData)

      callHandler(this.options.onReadInputFileEnd, this.inputFile, this.options)
    } catch (e) {
      throwBestError(e, new InputFileParseError(this.inputFilename, this.options, e))
    }
  }

  write() {
    try {
      callHandler(this.options.onWriteOutputFileStart, this.outputFile, this.options)

      FileExecutor.write(this.image, this.outputFile, this.options)

      callHandler(this.options.onWriteOutputFileEnd, this.outputFile, this.options)
    } catch (e) {
      throwBestError(e, new WriteOutputFileError(this.outputFile, this.options, e))
    }
  }

  transparentize(options, disableChecks) {
    if (!disableChecks) options = getOptions(options)

    try {
      callHandler(this.options.onProcessFileStart, this, this.options)

      if (!this.image) {
        this.read()
      }

      this.image.transparentize(this.options)

      this.write()

      callHandler(this.options.onProcessFileEnd, this, this.options)

      return this
    } catch (e) {
      throwBestError(e, new FileProcessError(null, this, options, e))
    }
  }

  toString() {
    return `File(inputFile: ${this.inputFile}, outputFile: ${this.outputFile}, options: ${this.options}, image: ${this.image})`
  }
}
