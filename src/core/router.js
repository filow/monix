const u = require('../util');
const url = require('url');
import pathToRegexp from 'path-to-regexp';
import Random from '../random';
import Config from '../config';
class Router {
  constructor() {
    this.stack = {};
    Config.regist('/', {
      name: {
        default: 'global',
      },
    });
  }
  _generateRouteName(method, path) {
    const pathUnderscore = path.toString().replace(/[^\w]+/g, '_');
    // 可能会因为path第一个字符是非字母字符而导致出现连续的两个_
    const baseName = `${method.toLowerCase()}_${pathUnderscore}`.replace(/[_]+/g, '_');
    // 获取stack中所有名字前缀与
    const sameNameRoutes = u.filter(
      // 提取[{name: foo}]里面的name
      u.map(
        // 将 {GET: [], POST: []}形式的stack转换为[{name: foo}, {} ...]形式
        u.flatMap(this.stack, e => e),
        e => e.name
      ),
      n => n.indexOf(baseName) >= 0
    );
    // 没有可能的重名项目就直接返回
    if (sameNameRoutes.length === 0) return baseName;
    let index = 1;
    let lastAttemptName = '';
    do {
      lastAttemptName = baseName + index;
      index++;
    } while (sameNameRoutes.indexOf(lastAttemptName) >= 0);
    return lastAttemptName;
  }
  _addRouteToStack(name, method, path, handler) {
    const keys = [];
    // 将字符串形式的path修改为regexp
    const regexp = pathToRegexp(path, keys);
    // 如果这个方法的数组还未生成，那么就生成
    const methodUppercase = method.toUpperCase();
    if (!this.stack[methodUppercase]) this.stack[methodUppercase] = [];
    this.stack[methodUppercase].push({
      name,
      regexp,
      keys,
      handler,
    });
    u.debug('Router#regist', `[${methodUppercase}]`, path, '\tname:', name);
  }
  // 注册一个路由
  regist(method, path, options) {
    if (!u.isString(method)) u.error('method应当为一个字符串，不能为', method);
    // 判断路径参数是否正确
    if (!u.isString(path) && !u.isRegExp(path)) u.error('路由应当为字符串或正则表达式，不能为', path);

    let handler;
    let name = this._generateRouteName(method, path);
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
        const scope = Config.scope(name);
        u.each(opt, (v, k) => {
          scope.set(k, v);
        });
        scope.set('name', name);
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
    this._addRouteToStack(name, method, path, handler);
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
          config: Config.scope(`${action.name}`),
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
