import { ButtonGroup, useRadioGroup } from '@chakra-ui/react'
import React, { Children } from 'react'

const RadioButtons = (props) => {
  const {
    name,
    value,
    defaultValue,
    onChange,
    children,
    ...otherProps
  } = props

  // const handleChange = (e) => {
  //   console.log(e?.target?.value, 'e.target.value')
  //   console.log('handleChange', e?.target?.value, e)
  //   e?.target?.value && onChange && onChange(e.target.value)
  // }

  const { getRootProps, getRadioProps } = useRadioGroup(props)

  const groupProps = getRootProps()


  return (
    <ButtonGroup
      size='md'
      isAttached
      variant='outline'
      display={'flex'}
      flexWrap={'wrap'}
      {...otherProps}
      {...groupProps}
    >
      {Children.map(children, (child) => (
        React.cloneElement(child, {
          key: child.props.value,
          ...getRadioProps(child.props),
        })
      ))}
    </ButtonGroup>
  )
}
export default RadioButtons