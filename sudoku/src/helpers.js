const encode = (text) => new TextEncoder().encode(text);

export const write = async (input) => await Deno.stdout.write(encode(input));
export const moveCursor = async (x, y) => await write(`\x1b[${y};${x}H`);