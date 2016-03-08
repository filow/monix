'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.find = exports.isObject = exports.mixin = exports.isFunction = exports.isRegExp = exports.isString = undefined;

var _lodash = require('lodash');

Object.defineProperty(exports, 'isString', {
  enumerable: true,
  get: function get() {
    return _lodash.isString;
  }
});
Object.defineProperty(exports, 'isRegExp', {
  enumerable: true,
  get: function get() {
    return _lodash.isRegExp;
  }
});
Object.defineProperty(exports, 'isFunction', {
  enumerable: true,
  get: function get() {
    return _lodash.isFunction;
  }
});
Object.defineProperty(exports, 'mixin', {
  enumerable: true,
  get: function get() {
    return _lodash.mixin;
  }
});
Object.defineProperty(exports, 'isObject', {
  enumerable: true,
  get: function get() {
    return _lodash.isObject;
  }
});
Object.defineProperty(exports, 'find', {
  enumerable: true,
  get: function get() {
    return _lodash.find;
  }
});
exports.debug = debug;
exports.info = info;
exports.warn = warn;
exports.error = error;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

const levelColor = {
  debug: _chalk2.default.gray,
  info: _chalk2.default.cyan,
  warn: _chalk2.default.yellow,
  error: _chalk2.default.red.bold
};
function getTime() {
  const now = new Date();
  return `${ now.getHours() }:${ now.getMinutes() }:${ now.getSeconds() }`;
}

function logger(func, level, msg) {
  func.apply(console, [levelColor.debug(getTime()), levelColor[level](`[${ level.toUpperCase() }]`)].concat(_toConsumableArray(msg)));
}
// 显示内部运行时信息
function debug() {
  for (var _len = arguments.length, msg = Array(_len), _key = 0; _key < _len; _key++) {
    msg[_key] = arguments[_key];
  }

  logger(console.log, 'debug', msg);
}
// 显示一般的可以给用户看的信息
function info() {
  for (var _len2 = arguments.length, msg = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    msg[_key2] = arguments[_key2];
  }

  logger(console.info, 'info', msg);
}
// 警告
function warn() {
  for (var _len3 = arguments.length, msg = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    msg[_key3] = arguments[_key3];
  }

  logger(console.warn, 'warn', msg);
}
// 错误
function error() {
  for (var _len4 = arguments.length, msg = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    msg[_key4] = arguments[_key4];
  }

  throw new Error(levelColor.error(msg));
}