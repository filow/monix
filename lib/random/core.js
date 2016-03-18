"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class RandomUtility {
  static linear() {
    let step = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    return function _linear(fromVal, to) {
      const stepLeap = Math.floor((to - fromVal + 1) / step);
      const rand = Math.floor(Math.random() * (stepLeap + 1));
      return fromVal + rand * step;
    };
  }
}
const Ru = RandomUtility;
class Random {
  static number(_from, _to) {
    let func = arguments.length <= 2 || arguments[2] === undefined ? RandomUtility.linear() : arguments[2];

    let fromVal;
    let to;
    if (_from > _to) {
      to = _from;
      fromVal = _to;
    } else {
      to = _to;
      fromVal = _from;
    }
    return func(fromVal, to);
  }
}
exports.default = { R: Random, Ru };