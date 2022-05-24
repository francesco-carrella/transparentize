import fs from 'fs';
import path from 'path';
import { Buffer } from 'node:buffer';

import { callIfExistsAsync } from '../utils/generic';
import { InputFileNotFoundError, PngFileNotValidError, throwBestError } from '../lib';

function isValidPng(filePath) {
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

export function verifyInputFile(inputFile, options) {
  if(!fs.existsSync(inputFile)) {
    throwBestError(new InputFileNotFoundError(inputFile, options));
  }
  if (!isValidPng(inputFile)) {
    throwBestError(new PngFileNotValidError(inputFile, options));
  }
  return true
}

export async function verifyOutputFile(outputFile, options) {
  if(fs.existsSync(outputFile)) {
    await callIfExistsAsync(options.onOutputFileExists, outputFile, options);
  }
}

export function createOutputFileName(inputFile) {
  const inputPath = path.dirname(inputFile)
  const inputFileName = path.parse(inputFile).name
  return path.join(inputPath, `${inputFileName}-transparent.png`)
}