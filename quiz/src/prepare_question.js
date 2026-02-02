const randomize = (array) => {
  for (let index = 0; index < array.length; index++) {
    const r = Math.floor(Math.random() * 100) % array.length;
    [array[index], array[r]] = [array[r], array[index]];
  }
  return array;
};

export const prepareQuestion = (question) => {
  const choices = [question.correct_answer, ...question.incorrect_answers].map(
    (choice) => ({ name: choice })
  );

  return {
    question: decodeURIComponent(question.question),
    choices: randomize(choices).map((choice) => ({
      value: choice.value,
      name: decodeURIComponent(choice.name),
    })),
    correctAns: decodeURIComponent(question.correct_answer),
  };
};
