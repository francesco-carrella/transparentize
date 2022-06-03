import ExtendableError from 'es6-error'

import mainPackageInfo from '../../../package.json'

export function throwBestError(...errors) {
  errors.forEach((error) => {
    if (error instanceof BaseError) {
      throw error
    }
  })
  throw new GenericError(null, errors[0])
}

export class BaseError extends ExtendableError {
  constructor(message, options, originalError) {
    super(message)
    if (options) this.options = options
    if (originalError) this.originalError = originalError
  }
}

export class GenericError extends BaseError {
  constructor(message, options, originalError) {
    if (!message) message = `An error occurred. Please report the issue at ${mainPackageInfo.author.email}`
    super(message, options, originalError)
    this.name = 'GenericError'
  }
}