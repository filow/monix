import Koa from 'koa';
class Server {
  constructor() {
    this.koa = new Koa();
  }
  use(middleware) {
    this.koa.use(middleware);
  }
  run() {
    this.koa.listen(3000);
  }
}
export default new Server();
