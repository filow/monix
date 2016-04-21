/* eslint-disable strict */
'use strict';
const monix = require('../../');
const Random = monix.core.Random;
const assert = require('assert');
const random = new Random();

describe('Random#static', () => {
  it('_hash', () => {
    let hash = Random._hash({ id: 1 });
    assert.equal(hash, 'd2ce28b9a7fd7e4407e2b0fd499b7fe4');
    hash = Random._hash();
    assert.equal(hash, 'undefined');
  });
  it('_wrap', () => {
    const func = Random._wrap(() => 'test');
    assert.equal(typeof func, 'function');
    assert.equal(typeof func(), 'function');
    assert.equal(func.call(random)(), 'test');
  });
  it('add', () => {
    Random.add('testFun', () => 'hello');
    assert(random.testFun(), 'hello');
    // 试图再次添加，此次添加无效
    assert.throws(() => Random.add('testFun', () => 'world'), /已被使用/);
  });
  it('alias', () => {
    Random.add('testAlias', () => 'alias!');
    Random.alias('testA2', 'testAlias');
    assert(random.testA2(), 'alias!');
    // 试图alias到一个已存在的名字
    Random.add('testAlias2', () => 'alias!');
    assert.throws(() => Random.alias('testA2', 'testAlias2'), /已被使用/);
  });
  it('lazyload', () => {
    // 试图重复引入
    assert.throws(() => Random.lazyload('fakepath', 'city'), /已被使用/);
  });
});

describe('Random#config', () => {
  it('cache', () => {
    // 有参数调用测试
    const cacheRandom = random.instance({ cache: true });
    const a = cacheRandom.natural({ min: 1, max: 20 });
    const b = cacheRandom.natural({ min: 1, max: 20 });
    const c = cacheRandom.natural({ min: 21, max: 50 });
    assert.equal(a(), b());
    assert.equal(a(), b());
    assert.notEqual(a(), c());
    // 无参数调用测试
    const d = cacheRandom.integer();
    const e = cacheRandom.integer();
    assert.equal(d(), e());
  });
});
