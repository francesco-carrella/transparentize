import React, {createContext, useContext, useEffect} from 'react'
import PropTypes from 'prop-types'
import { useImmer } from 'use-immer'

import { SHOW_ORIGINAL, OUTPUT_FILE } from './constants'

export const AppStateContext = createContext()

export const AppStateDefaults = {
  transparentizeColor: '#ffffff',
  solidifyColor: '#ffffff',
  colorSpace: 'display-p3', // or 'srgb'  --   TODO: Lets detect this automatically (seems impossible for png in browser :/ ) or the user to choose it
  file: null,           // expected File type
  imageData: {
    original: null,     // expected ImageData type,
    processed: null,    // expected ImageData type,
  },
  show: SHOW_ORIGINAL,  // or SHOW_PREVIEW,
  output: OUTPUT_FILE,  // or OUTPUT_CLIPBOARD,
  dragging: {
    active: false,
    reject: false,
  },
  isBusy: false,
  isLoaded: false,
  isProcessed: false,
  isSaving: false,
}

export const AppStateProvider = (props) => {
  const {
    children,
    initialState: initialStateProp
  } = props

  const initialState = { ...AppStateDefaults, ...initialStateProp }
  const [state, setState] = useImmer(initialState)

  return (
    <AppStateContext.Provider value={[state, setState]}>
      {children}
    </AppStateContext.Provider>
  )
}
AppStateProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialState: PropTypes.object,
}

export const useAppState = () => {
  const context = useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within a AppStateProvider')
  }
  return context
}

export const useAppStateRef = () => {
  const [state, updateState] = useAppState()
  const stateRef = React.useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  return [stateRef, updateState]
}
