import { program } from 'commander';
import Confirm from 'prompt-confirm';
import ProgressBar from 'progress';

export function showMessage(message) {
  console.log(`- ${message}`);
}

export function showConfirm(message) {
  return new Confirm(message)
    .run()
    .then(async function(answer) {
      return await answer;
    });
}

export function showProgressBar(total) {
  return new ProgressBar('  [:bar] :percent - eta: :etas', {
    width: 30,
    total: total,
    complete: '=', 
    incomplete: ' ',
    clear: true,
  });
}

export function exitWithError(message = 'An error occurred', error) {
  if(error) {
    console.error(error);
    console.error(' ');
  }
  program.error(`error: ${message}`)
}