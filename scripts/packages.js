import path from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'

const currentScriptDir = path.dirname(fileURLToPath(import.meta.url))

export const defaultPackagesPath = path.join(currentScriptDir, '../packages')

// export const packages = ['image', 'file', 'common']
export const packages = readdirSync(defaultPackagesPath, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)

export function packageExists(packageName) {
  return packages.includes(packageName)
}

export function ensurePackage(packageName) {
  if (!packages.includes(packageName)) {
    throw new Error(`Package "${packageName}" does not exist.`)
  }
}

export function getPackagePath(packageName) {
  ensurePackage(packageName)
  return path.join(currentScriptDir, defaultPackagesPath, packageName)
}

export function getPackageSrcPath(packageName) {
  ensurePackage(packageName)
  return path.join(currentScriptDir, defaultPackagesPath, packageName, 'src')
}

export function getPackageDistPath(packageName) {
  ensurePackage(packageName)
  return path.join(currentScriptDir, defaultPackagesPath, packageName, 'dist')
}