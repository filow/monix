'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.county = county;
const cityData = require('../../../data/city.json');
function county() {
  return this.pickone(cityData.county);
}