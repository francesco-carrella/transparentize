
import { useCallback } from 'react'

import { AppStateDefaults, useAppStateRef } from '../AppState'


function simulateImageProcess(
  originalImageData,
  transparentizeColor = AppStateDefaults.transparentizeColor,
  solidifyColor = AppStateDefaults.solidifyColor,
  colorSpace = AppStateDefaults.colorSpace
) {
  return new Promise((resolve) => {
    setTimeout(() => {

      let { width, height, data } = originalImageData

      if(data.length !== width * height * 4) {
        throw new Error(`ImageData data size mismatch. Expected size ${width * height * 4}, got ${data.length}. Is it a RGBA ImageData?`)
      }

      data = new Uint8ClampedArray(data)
      for(let pixelIdx = 0; pixelIdx < (width * height); pixelIdx++) {
        const pixelStart = pixelIdx * 4
        data[pixelStart] = 255 - data[pixelStart]
        data[pixelStart + 1] = 255 - data[pixelStart + 1]
        data[pixelStart + 2] = 255 - data[pixelStart + 2]
        data[pixelStart + 3] = 127
      }

      resolve(new ImageData(data, width, height, { colorSpace }))
    })
  })
}

const useUpdateProcessedImage = () => {
  const [stateRef, updateState] = useAppStateRef()

  const updateProcessedImage = useCallback(async function (
    originalImageData = stateRef.current.imageData.original,
  ) {
    console.time('updateProcessedImage')
    if(originalImageData) {

      updateState((draft) => {
        draft.isBusy = true
        draft.isProcessed = false
        draft.imageData.processed = null
      })

      const processedImageData = await simulateImageProcess(
        originalImageData,
        stateRef.current.transparentizeColor,
        stateRef.current.solidifyColor,
        stateRef.current.colorSpace,
      )

      updateState((draft) => {
        draft.imageData.processed = processedImageData
        draft.isProcessed = true
        draft.isBusy = false
      })
    }
    console.timeEnd('updateProcessedImage')

  }, [
    stateRef.current,
    updateState
  ])

  return updateProcessedImage
}

export default useUpdateProcessedImage