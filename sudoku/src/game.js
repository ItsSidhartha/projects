import { display, moveCursor } from "./display.js";
import { disableMouse } from "./setup.js";
import { stripAnsiCode } from "@std/fmt/colors";

const decoder = new TextDecoder();

const validate = ({ y, x }, value, solvedPuzzle) => {
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

const getPosition = async (mouseX, mouseY, cursor, preFills) => {
  const y = Math.floor(mouseY / 2) - 1; //Math.floor((+mouseY / 2) - 1);
  const x = Math.floor((mouseX - 1) / 4);
  if (y > 8 || x > 8 || preFills.includes(`${y}-${x}`)) return cursor;
  await moveCursor(mouseX, mouseY);
  return { y, x };
};

export const game = async (puzzle, solvedPuzzle, preFills) => {
  let chances = 5;
  const buffer = new Uint8Array(100);
  console.clear();

  let cursor = { x: 0, y: 0 };
  display(puzzle, chances);

  while (chances > 0) {
    const n = await Deno.stdin.read(buffer);
    const { isMouse, mouseX, mouseY, isValue, value } = parseChunk(
      buffer.slice(0, n),
    );

    if (isMouse) {
      cursor = await getPosition(mouseX, mouseY, cursor, preFills);
      continue;
    }

    if (isValue && cursor) {
      const isValid = validate(cursor, value, solvedPuzzle);
      if (isValid) {
        puzzle[cursor.y][cursor.x] = "\x1b[32m" + value + "\x1b[0m";
      } else {
        puzzle[cursor.y][cursor.x] = "\x1b[31m" + value + "\x1b[0m";
        chances--;
      }

      console.clear();
      display(puzzle, chances);
      cursor = null;
    }

    if (
      puzzle.map((row) => row.map((cell) => stripAnsiCode(cell))).toString() ===
        solvedPuzzle.toString()
    ) {
      await avengersEndGame(puzzle, chances, "JEET GYA BHAI");
      return;
    }
  }

  await avengersEndGame(solvedPuzzle, chances, "HAR GYA BHAI");
};

const avengersEndGame = async (puzzle, chances, msg) => {
  await moveCursor(0, 0);
  console.clear();
  await display(puzzle, chances);
  console.log(msg);
  await disableMouse();
};
