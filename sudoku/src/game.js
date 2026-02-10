import { display, moveCursor } from "./display.js";
import { disableMouse } from "./setup.js";
import { stripAnsiCode } from "@std/fmt/colors";

const decoder = new TextDecoder();

const validate = ([y, x], value, solvedPuzzle) => {
  return solvedPuzzle[y][x] === +value;
};

const parseChunk = (chunk) => {
  const data = decoder.decode(chunk);
  const matched = data.match(/\x1b\[<(\d+);(\d+);(\d+)([mM])/);
  if (!matched) {
    const value = +(data.trim());
    if (!Number(value)) {
      return { isValue: false, isMouse: false };
    }
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

const getPosition = (mouseX, mouseY, cursor) => {
  const y = Math.floor((+mouseY / 2) - 1);
  const x = MAP[Math.floor((+mouseX - 2) / 3)];
  if (y > 8 || x > 8) return cursor;
  return [y, x];
};

export const game = async (puzzle, solvedPuzzle) => {
  let chances = 5;
  const buffer = new Uint8Array(100);
  console.clear();

  let cursor = [0, 0];
  display(puzzle, chances);

  while (chances > 0) {
    const n = await Deno.stdin.read(buffer);
    const { isMouse, mouseX, mouseY, isValue, value } = parseChunk(
      buffer.slice(0, n),
    );
    if (isMouse) {
      cursor = getPosition(mouseX, mouseY, cursor);
      await moveCursor(mouseX, mouseY);
      continue;
    }

    if (isValue) {
      const isValid = validate(cursor, value, solvedPuzzle);
      if (isValid) {
        puzzle[cursor[0]][cursor[1]] = "\x1b[32m" + value + "\x1b[0m";
      } else {
        puzzle[cursor[0]][cursor[1]] = "\x1b[31m" + value + "\x1b[0m";
        chances--;
      }

      console.clear();
      display(puzzle, chances);
    }

    if (
      puzzle.map((row) => row.map((cell) => stripAnsiCode(cell))).toString() ===
        solvedPuzzle.toString()
    ) {
      await avengersEndGame(puzzle, chances, "JEET GYA BHAI");
      return;
    }
  }

  await avengersEndGame(puzzle, chances, "HAR GYA BHAI");
};

const avengersEndGame = async (puzzle, chances, msg) => {
  await moveCursor(0, 0);
  console.clear();
  await display(puzzle, chances);
  console.log(msg);
  await disableMouse();
};
