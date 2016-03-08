'use strict';

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _vm = require('vm');

var vm = _interopRequireWildcard(_vm);

var _api = require('./api');

var api = _interopRequireWildcard(_api);

var _router = require('./core/router');

var _router2 = _interopRequireDefault(_router);

var _response = require('./core/response');

var _response2 = _interopRequireDefault(_response);

var _util = require('./util');

var u = _interopRequireWildcard(_util);

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const app = new _koa2.default();
// 消息响应中间件
// import { EventEmitter } from 'events';
app.use(_response2.default.middleware());
// 核心路由组件
app.use(_router2.default.middleware());
// 暴露API
u.mixin(global, api);
// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync('test.js'));
app.listen(3000);
u.info('服务器已启动，访问地址：http://localhost:3000.');