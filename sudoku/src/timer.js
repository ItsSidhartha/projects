export const getTime = (initialTime) => {
  const dif = Date.now() - initialTime;
  const sec = Math.floor(dif / 1000);
  const min = Math.floor(sec / 60);
  return { min, sec: sec % 60 };
};
