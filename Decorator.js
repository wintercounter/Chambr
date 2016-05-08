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

            peelList.forEach(function (peel, i) {
                var peelArgIndex = i;
                if (peel.indexOf(':') + 1) {
                    var tmp = peel.split(':');
                    peelArgIndex = tmp[0];
                    peel = tmp[1];
                }
                if (_typeof(args[peelArgIndex]) === 'object') {
                    try {
                        (function () {
                            var r = args[peelArgIndex];
                            var str = peel.split('->');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmNcXERlY29yYXRvci5lczYiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7O1FDR2dCO1FBUUE7UUFnQkE7UUFRQTtRQWtDQTtRQWlCQTtBQXRGaEIsSUFBTSxXQUFXLEtBQVg7QUFDTixJQUFNLFVBQVUsSUFBVjs7QUFFQyxTQUFTLE9BQVQsQ0FBaUIsQ0FBakIsRUFBbUI7QUFDdEIsV0FBTyxVQUFTLE1BQVQsRUFBaUIsSUFBakIsRUFBdUIsVUFBdkIsRUFBa0M7QUFDckMsaUJBQVMsVUFBVCxFQUFxQjtBQUNqQix1QkFBVyxDQUFYO1NBREosRUFFRyxRQUZILEVBRHFDO0tBQWxDLENBRGU7Q0FBbkI7O0FBUUEsU0FBUyxPQUFULEdBQWdDO1FBQWYsMkRBQUsseUJBQVU7O0FBQ25DLFdBQU8sVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQWtDO0FBQ3JDLFlBQUksTUFBTSxXQUFXLEtBQVgsQ0FEMkI7QUFFckMsbUJBQVcsS0FBWCxHQUFtQixZQUFpQjs7OzhDQUFMOzthQUFLOztBQUNoQyxnQkFBSSxJQUFJLElBQUksSUFBSixhQUFTLGFBQVMsS0FBbEIsQ0FBSixDQUQ0QjtBQUVoQyxnQkFBSSxLQUFLLEVBQUUsSUFBRixFQUFRO0FBQ2Isa0JBQUUsSUFBRixDQUFPOzJCQUFNLE1BQUssT0FBTCxDQUFhLEVBQWI7aUJBQU4sQ0FBUCxDQURhO2FBQWpCLE1BR0s7QUFDRCxxQkFBSyxPQUFMLENBQWEsRUFBYixFQURDO2FBSEw7QUFNQSxtQkFBTyxDQUFQLENBUmdDO1NBQWpCLENBRmtCO0tBQWxDLENBRDRCO0NBQWhDOztBQWdCQSxTQUFTLEVBQVQsQ0FBWSxLQUFaLEVBQWtCO0FBQ3JCLFdBQU8sVUFBUyxNQUFULEVBQWlCLElBQWpCLEVBQXVCLFVBQXZCLEVBQWtDO0FBQ3JDLFlBQUksSUFBSSxPQUFPLHVCQUFQLEdBQWlDLE9BQU8s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QUFNLDBFQUFOLENBRDRDO0tBQTNDOztBQUlMLFFBQUksbUJBQUosQ0FYOEM7O0FBYTlDLFFBQUksV0FBVyxHQUFYLEVBQWdCO0FBQ2hCLHFCQUFhLFdBQVcsR0FBWCxDQUFlLFVBQWYsR0FBNEIsV0FBVyxHQUFYLENBQWUsVUFBZixJQUE2QixFQUE3QixDQUR6QjtLQUFwQixNQUdLO0FBQ0QscUJBQWEsV0FBVyxLQUFYLENBQWlCLFVBQWpCLEdBQThCLFdBQVcsS0FBWCxDQUFpQixVQUFqQixJQUErQixFQUEvQixDQUQxQztLQUhMO0FBTUEsYUFBYyxVQUFkLEVBQTBCLEtBQTFCLEVBbkI4QztDQUFsRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBUWVBFX1ZBUiA9ICd2YXInXG5jb25zdCBUWVBFX0ZOID0gJ2ZuJ1xuXG5leHBvcnQgZnVuY3Rpb24gRGVmYXVsdCh2KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKXtcbiAgICAgICAgZGVjb3JhdGUoZGVzY3JpcHRvciwge1xuICAgICAgICAgICAgJ2RlZmF1bHQnOiB2XG4gICAgICAgIH0sIFRZUEVfVkFSKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIFRyaWdnZXIoZXYgPSAndXBkYXRlZCcpe1xuICAgIHJldHVybiBmdW5jdGlvbih0YXJnZXQsIG5hbWUsIGRlc2NyaXB0b3Ipe1xuICAgICAgICB2YXIgb2xkID0gZGVzY3JpcHRvci52YWx1ZVxuICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gZnVuY3Rpb24oLi4uYXJncyl7XG4gICAgICAgICAgICBsZXQgciA9IG9sZC5jYWxsKHRoaXMsIC4uLmFyZ3MpXG4gICAgICAgICAgICBpZiAociAmJiByLnRoZW4pIHtcbiAgICAgICAgICAgICAgICByLnRoZW4oKCkgPT4gdGhpcy50cmlnZ2VyKGV2KSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudHJpZ2dlcihldilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBPbihldmVudCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIGxldCBjID0gdGFyZ2V0Ll9vblRyaWdnZXJFdmVudEhhbmRsZXJzID0gdGFyZ2V0Ll9vblRyaWdnZXJFdmVudEhhbmRsZXJzIHx8IHt9XG4gICAgICAgIGxldCBvID0gY1tldmVudF0gPSBjW2V2ZW50XSB8fCBbXVxuICAgICAgICBvLnB1c2gobmFtZSlcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBQZWVsKC4uLnBlZWxMaXN0KXtcbiAgICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0LCBuYW1lLCBkZXNjcmlwdG9yKXtcbiAgICAgICAgdmFyIG9sZCA9IGRlc2NyaXB0b3IudmFsdWVcbiAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IGZ1bmN0aW9uKC4uLmFyZ3Mpe1xuICAgICAgICAgICAgcGVlbExpc3QuZm9yRWFjaCgocGVlbCwgaSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwZWVsQXJnSW5kZXggPSBpXG4gICAgICAgICAgICAgICAgaWYgKHBlZWwuaW5kZXhPZignOicpKzEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRtcCA9IHBlZWwuc3BsaXQoJzonKVxuICAgICAgICAgICAgICAgICAgICBwZWVsQXJnSW5kZXggPSB0bXBbMF1cbiAgICAgICAgICAgICAgICAgICAgcGVlbCA9IHRtcFsxXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGFyZ3NbcGVlbEFyZ0luZGV4XSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCByID0gYXJnc1twZWVsQXJnSW5kZXhdXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gcGVlbC5zcGxpdCgnLT4nKVxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyLmZvckVhY2goeCA9PiByID0gclt4XSlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyID09PSB1bmRlZmluZWQpIHRocm93ICdlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJnc1tpXSA9IHJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaChlKXt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVybiBvbGQuY2FsbCh0aGlzLCAuLi5hcmdzKVxuICAgICAgICB9XG5cbiAgICAgICAgZGVjb3JhdGUoZGVzY3JpcHRvciwge1xuICAgICAgICAgICAgcGVlbDoge1xuICAgICAgICAgICAgICAgIGxpc3Q6IHBlZWxMaXN0LFxuICAgICAgICAgICAgICAgIGZuOiBkZXNjcmlwdG9yLnZhbHVlLnRvU3RyaW5nKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgVFlQRV9GTilcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBHZXRTZXQob2JqKXtcbiAgICBmb3IgKGxldCBpIGluIG9iaikge1xuICAgICAgICBvYmpbaV0gPSB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXNbb2JqW2ldXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24obyl7XG4gICAgICAgICAgICAgICAgdGhpc1tvYmpbaV1dID0gb1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgb2JqKVxuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIEVtcHR5KCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHRhcmdldCwgbmFtZSwgZGVzY3JpcHRvcil7XG4gICAgICAgIGRlY29yYXRlKGRlc2NyaXB0b3IsIHtcbiAgICAgICAgICAgIGVtcHR5OiB0cnVlXG4gICAgICAgIH0sIFRZUEVfRk4pXG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZWNvcmF0ZShkZXNjcmlwdG9yLCB2YWx1ZSwgdHlwZSA9IGZhbHNlKXtcbiAgICBpZiAoZGVzY3JpcHRvci5zZXQpIHtcbiAgICAgICAgdGhyb3coJ1lvdSB0cmllZCB0byBhcHBseSBhIGRlY29yYXRvciB0byBhIHNldHRlciB3aGljaCBpcyBub3QgYWxsb3dlZC4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9GTiAmJiBkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICB0aHJvdygnVHJpZWQgdG8gdXNlIGEgZGVjb3JhdG9yIG9uIGEgZ2V0dGVyIHdoaWNoIGlzIG9ubHkgYWxsb3dlZCBvbiBmdW5jdGlvbiB0eXBlcy4nKTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZSA9PT0gVFlQRV9WQVIgJiYgZGVzY3JpcHRvci52YWx1ZSkge1xuICAgICAgICB0aHJvdygnVHJpZWQgdG8gdXNlIGEgZGVjb3JhdG9yIG9uIGEgZnVuY3Rpb24gd2hpY2ggaXMgb25seSBhbGxvd2VkIG9uIGdldHRlcnMuJyk7XG4gICAgfVxuXG4gICAgbGV0IGRlY29yYXRvcnNcblxuICAgIGlmIChkZXNjcmlwdG9yLmdldCkge1xuICAgICAgICBkZWNvcmF0b3JzID0gZGVzY3JpcHRvci5nZXQuZGVjb3JhdG9ycyA9IGRlc2NyaXB0b3IuZ2V0LmRlY29yYXRvcnMgfHwge31cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnMgPSBkZXNjcmlwdG9yLnZhbHVlLmRlY29yYXRvcnMgfHwge31cbiAgICB9XG4gICAgT2JqZWN0LmFzc2lnbihkZWNvcmF0b3JzLCB2YWx1ZSlcbn0iXX0=
