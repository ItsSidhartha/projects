const createPrefill = (preFills, row, colm, solvedPuzzle) => {
  const predictor = Math.random();
  if (predictor < 0.40) {
    preFills.add(`${row}-${colm}`);
    return "\x1b[37m" + solvedPuzzle[row][colm] + "\x1b[0m";
  }
  return " ";
};

export const generatePuzzle = (solvedPuzzle) => {
  const puzzle = [];

  const preFills = new Set();
  for (let row = 0; row < 9; row++) {
    puzzle.push([]);
    for (let colm = 0; colm < 9; colm++) {
      const preFill = createPrefill(preFills, row, colm, solvedPuzzle);
      puzzle[row].push(preFill);
    }
  }

  return [puzzle, preFills];
};
