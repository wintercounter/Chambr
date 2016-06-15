'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HW = undefined;

var Chambr = function () {
    _createClass(Chambr, [{
        key: 'HW',
        get: function get() {
            return HW;
        }
    }, {
        key: '$',
        get: function get() {
            return this._basket;
        }
    }]);

    function Chambr(HighwayInstance) {
        var _this = this;

        _classCallCheck(this, Chambr);

        this._requestId = 0;
        this._promises = {};
        this._basket = {};

        HW = HighwayInstance;
        HW.sub('ChambrClient->Expose', function (exposeEvent) {
            console.log('In-Exp: ', exposeEvent);
            var exposeData = exposeEvent.data;
            var model = _this.$[exposeData.modelName] = _this.applyApi(exposeData);

            HW.sub('ChambrClient->' + exposeData.modelName, function (modelEvent) {
                console.log('In-GUI: ', modelEvent);
                var d = modelEvent.data;
                var responseState = d.responseState;
                var responseId = d.responseId;
                var responseData = d.responseData || {};
                var modelExport = responseData.export;
                var modelBuffer = responseData.buffer || [];
                var modelOutput = responseData.output;

                // Update data
                modelBuffer.forEach(function (action) {
                    var act = action[0];
                    var idx = action[1];
                    var val = action[2];

                    switch (act) {
                        case 'action-simple-set':
                            model[idx] = val;
                            break;
                        case 'action-simple-delete':
                            delete model[idx];
                            break;
                    }
                });

                if (responseState && responseId) {
                    var methods = _this._promises[responseId];
                    methods && methods[modelEvent.state].call(null, modelOutput);
                    delete _this._promises[responseId];
                }

                for (var name in modelExport) {
                    // No has own prop check needed!
                    model[name] = modelExport[name];
                }

                model.trigger(modelEvent.name, modelEvent.data);
                model.trigger(modelEvent.state, modelEvent.data);
                modelBuffer.length && model.trigger('update', d);
                responseState && model.trigger(responseState, d);
            });
        });
    }

    _createClass(Chambr, [{
        key: 'applyApi',
        value: function applyApi(exposeData) {
            var _this2 = this;

            var d = this.applyApiValue(exposeData.modelName, {
                name: 'constructor',
                type: 'fn'
            });
            _extends(d, exposeData.modelData);
            exposeData.modelApi.forEach(function (apiData) {
                return Object.defineProperty(d, apiData.name, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: _this2.applyApiValue(exposeData.modelName, apiData)
                });
            });
            return (0, _riotObservable2.default)(d);
        }
    }, {
        key: 'applyApiValue',
        value: function applyApiValue(name, apiData) {
            var that = this;
            var method = apiData.name;
            var value = undefined;

            if (apiData.type === 'fn') {
                value = function value() {
                    for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
                        argList[_key] = arguments[_key];
                    }

                    this && this.trigger && this.trigger(method);
                    var p = new Promise(function (resolve, reject) {
                        that._promises[++that._requestId] = { resolve: resolve, reject: reject };
                        HW.pub('ChambrWorker->' + name + '->' + method, {
                            argList: [].slice.call(argList, 0),
                            requestId: that._requestId
                        });
                    });
                    return method === 'constructor' ? that._basket[name] : p;
                };
            }

            var _loop = function _loop(decorator) {
                if (!apiData.decorators.hasOwnProperty(decorator)) return 'continue';
                var descriptor = apiData.decorators[decorator];
                var old = value;

                switch (decorator) {
                    case 'default':
                        value = descriptor;
                        break;
                    case 'peel':
                        _typeof = _typeof;

                        var peelList = descriptor.list;
                        eval('value = ' + descriptor.fn);
                        break;
                    case 'empty':
                        value = function emptyDecorator() {
                            old();
                        };
                        break;
                    default:
                        break;
                }
            };

            for (var decorator in apiData.decorators) {
                var _typeof;

                var _ret = _loop(decorator);

                if (_ret === 'continue') continue;
            }

            return value;
        }
    }]);

    return Chambr;
}();

exports.default = Chambr;