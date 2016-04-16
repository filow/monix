const monix = require('../../');
const api = monix.default.api;
const core = monix.default.monix;
const should = require('should');

describe('route#error', () => {
  it('#regist should handle bad method name', () => {
    should(() => core.Router.regist(/bad/, '/', {}))
     .throw(Error);
  });
  it('#regist only accept string or regexp path', () => {
    should(() => core.Router.regist('get', 1234, {}))
     .throw(Error);
  });
  it('三参数调用时第二个参数必须是object', () => {
    const badOptionCall = function badOptionCall() {
      api.get('/t1', 111, () => {});
    };
    should(badOptionCall).throw(Error);

    const badOptionCallString = function badOptionCallString() {
      api.get('/t1', 'String', () => {});
    };
    should(badOptionCallString).throw(Error);
  });
});
