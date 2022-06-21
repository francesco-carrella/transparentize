import React from 'react'
import PropTypes from 'prop-types'
import { Box, Text, Tooltip as ChakraTooltip } from '@chakra-ui/react'

const platform = window.navigator?.userAgentData?.platform || window.navigator?.platform
const isMac = platform.toLowerCase().includes('mac')

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    fontSize: 'xs',
  },
  keyBindingContainer: {
    display: 'inline-flex',
    flexWrap: 'nowrap',
    marginLeft: 3,
  },
  keyBindingKey: {
    display: 'inline-flex',
    margin: .5,
    fontSize: 'xs',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 4,
    minHeight: 5,
    lineHeight: '1',
    borderRadius: 5,
    borderWidth: 1,
    borderBottomWidth: 3,
    backgroundColor: 'gray.500',
    borderColor: 'gray.600',
    paddingX: 1,
    _dark: {
      backgroundColor: 'gray.400',
      borderColor: 'gray.500',
    }
  }
}

const Tooltip = (props) => {
  let {
    label,
    keyBinding,
    openDelay = 500,
    closeOnClick = true,
    ...otherProps
  } = props

  if (keyBinding) {
    keyBinding = keyBinding.replace(/mod/g, isMac ? '⌘' : 'ctrl')
    const keyBindingKeys = keyBinding.split(' ')
    label = <>
      {label}
      <Box {...styles.keyBindingContainer}>
        {keyBindingKeys.map((keyBindingKey, index) => (
          <Text key={index} {...styles.keyBindingKey}>{keyBindingKey}</Text>
        ))}
      </Box>
    </>
  }
  return (
    <ChakraTooltip
      closeOnClick={closeOnClick}
      openDelay={openDelay}
      label={label}
      {...styles.root}
      {...otherProps}
    />
  )
}

Tooltip.propTypes = {
  ...ChakraTooltip.propTypes,
  keyBinding: PropTypes.string,
}

export default Tooltip