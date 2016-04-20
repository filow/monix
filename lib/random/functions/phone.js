"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.phone = phone;
function phone() {
  let params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _params$areacode = params.areacode;
  const areacode = _params$areacode === undefined ? true : _params$areacode;
  var _params$extension = params.extension;
  const extension = _params$extension === undefined ? false : _params$extension;

  let number = this.randexp(/[2-9][0-9]{6,7}/)();
  if (areacode) {
    number = this.randexp(/0[0-9]{2,3}\-/)() + number;
  }
  if (extension) {
    number += this.randexp(/\-[0-9]{1,4}/)();
  }
  return number;
}