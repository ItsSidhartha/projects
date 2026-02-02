const dificulties = {
  "1": [5, 5],
  "2": [10, 10],
  "3": [15, 15],
  "999": [10, 10, 40],
};

const GAME_PARAMS = selectGameParameters();
const ROWS = parseInt(GAME_PARAMS[0]) || 10;
const COLS = parseInt(GAME_PARAMS[1]) || 10;
const BOMBS_COUNT = parseInt(GAME_PARAMS[2]) || Math.floor(ROWS * COLS * 0.15);

const MINE_FIELD = prepareEmptyField();
const THINGS_UNDERNETH = makeGridOfZeros();


function selectGameParameters() {
  const dificulty = prompt(
    `Select Dificulty ('3' for hard, '2' for Medium, '1' for Easy, '999' for impossible,
for custom parameters enter rows(max 26), colums(max 99), number of mines you want with dash('-' in between))`,
  );

  if (dificulty.includes("-")) {
    return dificulty.split("-").map((x) => parseInt(x));
  }

  if (dificulty in dificulties) return dificulties[dificulty];

  console.log("Invalid Input");
  return selectGameParameters();
}

function makeGridOfZeros() {
  const grid = [[]];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      grid[row].push(0);
    }
    grid.push([]);
  }
  return grid;
}

function prepareEmptyField() {
  const grid = [["\t  "]];

  for (let index = 1; index <= COLS; index++) {
    grid[0].push(" " + index);
  }

  for (let row = 1; row <= ROWS; row++) {
    grid.push([`\t ${valueOf(row)} `]);
    for (let col = 1; col <= COLS; col++) {
      grid[row].push("⬜️");
    }
  }
  return grid;
}

function generateNumberInRange(range) {
  return Math.floor(Math.random() * range);
}

function randomCordinate() {
  const cordinates = [generateNumberInRange(ROWS), generateNumberInRange(COLS)];
  const isUsed = THINGS_UNDERNETH[cordinates[0]][cordinates[1]] === "💣";

  if (isUsed) {
    return randomCordinate();
  }

  return cordinates;
}

function generateBomb() {
  for (let index = 0; index < BOMBS_COUNT; index++) {
    const cordinates = randomCordinate();
    THINGS_UNDERNETH[cordinates[0]][cordinates[1]] = "💣";
  }
}

function isBomb(x, y) {
  return THINGS_UNDERNETH[x][y] === "💣";
}

function calculateNumOfBombsNearby(x, y) {
  let count = 0;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const X = x - 1 + col;
      const Y = y - 1 + row;

      if (isInRange(X, 0, ROWS) && isInRange(Y, 0, ROWS) && isBomb(X, Y)) {
        count++;
      }
    }
  }
  return count;
}

function getNumberEmoji(number) {
  const emojiString = "0️⃣1️⃣2️⃣3️⃣4️⃣5️⃣6️⃣7️⃣8️⃣9️⃣";
  return emojiString.slice(number * 3, (number * 3) + 3);
}

function putAdjucentBombCountUnderneth() {
  for (let row = 0; row <= THINGS_UNDERNETH[row].length; row++) {
    for (let col = 0; col <= THINGS_UNDERNETH[col].length; col++) {
      if (!isBomb(row, col)) {
        THINGS_UNDERNETH[row][col] =
          getNumberEmoji(calculateNumOfBombsNearby(row, col)) + " ";
      }
    }
  }
}

function valueOf(char) {
  const stringOfAlphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (typeof char === "number") {
    return stringOfAlphabets[char - 1];
  }
  return stringOfAlphabets.indexOf(char);
}

function turnUserInputToCordinate(userInput) {
  const x = valueOf(userInput.slice(0, 1));
  const y = parseInt(userInput.slice(1)) - 1;
  return [x, y];
}

function validateInput(userInput) {
  const alphabets = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const isValidLength = userInput.length === 2 || userInput.length === 3;
  const alphabetFragment = userInput[0];
  const isValidAlphabet = alphabets.slice(0, ROWS).includes(alphabetFragment);
  const numberFragment = userInput.slice(1);
  const isValidNumber = parseInt(numberFragment) > 0 &&
    parseInt(numberFragment) <= 10;
  return isValidLength && isValidAlphabet && isValidNumber;
}

