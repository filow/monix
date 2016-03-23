/* eslint-disable prefer-rest-params, func-names, strict */
'use strict';
const Random = require('../lib/random').default;
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
});

describe('Random#vendor', () => {
  it('randexp', () => {
    const regs = [/[1-6]/, /<([a-z]\w{0,20})>foo<\1>/, /random stuff: .+/];
    regs.forEach(i => {
      const value = random.randexp(i)();
      assert.equal(typeof value.match(i), 'object');
    });
  });
});

describe('Random#function', () => {
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

  it('linear', () => {
    function linearHelper(min, max, step, results) {
      for (let i = 0; i < 30; i++) {
        const r = random.linear({ min, max, step });
        assertInNumberArray(r(), results, `${r}不是一个从${min}到${max}, step=${step}的值`);
      }
    }
    // 整数
    linearHelper(1, 30, 7, [1, 8, 15, 22, 29]);
    // 小数
    linearHelper(0.08, 0.6, 0.11, [0.08, 0.19, 0.30, 0.41, 0.52]);
    // 负数
    linearHelper(-1.6, -6, -1, [-1.6, -2.6, -3.6, -4.6, -5.6]);
    // from和to方向错误纠正
    linearHelper(5, 1, 1, [1, 2, 3, 4, 5]);
    linearHelper(-5, -1, -1, [-1, -2, -3, -4, -5]);
    // 没有step的测试
    const nostep = random.linear({ min: 1, max: 2 });
    assertInNumberArray(nostep(), [1, 2]);
  });

  it('province', () => {
    assert.equal(typeof random.province()(), 'string');
  });

  it('city', () => {
    assert.equal(typeof random.city()(), 'string');
  });

  it('county', () => {
    assert.equal(typeof random.county()(), 'string');
  });
  it('address', () => {
    assert.equal(typeof random.address()(), 'string');
  });

  it('zipCode', () => {
    assert(random.zipCode()().match(/[1-9]\d{5}/));
  });
});
