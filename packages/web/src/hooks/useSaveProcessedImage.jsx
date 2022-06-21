import { useToast } from '@chakra-ui/react'
import { saveAs } from 'file-saver'

import { useAppStateRef, AppStateDefaults } from '../AppState'

const { ClipboardItem } = window

export const imageToBlob = (imageData, colorSpace = AppStateDefaults.colorSpace) => {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas')
    canvas.width = imageData.width
    canvas.height = imageData.height
    const ctx = canvas.getContext('2d', { colorSpace })
    ctx.putImageData(imageData, 0, 0)
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/png', 1)
  })
}

const useGetImageBlob = () => {
  const [stateRef, updateState] = useAppStateRef()
  const toast = useToast()

  return function getImageBlob() {
    if(!stateRef.current.isLoaded) {
      toast({
        title: 'No image loaded',
        description: 'Please load an image beforehand',
        status: 'error',
      })
      return
    }

    updateState((draft => {
      draft.isBusy = true
      draft.isSaving = true
    }))

    return new Promise((resolve) => {
      setTimeout(async function () {
        const blob = await imageToBlob(stateRef.current.imageData.processed, stateRef.current.colorSpace)

        resolve(blob)

        updateState((draft => {
          draft.isBusy = false
          draft.isSaving = false
        }))
      })
    })
  }
}


export const useCopyProcessedImageToClipboard = () => {
  const getImageBlob = useGetImageBlob()
  const toast = useToast()

  const copyProcessedImageToClipboard = async () => {
    const blob = await getImageBlob()

    if(blob) {
      const item = new ClipboardItem({ 'image/png': blob })
      navigator.clipboard.write([item])

      toast({
        type: 'info',
        description: 'Transparentized image copied to clipboard. Now you can paste it in your favorite image editor.',
        isClosable: true,
      })
    }
  }

  return copyProcessedImageToClipboard
}

export const useDownloadProcessedImageToFile = () => {
  const [stateRef] = useAppStateRef()
  const getImageBlob = useGetImageBlob()
  const toast = useToast()

  const saveProcessedImageToFile = async () => {
    const blob = await getImageBlob()

    if(blob) {
      let filename = stateRef.current.file.name
      filename = filename.replace(/(.*)?\.\w+$/, '$1-tranparentized.png')
      saveAs(blob, filename)

      toast({
        type: 'info',
        description: 'Transparentized image saved in the download folder.',
        isClosable: true,
      })
    }
  }

  return saveProcessedImageToFile
}
