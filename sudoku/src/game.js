import { display } from "./display.js";

const validate = ([y, x], value, solvedPuzzle) => {
  return solvedPuzzle[y][x] === +value;
};

export const game = (puzzle, solvedPuzzle) => {
  const name = prompt("bhai naam bta: ");
  let chances = 5;
  while (true) {
    display(puzzle);
    const position = prompt("position bta bhai: ");
    const value = prompt("value bta: ");
    const [y, x] = position.split(" ");
    const isValid = validate([y, x], value, solvedPuzzle);
    console.clear();
    if (isValid) {
      puzzle[y][x] = +value;
      console.log("sahi hai bhai\n");
    } else {
      chances--;
      console.log(name, "galat hai bsdk\n", { chances });
    }
  }
};
