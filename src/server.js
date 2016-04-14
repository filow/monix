import Koa from 'koa';
import * as u from './util';
import Config from './config';
class Server {
  constructor() {
    this.koa = new Koa();
    Config.regist('/', {
      protocol: {
        default: 'http',
      },
      host: {
        default: 'localhost',
      },
      port: {
        default: 3456,
      },
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
      const protocol = Config.get('/', 'protocol');
      const port = Config.get('/', 'port');
      const host = Config.get('/', 'host');
      instance = this.koa.listen(port, host);
      u.info(`服务器已启动，访问地址: ${protocol}://${host}:${port}`);
    }
    return instance;
  }
}
export default new Server();