function flag(location) {
  const row = location[0];
  const col = location[1];
  if (isNotSwept(row, col)) {
    MINE_FIELD[row + 1][col + 1] = "⛳️";
    console.clear();
    dispGrid();
  }
}

function takeUserInput() {
  const promtMsg = `
  Enter where you want to sweep as 'A1', 'j10' format, 
  or type '-f ' at the start to put a flag at the square`;

  const userInput = prompt(promtMsg).toUpperCase();
  const flagIdentifier = "-F ";
  const isFlag = userInput.includes(flagIdentifier);

  if (isFlag && validateInput(userInput.slice(flagIdentifier.length))) {
    const flagLocation = turnUserInputToCordinate(
      userInput.slice(flagIdentifier.length),
    );
    flag(flagLocation);
    return takeUserInput();
  }

  const isValidInput = validateInput(userInput);

  if (isValidInput) {
    const sweepIndexs = turnUserInputToCordinate(userInput);
    return sweepIndexs;
  }

  console.log("\n\tInvalid Input");
  return takeUserInput();
}

function isNotSwept(x, y) {
  const content = MINE_FIELD[x + 1][y + 1];
  return content === "⬜️" || content === "⛳️";
}

function sweep(x, y) {
  let sweepCount = 0;

  if (isNotSwept(x, y)) {
    MINE_FIELD[x + 1][y + 1] = THINGS_UNDERNETH[x][y];
    sweepCount++;
  }

  if (THINGS_UNDERNETH[x][y] === getNumberEmoji(0) + " ") {
    sweepCount += revealAllAdjucentZeros(x, y);
  }
  return sweepCount;
}

function dispGrid() {
  const joinedGrid = [];
  for (let index = 0; index < MINE_FIELD.length; index++) {
    joinedGrid.push(MINE_FIELD[index].join(""));
  }
  console.log(joinedGrid.join("\n"));
}

function isInRange(term, start, end) {
  return term >= start && term < end;
}

function revealAllAdjucentZeros(x, y) {
  let sweepCount = 0;

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const X = x - 1 + col;
      const Y = y - 1 + row;

      if (isInRange(X, 0, ROWS) && isInRange(Y, 0, ROWS) && isNotSwept(X, Y)) {
        sweepCount += sweep(X, Y);
      }
    }
  }
  return sweepCount;
}

function revealAllBombs() {
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      if (THINGS_UNDERNETH[row][col] === "💣") {
        MINE_FIELD[row + 1][col + 1] = "💣";
      }
    }
  }
}

function dispWinningMsg() {
  const msg = `
  Congratulation 🥳
  You found all the mines
  You Won!!
  `;

  console.log(msg);
}

function validatePasskey() {
  const enteredPaskey = prompt("Enter password");
  const password = "hamba ramba hamba hamba";
  SWEEP_COUNT--;
  return enteredPaskey === password;
}

function takePayment() {
  console.log("Pay 20 rupees to continue");
  const isClaimingPaid = confirm("Is paid?");
  if (isClaimingPaid) {
    return validatePasskey();
  }
  return false;
}

function dispLossingMsg() {
  console.clear();
  revealAllBombs();
  dispGrid();
  console.log("\n\tBoooom 💥\n\tYou Lost");
  return;
}

function setupGame() {
  dispGrid();
  generateBomb();
  putAdjucentBombCountUnderneth();
}

function dispWinningState() {
  console.clear();
  revealAllBombs();
  dispGrid();
  dispWinningMsg();
}

function playMove() {
  const sweepIndexs = takeUserInput();
  const sweepCount = sweep(sweepIndexs[0], sweepIndexs[1]);
  console.clear();
  dispGrid();
  const gameState = {
    isBombed: isBomb(sweepIndexs[0], sweepIndexs[1]),
    sweepCount: sweepCount,
  };

  return gameState;
}

function showBombedState() {
  const isPlayAgain = confirm("Want to continue playing");

  if (!isPlayAgain || !takePayment()) {
    dispLossingMsg();
    return;
  }
}

function main() {
  setupGame();

  const safeSpaceCount = (ROWS * COLS) - BOMBS_COUNT;
  let totalSweepCount = 0;

  while (totalSweepCount < safeSpaceCount) {
    const { isBombed, sweepCount } = playMove();
    if (isBombed) {
      showBombedState();
      return;
    }

    totalSweepCount += sweepCount;
  }

  dispWinningState();
}

main();
