import Koa from 'koa';
import * as u from './util';
class Server {
  constructor() {
    this.koa = new Koa();
  }
  use(middleware) {
    this.koa.use(middleware);
  }
  run(port = 3000) {
    let instance;
    if (u.isTest()) {
      instance = this.koa.listen();
    } else {
      instance = this.koa.listen(port);
    }
    return instance;
  }
}
export default new Server();
