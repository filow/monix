'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _cache = require('./cache.js');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const randexp = require('randexp').randexp;
const u = require('../util');
const fs = require('fs');
const path = require('path');

const registedFunctions = {};
class Random {
  constructor() {
    let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var _options$cache = options.cache;
    const cache = _options$cache === undefined ? false : _options$cache;
    var _options$locale = options.locale;
    const locale = _options$locale === undefined ? 'cn' : _options$locale;
    const cacheStore = options.cacheStore;

    this.cache = cache;
    this.locale = locale;
    this.seed = Math.random().toString(16).split('.')[1];
    this.cacheStore = cacheStore || new _cache2.default(this.seed);
    this.chance = new _chance2.default(this.seed);
  }
  // 私有函数，获取一个对象JSON序列化后的哈希值
  static _hash(obj) {
    if (obj) {
      const hash = _crypto2.default.createHash('md5');
      hash.update(JSON.stringify(obj).toString());
      return hash.digest('hex');
    }
    return typeof obj;
  }
  // 私有函数，包装原生的随机值计算函数
  static _wrap(callback) {
    return function paramWrapper() {
      for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
        params[_key] = arguments[_key];
      }

      const that = this;
      return function randomFunction() {
        // 执行概率最大的放第一个
        if (!that.cache) return callback.apply(that, params);
        // 根据传入的参数计算哈希值
        const hashKey = Random._hash(params);
        // 获取缓存中的数据，如果没有就运行callback来产生
        let value;
        if (that.cacheStore.exist(hashKey)) {
          value = that.cacheStore.get(hashKey);
        } else {
          value = callback.apply(that, params);
          that.cacheStore.set(hashKey, value);
        }
        return value;
      };
    };
  }
  // 导入新的随机函数，callback的返回值必须为一个函数，该函数执行后才能获得最终的随机数
  static add(name, callback) {
    if (!registedFunctions[name]) {
      registedFunctions[name] = Random._wrap(callback);
      Object.defineProperty(Random.prototype, name, {
        get() {
          return registedFunctions[name].bind(this);
        },
        enumerable: true
      });
    } else {
      u.error('Random#add', `${ name }已被使用，注册失败`);
    }
  }
  // 懒加载模块，可以提高初始化速度
  static lazyload(pathname, name) {
    if (registedFunctions[name]) u.error('Random#add', `${ name }已被使用，注册失败`);
    Object.defineProperty(Random.prototype, name, {
      get() {
        // 已导入的话就直接返回
        if (registedFunctions[name]) return registedFunctions[name].bind(this);
        const callback = require(pathname)[name];
        registedFunctions[name] = Random._wrap(callback);
        return registedFunctions[name].bind(this);
      },
      enumerable: true
    });
  }
  // 给一个方法起别名
  static alias(newName, oldName) {
    if (!Random.prototype[newName]) {
      Random.prototype[newName] = Random.prototype[oldName];
    } else {
      u.error('Random#alias', `${ newName }已被使用，注册失败`);
    }
  }
  // 获取Random实例，用于手动获取随机数
  instance(options) {
    return new Random(options);
  }
  // 从数组中选择一个值
  pickone(arr) {
    return this.chance.pickone(arr);
  }
  pickset(arr, count) {
    return this.chance.pickset(arr, count);
  }
}

// 从chanceJS继承的原生类型
// 某些类型因为涉及到多语言支持，所以会放到后面去
[
// Basics
'bool', 'character', 'floating', 'integer', 'natural', 'string',
// Person
'age', 'birthday',
// Mobile
'android_id', 'apple_token',
// Web
'color', 'domain', 'email', 'ip', 'ipv6', 'url',
// Location
'altitude', 'latitude', 'longitude',
// Time
'date', 'hammertime', 'hour', 'millisecond', 'minute', 'second', 'timestamp', 'year',
// Miscellaneous
'uuid', 'hash', 'normal'].forEach(i => {
  Random.add(i, function chanceFunctions(params) {
    return this.chance[i](params);
  });
});

// 支持Randexp
Random.add('randexp', function randexpFunction() {
  for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    params[_key2] = arguments[_key2];
  }

  return randexp.apply(this, params);
});

// 添加内部函数库，采用懒加载方式
fs.readdirSync(path.resolve(__dirname, './functions')).forEach(v => {
  const name = v.match(/(\w+)\.js/)[1];
  Random.lazyload(`./functions/${ v }`, name);
});
// u.each(mainFunc, (v, k) => Random.add(k, v));
exports.default = Random;