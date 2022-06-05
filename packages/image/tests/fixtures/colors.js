import { Color } from '../../src/classes'

function makeColorsTransparent(colors = {}, percent = 0.5) {
  return Object.keys(colors).reduce((acc, colorName) => {
    const originalColor = colors[colorName]
    const newColor = new Color(originalColor)
    newColor[3] = Math.round(originalColor[3] * percent)
    acc[`semitransparent ${colorName}`] = newColor
    return acc
  }, {})
}

export const grayColors = {
  black: new Color([0, 0, 0, 255]),
  gray25: new Color([64, 64, 64, 255]),
  gray50: new Color([127, 127, 127, 255]),
  gray75: new Color([191, 191, 191, 255]),
  white: new Color([255, 255, 255, 255]),
}

export const grayColorsTransparent = makeColorsTransparent(grayColors, .50)

export const rgbPrimaryColors = {
  red: new Color([255, 0, 0, 255]),
  lime: new Color([0, 255, 0, 255]),
  blue: new Color([0, 0, 255, 255]),
}

export const rgbPrimaryColorsTransparent = makeColorsTransparent(rgbPrimaryColors, .50)

// https://www.w3schools.com/colors/colors_trends.asp
export const otherColors = {
  marsala: new Color([149, 82, 81, 255]),
  radiandOrchid: new Color([181, 101, 167, 255]),
  emerald: new Color([0, 155, 119, 255]),
  tangerineTango: new Color([221, 65, 36, 255]),
  honeysucle: new Color([214, 80, 118, 255]),
  turquoise: new Color([68, 184, 172, 255]),
  mimosa: new Color([239, 192, 80, 255]),
  blueIzis: new Color([91, 94, 166, 255]),
  chiliPepper: new Color([155, 35, 53, 255]),
  sandDollar: new Color([223, 207, 190, 255]),
  blueTurquoise: new Color([85, 180, 176, 255]),
  tigerlily: new Color([225, 93, 68, 255]),
  aquaSky: new Color([127, 205, 205, 255]),
  trueRed: new Color([188, 36, 60, 255]),
  fuchsiaRose: new Color([195, 68, 122, 255]),
  ceruleanBlue: new Color([152, 180, 212, 255]),
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