export const generatePuzzle = (solvedPuzzle) => {
  const puzzle = [];

  const preFills = [];
  for (let row = 0; row < 9; row++) {
    puzzle.push([]);
    for (let colm = 0; colm < 9; colm++) {
      const predictor = Math.random();
      if (predictor < 0.35) {
        preFills.push(`${row}-${colm}`);
        puzzle[row][colm] = "\x1b[37m" + solvedPuzzle[row][colm] + "\x1b[0m";
      } else {
        puzzle[row][colm] = " ";
      }
    }
  }

  return [puzzle, preFills];
};
