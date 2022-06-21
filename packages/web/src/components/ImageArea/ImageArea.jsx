import React from 'react'
import { Box } from '@chakra-ui/react'

import { useAppState } from '../../AppState'
import ImageDropzone from './ImageDropzone'
import ImageAwaitFileMessage from './ImageAwaitFileMessage'
import ImageViewport from './ImageViewport'
import ImageLoadingScreen from './ImageLoadingScreen'

const styles = {
  root: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'stretch',
    alignItems: 'stretch',
    flex: 1,
    minWidth: 300,
    minHeight: 300,
    backgroundColor: 'image-area',
  }
}

const ImageArea = (props) => {
  const [state] = useAppState()

  const showAwaitFileScreen = (!state.isLoaded && !state.isBusy) || state.dragging.active
  const showLoadingScreen = (
    ((!state.isLoaded || !state.isProcessed) && state.isBusy) ||
    state.isSaving
  )

  return (
    <ImageDropzone
      noClick={!!state.file}
      id='image-area'
      {...styles.root}
      {...props}
    >
      <ImageViewport />
      { showAwaitFileScreen && <ImageAwaitFileMessage /> }
      { showLoadingScreen && <ImageLoadingScreen /> }
    </ImageDropzone>
  )
}

ImageArea.propTypes = {
  ...Box.propTypes,
}

export default ImageArea