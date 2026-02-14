import { generatePuzzle } from "./src/generator.js";
import { createPuzzle } from "./src/puzzle.js";
import { play } from "./src/play.js";
import { setup } from "./src/setup.js";

const main = async () => {
  await setup();
  const solvedPuzzle = createPuzzle();
  // console.log({ solvedPuzzle });

  const [puzzle, preFills] = generatePuzzle(solvedPuzzle);
  await play(puzzle, solvedPuzzle, preFills);
};

await main();
