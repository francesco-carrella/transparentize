import fs from 'fs'
import path from 'path'
import { Buffer } from 'node:buffer'

export function absolutePath(inPath = '.') {
  return path.resolve(inPath)
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
  return formatFileExtension(path.extname(filePath), withDot)
}

export function isFileExtension(filePath, extension) {
  return path.extname(filePath) === formatFileExtension(extension, true)
}

export function ensureFileExtension(filePath, extension) {
  extension = formatFileExtension(extension, true)
  if (!isFileExtension(filePath, extension)) {
    const { name, dir } = path.parse(filePath)
    filePath = path.join(dir, `${name}${extension}`)
  }
  return filePath
}

export function formatFileExtension(fileExtension, withDot = true) {
  if (!fileExtension) return ''
  const dotRE = /^\./
  if (withDot && !dotRE.test(fileExtension)) {
    fileExtension = `.${fileExtension}`
  } else if (!withDot && dotRE.test(fileExtension)) {
    fileExtension = fileExtension.replace(dotRE, '')
  }
  return fileExtension
}

export function readChunk(filePath, length) {
  let buffer = Buffer.alloc(length)
  const fileDescriptor = fs.openSync(filePath, 'r')
  try {
    const bytesRead = fs.readSync(fileDescriptor, buffer, { length })
    if (bytesRead < length) {
      buffer = buffer.slice(0, bytesRead)
    }
    return buffer
  } finally {
    fs.closeSync(fileDescriptor)
  }
}
