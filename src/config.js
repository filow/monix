const u = require('./util');
const dataTrain = {};
function pathPrefix(item) {
  return `__${item}`;
}
export default {
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
  scope(scope = '/') {
    const that = this;
    return {
      get: function scopeGet(key) {
        return that.get(scope, key);
      },
      set: function scopeSet(key, value) {
        return that.set(scope, key, value);
      },
    };
  },
  regist(namespace, descriptor) {
    const prefix = namespace === '/' ? '' : `${namespace}/`;
    // if (namespace[namespace.length - 1] === '/') {
    //   prefix = namespace.substring(0, namespace.length - 1);
    // }
    u.each(descriptor, (item, key) => {
      const fullName = prefix + key;
      dataTrain[fullName] = item.default;
    });
  },
};
