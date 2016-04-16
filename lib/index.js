'use strict';

var _api = require('./api');

var _router = require('./core/router');

var _router2 = _interopRequireDefault(_router);

var _response = require('./core/response');

var _response2 = _interopRequireDefault(_response);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 消息响应中间件
_server2.default.use(_response2.default.middleware());
// 核心路由组件
_server2.default.use(_router2.default.middleware());

module.exports = { api: _api.api, core: _api.core };