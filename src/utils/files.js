import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { isAbsolutePath as isValidNominalPathValidator } from 'path-validation'

import { getImageFormat } from '../lib/imageFormats';
import { throwBestError, InputFileNotFoundError, InputFileNotValidError, OutputFileAlreadyExistsError, OutputPathNotValidError, OutputDirectoryNotValidError, OutputDirectoryNotWritableError } from '../lib';

export const readFileAsync = promisify(fs.readFile)
export const writeFileAsync = promisify(fs.writeFile)

export function absolutePath(inPath = '.') {
  return path.resolve(inPath)
}

export function isValidNominalPath(inPath) {
  return isValidNominalPathValidator(absolutePath(inPath))
}

export function pathExists(inPath) {
  return fs.existsSync(inPath)
}

export function isDirectory(dirPath) {
  return pathExists(dirPath) && fs.lstatSync(dirPath).isDirectory()
}

export function isFile(filePath) {
  return pathExists(filePath) && fs.lstatSync(filePath).isFile()
}

export function isDirectoryWritable(dirPath) {
  try {
    fs.accessSync(dirPath, fs.constants.W_OK)
    return true
  } catch (e) {
    return false
  }
}

export function getFileExtension(filePath, withDot = true) {
  return unifyFileExtension(path.extname(filePath), withDot)
}

export function isFileExtension (filePath, extension) {
  return path.extname(filePath) === unifyFileExtension(extension, true)
}

export function ensureFileExtension(filePath, extension) {
  extension = unifyFileExtension(extension, true)
  if(!isFileExtension(filePath, extension)) {
    const { name, dir } = path.parse(filePath)
    filePath = path.join(dir, `${name}${extension}`)
  }
  return filePath
}

export function unifyFileExtension(fileExtension, withDot = true) {
  if(!fileExtension) return ''
  const dotRE = /^\./;
  if(withDot && !dotRE.test(fileExtension)) {
    fileExtension = `.${fileExtension}`;
  } else if(!withDot && dotRE.test(fileExtension)) {
    fileExtension = fileExtension.replace(dotRE, '');
  }
  return fileExtension
}

export function verifyInputFile(inputFile, options) {
  if(!pathExists(inputFile)) {
    throwBestError(new InputFileNotFoundError(inputFile, options));
  }
  const imageFormat = getImageFormat(options.inputFormat);
  if(imageFormat.validate && !imageFormat.validate(inputFile)) {
    throwBestError(new InputFileNotValidError(inputFile, options));
  }
  return true
}

export function verifyOutputFile(outputFile, options) {
  return (
    verifyOutputFileNominalPath(outputFile, options) &&
    verifyOutputDirectory(outputFile, options) &&
    verifyOutputFileDontExists(outputFile, options)
  )
}

export function verifyOutputFileNominalPath(outputFile, options) {
  if(!isValidNominalPath(outputFile)) {
    throwBestError(new OutputPathNotValidError(outputFile, options));
  }
  return true
}

export function verifyOutputDirectory(outputFile, options) {
  const outputDir = path.dirname(outputFile || '.')
  if(!pathExists(outputDir) || !isDirectory(outputDir)) {
    throwBestError(new OutputDirectoryNotValidError(outputDir, options));
  }
  if(!isDirectoryWritable(outputDir)) {
    throwBestError(new OutputDirectoryNotWritableError(outputDir, options));
  }
  return true
}

export function verifyOutputFileDontExists(outputFile, options) {
  if(!options.allowOverride && pathExists(outputFile)) {  
    throwBestError(new OutputFileAlreadyExistsError(outputFile, options))
  }
  return true
}
