"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
class RandomUtility {
  static linear() {
    let step = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    return function _linear(_from, _to) {
      let fromVal = _from;
      let to = _to;
      // 如果数值增长方向和from-to的方向相反，就调换一下
      if ((to - fromVal) * step < 0) {
        fromVal = _to;
        to = _from;
      }
      const stepLeap = Math.floor((to - fromVal) / step);
      const rand = Math.floor(Math.random() * (stepLeap + 1));
      return fromVal + rand * step;
    };
  }
}
const Ru = RandomUtility;
class Random {
  static number(fromVal, to) {
    let func = arguments.length <= 2 || arguments[2] === undefined ? RandomUtility.linear() : arguments[2];

    return func(fromVal, to);
  }
  static bool() {}
}
exports.default = { R: Random, Ru };