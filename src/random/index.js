import crypto from 'crypto';
import Chance from 'chance';
import Cache from './cache.js';
const randexp = require('randexp').randexp;
const u = require('../util');
const fs = require('fs');
const path = require('path');

const registedFunctions = {};
class Random {
  static _onload(exports, api) {
    api.Random = Random;
    return Random;
  }
  constructor(options = {}) {
    const { cache = false, seed, cacheStore } = options;
    this.cache = cache;
    this.seed = seed || (Math.random()).toString(16).split('.')[1];
    this.cacheStore = cacheStore || new Cache(this.seed);
    this.chance = new Chance(this.seed);
  }
  // 私有函数，获取一个对象JSON序列化后的哈希值
  static _hash(obj) {
    if (obj) {
      const hash = crypto.createHash('md5');
      hash.update(JSON.stringify(obj).toString());
      return hash.digest('hex');
    }
    return typeof obj;
  }
  // 私有函数，包装原生的随机值计算函数
  static _wrap(callback) {
    return function paramWrapper(...params) {
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
        enumerable: true,
      });
    } else {
      u.error('Random#add', `${name}已被使用，注册失败`);
    }
  }
  // 懒加载模块，可以提高初始化速度
  static lazyload(pathname, name) {
    if (Random.prototype.hasOwnProperty(name)) u.error('Random#add', `${name}已被使用，注册失败`);
    Object.defineProperty(Random.prototype, name, {
      get() {
        // 已导入的话就直接返回
        if (registedFunctions[name]) return registedFunctions[name].bind(this);
        const callback = require(pathname)[name];
        registedFunctions[name] = Random._wrap(callback);
        return registedFunctions[name].bind(this);
      },
      enumerable: true,
    });
  }
  // 给一个方法起别名
  static alias(newName, oldName) {
    if (!Random.prototype[newName]) {
      Random.prototype[newName] = Random.prototype[oldName];
    } else {
      u.error('Random#alias', `${newName}已被使用，注册失败`);
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
  shuffle(arr) {
    return this.chance.shuffle(arr);
  }
  n(item, times) {
    const result = [];
    for (let i = 0; i < times; i++) {
      result.push(item);
    }
    return result;
  }
  unique(arr) {
    return u.uniq(u.map(arr, e => typeof e === 'function' ? e() : e)); // eslint-disable-line
  }
  uniqueN(item, times) {
    if (u.isFunction(item)) {
      const result = [];
      while (result.length < times) {
        const val = item();
        if (!result.find(e => e === val)) {
          result.push(val);
        }
      }
      return result;
    }
    return this.n(item, times);
  }
  // 添加前置0
  pad(number, width, fillchar = '0') {
    return this.chance.pad(number, width, fillchar);
  }
  // 连接多个函数的输出结果
  concat(...items) {
    return function concatCallback(delimiter = '') {
      return items.map(v => {
        // 执行函数对象
        if (u.isFunction(v)) return v().toString();
        return v.toString();
      }).join(delimiter);
    };
  }
}

// 从chanceJS继承的原生类型
// 某些类型因为涉及到多语言支持，所以会放到后面去
[
  // Basics
  'bool', 'character', 'floating', 'integer', 'natural', 'string',
  // Text
  'paragraph', 'sentence', 'word',
  // Person
  'age', 'birthday', 'gender',
  // Mobile
  'android_id', 'apple_token',
  // Web
  'color', 'domain', 'email', 'ip', 'ipv6', 'url',
  // Location
  'altitude', 'latitude', 'longitude',
  // Miscellaneous
  'uuid', 'hash', 'normal',
].forEach(i => {
  Random.add(i, function chanceFunctions(params) {
    return this.chance[i](params);
  });
});

// 支持Randexp
Random.add('randexp', function randexpFunction(...params) {
  return randexp.apply(this, params);
});

// 添加内部函数库，采用懒加载方式
fs.readdirSync(path.resolve(__dirname, './functions')).forEach((v) => {
  const name = v.match(/(\w+)\.js/)[1];
  Random.lazyload(`./functions/${v}`, name);
});
// u.each(mainFunc, (v, k) => Random.add(k, v));
export default Random;
