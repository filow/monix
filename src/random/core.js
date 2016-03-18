class RandomUtility {
  // 产生线性分布的随机数
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
  // 泊松分布的随机数生成函数
  static possion() {

  }
  static _normal(x, miu, sigma) {
    const a = Math.sqrt(2 * Math.PI);
    const b = -1 * (x - miu) * (x - miu) / (2 * sigma * sigma);
    return 1.0 / a / sigma * Math.exp(b);
  }
  // 正态分布
  static normalDist(miu, sigma) {
    return function _normalDist(min, max) {
      let x;
      let y;
      let dScope;
      do {
        x = Math.random() * (max - min) + min;
        y = RandomUtility._normal(x, miu, sigma);
        dScope = Math.random() * RandomUtility._normal(miu, miu, sigma);
      } while (dScope > y);
      return x;
    };
  }
  // 标准正态分布
  static stdNormalDist() {
    return RandomUtility.normalDist(0, 1);
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
