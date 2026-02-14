const createDomain = () => {
  return Array.from(
    { length: 9 },
    () => Array.from({ length: 9 }, () => [1, 2, 3, 4, 5, 6, 7, 8, 9]),
  );
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

const spliceFromPadosi = (y, x, num, domain, grid) => {
  const padosi = createPadosiCordinates(y, x);
  padosi.forEach((p) => {
    const padosiDomain = domain[p.y][p.x];
    const index = padosiDomain.findLastIndex((x) => x === num);
    if (index !== -1) {
      padosiDomain.splice(index, 1);
    }

    if (padosiDomain.size === 1) {
      const [remaining] = [...padosiDomain];
      grid[p.y][p.x] = remaining;
      spliceFromPadosi(p.y, p.x, remaining, domain, grid);
    }
  });
};

const pickNumber = (set) => {
  const index = Math.floor(Math.random() * 10) % set.length;
  return set[index];
};

const createGrid = (row, colm) => {
  return Array.from(
    { length: row },
    () => Array.from({ length: colm }, () => ""),
  );
};

const saveState = (domain, row, colm) => {
  domainLog.push({
    domain: domain.map((x) => x.map((y) => [...y])),
    row,
    colm,
  });
};

const backTrack = (domain, colm, row) => {
  const index = domainLog.findLastIndex((x) => {
    return x["domain"][row][colm].length > 1;
  });

  domainLog.splice(index, domainLog.length - index);

  domain = domainLog.at(-1)["domain"];
  colm = domainLog.at(-1).colm - 1;
  row = domainLog.at(-1).row;
  return { domain, colm, row };
};

const initPuzzle = (domain) => {
  const grid = createGrid(9, 9);

  for (let row = 0; row < 9; row++) {
    for (let colm = 0; colm < 9; colm++) {
      saveState([...domain], row, colm);
      const number = pickNumber(domain[row][colm]);
      if (number) {
        grid[row][colm] = number;
        spliceFromPadosi(row, colm, number, domain, grid);
        continue;
      }

      ({ row, colm, domain } = backTrack(domain, colm, row));
    }
  }

  return grid;
};

export const createPuzzle = () => {
  const domain = createDomain();
  return initPuzzle(domain);
};
