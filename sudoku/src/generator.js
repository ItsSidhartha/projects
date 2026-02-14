export const generatePuzzle = (solvedPuzzle) => {
  const puzzle = [];

  const preFills = new Set();
  for (let row = 0; row < 9; row++) {
    puzzle.push([]);
    for (let colm = 0; colm < 9; colm++) {
      const predictor = Math.random();
      if (predictor < 0.40) {
        preFills.add(`${row}-${colm}`);
        puzzle[row][colm] = "\x1b[37m" + solvedPuzzle[row][colm] + "\x1b[0m";
      } else {
        puzzle[row][colm] = " ";
      }
    }
  }

  return [puzzle, preFills];
};
