import { program } from 'commander';
import { Chalk, supportsColor } from 'chalk';
import yesno from 'yesno'
import ProgressBar from 'progress';

let quiet
let disableNonAnsi

export let chalk

export function setupUi(options) {
  quiet = options.quiet
  disableNonAnsi = !options.colors || process.env.NO_COLOR || !supportsColor.hasBasic
  chalk = new Chalk({
    level: disableNonAnsi ? 0 : undefined
  });
}

// const emojiRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
function checkAnsiChars(str, replaceWith = '-') {
  return disableNonAnsi ? str.replace(/[^\x00-\x7F]/g, replaceWith) : str
}

export function showMessage(message, logger = console.log) {
  if(quiet) return
  message = checkAnsiChars(message)
  logger(chalk.bold(message));
}

export function showProgressMessage(message){
  if(quiet) return
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  showMessage(message, logger = process.stdout.write.bind(process.stdout));
}

export async function showConfirm(question, defaultValue = false) {
  const defaultText = defaultValue ? 'Y/n' : 'y/N';
  return await yesno({
    question: `${chalk.yellow.bold('?')} ${chalk.bold(question)} (${defaultText})`,
    defaultValue,
  })
}

export function showProgressBar(total, message = '') {
  message = checkAnsiChars(message)
  const progressTemplate = `${chalk.bold(message)} [:bar] ${chalk.bold(':percent')} - eta: :etas`
  return new ProgressBar(progressTemplate, {
    width: 30,
    total: total,
    complete: chalk.bold('='), 
    incomplete: chalk.blackBright('-'),
    clear: true,
  });
}

export function exitWithMessage(message) {
  showMessage(message)
  process.exit(1)
}
  
export function exitWithError(message = 'An error occurred', error) {
  if(error) {
    if(error.image) {
      error.image = '<removed>'
    }
    console.error(error);
    console.error(' ');
  }
  program.error(chalk.red.bold(`- ERROR: ${message}`))
}