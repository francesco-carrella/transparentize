import React, { useEffect, useRef, useCallback, useMemo } from 'react'
import { Box } from '@chakra-ui/react'

import { SHOW_ORIGINAL } from '../../constants'
import { useAppState, useAppStateRef } from '../../AppState'
import stylesOverlay from './stylesOverlay'
import useViewportZoomPan from './useViewportZoomPan'
import ImageCanvas from './ImageCanvas'
import ImageViewportTools from './ImageViewportTools'
import useViewportZoomKeyBindings from './useViewportZoomKeyBindings'

const styles = {
  root: {
    ...stylesOverlay,
    overflow: 'hidden',
    backgroundColor: 'image-area',
    userSelect: 'none',
  },
}

const ImageViewport = (props) => {
  const [state] = useAppState()
  const [stateRef] = useAppStateRef()

  const viewportRef = useRef()
  const canvasRef = useRef()

  const {
    transform,
    pan,
    setPan,
    isPanning,
    zoom,
    setZoom,
    zoomIn,
    zoomOut,
    fitToContent,
    forceUpdate
  } = useViewportZoomPan({
    containerRef: viewportRef,
    contentRef: canvasRef,
    fitContentMargin: 0.1,
    maxZoom: 60,
    minZoom: 0.001,
  })

  window.pan = pan
  window.setPan = setPan
  window.isPanning = isPanning
  window.zoom = zoom
  window.setZoom = setZoom
  window.zoomIn = zoomIn
  window.zoomOut = zoomOut
  window.fitToContent = fitToContent
  window.fitToContent = forceUpdate

  useViewportZoomKeyBindings({ zoomIn, zoomOut, fitToContent })

  const handleDoubleClick = useCallback((e) => {
    const viewportRect = viewportRef.current.getBoundingClientRect()
    zoomIn(undefined, {
      x: (e.clientX - viewportRect.left),
      y: (e.clientY - viewportRect.top),
    })
    e.preventDefault()
    e.stopPropagation()
  }, [zoomIn])

  return (
    <Box
      id='image-viewport'
      ref={viewportRef}
      onDoubleClick={handleDoubleClick}
      cursor={isPanning ? 'grabbing' : 'grab'}
      {...styles.root}
      {...props}
    >

      <ImageCanvas
        id={state.show === SHOW_ORIGINAL ? 'image-canvas-original' : 'image-canvas-processed'}
        imageData={state.show === SHOW_ORIGINAL ? state.imageData.original : state.imageData.processed}
        canvasRef={canvasRef}
        transform={transform}
        zoom={zoom}
        onLoad= {() => {
          console.log('onload!!')
          fitToContent(1)
        }}
      />

      <ImageViewportTools
        marginLeft={2}
        marginTop={2}
        onZoomIn={() => zoomIn() }
        onZoomOut={() => zoomOut() }
        onZoomFit={() => fitToContent() }
      />

    </Box>
  )
}

ImageViewport.propTypes = {
  ...Box.propTypes,
}

export default ImageViewport