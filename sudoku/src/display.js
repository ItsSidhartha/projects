export const display = (puzzle) => {
  const uperWali = "-".repeat(41);
  let screen = `\n\n${uperWali}\n|`;

  for (let row = 0; row < 9; row++) {
    for (let colm = 0; colm < 9; colm++) {
      screen += `| ${puzzle[row][colm]} `;
      if ((colm + 1) % 3 === 0) {
        screen += "|";
      }
    }
    if ((row + 1) % 3 === 0) {
      screen += "|\n" + "=".repeat(40) + "\n|";
    } else screen += `|\n${uperWali}\n|`;
  }

  // screen += uperWali;
  console.log(screen);
};


