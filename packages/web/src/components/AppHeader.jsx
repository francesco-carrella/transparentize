import React from 'react'
import { Box, Heading, Spacer } from '@chakra-ui/react'
import { mdiAutoFix } from '@mdi/js'

import packageInfo from '../../package.json'
import Icon from './Icon'

import ColorModeButton from './ColorModeButton'

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    // bgColor: 'gray.300',
    paddingX: 4,
    paddingY: 2,
    borderBottomWidth: 1,
    _dark: {
      // bgColor: 'gray.600',
    }
  },
  heading: {
    size: 'sm',
  },
  icon: {
    boxSize: 5,
    marginRight: 2,
  }
}

const AppHeader = (props) => {
  return (
    <Box id="header" {...styles.root} {...props}>
      <Heading {...styles.heading}>
        <Icon path={mdiAutoFix} {...styles.icon} />
        {packageInfo.productName || packageInfo.name }
      </Heading>
      {/* TODO: remove colorMode control in production */}
      <Spacer />
      <ColorModeButton />
    </Box>
  )
}

AppHeader.propTypes = {
  ...Box.propTypes,
}

export default AppHeader