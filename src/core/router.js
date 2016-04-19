const u = require('../util');
const url = require('url');
import pathToRegexp from 'path-to-regexp';
export default class Router {
  static _onload(exports, api) {
    const router = new Router(exports);
    ['get', 'post', 'put', 'patch', 'delete'].forEach(verb => {
      api[verb] = (path, ...other) => {
        router.regist(verb, path, other);
      };
    });
    api.middleware(router.middleware());
    return router;
  }
  constructor({ Config, Random }) {
    this.stack = [];
    this.Config = Config;
    this.Random = Random;
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
      u.map(this.stack, e => e.name),
      n => n.startsWith(baseName)
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
    this.stack.push({
      name,
      method: methodUppercase,
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
    // 根据传入参数的数量判断是那种调用形式
    // (path, option, data/fn)
    if (options.length >= 2) {
      opt = options[0];
      handler = options[1];
      if (!u.isPlainObject(opt)) {
        u.error('非法的路由函数调用，当以(path, options, data/fn形式调用时，第二个参数必须是一个简单对象)');
      }
      // 如果传入了name参数，以传入的为准
      if (opt.name) {
        // 不允许同名的存在
        if (this.stack.find((e) => e.name === opt.name)) {
          u.error('以设置项命名路由时发生错误：该路由名称已存在');
        }
        name = opt.name;
      }
      // 复制参数列表到路由命名空间下
      const scope = this.Config.scope(name);
      u.each(opt, (v, k) => {
        scope.set(k, v);
      });
      scope.set('name', name);
    } else {
      // (path, data/fn)
      handler = options[0];
    }
    this._addRouteToStack(name, method, path, handler);
  }
  middleware() {
    const stack = this.stack;
    const Random = this.Random;
    const Config = this.Config;
    return async function router(ctx, next) {
      const parsedUrl = url.parse(ctx.url);
      const action = stack.find(
        (item) => item.regexp.exec(parsedUrl.pathname) && item.method === ctx.method
      );

      if (action && action.handler) {
        ctx.configScope = action.name;
        const random = new Random();
        if (u.isFunction(action.handler)) {
          const retVal = action.handler.call({
            res: ctx.Response,
            rnd: random,
            config: Config.scope(`${action.name}`),
          }, ctx.Response, random);
          // 如果用户没有在函数体内部调用res.ok/send方法，就以函数返回值作为结果
          if (!ctx.Response.hasResponse()) {
            ctx.Response.ok(retVal);
          }
        } else {
          ctx.Response.ok(action.handler);
        }
      } else {
        ctx.configScope = 'not_found_scope';
        // 路由未找到的处理
        ctx.Response.send(404);
      }
      await next();
    };
  }
}
