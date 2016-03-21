'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util');

var _util2 = _interopRequireDefault(_util);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Random {
  constructor() {
    let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var _options$cache = options.cache;
    const cache = _options$cache === undefined ? false : _options$cache;

    this.cache = cache;
  }
  // 私有函数，获取一个对象JSON序列化后的哈希值
  static _hash(obj) {
    const hash = _crypto2.default.createHash('md5');
    hash.update(JSON.stringify(obj));
    return hash.digest('hex');
  }
  // 私有函数，包装原生的随机值计算函数
  static _wrap(callback) {
    const that = this;
    return function paramWrapper(params) {
      return function randomFunction() {
        // 执行概率最大的放第一个
        if (!that.cache) return callback.call(that, params);
        // 根据传入的参数计算哈希值
        const hashKey = Random._hash(params);
        // 获取缓存中的数据，如果没有就运行callback来产生
        let value;
        if (this.cacheStore.exist(hashKey)) {
          value = this.cacheStore.get(hashKey);
        } else {
          value = callback.call(that, params);
          this.cacheStore.set(hashKey, value);
        }
        return value;
      };
    };
  }
  // 导入新的随机函数，callback的返回值必须为一个函数，该函数执行后才能获得最终的随机数
  static add(name, callback) {
    if (!Random.prototype[name]) {
      Random.prototype[name] = Random._wrap(callback);
    } else {
      _util2.default.warn('Random#add', `${ name }已被使用，注册失败`);
    }
  }
  // 给一个方法起别名
  static alias(newName, oldName) {
    if (!Random.prototype[newName]) {
      Random.prototype[newName] = Random.prototype[oldName];
    } else {
      _util2.default.warn('Random#alias', `${ name }已被使用，注册失败`);
    }
  }
  // 获取Random实例，用于手动获取随机数
  static instance(options) {
    return new Random(options);
  }
}

exports.default = Random;