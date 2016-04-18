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
        HW.sub('Chambr->Expose', function (exposeEvent) {
            ci('Chambr: Incoming expose', exposeEvent);
            var exposeData = exposeEvent.data;
            var model = _this.$[exposeData.modelName] = _this.applyApi(exposeData);

            HW.sub('Chambr->' + exposeData.modelName, function (modelEvent) {
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
                    }Object.assign(model, modelData);
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
            Object.assign(d, exposeData.modelData);
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
                        HW.pub('Chambr->' + name + '->' + method, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcQ2xpZW50LmVzNiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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TCxDQUFhLElBQWIsQ0FBN0IsR0FBa0QsQ0FBbEQsQ0FUaUI7aUJBQXBCLENBRGU7YUFBM0I7O0FBY0EsaUJBQUssSUFBSSxTQUFKLElBQWlCLFFBQVEsVUFBUixFQUFvQjtBQUN0QyxvQkFBSSxDQUFDLFFBQVEsVUFBUixDQUFtQixjQUFuQixDQUFrQyxTQUFsQyxDQUFELEVBQStDLFNBQW5EO0FBQ0Esb0JBQUksYUFBYSxRQUFRLFVBQVIsQ0FBbUIsU0FBbkIsQ0FBYixDQUZrQztBQUd0Qyx3QkFBTyxTQUFQO0FBQ0kseUJBQUssU0FBTDtBQUNJLGdDQUFRLFVBQVIsQ0FESjtBQUVJLDhCQUZKO0FBREoseUJBSVMsTUFBTDtBQUNJLDRCQUFJLE1BQU0sS0FBTixDQURSO0FBRUksNEJBQUksV0FBVyxXQUFXLElBQVgsQ0FGbkI7QUFHSSwwQ0FBZ0IsV0FBVyxFQUFYLENBQWhCLENBSEo7QUFJSSw4QkFKSjtBQUpKO0FBU2EsOEJBQVQ7QUFUSixpQkFIc0M7YUFBMUM7O0FBZ0JBLG1CQUFPLEtBQVAsQ0FuQ3dCOzs7O1dBL0VYIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24od2luZG93LCB1bmRlZmluZWQpIHt2YXIgb2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgLyoqXG4gICAqIEV4dGVuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IG9yIGNyZWF0ZSBhIG5ldyBlbXB0eSBvbmVcbiAgICogQHR5cGUgeyBPYmplY3QgfVxuICAgKi9cblxuICBlbCA9IGVsIHx8IHt9XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgdmFyaWFibGVzXG4gICAqL1xuICB2YXIgY2FsbGJhY2tzID0ge30sXG4gICAgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcblxuICAvKipcbiAgICogUHJpdmF0ZSBNZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gbmVlZGVkIHRvIGdldCBhbmQgbG9vcCBhbGwgdGhlIGV2ZW50cyBpbiBhIHN0cmluZ1xuICAgKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgZSAtIGV2ZW50IHN0cmluZ1xuICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICAgZm4gLSBjYWxsYmFja1xuICAgKi9cbiAgZnVuY3Rpb24gb25FYWNoRXZlbnQoZSwgZm4pIHtcbiAgICB2YXIgZXMgPSBlLnNwbGl0KCcgJyksIGwgPSBlcy5sZW5ndGgsIGkgPSAwLCBuYW1lLCBpbmR4XG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5hbWUgPSBlc1tpXVxuICAgICAgaW5keCA9IG5hbWUuaW5kZXhPZignLicpXG4gICAgICBpZiAobmFtZSkgZm4oIH5pbmR4ID8gbmFtZS5zdWJzdHJpbmcoMCwgaW5keCkgOiBuYW1lLCBpLCB+aW5keCA/IG5hbWUuc2xpY2UoaW5keCArIDEpIDogbnVsbClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIEFwaVxuICAgKi9cblxuICAvLyBleHRlbmQgdGhlIGVsIG9iamVjdCBhZGRpbmcgdGhlIG9ic2VydmFibGUgbWV0aG9kc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlbCwge1xuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kXG4gICAgICogZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBlYWNoIHRpbWUgYW4gZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgICAqIEBwYXJhbSAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvbjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiAhPSAnZnVuY3Rpb24nKSAgcmV0dXJuIGVsXG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MsIG5zKSB7XG4gICAgICAgICAgKGNhbGxiYWNrc1tuYW1lXSA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXSkucHVzaChmbilcbiAgICAgICAgICBmbi50eXBlZCA9IHBvcyA+IDBcbiAgICAgICAgICBmbi5ucyA9IG5zXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9mZjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PSAnKicgJiYgIWZuKSBjYWxsYmFja3MgPSB7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcywgbnMpIHtcbiAgICAgICAgICAgIGlmIChmbiB8fCBucykge1xuICAgICAgICAgICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2IgPT0gZm4gfHwgbnMgJiYgY2IubnMgPT0gbnMpIGFyci5zcGxpY2UoaS0tLCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgZGVsZXRlIGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kXG4gICAgICogZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBhdCBtb3N0IG9uY2VcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvbmU6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uKCkge1xuICAgICAgICAgIGVsLm9mZihldmVudHMsIG9uKVxuICAgICAgICAgIGZuLmFwcGx5KGVsLCBhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsLm9uKGV2ZW50cywgb24pXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYWxsIGNhbGxiYWNrIGZ1bmN0aW9ucyB0aGF0IGxpc3RlbiB0b1xuICAgICAqIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYFxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICB0cmlnZ2VyOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzKSB7XG5cbiAgICAgICAgLy8gZ2V0dGluZyB0aGUgYXJndW1lbnRzXG4gICAgICAgIHZhciBhcmdsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMSxcbiAgICAgICAgICBhcmdzID0gbmV3IEFycmF5KGFyZ2xlbiksXG4gICAgICAgICAgZm5zXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdsZW47IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdIC8vIHNraXAgZmlyc3QgYXJndW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zLCBucykge1xuXG4gICAgICAgICAgZm5zID0gc2xpY2UuY2FsbChjYWxsYmFja3NbbmFtZV0gfHwgW10sIDApXG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgZm47IGZuID0gZm5zW2ldOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChmbi5idXN5KSBjb250aW51ZVxuICAgICAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgICAgIGlmICghbnMgfHwgZm4ubnMgPT0gbnMpIGZuLmFwcGx5KGVsLCBmbi50eXBlZCA/IFtuYW1lXS5jb25jYXQoYXJncykgOiBhcmdzKVxuICAgICAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgICAgIGZuLmJ1c3kgPSAwXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrc1snKiddICYmIG5hbWUgIT0gJyonKVxuICAgICAgICAgICAgZWwudHJpZ2dlci5hcHBseShlbCwgWycqJywgbmFtZV0uY29uY2F0KGFyZ3MpKVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBlbFxuXG59XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgICBtb2R1bGUuZXhwb3J0cyA9IG9ic2VydmFibGVcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIG9ic2VydmFibGUgfSlcbiAgZWxzZVxuICAgIHdpbmRvdy5vYnNlcnZhYmxlID0gb2JzZXJ2YWJsZVxuXG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkKTsiLCJpbXBvcnQgT2JzZXJ2YWJsZSBmcm9tICdyaW90LW9ic2VydmFibGUnXG5cbnZhciBIVyA9IHVuZGVmaW5lZFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDaGFtYnIge1xuXG4gICAgX3JlcXVlc3RJZCA9IDBcblxuICAgIF9wcm9taXNlcyA9IHt9XG5cbiAgICBfYmFza2V0ID0ge31cblxuICAgIGdldCBIVygpe1xuICAgICAgICByZXR1cm4gSFdcbiAgICB9XG5cbiAgICBnZXQgJCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fYmFza2V0XG4gICAgfVxuXG4gICAgY29uc3RydWN0b3IoSGlnaHdheUluc3RhbmNlKXtcbiAgICAgICAgSFcgPSBIaWdod2F5SW5zdGFuY2VcbiAgICAgICAgSFcuc3ViKCdDaGFtYnItPkV4cG9zZScsIGV4cG9zZUV2ZW50ID0+IHtcbiAgICAgICAgICAgIGNpKCdDaGFtYnI6IEluY29taW5nIGV4cG9zZScsIGV4cG9zZUV2ZW50KVxuICAgICAgICAgICAgbGV0IGV4cG9zZURhdGEgPSAgZXhwb3NlRXZlbnQuZGF0YVxuICAgICAgICAgICAgbGV0IG1vZGVsID0gdGhpcy4kW2V4cG9zZURhdGEubW9kZWxOYW1lXSA9IHRoaXMuYXBwbHlBcGkoZXhwb3NlRGF0YSlcblxuICAgICAgICAgICAgSFcuc3ViKGBDaGFtYnItPiR7ZXhwb3NlRGF0YS5tb2RlbE5hbWV9YCwgbW9kZWxFdmVudCA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IGQgICAgICAgICAgICAgPSBtb2RlbEV2ZW50LmRhdGFcbiAgICAgICAgICAgICAgICBsZXQgcmVzcG9uc2VTdGF0ZSA9IGQucmVzcG9uc2VTdGF0ZVxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZUlkICAgID0gZC5yZXNwb25zZUlkXG4gICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlRGF0YSAgPSBkLnJlc3BvbnNlRGF0YVxuICAgICAgICAgICAgICAgIGxldCByZXNwb25zZVNvZnQgID0gZC5yZXNwb25zZVNvZnRcbiAgICAgICAgICAgICAgICBsZXQgbW9kZWxEYXRhICAgICA9IGQubW9kZWxEYXRhXG4gICAgICAgICAgICAgICAgbGV0IG1vZGVsRXhwb3J0ICAgPSBkLm1vZGVsRXhwb3J0XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG1vZGVsRGF0YSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiBtb2RlbClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtb2RlbC5oYXNPd25Qcm9wZXJ0eShrKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgbW9kZWxba11cblxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKG1vZGVsLCBtb2RlbERhdGEpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlU3RhdGUgJiYgcmVzcG9uc2VJZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgbWV0aG9kcyA9IHRoaXMuX3Byb21pc2VzW3Jlc3BvbnNlSWRdXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZHMgJiYgbWV0aG9kc1ttb2RlbEV2ZW50LnN0YXRlXS5jYWxsKG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZURhdGEgIT09IHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gcmVzcG9uc2VEYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBtb2RlbERhdGFcbiAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJvbWlzZXNbcmVzcG9uc2VJZF1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIG1vZGVsRXhwb3J0KXtcbiAgICAgICAgICAgICAgICAgICAgLy8gTm8gaGFzIG93biBwcm9wIGNoZWNrIG5lZWRlZCFcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxbbmFtZV0gPSBtb2RlbEV4cG9ydFtuYW1lXVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIG1vZGVsLnRyaWdnZXIobW9kZWxFdmVudC5uYW1lLCBtb2RlbEV2ZW50LmRhdGEpXG4gICAgICAgICAgICAgICAgbW9kZWwudHJpZ2dlcihtb2RlbEV2ZW50LnN0YXRlLCBtb2RlbEV2ZW50LmRhdGEpXG4gICAgICAgICAgICAgICAgbW9kZWwudHJpZ2dlcihyZXNwb25zZVNvZnQgPyAnc29mdCcgOiAnaGFyZCcsIGQpXG4gICAgICAgICAgICAgICAgIXJlc3BvbnNlU29mdCAmJiBtb2RlbC50cmlnZ2VyKCd1cGRhdGVkJywgZClcbiAgICAgICAgICAgICAgICByZXNwb25zZVN0YXRlICYmIG1vZGVsLnRyaWdnZXIocmVzcG9uc2VTdGF0ZSwgZClcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgYXBwbHlBcGkoZXhwb3NlRGF0YSl7XG4gICAgICAgIGxldCBkID0gdGhpcy5hcHBseUFwaVZhbHVlKGV4cG9zZURhdGEubW9kZWxOYW1lLCB7XG4gICAgICAgICAgICBuYW1lOiAnY29uc3RydWN0b3InLFxuICAgICAgICAgICAgdHlwZTogJ2ZuJ1xuICAgICAgICB9KVxuICAgICAgICBPYmplY3QuYXNzaWduKGQsIGV4cG9zZURhdGEubW9kZWxEYXRhKVxuICAgICAgICBleHBvc2VEYXRhLm1vZGVsQXBpLmZvckVhY2goYXBpRGF0YSA9PiBPYmplY3QuZGVmaW5lUHJvcGVydHkoZCwgYXBpRGF0YS5uYW1lLCB7XG4gICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICAgICAgdmFsdWU6IHRoaXMuYXBwbHlBcGlWYWx1ZShleHBvc2VEYXRhLm1vZGVsTmFtZSwgYXBpRGF0YSlcbiAgICAgICAgfSkpXG4gICAgICAgIHJldHVybiBPYnNlcnZhYmxlKGQpXG4gICAgfVxuXG4gICAgYXBwbHlBcGlWYWx1ZShuYW1lLCBhcGlEYXRhKXtcbiAgICAgICAgbGV0IHRoYXQgPSB0aGlzXG4gICAgICAgIGxldCBtZXRob2QgPSBhcGlEYXRhLm5hbWVcbiAgICAgICAgbGV0IHZhbHVlID0gdW5kZWZpbmVkXG5cbiAgICAgICAgaWYgKGFwaURhdGEudHlwZSA9PT0gJ2ZuJykge1xuICAgICAgICAgICAgdmFsdWUgPSBmdW5jdGlvbiguLi5hcmdMaXN0KXtcbiAgICAgICAgICAgICAgICB0aGlzICYmIHRoaXMudHJpZ2dlciAmJiB0aGlzLnRyaWdnZXIobWV0aG9kKVxuICAgICAgICAgICAgICAgIGxldCBwID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICB0aGF0Ll9wcm9taXNlc1srK3RoYXQuX3JlcXVlc3RJZF0gPSB7IHJlc29sdmUsIHJlamVjdCB9XG4gICAgICAgICAgICAgICAgICAgIEhXLnB1YihgQ2hhbWJyLT4ke25hbWV9LT4ke21ldGhvZH1gLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcmdMaXN0OiBbXS5zbGljZS5jYWxsKGFyZ0xpc3QsIDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdElkOiB0aGF0Ll9yZXF1ZXN0SWRcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIHJldHVybiAobWV0aG9kID09PSAnY29uc3RydWN0b3InKSA/IHRoYXQuX2Jhc2tldFtuYW1lXSA6IHBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGRlY29yYXRvciBpbiBhcGlEYXRhLmRlY29yYXRvcnMpIHtcbiAgICAgICAgICAgIGlmICghYXBpRGF0YS5kZWNvcmF0b3JzLmhhc093blByb3BlcnR5KGRlY29yYXRvcikpIGNvbnRpbnVlO1xuICAgICAgICAgICAgbGV0IGRlc2NyaXB0b3IgPSBhcGlEYXRhLmRlY29yYXRvcnNbZGVjb3JhdG9yXVxuICAgICAgICAgICAgc3dpdGNoKGRlY29yYXRvcil7XG4gICAgICAgICAgICAgICAgY2FzZSAnZGVmYXVsdCc6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZGVzY3JpcHRvclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdwZWVsJzpcbiAgICAgICAgICAgICAgICAgICAgbGV0IG9sZCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIGxldCBwZWVsTGlzdCA9IGRlc2NyaXB0b3IubGlzdFxuICAgICAgICAgICAgICAgICAgICBldmFsKGB2YWx1ZSA9ICR7ZGVzY3JpcHRvci5mbn1gKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OiBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZVxuICAgIH1cbn0iXX0=
