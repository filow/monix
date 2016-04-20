const MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10);
const PID = typeof process === 'undefined' ||
  (typeof process.pid !== 'number' ? Math.floor(Math.random() * 100000) : process.pid) % 0xFFFF;
let index = parseInt(Math.random() * 0xFFFFFF, 10);
function toFixedHex(val, length) {
  if (typeof val === 'number') {
    return this.pad(val.toString(16).substring(0, length), length);
  }
  return this.pad(val.substring(0, length), length);
}
export function mongoid(params = {}) {
  const { timestamp = Number(new Date()), machine = MACHINE_ID, pid = PID } = params;
  let result = '';
  result += toFixedHex.call(this, Math.floor(timestamp / 1000), 8);
  result += toFixedHex.call(this, machine, 6);
  result += toFixedHex.call(this, pid, 4);
  result += toFixedHex.call(this, index, 6);
  index++;
  return result;
}
