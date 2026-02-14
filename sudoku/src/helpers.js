export const encode = (text) => new TextEncoder().encode(text);
export const decode = (bytes) => new TextDecoder().decode(bytes);

export const write = async (input) => await Deno.stdout.write(encode(input));
export const moveCursor = async (x, y) => await write(`\x1b[${y};${x}H`);
export const clearScreen = async () => await write("\x1b[2J");
