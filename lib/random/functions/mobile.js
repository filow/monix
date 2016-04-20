"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mobile = mobile;
function mobile() {
  return this.randexp(/1([358][0-9]|4[57])[0-9]{8}/)();
}