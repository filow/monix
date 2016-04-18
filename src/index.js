// import * as u from './util';
import Router from './core/router';
import Random from './random';
import Config from './config';
import Response from './core/response';
import Server from './server';

// System-Level API
const core = { Server, Router, Config, Random };

// 消息响应中间件
Server.use(Response.middleware());
// 核心路由组件
Server.use(Router.middleware());

module.exports = {
  R: new Random(),
  set: Config.scope('/').set,
  get: function get(path, ...other) {
    Router.regist('get', path, other);
  },
  core,
};
