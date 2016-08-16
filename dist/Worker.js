'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ModelAbstract = require('./ModelAbstract');

var _ModelAbstract2 = _interopRequireDefault(_ModelAbstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lastInstance = undefined;

/**
 * 
 */

var Chambr = function () {
    _createClass(Chambr, null, [{
        key: 'Instance',
        get: function get() {
            return lastInstance;
        }

        /**
         * @param HighwayInstance {Highway}
         */

    }]);

    function Chambr(HighwayInstance) {
        var _this = this;

        _classCallCheck(this, Chambr);

        this.MODEL_LIBRARY = {};
        this.MODEL_INSTANCES = {};
        this.HW = undefined;
        this.INSTANCE = undefined;

        this.INSTANCE = lastInstance = this;
        this.HW = HighwayInstance;
        this.HW.sub('ChambrWorker', function (ChambrEvent) {
            console.log('In-W: ', ChambrEvent);
            var ev = ChambrEvent.data;
            var route = ChambrEvent.name.split('->');
            var argList = Object.values(ev.argList);
            var isConstructor = route[2] === 'constructor';
            var model = _this.getModel(route[1], isConstructor ? argList : undefined);
            var method = model ? model[route[2]] : false;
            var responseEventName = ChambrEvent.name.replace('ChambrWorker', 'ChambrClient');
            if (method && isConstructor) {
                _this.resolve(responseEventName, ev.requestId, {
                    buffer: Array.from(model[_ModelAbstract._buffer]),
                    export: _this.exports(model)
                });
            } else if (method) {
                var r = method.apply(model, argList);
                try {
                    r.then(function (o) {
                        return _this.resolve(responseEventName, ev.requestId, {
                            buffer: Array.from(model[_ModelAbstract._buffer]),
                            export: _this.exports(model),
                            output: o
                        });
                    }).catch(function (o) {
                        return _this.reject(responseEventName, ev.requestId, {
                            buffer: Array.from(model[_ModelAbstract._buffer]),
                            export: _this.exports(model),
                            output: o
                        });
                    });
                } catch (e) {
                    _this.resolve(responseEventName, ev.requestId, {
                        buffer: Array.from(model[_ModelAbstract._buffer]),
                        export: _this.exports(model),
                        output: r
                    });
                }
            }
        });
    }

    /** @returns {ModelAbstract} */


    _createClass(Chambr, [{
        key: 'getModel',
        value: function getModel(modelName) {
            var argList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            var model = this.MODEL_INSTANCES[modelName];
            if (!model) {
                model = this.MODEL_INSTANCES[modelName] = new (Function.prototype.bind.apply(this.MODEL_LIBRARY[modelName], [null].concat(_toConsumableArray(argList))))();
            }
            return model;
        }
    }, {
        key: 'resolve',
        value: function resolve(eventName, responseId, responseData) {
            var responseState = arguments.length <= 3 || arguments[3] === undefined ? 'resolve' : arguments[3];

            this.HW.pub(eventName, {
                responseId: responseId,
                responseData: responseData,
                responseState: responseState
            }, 'resolve');
        }
    }, {
        key: 'reject',
        value: function reject(eventName, responseId, responseData) {
            var responseState = arguments.length <= 3 || arguments[3] === undefined ? 'reject' : arguments[3];

            this.HW.pub(eventName, {
                responseId: responseId,
                responseData: responseData,
                responseState: responseState
            }, 'reject');
        }
    }, {
        key: 'exports',
        value: function exports(model) {
            var results = {};
            model._exposedApi.forEach(function (apiData) {
                apiData.type === 'var' && (results[apiData.name] = model[apiData.name]);
            });
            return results;
        }
    }, {
        key: 'Model',
        get: function get() {
            _ModelAbstract2.default.Chambr = this;
            return _ModelAbstract2.default;
        }

        /**
         * @param model {ModelAbstract}
         */
        ,
        set: function set(model) {
            var api = [];
            var tmpModel = model.prototype;
            var modelName = extractFunctionName(model);
            this.MODEL_LIBRARY[modelName] = model;

            do {
                Object.getOwnPropertyNames(tmpModel).forEach(function (prop) {
                    if (api.findIndex(function (v) {
                        return v.name === prop;
                    }) === -1 && (typeof prop === 'undefined' ? 'undefined' : _typeof(prop)) !== 'symbol' && prop !== 'constructor' && prop.charAt(0) !== '_') {
                        var descriptor = Object.getOwnPropertyDescriptor(tmpModel, prop);

                        api.push({
                            name: prop,
                            type: descriptor.get ? 'var' : 'fn',
                            decorators: descriptor.get ? descriptor.get.decorators : descriptor.value.decorators
                        });
                    }
                });

                tmpModel = tmpModel.__proto__;

                if (tmpModel && tmpModel.constructor && extractFunctionName(tmpModel.constructor) !== 'ModelAbstract' && extractFunctionName(tmpModel.constructor) !== 'Object') {} else {
                    tmpModel = false;
                }
            } while (tmpModel);

            model.prototype._exposedApi = api;

            this.HW.pub('ChambrClient->Expose', {
                modelData: model.DefaultData,
                modelName: modelName,
                modelApi: api
            });
        }
    }]);

    return Chambr;
}();

exports.default = Chambr;


function extractFunctionName(fn) {
    var match = void 0;
    fn = fn.toString();
    match = fn.match(/class\W+(.*?)\W+/);
    if (match) return match[1];else return fn.match(/function\W+([\w$_]+?)\(/)[1];
}