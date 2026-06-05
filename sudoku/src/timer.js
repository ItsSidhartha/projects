import { moveCursor, write } from "./helpers.js";

export const getTime = (initialTime) => {
  const dif = Date.now() - initialTime;
  const sec = Math.floor(dif / 1000);
  const min = Math.floor(sec / 60);
  return { min, sec: sec % 60 };
};

const showTimer = async (startTime) => {
  const time = getTime(startTime);
  await write("\x1b[s");
  await moveCursor(20, 20);
  await write(`${time.min} : ${time.sec}`);
  await write("\x1b[0J");
  await write("\x1b[u");
};

export const setIntervalForTimer = (game) => {
  const intervalId = setInterval(() => {
    if (game.isGameEnded) return clearInterval(intervalId);
    showTimer(game.startTime);
  }, 100);
};
