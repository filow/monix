'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.province = province;
const cityData = require('../../../data/city.json');
function province() {
  const prov = this.pickone(cityData.city);
  return prov[1];
}