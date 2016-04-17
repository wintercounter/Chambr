(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function(window, undefined) {var observable = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {}

  /**
   * Private variables and methods
   */
  var callbacks = {},
    slice = Array.prototype.slice,
    onEachEvent = function(e, fn) { e.replace(/\S+/g, fn) }

  // extend the object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(events, fn) {
        if (typeof fn != 'function')  return el

        onEachEvent(events, function(name, pos) {
          (callbacks[name] = callbacks[name] || []).push(fn)
          fn.typed = pos > 0
        })

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given space separated list of `events` listeners
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(events, fn) {
        if (events == '*' && !fn) callbacks = {}
        else {
          onEachEvent(events, function(name) {
            if (fn) {
              var arr = callbacks[name]
              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                if (cb == fn) arr.splice(i--, 1)
              }
            } else delete callbacks[name]
          })
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given space separated list of `events` and execute the `callback` at most once
     * @param   { String } events - events ids
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(events, fn) {
        function on() {
          el.off(events, on)
          fn.apply(el, arguments)
        }
        return el.on(events, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to the given space separated list of `events`
     * @param   { String } events - events ids
     * @returns { Object } el
     */
    trigger: {
      value: function(events) {

        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns

        for (var i = 0; i < arglen; i++) {
          args[i] = arguments[i + 1] // skip first argument
        }

        onEachEvent(events, function(name) {

          fns = slice.call(callbacks[name] || [], 0)

          for (var i = 0, fn; fn = fns[i]; ++i) {
            if (fn.busy) return
            fn.busy = 1
            fn.apply(el, fn.typed ? [name].concat(args) : args)
            if (fns[i] !== fn) { i-- }
            fn.busy = 0
          }

          if (callbacks['*'] && name != '*')
            el.trigger.apply(el, ['*', name].concat(args))

        })

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  })

  return el

}
  /* istanbul ignore next */
  // support CommonJS, AMD & browser
  if (typeof exports === 'object')
    module.exports = observable
  else if (typeof define === 'function' && define.amd)
    define(function() { return observable })
  else
    window.observable = observable

})(typeof window != 'undefined' ? window : undefined);
},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Worker = require('./Worker.es6');

var _Worker2 = _interopRequireDefault(_Worker);

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelAbstract = function () {
    _createClass(ModelAbstract, [{
        key: 'modelData',
        set: function set(o) {
            this._data = o;
        },
        get: function get() {
            return this._data || {};
        }
    }]);

    function ModelAbstract() {
        var _this = this;

        _classCallCheck(this, ModelAbstract);

        (0, _riotObservable2.default)(this);
        this.on('*', function (name, data) {
            var onTriggers = _this._onTriggerEventHandlers[name];
            var promises = [];
            onTriggers && onTriggers.forEach(function (method) {
                var p = _this[method].call(_this, name, data);
                p.then && promises.push(p);
            });

            if (promises.length) {
                Promise.all(promises).then(function () {
                    _this.broadcast(name, data, false);
                });
            } else {
                _this.broadcast(name, data);
            }
        });
    }

    _createClass(ModelAbstract, [{
        key: 'broadcast',
        value: function broadcast(name) {
            var data = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
            var soft = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

            _Worker2.default.Resolve('Chambr->' + this.constructor.name + '->Event', -1, this.modelData, _Worker2.default.Export(this), data, soft, name);
        }
    }, {
        key: 'resolve',
        value: function resolve() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
            var soft = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
            var state = arguments.length <= 2 || arguments[2] === undefined ? 'resolve' : arguments[2];

            return Promise.resolve({ data: data, soft: soft, state: state });
        }
    }, {
        key: 'reject',
        value: function reject() {
            var data = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];
            var soft = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
            var state = arguments.length <= 2 || arguments[2] === undefined ? 'reject' : arguments[2];

            return Promise.reject({ data: data, soft: soft, state: state });
        }
    }]);

    return ModelAbstract;
}();

