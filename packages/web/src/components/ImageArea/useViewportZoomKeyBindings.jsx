import { useEffect } from 'react'
import Mousetrap from 'mousetrap'

import { useAppStateRef } from '../../AppState'

const useViewportZoomKeyBindings = ({ zoomIn, zoomOut, fitToContent }) => {
  const [stateRef] = useAppStateRef()

  useEffect(() => {
    const handleZoomInKeyBinding = (e) => {
      e.preventDefault()
      if(stateRef.current.isLoaded && !stateRef.current.isBusy) zoomIn()
    }
    Mousetrap.bind(['mod+plus', 'mod+shift+=', 'mod+='], handleZoomInKeyBinding)

    const handleZoomOutKeyBinding = (e) => {
      e.preventDefault()
      if(stateRef.current.isLoaded && !stateRef.current.isBusy) zoomOut()
    }
    Mousetrap.bind('mod+-', handleZoomOutKeyBinding)

    const handleFitToContentKeyBinding = (e) => {
      e.preventDefault()
      if(stateRef.current.isLoaded && !stateRef.current.isBusy) fitToContent()
    }
    Mousetrap.bind('mod+0', handleFitToContentKeyBinding)

    return() => {
      Mousetrap.unbind(['mod+plus', 'mod+shift+=', 'mod+='], handleZoomInKeyBinding)
      Mousetrap.unbind('mod+-', handleZoomOutKeyBinding)
      Mousetrap.unbind('mod+0', handleFitToContentKeyBinding)
    }
  }, [zoomIn, zoomOut, fitToContent])
}

export default useViewportZoomKeyBindings