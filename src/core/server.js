import Koa from 'koa';
import * as u from '../util';
export default class Server {
  static _onload(exports, api) {
    const server = new Server(exports.Config);
    api.middleware = func => {
      server.use(func);
    };
    return server;
  }
  constructor(Config) {
    this.koa = new Koa();
    this.scopes = new Set();
    Config.regist('/', {
      protocol: {
        default: 'http',
        validators: [
          Config.v.type('string'),
          Config.v.inArray(['http']),
        ],
      },
      host: {
        default: 'localhost',
        onSet: function onSetHost(newVal, oldVal, scope) {
          this.scopes.add(scope);
          return newVal;
        }.bind(this),
      },
      port: {
        default: 3456,
        onSet: function onSetPort(newVal, oldVal, scope) {
          this.scopes.add(scope);
          return newVal;
        }.bind(this),
      },
    });
    this.Config = Config;
  }
  use(middleware) {
    this.koa.use(middleware);
  }
  run() {
    const addrToListen = this._addrList;
    const protocol = this.Config.get('/', 'protocol');
    let primaryInstance;
    addrToListen.forEach(addr => {
      const instance = this.koa.listen(addr.port, addr.host);
      if (addr.isPrimary) {
        primaryInstance = instance;
        u.info(`[主服务器] 监听: ${protocol}://${addr.host}:${addr.port}`);
      } else {
        u.info('[分支] 监听:', `${protocol}://${addr.host}:${addr.port}`, '范围', addr.routes);
      }
    });
    return primaryInstance;
  }
  get _koa() {
    return this.koa;
  }
  get _addrList() {
    // 确保有根作用域，防止只监听了设置了host or port的route
    this.scopes.add('/');
    const addrToListen = [];
    for (const s of this.scopes) {
      const host = this.Config.get(s, 'host');
      const port = this.Config.get(s, 'port');
      const existed = addrToListen.findIndex(e => e.host === host && e.port === port);
      const isPrimary = s === '/';
      if (existed < 0) {
        addrToListen.push({ host, port, routes: [s], isPrimary });
      } else {
        addrToListen[existed].isPrimary |= isPrimary;
        addrToListen[existed].routes.push(s);
      }
    }
    return addrToListen;
  }
}
