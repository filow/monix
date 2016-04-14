'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.core = exports.api = undefined;

var _router = require('./core/router');

var _router2 = _interopRequireDefault(_router);

var _random = require('./random');

var _random2 = _interopRequireDefault(_random);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// User-Level API
const api = {
  R: new _random2.default(),
  set: _config2.default.scope('/').set,
  get: function get(path) {
    for (var _len = arguments.length, other = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      other[_key - 1] = arguments[_key];
    }

    _router2.default.regist('get', path, other);
  }
}; // import * as u from './util';

exports.api = api;

// System-Level API

const core = { Server: _server2.default, Router: _router2.default };
exports.core = core;