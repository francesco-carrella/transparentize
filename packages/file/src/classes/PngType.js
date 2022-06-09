import fs from 'fs'
import { encode as encodePng, decode as decodePng } from 'fast-png'

import { readChunk } from '../utils'
import FileExecutor from './FileExecutor'
import FileType from './FileType'


export default class PngType extends FileType {
  static name = 'png'
  static fileExtensions = ['.png']

  static read(filePath) {
    const imageBuffer = fs.readFileSync(filePath)
    return decodePng(imageBuffer)
  }

  static write(image, filePath) {
    const imageData = encodePng(image)
    fs.writeFileSync(filePath, imageData)
  }

  static validate(filePath) {
    const buffer = readChunk(filePath, 8)
    return (
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

  // contructor() {} ???
}

FileExecutor.registerType(PngType)