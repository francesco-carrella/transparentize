import { clamp, roundFloat } from './generic';

export const rgbChannels = ['r', 'g', 'b']
// export const rgbaChannels = ['r', 'g', 'b', 'a']

export const whiteColor = {
  r: 255,
  g: 255,
  b: 255,
  a: 1,
}


export function clampColorValue(colorValue) {
  return Math.round(clamp(colorValue, 255))
}

// return transparent applying the best alpha channel for
export function transparentify(top, bottom = whiteColor){

  // first of all remove top color alpha multiplying it by the bottom color (mimiking the multiply blend mode)
  if(top.a < 1) {
    rgbChannels.forEach(function(channel) {
      clampColorValue(top[channel] = bottom[channel] + (top[channel] - bottom[channel]) * top.a)
    })
    top.a = 1
  }

  // find the maximum applicable alpha 
  let maxAlpha = Math.max(...rgbChannels.map(function(channel){
    return (top[channel] - bottom[channel]) / ((0 < (top[channel] - bottom[channel]) ? 255 : 0) - bottom[channel]);
  }))
  maxAlpha = clamp(maxAlpha, 1)

  // Calculate the resulting color appling the alpha value
  function transparentifyChannel(channel) {
    if (!maxAlpha) return bottom[channel]
    return clampColorValue(bottom[channel] + (top[channel] - bottom[channel]) / maxAlpha)
  }

  return {
    r: transparentifyChannel('r'),
    g: transparentifyChannel('g'),
    b: transparentifyChannel('b'),
    a: roundFloat(maxAlpha, 3)
  }
}