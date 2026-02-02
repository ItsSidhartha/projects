const WORDS = [
  "LOVE",
  "BOOK",
  "HAND",
  "TREE",
  "DOOR",
  "BALL",
  "WIND",
  "MILK",
  "SNOW",
  "JUMP",
  "WALK",
  "TALK",
  "SPIN",
  "READ",
  "RING",
  "PLAY",
  "GAME",
  "FAST",
  "SLOW",
  "HIGH",
  "COLD",
  "WARM",
  "BLUE",
  "GOLD",
  "FIRE",
  "STAR",
  "ROCK",
  "SAND",
  "MOON",
  "RAIN",
  "LEAF",
  "FISH",
  "BIRD",
  "BEAR",
  "LION",
  "FROG",
  "WOLF",
  "CRAB",
  "ANTS",
  "TREE",
  "ROOT",
  "BARK",
  "SOIL",
  "RICE",
  "CORN",
  "MEAT",
  "SOUP",
  "SALT",
  "CAKE",
  "MILK",
  "IRON",
  "WOOD",
  "TOOL",
  "NAIL",
  "WIRE",
  "BOLT",
  "ROAD",
  "PATH",
  "SHIP",
  "BIKE",
  "TAXI",
  "DOOR",
  "ROOM",
  "WALL",
  "ROOF",
  "BATH",
  "SINK",
  "OVEN",
  "COOK",
  "WASH",
  "HEAD",
  "HAIR",
  "EYES",
  "NOSE",
  "LIPS",
  "NECK",
  "BACK",
  "ARMS",
  "LEGS",
  "FEET",
  "TOES",
  "SKIN",
  "HURT",
  "HEAL",
  "REST",
  "PAIN",
  "LOVE",
  "HATE",
  "KIND",
  "NICE",
  "MEAN",
  "CALM",
  "BUSY",
  "RICH",
  "POOR",
  "FULL",
  "HALF",
  "OPEN",
  "SHUT",
  "TIME",
];
const GUESSED_LETTERS = ["_", "_", "_", "_"];
const WRONG_GUESSES = [];

function selectWord() {
  const wordIndex = Math.floor(Math.random() * 100);
  return WORDS[wordIndex];
}
function takeUserInput() {
  const gussedLetter = prompt("Enter one letter");
  if ((typeof gussedLetter !== "string") || gussedLetter.length < 1) {
    console.log("Inavlid Input");
    return takeUserInput();
  }
  return gussedLetter;
}

function validateInput(userInput, wordToGuess) {
  return wordToGuess.includes(userInput);
}

function getGuessedIndex(userInput, wordToGuess) {
  const indexes = [];
  for (let index = 0; index < wordToGuess.length; index++) {
    if (userInput === wordToGuess[index]) {
      indexes.push(index);
    }
  }
  return indexes;
}

function updateGuessedLetters(userInput, wordToGuess) {
  const guessIndexs = getGuessedIndex(userInput, wordToGuess);
  for (let index = 0; index < guessIndexs.length; index++) {
    GUESSED_LETTERS[guessIndexs[index]] = userInput;
  }
}

function prepareHangMan() {
}

function outputMsg(isCorrectGuess, userInput, wordToGuess) {
  isCorrectGuess
    ? oneOfrigthAnswer(userInput, wordToGuess)
    : wrongAnswer(userInput);
}
function oneOfrigthAnswer(userInput, wordToGuess) {
  updateGuessedLetters(userInput, wordToGuess);
  console.log("correct guess");
}

function wrongAnswer(userInput) {
  console.log("wrong guess");
  if (WRONG_GUESSES.includes(userInput)) {
    console.log("What Ra!🤦‍♂️ \nagain?");
  } else {
    WRONG_GUESSES.push(userInput);
    console.log(`wrong guesses are ${WRONG_GUESSES.join(", ")}`);
  }
}

function remainingLifeMsg(numberOfLifes, deaths) {
  const commentOnLifes = ""; //(numberOfLifes - deaths) < deaths ? 'You are about to die spend your time wisely' : 'Relax you have enough lives';
  const msg = `
  ${"☠️ ".repeat(deaths)}${"❤️ ".repeat(numberOfLifes - deaths)}
  ${commentOnLifes}
  `;
  console.log(msg);
}

function main() {
  const numberOfLifes = parseInt(prompt("Wish for lives"));
  const wordToGuess = selectWord().split("");
  let deaths = 0;
  let isCorrectGuess = false;
  while (deaths < numberOfLifes) {
    remainingLifeMsg(numberOfLifes, deaths);
    const userInput = takeUserInput().toUpperCase();
    isCorrectGuess = validateInput(userInput, wordToGuess);
    deaths = isCorrectGuess ? deaths : deaths + 1;
    outputMsg(isCorrectGuess, userInput, wordToGuess);

    console.log(GUESSED_LETTERS.join(""));
    if (GUESSED_LETTERS.join("") === wordToGuess.join("")) {
      console.log("Proud of you");
      break;
    }
  }
  if (!isCorrectGuess) {
    console.log("The correct answer was ", wordToGuess.join(""));
  }
}
main();
