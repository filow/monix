/* eslint-disable prefer-rest-params, func-names, strict */
'use strict';
const u = require('../lib/util');
const assert = require('assert');
class FakeConsole {
  constuctor() {
    this.type = '';
    this.msg = [];
  }
  _do(type, argu) {
    const arg = [].slice.call(argu);
    // 删除第一个时间的节点
    arg.shift();
    arg[0] = arg[0].match(/\[(\w+)\]/)[1];
    this.type = type;
    this.msg = arg;
  }
}
['log', 'info', 'warn'].forEach((i) => {
  FakeConsole.prototype[i] = function () {
    this._do(i, arguments);
  };
});
function envHelper(func) {
  // TEST环境不会出现Log
  process.env.NODE_ENV = 'development';
  func();
  process.env.NODE_ENV = 'test';
}
// 将原生console替换为模拟Console
const fakec = new FakeConsole();
u.setConsole(fakec);

describe('util', () => {
  it('#debug', () => {
    envHelper(() => u.debug('bar'));
    assert.equal(fakec.type, 'log');
    assert.equal(fakec.msg[0], 'DEBUG');
    assert.equal(fakec.msg[1], 'bar');
  });
  it('#info', () => {
    envHelper(() => u.info('bar'));
    assert.equal(fakec.type, 'info');
    assert.equal(fakec.msg[0], 'INFO');
    assert.equal(fakec.msg[1], 'bar');
  });
  it('#warn', () => {
    envHelper(() => u.warn('bar'));
    assert.equal(fakec.type, 'warn');
    assert.equal(fakec.msg[0], 'WARN');
    assert.equal(fakec.msg[1], 'bar');
  });
  it('#error', () => {
    assert.throws(() => u.error('bar'), /bar/);
  });

  it('#mixin', () => {
    const origin = { foo: 1 };
    u.mixin(origin, { bar() { } });
    assert.equal(origin.foo, 1);
    assert.equal(typeof origin.bar, 'function');
  });
});
