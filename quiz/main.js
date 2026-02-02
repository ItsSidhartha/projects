import { ask } from "./src/ask_questions.js";
import { dispFinalScroe } from "./src/display.js";
import { fetchQuestions } from "./src/fetch_questions.js";
import { prepareQuestion } from "./src/prepare_question.js";
import { Score } from "./src/score.js";

const main = async () => {
  const resQuestions = await fetchQuestions();

  const score = new Score();
  const questions = resQuestions.map(prepareQuestion);

  for (const question of questions) {
    await ask(question, score);
  }

  dispFinalScroe(score);
};

await main();
