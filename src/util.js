/* eslint-disable no-console */
import color from 'chalk';
const levelColor = {
  debug: color.gray,
  info: color.cyan,
  warn: color.yellow,
  error: color.red.bold,
};
export {
  isString, isRegExp, isFunction, isArray, isPlainObject, mapValues,
  each, mixin, map, filter, defaultsDeep, merge } from 'lodash';

export function isTest() {
  return process.env.NODE_ENV === 'test';
}
let stdout = console;
// 可以手动设置console，以方便测试
export function setConsole(fakeConsole) {
  stdout = fakeConsole;
}

function getTime() {
  const now = new Date();
  return `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
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
