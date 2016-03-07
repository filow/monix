/* eslint-disable no-console */
// import * as _ from 'lodash';
// const { isString, isRegExp, isFunction, mixin, isObject } = _;
export { isString, isRegExp, isFunction, mixin, isObject } from 'lodash';

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

function logger(func, level, msg) {
  func.apply(console,
    [levelColor.debug(getTime()),
     levelColor[level](`[${level.toUpperCase()}]`),
     ...msg]
  );
}
// 显示内部运行时信息
export function debug(...msg) {
  logger(console.log, 'debug', msg);
}
// 显示一般的可以给用户看的信息
export function info(...msg) {
  logger(console.info, 'info', msg);
}
// 警告
export function warn(...msg) {
  logger(console.warn, 'warn', msg);
}
// 错误
export function error(...msg) {
  throw new Error(levelColor.error(msg));
}
