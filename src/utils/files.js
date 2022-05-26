import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { Buffer } from 'node:buffer';
import { isAbsolutePath as isValidNominalPathValidator } from 'path-validation'

import { throwBestError, InputFileNotFoundError, PngFileNotValidError, OutputFileAlreadyExistsError, OutputPathNotValidError, OutputDirectoryNotValidError, OutputDirectoryNotWritableError } from '../lib';

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

export function isFileExtension (filePath, extension) {
  return path.extname(filePath) === extension
}

export function ensureFileExtension(filePath, extension = '') {
  if(!isFileExtension(filePath, extension)) {
    const { name, dir } = path.parse(filePath)
    filePath = path.join(dir, `${name}${extension}`)
  }
  return filePath
}

export function verifyInputFile(inputFile, options) {
  if(!pathExists(inputFile)) {
    throwBestError(new InputFileNotFoundError(inputFile, options));
  }
  if (!isValidPng(inputFile)) {
    throwBestError(new PngFileNotValidError(inputFile, options));
  }
  return true
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

export function verifyOutputFile(outputFile, options) {
  return (
    verifyOutputFileNominalPath(outputFile, options) &&
    verifyOutputDirectory(outputFile, options) &&
    verifyOutputFileDontExists(outputFile, options)
  )
}

export function isValidPng(filePath) {
  let buffer = Buffer.alloc(8);
  const fileDescriptor = fs.openSync(filePath, 'r');
  const bytesRead = fs.readSync(fileDescriptor, buffer, { length: 8 });

  return (
    bytesRead === 8 &&
	  buffer[0] === 0x89 &&
		buffer[1] === 0x50 &&
		buffer[2] === 0x4E &&
		buffer[3] === 0x47 &&
		buffer[4] === 0x0D &&
		buffer[5] === 0x0A &&
		buffer[6] === 0x1A &&
		buffer[7] === 0x0A
  )
}