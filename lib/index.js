'use strict';

var _router = require('./core/router');

var _router2 = _interopRequireDefault(_router);

var _random = require('./random');

var _random2 = _interopRequireDefault(_random);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _response = require('./core/response');

var _response2 = _interopRequireDefault(_response);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// System-Level API
const core = { Server: _server2.default, Router: _router2.default, Config: _config2.default, Random: _random2.default };

// 消息响应中间件
// import * as u from './util';
_server2.default.use(_response2.default.middleware());
// 核心路由组件
_server2.default.use(_router2.default.middleware());

module.exports = {
  R: new _random2.default(),
  set: _config2.default.scope('/').set,
  get: function get(path) {
    for (var _len = arguments.length, other = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      other[_key - 1] = arguments[_key];
    }

    _router2.default.regist('get', path, other);
  },
  core
};