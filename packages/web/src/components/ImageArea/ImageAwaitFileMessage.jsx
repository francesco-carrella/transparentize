import React, { useMemo } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { mdiImage, mdiImagePlus, mdiImageBrokenVariant } from '@mdi/js'

import {useAppState} from '../../AppState'
import Icon from '../Icon'
import stylesOverlay from './stylesOverlay'


const styles = {
  root: {
    ...stylesOverlay,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: 4,
    backgroundColor: 'image-area',
    color: 'white',
  },
  centralBox: {
    width: '75%',
    height: '75%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 12,
    padding: 8,
    borderWidth: 3,
    borderRadius: 12,
    borderStyle: 'dashed',
    outline: 'none',
    transition: 'border .24s ease-in-out',
  }
}

const ImageAwaitFileMessage = (props) => {
  const [state] = useAppState()

  const messageText = useMemo(() => {
    switch(true) {
      case state.dragging.reject:
        return 'There is some issue with this file'
      case state.dragging.active:
        return 'Drop the image'
      default:
        return 'Drag\'n drop image file here, or click to select, or paste image from clipboard..'
    }
  }, [state])

  const iconPath = useMemo(() => {
    switch(true) {
      case state.dragging.reject:
        return mdiImageBrokenVariant
      case state.dragging.active:
        return mdiImagePlus
      default:
        return mdiImage
    }
  }, [state])

  const placeholderColor = useMemo(() => {
    switch(true) {
      case state.dragging.reject:
        return 'error'
      case state.dragging.active:
        return 'whiteAlpha.900'
      default:
        return 'whiteAlpha.500'
    }
  }, [state])

  return (
    <Box
      id='image-await-file-message'
      {...styles.root}
      {...props}
    >
      <Box
        {...styles.centralBox}
        border={placeholderColor}
      >
        <Icon
          path={iconPath}
          color={placeholderColor}
          size={2}
          margin={2}
        />
        <Text align="center">
          { messageText }
        </Text>
      </Box>
    </Box>
  )
}

ImageAwaitFileMessage.propTypes = {
  ...Box.propTypes,
}

export default ImageAwaitFileMessage