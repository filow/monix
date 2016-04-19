'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _validator = require('./_validator');

var _validator2 = _interopRequireDefault(_validator);

var _util = require('../util');

var u = _interopRequireWildcard(_util);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable object-shorthand */
class Config {
  static _onload(exports, api) {
    const configInstance = new Config();
    api.set = configInstance.scope('/').set;
    return configInstance;
  }
  constructor() {
    // 树状的设置数据集合
    this.dataTrain = {};
    // 回调
    this.callbacks = {};
    // 存储动态key规则
    this.dynamicKeyStore = {};
  }
  _pathPrefix(item) {
    return `__${ item }`;
  }
  // 不通过任何检查直接regist一个key
  _doRawRegist(fullName, descriptor) {
    // 如果传入了一个对象，那么就按照标准形式设置
    // 否则，就认为用户只传进了设置项的初始值
    if (u.isPlainObject(descriptor)) {
      this.dataTrain[fullName] = descriptor.default;
      // 初始化回调对象
      this.callbacks[fullName] = {
        onSet: descriptor.onSet,
        validators: descriptor.validators,
        onGet: descriptor.onGet
      };
    } else {
      this.dataTrain[fullName] = descriptor;
      this.callbacks[fullName] = { onSet: null, validators: [], onGet: null };
    }
  }
  // 没有注册过的key应该再检查是否存在对应的动态键
  // 首先要检查这个key是不是符合namespace/key形式，由于根作用域不能注册动态键，所以这样检查就足够了
  _doRegistDynamic(nsAndKey) {
    const matchResult = nsAndKey.match(/([\w\.]+)\/([\w\.\-]+)/);
    if (matchResult) {
      const namespace = matchResult[1];
      const key = matchResult[2];
      if (this.dynamicKeyStore[namespace]) {
        // 从动态键库中查找一个符合规则的key
        const result = this.dynamicKeyStore[namespace].find(e => {
          if (u.isRegExp(e.rule)) return key.toString().match(e.rule);
          return e.rule.indexOf(key) >= 0;
        });

        if (result) {
          // 如果存在回调，且回调的结果为false，则取消注册
          if (result.onRegist && result.onRegist(key) === false) return false;
          // 注册流程
          this._doRawRegist(nsAndKey, result.descriptor);
          return true;
        }
      }
    }

    return false;
  }
  // 设置一个单独键
  _setOne(scope, key, value) {
    // 检测key是否已经注册过
    if (!this.callbacks[key]) {
      // 没注册过的key尝试寻找对应的动态key规则，如果注册成功，就继续执行
      if (!this._doRegistDynamic(key, value)) {
        u.warn(`向${ scope }下的${ key }赋值失败，原因是${ key }未被注册`);
        return;
      }
    }
    const path = scope.split('/');
    // 一层层进入指定scope目录
    let cwd = this.dataTrain;
    for (let i = 0; i < path.length; i++) {
      const trimedItem = path[i].trim();
      if (trimedItem.length !== 0) {
        const prefixedItem = this._pathPrefix(trimedItem);
        if (!cwd[prefixedItem]) {
          cwd[prefixedItem] = {};
        }
        cwd = cwd[prefixedItem];
      }
    }
    // 下面开始运行验证器
    const func = this.callbacks[key].validators || [];
    // 识别是否在某个回调函数中断了
    let i;
    for (i = 0; i < func.length; i++) {
      if (!func[i](value, cwd[key], scope)) break;
    }
    if (i < func.length) {
      u.warn(`向${ key }赋值失败，原因是没有通过数据验证器：${ func[i].toString() }`);
    } else {
      let finalVal = value;
      if (this.callbacks[key].onSet && u.isFunction(this.callbacks[key].onSet)) {
        finalVal = this.callbacks[key].onSet(value, cwd[key], scope);
      }
      if (typeof finalVal !== 'undefined') cwd[key] = finalVal;
    }
  }
  regist(namespace, descriptor) {
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
      if (this.callbacks[fullName]) {
        u.error(`不能注册一个已注册的设置项${ fullName }`);
      }
      this._doRawRegist(fullName, item);
    });
  }
  // 注册动态key，主要用于一个命名空间下有大量同类型Key且作用方式类似的情况
  registDynamic(namespace, keyRule, descriptor, onRegist) {
    if (namespace === '/') u.error('不能在根域上注册动态属性');
    if (namespace.match(/^[A-Za-z0-9\.]+$/)) {
      if (u.isArray(keyRule) || u.isRegExp(keyRule)) {
        if (!this.dynamicKeyStore[namespace]) {
          this.dynamicKeyStore[namespace] = [];
        }
        this.dynamicKeyStore[namespace].push({ rule: keyRule, descriptor, onRegist });
      } else {
        u.error(`${ keyRule }不是一个正则表达式或者数组,不能作为动态属性的键名规则。`);
      }
    } else {
      u.error('注册动态属性时，命名空间只能由字母、数字和.组成');
    }
  }
  set(scope, key, value) {
    // namespace/ 形式的调用将被认为是批量赋值操作
    if (key.match(/^[\w\.]+\/$/)) {
      u.each(value, (v, k) => this._setOne(scope, key + k, v));
    } else {
      this._setOne(scope, key, value);
    }
  }
  get(scope, key) {
    const path = scope.split('/');
    let cwd = this.dataTrain;
    let value = cwd[key];
    // 检查根域是否有这个值，如果根域都没有那么就证明这个key根本不存在
    if (!this.callbacks[key]) return value;
    for (let i = 0; i < path.length; i++) {
      const trimedItem = path[i].trim();
      if (trimedItem.length !== 0) {
        const prefixedItem = this._pathPrefix(trimedItem);
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
    if (this.callbacks[key].onGet) {
      return this.callbacks[key].onGet(value);
    }
    return value;
  }
  scope() {
    let cwd = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];

    const scopeGet = key => this.get(cwd, key);
    const scopeSet = (key, value) => this.set(cwd, key, value);
    return {
      scope: cwd,
      get: scopeGet,
      set: scopeSet
    };
  }
  get v() {
    return _validator2.default;
  }
}
exports.default = Config;