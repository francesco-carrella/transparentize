import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

const ColorInput = (props) => {
  const {
    initialValue = '#ffffff',
    onChange,
    ...otherProps
  } = props

  const [value, setValue] = useState(initialValue)

  const handleChange = useCallback((e) => {
    setValue(e.target.value)
    if(onChange) {
      onChange(e.target.value)
    }
  }, [setValue, onChange])

  return (
    <input
      type="color"
      value={value}
      onChange={handleChange}
      {...otherProps}
    />
  )
}

ColorInput.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func,
}

export default ColorInput