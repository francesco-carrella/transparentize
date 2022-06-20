import esbuildPluginBuildSummary from './pluginBuildSummary.js'

export function generateEsbuildConfig(packageInfo, options = {}) {
  const args = process.argv.slice(2)
  const isDev = options.isDev || args.includes('--dev')

  const config = {
    // globalName: packageInfo.packageName || packageInfo.name,
    globalName: String(packageInfo.name).replace(/^@/, '').replace('/', '.'),
    entryPoints: [packageInfo.module],
    outdir: './dist',
    platform: packageInfo.platform,
    bundle: true,
    treeShaking: true,
    metafile: true,
    minify: !isDev,
    sourcemap: isDev,
    watch: isDev,
    plugins: [
      ...options.plugins || [],
      esbuildPluginBuildSummary,
    ],
  }
  return config
}

export default generateEsbuildConfig