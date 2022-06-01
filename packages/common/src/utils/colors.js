import { clamp } from './generics'

export const rgbChannels = ['r', 'g', 'b']

export const whiteColor = {
  r: 255,
  g: 255,
  b: 255,
  a: 255,
}

export function clampColorValue(colorValue) {
  return Math.round(clamp(colorValue, 255))
}

export function validRgbColor(color) {
  return (
    !!color &&
    typeof color === 'object' &&
    rgbChannels.every((channel) => {
      return (
        typeof color[channel] === 'number' &&
        !isNaN(color[channel]) &&
        color[channel] >= 0 &&
        color[channel] <= 255
      )
    })
  )
}