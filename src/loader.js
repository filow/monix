let instance = null;
export default class Loader {
  constructor() {
    // 以模块名作为命名空间的api，主要用于内部或者插件。
    this.innerApi = {};
    // 会暴露在用户环境的API，如set, get, post等
    this.api = {};
    instance = this;
    return this;
  }
  load(name, Module, dependencies = []) {
    // exports会根据dependencies描述的内容将模块依赖的功能提供出来
    const exports = {};
    if (this.innerApi[name]) {
      throw new Error(`${name}模块已经存在，不能重复定义`);
    }
    dependencies.forEach(e => {
      if (!this.innerApi[e]) {
        throw new Error(`${name}模块需要前置依赖${e}，请加载后重试。`);
      }
      exports[e] = this.innerApi[e];
    });
    this.innerApi[name] = {};
    let loader;
    if (Module.default && typeof Module.default._onload === 'function') {
      loader = Module.default._onload;
    } else if (typeof Module._onload === 'function') {
      loader = Module._onload;
    } else if (typeof Module === 'function' && Module.name.match(/loader$/i)) {
      loader = Module;
    } else {
      throw new Error(`无法加载模块${name},一个合法模块应当拥有_onload静态方法或本身是一个以loader作为名称后缀的函数`);
    }
    const retVal = loader(exports, this.api);
    if (retVal) this.innerApi[name] = retVal;
  }
  get userApi() {
    return this.api;
  }
  get coreApi() {
    return this.innerApi;
  }
  static get instance() {
    return instance === null ? new Loader() : instance;
  }
}
