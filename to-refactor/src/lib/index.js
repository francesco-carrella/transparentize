import { whiteColor } from '../utils/color';

export * from './errors';
export { supportedFormats as supportedImageFormat } from './imageFormats';
export * from './process';
export * from './file';

export const defaultOptions = {
  bgColor: whiteColor
}

export function applyDefaultOptions(options) {
  Object.keys(defaultOptions).forEach(key => {
    if(!options.hasOwnProperty(key)) {
      options[key] = defaultOptions[key];
    }
  })
}