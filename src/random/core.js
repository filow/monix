class RandomUtility {
  static linear(step = 1) {
    return function _linear(fromVal, to) {
      const stepLeap = Math.floor((to - fromVal + 1) / step);
      const rand = Math.floor(Math.random() * (stepLeap + 1));
      return fromVal + rand * step;
    };
  }
}
const Ru= RandomUtility;
class Random {
  static number(_from, _to, func = RandomUtility.linear()) {
    let fromVal;
    let to;
    if (_from > _to) {
      to = _from;
      fromVal = _to;
    } else {
      to = _to;
      fromVal = _from;
    }
    return func(fromVal, to);
  }
}
export default { R: Random, Ru };
