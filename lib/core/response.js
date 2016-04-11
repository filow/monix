'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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
class Response {
  constructor() {
    this.status = 200;
    this.header = {};
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
      msg: 'Page Not Found'
    };
  }
  _render() {
    const msg = recursiveEvaluate(this.message);
    if (u.isString(msg)) {
      this.message = msg;
      this.header['Content-Type'] = 'text/html';
    } else {
      this.message = msg;
      this.header['Content-Type'] = 'application/json';
    }
  }
}

class ResponseHandler {
  middleware() {
    return function () {
      var ref = _asyncToGenerator(function* (ctx, next) {
        const that = new Response();
        ctx.Response = that;
        yield next();
        that._render();
        ctx.status = that.status;
        ctx.body = that.message;
        ctx.set(that.header);
      });

      return function response(_x, _x2) {
        return ref.apply(this, arguments);
      };
    }();
  }
}
exports.default = new ResponseHandler();