const encoder = new TextEncoder();

const write = async (input) => {
  await Deno.stdout.write(encoder.encode(input));
};

export const moveCursor = async (x, y) => {
  const esc = `\x1b[${y};${x}H`;
  await write(esc);
};

export const display = async (puzzle, chances) => {
  await moveCursor(0, 0);
  const horizontal = "┠━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┨";
  const top = "┏━━━┯━━━┯━━━┳━━━┯━━━┯━━━┳━━━┯━━━┯━━━┓";
  const middle = "┠───┼───┼───╋───┼───┼───╋───┼───┼───┨";
  const bottom = "┗━━━┷━━━┷━━━┻━━━┷━━━┷━━━┻━━━┷━━━┷━━━┛";
  let screen = `${top}\n`;

  for (let row = 0; row < 9; row++) {
    for (let colm = 0; colm < 9; colm++) {
      if (colm % 3 === 0) {
        screen += "┃";
      } else {
        screen += "│"; //
      }
      screen += ` ${puzzle[row][colm]} `;
    }
    if ((row + 1) % 3 === 0 && row !== 8) {
      screen += "┃\n" + horizontal + "\n";
    } else if (row !== 8) screen += `┃\n${middle}\n`;
  }

  screen += "┃\n" + bottom;
  console.log(screen);
  console.log("Lifes: ", "❤️".repeat(chances) + "🩶".repeat(5 - chances));
};