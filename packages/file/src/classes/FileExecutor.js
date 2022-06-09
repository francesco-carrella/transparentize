import { throwBestError, UnsupportedImageFormatError } from '../errors'
import { formatFileExtension, getFileExtension } from '../utils'

export default class FileExecutor {

  static _types = []

  static get types() {
    return this._types.map((type) => type.name)
  }

  static registerType(typeClass) {
    FileExecutor._types.push(typeClass)
  }

  static byName(name) {
    return FileExecutor._types.find((type) => type.name === name)
  }

  static byExtension(extension) {
    return this._types.find((type) => type.supportExtension(extension))
  }

  static byValidator(filePath) {
    return this._types.find((type) => type.validate(filePath))
  }

  static byFile(filePath) {
    const fileExtension = formatFileExtension(getFileExtension(filePath), true)
    const bestByExtension = this.byExtension(fileExtension)
    const bestByValidator = this.byValidator(filePath)
    const bestOverall = (bestByExtension === bestByValidator) ? bestByExtension : undefined
    return (bestOverall || bestByValidator || bestByExtension)
  }

  static read(filePath, options) {
    return this
      .byFile(filePath, options)
      .read(filePath, options)
  }

  static write(image, filePath, options) {
    return this
      .byName('png')   // only png is supported as output type
      .write(image, filePath, options)
  }

}