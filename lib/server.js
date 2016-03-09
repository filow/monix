'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _util = require('./util');

var u = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Server {
  constructor() {
    this.koa = new _koa2.default();
  }
  use(middleware) {
    this.koa.use(middleware);
  }
  run() {
    let port = arguments.length <= 0 || arguments[0] === undefined ? 3000 : arguments[0];

    let instance;
    if (u.isTest()) {
      instance = this.koa.listen();
    } else {
      instance = this.koa.listen(port);
    }
    return instance;
  }
}
exports.default = new Server();