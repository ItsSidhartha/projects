import { disableMouse } from "./setup.js";

const decode = (bytes) => new TextDecoder().decode(bytes);

const handleMouseEvent = (matched) => {
  const [, btn, mouseX, mouseY, type] = matched;
  const isButtonClicked = btn === "0" && type === "M";
  if (isButtonClicked) {
    return { isMouse: true, isValue: false, btn, mouseX, mouseY, type };
  }

  return { isMouse: false, isValue: false };
};

const parseChunk = async (chunk) => {
  const data = decode(chunk);
  if (data === "\x03") {
    await disableMouse();
    Deno.exit(1);
  }
  // deno-lint-ignore no-control-regex
  const matched = data.match(/\x1b\[<(\d+);(\d+);(\d+)([mM])/);

  if (matched) return handleMouseEvent(matched);

  const value = Number(data.trim());

  if (value) return { isValue: true, isMouse: false, value };

  return { isValue: false, isMouse: false };
};

export const readInput = async () => {
  const buffer = new Uint8Array(100);
  const n = await Deno.stdin.read(buffer);
  return await parseChunk(buffer.slice(0, n));
};
