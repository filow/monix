'use strict';

var _server = require('../core/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function serverLoader(exports, api) {
  const server = new _server2.default();
  exports.Config.regist('/', {
    protocol: {
      default: 'http',
      validators: [exports.Config.v.type('string'), exports.Config.v.inArray(['http'])]
    },
    host: {
      default: 'localhost'
    },
    port: {
      default: 3456
    }
  });
  api.middleware = server.use;
  return server;
};