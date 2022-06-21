import { useCallback, useEffect } from 'react'
import Mousetrap from 'mousetrap'

import useCheckValidFiles from './useCheckValidFiles'
import useUpdateImageFromFile from './useUpdateImageFromFile'
import { useCopyProcessedImageToClipboard, useDownloadProcessedImageToFile } from './useSaveProcessedImage'
import { useAppStateRef } from '../AppState'

const useHandleClipboardPaste = () => {
  const updateImageFromFile = useUpdateImageFromFile()
  const checkValidFiles = useCheckValidFiles()
  const [stateRef] = useAppStateRef()

  const handlePaste = useCallback((e) => {
    e.preventDefault()
    if(!stateRef.current.isBusy) {
      const clipboardData = e.clipboardData || window.clipboardData
      if(checkValidFiles(clipboardData.files)) {
        updateImageFromFile(clipboardData.files[0])
      }
    }
  }, [updateImageFromFile, checkValidFiles])
  return handlePaste
}

const useHandleClipboardCopy = () => {
  const copyProcessedImageToClipboard = useCopyProcessedImageToClipboard()
  const handleCopy = useCallback((e) => {
    e.preventDefault()
    copyProcessedImageToClipboard()
  }, [])
  return handleCopy
}

const useHandleDownloadAsFile = () => {
  const downloadProcessedImageToFile = useDownloadProcessedImageToFile()
  const handleDownloadAsFile = useCallback((e) => {
    e.preventDefault()
    downloadProcessedImageToFile()
  }, [])
  return handleDownloadAsFile
}

const useHandlePageLeave = () => {
  const [stateRef] = useAppStateRef()
  const handlePageLeave = useCallback((e) => {
    if(stateRef.current.isLoaded) {
      e.preventDefault()
      return e.returnValue = 'Are you sure you want to exit?'
    }
  }, [])
  return handlePageLeave
}

const useAppKeyBindings = () => {
  const handleClipboardPaste = useHandleClipboardPaste()
  const handleClipboardCopy = useHandleClipboardCopy()
  const handleDownloadAsFile = useHandleDownloadAsFile()
  const handlePageLeave = useHandlePageLeave()

  useEffect(() => {
    window.addEventListener('paste', handleClipboardPaste)
    if(!IS_DEV) { /*global IS_DEV*/
      window.addEventListener('beforeunload', handlePageLeave, { capture: true })
    }

    Mousetrap.bind('mod+c', handleClipboardCopy)
    Mousetrap.bind('mod+s', handleDownloadAsFile)
    return () => {
      window.removeEventListener('paste', handleClipboardPaste)
      window.removeEventListener('beforeunload', handlePageLeave, { capture: true })
      Mousetrap.unbind('mod+c', handleClipboardCopy)
      Mousetrap.unbind('mod+s', handleDownloadAsFile)
    }
  }, [handleClipboardPaste, handleClipboardCopy, handleDownloadAsFile])

}

export default useAppKeyBindings
