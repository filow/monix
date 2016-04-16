#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const monix = require('../');
const u = require('../lib/util');
const api = monix.api;
const core = monix.core;
// 暴露API
u.mixin(global, api);

// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync(process.argv[2]));
core.Server.run();
