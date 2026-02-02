export class Score {
  constructor() {
    this.correct = 0;
    this.wrong = 0;
  }

  update(isCorrect) {
    if (isCorrect) {
      this.correct++;
    } else {
      this.wrong++;
    }
    return this.score();
  }

  score() {
    return [this.correct, this.wrong];
  }
}
