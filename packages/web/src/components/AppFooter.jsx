import React, { useMemo } from 'react'
import { Box, Text, Link } from '@chakra-ui/react'

import packageInfo from '../../package.json'

const styles = {
  root: {
    // bgColor: 'gray.300',
    _dark: {
      // bgColor: 'gray.900',
      borderTopWidth: 1,
      // borderTopColor: 'chakra-border-color',
    }
  },
  text: {
    fontSize: 'xs',
    align: 'center',
    color: 'gray.600',
    _dark: {
      color: 'gray.500',
    }
  }
}

const AppFooter = (props) => {

  const footerText = useMemo(() => {
    const authorName = packageInfo.author && (packageInfo.author.name || packageInfo.author)
    const authorEmail = packageInfo.author && packageInfo.author.email
    return (
      <>
        {packageInfo.productName || packageInfo.name} v{packageInfo.version}
        {authorName && ' - Ⓒ '}
        {
          authorEmail ?
            <Link href={`mailto:${authorEmail}`}>{authorName}</Link>
            : authorName
        }
      </>
    )
  }, [packageInfo])

  return (
    <Box
      id="footer"
      {...styles.root}
      {...props}
    >
      <Text {...styles.text}>
        {footerText}
      </Text>
    </Box>
  )
}

AppFooter.propTypes = {
  ...Box.propTypes,
}

export default AppFooter