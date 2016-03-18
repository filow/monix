/* eslint-disable prefer-rest-params, func-names, strict */
'use strict';
const random = require('../lib/random/core').default;
const assert = require('assert');
const R = random.R;
const Ru = random.Ru;

describe('RandomUtility', () => {
  it('#linear 应当返回正确的区间内数值', () => {
    // step = 7
    const linear = Ru.linear(7);
    const results = [1, 8, 15, 22, 29];
    const from = 1;
    const to = 30;
    for (let i = 0; i < 10; i++) {
      const result = linear(from, to);
      assert(results.indexOf(result) >= 0);
    }
  });
});
