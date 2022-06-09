import { throwBestError, GenericError } from '../errors'

import { formatFileExtension } from '../utils'

export default class FileType {

  static supportExtension(extension) {
    if (this === FileType) {
      throw 'supportExtension method cannot be accessed on the base FileType class' //TODO: better error
    }

    extension = formatFileExtension(extension, true)
    return this.fileExtensions.some(typeExtensions => {
      return extension === formatFileExtension(typeExtensions, true)
    })
  }

  // To implement in each of the FileType extensions classes
  static name = undefined

  static fileExtensions = []

  static validate(filePath) {
    // TODO: better error
    throwBestError(new GenericError('Unsupported write for this format'))
  }

  static read(filePath) {
    throwBestError(new GenericError('Unsupported read for this format'))
  }

  static write(image, outputFile) {
    // TODO: better error
    throwBestError(new GenericError('Unsupported write for this format'))
  }

  // contructor() {} ???
}

// FileTypes.registerType( FileTypeExtension )