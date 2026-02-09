export const generatePuzzle = (solvedPuzzle) => {
  const puzzle = [];

  for (let row = 0; row < 9; row++) {
    puzzle.push([]);
    for (let colm = 0; colm < 9; colm++) {
      const predictor = Math.random();
      if (predictor < 0.35) {
        puzzle[row][colm] = solvedPuzzle[row][colm];
      } else {
        puzzle[row][colm] = " ";
      }
    }
  }

  return puzzle;
};
