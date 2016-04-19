/* eslint-disable prefer-arrow-callback, strict */
'use strict';
const assert = require('assert');
const Loader = require('../lib/loader.js').default;
const loader = new Loader();
loader.load('TestBase', function baseLoader(exports, api) {
  api.base = 1;
});
describe('Loader', () => {
  it('单例类', () => {
    const instance = Loader.instance;
    const newI = new Loader();
    assert.deepEqual(loader, instance);
    assert.deepEqual(loader, newI);
  });
  it('不能重复定义模块', () => {
    function errroFn() {
      loader.load('TestBase', function anotherLoader(exports, api) {
        api.base = 5;
      });
    }
    assert.throws(errroFn, /不能重复定义/);
  });
  it('前置依赖设定', () => {
    function loadFn() {
      loader.load('TestThird', function depLoader(exports, api) {
        api.base = 5;
      }, ['TestBase', 'TestPre']);
    }
    assert.throws(loadFn, /前置依赖/);
    loader.load('TestPre', function preLoader(exports, api) {
      api.pre = 'pre';
    });
    assert.doesNotThrow(loadFn, Error);
  });
  it('支持的模块类型#class with onload', () => {
    function classWithOnload() {
      class Demo {
        static _onload() { }
      }
      loader.load('classWithOnload', Demo);
    }
    function classWithoutOnload() {
      class DemoNoOnload {
        static foo() { }
      }
      loader.load('classWithoutOnload', DemoNoOnload);
    }
    assert.doesNotThrow(classWithOnload, Error);
    assert.throws(classWithoutOnload, Error);
  });
  it('支持的模块类型#object with onload', () => {
    function objectWithOnload() {
      loader.load('objectWithOnload', { _onload: () => 111 });
    }
    function objectWithoutOnload() {
      loader.load('objectWithoutOnload', { foo: () => 111 });
    }
    assert.doesNotThrow(objectWithOnload, Error);
    assert.throws(objectWithoutOnload, Error);
  });
  it('支持的模块类型#esmodule object', () => {
    function esmodule() {
      loader.load('esmodule', { default: { _onload: () => 111 } });
    }
    assert.doesNotThrow(esmodule, Error);
  });
  it('支持的模块类型#function names *loader', () => {
    function functionWithloader() {
      loader.load('functionWithloader', function testLoader() { });
    }
    function functionWithoutloader() {
      loader.load('functionWithoutloader', function foo() { });
    }
    assert.doesNotThrow(functionWithloader, Error);
    assert.throws(functionWithoutloader, Error);
  });
});
