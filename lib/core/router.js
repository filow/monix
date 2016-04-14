'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _random = require('../random');

var _random2 = _interopRequireDefault(_random);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const u = require('../util');
const url = require('url');

function generateRouteName(method, path) {
  const pathUnderscore = path.toString().replace(/[^\w]+/g, '_');
  // 可能会因为path第一个字符是非字母字符而导致出现连续的两个_
  return `${ method.toLowerCase() }_${ pathUnderscore }`.replace(/[_]+/g, '_');
}
class Router {
  constructor() {
    this.stack = {};
    _config2.default.regist('/', {
      name: {
        default: 'global'
      }
    });
  }
  _addRouteToStack(name, method, path, handler) {
    const keys = [];
    // 将字符串形式的path修改为regexp
    const regexp = (0, _pathToRegexp2.default)(path, keys);
    // 如果这个方法的数组还未生成，那么就生成
    const methodUppercase = method.toUpperCase();
    if (!this.stack[methodUppercase]) this.stack[methodUppercase] = [];
    this.stack[methodUppercase].push({
      name,
      regexp,
      keys,
      handler
    });
    u.debug('Router#regist', `[${ methodUppercase }]`, path, '\tname:', name);
  }
  // 注册一个路由
  regist(method, path, options) {
    if (!u.isString(method)) u.error('method应当为一个字符串，不能为', method);
    // 判断路径参数是否正确
    if (!u.isString(path) && !u.isRegExp(path)) u.error('路由应当为字符串或正则表达式，不能为', path);

    let handler;
    let name = generateRouteName(method, path);
    let opt = {};
    // 判断参数的类型，确定回调函数和参数的位置
    if (u.isObject(options[0]) && !u.isFunction(options[0])) {
      // (path, option, callback)
      if (u.isFunction(options[1])) {
        opt = options[0];
        handler = options[1];
        if (opt.name) {
          name = opt.name;
        }
        const scope = _config2.default.scope(name);
        u.each(opt, (v, k) => {
          scope.set(k, v);
        });
        scope.set('name', name);
      } else {
        // (path, data)
        // 将直接返回数据包装成函数，保证数据类型一致
        handler = res => res.ok(options[0]);
      }
      // (path, callback)
    } else if (u.isFunction(options[0])) {
        handler = options[0];
      } else {
        u.error('非法的路由函数调用。仅支持(path, option, callback), (path, callback)和(path, data)');
      }
    this._addRouteToStack(name, method, path, handler);
  }
  middleware() {
    const stack = this.stack;
    return function () {
      var ref = _asyncToGenerator(function* (ctx, next) {
        const parsedUrl = url.parse(ctx.url);
        const action = u.find(stack[ctx.method], function (item) {
          return item.regexp.exec(parsedUrl.pathname);
        });
        if (action && action.handler) {
          const random = new _random2.default();
          action.handler.call({
            res: ctx.Response,
            rnd: random,
            config: _config2.default.scope(`${ action.name }`)
          }, ctx.Response, random);
        } else {
          // 路由未找到的处理
          ctx.Response.notFound();
        }
        yield next();
      });

      return function router(_x, _x2) {
        return ref.apply(this, arguments);
      };
    }();
  }
}

// 只允许一个Router实例存在
exports.default = new Router();