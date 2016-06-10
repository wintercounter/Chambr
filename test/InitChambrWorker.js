'use strict';

var _Highway = require('Highway');

var _Highway2 = _interopRequireDefault(_Highway);

var _WebWorker = require('Highway/dist/Proxy/WebWorker');

var _WebWorker2 = _interopRequireDefault(_WebWorker);

var _Worker = require('../dist/Worker');

var _Worker2 = _interopRequireDefault(_Worker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

self.HW = self.HW || new _Highway2.default(new _WebWorker2.default(self));
self.CH = new _Worker2.default(self.HW);