"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linear = linear;
function linear(params) {
  var _params$step = params.step;
  const step = _params$step === undefined ? 1 : _params$step;
  const min = params.min;
  const max = params.max;

  let fromVal = min;
  let to = max;
  // 如果数值增长方向和from-to的方向相反，就调换一下
  if ((to - fromVal) * step < 0) {
    fromVal = max;
    to = min;
  }
  const stepLeap = Math.floor((to - fromVal) / step);
  const rand = Math.floor(Math.random() * (stepLeap + 1));
  return fromVal + rand * step;
}