import { useCallback } from 'react'
import { useToast } from '@chakra-ui/react'

import { SUPPORTED_EXTENSIONS } from '../constants'

function getFileExtension(fileName) {
  const extensionRE = /(\.\w+)?$/
  if (fileName.match(extensionRE)) {
    return extensionRE.exec(fileName)[0].toLocaleLowerCase()
  }
}

function isSupportedMimeType(mimeType) {
  return mimeType?.startsWith('image/')
}

function isSupportedExtension(fileName) {
  return !!fileName &&
    SUPPORTED_EXTENSIONS.includes(getFileExtension(fileName))
}

const useCheckValidFiles = () => {

  const toast = useToast()

  return useCallback((files) => {
    let errorMessage // = 'An error ocurred while processing the image'
    if (files.length < 1) {
      errorMessage = 'No image selected'
    } else if (files.length > 1) {
      errorMessage = 'Only one file at a time can be processed'
    } else if (
      !isSupportedMimeType(files[0]?.type) ||
      !isSupportedExtension(files[0]?.name)
    ) {
      errorMessage = `Invalid file type. Accepted types: ${SUPPORTED_EXTENSIONS.join(', ')}`
    } else if (files[0]?.errors) {
      errorMessage = 'An error ocurred while processing the image'
    }

    if (errorMessage) {
      toast({
        description: errorMessage,
        status: 'error',
        isClosable: true,
      })
      return false
    }
    return true
  }, [toast])
}

export default useCheckValidFiles