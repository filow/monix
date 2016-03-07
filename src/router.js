import * as u from './util';
class Router {
  constructor() {
    this.stack = {};
  }
  regist(method, path, options) {
    if (u.isString(method)) {
      // 判断路径参数是否正确
      if (u.isString(path) || u.isRegExp(path) || u.isFunction(path)) {
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

        // 如果这个方法的数组还未生成，那么就生成
        const methodUppercase = method.toUpperCase();
        if (!this.stack[methodUppercase]) this.stack[methodUppercase] = [];
        this.stack[methodUppercase].push({
          path,
          handler,
          options: opt,
        });
        u.debug('[Router.regist]', `[${methodUppercase}]`, path);
      } else {
        u.error('路由应当为字符串、正则表达式或函数，不能为', path);
      }
    } else {
      u.error('method应当为一个字符串，不能为', method);
    }
    u.debug(this.stack);
  }
}


// 只允许一个Router实例存在
export default new Router();
