(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ChambrDecorator = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.Default = Default;
exports.Trigger = Trigger;
exports.On = On;
exports.Peel = Peel;
exports.GetSet = GetSet;
exports.Empty = Empty;
var TYPE_VAR = 'var';
var TYPE_FN = 'fn';

function Default(v) {
    return function (target, name, descriptor) {
        decorate(descriptor, {
            'default': v
        }, TYPE_VAR);
    };
}

function Trigger() {
    var ev = arguments.length <= 0 || arguments[0] === undefined ? 'updated' : arguments[0];

    return function (target, name, descriptor) {
        var old = descriptor.value;
        descriptor.value = function () {
            var _this = this;

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var r = old.call.apply(old, [this].concat(args));
            if (r && r.then) {
                r.then(function () {
                    return _this.trigger(ev);
                });
            } else {
                this.trigger(ev);
            }
            return r;
        };
    };
}

function On(event) {
    return function (target, name, descriptor) {
        var c = target._onTriggerEventHandlers = target._onTriggerEventHandlers || {};
        var o = c[event] = c[event] || [];
        o.push(name);
    };
}

function Peel() {
    for (var _len2 = arguments.length, peelList = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        peelList[_key2] = arguments[_key2];
    }

    return function (target, name, descriptor) {
        var old = descriptor.value;
        descriptor.value = function () {
            for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
            }

            args.forEach(function (arg, i) {
                if (peelList[i] === null) {
                    args[i] = null;
                } else if ((typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' && peelList[i]) {
                    try {
                        (function () {
                            var r = arg;
                            var str = peelList[i].split('->');
                            str.forEach(function (x) {
                                return r = r[x];
                            });
                            if (r === undefined) throw 'e';
                            args[i] = r;
                        })();
                    } catch (e) {}
                }
            });
            return old.call.apply(old, [this].concat(args));
        };

        decorate(descriptor, {
            peel: {
                list: peelList,
                fn: descriptor.value.toString()
            }
        }, TYPE_FN);
    };
}

function GetSet(obj) {
    var _loop = function _loop(i) {
        obj[i] = {
            get: function get() {
                return this[obj[i]];
            },
            set: function set(o) {
                this[obj[i]] = o;
            }
        };
    };

    for (var i in obj) {
        _loop(i);
    }

    return function (target) {
        Object.defineProperties(target, obj);
    };
}

function Empty() {
    return function (target, name, descriptor) {
        decorate(descriptor, {
            empty: true
        }, TYPE_FN);
    };
}

function decorate(descriptor, value) {
    var type = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    if (descriptor.set) {
        throw 'You tried to apply a decorator to a setter which is not allowed.';
    } else if (type === TYPE_FN && descriptor.get) {
        throw 'Tried to use a decorator on a getter which is only allowed on function types.';
    } else if (type === TYPE_VAR && descriptor.value) {
        throw 'Tried to use a decorator on a function which is only allowed on getters.';
    }

    var decorators = void 0;

    if (descriptor.get) {
        decorators = descriptor.get.decorators = descriptor.get.decorators || {};
    } else {
        decorators = descriptor.value.decorators = descriptor.value.decorators || {};
    }
    _extends(decorators, value);
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXERlY29yYXRvci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O1FDR2dCO1FBUUE7UUFnQkE7UUFRQTtRQStCQTtRQWlCQTtBQW5GaEIsSUFBTSxXQUFXLEtBQVg7QUFDTixJQUFNLFVBQVUsSUFBVjs7QUFFQyxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBbUI7QUFDdEIsV0FBTyxVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsVUFBdkIsRUFBa0M7QUFDckMsaUJBQVMsVUFBVCxFQUFxQjtBQUNqQix1QkFBVyxDQUFYO1NBREosRUFFRyxRQUZILEVBRHFDO0tBQWxDLENBRGU7Q0FBbkI7O0FBUUEsU0FBUyxPQUFULEdBQWdDO1FBQWYsMkRBQUsseUJBQVU7O0FBQ25DLFdBQU8sVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQWtDO0FBQ3JDLFlBQUksTUFBTSxXQUFXLEtBQVgsQ0FEMkI7QUFFckMsbUJBQVcsS0FBWCxHQUFtQixZQUFpQjs7OzhDQUFMOzthQUFLOztBQUNoQyxnQkFBSSxJQUFJLElBQUksSUFBSixhQUFTLGFBQVMsS0FBbEIsQ0FBSixDQUQ0QjtBQUVoQyxnQkFBSSxLQUFLLEVBQUUsSUFBRixFQUFRO0FBQ2Isa0JBQUUsSUFBRixDQUFPOzJCQUFNLE1BQUssT0FBTCxDQUFhLEVBQWI7aUJBQU4sQ0FBUCxDQURhO2FBQWpCLE1BR0s7QUFDRCxxQkFBSyxPQUFMLENBQWEsRUFBYixFQURDO2FBSEw7QUFNQSxtQkFBTyxDQUFQLENBUmdDO1NBQWpCLENBRmtCO0tBQWxDLENBRDRCO0NBQWhDOztBQWdCQSxTQUFTLEVBQVQsQ0FBWSxLQUFaLEVBQWtCO0FBQ3JCLFdBQU8sVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQWtDO0FBQ3JDLFlBQUksSUFBSSxPQUFPLHVCQUFQLEdBQWlDLE9BQU8s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QixXQUFXLEdBQVgsQ0FBZSxVQUFmLElBQTZCLEVBQTdCLENBRHpCO0tBQXBCLE1BR0s7QUFDRCxxQkFBYSxXQUFXLEtBQVgsQ0FBaUIsVUFBakIsR0FBOEIsV0FBVyxLQUFYLENBQWlCLFVBQWpCLElBQStCLEVBQS9CLENBRDFDO0tBSEw7QUFNQSxhQUFjLFVBQWQsRUFBMEIsS0FBMUIsRUFuQjhDO0NBQWxEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IFRZUEVfVkFSID0gJ3ZhcidcbmNvbnN0IFRZUEVfRk4gPSAnZm4nXG5cbmV4cG9ydCBmdW5jdGlvbiBEZWZhdWx0KHYpe1xuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3Ipe1xuICAgICAgICBkZWNvcmF0ZShkZXNjcmlwdG9yLCB7XG4gICAgICAgICAgICAnZGVmYXVsdCc6IHZcbiAgICAgICAgfSwgVFlQRV9WQVIpXG4gICAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gVHJpZ2dlcihldiA9ICd1cGRhdGVkJyl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIHZhciBvbGQgPSBkZXNjcmlwdG9yLnZhbHVlXG4gICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBmdW5jdGlvbiguLi5hcmdzKXtcbiAgICAgICAgICAgIGxldCByID0gb2xkLmNhbGwodGhpcywgLi4uYXJncylcbiAgICAgICAgICAgIGlmIChyICYmIHIudGhlbikge1xuICAgICAgICAgICAgICAgIHIudGhlbigoKSA9PiB0aGlzLnRyaWdnZXIoZXYpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmlnZ2VyKGV2KVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIE9uKGV2ZW50KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKXtcbiAgICAgICAgbGV0IGMgPSB0YXJnZXQuX29uVHJpZ2dlckV2ZW50SGFuZGxlcnMgPSB0YXJnZXQuX29uVHJpZ2dlckV2ZW50SGFuZGxlcnMgfHwge31cbiAgICAgICAgbGV0IG8gPSBjW2V2ZW50XSA9IGNbZXZlbnRdIHx8IFtdXG4gICAgICAgIG8ucHVzaChuYW1lKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFBlZWwoLi4ucGVlbExpc3Qpe1xuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3Ipe1xuICAgICAgICB2YXIgb2xkID0gZGVzY3JpcHRvci52YWx1ZVxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICBhcmdzLmZvckVhY2goKGFyZywgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChwZWVsTGlzdFtpXSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBhcmdzW2ldID0gbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmICh0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBwZWVsTGlzdFtpXSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHIgPSBhcmdcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBzdHIgPSBwZWVsTGlzdFtpXS5zcGxpdCgnLT4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyLmZvckVhY2goeCA9PiByID0gclt4XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyID09PSB1bmRlZmluZWQpIHRocm93ICdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IHJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaChlKXt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBvbGQuY2FsbCh0aGlzLCAuLi5hcmdzKVxuICAgICAgICB9XG5cbiAgICAgICAgZGVjb3JhdGUoZGVzY3JpcHRvciwge1xuICAgICAgICAgICAgcGVlbDoge1xuICAgICAgICAgICAgICAgIGxpc3Q6IHBlZWxMaXN0LFxuICAgICAgICAgICAgICAgIGZuOiBkZXNjcmlwdG9yLnZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgVFlQRV9GTilcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRTZXQob2JqKXtcbiAgICBmb3IgKGxldCBpIGluIG9iaikge1xuICAgICAgICBvYmpbaV0gPSB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbb2JqW2ldXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24obyl7XG4gICAgICAgICAgICAgICAgdGhpc1tvYmpbaV1dID0gb1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgb2JqKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVtcHR5KCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIGRlY29yYXRlKGRlc2NyaXB0b3IsIHtcbiAgICAgICAgICAgIGVtcHR5OiB0cnVlXG4gICAgICAgIH0sIFRZUEVfRk4pXG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZWNvcmF0ZShkZXNjcmlwdG9yLCB2YWx1ZSwgdHlwZSA9IGZhbHNlKXtcbiAgICBpZiAoZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgICAgdGhyb3coJ1lvdSB0cmllZCB0byBhcHBseSBhIGRlY29yYXRvciB0byBhIHNldHRlciB3aGljaCBpcyBub3QgYWxsb3dlZC4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9GTiAmJiBkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICB0aHJvdygnVHJpZWQgdG8gdXNlIGEgZGVjb3JhdG9yIG9uIGEgZ2V0dGVyIHdoaWNoIGlzIG9ubHkgYWxsb3dlZCBvbiBmdW5jdGlvbiB0eXBlcy4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9WQVIgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuICAgICAgICB0aHJvdygnVHJpZWQgdG8gdXNlIGEgZGVjb3JhdG9yIG9uIGEgZnVuY3Rpb24gd2hpY2ggaXMgb25seSBhbGxvd2VkIG9uIGdldHRlcnMuJyk7XG4gICAgfVxuXG4gICAgbGV0IGRlY29yYXRvcnNcblxuICAgIGlmIChkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICBkZWNvcmF0b3JzID0gZGVzY3JpcHRvci5nZXQuZGVjb3JhdG9ycyA9IGRlc2NyaXB0b3IuZ2V0LmRlY29yYXRvcnMgfHwge31cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnMgfHwge31cbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbihkZWNvcmF0b3JzLCB2YWx1ZSlcbn0iXX0=
