import { dispResult } from "./display.js";
import { selectAnswer } from "./select.js";

const evaluate = (correctAns, answer) => correctAns === answer;

export const ask = async (question, score) => {
  const answer = await selectAnswer(question);
  const isCorrect = evaluate(question.correctAns, answer);
  score.update(isCorrect);
  dispResult(isCorrect, question.correctAns);
};
  