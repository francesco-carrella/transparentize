import React, { useEffect } from 'react'
import { Stack, useTheme } from '@chakra-ui/react'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/pause/mousetrap-pause'

import { useAppState, useAppStateRef } from './AppState'
import AppGlobalCss from './components/AppGlobalCss'
import AppHeader from './components/AppHeader'
import AppFooter from './components/AppFooter'
import ImageArea from './components/ImageArea'
import SettingsForm from './components/SettingsForm'
import useAppKeyBindings from './hooks/useAppKeyBindings'


const styles = {
  root: {
    spacing: 0,
    height: '100vh',
  },
  main: {
    flex: 1,
    direction: ['column', 'row', 'row'],
    overflowY: 'scroll',
    spacing: 0,
  }
}

const App = () => {
  const [state] = useAppState()

  useAppKeyBindings()

  // TODO: dev code, it should be in a proper ifdef block
  const theme = useTheme()
  const [stateRef, updateState] = useAppStateRef()
  if(IS_DEV) { /* global IS_DEV */
    window.stateRef = stateRef
    window.updateState = updateState
    window.theme = theme
  }

  useEffect(() => {
    if(state.isBusy) {
      document.body.classList.add('busy')
      Mousetrap.pause()
    } else {
      document.body.classList.remove('busy')
      Mousetrap.unpause()
    }
  }, [state.isBusy])

  return (
    <>
      <AppGlobalCss />
      <Stack id="container" {...styles.root}>
        <AppHeader id="header" />
        <Stack id="main" {...styles.main}>
          <ImageArea id='image-area' />
          <SettingsForm id='SettingsForm' />
        </Stack>
        <AppFooter id='footer' />
      </Stack>
    </>
  )
}

export default App