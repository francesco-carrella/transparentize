export function callHandler(fn, ...args) {
  return fn && fn(...args) || [...args]
}

export async function callHandlerAsync(fn, ...args) {
  return fn ? (await fn(...args) || [...args]) : [...args]
}