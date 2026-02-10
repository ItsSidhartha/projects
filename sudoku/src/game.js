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
  const y = Math.floor(mouseY / 2) - 1;
  const x = Math.floor((mouseX - 1) / 4);
  const isInvalidPosition = y > 8 || x > 8 || preFills.includes(`${y}-${x}`);

  if (isInvalidPosition) return cursor;
  await moveCursor(mouseX, mouseY);
  return { y, x };
};

const isPuzzleComplete = (puzzle, solvedPuzzle) => {
  const plainPuzzle = puzzle.map((row) =>
    row.map((cell) => stripAnsiCode(cell))
  );

  return plainPuzzle.toString() === solvedPuzzle.toString();
};

const writeToPuzzle = (puzzle, cursor, colorCode, value) => {
  puzzle[cursor.y][cursor.x] = colorCode + value + "\x1b[0m";
};

const handleValue = (puzzle, solvedPuzzle, cursor, value, chances) => {
  const isValid = validate(cursor, value, solvedPuzzle);
  if (isValid) {
    writeToPuzzle(puzzle, cursor, "\x1b[32m", value);
  } else {
    writeToPuzzle(puzzle, cursor, "\x1b[31m", value);
    chances--;
  }

  console.clear();
  display(puzzle, chances);
  cursor = null;
};

const readInput = async () => {
  const buffer = new Uint8Array(100);
  const n = await Deno.stdin.read(buffer);
  return parseChunk(buffer.slice(0, n));
};

const avengersEndGame = async (puzzle, chances, msg) => {
  await moveCursor(0, 0);
  console.clear();
  await display(puzzle, chances);
  console.log(msg);
  await disableMouse();
};

export const play = async (puzzle, solvedPuzzle, preFills) => {
  let chances = 5;
  console.clear();

  let cursor = { x: 0, y: 0 };
  display(puzzle, chances);

  while (chances > 0) {
    const { isMouse, isValue, mouseX, mouseY, value } = await readInput();

    if (isMouse) {
      cursor = await getPosition(mouseX, mouseY, cursor, preFills);
      continue;
    }

    if (isValue && cursor) {
      handleValue(puzzle, solvedPuzzle, cursor, value, chances);
    }

    if (isPuzzleComplete(puzzle, solvedPuzzle)) {
      await avengersEndGame(puzzle, chances, "JEET GYA BHAI");
      return;
    }
  }

  await avengersEndGame(solvedPuzzle, chances, "HAR GYA BHAI");
};
