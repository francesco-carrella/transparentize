import esbuildPluginBuildSummary from './esbuild-plugin-build-summary.js'

export function defaultBuilderOptions(cliOptions) {
  return {
    globalName: cliOptions.packageName,
    entryPoints: [`packages/${cliOptions.packageName}/src/index.js`],
    outfile: `packages/${cliOptions.packageName}/dist/index.js`,
    define: {
      'process.env.NODE_ENV': `"${cliOptions.env}"`,
    },
    bundle: true,
    treeShaking: true,
    minify: cliOptions.env === 'production',
    sourcemap: cliOptions.env === 'development',
    plugins: [esbuildPluginBuildSummary],
    // onBuild: function() { console.log('onBuild') },
    watch: cliOptions.watch,

    platform: 'node',

    // logLevel: 'info',
    metafile: true,
  }
}