import { generatePuzzle } from "./src/generator.js";
import { createPuzzle } from "./src/puzzle.js";
import { play } from "./src/play.js";
import { setup } from "./src/setup.js";

const main = async () => {
  const solvedPuzzle = createPuzzle();
  const [puzzle, preFills] = generatePuzzle(solvedPuzzle);
  
  await setup();
  await play(puzzle, solvedPuzzle, preFills);
};

await main();
