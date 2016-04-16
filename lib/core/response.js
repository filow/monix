'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

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
_config2.default.regist('response', {
  404: {
    default: {
      code: 404,
      msg: 'Not Found'
    }
  }
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
    let response = {};
    if (this.hasResponse()) {
      response = this.responses[this.responses.length - 1];
    }
    response = u.defaultsDeep(response, this.defaults);
    if (response.msg || typeof response.msg === 'boolean') {
      response.msg = recursiveEvaluate(response.msg);
    } else {
      response.msg = _config2.default.get(scope, `response/${ response.status }`);
    }
    response.msg = JSON.stringify(response.msg);
    return response;
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