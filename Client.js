(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChambrClient = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
            console.info('Chambr: Incoming expose', exposeEvent);
            var exposeData = exposeEvent.data;
            var model = _this.$[exposeData.modelName] = _this.applyApi(exposeData);

            HW.sub('ChambrClient->' + exposeData.modelName, function (modelEvent) {
                var d = modelEvent.data;
                var responseState = d.responseState;
                var responseId = d.responseId;
                var responseData = d.responseData;
                var responseSoft = d.responseSoft;
                var modelData = d.modelData;
                var modelExport = d.modelExport;

                if ((typeof modelData === 'undefined' ? 'undefined' : _typeof(modelData)) === 'object') {
                    for (var k in model) {
                        if (model.hasOwnProperty(k)) delete model[k];
                    }_extends(model, modelData);
                }

                if (responseState && responseId) {
                    var methods = _this._promises[responseId];
                    methods && methods[modelEvent.state].call(null, responseData !== undefined ? responseData : modelData);
                    delete _this._promises[responseId];
                }

                for (var name in modelExport) {
                    // No has own prop check needed!
                    model[name] = modelExport[name];
                }

                model.trigger(modelEvent.name, modelEvent.data);
                model.trigger(modelEvent.state, modelEvent.data);
                model.trigger(responseSoft ? 'soft' : 'hard', d);
                !responseSoft && model.trigger('updated', d);
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

            for (var decorator in apiData.decorators) {
                if (!apiData.decorators.hasOwnProperty(decorator)) continue;
                var descriptor = apiData.decorators[decorator];
                switch (decorator) {
                    case 'default':
                        value = descriptor;
                        break;
                    case 'peel':
                        var old = value;
                        var peelList = descriptor.list;
                        eval('value = ' + descriptor.fn);
                        break;
                    default:
                        break;
                }
            }

            return value;
        }
    }]);

    return Chambr;
}();

