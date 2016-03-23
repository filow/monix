"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.address = address;
function address() {
  return this.concat(this.province(), this.city(), this.county())();
}