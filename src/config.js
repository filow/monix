const u = require('./util');
const dataTrain = {};
const callbacks = {};
function pathPrefix(item) {
  return `__${item}`;
}
export default {
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
      u.warn(`向${scope}下的${key}赋值失败，原因是${key}未被注册`);
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
    // 下面开始执行回调
    const func = callbacks[key].onSet;
    // 每个回调都有可能改变最后赋予的值
    let filteredValue = value;
    // 识别是否在某个回调函数中断了
    let breaked = false;
    for (let i = 0; i < func.length; i++) {
      filteredValue = func[i](filteredValue, cwd[key], scope);
      if (typeof filteredValue === 'undefined') {
        breaked = true;
        break;
      }
    }
    // 只要所有回调都执行下来了，那就返回最后的值
    if (!breaked) cwd[key] = filteredValue;
  },
  scope(scope = '/') {
    const scopeGet = (key) => this.get(scope, key);
    const scopeSet = (key, value) => this.set(scope, key, value);
    return {
      scope,
      get: scopeGet,
      set: scopeSet,
    };
  },
  regist(namespace, descriptor) {
    const prefix = namespace === '/' ? '' : `${namespace}/`;
    u.each(descriptor, (item, key) => {
      const fullName = prefix + key;
      dataTrain[fullName] = item.default;
      // 初始化回调对象
      callbacks[fullName] = { onSet: [] };
      // 如果设置了回调，那么就往回调数组里添加一条。
      // onSet回调必须是最后一个加入数组的内容，因为validators属性也会影响这个数组，要保证onSet回调是最后一个执行的
      if (item.onSet) {
        callbacks[fullName].onSet.push(item.onSet);
      }
      if (item.onGet) {
        callbacks[fullName].onGet = item.onGet;
      }
    });
  },
};
