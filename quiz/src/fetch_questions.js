import { dispSelections } from "./display.js";
import { selectAnswer } from "./select.js";

const createUrl = (config) => {
  return `https://opentdb.com/api.php?amount=10&category=${config.category}&difficulty=${config.difficulty}&type=${config.type}&encode=url3986`;
};

const askSpecification = async () => {
  const chooseRandom = (choices) => {
    const random = Math.floor(Math.random() * 100) % choices.length;
    return choices[random];
  };

  const categories = [
    {
      name: "Any",
      value: chooseRandom([
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
        26,
        27,
        28,
        29,
        30,
        31,
        32,
      ]),
    },
    { name: "General Knowledge", value: 9 },
    { name: "Entertainment: Books", value: 10 },
    { name: "Entertainment: Film", value: 11 },
    { name: "Entertainment: Music", value: 12 },
    { name: "Entertainment: Musicals & Theatres", value: 13 },
    { name: "Entertainment: Television", value: 14 },
    { name: "Entertainment: Video Games", value: 15 },
    { name: "Entertainment: Board Games", value: 16 },
    { name: "Science & Nature", value: 17 },
    { name: "Science: Computers", value: 18 },
    { name: "Science: Mathematics", value: 19 },
    { name: "Mythology", value: 20 },
    { name: "Sports", value: 21 },
    { name: "Geography", value: 22 },
    { name: "History", value: 23 },
    { name: "Politics", value: 24 },
    { name: "Art", value: 25 },
    { name: "Celebrities", value: 26 },
    { name: "Animals", value: 27 },
    { name: "Vehicles", value: 28 },
    { name: "Entertainment: Comics", value: 29 },
    { name: "Science: Gadgets", value: 30 },
    { name: "Entertainment: Japanese Anime & Manga", value: 31 },
    { name: "Entertainment: Cartoon & Animations", value: 32 },
  ];

  const difficulties = [
    { name: "Any", value: chooseRandom(["easy", "medium", "hard"]) },
    { name: "Easy", value: "easy" },
    { name: "Medium", value: "medium" },
    { name: "Hard", value: "hard" },
  ];

  const types = [
    { name: "Any", value: chooseRandom(["multiple", "boolean"]) },
    { name: "Multiple Choice", value: "multiple" },
    { name: "True / False", value: "boolean" },
  ];

  const category = await selectAnswer({
    question: "Select category",
    choices: categories,
  });

  const difficulty = await selectAnswer({
    question: "Select difficulty",
    choices: difficulties,
  });

  const type = await selectAnswer({ question: "Select type", choices: types });
  const selections = { category, difficulty, type };
  
  dispSelections({
    ...selections,
    category: categories.findLast((category) =>
      category.value === selections.category
    ).name, 
  });
  return selections;
};

export const fetchQuestions = async () => {
  const config = await askSpecification();
  const url = createUrl(config);
  const res = await fetch(url);
  const questions = (await res.json()).results;
  return questions;
};
