// import * as u from './util';
import router from './router';
export function get(path, ...other) {
  router.regist('get', path, other);
}
