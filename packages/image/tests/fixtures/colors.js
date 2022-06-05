import { Color } from '../../src/classes'

export function pickRandomColors(colors = {}, count = 1) {
  const colorNames = Object.keys(colors)
  const colorCount = colorNames.length
  const randomIndexes = new Array(count).fill().map(() => Math.floor(Math.random() * colorCount))
  const randomColors = randomIndexes.map(index => colors[colorNames[index]])
  return count === 1 ? randomColors[0] : randomColors
}

export const grayColors = {
  black: Color.from([0, 0, 0, 255]),
  gray25: Color.from([64, 64, 64, 255]),
  gray50: Color.from([127, 127, 127, 255]),
  gray75: Color.from([191, 191, 191, 255]),
  white: Color.from([255, 255, 255, 255]),
}

export const grayColorsTransparent = makeColorsTransparent(grayColors, .50)

export const rgbPrimaryColors = {
  red: Color.from([255, 0, 0, 255]),
  lime: Color.from([0, 255, 0, 255]),
  blue: Color.from([0, 0, 255, 255]),
}

export const rgbPrimaryColorsTransparent = makeColorsTransparent(rgbPrimaryColors, .50)

// https://www.w3schools.com/colors/colors_trends.asp
export const otherColors = {
  marsala: Color.from([149, 82, 81, 255]),
  radiandOrchid: Color.from([181, 101, 167, 255]),
  emerald: Color.from([0, 155, 119, 255]),
  tangerineTango: Color.from([221, 65, 36, 255]),
  honeysucle: Color.from([214, 80, 118, 255]),
  turquoise: Color.from([68, 184, 172, 255]),
  mimosa: Color.from([239, 192, 80, 255]),
  blueIzis: Color.from([91, 94, 166, 255]),
  chiliPepper: Color.from([155, 35, 53, 255]),
  sandDollar: Color.from([223, 207, 190, 255]),
  blueTurquoise: Color.from([85, 180, 176, 255]),
  tigerlily: Color.from([225, 93, 68, 255]),
  aquaSky: Color.from([127, 205, 205, 255]),
  trueRed: Color.from([188, 36, 60, 255]),
  fuchsiaRose: Color.from([195, 68, 122, 255]),
  ceruleanBlue: Color.from([152, 180, 212, 255]),
}

export const otherColorsTransparent = makeColorsTransparent(otherColors, .50)

export const colorSelection = {
  ...grayColors,
  ...rgbPrimaryColors,
  ...otherColors,
}

export const colorSelectionTransparent = {
  ...grayColorsTransparent,
  ...rgbPrimaryColorsTransparent,
  ...otherColorsTransparent,
}

export const backgroundSelection = {
  white: colorSelection.white,
  black: colorSelection.black,
  gray50: colorSelection.gray50,
  red: colorSelection.red,
  mimosa: colorSelection.mimosa,
  turquoise: colorSelection.turquoise,
  sandDollar: colorSelection.sandDollar,
  emerald: colorSelection.emerald,
  ceruleanBlue: colorSelection.ceruleanBlue,
  aquaSky: colorSelection.aquaSky,
}

function makeColorsTransparent(colors = {}, percent = 0.5) {
  return Object.keys(colors).reduce((acc, colorName) => {
    const originalColor = colors[colorName]
    const newColor = Color.clone(originalColor)
    newColor[3] = Math.round(originalColor[3] * percent)
    acc[`semitransparent ${colorName}`] = newColor
    return acc
  }, {})
}