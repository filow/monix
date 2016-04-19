// 验证器
export default class Validator {
  static type(req) {
    return (value) => typeof value === req;
  }
  static objectType(req) {
    return value => {
      const objectType = Object.prototype.toString.call(value);
      const type = objectType.match(/\[\w+ (\w+)\]/)[1].toLowerCase();
      return type === req;
    };
  }
  static regexp(req) {
    return value => value.toString().match(req);
  }
  static inArray(req) {
    return value => req.indexOf(value) >= 0;
  }
}
