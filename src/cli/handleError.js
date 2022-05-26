import packageInfo from '../../package.json';
import { exitWithMessage, exitWithError, chalk } from './ui';
import { GenericError, InputFileNotFoundError, PngFileNotValidError, OutputFileExistsError, PngProcessError, ImageProcessError, WriteOutputFileError } from '../lib';

export default function handleError(error, options) {
  switch(true) {

    case error instanceof InputFileNotFoundError:
      exitWithError(`The input file '${chalk.white.underline(error.inputFile)}' does not exists. Please check the <input_file> argument and retry.`);
      break

    case error instanceof PngFileNotValidError:
      exitWithError(`The input file '${chalk.white.underline(error.inputFile)}' does not seem to be a valid PNG file. Please check the <input_file> argument and retry.`);
      break

    case error instanceof OutputFileExistsError:
      if(options.overrideInput) {
        exitWithMessage(`  Aborted!`);
      } else {
        exitWithError(`The output file '${chalk.white.underline(error.outputFile)}' already exists. Please check the <output_file> argument and retry.`);
      }
      break

    case error instanceof PngProcessError:
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
