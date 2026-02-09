import { generatePuzzle } from "./src/generator.js";
import { createPuzzle } from "./src/puzzle.js";
import { game } from "./src/game.js";

const main = () => {
  const solvedPuzzle = createPuzzle();
  const puzzle = generatePuzzle(solvedPuzzle);
  game(puzzle, solvedPuzzle);
};

main();
