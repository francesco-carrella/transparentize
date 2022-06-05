import { RGB_INDEXES, RGBA_INDEXES, ALPHA_INDEX } from './constants'

export function solidifyColor(frameData, pixelIdx, backgroundColor) {
  const pixelStartPos = pixelIdx * RGBA_INDEXES.length
  const pixelAlphaPos = pixelStartPos + ALPHA_INDEX

  for (let channelPos = 0; channelPos < RGB_INDEXES.length; channelPos++) {
    const pixelChannelPos = pixelStartPos + channelPos
    frameData[pixelChannelPos] = backgroundColor[channelPos] + (frameData[pixelChannelPos] - backgroundColor[channelPos]) * (frameData[pixelAlphaPos] / 255) //eslint-disable-line max-len
  }
  frameData[pixelAlphaPos] = 255
}


export function transparentizeColor(frameData, pixelIdx, backgroundColor) {
  const pixelStartPos = pixelIdx * RGBA_INDEXES.length

  // find the maximum applicable alpha
  let maxAlpha = 0
  for (let channelPos = 0; channelPos < RGB_INDEXES.length; channelPos++) {
    const pixelChannelPos = pixelStartPos + channelPos
    const maxChannelAlpha = (frameData[pixelChannelPos] - backgroundColor[channelPos]) / ((frameData[pixelChannelPos] - backgroundColor[channelPos] > 0 ? 255 : 0) - backgroundColor[channelPos]) * 255 //eslint-disable-line max-len
    if (!isNaN(maxChannelAlpha) && maxChannelAlpha > maxAlpha) {
      maxAlpha = maxChannelAlpha
    }
  }

  // Calculate the resulting color applying the alpha value
  for (let channelPos = 0; channelPos < RGB_INDEXES.length; channelPos++) {
    const pixelChannelPos = pixelStartPos + channelPos
    frameData[pixelChannelPos] = !maxAlpha ?
      backgroundColor[channelPos] :
      backgroundColor[channelPos] + (frameData[pixelChannelPos] - backgroundColor[channelPos]) / (maxAlpha / 255)
  }
  const pixelAlphaPos = pixelStartPos + ALPHA_INDEX
  frameData[pixelAlphaPos] = maxAlpha
}