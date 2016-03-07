import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as vm from 'vm';
import * as api from './api';
import * as Router from './router';
import * as _ from './util';

const monix = new EventEmitter();
monix.Router = Router;

global.monix = monix;
_.mixin(global, api);
// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync('test.js'));
