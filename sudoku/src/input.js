import { decode } from "./helpers.js";
import { disableMouse } from "./setup.js";

const handleMouseEvent = (matched) => {
  const [, btn, mouseX, mouseY, type] = matched;
  const isButtonClicked = btn === "0" && type === "M";
  if (isButtonClicked) {
    return { isMouse: true, data: { btn, mouseX, mouseY, type } };
  }

  return { isMouse: false };
};

const parseChunk = async (chunk) => {
  const data = decode(chunk);
  const outputConfig = {
    isMouse: false,
    isValue: false,
    isBackSpace: false,
    data: {},
  };

  if (data === "\x03") {
    await disableMouse();
    Deno.exit(1);
  }
  // deno-lint-ignore no-control-regex
  const matched = data.match(/\x1b\[<(\d+);(\d+);(\d+)([mM])/);

  if (matched) return handleMouseEvent(matched);

  outputConfig.isBackSpace = data.trim() === "\x7f";

  const value = Number(data.trim());

  if (value) {
    outputConfig.isValue = true;
    outputConfig.data.value = value;
  }

  return outputConfig;
};

export const readInput = async () => {
  const buffer = new Uint8Array(100);
  const n = await Deno.stdin.read(buffer);
  return await parseChunk(buffer.slice(0, n));
};
