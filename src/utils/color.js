import { clamp } from './generic';

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
    rgbChannels.every((channel) => (
      typeof color[channel] === 'number' &&
      !isNaN(color[channel]) &&
      color[channel] >= 0 &&
      color[channel] <= 255
    ))
  )
}

export function convertRgbBufferToRgba(rgbBuffer, alpha = 255) {
  const pixelsCount = rgbBuffer.length / 3;
  const rgbaBuffer = new Uint8Array(pixelsCount * 4)
  for (let i = 0; i < pixelsCount; i++) {
    const rgbIdx = i * 3
    const rgbaIdx = i * 4
    rgbaBuffer[rgbaIdx] = rgbBuffer[rgbIdx]
    rgbaBuffer[rgbaIdx + 1] = rgbBuffer[rgbIdx + 1]
    rgbaBuffer[rgbaIdx + 2] = rgbBuffer[rgbIdx + 2]
    rgbaBuffer[rgbaIdx + 3] = alpha
  }
  return rgbaBuffer
}

// return transparent applying the best alpha channel for
export function transparentify(top, bottom) {

  // first of all remove top color alpha multiplying it by the bottom color (mimiking the multiply blend mode)
  if (top.a < 255) {
    rgbChannels.forEach(function (channel) {
      top[channel] = clampColorValue(bottom[channel] + (top[channel] - bottom[channel]) * (top.a / 255))
    })
    top.a = 255
  }

  // find the maximum applicable alpha 
  let maxAlpha = Math.max(...rgbChannels.map(function (channel) {
    return (top[channel] - bottom[channel]) / ((0 < (top[channel] - bottom[channel]) ? 255 : 0) - bottom[channel]) * 255;
  }).filter(a => !isNaN(a)))

  // Calculate the resulting color appling the alpha value
  function transparentifyChannel(channel) {
    if (!maxAlpha) return bottom[channel]
    return clampColorValue(bottom[channel] + (top[channel] - bottom[channel]) / (maxAlpha / 255))
  }

  return {
    r: transparentifyChannel('r'),
    g: transparentifyChannel('g'),
    b: transparentifyChannel('b'),
    a: clampColorValue(maxAlpha)
  }
}