(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChambrWorker = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
;(function(window, undefined) {var observable = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {}

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice

  /**
   * Private Methods
   */

  /**
   * Helper function needed to get and loop all the events in a string
   * @param   { String }   e - event string
   * @param   {Function}   fn - callback
   */
  function onEachEvent(e, fn) {
    var es = e.split(' '), l = es.length, i = 0, name, indx
    for (; i < l; i++) {
      name = es[i]
      indx = name.indexOf('.')
      if (name) fn( ~indx ? name.substring(0, indx) : name, i, ~indx ? name.slice(indx + 1) : null)
    }
  }

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given space separated list of `events` and
     * execute the `callback` each time an event is triggered.
     * @param  { String } events - events ids
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(events, fn) {
        if (typeof fn != 'function')  return el

        onEachEvent(events, function(name, pos, ns) {
          (callbacks[name] = callbacks[name] || []).push(fn)
          fn.typed = pos > 0
          fn.ns = ns
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
          onEachEvent(events, function(name, pos, ns) {
            if (fn || ns) {
              var arr = callbacks[name]
              for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                if (cb == fn || ns && cb.ns == ns) arr.splice(i--, 1)
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
     * Listen to the given space separated list of `events` and
     * execute the `callback` at most once
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
     * Execute all callback functions that listen to
     * the given space separated list of `events`
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

        onEachEvent(events, function(name, pos, ns) {

          fns = slice.call(callbacks[name] || [], 0)

          for (var i = 0, fn; fn = fns[i]; ++i) {
            if (fn.busy) continue
            fn.busy = 1
            if (!ns || fn.ns == ns) fn.apply(el, fn.typed ? [name].concat(args) : args)
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
            var onTriggers = _this._onTriggerEventHandlers ? _this._onTriggerEventHandlers[name] : false;
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

/** @type {Highway} */
var HW = undefined;

var Chambr = function () {

    /**
     * 
        * @param HighwayInstance {Highway}
        */

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

    /** @returns {ModelAbstract} */


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
        }

        /**
         * @param model {ModelAbstract}
         */
        ,
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

},{"./ModelAbstract.es6":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcTW9kZWxBYnN0cmFjdC5lczYiLCJzcmNcXFdvcmtlci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiOyhmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge3ZhciBvYnNlcnZhYmxlID0gZnVuY3Rpb24oZWwpIHtcblxuICAvKipcbiAgICogRXh0ZW5kIHRoZSBvcmlnaW5hbCBvYmplY3Qgb3IgY3JlYXRlIGEgbmV3IGVtcHR5IG9uZVxuICAgKiBAdHlwZSB7IE9iamVjdCB9XG4gICAqL1xuXG4gIGVsID0gZWwgfHwge31cblxuICAvKipcbiAgICogUHJpdmF0ZSB2YXJpYWJsZXNcbiAgICovXG4gIHZhciBjYWxsYmFja3MgPSB7fSxcbiAgICBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIE1ldGhvZHNcbiAgICovXG5cbiAgLyoqXG4gICAqIEhlbHBlciBmdW5jdGlvbiBuZWVkZWQgdG8gZ2V0IGFuZCBsb29wIGFsbCB0aGUgZXZlbnRzIGluIGEgc3RyaW5nXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBlIC0gZXZlbnQgc3RyaW5nXG4gICAqIEBwYXJhbSAgIHtGdW5jdGlvbn0gICBmbiAtIGNhbGxiYWNrXG4gICAqL1xuICBmdW5jdGlvbiBvbkVhY2hFdmVudChlLCBmbikge1xuICAgIHZhciBlcyA9IGUuc3BsaXQoJyAnKSwgbCA9IGVzLmxlbmd0aCwgaSA9IDAsIG5hbWUsIGluZHhcbiAgICBmb3IgKDsgaSA8IGw7IGkrKykge1xuICAgICAgbmFtZSA9IGVzW2ldXG4gICAgICBpbmR4ID0gbmFtZS5pbmRleE9mKCcuJylcbiAgICAgIGlmIChuYW1lKSBmbiggfmluZHggPyBuYW1lLnN1YnN0cmluZygwLCBpbmR4KSA6IG5hbWUsIGksIH5pbmR4ID8gbmFtZS5zbGljZShpbmR4ICsgMSkgOiBudWxsKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBQdWJsaWMgQXBpXG4gICAqL1xuXG4gIC8vIGV4dGVuZCB0aGUgZWwgb2JqZWN0IGFkZGluZyB0aGUgb2JzZXJ2YWJsZSBtZXRob2RzXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGVsLCB7XG4gICAgLyoqXG4gICAgICogTGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBhbmRcbiAgICAgKiBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGVhY2ggdGltZSBhbiBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAgICogQHBhcmFtICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBpZiAodHlwZW9mIGZuICE9ICdmdW5jdGlvbicpICByZXR1cm4gZWxcblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcywgbnMpIHtcbiAgICAgICAgICAoY2FsbGJhY2tzW25hbWVdID0gY2FsbGJhY2tzW25hbWVdIHx8IFtdKS5wdXNoKGZuKVxuICAgICAgICAgIGZuLnR5cGVkID0gcG9zID4gMFxuICAgICAgICAgIGZuLm5zID0gbnNcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgbGlzdGVuZXJzXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb2ZmOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBpZiAoZXZlbnRzID09ICcqJyAmJiAhZm4pIGNhbGxiYWNrcyA9IHt9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zLCBucykge1xuICAgICAgICAgICAgaWYgKGZuIHx8IG5zKSB7XG4gICAgICAgICAgICAgIHZhciBhcnIgPSBjYWxsYmFja3NbbmFtZV1cbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGNiOyBjYiA9IGFyciAmJiBhcnJbaV07ICsraSkge1xuICAgICAgICAgICAgICAgIGlmIChjYiA9PSBmbiB8fCBucyAmJiBjYi5ucyA9PSBucykgYXJyLnNwbGljZShpLS0sIDEpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBkZWxldGUgY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBhbmRcbiAgICAgKiBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGF0IG1vc3Qgb25jZVxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9uZToge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgZnVuY3Rpb24gb24oKSB7XG4gICAgICAgICAgZWwub2ZmKGV2ZW50cywgb24pXG4gICAgICAgICAgZm4uYXBwbHkoZWwsIGFyZ3VtZW50cylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWwub24oZXZlbnRzLCBvbilcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogRXhlY3V0ZSBhbGwgY2FsbGJhY2sgZnVuY3Rpb25zIHRoYXQgbGlzdGVuIHRvXG4gICAgICogdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIHRyaWdnZXI6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMpIHtcblxuICAgICAgICAvLyBnZXR0aW5nIHRoZSBhcmd1bWVudHNcbiAgICAgICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxLFxuICAgICAgICAgIGFyZ3MgPSBuZXcgQXJyYXkoYXJnbGVuKSxcbiAgICAgICAgICBmbnNcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ2xlbjsgaSsrKSB7XG4gICAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV0gLy8gc2tpcCBmaXJzdCBhcmd1bWVudFxuICAgICAgICB9XG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MsIG5zKSB7XG5cbiAgICAgICAgICBmbnMgPSBzbGljZS5jYWxsKGNhbGxiYWNrc1tuYW1lXSB8fCBbXSwgMClcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBmbjsgZm4gPSBmbnNbaV07ICsraSkge1xuICAgICAgICAgICAgaWYgKGZuLmJ1c3kpIGNvbnRpbnVlXG4gICAgICAgICAgICBmbi5idXN5ID0gMVxuICAgICAgICAgICAgaWYgKCFucyB8fCBmbi5ucyA9PSBucykgZm4uYXBwbHkoZWwsIGZuLnR5cGVkID8gW25hbWVdLmNvbmNhdChhcmdzKSA6IGFyZ3MpXG4gICAgICAgICAgICBpZiAoZm5zW2ldICE9PSBmbikgeyBpLS0gfVxuICAgICAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2FsbGJhY2tzWycqJ10gJiYgbmFtZSAhPSAnKicpXG4gICAgICAgICAgICBlbC50cmlnZ2VyLmFwcGx5KGVsLCBbJyonLCBuYW1lXS5jb25jYXQoYXJncykpXG5cbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gZWxcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIGVsXG5cbn1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgLy8gc3VwcG9ydCBDb21tb25KUywgQU1EICYgYnJvd3NlclxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICAgIG1vZHVsZS5leHBvcnRzID0gb2JzZXJ2YWJsZVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JzZXJ2YWJsZSB9KVxuICBlbHNlXG4gICAgd2luZG93Lm9ic2VydmFibGUgPSBvYnNlcnZhYmxlXG5cbn0pKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQpOyIsImltcG9ydCBDaGFtYnIgZnJvbSAnLi9Xb3JrZXIuZXM2J1xuaW1wb3J0IE9ic2VydmFibGUgZnJvbSAncmlvdC1vYnNlcnZhYmxlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNb2RlbEFic3RyYWN0IHtcblxuICAgIHNldCBtb2RlbERhdGEobyl7XG4gICAgICAgIHRoaXMuX2RhdGEgPSBvXG4gICAgfVxuXG4gICAgZ2V0IG1vZGVsRGF0YSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGF0YSB8fCB7fVxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIE9ic2VydmFibGUodGhpcylcbiAgICAgICAgdGhpcy5vbignKicsIChuYW1lLCBkYXRhKSA9PiB7XG4gICAgICAgICAgICBsZXQgb25UcmlnZ2VycyA9IHRoaXMuX29uVHJpZ2dlckV2ZW50SGFuZGxlcnMgPyB0aGlzLl9vblRyaWdnZXJFdmVudEhhbmRsZXJzW25hbWVdIDogZmFsc2VcbiAgICAgICAgICAgIGxldCBwcm9taXNlcyA9IFtdXG4gICAgICAgICAgICBvblRyaWdnZXJzICYmIG9uVHJpZ2dlcnMuZm9yRWFjaChtZXRob2QgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwID0gdGhpc1ttZXRob2RdLmNhbGwodGhpcywgbmFtZSwgZGF0YSlcbiAgICAgICAgICAgICAgICBwLnRoZW4gJiYgcHJvbWlzZXMucHVzaChwKVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgaWYgKHByb21pc2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VzKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5icm9hZGNhc3QobmFtZSwgZGF0YSwgZmFsc2UpXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0KG5hbWUsIGRhdGEpXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYnJvYWRjYXN0KG5hbWUsIGRhdGEgPSB1bmRlZmluZWQsIHNvZnQgPSB0cnVlKXtcbiAgICAgICAgQ2hhbWJyLlJlc29sdmUoYENoYW1ici0+JHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9LT5FdmVudGAsIC0xLCB0aGlzLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydCh0aGlzKSwgZGF0YSwgc29mdCwgbmFtZSlcbiAgICB9XG5cbiAgICByZXNvbHZlKGRhdGEgPSB1bmRlZmluZWQsIHNvZnQgPSBmYWxzZSwgc3RhdGUgPSAncmVzb2x2ZScpe1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtkYXRhLCBzb2Z0LCBzdGF0ZX0pXG4gICAgfVxuXG4gICAgcmVqZWN0KGRhdGEgPSB1bmRlZmluZWQsIHNvZnQgPSB0cnVlLCBzdGF0ZSA9ICdyZWplY3QnKXtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHtkYXRhLCBzb2Z0LCBzdGF0ZX0pXG4gICAgfVxuXG59IiwiaW1wb3J0IE1vZGVsQWJzdHJhY3QgZnJvbSAnLi9Nb2RlbEFic3RyYWN0LmVzNidcblxuY29uc3QgTU9ERUxfTElCUkFSWSA9IHt9XG5jb25zdCBNT0RFTF9JTlNUQU5DRVMgPSB7fVxuXG4vKiogQHR5cGUge0hpZ2h3YXl9ICovXG52YXIgSFcgPSB1bmRlZmluZWRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbWJyIHtcblxuXHQvKipcblx0ICogXG4gICAgICogQHBhcmFtIEhpZ2h3YXlJbnN0YW5jZSB7SGlnaHdheX1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihIaWdod2F5SW5zdGFuY2Upe1xuICAgICAgICBIVyA9IEhpZ2h3YXlJbnN0YW5jZVxuICAgICAgICBIVy5zdWIoJ0NoYW1icicsIGZ1bmN0aW9uKENoYW1ickV2ZW50KXtcbiAgICAgICAgICAgIGxldCBldiAgICAgID0gQ2hhbWJyRXZlbnQuZGF0YVxuICAgICAgICAgICAgbGV0IHJvdXRlICAgPSBDaGFtYnJFdmVudC5uYW1lLnNwbGl0KCctPicpXG4gICAgICAgICAgICBsZXQgYXJnTGlzdCA9IE9iamVjdC52YWx1ZXMoZXYuYXJnTGlzdClcbiAgICAgICAgICAgIGxldCBpc0NvbnN0cnVjdG9yID0gcm91dGVbMl0gPT09ICdjb25zdHJ1Y3RvcidcbiAgICAgICAgICAgIGxldCBtb2RlbCAgID0gQ2hhbWJyLmdldE1vZGVsKHJvdXRlWzFdLCBpc0NvbnN0cnVjdG9yID8gYXJnTGlzdCA6IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGxldCBtZXRob2QgID0gbW9kZWwgPyBtb2RlbFtyb3V0ZVsyXV0gOiBmYWxzZVxuICAgICAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIENoYW1ici5SZXNvbHZlKENoYW1ickV2ZW50Lm5hbWUsIGV2LnJlcXVlc3RJZCwgbW9kZWwubW9kZWxEYXRhLCB7fSwge30sIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgciA9IG1ldGhvZC5hcHBseShtb2RlbCwgYXJnTGlzdClcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByLnRoZW4obyA9PiBDaGFtYnIuUmVzb2x2ZShDaGFtYnJFdmVudC5uYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIG8uZGF0YSwgby5zb2Z0LCBvLnN0YXRlKSlcbiAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChvID0+IENoYW1ici5SZWplY3QoQ2hhbWJyRXZlbnQubmFtZSwgZXYucmVxdWVzdElkLCBtb2RlbC5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQobW9kZWwpLCBvLmRhdGEsIG8uc29mdCwgby5zdGF0ZSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBDaGFtYnIuUmVzb2x2ZShDaGFtYnJFdmVudC5uYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIHIsIHRydWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKiBAcmV0dXJucyB7TW9kZWxBYnN0cmFjdH0gKi9cbiAgICBzdGF0aWMgZ2V0IE1vZGVsKCl7XG4gICAgICAgIHJldHVybiBNb2RlbEFic3RyYWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIG1vZGVsIHtNb2RlbEFic3RyYWN0fVxuICAgICAqL1xuICAgIHN0YXRpYyBzZXQgTW9kZWwobW9kZWwpIHtcbiAgICAgICAgTU9ERUxfTElCUkFSWVttb2RlbC5uYW1lXSA9IG1vZGVsXG5cbiAgICAgICAgbGV0IGFwaSA9IFtdXG4gICAgICAgIGxldCB0bXBNb2RlbCA9IG1vZGVsLnByb3RvdHlwZVxuXG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRtcE1vZGVsKVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKChwcm9wKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5maW5kSW5kZXgodiA9PiB2Lm5hbWUgPT09IHByb3ApID09PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgJiYgcHJvcCAhPT0gJ2NvbnN0cnVjdG9yJ1xuICAgICAgICAgICAgICAgICAgICAgICAgJiYgcHJvcC5jaGFyQXQoMCkgIT09ICdfJ1xuICAgICAgICAgICAgICAgICAgICApe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRtcE1vZGVsLCBwcm9wKVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogcHJvcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBkZXNjcmlwdG9yLmdldCA/ICd2YXInIDogJ2ZuJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWNvcmF0b3JzOiBkZXNjcmlwdG9yLmdldCA/IGRlc2NyaXB0b3IuZ2V0LmRlY29yYXRvcnMgOiBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnNcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICB0bXBNb2RlbCA9IHRtcE1vZGVsLl9fcHJvdG9fX1xuXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdG1wTW9kZWxcbiAgICAgICAgICAgICAgICAmJiB0bXBNb2RlbC5jb25zdHJ1Y3RvclxuICAgICAgICAgICAgICAgICYmIHRtcE1vZGVsLmNvbnN0cnVjdG9yLm5hbWUgIT09ICdNb2RlbEFic3RyYWN0J1xuICAgICAgICAgICAgICAgICYmIHRtcE1vZGVsLmNvbnN0cnVjdG9yLm5hbWUgIT09ICdPYmplY3QnXG4gICAgICAgICAgICApIHt9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0bXBNb2RlbCA9IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKHRtcE1vZGVsKVxuXG5cbiAgICAgICAgbW9kZWwucHJvdG90eXBlLl9leHBvc2VkQXBpID0gYXBpXG5cbiAgICAgICAgSFcucHViKCdDaGFtYnItPkV4cG9zZScsIHtcbiAgICAgICAgICAgIG1vZGVsTmFtZTogbW9kZWwubmFtZSxcbiAgICAgICAgICAgIG1vZGVsQXBpOiBhcGlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0TW9kZWwobW9kZWxOYW1lLCBhcmdMaXN0ID0gW10pe1xuICAgICAgICBsZXQgbW9kZWwgPSBNT0RFTF9JTlNUQU5DRVNbbW9kZWxOYW1lXVxuICAgICAgICBpZiAoIW1vZGVsKSB7XG4gICAgICAgICAgICBtb2RlbCA9IE1PREVMX0lOU1RBTkNFU1ttb2RlbE5hbWVdID0gbmV3IE1PREVMX0xJQlJBUllbbW9kZWxOYW1lXSguLi5hcmdMaXN0KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtb2RlbFxuICAgIH1cblxuICAgIHN0YXRpYyBSZXNvbHZlKGV2ZW50TmFtZSwgcmVzcG9uc2VJZCwgbW9kZWxEYXRhLCBtb2RlbEV4cG9ydCwgcmVzcG9uc2VEYXRhLCByZXNwb25zZVNvZnQsIHJlc3BvbnNlU3RhdGUgPSAncmVzb2x2ZScpe1xuICAgICAgICBIVy5wdWIoZXZlbnROYW1lLCB7XG4gICAgICAgICAgICByZXNwb25zZUlkLFxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhLFxuICAgICAgICAgICAgcmVzcG9uc2VTb2Z0LFxuICAgICAgICAgICAgcmVzcG9uc2VTdGF0ZSxcbiAgICAgICAgICAgIG1vZGVsRGF0YSxcbiAgICAgICAgICAgIG1vZGVsRXhwb3J0XG4gICAgICAgIH0sICdyZXNvbHZlJylcbiAgICB9XG5cbiAgICBzdGF0aWMgUmVqZWN0KGV2ZW50TmFtZSwgcmVzcG9uc2VJZCwgbW9kZWxEYXRhLCBtb2RlbEV4cG9ydCwgcmVzcG9uc2VEYXRhLCByZXNwb25zZVNvZnQsIHJlc3BvbnNlU3RhdGUgPSAncmVqZWN0Jykge1xuICAgICAgICBIVy5wdWIoZXZlbnROYW1lLCB7XG4gICAgICAgICAgICByZXNwb25zZUlkLFxuICAgICAgICAgICAgcmVzcG9uc2VEYXRhLFxuICAgICAgICAgICAgcmVzcG9uc2VTb2Z0LFxuICAgICAgICAgICAgcmVzcG9uc2VTdGF0ZSxcbiAgICAgICAgICAgIG1vZGVsRGF0YSxcbiAgICAgICAgICAgIG1vZGVsRXhwb3J0XG4gICAgICAgIH0sICdyZWplY3QnKVxuICAgIH1cblxuICAgIHN0YXRpYyBFeHBvcnQobW9kZWwpe1xuICAgICAgICBsZXQgcmVzdWx0cyA9IHt9XG4gICAgICAgIG1vZGVsLl9leHBvc2VkQXBpLmZvckVhY2goYXBpRGF0YSA9PiB7XG4gICAgICAgICAgICBhcGlEYXRhLnR5cGUgPT09ICd2YXInICYmIChyZXN1bHRzW2FwaURhdGEubmFtZV0gPSBtb2RlbFthcGlEYXRhLm5hbWVdKVxuICAgICAgICB9KVxuICAgICAgICByZXR1cm4gcmVzdWx0c1xuICAgIH1cbn0iXX0=