exports.default = Chambr;

},{"riot-observable":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcQ2xpZW50LmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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LENBVGlCO2lCQUFwQixDQURlO2FBQTNCOztBQWNBLGlCQUFLLElBQUksU0FBSixJQUFpQixRQUFRLFVBQVIsRUFBb0I7QUFDdEMsb0JBQUksQ0FBQyxRQUFRLFVBQVIsQ0FBbUIsY0FBbkIsQ0FBa0MsU0FBbEMsQ0FBRCxFQUErQyxTQUFuRDtBQUNBLG9CQUFJLGFBQWEsUUFBUSxVQUFSLENBQW1CLFNBQW5CLENBQWIsQ0FGa0M7QUFHdEMsd0JBQU8sU0FBUDtBQUNJLHlCQUFLLFNBQUw7QUFDSSxnQ0FBUSxVQUFSLENBREo7QUFFSSw4QkFGSjtBQURKLHlCQUlTLE1BQUw7QUFDSSw0QkFBSSxNQUFNLEtBQU4sQ0FEUjtBQUVJLDRCQUFJLFdBQVcsV0FBVyxJQUFYLENBRm5CO0FBR0ksMENBQWdCLFdBQVcsRUFBWCxDQUFoQixDQUhKO0FBSUksOEJBSko7QUFKSjtBQVNhLDhCQUFUO0FBVEosaUJBSHNDO2FBQTFDOztBQWdCQSxtQkFBTyxLQUFQLENBbkN3Qjs7OztXQS9FWCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCI7KGZ1bmN0aW9uKHdpbmRvdywgdW5kZWZpbmVkKSB7dmFyIG9ic2VydmFibGUgPSBmdW5jdGlvbihlbCkge1xuXG4gIC8qKlxuICAgKiBFeHRlbmQgdGhlIG9yaWdpbmFsIG9iamVjdCBvciBjcmVhdGUgYSBuZXcgZW1wdHkgb25lXG4gICAqIEB0eXBlIHsgT2JqZWN0IH1cbiAgICovXG5cbiAgZWwgPSBlbCB8fCB7fVxuXG4gIC8qKlxuICAgKiBQcml2YXRlIHZhcmlhYmxlc1xuICAgKi9cbiAgdmFyIGNhbGxiYWNrcyA9IHt9LFxuICAgIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlXG5cbiAgLyoqXG4gICAqIFByaXZhdGUgTWV0aG9kc1xuICAgKi9cblxuICAvKipcbiAgICogSGVscGVyIGZ1bmN0aW9uIG5lZWRlZCB0byBnZXQgYW5kIGxvb3AgYWxsIHRoZSBldmVudHMgaW4gYSBzdHJpbmdcbiAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGUgLSBldmVudCBzdHJpbmdcbiAgICogQHBhcmFtICAge0Z1bmN0aW9ufSAgIGZuIC0gY2FsbGJhY2tcbiAgICovXG4gIGZ1bmN0aW9uIG9uRWFjaEV2ZW50KGUsIGZuKSB7XG4gICAgdmFyIGVzID0gZS5zcGxpdCgnICcpLCBsID0gZXMubGVuZ3RoLCBpID0gMCwgbmFtZSwgaW5keFxuICAgIGZvciAoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBuYW1lID0gZXNbaV1cbiAgICAgIGluZHggPSBuYW1lLmluZGV4T2YoJy4nKVxuICAgICAgaWYgKG5hbWUpIGZuKCB+aW5keCA/IG5hbWUuc3Vic3RyaW5nKDAsIGluZHgpIDogbmFtZSwgaSwgfmluZHggPyBuYW1lLnNsaWNlKGluZHggKyAxKSA6IG51bGwpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFB1YmxpYyBBcGlcbiAgICovXG5cbiAgLy8gZXh0ZW5kIHRoZSBlbCBvYmplY3QgYWRkaW5nIHRoZSBvYnNlcnZhYmxlIG1ldGhvZHNcbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZWwsIHtcbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZFxuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgZWFjaCB0aW1lIGFuIGV2ZW50IGlzIHRyaWdnZXJlZC5cbiAgICAgKiBAcGFyYW0gIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb246IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZm4gIT0gJ2Z1bmN0aW9uJykgIHJldHVybiBlbFxuXG4gICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zLCBucykge1xuICAgICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICAgICAgZm4udHlwZWQgPSBwb3MgPiAwXG4gICAgICAgICAgZm4ubnMgPSBuc1xuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBsaXN0ZW5lcnNcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvZmY6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGlmIChldmVudHMgPT0gJyonICYmICFmbikgY2FsbGJhY2tzID0ge31cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MsIG5zKSB7XG4gICAgICAgICAgICBpZiAoZm4gfHwgbnMpIHtcbiAgICAgICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgY2I7IGNiID0gYXJyICYmIGFycltpXTsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNiID09IGZuIHx8IG5zICYmIGNiLm5zID09IG5zKSBhcnIuc3BsaWNlKGktLSwgMSlcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGRlbGV0ZSBjYWxsYmFja3NbbmFtZV1cbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZFxuICAgICAqIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgYXQgbW9zdCBvbmNlXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgb25lOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgICAgICBmdW5jdGlvbiBvbigpIHtcbiAgICAgICAgICBlbC5vZmYoZXZlbnRzLCBvbilcbiAgICAgICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbC5vbihldmVudHMsIG9uKVxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG9cbiAgICAgKiB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2BcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAgICovXG4gICAgdHJpZ2dlcjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cykge1xuXG4gICAgICAgIC8vIGdldHRpbmcgdGhlIGFyZ3VtZW50c1xuICAgICAgICB2YXIgYXJnbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDEsXG4gICAgICAgICAgYXJncyA9IG5ldyBBcnJheShhcmdsZW4pLFxuICAgICAgICAgIGZuc1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJnbGVuOyBpKyspIHtcbiAgICAgICAgICBhcmdzW2ldID0gYXJndW1lbnRzW2kgKyAxXSAvLyBza2lwIGZpcnN0IGFyZ3VtZW50XG4gICAgICAgIH1cblxuICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcywgbnMpIHtcblxuICAgICAgICAgIGZucyA9IHNsaWNlLmNhbGwoY2FsbGJhY2tzW25hbWVdIHx8IFtdLCAwKVxuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGZuOyBmbiA9IGZuc1tpXTsgKytpKSB7XG4gICAgICAgICAgICBpZiAoZm4uYnVzeSkgY29udGludWVcbiAgICAgICAgICAgIGZuLmJ1c3kgPSAxXG4gICAgICAgICAgICBpZiAoIW5zIHx8IGZuLm5zID09IG5zKSBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgICAgIGlmIChmbnNbaV0gIT09IGZuKSB7IGktLSB9XG4gICAgICAgICAgICBmbi5idXN5ID0gMFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjYWxsYmFja3NbJyonXSAmJiBuYW1lICE9ICcqJylcbiAgICAgICAgICAgIGVsLnRyaWdnZXIuYXBwbHkoZWwsIFsnKicsIG5hbWVdLmNvbmNhdChhcmdzKSlcblxuICAgICAgICB9KVxuXG4gICAgICAgIHJldHVybiBlbFxuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICAgIH1cbiAgfSlcblxuICByZXR1cm4gZWxcblxufVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAvLyBzdXBwb3J0IENvbW1vbkpTLCBBTUQgJiBicm93c2VyXG4gIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG4gICAgbW9kdWxlLmV4cG9ydHMgPSBvYnNlcnZhYmxlXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBvYnNlcnZhYmxlIH0pXG4gIGVsc2VcbiAgICB3aW5kb3cub2JzZXJ2YWJsZSA9IG9ic2VydmFibGVcblxufSkodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyA/IHdpbmRvdyA6IHVuZGVmaW5lZCk7IiwiaW1wb3J0IE9ic2VydmFibGUgZnJvbSAncmlvdC1vYnNlcnZhYmxlJ1xuXG52YXIgSFcgPSB1bmRlZmluZWRcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2hhbWJyIHtcblxuICAgIF9yZXF1ZXN0SWQgPSAwXG5cbiAgICBfcHJvbWlzZXMgPSB7fVxuXG4gICAgX2Jhc2tldCA9IHt9XG5cbiAgICBnZXQgSFcoKXtcbiAgICAgICAgcmV0dXJuIEhXXG4gICAgfVxuXG4gICAgZ2V0ICQoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Jhc2tldFxuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKEhpZ2h3YXlJbnN0YW5jZSl7XG4gICAgICAgIEhXID0gSGlnaHdheUluc3RhbmNlXG4gICAgICAgIEhXLnN1YignQ2hhbWJyQ2xpZW50LT5FeHBvc2UnLCBleHBvc2VFdmVudCA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8oJ0NoYW1icjogSW5jb21pbmcgZXhwb3NlJywgZXhwb3NlRXZlbnQpXG4gICAgICAgICAgICBsZXQgZXhwb3NlRGF0YSA9ICBleHBvc2VFdmVudC5kYXRhXG4gICAgICAgICAgICBsZXQgbW9kZWwgPSB0aGlzLiRbZXhwb3NlRGF0YS5tb2RlbE5hbWVdID0gdGhpcy5hcHBseUFwaShleHBvc2VEYXRhKVxuXG4gICAgICAgICAgICBIVy5zdWIoYENoYW1ickNsaWVudC0+JHtleHBvc2VEYXRhLm1vZGVsTmFtZX1gLCBtb2RlbEV2ZW50ID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgZCAgICAgICAgICAgICA9IG1vZGVsRXZlbnQuZGF0YVxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZVN0YXRlID0gZC5yZXNwb25zZVN0YXRlXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlSWQgICAgPSBkLnJlc3BvbnNlSWRcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VEYXRhICA9IGQucmVzcG9uc2VEYXRhXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlU29mdCAgPSBkLnJlc3BvbnNlU29mdFxuICAgICAgICAgICAgICAgIGxldCBtb2RlbERhdGEgICAgID0gZC5tb2RlbERhdGFcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWxFeHBvcnQgICA9IGQubW9kZWxFeHBvcnRcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbW9kZWxEYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBrIGluIG1vZGVsKVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG1vZGVsLmhhc093blByb3BlcnR5KGspKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBtb2RlbFtrXVxuXG4gICAgICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24obW9kZWwsIG1vZGVsRGF0YSlcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmVzcG9uc2VTdGF0ZSAmJiByZXNwb25zZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtZXRob2RzID0gdGhpcy5fcHJvbWlzZXNbcmVzcG9uc2VJZF1cbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kcyAmJiBtZXRob2RzW21vZGVsRXZlbnQuc3RhdGVdLmNhbGwobnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlRGF0YSAhPT0gdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyByZXNwb25zZURhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG1vZGVsRGF0YVxuICAgICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9wcm9taXNlc1tyZXNwb25zZUlkXVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gbW9kZWxFeHBvcnQpe1xuICAgICAgICAgICAgICAgICAgICAvLyBObyBoYXMgb3duIHByb3AgY2hlY2sgbmVlZGVkIVxuICAgICAgICAgICAgICAgICAgICBtb2RlbFtuYW1lXSA9IG1vZGVsRXhwb3J0W25hbWVdXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbW9kZWwudHJpZ2dlcihtb2RlbEV2ZW50Lm5hbWUsIG1vZGVsRXZlbnQuZGF0YSlcbiAgICAgICAgICAgICAgICBtb2RlbC50cmlnZ2VyKG1vZGVsRXZlbnQuc3RhdGUsIG1vZGVsRXZlbnQuZGF0YSlcbiAgICAgICAgICAgICAgICBtb2RlbC50cmlnZ2VyKHJlc3BvbnNlU29mdCA/ICdzb2Z0JyA6ICdoYXJkJywgZClcbiAgICAgICAgICAgICAgICAhcmVzcG9uc2VTb2Z0ICYmIG1vZGVsLnRyaWdnZXIoJ3VwZGF0ZWQnLCBkKVxuICAgICAgICAgICAgICAgIHJlc3BvbnNlU3RhdGUgJiYgbW9kZWwudHJpZ2dlcihyZXNwb25zZVN0YXRlLCBkKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICBhcHBseUFwaShleHBvc2VEYXRhKXtcbiAgICAgICAgbGV0IGQgPSB0aGlzLmFwcGx5QXBpVmFsdWUoZXhwb3NlRGF0YS5tb2RlbE5hbWUsIHtcbiAgICAgICAgICAgIG5hbWU6ICdjb25zdHJ1Y3RvcicsXG4gICAgICAgICAgICB0eXBlOiAnZm4nXG4gICAgICAgIH0pXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZCwgZXhwb3NlRGF0YS5tb2RlbERhdGEpXG4gICAgICAgIGV4cG9zZURhdGEubW9kZWxBcGkuZm9yRWFjaChhcGlEYXRhID0+IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkLCBhcGlEYXRhLm5hbWUsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICB2YWx1ZTogdGhpcy5hcHBseUFwaVZhbHVlKGV4cG9zZURhdGEubW9kZWxOYW1lLCBhcGlEYXRhKVxuICAgICAgICB9KSlcbiAgICAgICAgcmV0dXJuIE9ic2VydmFibGUoZClcbiAgICB9XG5cbiAgICBhcHBseUFwaVZhbHVlKG5hbWUsIGFwaURhdGEpe1xuICAgICAgICBsZXQgdGhhdCA9IHRoaXNcbiAgICAgICAgbGV0IG1ldGhvZCA9IGFwaURhdGEubmFtZVxuICAgICAgICBsZXQgdmFsdWUgPSB1bmRlZmluZWRcblxuICAgICAgICBpZiAoYXBpRGF0YS50eXBlID09PSAnZm4nKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGZ1bmN0aW9uKC4uLmFyZ0xpc3Qpe1xuICAgICAgICAgICAgICAgIHRoaXMgJiYgdGhpcy50cmlnZ2VyICYmIHRoaXMudHJpZ2dlcihtZXRob2QpXG4gICAgICAgICAgICAgICAgbGV0IHAgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuX3Byb21pc2VzWysrdGhhdC5fcmVxdWVzdElkXSA9IHsgcmVzb2x2ZSwgcmVqZWN0IH1cbiAgICAgICAgICAgICAgICAgICAgSFcucHViKGBDaGFtYnJXb3JrZXItPiR7bmFtZX0tPiR7bWV0aG9kfWAsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyZ0xpc3Q6IFtdLnNsaWNlLmNhbGwoYXJnTGlzdCwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICByZXF1ZXN0SWQ6IHRoYXQuX3JlcXVlc3RJZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgcmV0dXJuIChtZXRob2QgPT09ICdjb25zdHJ1Y3RvcicpID8gdGhhdC5fYmFza2V0W25hbWVdIDogcFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgZGVjb3JhdG9yIGluIGFwaURhdGEuZGVjb3JhdG9ycykge1xuICAgICAgICAgICAgaWYgKCFhcGlEYXRhLmRlY29yYXRvcnMuaGFzT3duUHJvcGVydHkoZGVjb3JhdG9yKSkgY29udGludWU7XG4gICAgICAgICAgICBsZXQgZGVzY3JpcHRvciA9IGFwaURhdGEuZGVjb3JhdG9yc1tkZWNvcmF0b3JdXG4gICAgICAgICAgICBzd2l0Y2goZGVjb3JhdG9yKXtcbiAgICAgICAgICAgICAgICBjYXNlICdkZWZhdWx0JzpcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBkZXNjcmlwdG9yXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3BlZWwnOlxuICAgICAgICAgICAgICAgICAgICBsZXQgb2xkID0gdmFsdWVcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBlZWxMaXN0ID0gZGVzY3JpcHRvci5saXN0XG4gICAgICAgICAgICAgICAgICAgIGV2YWwoYHZhbHVlID0gJHtkZXNjcmlwdG9yLmZufWApXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHZhbHVlXG4gICAgfVxufSJdfQ==
