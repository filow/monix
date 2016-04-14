'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const u = require('./util');
const dataTrain = {};
const callbacks = {};
function pathPrefix(item) {
  return `__${ item }`;
}
class Validator {
  static type(req) {
    return value => typeof value === req;
  }
  static objectType(req) {
    return value => {
      const objectType = Object.prototype.toString.call(value);
      const type = objectType.match(/\[\w+ (\w+)\]/)[1].toLowerCase();
      return type === req;
    };
  }
  static regexp(req) {
    return value => value.toString().match(req);
  }
  static inArray(req) {
    return value => req.indexOf(value) >= 0;
  }
}
exports.default = {
  v: Validator,
  get(scope, key) {
    const path = scope.split('/');
    let cwd = dataTrain;
    let value = cwd[key];
    // 检查根域是否有这个值，如果根域都没有那么就证明这个key根本不存在
    if (!callbacks[key]) return value;
    for (let i = 0; i < path.length; i++) {
      const trimedItem = path[i].trim();
      if (trimedItem.length !== 0) {
        const prefixedItem = pathPrefix(trimedItem);
        if (cwd[prefixedItem]) {
          cwd = cwd[prefixedItem];
          if (cwd[key]) {
            value = cwd[key];
          }
        } else {
          break;
        }
      }
    }
    // 如果存在设置了onGet回调，就将该回调的返回值作为最终值
    if (callbacks[key].onGet) {
      return callbacks[key].onGet(value);
    }
    return value;
  },
  set(scope, key, value) {
    // 检测key是否已经注册过
    if (!callbacks[key]) {
      u.warn(`向${ scope }下的${ key }赋值失败，原因是${ key }未被注册`);
      return;
    }
    const path = scope.split('/');
    // 一层层进入指定scope目录
    let cwd = dataTrain;
    for (let i = 0; i < path.length; i++) {
      const trimedItem = path[i].trim();
      if (trimedItem.length !== 0) {
        const prefixedItem = pathPrefix(trimedItem);
        if (!cwd[prefixedItem]) {
          cwd[prefixedItem] = {};
        }
        cwd = cwd[prefixedItem];
      }
    }
    // 下面开始运行验证器
    const func = callbacks[key].validators || [];
    // 识别是否在某个回调函数中断了
    let i;
    for (i = 0; i < func.length; i++) {
      if (!func[i](value, cwd[key], scope)) break;
    }
    if (i < func.length) {
      u.warn(`向${ key }赋值失败，原因是没有通过数据验证器：${ func[i].toString() }`);
    } else {
      let finalVal = value;
      if (callbacks[key].onSet && u.isFunction(callbacks[key].onSet)) {
        finalVal = callbacks[key].onSet(value, cwd[key], scope);
      }
      if (typeof finalVal !== 'undefined') cwd[key] = finalVal;
    }
  },
  scope() {
    let scope = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

    const scopeGet = key => this.get(scope, key);
    const scopeSet = (key, value) => this.set(scope, key, value);
    return {
      scope,
      get: scopeGet,
      set: scopeSet
    };
  },
  regist(namespace, descriptor) {
    const prefix = namespace === '/' ? '' : `${ namespace }/`;
    u.each(descriptor, (item, key) => {
      const fullName = prefix + key;
      dataTrain[fullName] = item.default;
      // 初始化回调对象
      callbacks[fullName] = {
        onSet: item.onSet,
        validators: item.validators,
        onGet: item.onGet
      };
    });
  }
};