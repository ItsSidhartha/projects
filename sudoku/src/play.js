import { Game } from "./game.js";
import { clearScreen, moveCursor, write } from "./helpers.js";
import { readInput } from "./input.js";
import { getTime } from "./timer.js";

const showTimer = async (startTime) => {
  const time = getTime(startTime);
  await write("\x1b[s");
  await moveCursor(20, 20);
  await write(`${time.min} : ${time.sec}`);
  await write("\x1b[0J");
  await write("\x1b[u");
};

export const play = async (puzzle, solvedPuzzle, preFills) => {
  await clearScreen();
  const game = new Game(puzzle, solvedPuzzle, preFills);
  await game.display();

  const intervalId = setInterval(() => {
    if (game.isGameEnded) return clearInterval(intervalId);
    showTimer(game.startTime);
  }, 100);

  while (!game.isPuzzleComplete()) {
    const { isMouse, isValue, isBackSpace, data } = await readInput();

    if (isMouse) game.setCursor(data.mouseX, data.mouseY);
    if (isValue && game.cursor) await game.handleValue(data.value);
    if (isBackSpace && game.cursor) await game.clearValue();

    const { message } = game.status();
    if (game.isGameEnded) return await game.endGame(message);
  }
};
