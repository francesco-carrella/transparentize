import React, {useEffect, useState, createRef, useMemo, useRef, useCallback, useLayoutEffect} from 'react'
import { Box, Spinner } from '@chakra-ui/react'

import { useAppState, useAppStateRef } from '../../AppState'
import stylesOverlay from './stylesOverlay'

const transparentGridImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAqSURBVHgBvY6xCQAACMOiL/X/E/zJVUFwEMzWkiEGiE7U4SzcBRs+PTckFlMBQqokFBMAAAAASUVORK5CYII='

const styles = {
  root: {
    ...stylesOverlay,
  },
  loading: {
    ...stylesOverlay,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  panner: {
    position: 'absolute',
    willChange: 'transform', // TODO: needed?
    ...stylesOverlay,
  },
  canvasBackground: {
    position: 'absolute',
    backgroundColor: '#fff',
    backgroundImage: `url(${transparentGridImage})`,
    backgroundRepeat: 'repeat',
    backgroundPosition: 'center center',
    imageRendering: 'pixelated'
  },
  canvas: {
    imageRendering: 'pixelated'
  }
}

const ImageCanvas = (props) => {
  const {
    imageData,
    canvasRef: canvasRefProp,
    transform,
    zoom,
    onLoad,
    ...otherProps
  } = props

  const [state] = useAppState()
  const [stateRef, updateState] = useAppStateRef()
  const [isRendered, setIsRendered] = useState(false)
  const containerRef = useRef()
  const pannerRef = useRef()
  const canvasBgRef = useRef()
  const canvasRef = useMemo(() => (canvasRefProp || createRef()), [canvasRefProp])

  const isFirstRender = useRef(true)

  // reset isRendered each time the imageData changes
  useLayoutEffect(() => {
    setIsRendered(false)
  }, [imageData])

  // render the image each time the imageData changes && the canvasRef is already here
  useEffect(() => {
    if(canvasRef.current && imageData) {
      setIsRendered(false)

      setTimeout(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d', { colorSpace: stateRef.current.colorSpace })
        console.time(`renderCanvas ${otherProps.id}`)
        canvas.width = imageData.width
        canvas.height = imageData.height
        ctx.putImageData(imageData, 0, 0)
        console.timeEnd(`renderCanvas ${otherProps.id}`)

        setIsRendered(true)
      })

    }
  }, [canvasRef.current, imageData])

  // reset isFirstRender when file changes
  useEffect(() => {
    isFirstRender.current = true
  }, [stateRef.current.isLoaded])

  // call onLoad if it just rendered for th first time for this imageData
  useLayoutEffect(() => {
    if(isFirstRender.current && !!canvasRef.current && !!imageData) {
      canvasRef.current.style.width = `${imageData.width}px`
      canvasRef.current.style.height = `${imageData.height}px`
      onLoad && onLoad()
      isFirstRender.current = false
    }
  }, [!!canvasRef.current, !!imageData, isFirstRender.current, onLoad])

  // move the canvas background when the panner moves
  const updateCanvasBackground = useCallback(() => {
    if(isRendered && containerRef.current  && canvasRef.current  && canvasBgRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const canvasRect = canvasRef.current.getBoundingClientRect()
      canvasBgRef.current.style.top = `${canvasRect.top - containerRect.top + 0.5}px`
      canvasBgRef.current.style.left = `${canvasRect.left - containerRect.left + 0.5}px`
      canvasBgRef.current.style.width = `${canvasRect.width - 1}px`
      canvasBgRef.current.style.height = `${canvasRect.height - 1}px`
    }
  }, [isRendered && containerRef.current  && canvasRef.current  && canvasBgRef.current])
  useEffect(updateCanvasBackground)
  useEffect(() => {
    window.addEventListener('resize', updateCanvasBackground)
    return () => window.removeEventListener('resize', updateCanvasBackground)
  }, [updateCanvasBackground])

  return (
    <Box
      id='image-canvas'
      ref={containerRef}
      {...styles.root}
      {...otherProps}
    >

      <Box
        id='image-canvas-background'
        ref={canvasBgRef}
        // opacity = {isRendered ? 1 : 0}
        {...styles.canvasBackground}
      />

      <div
        id='image-canvas-panner'
        ref={pannerRef}
        style={{
          ...styles.panner,
          transform,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            ...styles.canvas,
            imageRendering: zoom > 1 ? 'pixelated' : 'auto',
            opacity: isRendered ? 1 : 0.2,
          }}
        />
      </div>

      {!isRendered && (
        <Box
          id='image-canvas-loading'
          {...styles.loading}
        >
          <Spinner />
        </Box>
      )}

    </Box>
  )
}

ImageCanvas.propTypes = {
  ...Box.propTypes,
}

export default ImageCanvas