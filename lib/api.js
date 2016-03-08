'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

var _router = require('./core/router');

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function get(path) {
  for (var _len = arguments.length, other = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    other[_key - 1] = arguments[_key];
  }

  _router2.default.regist('get', path, other);
} // import * as u from './util';