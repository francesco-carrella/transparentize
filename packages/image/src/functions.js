import { Color } from './classes'

export function solidifyColor(frontColor, backgroundColor) {
  (Color.rgbIndexes).forEach(function (channel) {
    frontColor[channel] = backgroundColor[channel] + (frontColor[channel] - backgroundColor[channel]) * (frontColor[3] / 255)
  })
  frontColor[3] = 255

  return frontColor
}

export function transparentizeColor(frontColor, backgroundColor) {
  // find the maximum applicable alpha
  let maxAlpha = Math.max(...Color.rgbIndexes.map(function (channel) {
    return (
      (frontColor[channel] - backgroundColor[channel]) / ((frontColor[channel] - backgroundColor[channel] > 0 ? 255 : 0) - backgroundColor[channel]) * 255 //eslint-disable-line max-len
    )
  }).filter(a => !isNaN(a)))

  // Calculate the resulting color applying the alpha value
  Color.rgbIndexes.forEach(function (channel) {
    frontColor[channel] = !maxAlpha ?
      backgroundColor[channel] :
      backgroundColor[channel] + (frontColor[channel] - backgroundColor[channel]) / (maxAlpha / 255)
  })
  frontColor[3] = maxAlpha

  return frontColor
}