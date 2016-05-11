'use strict';

require('babel-polyfill');

var _Highway = require('Highway');

var _Highway2 = _interopRequireDefault(_Highway);

var _Gui = require('../dist/Gui');

var _Gui2 = _interopRequireDefault(_Gui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Host = new self.Worker('./dist/Test.Worker');
var HW = new _Highway2.default(Host);
var CH = new _Gui2.default(HW);

self.$ = CH.$;

HW.sub('Worker->Ready', function () {
    console.info('Start test');
    mocha.run();
});

console.info('Site engine started.');