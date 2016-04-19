const u = require('../util');
const registedHeader = [];
const formatter = {
  json(resp) {
    resp.msg = JSON.stringify(resp.msg);
    resp.header['Content-Type'] = 'application/json';
  },
  plain(resp) {
    resp.msg = resp.msg.toString();
    resp.header['Content-Type'] = 'text/plain';
  },
  html(resp) {
    resp.msg = resp.msg.toString();
    resp.header['Content-Type'] = 'text/html';
  },
};

export default class Response {
  static _onload(exports, api) {
    const { Config } = exports;
    api.middleware(async (ctx, next) => {
      const that = new Response(Config);
      ctx.Response = that;
      await next();
      const resp = that._render(ctx.configScope);
      ctx.status = resp.status;
      ctx.body = resp.msg;
      if (resp.header) {
        u.each(resp.header, (v, k) => ctx.set(k, v));
      }
    });
    // 注册设置项
    Config.regist('response', {
      // 强制使用某一种返回类型
      forceStatus: {
        default: null,
        validators: [Config.v.type('number')],
      },
      format: {
        default: 'json',
        validators: [Config.v.inArray(['json', 'plain', 'html'])],
      },
    });
    Config.registDynamic('response', /[12345]\d{2}/, {
      default: '',
    });
    // 支持定义作用域内的header属性，将随请求发送
    Config.registDynamic('header', /[A-Za-z0-9\-]+/, {
      default: '',
      validators: [Config.v.type('string')],
    }, (key) => {
      registedHeader.push(key);
      return true;
    });
  }
  constructor(Config) {
    this.defaults = {
      header: {},
      status: 204, // no content
    };
    this.responses = [];
    this.Config = Config;
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
  _recursiveEvaluate(obj) {
    if (u.isFunction(obj)) {
      return obj();
    } else if (u.isArray(obj)) {
      return u.map(obj, e => this._recursiveEvaluate(e));
    } else if (u.isPlainObject(obj)) {
      return u.mapValues(obj, e => this._recursiveEvaluate(e));
    }
    return obj;
  }
  _render(scope) {
    let resp = {};
    let responses = this.responses;
    // 强制状态下，只筛选该状态的内容
    const forceStatus = this.Config.get(scope, 'response/forceStatus');
    if (forceStatus) {
      responses = u.filter(responses, e => e.status === forceStatus);
    }
    // 如果响应体列表存在符合要求的status，则使用，否则将置为该status下的默认返回值
    if (responses.length > 0) {
      resp = responses[responses.length - 1];
    } else if (forceStatus) {
      resp = { status: forceStatus };
    }
    resp = u.defaultsDeep(resp, this.defaults);
    // 处理返回的内容
    if (resp.msg || typeof resp.msg === 'boolean') {
      resp.msg = this._recursiveEvaluate(resp.msg);
    } else {
      resp.msg = this.Config.get(scope, `response/${resp.status}`) ||
        `请通过set('response/${resp.status}')来定义该状态码下的默认内容`;
    }
    const format = this.Config.get(scope, 'response/format');
    // 将对象按照指定格式输出
    formatter[format](resp);
    // 接下来处理HTTP header
    const headersInConfig = {};
    u.each(registedHeader, e => {
      const value = this.Config.get(scope, `header/${e}`);
      if (value !== '') headersInConfig[e] = value;
    });
    const finalHeader = u.merge(headersInConfig, resp.header);

    resp.header = finalHeader;
    return resp;
  }
}
