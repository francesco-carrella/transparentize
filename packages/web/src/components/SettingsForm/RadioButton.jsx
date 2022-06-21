import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'
import { Button, Box, useRadio } from '@chakra-ui/react'

const styles = {
  root: {},
  rootSelected: {
    backgroundColor: 'teal.600',
    color: 'white',
    _hover: {
      backgroundColor: 'teal.600',
    },
    _active: {
      backgroundColor: 'teal.500',
    }
  },
  icon: {
    marginRight: 1.5,
  },
}

const RadioButton = (props) => {
  const {
    value,
    icon,
    children,
    isChecked,
    ...otherProps
  } = props

  const { getInputProps, getCheckboxProps } = useRadio(props)

  const inputRadioProps = getInputProps()
  const checkboxRadioProps = getCheckboxProps()


  return (
    <Button
      as="label"
      {...styles.root}
      {...(isChecked ? styles.rootSelected : {})}
      {...otherProps}
    >
      <input {...inputRadioProps} />
      <Box
        {...checkboxRadioProps}
      >
        {icon && cloneElement(icon, {
          size: (icon?.props?.size || .75),
          ...styles.icon,
        })}
        {children}
      </Box>
    </Button>
  )
}

RadioButton.propTypes = {
  ...Button.propTypes,
  value: PropTypes.string.isRequired,
  icon: PropTypes.element,
  children: PropTypes.node,
  isChecked: PropTypes.bool,
}

export default RadioButton