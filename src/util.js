/* eslint-disable no-console */
export {
  isString, isRegExp, isFunction, isArray, isPlainObject, mapValues,
  find, each, mixin, map, filter } from 'lodash';

import color from 'chalk';
const levelColor = {
  debug: color.gray,
  info: color.cyan,
  warn: color.yellow,
  error: color.red.bold,
};
function getTime() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
}
export function isTest() {
  return process.env.NODE_ENV === 'test';
}
let stdout = console;
// 可以手动设置console，以方便测试
export function setConsole(fakeConsole) {
  stdout = fakeConsole;
}
function logger(func, level, msg) {
  if (isTest() && (level === 'debug' || level === 'info')) return msg;
  return stdout[func].apply(stdout,
    [levelColor.debug(getTime()),
     levelColor[level](`[${level.toUpperCase()}]`),
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
  throw new Error(levelColor.error(msg));
}
