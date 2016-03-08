import * as u from '../util';
class Response {
  constructor() {
    this.status = 200;
    this.header = {};
    this.message = '';
  }
  ok(msg) {
    if (u.isString(msg)) {
      this.message = msg;
      this.header['Content-Type'] = 'text/html';
    } else if (u.isObject(msg)) {
      this.message = JSON.stringify(msg);
      this.header['Content-Type'] = 'application/json';
    } else {
      this.message = msg.toString();
      this.header['Content-Type'] = 'text/plain';
    }
  }
  notFound() {
    this.status = 404;
    this.header['Content-Type'] = 'application/json';
    this.message = JSON.stringify({
      error: 404,
      msg: 'Page Not Found',
    });
  }
}

class ResponseHandler {
  middleware() {
    return async function response(ctx, next) {
      const that = new Response();
      ctx.Response = that;
      await next();
      ctx.status = that.status;
      ctx.body = that.message;
      ctx.set(that.header);
    };
  }
}
export default new ResponseHandler();
