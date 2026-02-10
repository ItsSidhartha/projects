const decoder = new TextDecoder();
const encoder = new TextEncoder();

export const enableMouse = async () => {
  const esc = "\x1b[?1000h\x1b[?1006h";
  await Deno.stdout.write(encoder.encode(esc));
};

export const disableMouse = async () => {
  const esc = "\x1b[?1000l\x1b[?1006l";
  await Deno.stdout.write(encoder.encode(esc));
};

export const setraw = async () => {
  await Deno.stdin.setRaw(true, { cbreak: true });
};
