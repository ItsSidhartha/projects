const possibleInputs = ['r', 'p', 's'];
const winingCounters = ['p', 's', 'r'];
const SCORE = [0, 0];

function validateInput(input) {
  return possibleInputs.includes(input);
}

function takeUserInput() {
  const userInput = prompt("Enter 'r' for ROCK, 'p' for PAPER, 's' for SCISSORS");
  if (validateInput(userInput)) {
    return possibleInputs.indexOf(userInput.toLowerCase());
  }

  console.log('Invalid Input');
  return takeUserInput();
}

function takeComputerInput() {
  const randomNum = Math.floor(Math.random() * 3);
  return randomNum;
}

function evaluateInputs(userInput, computerInput) {
  const hasUserWon = winingCounters[computerInput] === possibleInputs[userInput];
  const hasUserLost = winingCounters[userInput] === possibleInputs[computerInput];
  return hasUserWon ? 'You Won' : hasUserLost ? 'You Lost' : 'Draw';
}

function convertNumericInputToSymbol(input) {
  switch (input) {
    case 0: return '🪨'
    case 1: return '📃'
    case 2: return '✂️'
  }
}

function dispResultMeasage(userInput, computerInput, result) {
  const actualUserInput = convertNumericInputToSymbol(userInput);
  const actualComputerInput = convertNumericInputToSymbol(computerInput);
  const inputsString = `You Choose ${actualUserInput}   vs   ${actualComputerInput}   Computer Choose`;
  const padLengthForResult = inputsString.indexOf('vs') + (result.length / 2);
  const scoreString = `You ${SCORE.join('-')} Computer`;
  const padLengthForscore = inputsString.indexOf('vs') + (scoreString.length / 2);

  console.log(`${inputsString}\n${result.padStart(padLengthForResult)}\n${scoreString.padStart(padLengthForscore)}`);
}

function updateScore(result) {
  switch (result) {
    case 'You Won': SCORE[0]++; return;
    case 'You Lost': SCORE[1]++; return;
  }

  SCORE[0] += 0.5;
  SCORE[1] += 0.5;
}

function main() {
  const computerInput = takeComputerInput();
  const userInput = takeUserInput();
  const result = evaluateInputs(userInput, computerInput);
  updateScore(result);
  dispResultMeasage(userInput, computerInput, result);
  const isPlayingAgain = confirm('Do you want to play again?');
  if (isPlayingAgain) {
    console.clear();
    main();
  }
}

main();