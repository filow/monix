import Loader from './loader.js';
const loader = new Loader();
// 由于后加载的模块可能依赖之前的模块，因此这里需要严格按照顺序书写
// 设置管理模块
loader.load('Config', require('./core/config'));
// 服务器管理模块
loader.load('Server', require('./core/server'), ['Config']);
// 随机内容生成模块
loader.load('Random', require('./random'));
// 响应模块
loader.load('Response', require('./core/response'), ['Config', 'Server']);
// 路由模块
loader.load('Router', require('./core/router'), ['Config', 'Server', 'Response', 'Random']);

const core = loader.coreApi;
const api = loader.userApi;
api.core = core;
module.exports = api;
