import { useCallback, useEffect, useState } from 'react'
import usePanZoom from '../../../../../node_modules/use-pan-and-zoom/src/index'
import usePanZoomForceUpdate from '../../../../../node_modules/use-pan-and-zoom/src/use-force-update'

const useViewportZoomPan = (config) => {
  const {
    containerRef,
    contentRef,
    zoomFactor = .25,
    fitContentMargin = 0,
    ...panZoomConfig
  } = config

  const panZoomForceUpdate = usePanZoomForceUpdate()

  const [isPanning, setIsPanning] = useState(false)
  const handlePanStart = useCallback((...args) => {
    setIsPanning(true)
    if(panZoomConfig.onPanStart) panZoomConfig.onPanStart(...args)
  }, [setIsPanning, panZoomConfig.onPanStart])

  const handlePanEnd = useCallback((...args) => {
    setIsPanning(false)
    if(panZoomConfig.onPanEnd) panZoomConfig.onPanEnd(...args)
  }, [setIsPanning, panZoomConfig.onPanEnd])

  const {
    setContainer,
    transform,
    pan,
    zoom,
    setPan,
    setZoom,
    panZoomHandlers,
  } = usePanZoom({
    ...panZoomConfig,
    preventClickOnPan: false,
    onPanStart: handlePanStart,
    onPanEnd: handlePanEnd,
  })

  useEffect(() => {
    setContainer(containerRef.current)
    if(containerRef.current) {
      containerRef.current.addEventListener('touchstart', panZoomHandlers.onTouchStart)
      containerRef.current.addEventListener('touchmove', panZoomHandlers.onTouchMove)
      containerRef.current.addEventListener('touchend', panZoomHandlers.onTouchEnd)
      containerRef.current.addEventListener('touchcancel', panZoomHandlers.onTouchCancel)
      containerRef.current.addEventListener('mousedown', panZoomHandlers.onMouseDown)
      containerRef.current.addEventListener('mousemove', panZoomHandlers.onMouseMove)
      containerRef.current.addEventListener('mouseup', panZoomHandlers.onMouseUp)
      containerRef.current.addEventListener('mouseleave', panZoomHandlers.onMouseLeave)
      containerRef.current.addEventListener('click', panZoomHandlers.onClickCapture, {capture: true})
    }
  }, [containerRef.current])


  const setZoomAndUpdate = useCallback((...args) => {
    setZoom(...args)
    panZoomForceUpdate()
  }, [setZoom, panZoomForceUpdate])

  const setPanAndUpdate = useCallback((...args) => {
    setPan(...args)
    panZoomForceUpdate()
  }, [setPan, panZoomForceUpdate])

  const zoomIn = useCallback((inZoomFactor, position) => {
    setZoomAndUpdate(zoom * (1 + (inZoomFactor || zoomFactor)), position)
  }, [setZoomAndUpdate, zoom, zoomFactor])

  const zoomOut = useCallback((inZoomFactor, position) => {
    setZoomAndUpdate(zoom * (1 - (inZoomFactor || zoomFactor)), position)
  }, [setZoomAndUpdate, zoom, zoomFactor])

  const fitToContent = useCallback((maxZoom) => {
    if(!contentRef.current) return undefined
    const { position, zoom } = getFitToContentValues(
      containerRef.current,
      contentRef.current,
      fitContentMargin,
      maxZoom || panZoomConfig.maxZoom,
    )
    setZoom(zoom)
    setPan(position)
    panZoomForceUpdate()
  }, [getFitToContentValues, setZoom, setPan, panZoomForceUpdate, containerRef.current, contentRef.current, fitContentMargin, panZoomConfig.maxZoom])

  return {
    transform,
    isPanning,
    pan,
    zoom,
    setPan: setZoomAndUpdate,
    setZoom: setPanAndUpdate,
    zoomIn,
    zoomOut,
    fitToContent,
    forceUpdate: panZoomForceUpdate,
  }

}

const getFitToContentValues = (container, content, marginPercent = 0, maxZoom) => {
  if(!container || !content) {
    return { position: { x: 0, y: 0 }, scale: 1 }
  }

  let zoom = Math.min(
    container.clientWidth / content.clientWidth,
    container.clientHeight / content.clientHeight,
  )

  if(marginPercent) {
    zoom = zoom - (zoom * marginPercent)
  }

  if(maxZoom && zoom > maxZoom) {
    zoom = maxZoom
  }

  const position = {
    x: (container.clientWidth  / 2 - content.clientWidth / 2) * zoom,
    y: (container.clientHeight / 2 - content.clientHeight / 2) * zoom,
  }

  return { position, zoom }
}


export default useViewportZoomPan