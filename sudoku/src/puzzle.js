const createDomain = () => {
  const domain = [];
  for (let row = 0; row < 9; row++) {
    domain.push([]);
    for (let colm = 0; colm < 9; colm++) {
      domain[row][colm] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }
  }

  return [...domain];
};

const createBoxCordinate = (y, x) => {
  const box = [];
  const dy = y + (3 - ((y + 1) % 3)) % 3;
  const dx = x + (3 - ((x + 1) % 3)) % 3;

  let tempY = dy;
  for (let index = 0; index <= 2; index++) {
    let tempX = dx;

    for (let colm = 0; colm <= 2; colm++) {
      if (tempX !== x || tempY !== y) {
        box.push({ x: tempX, y: tempY });
      }
      tempX--;
    }
    tempY--;
  }

  return box;
};

const createPadosiCordinates = (y, x) => {
  const row = [];
  const colm = [];

  for (let index = 0; index < 9; index++) {
    if (x !== index) row.push({ y, x: index });
    if (y !== index) colm.push({ y: index, x });
  }

  const box = createBoxCordinate(y, x);
  return [...box, ...colm, ...row];
};

const domainLog = [];

const spliceFromPadosi = (y, x, num, domain, _grid) => {
  const padosi = createPadosiCordinates(y, x);
  padosi.forEach((p) => {
    // if (domain[p.y][p.x].has(num) && domain[p.y][p.x].size === 1) {
    //   domainLog.pop();
    //   domain = domainLog.at(-1);
    //   return;
    // }
    const index = domain[p.y][p.x].findLastIndex((x) => x === num);
    if (index !== -1) {
      domain[p.y][p.x].splice(index, 1);
    }
    if (domain[p.y][p.x].size === 1) {
      const [remaining] = [...domain[p.y][p.x]];
      _grid[p.y][p.x] = remaining;
      spliceFromPadosi(p.y, p.x, remaining, domain, _grid);
    }
  });
};

const pickNumber = (set) => {
  const index = Math.floor(Math.random() * 10) % set.length;
  return set[index];
};

const initPuzzle = (domain) => {
  let grid = Array.from(
    { length: 9 },
    () => Array.from({ length: 9 }, () => ""),
  );

  for (let row = 0; row < 9; row++) {
    for (let colm = 0; colm < 9; colm++) {
      domainLog.push({
        domain: domain.map((x) => x.map((y) => [...y])),
        grid: [...grid.map((x) => [...x])],
        row,
        colm,
      });
      const number = pickNumber(domain[row][colm]);
      if (!number) {
        // console.log("...................................................");
        // console.log(row, colm);

        const index = domainLog.findLastIndex((x) => {
          return x["domain"][row][colm].length > 1;
        });

        domainLog.splice(index, domainLog.length - index);

        row = domainLog.at(-1).row;
        colm = domainLog.at(-1).colm - 1;
        domain = domainLog.at(-1)["domain"];
        grid = domainLog.at(-1)["grid"];
        // console.log(row, colm);
        continue;
      }

      // console.log(row, colm);

      grid[row][colm] = number;
      spliceFromPadosi(row, colm, number, domain, grid);
      // console.log({ row, colm, domain });
      // prompt();
    }
  }

  return grid;
};

export const createPuzzle = () => {
  const domain = createDomain();
  return initPuzzle([...domain]);
  // console.log({ puzzle, domain });
};
