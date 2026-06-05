import { clearScreen, moveCursor, write } from "./helpers.js";
import { disableMouse } from "./setup.js";
import { stripAnsiCode } from "@std/fmt/colors";
import { getTime } from "./timer.js";

export class Game {
  constructor(puzzle, solvedPuzzle, preFills) {
    this.puzzle = puzzle;
    this.solvedPuzzle = solvedPuzzle;
    this.approvedCells = preFills;
    this.cursor = null;
    this.life = 5;
    this.isGameEnded = false;
    this.startTime = Date.now();
  }

  #isValid(value) {
    return this.solvedPuzzle[this.cursor.y][this.cursor.x] === value;
  }

  #writeToPuzzle(colorCode, value) {
    this.puzzle[this.cursor.y][this.cursor.x] = colorCode + value + "\x1b[0m";
  }

  #YELLOW = "\x1b[33m";
  #RESET = "\x1b[0m";

  #horizontal =
    `${this.#YELLOW}┠━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┨${this.#RESET}`;
  #top = `${this.#YELLOW}┏━━━┯━━━┯━━━┳━━━┯━━━┯━━━┳━━━┯━━━┯━━━┓${this.#RESET}`;
  #middle =
    `${this.#YELLOW}┠${this.#RESET}───┼───┼───${this.#YELLOW}╋${this.#RESET}───┼───┼───${this.#YELLOW}╋${this.#RESET}───┼───┼───${this.#YELLOW}┨${this.#RESET}`;
  #bottom =
    `${this.#YELLOW}┗━━━┷━━━┷━━━┻━━━┷━━━┷━━━┻━━━┷━━━┷━━━┛${this.#RESET}`;

  #createScreen() {
    let screen = `${this.#top}\n`;
    for (let row = 0; row < 9; row++) {
      for (let colm = 0; colm < 9; colm++) {
        if (colm % 3 === 0) screen += `${this.#YELLOW}┃${this.#RESET}`;
        else screen += `│`;
        screen += ` ${this.puzzle[row][colm]}${this.#RESET} `;
      }

      if ((row + 1) % 3 === 0 && row !== 8) {
        screen += `${this.#YELLOW}┃${this.#RESET}\n` + this.#horizontal + `\n`;
      } else if (row !== 8) {
        screen += `${this.#YELLOW}┃${this.#RESET}\n${this.#middle}\n`;
      }
    }

    return screen + `${this.#YELLOW}┃${this.#RESET}\n` + this.#bottom;
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
      this.cursor = { y, x };
      await this.display();
      await moveCursor(mouseX, mouseY);
    }
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
    await clearScreen();
    await this.display();
  }

  async clearValue() {
    this.puzzle[this.cursor.y][this.cursor.x] = " ";
    await clearScreen();
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
    await clearScreen();
    await this.display();
    await write(`\n${msg}`);
    await disableMouse();
  }

  status() {
    const timeTaken = getTime(this.startTime);
    if (this.life <= 0) {
      this.isGameEnded = true;
      return {
        message: `LOST\nTime Taken -> ${timeTaken.min} : ${timeTaken.sec}\n`,
      };
    }

    if (this.isPuzzleComplete()) {
      this.isGameEnded = true;
      return {
        message: `WON\nTime Taken -> ${timeTaken.min} : ${timeTaken.sec}\n`,
      };
    }
    return { message: "In progress" };
  }
}
