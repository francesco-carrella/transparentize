import chalk from 'chalk'

import { Color } from '../src/classes'


// import { rgbChannels, clampColorValue } from '@transparentize/common/src/utils/colors'
import { processColor } from '../src'
import { backgroundSelection, colorSelection, colorSelectionTransparent } from './fixtures/colors'

// TODO: use the one in functions.js
function solidifyColor(color, background) {
  if (color[3] === 255) return color
  const newColor = new Color(0, 0, 0, 0)
  {
    [0, 1, 2].forEach(function (channel) {
      newColor[channel] = background[channel] + (color[channel] - background[channel]) * (color[3] / 255)
    })
  }
  newColor[3] = 255

  return newColor
}

function renderColorFlag(color, background, pattern = [0, 1, 1, 0]) {
  color = solidifyColor(color, background)
  color = [...color].slice(0, -1)
  background = [...background].slice(0, -1)
  return pattern.reduce((output, showColor) => {
    return `${output}${chalk.bgRgb(
      ...(showColor ? color : background)
    )(' ')}`
  }, '')
}

function renderColorsFlagsMatrix(matrix, pattern) {
  const backgroundNames = Object.keys(matrix)
  return backgroundNames.reduce((result, backgroundName) => {
    const background = backgroundSelection[backgroundName]
    const colors = matrix[backgroundName]
    const colorsFlag = Object.values(colors).map((color) => renderColorFlag(color, background, pattern)).join('')
    return result + colorsFlag + '\n'
  }, '')
}

function testsForColorsOverBackgroundsNew(testName, colors, backgrounds) {
  const colorNames = Object.keys(colors)
  const backgroundNames = Object.keys(backgrounds)
  const resultMatrix = {}

  // testName = `${testName}: ${Object.keys(colors).length} colors over ${Object.keys(backgrounds).length} backgrounds`

  test(testName, () => {
    backgroundNames.forEach((backgroundName) => {
      const background = new Color(backgrounds[backgroundName])
      resultMatrix[backgroundName] = {}

      colorNames.forEach((colorName) => {
        const color = new Color(colors[colorName])
        resultMatrix[backgroundName][colorName] = processColor(color, background)
        expect(resultMatrix[backgroundName][colorName]).toBeTruthy()
        // expect(resultMatrix[backgroundName][colorName]).toMatchSnapshot()
      })

    })
    process.stdout.write(`Visual test table for ${testName}\n${renderColorsFlagsMatrix(resultMatrix)}\n`)
  })

}


// Start test
describe('test transparentizeColor() results', () => {
  // testsForColorsOverBackgroundsNew('Testing solid colors', colorSelection, backgroundSelection)
  testsForColorsOverBackgroundsNew('Testing semitransparent colors', colorSelectionTransparent, backgroundSelection)
})