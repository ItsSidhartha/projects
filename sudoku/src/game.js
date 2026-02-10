import { moveCursor, write } from "./helpers.js";
import { disableMouse } from "./setup.js";
import { stripAnsiCode } from "@std/fmt/colors";

export class Game {
  constructor(puzzle, solvedPuzzle, preFills) {
    this.puzzle = puzzle;
    this.solvedPuzzle = solvedPuzzle;
    this.approvedCells = new Set(preFills);
    this.cursor = null;
    this.life = 5;
  }

  #isValid(value) {
    return this.solvedPuzzle[this.cursor.y][this.cursor.x] === value;
  }

  #writeToPuzzle(colorCode, value) {
    this.puzzle[this.cursor.y][this.cursor.x] = colorCode + value + "\x1b[0m";
  }

  #horizontal = "┠━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┨";
  #top = "┏━━━┯━━━┯━━━┳━━━┯━━━┯━━━┳━━━┯━━━┯━━━┓";
  #middle = "┠───┼───┼───╋───┼───┼───╋───┼───┼───┨";
  #bottom = "┗━━━┷━━━┷━━━┻━━━┷━━━┷━━━┻━━━┷━━━┷━━━┛";

  #createScreen() {
    let screen = `${this.#top}\n`;

    for (let row = 0; row < 9; row++) {
      for (let colm = 0; colm < 9; colm++) {
        if (colm % 3 === 0) screen += "┃";
        else screen += "│";
        screen += ` ${this.puzzle[row][colm]} `;
      }

      if ((row + 1) % 3 === 0 && row !== 8) {
        screen += "┃\n" + this.#horizontal + "\n";
      } else if (row !== 8) screen += `┃\n${this.#middle}\n`;
    }

    return screen + "┃\n" + this.#bottom;
  }

  async display() {
    await moveCursor(0, 0);
    await write(this.#createScreen());
    await write(`\nLifes: ${"❤️".repeat(this.life)}`);
    await write(`${"🩶".repeat(5 - this.life)}\n`);
  }

  async setCursor(mouseX, mouseY) {
    const y = Math.floor(mouseY / 2) - 1;
    const x = Math.floor((mouseX - 1) / 4);
    const isNotApproved = !this.approvedCells.has(`${y}-${x}`);
    const isValidPosition = isNotApproved && y <= 8 && x <= 8;

    if (isValidPosition) {
      await moveCursor(mouseX, mouseY);
      this.cursor = { y, x };
    }
  }

  async #clearScreen() {
    await write("\x1b[2J");
  }

  #RED = "\x1b[31m";
  #GREEN = "\x1b[32m";

  async handleValue(value) {
    let color;
    if (this.#isValid(value)) {
      color = this.#GREEN;
      this.approvedCells.add(`${this.cursor.y}-${this.cursor.x}`);
    } else {
      color = this.#RED;
      this.life--;
    }

    this.#writeToPuzzle(color, value);
    this.cursor = null;
    await this.#clearScreen();
    await this.display();
  }

  isPuzzleComplete() {
    const plainPuzzle = this.puzzle.map((row) =>
      row.map((cell) => stripAnsiCode(cell))
    );

    return plainPuzzle.toString() === this.solvedPuzzle.toString();
  }

  async endGame(msg) {
    await moveCursor(0, 0);
    await this.#clearScreen();
    await this.display();
    await write(`\n${msg}`);
    await disableMouse();
  }

  status() {
    if (this.life <= 0) return { isGameEnded: true, message: "LOST\n" };
    if (this.isPuzzleComplete()) return { isGameEnded: true, message: "WON\n" };
    return { isGameEnded: false };
  }
}
