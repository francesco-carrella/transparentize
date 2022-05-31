import parseColorString from 'color-rgba'  

function colorArrayToColorObject(colorArray) {
  if(!Array.isArray(colorArray) || colorArray.length < 3 || colorArray.length > 4) {
    throw new Error(`Invalid color array: ${colorArray}`)
  }
  return {
    r: colorArray[0],
    g: colorArray[1],
    b: colorArray[2],
    a: colorArray.length === 4 ? colorArray[3] : 255
  }
}

export function ensureBgColor(colorString) {
  const hexColorWithoutHashRE = /^([0-9a-f]{3}|[0-9a-f]{6})$/i
  if(hexColorWithoutHashRE.test(colorString)) {
    colorString = `#${colorString}`
  }

  let colorArray = parseColorString(colorString)
  colorArray[3] = colorArray[3] * 255
  
  return colorArrayToColorObject(colorArray)
}