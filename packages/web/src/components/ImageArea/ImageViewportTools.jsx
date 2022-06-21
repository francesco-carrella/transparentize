import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Box, ButtonGroup, IconButton } from '@chakra-ui/react'
import { mdiMagnifyPlusOutline, mdiMagnifyMinusOutline, mdiMagnifyScan } from '@mdi/js'

import Icon from '../Icon'
import Tooltip from '../Tooltip'

const styles = {
  root: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'chakra-body-bg',
  },
  button: {
    borderRadius: 0,
  }
}

const ToolButton = (props) => {
  const {
    iconPath,
    tooltip,
    keyBinding,
    ...otherProps
  } = props

  const handleDoubleClick = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  return (
    <Tooltip
      label={tooltip}
      keyBinding={keyBinding}
      placement='right'
      isDisabled={!tooltip}
    >
      <IconButton
        icon={<Icon path={iconPath} size={1} />}
        onDoubleClick={handleDoubleClick}
        {...styles.button}
        {...otherProps}
      />
    </Tooltip>
  )
}
ToolButton.propTypes = {
  ...IconButton.propTypes,
  iconPath: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  keyBinding: PropTypes.string,
}


const ImageViewportTools = (props) => {
  const {
    direction = 'column',
    onZoomIn,
    onZoomOut,
    onZoomFit,
    ...otherProps
  } = props

  const stopDragPropagation = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <Box
      boxShadow='md'
      onTouchStartCapture={stopDragPropagation}
      onMouseDownCapture={stopDragPropagation}
      {...styles.root}
      {...otherProps}
    >
      <ButtonGroup
        isAttached
        flexDirection={direction}
      >
        <ToolButton
          iconPath={mdiMagnifyPlusOutline}
          onClick={onZoomIn}
          tooltip='Zoom in'
          keyBinding='mod +'
        />
        <ToolButton
          iconPath={mdiMagnifyMinusOutline}
          onClick={onZoomOut}
          tooltip='Zoom out'
          keyBinding='mod -'
        />
        <ToolButton
          iconPath={mdiMagnifyScan}
          onClick={onZoomFit}
          tooltip='Fit to canvas'
          keyBinding='mod 0'
        />
      </ButtonGroup>
    </Box>
  )
}

ImageViewportTools.propTypes = {
  ...ButtonGroup.propTypes,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onZoomFit: PropTypes.func.isRequired,
}

export default ImageViewportTools