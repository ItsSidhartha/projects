import { write } from "./helpers.js";

const enableMouse = async () => await write("\x1b[?1000h\x1b[?1006h");

export const disableMouse = async () => await write("\x1b[?1000l\x1b[?1006l");

const setraw = async () => await Deno.stdin.setRaw(true);

export const setup = async () => {
  await setraw();
  await enableMouse();
};
