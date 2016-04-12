const u = require('../util');
function recursiveEvaluate(obj) {
  if (u.isFunction(obj)) {
    return obj();
  } else if (u.isArray(obj)) {
    return u.map(obj, e => recursiveEvaluate(e));
  } else if (u.isPlainObject(obj)) {
    return u.mapValues(obj, e => recursiveEvaluate(e));
  }
  return obj;
}
class Response {
  constructor() {
    this.status = 200;
    this.header = {
      'Content-Type': 'application/json',
    };
    this.message = '';
  }
  ok(msg) {
    this.status = 200;
    this.message = msg;
  }
  notFound() {
    this.status = 404;
    this.message = {
      error: 404,
      msg: 'Page Not Found',
    };
  }
  _render() {
    const msg = recursiveEvaluate(this.message);
    this.message = JSON.stringify(msg);
  }
}

class ResponseHandler {
  middleware() {
    return async function response(ctx, next) {
      const that = new Response();
      ctx.Response = that;
      await next();
      that._render();
      ctx.status = that.status;
      ctx.body = that.message;
      ctx.set(that.header);
    };
  }
}
export default new ResponseHandler();
