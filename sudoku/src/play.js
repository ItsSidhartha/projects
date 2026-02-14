import { Game } from "./game.js";
import { clearScreen } from "./helpers.js";
import { readInput } from "./input.js";

export const play = async (puzzle, solvedPuzzle, preFills) => {
  await clearScreen();
  const game = new Game(puzzle, solvedPuzzle, preFills);
  await game.display();

  while (!game.isPuzzleComplete()) {
    const { isMouse, isValue, mouseX, mouseY, value } = await readInput();

    if (isMouse) game.setCursor(mouseX, mouseY);
    if (isValue && game.cursor) await game.handleValue(value);

    const { isGameEnded, message } = game.status();

    if (isGameEnded) return await game.endGame(message);
  }
};
