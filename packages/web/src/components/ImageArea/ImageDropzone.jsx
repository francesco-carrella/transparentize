import React, { useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import {useDropzone} from 'react-dropzone'
import { Box, useToast } from '@chakra-ui/react'

import { SUPPORTED_EXTENSIONS } from '../../constants'
import { useAppState } from '../../AppState'
import useUpdateImageFromFile from '../../hooks/useUpdateImageFromFile'
import useCheckValidFiles from '../../hooks/useCheckValidFiles'

const ImageDropzone = (props) => {
  const {
    children,
    noClick,
    noDrop,
    showErrorToasts = true,
    ...otherProps
  } = props

  const [, updateState] = useAppState()
  const checkValidFiles = useCheckValidFiles()
  const updateImageFromFile = useUpdateImageFromFile()
  const toast = useToast()

  // Handle upload and drop event
  const handleDrop = useCallback((acceptedFiles, fileRejections) => {

    if(acceptedFiles?.length > 0) {
      updateImageFromFile(acceptedFiles[0])
    } else if(fileRejections?.length > 0 && showErrorToasts) {
      checkValidFiles(fileRejections)
    }

  }, [updateState, toast])

  const {
    isDragActive,
    isDragReject,
    getRootProps: getDropzoneRootProps,
    getInputProps: getDropzoneInputProps,
  } = useDropzone({
    noClick,
    noDrop,
    multiple: false,
    accept: {
      'image/*': SUPPORTED_EXTENSIONS,
    },
    onDrop: handleDrop
  })

  useEffect(() => {
    if(!noDrop) {
      updateState((draft) => {
        draft.dragging.active = isDragActive
        draft.dragging.reject = isDragReject
      })
    }
  }, [isDragActive, isDragReject])

  return (
    <Box
      {...getDropzoneRootProps()}
      {...otherProps}
    >
      <input key='drop-input' {...getDropzoneInputProps()} />
      { children }
    </Box>
  )
}

ImageDropzone.propTypes = {
  ...Box.propTypes,
  noClick: PropTypes.bool,
  noDrop: PropTypes.bool,
  showErrorToasts: PropTypes.bool,
}

export default ImageDropzone