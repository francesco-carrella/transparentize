const fs = require('fs')
const path = require('path')
const { Buffer } = require('node:buffer')
const { program } = require('commander');
const Confirm = require('prompt-confirm');


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

function verifyInputFile(inputFile) {
  if(!fs.existsSync(inputFile)) {
    program.error(`err: The input file '${inputFile}' does not exists. Please check the <input_file> argument and retry.`);
  }
  if (!isValidPng(inputFile)) {
    program.error(`err: The input file '${inputFile}' does not seem to be a valid PNG file. Please check the <input_file> argument and retry.`);
  }
  return true
}

async function verifyOutputFile(outputFile) {
  if(fs.existsSync(outputFile)) {
    await new Confirm(`The file '${outputFile}' already exists. Do you want to overwrite it?`)
      .run()
      .then(function(overrideOutputFile) {
        if(!overrideOutputFile) {
          program.error(`err: The output file '${outputFile}' already exists. Please check the <output_file> argument and retry.`);
        }
      });

  }
}

function createOutputFileName(inputFile) {
  const inputPath = path.dirname(inputFile)
  const inputFileName = path.parse(inputFile).name
  return path.join(inputPath, `${inputFileName}-transparent.png`)
}

function brightnessToColorValue(brightness, inverse = false) {
  const colorValue = Math.round(brightness * 255);
  return inverse ? 255 - colorValue : colorValue;
}

module.exports = {
  verifyInputFile,
  verifyOutputFile,
  createOutputFileName,
  brightnessToColorValue,
}