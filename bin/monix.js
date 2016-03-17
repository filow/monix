#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const monix = require('../');
const u = require('../lib/util');
const api = monix.default.api;
const core = monix.default.monix;
// 暴露API
u.mixin(global, api);

// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync(process.argv[2]));
core.Server.run();
u.info('服务器已启动，访问地址：http://localhost:3000.');
