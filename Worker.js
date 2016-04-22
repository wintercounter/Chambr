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

            _Worker2.default.Resolve('ChambrClient->' + this.constructor.name + '->Event', -1, this.modelData, _Worker2.default.Export(this), data, soft, name);
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
        HW.sub('ChambrWorker', function (ChambrEvent) {
            var ev = ChambrEvent.data;
            var route = ChambrEvent.name.split('->');
            var argList = Object.values(ev.argList);
            var isConstructor = route[2] === 'constructor';
            var model = Chambr.getModel(route[1], isConstructor ? argList : undefined);
            var method = model ? model[route[2]] : false;
            var responseEventName = ChambrEvent.name.replace('ChambrWorker', 'ChambrClient');
            if (method) {
                if (isConstructor) {
                    Chambr.Resolve(responseEventName, ev.requestId, model.modelData, {}, {}, true);
                    return;
                }
                var r = method.apply(model, argList);
                try {
                    r.then(function (o) {
                        return Chambr.Resolve(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state);
                    }).catch(function (o) {
                        return Chambr.Reject(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state);
                    });
                } catch (e) {
                    Chambr.Resolve(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), r, true);
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
            var api = [];
            var tmpModel = model.prototype;
            var modelName = extractFunctionName(model);
            MODEL_LIBRARY[modelName] = model;

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

                if (tmpModel && tmpModel.constructor && extractFunctionName(tmpModel.constructor) !== 'ModelAbstract' && extractFunctionName(tmpModel.constructor) !== 'Object') {} else {
                    tmpModel = false;
                }
            } while (tmpModel);

            model.prototype._exposedApi = api;

            HW.pub('ChambrClient->Expose', {
                modelName: modelName,
                modelApi: api
            });
        }
    }]);

    return Chambr;
}();

exports.default = Chambr;


