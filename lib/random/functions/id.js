"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.id = id;
let store = 0;
function id() {
  store++;
  return store;
}