exports.default = ModelAbstract;

},{"./Worker.es6":3,"riot-observable":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ModelAbstract = require('./ModelAbstract.es6');

var _ModelAbstract2 = _interopRequireDefault(_ModelAbstract);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MODEL_LIBRARY = {};
var MODEL_INSTANCES = {};

var HW = undefined;

var Chambr = function () {
    function Chambr(HighwayInstance) {
        _classCallCheck(this, Chambr);

        HW = HighwayInstance;
        HW.sub('Chambr', function (ChambrEvent) {
            var ev = ChambrEvent.data;
            var route = ChambrEvent.name.split('->');
            var argList = Object.values(ev.argList);
            var isConstructor = route[2] === 'constructor';
            var model = Chambr.getModel(route[1], isConstructor ? argList : undefined);
            var method = model ? model[route[2]] : false;
            if (method) {
                if (isConstructor) {
                    Chambr.Resolve(ChambrEvent.name, ev.requestId, model.modelData, {}, {}, true);
                    return;
                }
                var r = method.apply(model, argList);
                try {
                    r.then(function (o) {
                        return Chambr.Resolve(ChambrEvent.name, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state);
                    }).catch(function (o) {
                        return Chambr.Reject(ChambrEvent.name, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state);
                    });
                } catch (e) {
                    Chambr.Resolve(ChambrEvent.name, ev.requestId, model.modelData, Chambr.Export(model), r, true);
                }
            }
        });
    }

    _createClass(Chambr, null, [{
        key: 'getModel',
        value: function getModel(modelName) {
            var argList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

            var model = MODEL_INSTANCES[modelName];
            if (!model) {
                model = MODEL_INSTANCES[modelName] = new (Function.prototype.bind.apply(MODEL_LIBRARY[modelName], [null].concat(_toConsumableArray(argList))))();
            }
            return model;
        }
    }, {
        key: 'Resolve',
        value: function Resolve(eventName, responseId, modelData, modelExport, responseData, responseSoft) {
            var responseState = arguments.length <= 6 || arguments[6] === undefined ? 'resolve' : arguments[6];

            HW.pub(eventName, {
                responseId: responseId,
                responseData: responseData,
                responseSoft: responseSoft,
                responseState: responseState,
                modelData: modelData,
                modelExport: modelExport
            }, 'resolve');
        }
    }, {
        key: 'Reject',
        value: function Reject(eventName, responseId, modelData, modelExport, responseData, responseSoft) {
            var responseState = arguments.length <= 6 || arguments[6] === undefined ? 'reject' : arguments[6];

            HW.pub(eventName, {
                responseId: responseId,
                responseData: responseData,
                responseSoft: responseSoft,
                responseState: responseState,
                modelData: modelData,
                modelExport: modelExport
            }, 'reject');
        }
    }, {
        key: 'Export',
        value: function Export(model) {
            var results = {};
            model._exposedApi.forEach(function (apiData) {
                apiData.type === 'var' && (results[apiData.name] = model[apiData.name]);
            });
            return results;
        }
    }, {
        key: 'Model',
        get: function get() {
            return _ModelAbstract2.default;
        },
        set: function set(model) {
            MODEL_LIBRARY[model.name] = model;

            var api = [];
            var tmpModel = model.prototype;

            do {
                Object.getOwnPropertyNames(tmpModel).forEach(function (prop) {
                    if (api.findIndex(function (v) {
                        return v.name === prop;
                    }) === -1 && prop !== 'constructor' && prop.charAt(0) !== '_') {
                        var descriptor = Object.getOwnPropertyDescriptor(tmpModel, prop);

                        api.push({
                            name: prop,
                            type: descriptor.get ? 'var' : 'fn',
                            decorators: descriptor.get ? descriptor.get.decorators : descriptor.value.decorators
                        });
                    }
                });

                tmpModel = tmpModel.__proto__;

                if (tmpModel && tmpModel.constructor && tmpModel.constructor.name !== 'ModelAbstract' && tmpModel.constructor.name !== 'Object') {} else {
                    tmpModel = false;
                }
            } while (tmpModel);

            model.prototype._exposedApi = api;

            HW.pub('Chambr->Expose', {
                modelName: model.name,
                modelApi: api
            });
        }
    }]);

    return Chambr;
}();

exports.default = Chambr;

},{"./ModelAbstract.es6":2}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcTW9kZWxBYnN0cmFjdC5lczYiLCJzcmNcXFdvcmtlci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7OztBQzNJ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QUwsQ0FBZCxLQUF3QyxDQUFDLENBQUQsSUFDckMsU0FBUyxhQUFULElBQ0EsS0FBSyxNQUFMLENBQVksQ0FBWixNQUFtQixHQUFuQixFQUNOO0FBQ0csNEJBQUksYUFBYSxPQUFPLHdCQUFQLENBQWdDLFFBQWhDLEVBQTBDLElBQTFDLENBQWIsQ0FEUDs7QUFHRyw0QkFBSSxJQUFKLENBQVM7QUFDTCxrQ0FBTSxJQUFOO0FBQ0Esa0NBQU0sV0FBVyxHQUFYLEdBQWlCLEtBQWpCLEdBQXlCLElBQXpCO0FBQ04sd0NBQVksV0FBVyxHQUFYLEdBQWlCLFdBQVcsR0FBWCxDQUFlLFVBQWYsR0FBNEIsV0FBVyxLQUFYLENBQWlCLFVBQWpCO3lCQUg3RCxFQUhIO3FCQUpEO2lCQURLLENBRGIsQ0FERDs7QUFrQkMsMkJBQVcsU0FBUyxTQUFULENBbEJaOztBQW9CQyxvQkFDSSxZQUNHLFNBQVMsV0FBVCxJQUNBLFNBQVMsV0FBVCxDQUFxQixJQUFyQixLQUE4QixlQUE5QixJQUNBLFNBQVMsV0FBVCxDQUFxQixJQUFyQixLQUE4QixRQUE5QixFQUNMLEVBTEYsTUFNSztBQUNELCtCQUFXLEtBQVgsQ0FEQztpQkFOTDthQXBCSixRQTZCUyxRQTdCVCxFQU5vQjs7QUFzQ3BCLGtCQUFNLFNBQU4sQ0FBZ0IsV0FBaEIsR0FBOEIsR0FBOUIsQ0F0Q29COztBQXdDcEIsZUFBRyxHQUFILENBQU8sZ0JBQVAsRUFBeUI7QUFDckIsMkJBQVcsTUFBTSxJQUFOO0FBQ1gsMEJBQVUsR0FBVjthQUZKLEVBeENvQjs7OztXQWhDUCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKHdpbmRvdywgdW5kZWZpbmVkKSB7dmFyIG9ic2VydmFibGUgPSBmdW5jdGlvbihlbCkge1xuXG4gIC8qKlxuICAgKiBFeHRlbmQgdGhlIG9yaWdpbmFsIG9iamVjdCBvciBjcmVhdGUgYSBuZXcgZW1wdHkgb25lXG4gICAqIEB0eXBlIHsgT2JqZWN0IH1cbiAgICovXG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIHZhcmlhYmxlcyBhbmQgbWV0aG9kc1xuICAgKi9cbiAgdmFyIGNhbGxiYWNrcyA9IHt9LFxuICAgIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxuICAgIG9uRWFjaEV2ZW50ID0gZnVuY3Rpb24oZSwgZm4pIHsgZS5yZXBsYWNlKC9cXFMrL2csIGZuKSB9XG5cbiAgLy8gZXh0ZW5kIHRoZSBvYmplY3QgYWRkaW5nIHRoZSBvYnNlcnZhYmxlIG1ldGhvZHNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWwsIHtcbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZCBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGVhY2ggdGltZSBhbiBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAgICogQHBhcmFtICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBpZiAodHlwZW9mIGZuICE9ICdmdW5jdGlvbicpICByZXR1cm4gZWxcblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcykge1xuICAgICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9mZjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PSAnKicgJiYgIWZuKSBjYWxsYmFja3MgPSB7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2IgPT0gZm4pIGFyci5zcGxpY2UoaS0tLCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgZGVsZXRlIGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgYXQgbW9zdCBvbmNlXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb25lOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgICAgICBlbC5vZmYoZXZlbnRzLCBvbilcbiAgICAgICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbC5vbihldmVudHMsIG9uKVxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIHRyaWdnZXI6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMpIHtcblxuICAgICAgICAvLyBnZXR0aW5nIHRoZSBhcmd1bWVudHNcbiAgICAgICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxLFxuICAgICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkoYXJnbGVuKSxcbiAgICAgICAgICBmbnNcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ2xlbjsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV0gLy8gc2tpcCBmaXJzdCBhcmd1bWVudFxuICAgICAgICB9XG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lKSB7XG5cbiAgICAgICAgICBmbnMgPSBzbGljZS5jYWxsKGNhbGxiYWNrc1tuYW1lXSB8fCBbXSwgMClcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBmbjsgZm4gPSBmbnNbaV07ICsraSkge1xuICAgICAgICAgICAgaWYgKGZuLmJ1c3kpIHJldHVyblxuICAgICAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgICAgIGZuLmFwcGx5KGVsLCBmbi50eXBlZCA/IFtuYW1lXS5jb25jYXQoYXJncykgOiBhcmdzKVxuICAgICAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgICAgIGZuLmJ1c3kgPSAwXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrc1snKiddICYmIG5hbWUgIT0gJyonKVxuICAgICAgICAgICAgZWwudHJpZ2dlci5hcHBseShlbCwgWycqJywgbmFtZV0uY29uY2F0KGFyZ3MpKVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBlbFxuXG59XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgICBtb2R1bGUuZXhwb3J0cyA9IG9ic2VydmFibGVcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIG9ic2VydmFibGUgfSlcbiAgZWxzZVxuICAgIHdpbmRvdy5vYnNlcnZhYmxlID0gb2JzZXJ2YWJsZVxuXG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkKTsiLCJpbXBvcnQgQ2hhbWJyIGZyb20gJy4vV29ya2VyLmVzNidcbmltcG9ydCBPYnNlcnZhYmxlIGZyb20gJ3Jpb3Qtb2JzZXJ2YWJsZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZWxBYnN0cmFjdCB7XG5cbiAgICBzZXQgbW9kZWxEYXRhKG8pe1xuICAgICAgICB0aGlzLl9kYXRhID0gb1xuICAgIH1cblxuICAgIGdldCBtb2RlbERhdGEoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEgfHwge31cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBPYnNlcnZhYmxlKHRoaXMpXG4gICAgICAgIHRoaXMub24oJyonLCAobmFtZSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgbGV0IG9uVHJpZ2dlcnMgPSB0aGlzLl9vblRyaWdnZXJFdmVudEhhbmRsZXJzW25hbWVdXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXVxuICAgICAgICAgICAgb25UcmlnZ2VycyAmJiBvblRyaWdnZXJzLmZvckVhY2gobWV0aG9kID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcCA9IHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIG5hbWUsIGRhdGEpXG4gICAgICAgICAgICAgICAgcC50aGVuICYmIHByb21pc2VzLnB1c2gocClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChwcm9taXNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0KG5hbWUsIGRhdGEsIGZhbHNlKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyb2FkY2FzdChuYW1lLCBkYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGJyb2FkY2FzdChuYW1lLCBkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gdHJ1ZSl7XG4gICAgICAgIENoYW1ici5SZXNvbHZlKGBDaGFtYnItPiR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfS0+RXZlbnRgLCAtMSwgdGhpcy5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQodGhpcyksIGRhdGEsIHNvZnQsIG5hbWUpXG4gICAgfVxuXG4gICAgcmVzb2x2ZShkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gZmFsc2UsIHN0YXRlID0gJ3Jlc29sdmUnKXtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7ZGF0YSwgc29mdCwgc3RhdGV9KVxuICAgIH1cblxuICAgIHJlamVjdChkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gdHJ1ZSwgc3RhdGUgPSAncmVqZWN0Jyl7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7ZGF0YSwgc29mdCwgc3RhdGV9KVxuICAgIH1cblxufSIsImltcG9ydCBNb2RlbEFic3RyYWN0IGZyb20gJy4vTW9kZWxBYnN0cmFjdC5lczYnXG5cbmNvbnN0IE1PREVMX0xJQlJBUlkgPSB7fVxuY29uc3QgTU9ERUxfSU5TVEFOQ0VTID0ge31cblxudmFyIEhXID0gdW5kZWZpbmVkXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW1iciB7XG5cbiAgICBjb25zdHJ1Y3RvcihIaWdod2F5SW5zdGFuY2Upe1xuICAgICAgICBIVyA9IEhpZ2h3YXlJbnN0YW5jZVxuICAgICAgICBIVy5zdWIoJ0NoYW1icicsIGZ1bmN0aW9uKENoYW1ickV2ZW50KXtcbiAgICAgICAgICAgIGxldCBldiAgICAgID0gQ2hhbWJyRXZlbnQuZGF0YVxuICAgICAgICAgICAgbGV0IHJvdXRlICAgPSBDaGFtYnJFdmVudC5uYW1lLnNwbGl0KCctPicpXG4gICAgICAgICAgICBsZXQgYXJnTGlzdCA9IE9iamVjdC52YWx1ZXMoZXYuYXJnTGlzdClcbiAgICAgICAgICAgIGxldCBpc0NvbnN0cnVjdG9yID0gcm91dGVbMl0gPT09ICdjb25zdHJ1Y3RvcidcbiAgICAgICAgICAgIGxldCBtb2RlbCAgID0gQ2hhbWJyLmdldE1vZGVsKHJvdXRlWzFdLCBpc0NvbnN0cnVjdG9yID8gYXJnTGlzdCA6IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGxldCBtZXRob2QgID0gbW9kZWwgPyBtb2RlbFtyb3V0ZVsyXV0gOiBmYWxzZVxuICAgICAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIENoYW1ici5SZXNvbHZlKENoYW1ickV2ZW50Lm5hbWUsIGV2LnJlcXVlc3RJZCwgbW9kZWwubW9kZWxEYXRhLCB7fSwge30sIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgciA9IG1ldGhvZC5hcHBseShtb2RlbCwgYXJnTGlzdClcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByLnRoZW4obyA9PiBDaGFtYnIuUmVzb2x2ZShDaGFtYnJFdmVudC5uYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIG8uZGF0YSwgby5zb2Z0LCBvLnN0YXRlKSlcbiAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChvID0+IENoYW1ici5SZWplY3QoQ2hhbWJyRXZlbnQubmFtZSwgZXYucmVxdWVzdElkLCBtb2RlbC5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQobW9kZWwpLCBvLmRhdGEsIG8uc29mdCwgby5zdGF0ZSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBDaGFtYnIuUmVzb2x2ZShDaGFtYnJFdmVudC5uYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIHIsIHRydWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgTW9kZWwoKXtcbiAgICAgICAgcmV0dXJuIE1vZGVsQWJzdHJhY3RcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0IE1vZGVsKG1vZGVsKSB7XG4gICAgICAgIE1PREVMX0xJQlJBUllbbW9kZWwubmFtZV0gPSBtb2RlbFxuXG4gICAgICAgIGxldCBhcGkgPSBbXVxuICAgICAgICBsZXQgdG1wTW9kZWwgPSBtb2RlbC5wcm90b3R5cGVcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0bXBNb2RlbClcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuZmluZEluZGV4KHYgPT4gdi5uYW1lID09PSBwcm9wKSA9PT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHByb3AgIT09ICdjb25zdHJ1Y3RvcidcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHByb3AuY2hhckF0KDApICE9PSAnXydcbiAgICAgICAgICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0bXBNb2RlbCwgcHJvcClcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHByb3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVzY3JpcHRvci5nZXQgPyAndmFyJyA6ICdmbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdG9yczogZGVzY3JpcHRvci5nZXQgPyBkZXNjcmlwdG9yLmdldC5kZWNvcmF0b3JzIDogZGVzY3JpcHRvci52YWx1ZS5kZWNvcmF0b3JzXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdG1wTW9kZWwgPSB0bXBNb2RlbC5fX3Byb3RvX19cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRtcE1vZGVsXG4gICAgICAgICAgICAgICAgJiYgdG1wTW9kZWwuY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICAmJiB0bXBNb2RlbC5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnTW9kZWxBYnN0cmFjdCdcbiAgICAgICAgICAgICAgICAmJiB0bXBNb2RlbC5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnT2JqZWN0J1xuICAgICAgICAgICAgKSB7fVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdG1wTW9kZWwgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICh0bXBNb2RlbClcblxuXG4gICAgICAgIG1vZGVsLnByb3RvdHlwZS5fZXhwb3NlZEFwaSA9IGFwaVxuXG4gICAgICAgIEhXLnB1YignQ2hhbWJyLT5FeHBvc2UnLCB7XG4gICAgICAgICAgICBtb2RlbE5hbWU6IG1vZGVsLm5hbWUsXG4gICAgICAgICAgICBtb2RlbEFwaTogYXBpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGdldE1vZGVsKG1vZGVsTmFtZSwgYXJnTGlzdCA9IFtdKXtcbiAgICAgICAgbGV0IG1vZGVsID0gTU9ERUxfSU5TVEFOQ0VTW21vZGVsTmFtZV1cbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgbW9kZWwgPSBNT0RFTF9JTlNUQU5DRVNbbW9kZWxOYW1lXSA9IG5ldyBNT0RFTF9MSUJSQVJZW21vZGVsTmFtZV0oLi4uYXJnTGlzdClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9kZWxcbiAgICB9XG5cbiAgICBzdGF0aWMgUmVzb2x2ZShldmVudE5hbWUsIHJlc3BvbnNlSWQsIG1vZGVsRGF0YSwgbW9kZWxFeHBvcnQsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VTb2Z0LCByZXNwb25zZVN0YXRlID0gJ3Jlc29sdmUnKXtcbiAgICAgICAgSFcucHViKGV2ZW50TmFtZSwge1xuICAgICAgICAgICAgcmVzcG9uc2VJZCxcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSxcbiAgICAgICAgICAgIHJlc3BvbnNlU29mdCxcbiAgICAgICAgICAgIHJlc3BvbnNlU3RhdGUsXG4gICAgICAgICAgICBtb2RlbERhdGEsXG4gICAgICAgICAgICBtb2RlbEV4cG9ydFxuICAgICAgICB9LCAncmVzb2x2ZScpXG4gICAgfVxuXG4gICAgc3RhdGljIFJlamVjdChldmVudE5hbWUsIHJlc3BvbnNlSWQsIG1vZGVsRGF0YSwgbW9kZWxFeHBvcnQsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VTb2Z0LCByZXNwb25zZVN0YXRlID0gJ3JlamVjdCcpIHtcbiAgICAgICAgSFcucHViKGV2ZW50TmFtZSwge1xuICAgICAgICAgICAgcmVzcG9uc2VJZCxcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSxcbiAgICAgICAgICAgIHJlc3BvbnNlU29mdCxcbiAgICAgICAgICAgIHJlc3BvbnNlU3RhdGUsXG4gICAgICAgICAgICBtb2RlbERhdGEsXG4gICAgICAgICAgICBtb2RlbEV4cG9ydFxuICAgICAgICB9LCAncmVqZWN0JylcbiAgICB9XG5cbiAgICBzdGF0aWMgRXhwb3J0KG1vZGVsKXtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSB7fVxuICAgICAgICBtb2RlbC5fZXhwb3NlZEFwaS5mb3JFYWNoKGFwaURhdGEgPT4ge1xuICAgICAgICAgICAgYXBpRGF0YS50eXBlID09PSAndmFyJyAmJiAocmVzdWx0c1thcGlEYXRhLm5hbWVdID0gbW9kZWxbYXBpRGF0YS5uYW1lXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG59Il19
