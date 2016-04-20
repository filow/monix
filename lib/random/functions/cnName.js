'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cnName = cnName;
const randomName = require('chinese-random-name');
function cnName() {
  let params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var _params$surname = params.surname;
  const surname = _params$surname === undefined ? true : _params$surname;
  var _params$name = params.name;
  const name = _params$name === undefined ? true : _params$name;

  let result = '';
  if (surname) {
    result += randomName.surnames.getOne();
  }
  if (name) {
    if (typeof name === 'number') {
      let length = name;
      if (length < 1) length = 1;
      if (length > 3) length = 3;
      result += randomName.names[`get${ length }`]();
    } else if (typeof name === 'string') {
      let length = name.length;
      if (length > 3) length = 3;
      result += randomName.names[`get${ length }`](name);
    } else {
      result += randomName.names.get();
    }
  }
  return result;
}