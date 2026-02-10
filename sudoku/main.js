import { generatePuzzle } from "./src/generator.js";
import { createPuzzle } from "./src/puzzle.js";
import { game } from "./src/game.js";
import { enableMouse,setraw } from "./src/setup.js";

const main = async () => {
  const solvedPuzzle = createPuzzle();
  console.log("ho gya hai");
  const puzzle = generatePuzzle(solvedPuzzle);

  await setraw();
  enableMouse();
  // takeInput();

  game(puzzle, solvedPuzzle);
};

main();
