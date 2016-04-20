// inspired by https://github.com/bahamas10/node-random-mac
export function mac(params = {}) {
  const { prefix = '54:52:00' } = params;
  let macAddr = prefix;
  for (let i = 0; i < 3; i++) {
    macAddr += ':';
    macAddr += this.pad(this.chance.natural({ min: 0, max: 255 }).toString(16), 2);
  }

  return macAddr;
}
