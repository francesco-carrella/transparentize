
export function clamp(value, max = 1, min = 0) {
  return Math.min(Math.max(value, min), max)
}

export function roundFloat(value, digits = 2) {
  return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits)
}

export function isFunction(fn) {
  return typeof fn === 'function'
}

export function callIfExists(fn, ...args) {
  if (isFunction(fn)) {
    return fn(...args)
  }
}

export async function callIfExistsAsync(fn, ...args) {
  if (isFunction(fn)) {
    return await fn(...args)
  }
}
