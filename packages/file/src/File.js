import path from 'path'
import isValidFilename from 'valid-filename'

import { Image } from '@transparentize/image/src/classes'

import { runWithoutErrors } from '@transparentize/common/src/utils/generics'
import { callHandler } from '@transparentize/common/src/utils/handlers'
import { throwBestError } from '@transparentize/common/src/errors'

import { getOptions } from './options'
import { pathExists, isDirectory, isDirectoryWritable } from './utils'
import { InputFileNotFoundError, InputFileNotValidError, OutputPathNotValidError, OutputDirectoryNotValidError, OutputDirectoryNotWritableError, OutputFileAlreadyExistsError } from './errors'
import { getBestImageFormatForFile, getImageFormat } from './fileTypes'

export default class File {

  static validateInputFile(inputFile, options) {

    if (!pathExists(inputFile)) {
      throwBestError(new InputFileNotFoundError(inputFile, options))
    }

    // TODO: throw invalid format error if needed

    const imageFormat = getBestImageFormatForFile(inputFile)
    if (imageFormat.validate && !imageFormat.validate(inputFile)) {
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

  static validateInput(inputFile, outputFile, options) {
    this.validateInputFile(inputFile, options)
    this.validateOutputFile(outputFile, options)
  }

  static isValidInputFile = runWithoutErrors.bind(null, File.validateInputFile)
  static isValidOutputFile = runWithoutErrors.bind(null, File.validateOutputFile)
  static isValidInput = runWithoutErrors.bind(null, File.validateInput)

  constructor(inputFile, outputFile, options) {
    File.validateInput(inputFile, outputFile, options)
    this.inputFile = inputFile
    this.outputFile = outputFile
    this.options = options
  }

  read() {
    // try {
    // callIfExists(options.onReadInputFileStart, inputFilename, options)

    const inputImageFormat = getBestImageFormatForFile(this.inputFile, this.options)
    const imageData = inputImageFormat.read(this.inputFile, this.options)
    this.image = new Image(imageData)

    // callIfExists(options.onReadInputFileEnd, inputFilename, options)
    // } catch (e) {
    //   throwBestError(e, new InputFileParseError(inputFilename, options, e))
    // }
  }

  write() {
    // try {
    const outputImageFormat = getImageFormat('png')
    // callIfExists(options.onWriteOutputFileStart, outputFile, options)

    outputImageFormat.write(this.image, this.outputFile, this.options)

    // callIfExists(options.onWriteOutputFileEnd, outputFile, options)
    // } catch (e) {
    //   throwBestError(e, new WriteOutputFileError(outputFile, options, e))
    // }
  }

  transparentize(options, disableChecks) {
    if (!disableChecks) options = getOptions(options)

    // try {
    if (options.onProcessFileStart) {
      [options] = callHandler(options.onProcessFileStart, this, options)
    }

    this.read()

    this.image.transparentize(this.options)

    this.write()

    if (options.onProcessFileEnd) {
      [options] = callHandler(options.onProcessFileEnd, this, options)
    }

    return this
    // } catch (e) {
    // throwBestError(e, new FileProcessError(null, this, options, e))
    // }
  }

  // toString() {
  //   return `File(width: ${this.width}, height: ${this.height}, data: ${this.data})`
  // }
}
