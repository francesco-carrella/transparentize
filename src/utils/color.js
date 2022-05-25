import { clamp, roundFloat } from './generic';

export const whiteColor = {
  r: 255,
  g: 255,
  b: 255,
}

export function normalizeColorValue(colorValue) {
  return Math.round(clamp(colorValue, 255))
}

export function transparentify(top, bottom = whiteColor){

  let maxAlpha = Math.max(...['r', 'g', 'b'].map(function(channel){
    return (top[channel] - bottom[channel]) / ((0 < (top[channel] - bottom[channel]) ? 255 : 0) - bottom[channel]);
  }))

  maxAlpha = clamp(maxAlpha, 1)

  // Calculate the resulting color
  function processChannel(channel) {
    if (!maxAlpha) {
      return bottom[channel]
    } else {
      return bottom[channel] + (top[channel] - bottom[channel]) / maxAlpha
    }
  }

  return {
    r: normalizeColorValue(processChannel('r')),
    g: normalizeColorValue(processChannel('g')),
    b: normalizeColorValue(processChannel('b')),
    a: roundFloat(maxAlpha, 2)
  }
}