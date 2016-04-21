/* eslint-disable strict */
'use strict';
const monix = require('../../');
const Random = monix.core.Random;
const assert = require('assert');
const random = new Random();
describe('Random#helper', () => {
  const arr = [1, 2, 3, 4];
  it('pickone', () => {
    const one = random.pickone(arr);
    assert(arr.indexOf(one) >= 0);
  });
  it('pickset', () => {
    const dataSet = random.pickset(arr, 2);
    dataSet.forEach((v) => assert(arr.indexOf(v) >= 0));
  });
  it('pad', () => {
    let text = random.pad('12', 5);
    assert.equal(text, '00012');
    text = random.pad('12', 5, 'Z');
    assert.equal(text, 'ZZZ12');
  });
  it('concat', () => {
    const concat = random.concat(1, 'h', () => 'e');
    assert.equal(concat(), '1he');
    assert.equal(concat(','), '1,h,e');
  });
  it('shuffle', () => {
    const testArr = [1, 2, 3, 4, 5];
    const resultArr = random.shuffle(testArr);
    resultArr.forEach(e => {
      assert(testArr.indexOf(e) >= 0);
    });
    assert.equal(resultArr.length, testArr.length);
  });
  it('n', () => {
    const itemSimple = 'str';
    const simpleArr = random.n(itemSimple, 5);
    simpleArr.forEach(e => assert.equal(e, itemSimple));

    const func = random.natural({ min: 0, max: 10 });
    const funcArr = random.n(func, 5);
    funcArr.forEach(e => {
      assert.equal(typeof e, 'function');
      const val = e();
      assert(val >= 0 && val <= 10);
    });
  });
  it('uniq', () => {
    const arrSimple = [1, 2, 2, 4, 5, 3, 1, 2, 4];
    let filtered = random.unique(arrSimple);
    assert.equal(filtered.length, 5);
    const func = [() => 1, () => 2, () => 1];
    filtered = random.unique(func);
    assert.equal(filtered.length, 2);
    filtered.forEach(e => assert(e === 1 || e === 2));
  });
  it('uniqueN', () => {
    const uniqArr = random.uniqueN(random.natural({ min: 10, max: 1000 }), 50);
    let filteredArr = random.unique(uniqArr);
    assert.equal(uniqArr.length, filteredArr.length);

    const illegalSimple = random.uniqueN(5, 10);
    filteredArr = random.unique(illegalSimple);
    assert.equal(filteredArr.length, 1);
  });
});
