/* eslint-disable strict */
'use strict';
const monix = require('../../');
const Random = monix.core.Random;
const assert = require('assert');
const random = new Random();
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

  it('datetime {date}', () => {
    // 1. Javascript日期对象
    const dateObj = new Date(2016, 0, 1);
    let d = random.datetime({ date: dateObj });
    const isoString = dateObj.toISOString();
    assert.equal(d(), isoString);
    // 2，Unix偏移量（毫秒）
    d = random.datetime({ date: dateObj.valueOf() });
    assert.equal(d(), isoString);
    // 3. ISO 8601
    d = random.datetime({ date: isoString });
    assert.equal(d(), isoString);
  });
  it('datetime {year, month ...}', () => {
    const obj = { year: 2016, month: 0, day: 1, hour: 13, minute: 45, second: 12 };
    const operationMap = {
      year: 'getYear', month: 'getMonth',
      day: 'getDate', hour: 'getHours',
      minute: 'getMinutes', second: 'getSeconds' };
    const each = require('lodash/each');

    each(obj, (v, k) => {
      const initVal = { format: 'date' };
      initVal[k] = v;
      const d = random.datetime(initVal);
      // d()取得返回的Date对象，然后通过operationMap[k]找到应该调用的取值方法
      let testVal = d()[operationMap[k]]();
      // getYear的返回值需要加上1900
      if (k === 'year') testVal += 1900;
      assert.equal(testVal, v);
    });
  });
  it('datetime 无参数调用', () => {
    const d = random.datetime();
    assert(d().match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/));
  });

  it('datetime {format}', () => {
    // 字符串format
    let d = random.datetime({ format: 'YYYY-MM-DD' });
    assert(d().match(/\d{4}-\d{2}-\d{2}/));
    d = random.datetime({ format: 'array' });
    assert.equal(d().length, 7);
    d = random.datetime({ format: 'date' });
    assert.equal(typeof d(), 'object');
    d = random.datetime({ format: 'unix' });
    assert(d().toString().match(/\d+/));
    d = random.datetime({ format: 'milliseconds' });
    assert(d().toString().match(/\d+/));
  });

  it('mac', () => {
    const d = random.mac();
    assert(d().match(/^([0-9a-f]{2}\:){5}[0-9a-f]{2}$/));
    const dPrefix = random.mac({ prefix: '30:40:50' });
    assert(dPrefix().match(/^30\:40\:50\:([0-9a-f]{2}\:){2}[0-9a-f]{2}$/));
  });

  it('phone', () => {
    const d = random.phone();
    assert(d().match(/^0[0-9]{2,3}\-[2-9][0-9]{6,7}$/));
    const dNoArea = random.phone({ areacode: false });
    assert(dNoArea().match(/^[2-9][0-9]{6,7}$/));
    const dAll = random.phone({ areacode: true, extension: true });
    assert(dAll().match(/^0[0-9]{2,3}\-[2-9][0-9]{6,7}\-[0-9]{1,4}$/));
  });

  it('mobile', () => {
    const d = random.mobile();
    assert(d().match(/^1([358][0-9]|4[57])[0-9]{8}$/));
  });

  it('cnName', () => {
    let name = random.cnName()();
    assert(name.length >= 2 && name.length <= 5);
    name = random.cnName({ surname: false })();
    assert(name.length >= 1 && name.length <= 3);
    name = random.cnName({ surname: false, name: false })();
    assert.equal(name, '');
    name = random.cnName({ surname: false, name: -1 })();
    assert.equal(name.length, 1);
    name = random.cnName({ surname: false, name: 1 })();
    assert.equal(name.length, 1);
    name = random.cnName({ surname: false, name: 3 })();
    assert.equal(name.length, 3);
    name = random.cnName({ surname: false, name: 4 })();
    assert.equal(name.length, 3);
    name = random.cnName({ surname: false, name: '金' })();
    assert.equal(name.length, 1);
    name = random.cnName({ surname: false, name: '金木水' })();
    assert.equal(name.length, 3);
    name = random.cnName({ surname: false, name: '火土火土' })();
    assert.equal(name.length, 3);
  });

  it('id', () => {
    const t = random.id();
    for (let i = 0; i < 10; i++) {
      assert.equal(t(), i + 1);
    }
  });

  it('mongoid', () => {
    // 格式检查
    let t = random.mongoid()();
    assert(t.match(/^[0-9a-f]{24}$/));
    // 自定义时间戳
    const timestamp = Number(new Date(2010, 1, 1));
    const expectedTimeHex = Math.floor(timestamp / 1000).toString(16);
    t = random.mongoid({ timestamp })();
    assert.equal(t.substring(0, 8), expectedTimeHex);
    // 记录当前的序号
    const baseOrder = parseInt(t.substring(18, 24), 16);
    // 检查自定义序号时符号不足是否会补0
    t = random.mongoid({ machine: 'ff0' })();
    assert.equal(t.substring(8, 14), '000ff0');
    // 记录序号
    const order = parseInt(t.substring(18, 24), 16);
    // 两个序号应该相差1
    assert.equal(baseOrder + 1, order);
    // 检查自定义序号超过数量会不会截断
    t = random.mongoid({ machine: 'ffaabbcc0' })();
    assert.equal(t.substring(8, 14), 'ffaabb');
    // 检查传入数字会不会转换为hex
    t = random.mongoid({ machine: 255 })();
    assert.equal(t.substring(8, 14), '0000ff');
    // 检查pid
    t = random.mongoid({ pid: 255 })();
    assert.equal(t.substring(14, 18), '00ff');
    t = random.mongoid({ pid: 'abcd' })();
    assert.equal(t.substring(14, 18), 'abcd');
  });
});
