const u = require('../util');
import Config from '../config';
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
Config.regist('response', {
  404: {
    default: {
      code: 404,
      msg: 'Not Found',
    },
  },
});
class Response {
  constructor() {
    this.defaults = {
      header: {
        'Content-Type': 'application/json',
      },
      status: 204, // no content
    };
    this.responses = [];
  }
  send(code, msg, options = {}) {
    options.status = code;
    if (msg) options.msg = msg;
    this.responses.push(options);
  }
  // 为最常用的200响应而设置的快捷函数
  ok(msg, options) {
    this.send(200, msg, options);
  }
  hasResponse() {
    return this.responses.length > 0;
  }
  _render(scope) {
    let response = {};
    if (this.hasResponse()) {
      response = this.responses[this.responses.length - 1];
    }
    response = u.defaultsDeep(response, this.defaults);
    if (response.msg || typeof response.msg === 'boolean') {
      response.msg = recursiveEvaluate(response.msg);
    } else {
      response.msg = Config.get(scope, `response/${response.status}`);
    }
    response.msg = JSON.stringify(response.msg);
    return response;
  }
}

class ResponseHandler {
  middleware() {
    return async function response(ctx, next) {
      const that = new Response();
      ctx.Response = that;
      await next();
      const resp = that._render(ctx.configScope);
      ctx.status = resp.status;
      ctx.body = resp.msg;
      if (resp.header) {
        u.each(resp.header, (v, k) => ctx.set(k, v));
      }
    };
  }
}
export default new ResponseHandler();
