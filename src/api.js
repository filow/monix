// import * as u from './util';
import Router from './core/router';
import Random from './random';
import Config from './config';
// User-Level API
const api = {
  R: new Random(),
  set: Config.scope('/').set,
  get: function get(path, ...other) {
    Router.regist('get', path, other);
  },
};
export { api };


// System-Level API
import Server from './server';
const core = { Server, Router };
export { core };
