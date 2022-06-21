
import { useCallback } from 'react'
import canvasSize from 'canvas-size'

import useModals from './useModals'
import { AppStateDefaults, useAppStateRef } from '../AppState'
import useUpdateProcessedImage from './useUpdateProcessedImage'

function getImageDataFromFile(file, colorSpace = AppStateDefaults.colorSpace) {
  return new Promise(function(resolve, reject) {
    let isValidImageSize
    let img = new Image()
    img.onload = function() {
      const { width, height } = img
      isValidImageSize = canvasSize.test({ width, height })
      if(!isValidImageSize) {
        reject()
        return
      }
      const canvas = new OffscreenCanvas(width, height)
      const ctx = canvas.getContext('2d', { colorSpace })
      ctx.drawImage(img, 0, 0)
      resolve(ctx.getImageData(0, 0, width, height, { colorSpace }))
    }
    img.onerror = function() {
      reject()
    }
    img.src = URL.createObjectURL(file)
  })
}

const useUpdateImageFromFile = () => {
  const [stateRef, updateState] = useAppStateRef()
  const updateProcessedImage = useUpdateProcessedImage()
  const { confirm, alert } = useModals()

  return useCallback(async function updateImageFromFile(file, showReplaceDialog = true) {
    if(!file) return

    if(stateRef.current.file && showReplaceDialog) {
      if(!(await confirm({
        title: 'Replace image',
        message: 'Are you sure you want to replace the current image?',
        okText: 'Replace',
      }))) return
    }

    updateState((draft) => {
      draft.isBusy = true
      draft.isLoaded = false
      draft.isProcessed = false
      draft.file = file
      draft.imageData.original = null
      draft.imageData.processed = null
    })

    try {
      const originalImageData = await getImageDataFromFile(file, stateRef.current.colorSpace)
      updateState((draft) => {
        draft.imageData.original = originalImageData
      })

      await updateProcessedImage(
        originalImageData,
        stateRef.current.transparentizeColor,
        stateRef.current.solidifyColor,
        stateRef.current.colorSpace,
      )

      updateState((draft) => {
        draft.isLoaded = true
        draft.isBusy = false
      })
    } catch(e) {
      updateState((draft) => {
        // draft.isLoaded = false
        draft.isBusy = false
        // draft.isProcessed = false
        draft.file = null
        draft.imageData.original = null
        // draft.imageData.processed = null
      })

      alert({
        title: 'Error processing the image',
        message: 'It usually happen when the image is too big and your browser is unable to process it. Please use a smaller image or try with another browser / system.',
      })

      throw e
    }

  }, [stateRef, updateState, confirm])
}

export default useUpdateImageFromFile