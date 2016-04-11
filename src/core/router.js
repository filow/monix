const u = require('../util');
const url = require('url');
import pathToRegexp from 'path-to-regexp';
import Random from '../random';
class Router {
  constructor() {
    this.stack = {};
  }
  _addRouteToStack(method, path, handler, options) {
    const keys = [];
    // 将字符串形式的path修改为regexp
    const regexp = pathToRegexp(path, keys);
    // 如果这个方法的数组还未生成，那么就生成
    const methodUppercase = method.toUpperCase();
    if (!this.stack[methodUppercase]) this.stack[methodUppercase] = [];
    this.stack[methodUppercase].push({
      regexp,
      keys,
      handler,
      options,
    });
    u.debug('Router#regist', `[${methodUppercase}]`, path);
  }
  // 注册一个路由
  regist(method, path, options) {
    if (!u.isString(method)) u.error('method应当为一个字符串，不能为', method);
    // 判断路径参数是否正确
    if (!u.isString(path) && !u.isRegExp(path)) u.error('路由应当为字符串或正则表达式，不能为', path);

    let handler;
    let opt = {};
    // 判断参数的类型，确定回调函数和参数的位置
    if (u.isObject(options[0]) && !u.isFunction(options[0])) {
        // (path, option, callback)
      if (u.isFunction(options[1])) {
        opt = options[0];
        handler = options[1];
      } else {
        // (path, data)
        // 将直接返回数据包装成函数，保证数据类型一致
        handler = (res) => res.ok(options[0]);
      }
      // (path, callback)
    } else if (u.isFunction(options[0])) {
      handler = options[0];
    } else {
      u.error('非法的路由函数调用。仅支持(path, option, callback), (path, callback)和(path, data)');
    }
    this._addRouteToStack(method, path, handler, opt);
  }
  middleware() {
    const stack = this.stack;
    return async function router(ctx, next) {
      const parsedUrl = url.parse(ctx.url);
      const action = u.find(stack[ctx.method],
        (item) => item.regexp.exec(parsedUrl.pathname)
      );
      if (action && action.handler) {
        const random = new Random();
        action.handler.call({
          res: ctx.Response,
          rnd: random,
        }, ctx.Response, random);
      } else {
        // 路由未找到的处理
        ctx.Response.notFound();
      }
      await next();
    };
  }
}


// 只允许一个Router实例存在
export default new Router();
