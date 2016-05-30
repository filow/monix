// references:
// https://github.com/expressjs/cors/blob/master/lib/index.js
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#The_HTTP_response_headers
const u = require('../util');

export default class CorsHandler {
  static _onload(exports, api) {
    u.warn('[测试功能] CORS支持目前还处于测试阶段，请谨慎使用');
    const { Config } = exports;
    const cors = new CorsHandler(exports);
    api.middleware(cors._middleware());
    // 注册设置项
    Config.regist('cors', {
      // 允许的origin，可以为string或者array类型
      origin: '*',
      methods: ['get', 'post', 'put', 'patch', 'delete'],
      headers: [],
      // 是否允许在origin为*时，仍然接受来自请求方的cookie，为了安全起见默认关闭
      credentials: false,
      exposedHeaders: null,
    });
  }
  constructor({ Config }) {
    this.Config = Config;
  }
  isOriginAllowed(origin, allowedOrigin) {
    if (Array.isArray(allowedOrigin)) {
      for (let i = 0; i < allowedOrigin.length; ++i) {
        if (this.isOriginAllowed(origin, allowedOrigin[i])) {
          return true;
        }
      }
      return false;
    } else if (typeof allowedOrigin === 'string') {
      return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
      return allowedOrigin.test(origin);
    }
    return !!allowedOrigin;
  }
  _renderOrigin(scope, requestOrigin) {
    const result = {};
    const origin = scope.get('cors/origin');
    if (origin === '*') {
      result['Access-Control-Allow-Origin'] = '*';
    } else if (typeof origin === 'string') {
      result['Access-Control-Allow-Origin'] = origin;
      result.Vary = 'Origin';
    } else {
      const isAllowed = this.isOriginAllowed(requestOrigin, origin);
      result['Access-Control-Allow-Origin'] = isAllowed ? requestOrigin : false;
      if (isAllowed) {
        result.Vary = 'Origin';
      }
    }
    return result;
  }
  _renderMethods(scope) {
    const result = {};
    let methods = scope.get('cors/methods');
    if (methods.join) {
      methods = methods.join(','); // 如果是一个数组，就变成字符串
    }
    result['Access-Control-Allow-Methods'] = methods;
    return result;
  }
  _renderCredentials(scope) {
    const result = {};
    const credentials = scope.get('cors/credentials');
    if (credentials) {
      result['Access-Control-Allow-Credentials'] = true;
    }
    return result;
  }
  _renderAllowedHeaders(scope, reqHeaders) {
    const result = {};
    let headers = scope.get('cors/headers');
    if (!headers) {
      // 如果没有注明headers，那就反射用户的header
      headers = reqHeaders;
    } else if (headers.join) {
      headers = headers.join(','); // .headers is an array, so turn it into a string
    }
    if (headers && headers.length) {
      result['Access-Control-Allow-Headers'] = headers;
    }
    return headers;
  }
  _renderExposedHeaders(scope) {
    const result = {};
    let headers = scope.get('cors/exposedHeaders');
    if (headers && headers.join) {
      headers = headers.join(','); // .headers is an array, so turn it into a string
    }
    if (headers && headers.length) {
      result['Access-Control-Expose-Headers'] = headers;
    }
    return result;
  }
  _renderMaxAge(scope) {
    const result = [];
    const maxAge = scope.get('cors/maxAge');
    const maxAgeS = maxAge && maxAge.toString();
    if (maxAgeS && maxAgeS.length) {
      result['Access-Control-Max-Age'] = maxAge;
    }
    return result;
  }
  render(ctx) {
    let result = {};
    const scope = this.Config.scope(ctx.configScope);
    const method = ctx.method && ctx.method.toUpperCase && ctx.method.toUpperCase();
    if (method === 'OPTIONS') {
      // preflight
      result = u.merge(result,
        this._renderOrigin(scope, ctx.headers.origin),
        this._renderMethods(scope),
        this._renderCredentials(scope),
        this._renderAllowedHeaders(scope, ctx.headers['access-control-request-headers']),
        this._renderExposedHeaders(scope),
        this._renderMaxAge(scope)
      );
    } else {
      result = u.merge(result,
        this._renderOrigin(scope, ctx.headers.origin),
        this._renderCredentials(scope),
        this._renderExposedHeaders(scope)
      );
    }
    return result;
  }
  _middleware() {
    const that = this;
    return async function cors(ctx, next) {
      if (ctx.method === 'OPTIONS') {
        ctx.Response.send(204, '', {
          header: that.render(ctx),
        });
      } else {
        const headers = that.render(ctx);
        u.each(headers, (v, k) => ctx.set(k, v));
      }
      await next();
    };
  }
}
