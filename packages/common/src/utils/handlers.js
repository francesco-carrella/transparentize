export function callHandler(fn, ...args) {
  fn && fn(...args)
}

export async function callHandlerAsync(fn, ...args) {
  fn && await fn(...args)
}