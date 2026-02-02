const dispMsgFailMsg = (correctAns) => {
  console.log(
    `❌%cWrong Answer!%c Correct answer was ${correctAns}`,
    "color: red; font-weight: 900",
    "",
  );
};

const dispSuccessMsg = () => {
  console.log("✅%cCorrect Answer!", "color: green; font-weigth: 900");
};

export const dispResult = (isCorrect, correctAns) => {
  if (isCorrect) {
    dispSuccessMsg();
    return;
  }
  dispMsgFailMsg(correctAns);
};

export const dispFinalScroe = (score) => {
  const [correct, wrong] = score.score();
  const color = correct <= wrong ? "red" : "green";
  console.log(
    `\nYour final Score is %c${correct} - ${wrong}`,
    `font-weigth: bold; color: ${color}`,
  );
};

export const dispSelections = (selections) => {
  const msg =
    `\nHere's 10 ${selections.type} type ${selections.difficulty} questions on ${selections.category} : \n`;
  console.log(msg);
};
