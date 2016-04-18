'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const u = require('./util');
const dataTrain = {};
const callbacks = {};
const dynamicKeyStore = {};
function pathPrefix(item) {
  return `__${ item }`;
}
function _doRawRegist(fullName, descriptor) {
  // 如果传入了一个对象，那么就按照标准形式设置
  // 否则，就认为用户只传进了设置项的初始值
  if (u.isPlainObject(descriptor)) {
    dataTrain[fullName] = descriptor.default;
    // 初始化回调对象
    callbacks[fullName] = {
      onSet: descriptor.onSet,
      validators: descriptor.validators,
      onGet: descriptor.onGet
    };
  } else {
    dataTrain[fullName] = descriptor;
    callbacks[fullName] = { onSet: null, validators: [], onGet: null };
  }
}
function regist(namespace, descriptor) {
  // 检测命名空间合法性
  if (!namespace.match(/^[A-Za-z0-9\.]+$/) && namespace !== '/') {
    u.error(`设置项命名空间名称不能为${ namespace }，它只能由字母、数字和.组成`);
  }
  const prefix = namespace === '/' ? '' : `${ namespace }/`;
  u.each(descriptor, (item, key) => {
    // 检测key合法性
    if (!key.match(/^[A-Za-z0-9\.\-]+$/)) u.error(`设置项名称不能为${ key }，它只能由字母、数字和.组成`);

    const fullName = prefix + key;
    // 检测该命名空间下的key是否被注册过，若已注册过，则拒绝注册
    if (callbacks[fullName]) {
      u.error(`不能注册一个已注册的设置项${ fullName }`);
    }
    _doRawRegist(fullName, item);
  });
}
// 注册动态key，主要用于一个命名空间下有大量同类型Key且作用方式类似的情况
function registDynamic(namespace, keyRule, descriptor, onRegist) {
  if (namespace === '/') u.error('不能在根域上注册动态属性');
  if (namespace.match(/^[A-Za-z0-9\.]+$/)) {
    if (u.isArray(keyRule) || u.isRegExp(keyRule)) {
      if (!dynamicKeyStore[namespace]) {
        dynamicKeyStore[namespace] = [];
      }
      dynamicKeyStore[namespace].push({ rule: keyRule, descriptor, onRegist });
    } else {
      u.error(`${ keyRule }不是一个正则表达式或者数组,不能作为动态属性的键名规则。`);
    }
  } else {
    u.error('注册动态属性时，命名空间只能由字母、数字和.组成');
  }
}
// 没有注册过的key应该再检查是否存在对应的动态键
// 首先要检查这个key是不是符合namespace/key形式，由于根作用域不能注册动态键，所以这样检查就足够了
function registByDynamic(nsAndKey) {
  const matchResult = nsAndKey.match(/([\w\.]+)\/([\w\.\-]+)/);
  if (matchResult) {
    const namespace = matchResult[1];
    const key = matchResult[2];
    if (dynamicKeyStore[namespace]) {
      // 从动态键库中查找一个符合规则的key
      const result = u.find(dynamicKeyStore[namespace], e => {
        if (u.isRegExp(e.rule)) return key.toString().match(e.rule);
        return e.rule.indexOf(key) >= 0;
      });

      if (result) {
        // 如果存在回调，且回调的结果为false，则取消注册
        if (result.onRegist && result.onRegist(key) === false) return false;
        // 注册流程
        _doRawRegist(nsAndKey, result.descriptor);
        return true;
      }
    }
  }

  return false;
}

// 设置一个单独键
function setOne(scope, key, value) {
  // 检测key是否已经注册过
  if (!callbacks[key]) {
    // 没注册过的key尝试寻找对应的动态key规则，如果注册成功，就继续执行
    if (!registByDynamic(key, value)) {
      u.warn(`向${ scope }下的${ key }赋值失败，原因是${ key }未被注册`);
      return;
    }
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
}

// 验证器
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
    // namespace/ 形式的调用将被认为是批量赋值操作
    if (key.match(/^[\w\.]+\/$/)) {
      u.each(value, (v, k) => setOne(scope, key + k, v));
    } else {
      setOne(scope, key, value);
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
  regist,
  registDynamic
};