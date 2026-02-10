const encode = (text) => new TextEncoder().encode(text);

const enableMouse = async () => {
  const esc = "\x1b[?1000h\x1b[?1006h";
  await Deno.stdout.write(encode(esc));
};

export const disableMouse = async () => {
  const esc = "\x1b[?1000l\x1b[?1006l";
  await Deno.stdout.write(encode(esc));
};

const setraw = async () => {
  await Deno.stdin.setRaw(true, { cbreak: true });
};

export const setup = async () => {
  await setraw();
  await enableMouse();
};
