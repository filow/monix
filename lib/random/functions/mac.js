'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mac = mac;
// inspired by https://github.com/bahamas10/node-random-mac
function mac() {
  let params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _params$prefix = params.prefix;
  const prefix = _params$prefix === undefined ? '54:52:00' : _params$prefix;

  let macAddr = prefix;
  for (let i = 0; i < 3; i++) {
    macAddr += ':';
    macAddr += this.pad(this.chance.natural({ min: 0, max: 255 }).toString(16), 2);
  }

  return macAddr;
}