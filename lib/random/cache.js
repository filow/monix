'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const store = {};
class Cache {
  constructor(key) {
    this.key = key;
    store[key] = {};
  }
  get(name) {
    return store[this.key][name];
  }
  set(name, value) {
    store[this.key][name] = value;
  }
  exist(name) {
    return typeof store[this.key][name] !== 'undefined';
  }
}
exports.default = Cache;