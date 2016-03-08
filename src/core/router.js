import * as u from '../util';
import * as url from 'url';
import pathToRegexp from 'path-to-regexp';
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
    if (u.isString(method)) {
      // 判断路径参数是否正确
      if (u.isString(path) || u.isRegExp(path)) {
        let handler;
        let opt = {};
        // 判断参数的类型，确定回调函数和参数的位置
        if (u.isFunction(options[0])) {
          handler = options[0];
        } else if (u.isObject(options[0] && u.isFunction(options[1]))) {
          handler = options[0];
          opt = options[1];
        } else {
          u.error('非法的路由函数调用。仅支持method(path, option, callback)与method(path, callback)两种形式');
        }
        this._addRouteToStack(method, path, handler, opt);
      } else {
        u.error('路由应当为字符串或正则表达式，不能为', path);
      }
    } else {
      u.error('method应当为一个字符串，不能为', method);
    }
  }
  middleware() {
    const stack = this.stack;
    return async function router(ctx, next) {
      const parsedUrl = url.parse(ctx.url);
      const action = u.find(stack[ctx.method],
        (item) => item.regexp.exec(parsedUrl.pathname)
      );
      if (action && action.handler) {
        action.handler.call({
          res: ctx.Response,
        }, ctx.Response);
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
