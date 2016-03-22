'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const u = require('../util');
class Response {
  constructor() {
    this.status = 200;
    this.header = {};
    this.message = '';
  }
  ok(msg) {
    u.debug(msg);
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
      msg: 'Page Not Found'
    });
  }
}

class ResponseHandler {
  middleware() {
    return function () {
      var ref = _asyncToGenerator(function* (ctx, next) {
        const that = new Response();
        ctx.Response = that;
        yield next();
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