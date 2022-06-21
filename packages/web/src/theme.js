import { extendTheme } from '@chakra-ui/react'

const options = {
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  semanticTokens: {
    colors: {
      'chakra-body-bg': { _light: 'gray.100', _dark: 'gray.800' },
      'image-area': { _light: 'gray.600', _dark: 'gray.900' },
      error: { _light: 'red.600', _dark: 'red.800' },
    },
  },
}


const theme = extendTheme(options)

export default theme