function extractFunctionName(fn) {
    return fn.toString().match(/function\W+([\w$_]+?)\(/)[1];
}

},{"./ModelAbstract.es6":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcTW9kZWxBYnN0cmFjdC5lczYiLCJzcmNcXFdvcmtlci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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RGdCO0FBRTNCLDBCQUFVO0FBRmlCLGFBQS9CO0FBSUg7OztXQXBGZ0IsTTs7O2tCQUFBLE07OztBQTZIckIsU0FBUyxtQkFBVCxDQUE2QixFQUE3QixFQUFnQztBQUM1QixXQUFPLEdBQUcsUUFBSCxHQUFjLEtBQWQsQ0FBb0IseUJBQXBCLEVBQStDLENBQS9DLENBQVA7QUFDSCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKHdpbmRvdywgdW5kZWZpbmVkKSB7dmFyIG9ic2VydmFibGUgPSBmdW5jdGlvbihlbCkge1xuXG4gIC8qKlxuICAgKiBFeHRlbmQgdGhlIG9yaWdpbmFsIG9iamVjdCBvciBjcmVhdGUgYSBuZXcgZW1wdHkgb25lXG4gICAqIEB0eXBlIHsgT2JqZWN0IH1cbiAgICovXG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIHZhcmlhYmxlc1xuICAgKi9cbiAgdmFyIGNhbGxiYWNrcyA9IHt9LFxuICAgIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG5cbiAgLyoqXG4gICAqIFByaXZhdGUgTWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIG5lZWRlZCB0byBnZXQgYW5kIGxvb3AgYWxsIHRoZSBldmVudHMgaW4gYSBzdHJpbmdcbiAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGUgLSBldmVudCBzdHJpbmdcbiAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgIGZuIC0gY2FsbGJhY2tcbiAgICovXG4gIGZ1bmN0aW9uIG9uRWFjaEV2ZW50KGUsIGZuKSB7XG4gICAgdmFyIGVzID0gZS5zcGxpdCgnICcpLCBsID0gZXMubGVuZ3RoLCBpID0gMCwgbmFtZSwgaW5keFxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBuYW1lID0gZXNbaV1cbiAgICAgIGluZHggPSBuYW1lLmluZGV4T2YoJy4nKVxuICAgICAgaWYgKG5hbWUpIGZuKCB+aW5keCA/IG5hbWUuc3Vic3RyaW5nKDAsIGluZHgpIDogbmFtZSwgaSwgfmluZHggPyBuYW1lLnNsaWNlKGluZHggKyAxKSA6IG51bGwpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBBcGlcbiAgICovXG5cbiAgLy8gZXh0ZW5kIHRoZSBlbCBvYmplY3QgYWRkaW5nIHRoZSBvYnNlcnZhYmxlIG1ldGhvZHNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWwsIHtcbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZFxuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgZWFjaCB0aW1lIGFuIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICAgKiBAcGFyYW0gIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb246IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm4gIT0gJ2Z1bmN0aW9uJykgIHJldHVybiBlbFxuXG4gICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zLCBucykge1xuICAgICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICAgICAgZm4ubnMgPSBuc1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvZmY6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGlmIChldmVudHMgPT0gJyonICYmICFmbikgY2FsbGJhY2tzID0ge31cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MsIG5zKSB7XG4gICAgICAgICAgICBpZiAoZm4gfHwgbnMpIHtcbiAgICAgICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgY2I7IGNiID0gYXJyICYmIGFycltpXTsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNiID09IGZuIHx8IG5zICYmIGNiLm5zID09IG5zKSBhcnIuc3BsaWNlKGktLSwgMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGRlbGV0ZSBjYWxsYmFja3NbbmFtZV1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZFxuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgYXQgbW9zdCBvbmNlXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb25lOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgICAgICBlbC5vZmYoZXZlbnRzLCBvbilcbiAgICAgICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbC5vbihldmVudHMsIG9uKVxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG9cbiAgICAgKiB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2BcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgdHJpZ2dlcjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cykge1xuXG4gICAgICAgIC8vIGdldHRpbmcgdGhlIGFyZ3VtZW50c1xuICAgICAgICB2YXIgYXJnbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDEsXG4gICAgICAgICAgYXJncyA9IG5ldyBBcnJheShhcmdsZW4pLFxuICAgICAgICAgIGZuc1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJnbGVuOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXSAvLyBza2lwIGZpcnN0IGFyZ3VtZW50XG4gICAgICAgIH1cblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcywgbnMpIHtcblxuICAgICAgICAgIGZucyA9IHNsaWNlLmNhbGwoY2FsbGJhY2tzW25hbWVdIHx8IFtdLCAwKVxuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGZuOyBmbiA9IGZuc1tpXTsgKytpKSB7XG4gICAgICAgICAgICBpZiAoZm4uYnVzeSkgY29udGludWVcbiAgICAgICAgICAgIGZuLmJ1c3kgPSAxXG4gICAgICAgICAgICBpZiAoIW5zIHx8IGZuLm5zID09IG5zKSBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgICAgIGlmIChmbnNbaV0gIT09IGZuKSB7IGktLSB9XG4gICAgICAgICAgICBmbi5idXN5ID0gMFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjYWxsYmFja3NbJyonXSAmJiBuYW1lICE9ICcqJylcbiAgICAgICAgICAgIGVsLnRyaWdnZXIuYXBwbHkoZWwsIFsnKicsIG5hbWVdLmNvbmNhdChhcmdzKSlcblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gZWxcblxufVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAvLyBzdXBwb3J0IENvbW1vbkpTLCBBTUQgJiBicm93c2VyXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBvYnNlcnZhYmxlXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBvYnNlcnZhYmxlIH0pXG4gIGVsc2VcbiAgICB3aW5kb3cub2JzZXJ2YWJsZSA9IG9ic2VydmFibGVcblxufSkodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZCk7IiwiaW1wb3J0IENoYW1iciBmcm9tICcuL1dvcmtlci5lczYnXG5pbXBvcnQgT2JzZXJ2YWJsZSBmcm9tICdyaW90LW9ic2VydmFibGUnXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1vZGVsQWJzdHJhY3Qge1xuXG4gICAgc2V0IG1vZGVsRGF0YShvKXtcbiAgICAgICAgdGhpcy5fZGF0YSA9IG9cbiAgICB9XG5cbiAgICBnZXQgbW9kZWxEYXRhKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kYXRhIHx8IHt9XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgT2JzZXJ2YWJsZSh0aGlzKVxuICAgICAgICB0aGlzLm9uKCcqJywgKG5hbWUsIGRhdGEpID0+IHtcbiAgICAgICAgICAgIGxldCBvblRyaWdnZXJzID0gdGhpcy5fb25UcmlnZ2VyRXZlbnRIYW5kbGVycyA/IHRoaXMuX29uVHJpZ2dlckV2ZW50SGFuZGxlcnNbbmFtZV0gOiBmYWxzZVxuICAgICAgICAgICAgbGV0IHByb21pc2VzID0gW11cbiAgICAgICAgICAgIG9uVHJpZ2dlcnMgJiYgb25UcmlnZ2Vycy5mb3JFYWNoKG1ldGhvZCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHAgPSB0aGlzW21ldGhvZF0uY2FsbCh0aGlzLCBuYW1lLCBkYXRhKVxuICAgICAgICAgICAgICAgIHAudGhlbiAmJiBwcm9taXNlcy5wdXNoKHApXG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBpZiAocHJvbWlzZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZXMpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJyb2FkY2FzdChuYW1lLCBkYXRhLCBmYWxzZSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5icm9hZGNhc3QobmFtZSwgZGF0YSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBicm9hZGNhc3QobmFtZSwgZGF0YSA9IHVuZGVmaW5lZCwgc29mdCA9IHRydWUpe1xuICAgICAgICBDaGFtYnIuUmVzb2x2ZShgQ2hhbWJyQ2xpZW50LT4ke3RoaXMuY29uc3RydWN0b3IubmFtZX0tPkV2ZW50YCwgLTEsIHRoaXMubW9kZWxEYXRhLCBDaGFtYnIuRXhwb3J0KHRoaXMpLCBkYXRhLCBzb2Z0LCBuYW1lKVxuICAgIH1cblxuICAgIHJlc29sdmUoZGF0YSA9IHVuZGVmaW5lZCwgc29mdCA9IGZhbHNlLCBzdGF0ZSA9ICdyZXNvbHZlJyl7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe2RhdGEsIHNvZnQsIHN0YXRlfSlcbiAgICB9XG5cbiAgICByZWplY3QoZGF0YSA9IHVuZGVmaW5lZCwgc29mdCA9IHRydWUsIHN0YXRlID0gJ3JlamVjdCcpe1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3Qoe2RhdGEsIHNvZnQsIHN0YXRlfSlcbiAgICB9XG5cbn0iLCJpbXBvcnQgTW9kZWxBYnN0cmFjdCBmcm9tICcuL01vZGVsQWJzdHJhY3QuZXM2J1xuXG5jb25zdCBNT0RFTF9MSUJSQVJZID0ge31cbmNvbnN0IE1PREVMX0lOU1RBTkNFUyA9IHt9XG5cbi8qKiBAdHlwZSB7SGlnaHdheX0gKi9cbnZhciBIVyA9IHVuZGVmaW5lZFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFtYnIge1xuXG5cdC8qKlxuXHQgKiBcbiAgICAgKiBAcGFyYW0gSGlnaHdheUluc3RhbmNlIHtIaWdod2F5fVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKEhpZ2h3YXlJbnN0YW5jZSl7XG4gICAgICAgIEhXID0gSGlnaHdheUluc3RhbmNlXG4gICAgICAgIEhXLnN1YignQ2hhbWJyV29ya2VyJywgZnVuY3Rpb24oQ2hhbWJyRXZlbnQpe1xuICAgICAgICAgICAgbGV0IGV2ICAgICAgPSBDaGFtYnJFdmVudC5kYXRhXG4gICAgICAgICAgICBsZXQgcm91dGUgICA9IENoYW1ickV2ZW50Lm5hbWUuc3BsaXQoJy0+JylcbiAgICAgICAgICAgIGxldCBhcmdMaXN0ID0gT2JqZWN0LnZhbHVlcyhldi5hcmdMaXN0KVxuICAgICAgICAgICAgbGV0IGlzQ29uc3RydWN0b3IgPSByb3V0ZVsyXSA9PT0gJ2NvbnN0cnVjdG9yJ1xuICAgICAgICAgICAgbGV0IG1vZGVsICAgPSBDaGFtYnIuZ2V0TW9kZWwocm91dGVbMV0sIGlzQ29uc3RydWN0b3IgPyBhcmdMaXN0IDogdW5kZWZpbmVkKVxuICAgICAgICAgICAgbGV0IG1ldGhvZCAgPSBtb2RlbCA/IG1vZGVsW3JvdXRlWzJdXSA6IGZhbHNlXG4gICAgICAgICAgICBsZXQgcmVzcG9uc2VFdmVudE5hbWUgPSBDaGFtYnJFdmVudC5uYW1lLnJlcGxhY2UoJ0NoYW1icldvcmtlcicsICdDaGFtYnJDbGllbnQnKVxuICAgICAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIENoYW1ici5SZXNvbHZlKHJlc3BvbnNlRXZlbnROYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwge30sIHt9LCB0cnVlKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHIgPSBtZXRob2QuYXBwbHkobW9kZWwsIGFyZ0xpc3QpXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgci50aGVuKG8gPT4gQ2hhbWJyLlJlc29sdmUocmVzcG9uc2VFdmVudE5hbWUsIGV2LnJlcXVlc3RJZCwgbW9kZWwubW9kZWxEYXRhLCBDaGFtYnIuRXhwb3J0KG1vZGVsKSwgby5kYXRhLCBvLnNvZnQsIG8uc3RhdGUpKVxuICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKG8gPT4gQ2hhbWJyLlJlamVjdChyZXNwb25zZUV2ZW50TmFtZSwgZXYucmVxdWVzdElkLCBtb2RlbC5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQobW9kZWwpLCBvLmRhdGEsIG8uc29mdCwgby5zdGF0ZSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBDaGFtYnIuUmVzb2x2ZShyZXNwb25zZUV2ZW50TmFtZSwgZXYucmVxdWVzdElkLCBtb2RlbC5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQobW9kZWwpLCByLCB0cnVlKVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKiogQHJldHVybnMge01vZGVsQWJzdHJhY3R9ICovXG4gICAgc3RhdGljIGdldCBNb2RlbCgpe1xuICAgICAgICByZXR1cm4gTW9kZWxBYnN0cmFjdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtb2RlbCB7TW9kZWxBYnN0cmFjdH1cbiAgICAgKi9cbiAgICBzdGF0aWMgc2V0IE1vZGVsKG1vZGVsKSB7XG4gICAgICAgIGxldCBhcGkgPSBbXVxuICAgICAgICBsZXQgdG1wTW9kZWwgPSBtb2RlbC5wcm90b3R5cGVcbiAgICAgICAgbGV0IG1vZGVsTmFtZSA9IGV4dHJhY3RGdW5jdGlvbk5hbWUobW9kZWwpXG4gICAgICAgIE1PREVMX0xJQlJBUllbbW9kZWxOYW1lXSA9IG1vZGVsXG5cbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModG1wTW9kZWwpXG4gICAgICAgICAgICAgICAgLmZvckVhY2goKHByb3ApID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLmZpbmRJbmRleCh2ID0+IHYubmFtZSA9PT0gcHJvcCkgPT09IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBwcm9wICE9PSAnY29uc3RydWN0b3InXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBwcm9wLmNoYXJBdCgwKSAhPT0gJ18nXG4gICAgICAgICAgICAgICAgICAgICl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgZGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG1wTW9kZWwsIHByb3ApXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFwaS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBwcm9wLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IGRlc2NyaXB0b3IuZ2V0ID8gJ3ZhcicgOiAnZm4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlY29yYXRvcnM6IGRlc2NyaXB0b3IuZ2V0ID8gZGVzY3JpcHRvci5nZXQuZGVjb3JhdG9ycyA6IGRlc2NyaXB0b3IudmFsdWUuZGVjb3JhdG9yc1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHRtcE1vZGVsID0gdG1wTW9kZWwuX19wcm90b19fXG5cbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0bXBNb2RlbFxuICAgICAgICAgICAgICAgICYmIHRtcE1vZGVsLmNvbnN0cnVjdG9yXG4gICAgICAgICAgICAgICAgJiYgZXh0cmFjdEZ1bmN0aW9uTmFtZSh0bXBNb2RlbC5jb25zdHJ1Y3RvcikgIT09ICdNb2RlbEFic3RyYWN0J1xuICAgICAgICAgICAgICAgICYmIGV4dHJhY3RGdW5jdGlvbk5hbWUodG1wTW9kZWwuY29uc3RydWN0b3IpICE9PSAnT2JqZWN0J1xuICAgICAgICAgICAgKSB7fVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdG1wTW9kZWwgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICh0bXBNb2RlbClcblxuICAgICAgICBtb2RlbC5wcm90b3R5cGUuX2V4cG9zZWRBcGkgPSBhcGlcblxuICAgICAgICBIVy5wdWIoJ0NoYW1ickNsaWVudC0+RXhwb3NlJywge1xuICAgICAgICAgICAgbW9kZWxOYW1lOiBtb2RlbE5hbWUsXG4gICAgICAgICAgICBtb2RlbEFwaTogYXBpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGdldE1vZGVsKG1vZGVsTmFtZSwgYXJnTGlzdCA9IFtdKXtcbiAgICAgICAgbGV0IG1vZGVsID0gTU9ERUxfSU5TVEFOQ0VTW21vZGVsTmFtZV1cbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgbW9kZWwgPSBNT0RFTF9JTlNUQU5DRVNbbW9kZWxOYW1lXSA9IG5ldyBNT0RFTF9MSUJSQVJZW21vZGVsTmFtZV0oLi4uYXJnTGlzdClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9kZWxcbiAgICB9XG5cbiAgICBzdGF0aWMgUmVzb2x2ZShldmVudE5hbWUsIHJlc3BvbnNlSWQsIG1vZGVsRGF0YSwgbW9kZWxFeHBvcnQsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VTb2Z0LCByZXNwb25zZVN0YXRlID0gJ3Jlc29sdmUnKXtcbiAgICAgICAgSFcucHViKGV2ZW50TmFtZSwge1xuICAgICAgICAgICAgcmVzcG9uc2VJZCxcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSxcbiAgICAgICAgICAgIHJlc3BvbnNlU29mdCxcbiAgICAgICAgICAgIHJlc3BvbnNlU3RhdGUsXG4gICAgICAgICAgICBtb2RlbERhdGEsXG4gICAgICAgICAgICBtb2RlbEV4cG9ydFxuICAgICAgICB9LCAncmVzb2x2ZScpXG4gICAgfVxuXG4gICAgc3RhdGljIFJlamVjdChldmVudE5hbWUsIHJlc3BvbnNlSWQsIG1vZGVsRGF0YSwgbW9kZWxFeHBvcnQsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VTb2Z0LCByZXNwb25zZVN0YXRlID0gJ3JlamVjdCcpIHtcbiAgICAgICAgSFcucHViKGV2ZW50TmFtZSwge1xuICAgICAgICAgICAgcmVzcG9uc2VJZCxcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSxcbiAgICAgICAgICAgIHJlc3BvbnNlU29mdCxcbiAgICAgICAgICAgIHJlc3BvbnNlU3RhdGUsXG4gICAgICAgICAgICBtb2RlbERhdGEsXG4gICAgICAgICAgICBtb2RlbEV4cG9ydFxuICAgICAgICB9LCAncmVqZWN0JylcbiAgICB9XG5cbiAgICBzdGF0aWMgRXhwb3J0KG1vZGVsKXtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSB7fVxuICAgICAgICBtb2RlbC5fZXhwb3NlZEFwaS5mb3JFYWNoKGFwaURhdGEgPT4ge1xuICAgICAgICAgICAgYXBpRGF0YS50eXBlID09PSAndmFyJyAmJiAocmVzdWx0c1thcGlEYXRhLm5hbWVdID0gbW9kZWxbYXBpRGF0YS5uYW1lXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGV4dHJhY3RGdW5jdGlvbk5hbWUoZm4pe1xuICAgIHJldHVybiBmbi50b1N0cmluZygpLm1hdGNoKC9mdW5jdGlvblxcVysoW1xcdyRfXSs/KVxcKC8pWzFdXG59XG4iXX0=
