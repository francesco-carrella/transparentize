import React from 'react'
import { Icon as ChakraIcon } from '@chakra-ui/react'
import { Icon as MdiIcon } from '@mdi/react'

const rootStyles = {
  verticalAlign: 'sub',
}

const Icon = (props) => {
  return (
    <ChakraIcon
      as={MdiIcon}
      {...rootStyles}
      {...props}
    />
  )
}

export default Icon