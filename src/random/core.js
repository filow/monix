class RandomUtility {
  static linear(step = 1) {
    return function _linear(_from, _to) {
      let fromVal = _from;
      let to = _to;
      // 如果数值增长方向和from-to的方向相反，就调换一下
      if ((to - fromVal) * step < 0) {
        fromVal = _to;
        to = _from;
      }
      const stepLeap = Math.floor((to - fromVal) / step);
      const rand = Math.floor(Math.random() * (stepLeap + 1));
      return fromVal + rand * step;
    };
  }
}
const Ru = RandomUtility;
class Random {
  static number(fromVal, to, func = RandomUtility.linear()) {
    return func(fromVal, to);
  }
  static bool() {

  }
}
export default { R: Random, Ru };
