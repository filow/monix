'use strict';

var _config = require('../core/config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function configLoader(exports, api) {
  const configInstance = new _config2.default();
  api.set = configInstance.scope('/').set;
  return configInstance;
};