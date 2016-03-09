'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Server {
  constructor() {
    this.koa = new _koa2.default();
  }
  use(middleware) {
    this.koa.use(middleware);
  }
  run() {
    this.koa.listen(3000);
  }
}
exports.default = new Server();