'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const u = require('./util');
const dataTrain = {};
function pathPrefix(item) {
  return `__${ item }`;
}
exports.default = {
  get(scope, key) {
    const path = scope.split('/');
    let cwd = dataTrain;
    let value = cwd[key];
    // 检查根域是否有这个值，如果根域都没有那么就证明这个key根本不存在
    if (!value) return value;
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
    return value;
  },
  set(scope, key, value) {
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
    cwd[key] = value;
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
    // if (namespace[namespace.length - 1] === '/') {
    //   prefix = namespace.substring(0, namespace.length - 1);
    // }
    u.each(descriptor, (item, key) => {
      const fullName = prefix + key;
      dataTrain[fullName] = item.default;
    });
  }
};