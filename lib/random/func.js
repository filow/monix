'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.linear = linear;
exports.city = city;
exports.province = province;
/* eslint-disable prefer-const */
const cityData = require('../../data/city.json');
const cityDataLength = cityData.city.length;
function linear(params) {
  var _params$step = params.step;
  const step = _params$step === undefined ? 1 : _params$step;
  const min = params.min;
  const max = params.max;

  let fromVal = min;
  let to = max;
  // 如果数值增长方向和from-to的方向相反，就调换一下
  if ((to - fromVal) * step < 0) {
    fromVal = max;
    to = min;
  }
  const stepLeap = Math.floor((to - fromVal) / step);
  const rand = Math.floor(Math.random() * (stepLeap + 1));
  return fromVal + rand * step;
}

function city() {
  let index;
  let prov;
  let cityList;
  // 防止选到没有子节点的省份
  do {
    index = this.natural({ min: 0, max: cityDataLength - 1 })();
    prov = cityData.city[index];
    cityList = prov[2];
  } while (typeof cityList === 'undefined' || cityList.length === 0);
  const one = this.pickone(cityList);
  return one[1];
}

function province() {
  const index = this.natural({ min: 0, max: cityDataLength - 1 })();
  return cityData.city[index][1];
}