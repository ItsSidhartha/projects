import { display, moveCursor } from "./display.js";
import { enableMouse, setraw } from "./setup.js";

const decoder = new TextDecoder();

const validate = ([y, x], value, solvedPuzzle) => {
  return solvedPuzzle[y][x] === +value;
};

const parseChunk = (chunk) => {
  const data = decoder.decode(chunk);
  // console.log(data);
  const matched = data.match(/\x1b\[<(\d+);(\d+);(\d+)([mM])/);
  if (!matched) {
    const value = +(data.trim());
    return { isValue: true, isMouse: false, value };
  }
  const [, btn, mouseX, mouseY, type] = matched;
  if (btn === "0" && type === "M") {
    return { isMouse: true, btn, mouseX, mouseY, type, isValue: false };
  }
  return { isMouse: false, isValue: false };
};

const MAP = {
  0: 0,
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 3,
  6: 4,
  7: 5,
  8: 5,
  9: 6,
  10: 7,
  11: 7,
  12: 8,
};

const getPosition = (mouseX, mouseY) => {
  const y = Math.floor((+mouseY / 2) - 1);
  const x = MAP[Math.floor((+mouseX - 2) / 3)];
  return [y, x];
};

export const game = async (puzzle, solvedPuzzle) => {
  let chances = 5;
  const buffer = new Uint8Array(100);
  console.clear();

  let cursor = [];
  display(puzzle);

  while (true) {
    const n = await Deno.stdin.read(buffer);
    const { isMouse, mouseX, mouseY, isValue, value } = parseChunk(
      buffer.slice(0, n),
    );
    if (isMouse) {
      cursor = getPosition(mouseX, mouseY);
      await moveCursor(mouseX, mouseY);
      continue;
    }

    if (isValue) {
      // console.log("value", value);
      const isValid = validate(cursor, value, solvedPuzzle);
      if (isValid) {
        // console.log("val", value)
        puzzle[cursor[0]][cursor[1]] = "\x1b[32m" + value + "\x1b[0m";
      } else {
        puzzle[cursor[0]][cursor[1]] = "\x1b[31m" + value + "\x1b[0m";
        chances--;
        // console.log(name, "galat hai bsdk\n", { chances });
      }
      console.clear();
      display(puzzle);
    }
  }
};
