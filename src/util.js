/* eslint-disable no-console */

export {
  isString, isRegExp, isFunction, isArray, isPlainObject, mapValues,
  each, mixin, map, filter, defaultsDeep, merge } from 'lodash';

import color from 'chalk';
const levels = {
  debug: { i: 0, color: color.gray },
  info: { i: 1, color: color.cyan },
  warn: { i: 2, color: color.yellow },
  error: { i: 3, color: color.red.bold },
  off: { i: 999, color: color.gray },
};
let currentLevel = 'debug';
let stdout = console;

// 可以手动设置console，以方便测试
export function setConsole(fakeConsole) {
  stdout = fakeConsole;
}
export function setLevel(level) {
  if (!levels[level]) throw new Error('不合法的log level取值');
  currentLevel = level;
}
function getTime() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}
function logger(func, level, msg) {
  if (levels[level].i < levels[currentLevel].i) return msg;
  return stdout[func].apply(stdout,
    [levels.debug.color(getTime()),
     levels[level].color(`[${level.toUpperCase()}]`),
     ...msg]
  );
}

// 显示内部运行时信息
export function debug(...msg) {
  logger('log', 'debug', msg);
}
// 显示一般的可以给用户看的信息
export function info(...msg) {
  logger('info', 'info', msg);
}
// 警告
export function warn(...msg) {
  logger('warn', 'warn', msg);
}
// 错误
export function error(...msg) {
  if (levels.error.i >= levels[currentLevel].i) {
    throw new Error(levels.error.color(msg));
  }
}
