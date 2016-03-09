import { api, core } from './api';
import Router from './core/router';
import Response from './core/response';
import Server from './server';

// 消息响应中间件
Server.use(Response.middleware());
// 核心路由组件
Server.use(Router.middleware());

export default {
  api,
  monix: core,
};
