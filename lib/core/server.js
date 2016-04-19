'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _util = require('../util');

var u = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Server {
  static _onload(exports, api) {
    const server = new Server(exports.Config);
    api.middleware = func => {
      server.use(func);
    };
    return server;
  }
  constructor(Config) {
    this.koa = new _koa2.default();
    Config.regist('/', {
      protocol: {
        default: 'http',
        validators: [Config.v.type('string'), Config.v.inArray(['http'])]
      },
      host: {
        default: 'localhost'
      },
      port: {
        default: 3456
      }
    });
    this.Config = Config;
  }
  use(middleware) {
    this.koa.use(middleware);
  }
  run() {
    const protocol = this.Config.get('/', 'protocol');
    const port = this.Config.get('/', 'port');
    const host = this.Config.get('/', 'host');
    const instance = this.koa.listen(port, host);
    u.info(`服务器已启动，访问地址: ${ protocol }://${ host }:${ port }`);
    return instance;
  }
  get _koa() {
    return this.koa;
  }
}
exports.default = Server;