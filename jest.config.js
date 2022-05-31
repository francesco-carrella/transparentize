const config = {
  verbose: true,
  testEnvironment: 'node',

  transform: {
    '^.+\\.js$': 'esbuild-jest',
  },
  snapshotResolver: './jest.snapshotResolver.cjs',
  // transformIgnorePatterns: ['<rootDir>/node_modules/'],
  // 'transformIgnorePatterns': ['node_modules/(?!(chalk)/)']

}

export default config