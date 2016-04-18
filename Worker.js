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

},{"./ModelAbstract.es6":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyIsInNyY1xcTW9kZWxBYnN0cmFjdC5lczYiLCJzcmNcXFdvcmtlci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUksV0FBVyxNQUFNLFNBQU4sQ0FKSzs7QUFNcEIsZUFBRztBQUNDLHVCQUFPLG1CQUFQLENBQTJCLFFBQTNCLEVBQ0ssT0FETCxDQUNhLFVBQUMsSUFBRCxFQUFVO0FBQ2Ysd0JBQ0ksSUFBSSxTQUFKLENBQWM7K0JBQUssRUFBRSxJQUFGLEtBQVcsSUFBWDtxQkFBTCxDQUFkLEtBQXdDLENBQUMsQ0FBRCxJQUNyQyxTQUFTLGFBQVQsSUFDQSxLQUFLLE1BQUwsQ0FBWSxDQUFaLE1BQW1CLEdBQW5CLEVBQ047QUFDRyw0QkFBSSxhQUFhLE9BQU8sd0JBQVAsQ0FBZ0MsUUFBaEMsRUFBMEMsSUFBMUMsQ0FBYixDQURQOztBQUdHLDRCQUFJLElBQUosQ0FBUztBQUNMLGtDQUFNLElBQU47QUFDQSxrQ0FBTSxXQUFXLEdBQVgsR0FBaUIsS0FBakIsR0FBeUIsSUFBekI7QUFDTix3Q0FBWSxXQUFXLEdBQVgsR0FBaUIsV0FBVyxHQUFYLENBQWUsVUFBZixHQUE0QixXQUFXLEtBQVgsQ0FBaUIsVUFBakI7eUJBSDdELEVBSEg7cUJBSkQ7aUJBREssQ0FEYixDQUREOztBQWtCQywyQkFBVyxTQUFTLFNBQVQsQ0FsQlo7O0FBb0JDLG9CQUNJLFlBQ0csU0FBUyxXQUFULElBQ0EsU0FBUyxXQUFULENBQXFCLElBQXJCLEtBQThCLGVBQTlCLElBQ0EsU0FBUyxXQUFULENBQXFCLElBQXJCLEtBQThCLFFBQTlCLEVBQ0wsRUFMRixNQU1LO0FBQ0QsK0JBQVcsS0FBWCxDQURDO2lCQU5MO2FBcEJKLFFBNkJTLFFBN0JULEVBTm9COztBQXNDcEIsa0JBQU0sU0FBTixDQUFnQixXQUFoQixHQUE4QixHQUE5QixDQXRDb0I7O0FBd0NwQixlQUFHLEdBQUgsQ0FBTyxnQkFBUCxFQUF5QjtBQUNyQiwyQkFBVyxNQUFNLElBQU47QUFDWCwwQkFBVSxHQUFWO2FBRkosRUF4Q29COzs7O1dBaENQIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIjsoZnVuY3Rpb24od2luZG93LCB1bmRlZmluZWQpIHt2YXIgb2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgLyoqXG4gICAqIEV4dGVuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IG9yIGNyZWF0ZSBhIG5ldyBlbXB0eSBvbmVcbiAgICogQHR5cGUgeyBPYmplY3QgfVxuICAgKi9cblxuICBlbCA9IGVsIHx8IHt9XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgdmFyaWFibGVzXG4gICAqL1xuICB2YXIgY2FsbGJhY2tzID0ge30sXG4gICAgc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2VcblxuICAvKipcbiAgICogUHJpdmF0ZSBNZXRob2RzXG4gICAqL1xuXG4gIC8qKlxuICAgKiBIZWxwZXIgZnVuY3Rpb24gbmVlZGVkIHRvIGdldCBhbmQgbG9vcCBhbGwgdGhlIGV2ZW50cyBpbiBhIHN0cmluZ1xuICAgKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgZSAtIGV2ZW50IHN0cmluZ1xuICAgKiBAcGFyYW0gICB7RnVuY3Rpb259ICAgZm4gLSBjYWxsYmFja1xuICAgKi9cbiAgZnVuY3Rpb24gb25FYWNoRXZlbnQoZSwgZm4pIHtcbiAgICB2YXIgZXMgPSBlLnNwbGl0KCcgJyksIGwgPSBlcy5sZW5ndGgsIGkgPSAwLCBuYW1lLCBpbmR4XG4gICAgZm9yICg7IGkgPCBsOyBpKyspIHtcbiAgICAgIG5hbWUgPSBlc1tpXVxuICAgICAgaW5keCA9IG5hbWUuaW5kZXhPZignLicpXG4gICAgICBpZiAobmFtZSkgZm4oIH5pbmR4ID8gbmFtZS5zdWJzdHJpbmcoMCwgaW5keCkgOiBuYW1lLCBpLCB+aW5keCA/IG5hbWUuc2xpY2UoaW5keCArIDEpIDogbnVsbClcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUHVibGljIEFwaVxuICAgKi9cblxuICAvLyBleHRlbmQgdGhlIGVsIG9iamVjdCBhZGRpbmcgdGhlIG9ic2VydmFibGUgbWV0aG9kc1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhlbCwge1xuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kXG4gICAgICogZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBlYWNoIHRpbWUgYW4gZXZlbnQgaXMgdHJpZ2dlcmVkLlxuICAgICAqIEBwYXJhbSAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAgICogQHBhcmFtICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvbjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBmbiAhPSAnZnVuY3Rpb24nKSAgcmV0dXJuIGVsXG5cbiAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MsIG5zKSB7XG4gICAgICAgICAgKGNhbGxiYWNrc1tuYW1lXSA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXSkucHVzaChmbilcbiAgICAgICAgICBmbi50eXBlZCA9IHBvcyA+IDBcbiAgICAgICAgICBmbi5ucyA9IG5zXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGxpc3RlbmVyc1xuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgICAqL1xuICAgIG9mZjoge1xuICAgICAgdmFsdWU6IGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICAgICAgaWYgKGV2ZW50cyA9PSAnKicgJiYgIWZuKSBjYWxsYmFja3MgPSB7fVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcywgbnMpIHtcbiAgICAgICAgICAgIGlmIChmbiB8fCBucykge1xuICAgICAgICAgICAgICB2YXIgYXJyID0gY2FsbGJhY2tzW25hbWVdXG4gICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgICAgICBpZiAoY2IgPT0gZm4gfHwgbnMgJiYgY2IubnMgPT0gbnMpIGFyci5zcGxpY2UoaS0tLCAxKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgZGVsZXRlIGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kXG4gICAgICogZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBhdCBtb3N0IG9uY2VcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICBvbmU6IHtcbiAgICAgIHZhbHVlOiBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgICAgIGZ1bmN0aW9uIG9uKCkge1xuICAgICAgICAgIGVsLm9mZihldmVudHMsIG9uKVxuICAgICAgICAgIGZuLmFwcGx5KGVsLCBhcmd1bWVudHMpXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsLm9uKGV2ZW50cywgb24pXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEV4ZWN1dGUgYWxsIGNhbGxiYWNrIGZ1bmN0aW9ucyB0aGF0IGxpc3RlbiB0b1xuICAgICAqIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYFxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcbiAgICAgKi9cbiAgICB0cmlnZ2VyOiB7XG4gICAgICB2YWx1ZTogZnVuY3Rpb24oZXZlbnRzKSB7XG5cbiAgICAgICAgLy8gZ2V0dGluZyB0aGUgYXJndW1lbnRzXG4gICAgICAgIHZhciBhcmdsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMSxcbiAgICAgICAgICBhcmdzID0gbmV3IEFycmF5KGFyZ2xlbiksXG4gICAgICAgICAgZm5zXG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdsZW47IGkrKykge1xuICAgICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaSArIDFdIC8vIHNraXAgZmlyc3QgYXJndW1lbnRcbiAgICAgICAgfVxuXG4gICAgICAgIG9uRWFjaEV2ZW50KGV2ZW50cywgZnVuY3Rpb24obmFtZSwgcG9zLCBucykge1xuXG4gICAgICAgICAgZm5zID0gc2xpY2UuY2FsbChjYWxsYmFja3NbbmFtZV0gfHwgW10sIDApXG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMCwgZm47IGZuID0gZm5zW2ldOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChmbi5idXN5KSBjb250aW51ZVxuICAgICAgICAgICAgZm4uYnVzeSA9IDFcbiAgICAgICAgICAgIGlmICghbnMgfHwgZm4ubnMgPT0gbnMpIGZuLmFwcGx5KGVsLCBmbi50eXBlZCA/IFtuYW1lXS5jb25jYXQoYXJncykgOiBhcmdzKVxuICAgICAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgICAgIGZuLmJ1c3kgPSAwXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhbGxiYWNrc1snKiddICYmIG5hbWUgIT0gJyonKVxuICAgICAgICAgICAgZWwudHJpZ2dlci5hcHBseShlbCwgWycqJywgbmFtZV0uY29uY2F0KGFyZ3MpKVxuXG4gICAgICAgIH0pXG5cbiAgICAgICAgcmV0dXJuIGVsXG4gICAgICB9LFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgfVxuICB9KVxuXG4gIHJldHVybiBlbFxuXG59XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JylcbiAgICBtb2R1bGUuZXhwb3J0cyA9IG9ic2VydmFibGVcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuICAgIGRlZmluZShmdW5jdGlvbigpIHsgcmV0dXJuIG9ic2VydmFibGUgfSlcbiAgZWxzZVxuICAgIHdpbmRvdy5vYnNlcnZhYmxlID0gb2JzZXJ2YWJsZVxuXG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdW5kZWZpbmVkKTsiLCJpbXBvcnQgQ2hhbWJyIGZyb20gJy4vV29ya2VyLmVzNidcbmltcG9ydCBPYnNlcnZhYmxlIGZyb20gJ3Jpb3Qtb2JzZXJ2YWJsZSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTW9kZWxBYnN0cmFjdCB7XG5cbiAgICBzZXQgbW9kZWxEYXRhKG8pe1xuICAgICAgICB0aGlzLl9kYXRhID0gb1xuICAgIH1cblxuICAgIGdldCBtb2RlbERhdGEoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RhdGEgfHwge31cbiAgICB9XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBPYnNlcnZhYmxlKHRoaXMpXG4gICAgICAgIHRoaXMub24oJyonLCAobmFtZSwgZGF0YSkgPT4ge1xuICAgICAgICAgICAgbGV0IG9uVHJpZ2dlcnMgPSB0aGlzLl9vblRyaWdnZXJFdmVudEhhbmRsZXJzW25hbWVdXG4gICAgICAgICAgICBsZXQgcHJvbWlzZXMgPSBbXVxuICAgICAgICAgICAgb25UcmlnZ2VycyAmJiBvblRyaWdnZXJzLmZvckVhY2gobWV0aG9kID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcCA9IHRoaXNbbWV0aG9kXS5jYWxsKHRoaXMsIG5hbWUsIGRhdGEpXG4gICAgICAgICAgICAgICAgcC50aGVuICYmIHByb21pc2VzLnB1c2gocClcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGlmIChwcm9taXNlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlcykudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnJvYWRjYXN0KG5hbWUsIGRhdGEsIGZhbHNlKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmJyb2FkY2FzdChuYW1lLCBkYXRhKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIGJyb2FkY2FzdChuYW1lLCBkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gdHJ1ZSl7XG4gICAgICAgIENoYW1ici5SZXNvbHZlKGBDaGFtYnItPiR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfS0+RXZlbnRgLCAtMSwgdGhpcy5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQodGhpcyksIGRhdGEsIHNvZnQsIG5hbWUpXG4gICAgfVxuXG4gICAgcmVzb2x2ZShkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gZmFsc2UsIHN0YXRlID0gJ3Jlc29sdmUnKXtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7ZGF0YSwgc29mdCwgc3RhdGV9KVxuICAgIH1cblxuICAgIHJlamVjdChkYXRhID0gdW5kZWZpbmVkLCBzb2Z0ID0gdHJ1ZSwgc3RhdGUgPSAncmVqZWN0Jyl7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdCh7ZGF0YSwgc29mdCwgc3RhdGV9KVxuICAgIH1cblxufSIsImltcG9ydCBNb2RlbEFic3RyYWN0IGZyb20gJy4vTW9kZWxBYnN0cmFjdC5lczYnXG5cbmNvbnN0IE1PREVMX0xJQlJBUlkgPSB7fVxuY29uc3QgTU9ERUxfSU5TVEFOQ0VTID0ge31cblxudmFyIEhXID0gdW5kZWZpbmVkXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW1iciB7XG5cbiAgICBjb25zdHJ1Y3RvcihIaWdod2F5SW5zdGFuY2Upe1xuICAgICAgICBIVyA9IEhpZ2h3YXlJbnN0YW5jZVxuICAgICAgICBIVy5zdWIoJ0NoYW1icicsIGZ1bmN0aW9uKENoYW1ickV2ZW50KXtcbiAgICAgICAgICAgIGxldCBldiAgICAgID0gQ2hhbWJyRXZlbnQuZGF0YVxuICAgICAgICAgICAgbGV0IHJvdXRlICAgPSBDaGFtYnJFdmVudC5uYW1lLnNwbGl0KCctPicpXG4gICAgICAgICAgICBsZXQgYXJnTGlzdCA9IE9iamVjdC52YWx1ZXMoZXYuYXJnTGlzdClcbiAgICAgICAgICAgIGxldCBpc0NvbnN0cnVjdG9yID0gcm91dGVbMl0gPT09ICdjb25zdHJ1Y3RvcidcbiAgICAgICAgICAgIGxldCBtb2RlbCAgID0gQ2hhbWJyLmdldE1vZGVsKHJvdXRlWzFdLCBpc0NvbnN0cnVjdG9yID8gYXJnTGlzdCA6IHVuZGVmaW5lZClcbiAgICAgICAgICAgIGxldCBtZXRob2QgID0gbW9kZWwgPyBtb2RlbFtyb3V0ZVsyXV0gOiBmYWxzZVxuICAgICAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgICAgICAgIGlmIChpc0NvbnN0cnVjdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIENoYW1ici5SZXNvbHZlKENoYW1ickV2ZW50Lm5hbWUsIGV2LnJlcXVlc3RJZCwgbW9kZWwubW9kZWxEYXRhLCB7fSwge30sIHRydWUpXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgciA9IG1ldGhvZC5hcHBseShtb2RlbCwgYXJnTGlzdClcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByLnRoZW4obyA9PiBDaGFtYnIuUmVzb2x2ZShDaGFtYnJFdmVudC5uYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIG8uZGF0YSwgby5zb2Z0LCBvLnN0YXRlKSlcbiAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChvID0+IENoYW1ici5SZWplY3QoQ2hhbWJyRXZlbnQubmFtZSwgZXYucmVxdWVzdElkLCBtb2RlbC5tb2RlbERhdGEsIENoYW1ici5FeHBvcnQobW9kZWwpLCBvLmRhdGEsIG8uc29mdCwgby5zdGF0ZSkpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpe1xuICAgICAgICAgICAgICAgICAgICBDaGFtYnIuUmVzb2x2ZShDaGFtYnJFdmVudC5uYW1lLCBldi5yZXF1ZXN0SWQsIG1vZGVsLm1vZGVsRGF0YSwgQ2hhbWJyLkV4cG9ydChtb2RlbCksIHIsIHRydWUpXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQgTW9kZWwoKXtcbiAgICAgICAgcmV0dXJuIE1vZGVsQWJzdHJhY3RcbiAgICB9XG5cbiAgICBzdGF0aWMgc2V0IE1vZGVsKG1vZGVsKSB7XG4gICAgICAgIE1PREVMX0xJQlJBUllbbW9kZWwubmFtZV0gPSBtb2RlbFxuXG4gICAgICAgIGxldCBhcGkgPSBbXVxuICAgICAgICBsZXQgdG1wTW9kZWwgPSBtb2RlbC5wcm90b3R5cGVcblxuICAgICAgICBkbyB7XG4gICAgICAgICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0bXBNb2RlbClcbiAgICAgICAgICAgICAgICAuZm9yRWFjaCgocHJvcCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBhcGkuZmluZEluZGV4KHYgPT4gdi5uYW1lID09PSBwcm9wKSA9PT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHByb3AgIT09ICdjb25zdHJ1Y3RvcidcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIHByb3AuY2hhckF0KDApICE9PSAnXydcbiAgICAgICAgICAgICAgICAgICAgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBkZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0bXBNb2RlbCwgcHJvcClcblxuICAgICAgICAgICAgICAgICAgICAgICAgYXBpLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHByb3AsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogZGVzY3JpcHRvci5nZXQgPyAndmFyJyA6ICdmbicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVjb3JhdG9yczogZGVzY3JpcHRvci5nZXQgPyBkZXNjcmlwdG9yLmdldC5kZWNvcmF0b3JzIDogZGVzY3JpcHRvci52YWx1ZS5kZWNvcmF0b3JzXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdG1wTW9kZWwgPSB0bXBNb2RlbC5fX3Byb3RvX19cblxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHRtcE1vZGVsXG4gICAgICAgICAgICAgICAgJiYgdG1wTW9kZWwuY29uc3RydWN0b3JcbiAgICAgICAgICAgICAgICAmJiB0bXBNb2RlbC5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnTW9kZWxBYnN0cmFjdCdcbiAgICAgICAgICAgICAgICAmJiB0bXBNb2RlbC5jb25zdHJ1Y3Rvci5uYW1lICE9PSAnT2JqZWN0J1xuICAgICAgICAgICAgKSB7fVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdG1wTW9kZWwgPSBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICh0bXBNb2RlbClcblxuXG4gICAgICAgIG1vZGVsLnByb3RvdHlwZS5fZXhwb3NlZEFwaSA9IGFwaVxuXG4gICAgICAgIEhXLnB1YignQ2hhbWJyLT5FeHBvc2UnLCB7XG4gICAgICAgICAgICBtb2RlbE5hbWU6IG1vZGVsLm5hbWUsXG4gICAgICAgICAgICBtb2RlbEFwaTogYXBpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgc3RhdGljIGdldE1vZGVsKG1vZGVsTmFtZSwgYXJnTGlzdCA9IFtdKXtcbiAgICAgICAgbGV0IG1vZGVsID0gTU9ERUxfSU5TVEFOQ0VTW21vZGVsTmFtZV1cbiAgICAgICAgaWYgKCFtb2RlbCkge1xuICAgICAgICAgICAgbW9kZWwgPSBNT0RFTF9JTlNUQU5DRVNbbW9kZWxOYW1lXSA9IG5ldyBNT0RFTF9MSUJSQVJZW21vZGVsTmFtZV0oLi4uYXJnTGlzdClcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbW9kZWxcbiAgICB9XG5cbiAgICBzdGF0aWMgUmVzb2x2ZShldmVudE5hbWUsIHJlc3BvbnNlSWQsIG1vZGVsRGF0YSwgbW9kZWxFeHBvcnQsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VTb2Z0LCByZXNwb25zZVN0YXRlID0gJ3Jlc29sdmUnKXtcbiAgICAgICAgSFcucHViKGV2ZW50TmFtZSwge1xuICAgICAgICAgICAgcmVzcG9uc2VJZCxcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSxcbiAgICAgICAgICAgIHJlc3BvbnNlU29mdCxcbiAgICAgICAgICAgIHJlc3BvbnNlU3RhdGUsXG4gICAgICAgICAgICBtb2RlbERhdGEsXG4gICAgICAgICAgICBtb2RlbEV4cG9ydFxuICAgICAgICB9LCAncmVzb2x2ZScpXG4gICAgfVxuXG4gICAgc3RhdGljIFJlamVjdChldmVudE5hbWUsIHJlc3BvbnNlSWQsIG1vZGVsRGF0YSwgbW9kZWxFeHBvcnQsIHJlc3BvbnNlRGF0YSwgcmVzcG9uc2VTb2Z0LCByZXNwb25zZVN0YXRlID0gJ3JlamVjdCcpIHtcbiAgICAgICAgSFcucHViKGV2ZW50TmFtZSwge1xuICAgICAgICAgICAgcmVzcG9uc2VJZCxcbiAgICAgICAgICAgIHJlc3BvbnNlRGF0YSxcbiAgICAgICAgICAgIHJlc3BvbnNlU29mdCxcbiAgICAgICAgICAgIHJlc3BvbnNlU3RhdGUsXG4gICAgICAgICAgICBtb2RlbERhdGEsXG4gICAgICAgICAgICBtb2RlbEV4cG9ydFxuICAgICAgICB9LCAncmVqZWN0JylcbiAgICB9XG5cbiAgICBzdGF0aWMgRXhwb3J0KG1vZGVsKXtcbiAgICAgICAgbGV0IHJlc3VsdHMgPSB7fVxuICAgICAgICBtb2RlbC5fZXhwb3NlZEFwaS5mb3JFYWNoKGFwaURhdGEgPT4ge1xuICAgICAgICAgICAgYXBpRGF0YS50eXBlID09PSAndmFyJyAmJiAocmVzdWx0c1thcGlEYXRhLm5hbWVdID0gbW9kZWxbYXBpRGF0YS5uYW1lXSlcbiAgICAgICAgfSlcbiAgICAgICAgcmV0dXJuIHJlc3VsdHNcbiAgICB9XG59Il19
