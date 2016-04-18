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
  // 强制使用某一种返回类型
  forceStatus: {
    default: null,
    validators: [Config.v.type('number')],
  },
});
Config.registDynamic('response', /[12345]\d{2}/, {
  default: {
    msg: '请设置默认响应内容',
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
    let resp = {};
    let responses = this.responses;
    // 强制状态下，只筛选该状态的内容
    const forceStatus = Config.get(scope, 'response/forceStatus');
    if (forceStatus) {
      responses = u.filter(responses, e => e.status === forceStatus);
    }
    // 如果响应体列表存在符合要求的status，则使用，否则将置为该status下的默认返回值
    if (responses.length > 0) {
      resp = responses[responses.length - 1];
    } else if (forceStatus) {
      resp = { status: forceStatus, msg: `请通过set('response/${forceStatus}')来定义该状态码下的默认内容` };
    }
    resp = u.defaultsDeep(resp, this.defaults);

    if (resp.msg || typeof resp.msg === 'boolean') {
      resp.msg = recursiveEvaluate(resp.msg);
    } else {
      resp.msg = Config.get(scope, `response/${resp.status}`);
    }
    resp.msg = JSON.stringify(resp.msg);
    return resp;
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
