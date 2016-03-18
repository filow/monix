/* eslint-disable prefer-rest-params, func-names, strict */
'use strict';
const random = require('../lib/random/core').default;
const assert = require('assert');
const R = random.R;
const Ru = random.Ru;
function inNumberArray(number, arr) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] - number < 1e-5) {
      return true;
    }
  }
  return false;
}
function assertInNumberArray(number, arr, msg) {
  assert(inNumberArray(number, arr), msg);
}
describe('RandomUtility#linear', () => {
  function linearHelper(fromVal, to, step, results) {
    // step = 7
    const linear = Ru.linear(step);
    for (let i = 0; i < 30; i++) {
      const r = linear(fromVal, to);
      assertInNumberArray(r, results, `${r}不是一个从${fromVal}到${to}, step=${step}的值`);
    }
  }
  it('整数', () => {
    linearHelper(1, 30, 7, [1, 8, 15, 22, 29]);
  });
  it('小数', () => {
    linearHelper(0.08, 0.6, 0.11, [0.08, 0.19, 0.30, 0.41, 0.52]);
  });
  it('负数', () => {
    linearHelper(-1.6, -6, -1, [-1.6, -2.6, -3.6, -4.6, -5.6]);
  });
  it('from和to方向错误纠正', () => {
    linearHelper(5, 1, 1, [1, 2, 3, 4, 5]);
    linearHelper(-5, -1, -1, [-1, -2, -3, -4, -5]);
  });
});
