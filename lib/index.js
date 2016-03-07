'use strict';

var _events = require('events');

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _vm = require('vm');

var vm = _interopRequireWildcard(_vm);

var _api = require('./api');

var api = _interopRequireWildcard(_api);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _util = require('./util');

var u = _interopRequireWildcard(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const monix = new _events.EventEmitter();
monix.Router = _router2.default;

global.monix = monix;
u.mixin(global, api);
// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync('test.js'));
u.debug(monix.Router.stack);