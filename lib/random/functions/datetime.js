'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datetime = datetime;
const u = require('../../util');
const moment = require('moment');
const formatPreset = {
  iso: 'toISOString', // 2013-02-04T22:44:30.652Z
  array: 'toArray', // [2010, 1, 3, 12, 39, 40]
  date: 'toDate', // javascript日期对象
  unix: 'unix', // unix时间戳
  milliseconds: 'valueOf', // unix偏移量
  calendar: 'calendar', // 日历时间
  toNow: 'toNow', // 距离现在还有多久
  fromNow: 'formNow' };
// 多久之前,
function datetime() {
  let params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  // date字段支持：
  // 1. Javascript日期对象
  // 2，Unix偏移量（毫秒）
  // 3. ISO 8601
  // date字段一旦存在，就不会生成随机日期
  const date = params.date;
  var _params$format = params.format;
  const format = _params$format === undefined ? 'iso' : _params$format;

  let instance;
  if (date) {
    instance = moment(date);
  } else {
    var _params$year = params.year;
    const year = _params$year === undefined ? this.natural({ min: 1990, max: new Date().getYear() + 1900 }) : _params$year;
    var _params$month = params.month;
    const month = _params$month === undefined ? this.natural({ min: 0, max: 11 }) : _params$month;
    var _params$day = params.day;
    const day = _params$day === undefined ? this.natural({ min: 1, max: 31 }) : _params$day;
    var _params$hour = params.hour;
    const hour = _params$hour === undefined ? this.natural({ min: 0, max: 23 }) : _params$hour;
    var _params$minute = params.minute;
    const minute = _params$minute === undefined ? this.natural({ min: 0, max: 59 }) : _params$minute;
    var _params$second = params.second;
    const second = _params$second === undefined ? this.natural({ min: 0, max: 59 }) : _params$second;

    let obj = { year, month, day, hour, minute, second };
    // 将函数类型转化为普通类型
    obj = u.map(obj, v => u.isFunction(v) ? v() : v);
    instance = moment(obj);
  }
  // 如果存在预设，就按照预设的函数输出结果
  if (formatPreset[format]) {
    return instance[formatPreset[format]]();
  }
  return instance.format(format);
}