import fs from 'fs';
import { promisify } from 'util';
import path from 'path';
import { Buffer } from 'node:buffer';

import { callIfExistsAsync, isFunction } from '../utils/generic';
import { throwBestError, InputFileNotFoundError, PngFileNotValidError, OutputFileExistsError } from '../lib';

export const readFileAsync = promisify(fs.readFile)
export const writeFileAsync = promisify(fs.writeFile)

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

export function fileExists(filePath) {
  return fs.existsSync(filePath)
}

export function verifyInputFile(inputFile, options) {
  if(!fileExists(inputFile)) {
    throwBestError(new InputFileNotFoundError(inputFile, options));
  }
  if (!isValidPng(inputFile)) {
    throwBestError(new PngFileNotValidError(inputFile, options));
  }
  return true
}

export async function verifyOutputFile(outputFile, options) {
  const outputFileAlreadyExists = fileExists(outputFile);
  if(outputFileAlreadyExists) {
    if(isFunction(options.onOutputFileExists)) {
      const overrideOutputFile = await callIfExistsAsync(options.onOutputFileExists, outputFile, options);
      if(!overrideOutputFile) {
        throwBestError(new OutputFileExistsError(outputFile, options))
      }
    }
  }
}

export function createOutputFileName(inputFile) {
  const inputPath = path.dirname(inputFile)
  const inputFileName = path.parse(inputFile).name
  return path.join(inputPath, `${inputFileName}-transparent.png`)
}