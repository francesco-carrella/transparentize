
import { useCallback } from 'react'
import parseColorString from 'color-rgba'

import { AppStateDefaults, useAppStateRef } from '../AppState'

import { Image as TransparentizeImage } from '@transparentize/image'

export function ensureColor(colorString) {
  const hexColorWithoutHashRE = /^([0-9a-f]{3}|[0-9a-f]{6})$/i
  if(hexColorWithoutHashRE.test(colorString)) {
    colorString = `#${colorString}`
  }

  let colorArray = parseColorString(colorString)
  colorArray[3] = colorArray[3] * 255

  return colorArray
}


const useUpdateProcessedImage = () => {
  const [stateRef, updateState] = useAppStateRef()

  const updateProcessedImage = useCallback(async function (
    originalImageData = stateRef.current.imageData.original,
  ) {

    if(originalImageData) {
      updateState((draft) => {
        draft.isBusy = true
        draft.isProcessed = false
        draft.imageData.processed = null
      })

      // ensureGlobalBuffer()

      setTimeout(() => {
        console.time('updateProcessedImage')

        const transpOptions = {
          backgroundColor: ensureColor(stateRef.current.transparentizeColor),
        }

        let transpImage = new TransparentizeImage({
          width: originalImageData.width,
          height: originalImageData.height,
          data: originalImageData.data
        }).transparentize(transpOptions)

        const processedImageData = new ImageData(
          transpImage.data,
          transpImage.width,
          transpImage.height
        )

        console.timeEnd('updateProcessedImage')

        updateState((draft) => {
          draft.imageData.processed = processedImageData
          draft.isProcessed = true
          draft.isBusy = false
        })

      })
    }

  }, [
    stateRef.current,
    updateState
  ])

  return updateProcessedImage
}

export default useUpdateProcessedImage