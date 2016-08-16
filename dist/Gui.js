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

// POWA
self.ChambrDebug = self.ChambrDebug;

var HW = undefined;

// Privates
var _requestId = Symbol();
var _promises = Symbol();
var _basket = Symbol();

/**
 * Chambr GUI side.
 *
 * @class
 */

var Chambr = function () {
    _createClass(Chambr, [{
        key: 'HW',


        /**
         * HW Instance getter
         * @returns {Highway}
         */
        get: function get() {
            return HW;
        }

        /**
         * ShortObject getter
         * @returns {Object}
         */

    }, {
        key: '$',
        get: function get() {
            return this[_basket];
        }

        /**
         * Constructor.
         *
         * @param {Highway} HighwayInstance
         * @constructor
         */

    }]);

    function Chambr(HighwayInstance) {
        var _this = this;

        _classCallCheck(this, Chambr);

        // Initialize privates
        this[_requestId] = 0;
        this[_promises] = {};
        this[_basket] = {};

        // Subscribe to incoming Expose events
        HW = HighwayInstance;
        HW.sub('ChambrClient->Expose', function (exposeEvent) {
            self.ChambrDebug && console.log('Incoming Expose: ', exposeEvent);

            // Extract data from event
            // Create ShortObject
            var exposeData = exposeEvent.data;
            var model = _this.$[exposeData.modelName] = _this.applyApi(exposeData);
            var modelName = exposeData.modelName;

            // Subscribe to every event this model has
            HW.sub('ChambrClient->' + modelName, function (modelEvent) {
                self.ChambrDebug && console.log('GUI Incoming: ', modelEvent);

                // Extract vars
                var modelExportChanged = false;
                var d = modelEvent.data;
                var responseState = d.responseState;
                var responseId = d.responseId;
                var responseData = d.responseData || {};
                var modelExport = responseData.export || {};
                var modelBuffer = responseData.buffer || [];
                var modelOutput = responseData.output;

                // Update data
                // Apply all buffered actions to the data
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

                    // @TODO implement complex
                });

                // Apply all exported data (getters)
                for (var name in modelExport) {

                    // To trigger update when only getter value is changed
                    if (!modelExportChanged && model[name] !== modelExport[name]) {
                        modelExportChanged = true;
                    }

                    // No has own prop check needed!
                    model[name] = modelExport[name];
                }

                // In case we have a responseState and responseId,
                // we need to resolve the pending promises
                if (responseState && responseId) {
                    var methods = _this[_promises][responseId];
                    methods && methods[modelEvent.state].call(null, modelOutput);
                    delete _this[_promises][responseId];
                }

                // Trigger an event with the name of the method
                var method = modelEvent.name.replace('ChambrClient->', '');
                method && model.trigger(method, modelEvent.data);

                // Trigger an event with the state of the event
                model.trigger(modelEvent.state, modelEvent.data);

                // Trigger event with the state of the response
                responseState && model.trigger(responseState, d)

                // Trigger an `update` event, because data is changed
                ;(modelExportChanged || modelBuffer.length) && model.trigger('update', d);
            });
        });
    }

    /**
     * Applies exposed API from Worker, creates ShortObject.
     *
     * @param exposeData
     * @returns {Object} ShortObject
     */


    _createClass(Chambr, [{
        key: 'applyApi',
        value: function applyApi(exposeData) {
            var _this2 = this;

            // Create constructor first please
            var d = this.applyApiValue(exposeData.modelName, {
                name: 'constructor',
                type: 'fn'
            });

            // Assign modelData to it
            _extends(d, exposeData.modelData);

            // Add API methods as non-enumerable members
            exposeData.modelApi.forEach(function (apiData) {
                return Object.defineProperty(d, apiData.name, {
                    enumerable: false,
                    configurable: true,
                    writable: true,
                    value: _this2.applyApiValue(exposeData.modelName, apiData)
                });
            });

            // Set to observable
            return (0, _riotObservable2.default)(d);
        }

        /**
         * Creates a function for the ShortObject.
         * Function types will trigger the event on Highway to be executed in the Worker.
         *
         * @param {String} name    Name of the member.
         * @param {Object} apiData Details of the member method.
         * @returns {undefined}
         */

    }, {
        key: 'applyApiValue',
        value: function applyApiValue(name, apiData) {
            var that = this;
            var method = apiData.name;
            var value = undefined;

            // Value become a function which will trigger correct HW event.
            if (apiData.type === 'fn') {
                value = function value() {
                    for (var _len = arguments.length, argList = Array(_len), _key = 0; _key < _len; _key++) {
                        argList[_key] = arguments[_key];
                    }

                    // If `this` is observable, than trigger event with the methods name
                    this && this.trigger && this.trigger(method);

                    // Create promise in return.
                    // We're creating a request id,
                    // so we will now which promise to resolve
                    var p = new Promise(function (resolve, reject) {
                        that[_promises][++that[_requestId]] = { resolve: resolve, reject: reject };

                        // Trigger HW event
                        HW.pub('ChambrWorker->' + name + '->' + method, {
                            argList: Array.from(argList),
                            requestId: that[_requestId]
                        });
                    });

                    // If constructor is called, simply return the ShortObject
                    return method === 'constructor' ? that[_basket][name] : p;
                };
            }

            // Apply decorator
            // @TODO Implement as Middleware

            var _loop = function _loop(decorator) {
                if (!apiData.decorators.hasOwnProperty(decorator)) return 'continue';

                var descriptor = apiData.decorators[decorator];
                var old = value;

                switch (decorator) {

                    // @Default decorator
                    case 'default':
                        value = descriptor;
                        break;

                    // @Peel decorator
                    case 'peel':
                        // Fix some Babel transform issues
                        _typeof = _typeof;

                        var peelList = descriptor.list;
                        eval('value = ' + descriptor.fn);
                        break;

                    // @TODO Check if still needed.
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