'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const u = require('../util');

const registedHeader = [];
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
_config2.default.regist('response', {
  // 强制使用某一种返回类型
  forceStatus: {
    default: null,
    validators: [_config2.default.v.type('number')]
  }
});
_config2.default.registDynamic('response', /[12345]\d{2}/, {
  default: {
    msg: '请设置默认响应内容'
  }
});
// 支持定义作用域内的header属性，将随请求发送
_config2.default.registDynamic('header', /[A-Za-z0-9\-]+/, {
  default: '',
  validators: [_config2.default.v.type('string')]
}, key => {
  registedHeader.push(key);
  return true;
});
class Response {
  constructor() {
    this.defaults = {
      header: {
        'Content-Type': 'application/json'
      },
      status: 204 };
    // no content
    this.responses = [];
  }
  send(code, msg) {
    let options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

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
    const forceStatus = _config2.default.get(scope, 'response/forceStatus');
    if (forceStatus) {
      responses = u.filter(responses, e => e.status === forceStatus);
    }
    // 如果响应体列表存在符合要求的status，则使用，否则将置为该status下的默认返回值
    if (responses.length > 0) {
      resp = responses[responses.length - 1];
    } else if (forceStatus) {
      resp = { status: forceStatus, msg: `请通过set('response/${ forceStatus }')来定义该状态码下的默认内容` };
    }
    resp = u.defaultsDeep(resp, this.defaults);
    // 处理返回的内容
    if (resp.msg || typeof resp.msg === 'boolean') {
      resp.msg = recursiveEvaluate(resp.msg);
    } else {
      resp.msg = _config2.default.get(scope, `response/${ resp.status }`);
    }
    resp.msg = JSON.stringify(resp.msg);

    // 接下来处理HTTP header
    const headersInConfig = {};
    u.each(registedHeader, e => {
      const value = _config2.default.get(scope, `header/${ e }`);
      if (value !== '') headersInConfig[e] = value;
    });
    const finalHeader = u.merge(headersInConfig, resp.header);

    resp.header = finalHeader;
    return resp;
  }
}

class ResponseHandler {
  middleware() {
    return function () {
      var ref = _asyncToGenerator(function* (ctx, next) {
        const that = new Response();
        ctx.Response = that;
        yield next();
        const resp = that._render(ctx.configScope);
        ctx.status = resp.status;
        ctx.body = resp.msg;
        if (resp.header) {
          u.each(resp.header, function (v, k) {
            return ctx.set(k, v);
          });
        }
      });

      return function response(_x2, _x3) {
        return ref.apply(this, arguments);
      };
    }();
  }
}
exports.default = new ResponseHandler();