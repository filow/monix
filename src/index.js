import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as vm from 'vm';
import * as api from './api';
import Router from './router';
import * as u from './util';

const monix = new EventEmitter();
monix.Router = Router;

global.monix = monix;
u.mixin(global, api);
// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync('test.js'));
u.debug(monix.Router.stack)
