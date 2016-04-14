'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _util = require('./util');

var u = _interopRequireWildcard(_util);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const supportedProtocol = ['http'];
class Server {
  constructor() {
    this.koa = new _koa2.default();
    _config2.default.regist('/', {
      protocol: {
        default: 'http',
        onSet(newVal) {
          if (supportedProtocol.indexOf(newVal) >= 0) {
            return newVal;
          }
          u.warn(`protocol不能被设置为${ newVal }，可选的取值有：`, supportedProtocol);
          return undefined;
        }
      },
      host: {
        default: 'localhost'
      },
      port: {
        default: 3456
      }
    });
  }
  use(middleware) {
    this.koa.use(middleware);
  }
  run() {
    let instance;
    /* istanbul ignore else */
    if (u.isTest()) {
      instance = this.koa.listen();
    } else {
      const protocol = _config2.default.get('/', 'protocol');
      const port = _config2.default.get('/', 'port');
      const host = _config2.default.get('/', 'host');
      instance = this.koa.listen(port, host);
      u.info(`服务器已启动，访问地址: ${ protocol }://${ host }:${ port }`);
    }
    return instance;
  }
}
exports.default = new Server();