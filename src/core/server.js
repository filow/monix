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
      },
      port: {
        default: 3456,
      },
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
    u.info(`服务器已启动，访问地址: ${protocol}://${host}:${port}`);
    return instance;
  }
  get _koa() {
    return this.koa;
  }
}
