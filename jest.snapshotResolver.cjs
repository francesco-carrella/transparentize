


module.exports = {
  // /**
  //  *
  //  * @param testPath Path of the test file being test3ed
  //  * @param snapshotExtension The extension for snapshots (.snap usually)
  //  */
  resolveSnapshotPath: (testPath, snapshotExtension) =>
    testPath.replace(/\.test\.([tj]s)/, `${snapshotExtension}`),

  // /**
  //  *
  //  * @param snapshotFilePath The filename of the snapshot (i.e. some.test.js.snap)
  //  * @param snapshotExtension The extension for snapshots (.snap)
  //  */
  resolveTestPath: (snapshotFilePath, snapshotExtension) =>
    snapshotFilePath.replace(snapshotExtension, '.test.js'),

  testPathForConsistencyCheck: 'some/example.test.js',
}
