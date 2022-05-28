import packageInfo from '../../package.json';
import { exitWithError, chalk } from './ui';
import { GenericError, InputFileNotFoundError, InputFileNotValidError, OutputPathNotValidError, OutputDirectoryNotValidError, OutputDirectoryNotWritableError, FileProcessError, ImageProcessError, WriteOutputFileError } from '../lib';

export default function handleError(error, options) {
  switch(true) {

    case error instanceof InputFileNotFoundError:
      exitWithError(`The input file '${chalk.white.underline(error.inputFile)}' does not exists. Please check the <input_file> argument and retry.`);
      break

    case error instanceof InputFileNotValidError:
      exitWithError(`The input file '${chalk.white.underline(error.inputFile)}' does not seem to be a valid ${chalk.white.underline(options.inputFormat)} file. Please check the <input_file> argument and retry.`);
      break

    case error instanceof OutputPathNotValidError:
      exitWithError(`${chalk.underline(error.outputFile)} is not a valid output file or path.`);
      break

    case error instanceof OutputDirectoryNotValidError:
      exitWithError(`${chalk.underline(error.outputFile)} is not a valid output directory.`);
      break

    case error instanceof OutputDirectoryNotWritableError:
      exitWithError(`${chalk.underline(error.outputFile)} directory is not writable.`);
      break

    case error instanceof FileProcessError:
      exitWithError(`Impossible to read the input file '${chalk.white.underline(error.inputFile)}'. Please check the <input_file> argument and retry.`, error); 
      break

    case error instanceof ImageProcessError:
      exitWithError(`An error occurred while processing the image. Please report the issue at ${packageInfo.author.email}`, error);
      break

    case error instanceof WriteOutputFileError:
      exitWithError(`Impossible to write the output file '${chalk.white.underline(error.outputFile)}'. Please check the <output_file> argument and retry.`, error);
      break
    
    case error instanceof GenericError:
    default:
      exitWithError(`An error occurred. Please report the issue at ${packageInfo.author.email}`, error);
  }
}
