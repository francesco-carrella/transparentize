
export function isInt(val) {
  return typeof val === 'number' && !isNaN(val) && val % 1 === 0
}

export function isPositiveInt(val) {
  return isInt(val) && val > 0
}

export function isIterable(val) {
  return val && typeof val[Symbol.iterator] === 'function'
}

export function isObject(val) {
  return val !== null && typeof val === 'object'
}

export function isObjectWithKeys(val, keys = []) {
  if (keys && !isIterable(keys)) keys = [keys]
  return isObject(val) && keys.every((key) => Object.prototype.hasOwnProperty.call(val, key))
}



export function runWithoutErrors(fn, ...args) {
  try {
    fn(...args)
    return true
  } catch {
    return false
  }
}
