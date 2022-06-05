import { Color } from '../src'

const validRgbaArrays = [
  [255, 255, 255, 255],
  [0, 0, 0, 0],
  [127, 127, 127, 255],
  [255, 0, 0, 255],
  [127, 127, 127, 127],
]


const validRgbaObjects = validRgbaArrays.map(([r, g, b, a]) => ({ r, g, b, a }))

const validRgbArrays = [
  [255, 255, 255],
  [0, 0, 0],
  [127, 127, 127],
  [255, 0, 0],
]

const validRgbObjects = validRgbArrays.map(([r, g, b]) => ({ r, g, b }))

const invalidRgbaArrays = [
  [255],
  [0, 0],
  [127, 127, 127, 255, 255],
  [255, 0, 0, 255, 255, 0, 0, 255],
  [null],
  [''],
]

const invalidObjects = [
  null,
  {},
  { r: 127 },
  { r: 255, g: 127, x: 255 },
  { r: 255, g: 127, a: 255 },
]


describe('test Color class', () => {
  describe('.from() constructor', () => {

    describe('valid arguments', () => {

      test('from valid 4 channels ...arguments', () => {
        validRgbaArrays.forEach(rgbaColorArray => {
          expect(Color.from(...rgbaColorArray)).toStrictEqual(Buffer.from(rgbaColorArray))
        })
      })

      test('from valid 4 channels array', () => {
        validRgbaArrays.forEach(rgbaColorArray => {
          expect(Color.from([...rgbaColorArray])).toStrictEqual(Buffer.from(rgbaColorArray))
        })
      })

      test('from valid 4 channels object', () => {
        validRgbaObjects.forEach((rgbaColorObject, i) => {
          expect(Color.from({ ...rgbaColorObject })).toStrictEqual(Buffer.from(validRgbaArrays[i]))
        })
      })

      test('from valid 3 channels ...arguments', () => {
        validRgbArrays.forEach(rgbColorArray => {
          const expected = [...rgbColorArray, 255]
          expect(Color.from(...rgbColorArray)).toStrictEqual(Buffer.from(expected))
        })
      })

      test('from valid 3 channels array', () => {
        validRgbArrays.forEach(rgbColorArray => {
          const expected = [...rgbColorArray, 255]
          expect(Color.from([...rgbColorArray])).toStrictEqual(Buffer.from(expected))
        })
      })

      test('from valid channels object', () => {
        validRgbObjects.forEach((rgbColorObject, i) => {
          const expected = [...validRgbArrays[i], 255]
          expect(Color.from({ ...rgbColorObject })).toStrictEqual(Buffer.from(expected))
        })
      })

    })

    describe('invalid arguments', () => {

      test('without arguments, throw error', () => {
        invalidRgbaArrays.forEach(invalidArray => {
          expect(() => Color.from()).toThrow()
        })
      })

      test('from invalid ...arguments, throw error', () => {
        invalidRgbaArrays.forEach(invalidArray => {
          expect(() => Color.from(...invalidArray)).toThrow()
        })
      })

      test('from invalid array, throw error', () => {
        invalidRgbaArrays.forEach(invalidArray => {
          expect(() => Color.from([...invalidArray])).toThrow()
        })
      })

      test('from invalid object, throw error', () => {
        invalidObjects.forEach(invalidObject => {
          expect(() => Color.from([...invalidObject])).toThrow()
          expect(() => Color.from(...invalidObject)).toThrow()
        })
      })

    })
  })

  describe('.fromBackground() constructor', () => {

    describe('valid arguments', () => {

    })

  })

})