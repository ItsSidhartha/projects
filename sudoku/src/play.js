import { Game } from "./game.js";
import { clearScreen } from "./helpers.js";
import { readInput } from "./input.js";
import { setIntervalForTimer } from "./timer.js";

export const play = async (puzzle, solvedPuzzle, preFills) => {
  await clearScreen();
  const game = new Game(puzzle, solvedPuzzle, preFills);
  await game.display();
  setIntervalForTimer(game);

  while (!game.isPuzzleComplete()) {
    const { isMouse, isValue, isBackSpace, data } = await readInput();

    if (isMouse) game.setCursor(data.mouseX, data.mouseY);
    if (isValue && game.cursor) await game.handleValue(data.value);
    if (isBackSpace && game.cursor) await game.clearValue();

    const { message } = game.status();
    if (game.isGameEnded) return await game.endGame(message);
  }
};
