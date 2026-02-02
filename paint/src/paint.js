const decoder = new TextDecoder();
const encoder = new TextEncoder();

const enableMouse = async () => {
  const esc = "\x1b[?1003h\x1b[?1006h";
  await Deno.stdout.write(encoder.encode(esc));
};

const disableMouse = async () => {
  const esc = "\x1b[?1003l\x1b[?1006l";
  await Deno.stdout.write(encoder.encode(esc));
};

const write = async (input) => {
  await Deno.stdout.write(encoder.encode(input));
};

const moveCursor = async (x, y) => {
  const esc = `\x1b[${y};${x}H`;
  await write(esc);
};

const COLORS = {
  black: "\x1b[40m",
  red: "\x1b[41m",
  green: "\x1b[42m",
  yellow: "\x1b[43m",
  blue: "\x1b[44m",
  magenta: "\x1b[45m",
  cyan: "\x1b[46m",
  white: "\x1b[47m",
  reset: "\x1b[0m",
};

const paint = async (color, x, y) => {
  await moveCursor(x, y);

  write(COLORS[color] + " " + "\n");
};

const writeAt = async (x, y, text) => {
  await moveCursor(x, y);
  write(text);
};

const pickColor = (x) => {
  if (x <= 10) {
    return "green";
  }

  if (x > 10 && x <= 20) {
    return "yellow";
  }
  if (x > 20 && x <= 30) {
    return "blue";
  }

  if (x > 30 && x <= 40) {
    return "magenta";
  }

  if (x > 40 && x <= 50) {
    return "cyan";
  }

  if (x > 50 && x <= 60) {
    return "white";
  }

  if (x > 60 && x <= 70) {
    return "red";
  }
  if (x > 70 && x <= 80) {
    return "reset";
  }
};

const createColorPicker = async () => {
  const y = 38;

  for (let x = 0; x < 70; x++) {
    const color = pickColor(x);

    await writeAt(x, y, COLORS[color] + " ");
  }

  await writeAt(72, y, COLORS["reset"] + "ERASE");
};

const isExitCode = (chunk) => {
  return chunk.includes(3) || chunk.includes(101);
};

const parseChunk = (chunk) => {
  const data = decoder.decode(chunk);
  const matched = data.match(/\x1b\[<(\d+);(\d+);(\d+)([mM])/);
  if (!matched) return { success: false };
  const [, btn, x, y, type] = matched;
  return { success: true, btn, x, y, type };
};

const exit = async (exitCode) => {
  await disableMouse();
  Deno.exit(exitCode);
};

const prosessStroke = (chunk, color) => {
  if (isExitCode(chunk)) exit(1);
  const { success, btn, x, y, type } = parseChunk(chunk);
  if (!success) return;

  if (btn === "0" && type === "M" && y === "38") {
    color.curr = pickColor(x) || color.curr;
  }

  if (btn === "32" && type === "M") {
    paint(color.curr, x, y);
  }
};

export const startPainting = async () => {
  await write("\x1B[2J");
  // await writeAt(0, 38, "GREEN");
  await writeAt(0, 0, "Move cursor to draw and enter e to exit");
  await createColorPicker();
  await enableMouse();
  await Deno.stdin.setRaw(true);
  const color = { curr: "red" }; // Default color

  for await (const chunk of Deno.stdin.readable) {
    prosessStroke(chunk, color);
  }

  await disableMouse();
};

// await startPainting();
