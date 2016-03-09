// import * as u from './util';
import Router from './core/router';
// User-Level API
const api = {
  get: function get(path, ...other) {
    Router.regist('get', path, other);
  },
};
export { api };


// System-Level API
import Server from './server';
const core = { Server, Router };
export { core };
