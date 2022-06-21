import React from 'react'
import { Global, css } from '@emotion/react'

const AppGlobalCss = () => {
  return (
    <Global
      styles={
        css`
          body.busy,
          body.busy * {
            cursor: wait !important
          }
        `
      }
    />
  )
}

export default AppGlobalCss