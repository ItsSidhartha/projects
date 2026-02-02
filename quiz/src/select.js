import { select } from "@inquirer/prompts";

export const selectAnswer = async (question) => {
  const choices = question.choices.map((choice) => {
    return {
      name: choice.name,
      value: choice.value || choice.name,
    };
  });

  return await select({
    message: question.question,
    choices,
  });
};
