import React from 'react'
import { useColorMode, IconButton } from '@chakra-ui/react'
import { mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js'

import Icon from './Icon'

const styles = {
  root: {
    minWidth: 5,
    height: 5,
  }
}

const ColorModeButton = (props) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const iconPath = colorMode === 'light' ? mdiWhiteBalanceSunny : mdiWeatherNight

  return (
    <IconButton
      variant='ghost'
      icon={ <Icon path={ iconPath }/> }
      onClick={ toggleColorMode }
      {...styles.root}
      { ...props }
    />
  )
}

ColorModeButton.propTypes = {
  ...ColorModeButton.propTypes,
}

export default ColorModeButton