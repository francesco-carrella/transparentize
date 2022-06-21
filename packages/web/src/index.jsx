import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'

import { AppStateProvider } from './AppState'
import theme from './theme'
import App from './App'

import { ModalProvider } from './hooks/useModals'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <AppStateProvider>
      <ChakraProvider theme={theme}>
        <ModalProvider>
          <App />
        </ModalProvider>
      </ChakraProvider>
    </AppStateProvider>
  </React.StrictMode>
)