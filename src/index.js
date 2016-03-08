// import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as vm from 'vm';

import * as api from './api';
import Router from './core/router';
import Response from './core/response';
import * as u from './util';

import Koa from 'koa';
const app = new Koa();
// 消息响应中间件
app.use(Response.middleware());
// 核心路由组件
app.use(Router.middleware());
// 暴露API
u.mixin(global, api);
// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync('test.js'));
app.listen(3000);
u.info('服务器已启动，访问地址：http://localhost:3000.');
