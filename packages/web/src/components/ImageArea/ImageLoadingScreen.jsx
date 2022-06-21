import React from 'react'
import { Box, Spinner } from '@chakra-ui/react'

import stylesOverlay from './stylesOverlay'

const styles = {
  root: {
    ...stylesOverlay,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    _before: {
      ...stylesOverlay,
      content: '" "',
      backgroundColor: 'image-area',
      opacity: 0.75
    },
  },
  spinner: {
  }
}

const ImageLoadingScreen = (props) => {
  return (
    <Box
      {...styles.root}
      {...props}
    >
      <Spinner
        {...styles.spinner}
      />
    </Box>
  )
}

export default ImageLoadingScreen