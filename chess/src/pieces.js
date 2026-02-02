export class King {
  constructor(color) {
    this.color = color;
    this.position = color === "white" ? { x: 4, y: 7 } : { x: 4, y: 0 }
    this.symbol = "K"
  }

  possibleMoves() {
    return [
      { x: this.position.x + 1, y: this.position.y },
      { x: this.position.x - 1, y: this.position.y },
      { x: this.position.x + 1, y: this.position.y + 1 },
      { x: this.position.x + 1, y: this.position.y - 1 },
      { x: this.position.x - 1, y: this.position.y + 1 },
      { x: this.position.x - 1, y: this.position.y - 1 },
      { x: this.position.x, y: this.position.y + 1 },
      { x: this.position.x, y: this.position.y - 1 },
    ]
  }

  draw(board) {
    board[this.position.y][this.position.x] = this.symbol;
  }

  move(target) {
    this.position = target;
  }
}

export class Pawn {
  constructor(color, col) {
    this.color = color;
    const row = color === "white" ? 6 : 1;
    this.position = { x: col, y: row };
    this.symbol = "P";
  }

  possibleMoves() {
    const head = this.color === "white" ? -1 : +1
    const moves = [
      { x: this.position.x, y: this.position.y + head },
      { x: this.position.x + 1, y: this.position.y + head },
      { x: this.position.x - 1, y: this.position.y + head }
    ]

    const isFirstMove =
      this.position.y === 1 && this.color === "black" ||
      this.position.y === 6 && this.color === "white";

    if (isFirstMove) {
      moves.push({ x: this.position.x, y: this.position.y + (head * 2) });
    }
    return moves;
  }

  draw(board) {
    board[this.position.y][this.position.x] = this.symbol;
  }

  move(target) {
    this.position = target;
  }
}