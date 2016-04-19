#!/usr/bin/env node

const program = require('commander');
const pack = require('../package.json');

program
  .version(pack.version)
  .description(pack.description)
  .usage('<file> [options]')
  .arguments('<file>')
  .option('-l, --loglevel <level>',
    'set log level. Level can be debug, info, warn, error and off',
     /^(debug|info|warn|error)$/i,
     'debug')
  .parse(process.argv);

if (program.args.length <= 0) {
  program.help();
}

const fs = require('fs');
const vm = require('vm');
const monix = require('../');
const u = require('../lib/util');

if (program.loglevel) {
  u.setLevel(program.loglevel.toLowerCase());
}
// 暴露API
u.mixin(global, monix);

// 核心函数，运行用户给定的文件
vm.runInThisContext(fs.readFileSync(process.argv[2]));
monix.core.Server.run();
