'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.city = city;
/* eslint-disable prefer-const */
const cityData = require('../../../data/city.json');

function city() {
  let prov;
  let cityList;
  // 防止选到没有子节点的省份
  do {
    prov = this.pickone(cityData.city);
    cityList = prov[2];
  } while (typeof cityList === 'undefined' || cityList.length === 0);
  const one = this.pickone(cityList);
  return one[1];
}