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
  fromNow: 'formNow', // 多久之前,
};
export function datetime(params = {}) {
  // date字段支持：
  // 1. Javascript日期对象
  // 2，Unix偏移量（毫秒）
  // 3. ISO 8601
  // date字段一旦存在，就不会生成随机日期
  const { date, format = 'iso' } = params;
  let instance;
  if (date) {
    instance = moment(date);
  } else {
    const {
      year = this.natural({ min: 1990, max: (new Date()).getYear() + 1900 }),
      month = this.natural({ min: 0, max: 11 }),
      day = this.natural({ min: 1, max: 31 }),
      hour = this.natural({ min: 0, max: 23 }),
      minute = this.natural({ min: 0, max: 59 }),
      second = this.natural({ min: 0, max: 59 }),
    } = params;
    let obj = { year, month, day, hour, minute, second };
    // 将函数类型转化为普通类型
    obj = u.map(obj, v => {
      if (u.isFunction(v)) return v();
      return v;
    });
    instance = moment(obj);
  }
  // 如果存在预设，就按照预设的函数输出结果
  if (formatPreset[format]) {
    return instance[formatPreset[format]]();
  }
  return instance.format(format);
}
