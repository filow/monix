// import * as u from './util';
import Router from './core/router';
import Random from './random';
// User-Level API
const api = {
  R: new Random(),
  get: function get(path, ...other) {
    Router.regist('get', path, other);
  },
};
export { api };


// System-Level API
import Server from './server';
const core = { Server, Router };
export { core };
