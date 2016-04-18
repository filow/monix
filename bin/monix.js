#!/usr/bin/env node
const fs = require('fs');
const vm = require('vm');
const monix = require('../');
const u = require('../lib/util');
// 暴露API
u.mixin(global, monix);

// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync(process.argv[2]));
monix.core.Server.run();
