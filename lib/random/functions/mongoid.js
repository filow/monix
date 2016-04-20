'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mongoid = mongoid;
const MACHINE_ID = parseInt(Math.random() * 0xFFFFFF, 10);
const PID = typeof process === 'undefined' || (typeof process.pid !== 'number' ? Math.floor(Math.random() * 100000) : process.pid) % 0xFFFF;
let index = parseInt(Math.random() * 0xFFFFFF, 10);
function toFixedHex(val, length) {
  if (typeof val === 'number') {
    return this.pad(val.toString(16).substring(0, length), length);
  }
  return this.pad(val.substring(0, length), length);
}
function mongoid() {
  let params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _params$timestamp = params.timestamp;
  const timestamp = _params$timestamp === undefined ? Number(new Date()) : _params$timestamp;
  var _params$machine = params.machine;
  const machine = _params$machine === undefined ? MACHINE_ID : _params$machine;
  var _params$pid = params.pid;
  const pid = _params$pid === undefined ? PID : _params$pid;

  let result = '';
  result += toFixedHex.call(this, Math.floor(timestamp / 1000), 8);
  result += toFixedHex.call(this, machine, 6);
  result += toFixedHex.call(this, pid, 4);
  result += toFixedHex.call(this, index, 6);
  index++;
  return result;
}