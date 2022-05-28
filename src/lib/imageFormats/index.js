import { getFileExtension, unifyFileExtension } from '../../utils/files';
import { UnsupportedImageFormat } from '../errors';
import png from './png';

export const imageFormats = {
  png,
};

export function getImageFormat(formatKey, options) {
  if(!imageFormats[formatKey]) {
    throw new UnsupportedImageFormat(formatKey, null, options);
  }
  return imageFormats[formatKey];
}

function imageFormatHasExtension(imageFormat, extension) {
  if(!imageFormat || !imageFormat.fileExtensions) return false
  extension = unifyFileExtension(extension, true)
  return !!imageFormat.fileExtensions.find(imageFormatExtension => {
    return unifyFileExtension(imageFormatExtension, true) === extension
  })
}

function imageFormatIsValid(imageFormat, filePath) {
  if(!imageFormat || !imageFormat.validate) return false
  return imageFormat.validate(filePath)
}

export function getBestImageFormatNameForFile(filePath, options) {
  let bestByValidator
  let bestByExtension
  const bestOverall = Object.keys(imageFormats).find(imageFormatKey => {
    const imageFormat = getImageFormat(imageFormatKey);
    const isValidByExtension = imageFormatHasExtension(imageFormat, getFileExtension(filePath, true))
    const isValidByValidator = imageFormatIsValid(imageFormat, filePath)
    if(isValidByExtension && isValidByValidator) return true
    if(isValidByExtension && !bestByExtension) bestByExtension = imageFormatKey
    if(isValidByValidator && !bestByValidator) bestByValidator = imageFormatKey
  })
  const best = bestOverall || bestByValidator || bestByExtension
  if(best) return best
  throw new UnsupportedImageFormat(null, filePath, options);
}