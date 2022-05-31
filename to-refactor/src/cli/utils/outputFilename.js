import path from 'path'

import { absolutePath, isFile, isFileExtension, ensureFileExtension, verifyOutputFileNominalPath, verifyOutputDirectory, verifyOutputFileDontExists, isDirectory } from '../../utils/files';
import { showConfirm, exitWithMessage, chalk } from '../ui';

export function createOutputFileName(inputFile, options, outputDir) {
  const suffix = '-transparent'
  const outputExtension = '.png'
  const inputExtension = path.extname(inputFile)
  const inputBasename = path.basename(inputFile, inputExtension)
  if(!outputDir) outputDir = path.dirname(inputFile)

  const useSuffix = (
    !options.replaceInput && 
    absolutePath(inputFile) === absolutePath(path.join(outputDir, `${inputBasename}${outputExtension}`))
  )
  const outputFilename = `${inputBasename}${useSuffix ? suffix : ''}${outputExtension}`
  return path.join(outputDir, outputFilename)
}

export async function ensureOutputFile(inputFile, outputFile, options) {
  // Try to create output file name
  if(outputFile) {
    if(isDirectory(outputFile)) {
      outputFile = createOutputFileName(inputFile, options, outputFile);
    }
  } else {
    outputFile = createOutputFileName(inputFile, options);
  }

  // Use lib functions to verify output file and directory 
  verifyOutputFileNominalPath(outputFile, options)
  verifyOutputDirectory(outputFile, options)
  
  // Check if output file already exists and ask user to allow to replace it if necessary
  if(isFile(outputFile) && !options.allowOverride) {
    const confirmQuestion = absolutePath(inputFile) === absolutePath(outputFile)?
      `Are you sure you want to replace the input file '${chalk.underline(outputFile)}' with the transparentized version?` :
      `The output file '${chalk.underline(outputFile)}' already exists. Do you want to overwrite it?`
    if(await showConfirm(confirmQuestion)) {
      options.allowOverride = true
    } else {
      exitWithMessage(`- Aborted!`);
    }
  }

  // Check output file extension and ask user to allow to change it if necessary
  if(!isFileExtension(outputFile, '.png')) {
    if(await showConfirm(`The output file '${chalk.underline(outputFile)}' has a wrong extension. Do you want to correct it to '.png'?`)) {
      outputFile = ensureFileExtension(outputFile, '.png');
    } else {
      exitWithMessage('- Aborted!');
    }
  }

  // Finally use lib function to check that the resulting output file doesn't already exists
  verifyOutputFileDontExists(outputFile, options)

  return outputFile
}
