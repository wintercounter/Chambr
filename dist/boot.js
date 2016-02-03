(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('babel-polyfill');

require('./_Debug.es6');

var _Riot = require('./Riot.es6');

var _Riot2 = _interopRequireDefault(_Riot);

require('./Gateway/Client.es6');

require('./Chambr/Client.es6');

require('./Tags/All.es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ci('Site engine started.');

GW.sub('Worker->Ready', function () {
    ci('Main App is trying to mount.');
    _Riot2.default.mount('app');
});

},{"./Chambr/Client.es6":3,"./Gateway/Client.es6":7,"./Riot.es6":11,"./Tags/All.es6":12,"./_Debug.es6":17,"babel-polyfill":18}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var BASKET = exports.BASKET = {};

self.$ = self.$ || BASKET;

},{}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BASKET = require('./BASKET.es6');

var _Riot = require('../Riot.es6');

var _Riot2 = _interopRequireDefault(_Riot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

new (function () {
    function Client() {
        var _this = this;

        _classCallCheck(this, Client);

        var client = this;
        self.GW.on('$->Expose', function (data) {
            ci('$ Incoming expose', data);
            _this.data = data;
            var BS = _BASKET.BASKET[data.name] = _this.applyAPI();

            self.GW.register('$->' + data.name, function (ev) {
                ev = ev || {};
                var parsed = self.GW.parse(ev.name);
                parsed.state && BS.trigger('state', parsed);
                if (parsed.state === 'done' && ev.data) {
                    for (var k in BS) {
                        if (BS.hasOwnProperty(k)) delete BS[k];
                    }
                    Object.assign(BS, ev.data);
                }
                BS.scope && parsed.state && !parsed.silent && BS.scope.update();
            });
        });
    }

    _createClass(Client, [{
        key: 'applyAPI',
        value: function applyAPI() {
            var _this2 = this;

            if (this._hasProto) return;
            this._hasProto = true;
            var d = this.data.data || {};
            this.data.api.forEach(function (method) {
                Object.defineProperty(d, method, {
                    enumerable: false,
                    configurable: false,
                    writable: false,
                    value: _this2.__METHOD(_this2.data.name, method)
                });
            });
            _Riot2.default.observable(d);
            return d;
        }
    }, {
        key: '__METHOD',
        value: function __METHOD(name, method) {
            var _that = this;
            return function () {
                var that = this;
                var ag1 = arguments;

                if (_typeof(ag1[0]) === 'object' && ag1[0].mixin) {
                    var scope = _BASKET.BASKET[name].scope = ag1[0];
                    ag1 = [].slice.call(ag1, 1);
                }

                return new Promise(function (resolve) {
                    // TODO once!!!!
                    self.GW.sub('$->' + name + '->' + method + '::done', function () {
                        var ag2 = arguments;
                        var scope = _BASKET.BASKET[name].scope;
                        resolve(that, ag2);
                        setTimeout(function () {
                            scope && scope.update();
                        });
                    });
                    self.GW.pub('$->' + name + '->' + method, {
                        argList: ag1
                    });
                });
            };
        }
    }]);

    return Client;
}())();

},{"../Riot.es6":11,"./BASKET.es6":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var CHAMBR_RIOT_MIXIN = exports.CHAMBR_RIOT_MIXIN = '$';

var DB = exports.DB = {
    CHANGE: 'change',
    COMPLETE: 'complete',
    ERROR: 'error',
    NOW: 'now',

    // Only at replication and sync
    DENIED: 'denied',
    ACTIVE: 'active',
    PAUSED: 'paused'
};

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Custom = exports.Conf = exports.Impl = undefined;

var _ConstantsShared = require('../Chambr/_Constants.Shared.es6');

var Impl = exports.Impl = {
    tmpl: '',
    fn: undefined,
    attrs: undefined
};

var Conf = exports.Conf = {
    root: undefined,
    opts: undefined,
    isLoop: false,
    hasImpl: false,
    item: undefined
};

var Custom = exports.Custom = {
    AutoUpdate: true,
    AutoMixins: [_ConstantsShared.RIOT_MIXIN]
};

},{"../Chambr/_Constants.Shared.es6":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var INFO = exports.INFO = {
    version: 0.1
};

var DEBUG = exports.DEBUG = true;

},{}],7:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _AbstractShared = require('./_Abstract.Shared.es6');

var _AbstractShared2 = _interopRequireDefault(_AbstractShared);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = new (function (_Abstract) {
    _inherits(Client, _Abstract);

    _createClass(Client, [{
        key: 'Promise',
        get: function get() {
            return this._promise;
        },
        set: function set(p) {
            this._promise = p;
        }
    }]);

    function Client() {
        _classCallCheck(this, Client);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Client).call(this));

        ci('Gateway Client started.');
        _this.start('dist/worker.js');
        return _this;
    }

    _createClass(Client, [{
        key: 'start',
        value: function start(worker) {
            var _this2 = this;

            this.Promise = new Promise(function (resolve) {
                _this2.Worker = new Worker(worker);
                _this2.Worker.addEventListener('message', function (ev) {
                    resolve(ev.data);
                    _this2.handle(ev.data);
                }, true);
            });
        }
    }]);

    return Client;
}(_AbstractShared2.default))();

},{"./_Abstract.Shared.es6":9}],8:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.buildRoute = buildRoute;
exports.registerHelper = registerHelper;
exports.parseRoute = parseRoute;
exports.handlerHelper = handlerHelper;

var _ConstantsShared = require('./_Constants.Shared.es6');

var C = _interopRequireWildcard(_ConstantsShared);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function buildRoute() {
    return Array.prototype.filter.call(arguments, Boolean).join(C.EVENT_DELIMITER);
}

function registerHelper(name, handler, Handlers) {
    // Extract segments
    var segments = name.split(C.EVENT_DELIMITER);

    // Apply segments and prototype
    var temp = Handlers;
    segments.forEach(function (k, i, a) {
        if (!temp.hasOwnProperty(k)) {
            temp[k] = {
                handlers: []
            };
        }
        temp = temp[k];
        ++i === a.length && temp.handlers.push(handler);
    });
}

function parseRoute(route, Handlers) {
    var parsed = Handlers;
    route.split(C.EVENT_DELIMITER).forEach(function (s) {
        parsed.hasOwnProperty(s) && (parsed = parsed[s]);
    });
    return parsed;
}

function handlerHelper(Handlers, ev) {
    var parsed = parseRoute(ev.name, Handlers);
    applyHandlers(parsed, ev);
}

function applyHandlers(obj, ev) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            _typeof(obj[i]) === 'object' && handlerHelper(obj[i], ev);

            (i = obj.handlers) && i.length && i.forEach(function (fn) {
                return fn.call(null, ev);
            });
        }
    }
}

},{"./_Constants.Shared.es6":10}],9:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _riotObservable = require('riot-observable');

var _riotObservable2 = _interopRequireDefault(_riotObservable);

var _UtilsShared = require('./Utils.Shared.es6');

var _ConstantsShared = require('./_Constants.Shared.es6');

var C = _interopRequireWildcard(_ConstantsShared);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Handlers = {};
var DEBUG_EVENTS = true;

var Abstract = function () {
    function Abstract() {
        _classCallCheck(this, Abstract);

        (0, _riotObservable2.default)(this);
        self.GW = this;
    }

    _createClass(Abstract, [{
        key: 'register',
        value: function register(name, handler) {
            (0, _UtilsShared.registerHelper)(name, handler, Handlers);
        }
    }, {
        key: 'parse',
        value: function parse(input) {
            var parsed = input.split(C.EVENT_DELIMITER);
            var last = parsed[parsed.length - 1];
            var virtual = last.split('::::')[1];
            var state = virtual || last.split('::')[1] || false;

            state && (parsed[parsed.length - 1] = last.split('::')[0]);

            return {
                segments: parsed,
                state: state,
                silent: !!virtual
            };
        }
    }, {
        key: 'build',
        value: function build() {
            return _UtilsShared.buildRoute.apply(undefined, arguments);
        }
    }, {
        key: 'sub',
        value: function sub(name, handler) {
            name = this.build(name);
            this.on(name, handler);
        }
    }, {
        key: 'pub',
        value: function pub(name, data, skipPost) {
            name = this.build(name);
            if (!skipPost && !self.document.querySelector) {
                self.postMessage({ name: name, data: data });
            } else if (!skipPost) {
                this.Worker.postMessage({ name: name, data: data });
            }
            this.trigger(name, data);
        }
    }, {
        key: 'handle',
        value: function handle(ev) {
            ci('Event: ' + ev.name);
            this.pub(ev.name, ev.data, true);
            (0, _UtilsShared.handlerHelper)(Handlers, ev);
        }
    }]);

    return Abstract;
}();

exports.default = Abstract;

},{"./Utils.Shared.es6":8,"./_Constants.Shared.es6":10,"riot-observable":208}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var RIOT_MIXIN = exports.RIOT_MIXIN = 'chambr-riot-mixin';

var EVENT_DONE_SUFFIX = exports.EVENT_DONE_SUFFIX = 'done';
var EVENT_DELIMITER = exports.EVENT_DELIMITER = '->';
var EVENT_CLIENT = exports.EVENT_CLIENT = 'Client';
var EVENT_WORKER = exports.EVENT_WORKER = 'Worker';

},{}],11:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* Riot v2.3.15, @license MIT, (c) 2015 Muut Inc. + contributors */

;(function (window, undefined) {
    'use strict';

    var riot = { version: 'v2.3.15', settings: {} },

    // be aware, internal usage
    // ATTENTION: prefix the global dynamic variables with `__`

    // counter to give a unique id to all the Tag instances
    __uid = 0,

    // tags instances cache
    __virtualDom = [],

    // tags implementation cache
    __tagImpl = {},

    /**
     * Const
     */
    // riot specific prefixes
    RIOT_PREFIX = 'riot-',
        RIOT_TAG = RIOT_PREFIX + 'tag',

    // for typeof == '' comparisons
    T_STRING = 'string',
        T_OBJECT = 'object',
        T_UNDEF = 'undefined',
        T_FUNCTION = 'function',

    // special native tags that cannot be treated like the others
    SPECIAL_TAGS_REGEX = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/,
        RESERVED_WORDS_BLACKLIST = ['_item', '_id', '_parent', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],

    // version# for IE 8-11, 0 for others
    IE_VERSION = (window && window.document || {}).documentMode | 0;
    /* istanbul ignore next */
    riot.observable = function (el) {

        /**
         * Extend the original object or create a new empty one
         * @type { Object }
         */

        el = el || {};

        /**
         * Private variables and methods
         */
        var callbacks = {},
            slice = Array.prototype.slice,
            onEachEvent = function onEachEvent(e, fn) {
            e.replace(/\S+/g, fn);
        },
            defineProperty = function defineProperty(key, value) {
            Object.defineProperty(el, key, {
                value: value,
                enumerable: false,
                writable: false,
                configurable: false
            });
        };

        /**
         * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
         * @param  { String } events - events ids
         * @param  { Function } fn - callback function
         * @returns { Object } el
         */
        defineProperty('on', function (events, fn) {
            if (typeof fn != 'function') return el;

            onEachEvent(events, function (name, pos) {
                (callbacks[name] = callbacks[name] || []).push(fn);
                fn.typed = pos > 0;
            });

            return el;
        });

        /**
         * Removes the given space separated list of `events` listeners
         * @param   { String } events - events ids
         * @param   { Function } fn - callback function
         * @returns { Object } el
         */
        defineProperty('off', function (events, fn) {
            if (events == '*' && !fn) callbacks = {};else {
                onEachEvent(events, function (name) {
                    if (fn) {
                        var arr = callbacks[name];
                        for (var i = 0, cb; cb = arr && arr[i]; ++i) {
                            if (cb == fn) arr.splice(i--, 1);
                        }
                    } else delete callbacks[name];
                });
            }
            return el;
        });

        /**
         * Listen to the given space separated list of `events` and execute the `callback` at most once
         * @param   { String } events - events ids
         * @param   { Function } fn - callback function
         * @returns { Object } el
         */
        defineProperty('one', function (events, fn) {
            function on() {
                el.off(events, on);
                fn.apply(el, arguments);
            }
            return el.on(events, on);
        });

        /**
         * Execute all callback functions that listen to the given space separated list of `events`
         * @param   { String } events - events ids
         * @returns { Object } el
         */
        defineProperty('trigger', function (events) {

            // getting the arguments
            // skipping the first one
            var args = slice.call(arguments, 1),
                fns;

            onEachEvent(events, function (name) {

                fns = slice.call(callbacks[name] || [], 0);

                for (var i = 0, fn; fn = fns[i]; ++i) {
                    if (fn.busy) return;
                    fn.busy = 1;
                    fn.apply(el, fn.typed ? [name].concat(args) : args);
                    if (fns[i] !== fn) {
                        i--;
                    }
                    fn.busy = 0;
                }

                if (callbacks['*'] && name != '*') el.trigger.apply(el, ['*', name].concat(args));
            });

            return el;
        });

        return el;
    }
    /* istanbul ignore next */
    ;(function (riot) {

        /**
         * Simple client-side router
         * @module riot-route
         */

        var RE_ORIGIN = /^.+?\/+[^\/]+/,
            EVENT_LISTENER = 'EventListener',
            REMOVE_EVENT_LISTENER = 'remove' + EVENT_LISTENER,
            ADD_EVENT_LISTENER = 'add' + EVENT_LISTENER,
            HAS_ATTRIBUTE = 'hasAttribute',
            REPLACE = 'replace',
            POPSTATE = 'popstate',
            HASHCHANGE = 'hashchange',
            TRIGGER = 'trigger',
            MAX_EMIT_STACK_LEVEL = 3,
            win = typeof window != 'undefined' && window,
            doc = typeof document != 'undefined' && document,
            hist = win && history,
            loc = win && (hist.location || win.location),
            // see html5-history-api
        prot = Router.prototype,
            // to minify more
        clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
            started = false,
            central = riot.observable(),
            routeFound = false,
            debouncedEmit,
            base,
            current,
            parser,
            secondParser,
            emitStack = [],
            emitStackLevel = 0;

        /**
         * Default parser. You can replace it via router.parser method.
         * @param {string} path - current path (normalized)
         * @returns {array} array
         */
        function DEFAULT_PARSER(path) {
            return path.split(/[/?#]/);
        }

        /**
         * Default parser (second). You can replace it via router.parser method.
         * @param {string} path - current path (normalized)
         * @param {string} filter - filter string (normalized)
         * @returns {array} array
         */
        function DEFAULT_SECOND_PARSER(path, filter) {
            var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
                args = path.match(re);

            if (args) return args.slice(1);
        }

        /**
         * Simple/cheap debounce implementation
         * @param   {function} fn - callback
         * @param   {number} delay - delay in seconds
         * @returns {function} debounced function
         */
        function debounce(fn, delay) {
            var t;
            return function () {
                clearTimeout(t);
                t = setTimeout(fn, delay);
            };
        }

        /**
         * Set the window listeners to trigger the routes
         * @param {boolean} autoExec - see route.start
         */
        function start(autoExec) {
            debouncedEmit = debounce(emit, 1);
            win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit);
            win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
            doc[ADD_EVENT_LISTENER](clickEvent, click);
            if (autoExec) emit(true);
        }

        /**
         * Router class
         */
        function Router() {
            this.$ = [];
            riot.observable(this); // make it observable
            central.on('stop', this.s.bind(this));
            central.on('emit', this.e.bind(this));
        }

        function normalize(path) {
            return path[REPLACE](/^\/|\/$/, '');
        }

        function isString(str) {
            return typeof str == 'string';
        }

        /**
         * Get the part after domain name
         * @param {string} href - fullpath
         * @returns {string} path from root
         */
        function getPathFromRoot(href) {
            return (href || loc.href || '')[REPLACE](RE_ORIGIN, '');
        }

        /**
         * Get the part after base
         * @param {string} href - fullpath
         * @returns {string} path from base
         */
        function getPathFromBase(href) {
            return base[0] == '#' ? (href || loc.href || '').split(base)[1] || '' : getPathFromRoot(href)[REPLACE](base, '');
        }

        function emit(force) {
            // the stack is needed for redirections
            var isRoot = emitStackLevel == 0;
            if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return;

            emitStackLevel++;
            emitStack.push(function () {
                var path = getPathFromBase();
                if (force || path != current) {
                    central[TRIGGER]('emit', path);
                    current = path;
                }
            });
            if (isRoot) {
                while (emitStack.length) {
                    emitStack[0]();
                    emitStack.shift();
                }
                emitStackLevel = 0;
            }
        }

        function click(e) {
            if (e.which != 1 // not left click
             || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
             || e.defaultPrevented // or default prevented
            ) return;

            var el = e.target;
            while (el && el.nodeName != 'A') {
                el = el.parentNode;
            }if (!el || el.nodeName != 'A' // not A tag
             || el[HAS_ATTRIBUTE]('download') // has download attr
             || !el[HAS_ATTRIBUTE]('href') // has no href attr
             || el.target && el.target != '_self' // another window or frame
             || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
            ) return;

            if (el.href != loc.href) {
                if (el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
                 || base != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
                 || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
                ) return;
            }

            e.preventDefault();
        }

        /**
         * Go to the path
         * @param {string} path - destination path
         * @param {string} title - page title
         * @param {boolean} shouldReplace - use replaceState or pushState
         * @returns {boolean} - route not found flag
         */
        function go(path, title, shouldReplace) {
            if (hist) {
                // if a browser
                path = base + normalize(path);
                title = title || doc.title;
                // browsers ignores the second parameter `title`
                shouldReplace ? hist.replaceState(null, title, path) : hist.pushState(null, title, path);
                // so we need to set it manually
                doc.title = title;
                routeFound = false;
                emit();
                return routeFound;
            }

            // Server-side usage: directly execute handlers for the path
            return central[TRIGGER]('emit', getPathFromBase(path));
        }

        /**
         * Go to path or set action
         * a single string:                go there
         * two strings:                    go there with setting a title
         * two strings and boolean:        replace history with setting a title
         * a single function:              set an action on the default route
         * a string/RegExp and a function: set an action on the route
         * @param {(string|function)} first - path / action / filter
         * @param {(string|RegExp|function)} second - title / action
         * @param {boolean} third - replace flag
         */
        prot.m = function (first, second, third) {
            if (isString(first) && (!second || isString(second))) go(first, second, third || false);else if (second) this.r(first, second);else this.r('@', first);
        };

        /**
         * Stop routing
         */
        prot.s = function () {
            this.off('*');
            this.$ = [];
        };

        /**
         * Emit
         * @param {string} path - path
         */
        prot.e = function (path) {
            this.$.concat('@').some(function (filter) {
                var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter));
                if (typeof args != 'undefined') {
                    this[TRIGGER].apply(null, [filter].concat(args));
                    return routeFound = true; // exit from loop
                }
            }, this);
        };

        /**
         * Register route
         * @param {string} filter - filter for matching to url
         * @param {function} action - action to register
         */
        prot.r = function (filter, action) {
            if (filter != '@') {
                filter = '/' + normalize(filter);
                this.$.push(filter);
            }
            this.on(filter, action);
        };

        var mainRouter = new Router();
        var route = mainRouter.m.bind(mainRouter);

        /**
         * Create a sub router
         * @returns {function} the method of a new Router object
         */
        route.create = function () {
            var newSubRouter = new Router();
            // stop only this sub-router
            newSubRouter.m.stop = newSubRouter.s.bind(newSubRouter);
            // return sub-router's main method
            return newSubRouter.m.bind(newSubRouter);
        };

        /**
         * Set the base of url
         * @param {(str|RegExp)} arg - a new base or '#' or '#!'
         */
        route.base = function (arg) {
            base = arg || '#';
            current = getPathFromBase(); // recalculate current path
        };

        /** Exec routing right now **/
        route.exec = function () {
            emit(true);
        };

        /**
         * Replace the default router to yours
         * @param {function} fn - your parser function
         * @param {function} fn2 - your secondParser function
         */
        route.parser = function (fn, fn2) {
            if (!fn && !fn2) {
                // reset parser for testing...
                parser = DEFAULT_PARSER;
                secondParser = DEFAULT_SECOND_PARSER;
            }
            if (fn) parser = fn;
            if (fn2) secondParser = fn2;
        };

        /**
         * Helper function to get url query as an object
         * @returns {object} parsed query
         */
        route.query = function () {
            var q = {};
            var href = loc.href || current;
            href[REPLACE](/[?&](.+?)=([^&]*)/g, function (_, k, v) {
                q[k] = v;
            });
            return q;
        };

        /** Stop routing **/
        route.stop = function () {
            if (started) {
                if (win) {
                    win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit);
                    win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit);
                    doc[REMOVE_EVENT_LISTENER](clickEvent, click);
                }
                central[TRIGGER]('stop');
                started = false;
            }
        };

        /**
         * Start routing
         * @param {boolean} autoExec - automatically exec after starting if true
         */
        route.start = function (autoExec) {
            if (!started) {
                if (win) {
                    if (document.readyState == 'complete') start(autoExec);
                    // the timeout is needed to solve
                    // a weird safari bug https://github.com/riot/route/issues/33
                    else win[ADD_EVENT_LISTENER]('load', function () {
                            setTimeout(function () {
                                start(autoExec);
                            }, 1);
                        });
                }
                started = true;
            }
        };

        /** Prepare the router **/
        route.base();
        route.parser();

        riot.route = route;
    })(riot);
    /* istanbul ignore next */

    /**
     * The riot template engine
     * @version v2.3.21
     */

    /**
     * riot.util.brackets
     *
     * - `brackets    ` - Returns a string or regex based on its parameter
     * - `brackets.set` - Change the current riot brackets
     *
     * @module
     */

    var brackets = function (UNDEF) {

        var REGLOB = 'g',
            R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
            R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,
            S_QBLOCKS = R_STRINGS.source + '|' + /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' + /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,
            FINDBRACES = {
            '(': RegExp('([()])|' + S_QBLOCKS, REGLOB),
            '[': RegExp('([[\\]])|' + S_QBLOCKS, REGLOB),
            '{': RegExp('([{}])|' + S_QBLOCKS, REGLOB)
        },
            DEFAULT = '{ }';

        var _pairs = ['{', '}', '{', '}', /{[^}]*}/, /\\([{}])/g, /\\({)|{/g, RegExp('\\\\(})|([[({])|(})|' + S_QBLOCKS, REGLOB), DEFAULT, /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/, /(^|[^\\]){=[\S\s]*?}/];

        var cachedBrackets = UNDEF,
            _regex,
            _cache = [],
            _settings;

        function _loopback(re) {
            return re;
        }

        function _rewrite(re, bp) {
            if (!bp) bp = _cache;
            return new RegExp(re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : '');
        }

        function _create(pair) {
            if (pair === DEFAULT) return _pairs;

            var arr = pair.split(' ');

            if (arr.length !== 2 || /[\x00-\x1F<>a-zA-Z0-9'",;\\]/.test(pair)) {
                throw new Error('Unsupported brackets "' + pair + '"');
            }
            arr = arr.concat(pair.replace(/(?=[[\]()*+?.^$|])/g, '\\').split(' '));

            arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
            arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
            arr[6] = _rewrite(_pairs[6], arr);
            arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCKS, REGLOB);
            arr[8] = pair;
            return arr;
        }

        function _brackets(reOrIdx) {
            return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx];
        }

        _brackets.split = function split(str, tmpl, _bp) {
            // istanbul ignore next: _bp is for the compiler
            if (!_bp) _bp = _cache;

            var parts = [],
                match,
                isexpr,
                start,
                pos,
                re = _bp[6];

            isexpr = start = re.lastIndex = 0;

            while (match = re.exec(str)) {

                pos = match.index;

                if (isexpr) {

                    if (match[2]) {
                        re.lastIndex = skipBraces(str, match[2], re.lastIndex);
                        continue;
                    }
                    if (!match[3]) continue;
                }

                if (!match[1]) {
                    unescapeStr(str.slice(start, pos));
                    start = re.lastIndex;
                    re = _bp[6 + (isexpr ^= 1)];
                    re.lastIndex = start;
                }
            }

            if (str && start < str.length) {
                unescapeStr(str.slice(start));
            }

            return parts;

            function unescapeStr(s) {
                if (tmpl || isexpr) parts.push(s && s.replace(_bp[5], '$1'));else parts.push(s);
            }

            function skipBraces(s, ch, ix) {
                var match,
                    recch = FINDBRACES[ch];

                recch.lastIndex = ix;
                ix = 1;
                while (match = recch.exec(s)) {
                    if (match[1] && !(match[1] === ch ? ++ix : --ix)) break;
                }
                return ix ? s.length : recch.lastIndex;
            }
        };

        _brackets.hasExpr = function hasExpr(str) {
            return _cache[4].test(str);
        };

        _brackets.loopKeys = function loopKeys(expr) {
            var m = expr.match(_cache[9]);
            return m ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] } : { val: expr.trim() };
        };

        _brackets.hasRaw = function (src) {
            return _cache[10].test(src);
        };

        _brackets.array = function array(pair) {
            return pair ? _create(pair) : _cache;
        };

        function _reset(pair) {
            if ((pair || (pair = DEFAULT)) !== _cache[8]) {
                _cache = _create(pair);
                _regex = pair === DEFAULT ? _loopback : _rewrite;
                _cache[9] = _regex(_pairs[9]);
                _cache[10] = _regex(_pairs[10]);
            }
            cachedBrackets = pair;
        }

        function _setSettings(o) {
            var b;
            o = o || {};
            b = o.brackets;
            Object.defineProperty(o, 'brackets', {
                set: _reset,
                get: function get() {
                    return cachedBrackets;
                },
                enumerable: true
            });
            _settings = o;
            _reset(b);
        }

        Object.defineProperty(_brackets, 'settings', {
            set: _setSettings,
            get: function get() {
                return _settings;
            }
        });

        /* istanbul ignore next: in the browser riot is always in the scope */
        _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
        _brackets.set = _reset;

        _brackets.R_STRINGS = R_STRINGS;
        _brackets.R_MLCOMMS = R_MLCOMMS;
        _brackets.S_QBLOCKS = S_QBLOCKS;

        return _brackets;
    }();

    /**
     * @module tmpl
     *
     * tmpl          - Root function, returns the template value, render with data
     * tmpl.hasExpr  - Test the existence of a expression inside a string
     * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
     */

    var tmpl = function () {

        var _cache = {};

        function _tmpl(str, data) {
            if (!str) return str;

            return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr);
        }

        _tmpl.haveRaw = brackets.hasRaw;

        _tmpl.hasExpr = brackets.hasExpr;

        _tmpl.loopKeys = brackets.loopKeys;

        _tmpl.errorHandler = null;

        function _logErr(err, ctx) {

            if (_tmpl.errorHandler) {

                err.riotData = {
                    tagName: ctx && ctx.root && ctx.root.tagName,
                    _riot_id: ctx && ctx._riot_id //eslint-disable-line camelcase
                };
                _tmpl.errorHandler(err);
            }
        }

        function _create(str) {

            var expr = _getTmpl(str);
            if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr;

            return new Function('E', expr + ';');
        }

        var RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
            RE_QBMARK = /\x01(\d+)~/g;

        function _getTmpl(str) {
            var qstr = [],
                expr,
                parts = brackets.split(str.replace(/\u2057/g, '"'), 1);

            if (parts.length > 2 || parts[0]) {
                var i,
                    j,
                    list = [];

                for (i = j = 0; i < parts.length; ++i) {

                    expr = parts[i];

                    if (expr && (expr = i & 1 ? _parseExpr(expr, 1, qstr) : '"' + expr.replace(/\\/g, '\\\\').replace(/\r\n?|\n/g, '\\n').replace(/"/g, '\\"') + '"')) list[j++] = expr;
                }

                expr = j < 2 ? list[0] : '[' + list.join(',') + '].join("")';
            } else {

                expr = _parseExpr(parts[1], 0, qstr);
            }

            if (qstr[0]) expr = expr.replace(RE_QBMARK, function (_, pos) {
                return qstr[pos].replace(/\r/g, '\\r').replace(/\n/g, '\\n');
            });

            return expr;
        }

        var RE_BREND = {
            '(': /[()]/g,
            '[': /[[\]]/g,
            '{': /[{}]/g
        },
            CS_IDENT = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\x01(\d+)~):/;

        function _parseExpr(expr, asText, qstr) {

            if (expr[0] === '=') expr = expr.slice(1);

            expr = expr.replace(RE_QBLOCK, function (s, div) {
                return s.length > 2 && !div ? '\x01' + (qstr.push(s) - 1) + '~' : s;
            }).replace(/\s+/g, ' ').trim().replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

            if (expr) {
                var list = [],
                    cnt = 0,
                    match;

                while (expr && (match = expr.match(CS_IDENT)) && !match.index) {
                    var key,
                        jsb,
                        re = /,|([[{(])|$/g;

                    expr = RegExp.rightContext;
                    key = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];

                    while (jsb = (match = re.exec(expr))[1]) {
                        skipBraces(jsb, re);
                    }jsb = expr.slice(0, match.index);
                    expr = RegExp.rightContext;

                    list[cnt++] = _wrapExpr(jsb, 1, key);
                }

                expr = !cnt ? _wrapExpr(expr, asText) : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0];
            }
            return expr;

            function skipBraces(ch, re) {
                var mm,
                    lv = 1,
                    ir = RE_BREND[ch];

                ir.lastIndex = re.lastIndex;
                while (mm = ir.exec(expr)) {
                    if (mm[0] === ch) ++lv;else if (! --lv) break;
                }
                re.lastIndex = lv ? expr.length : ir.lastIndex;
            }
        }

        // istanbul ignore next: not both
        var JS_CONTEXT = '"in this?this:' + ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) !== 'object' ? 'global' : 'window') + ').',
            JS_VARNAME = /[,{][$\w]+:|(^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
            JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

        function _wrapExpr(expr, asText, key) {
            var tb;

            expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
                if (mvar) {
                    pos = tb ? 0 : pos + match.length;

                    if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
                        match = p + '("' + mvar + JS_CONTEXT + mvar;
                        if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '[';
                    } else if (pos) {
                        tb = !JS_NOPROPS.test(s.slice(pos));
                    }
                }
                return match;
            });

            if (tb) {
                expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
            }

            if (key) {

                expr = (tb ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')') + '?"' + key + '":""';
            } else if (asText) {

                expr = 'function(v){' + (tb ? expr.replace('return ', 'v=') : 'v=(' + expr + ')') + ';return v||v===0?v:""}.call(this)';
            }

            return expr;
        }

        // istanbul ignore next: compatibility fix for beta versions
        _tmpl.parse = function (s) {
            return s;
        };

        _tmpl.version = brackets.version = 'v2.3.21';

        return _tmpl;
    }();

    /*
     lib/browser/tag/mkdom.js
       Includes hacks needed for the Internet Explorer version 9 and below
     See: http://kangax.github.io/compat-table/es5/#ie8
     http://codeplanet.io/dropping-ie8/
     */
    var mkdom = function (checkIE) {

        var reToSrc = /<yield\s+to=(['"])?@\1\s*>([\S\s]+?)<\/yield\s*>/.source,
            rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' },
            GENERIC = 'div';

        checkIE = checkIE && checkIE < 10;
        var tblTags = checkIE ? SPECIAL_TAGS_REGEX : /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;

        // creates any dom element in a div, table, or colgroup container
        function _mkdom(templ, html) {

            var match = templ && templ.match(/^\s*<([-\w]+)/),
                tagName = match && match[1].toLowerCase(),
                el = mkEl(GENERIC);

            // replace all the yield tags with the tag inner html
            templ = replaceYield(templ, html || '');

            /* istanbul ignore next */
            //if ((checkIE || !startsWith(tagName, 'opt')) && SPECIAL_TAGS_REGEX.test(tagName))
            if (tblTags.test(tagName)) el = specialTags(el, templ, tagName);else el.innerHTML = templ;

            el.stub = true;

            return el;
        }

        // creates the root element for table and select child elements
        // tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
        function specialTags(el, templ, tagName) {
            var select = tagName[0] === 'o',
                parent = select ? 'select>' : 'table>';

            // trim() is important here, this ensures we don't have artifacts,
            // so we can check if we have only one element inside the parent
            el.innerHTML = '<' + parent + templ.trim() + '</' + parent;
            parent = el.firstChild;

            // returns the immediate parent if tr/th/td/col is the only element, if not
            // returns the whole tree, as this can include additional elements
            if (select) {
                parent.selectedIndex = -1; // for IE9, compatible w/current riot behavior
            } else {
                    var tname = rootEls[tagName];
                    if (tname && parent.children.length === 1) parent = $(tname, parent);
                }
            return parent;
        }

        /**
         * Replace the yield tag from any tag template with the innerHTML of the
         * original tag in the page
         * @param   { String } templ - tag implementation template
         * @param   { String } html  - original content of the tag in the DOM
         * @returns { String } tag template updated without the yield tag
         */
        function replaceYield(templ, html) {
            // do nothing if no yield
            if (!/<yield\b/i.test(templ)) return templ;

            // be careful with #1343 - string on the source having `$1`
            var n = 0;
            templ = templ.replace(/<yield\s+from=['"]([-\w]+)['"]\s*(?:\/>|>\s*<\/yield\s*>)/ig, function (str, ref) {
                var m = html.match(RegExp(reToSrc.replace('@', ref), 'i'));
                ++n;
                return m && m[2] || '';
            });

            // yield without any "from", replace yield in templ with the innerHTML
            return n ? templ : templ.replace(/<yield\s*(?:\/>|>\s*<\/yield\s*>)/gi, html);
        }

        return _mkdom;
    }(IE_VERSION);

    /**
     * Convert the item looped into an object used to extend the child tag properties
     * @param   { Object } expr - object containing the keys used to extend the children tags
     * @param   { * } key - value to assign to the new object returned
     * @param   { * } val - value containing the position of the item in the array
     * @returns { Object } - new object containing the values of the original item
     *
     * The variables 'key' and 'val' are arbitrary.
     * They depend on the collection type looped (Array, Object)
     * and on the expression used on the each tag
     *
     */
    function mkitem(expr, key, val) {
        var item = {};
        item[expr.key] = key;
        if (expr.pos) item[expr.pos] = val;
        return item;
    }

    /**
     * Unmount the redundant tags
     * @param   { Array } items - array containing the current items to loop
     * @param   { Array } tags - array containing all the children tags
     */
    function unmountRedundant(items, tags) {

        var i = tags.length,
            j = items.length,
            t;

        while (i > j) {
            t = tags[--i];
            tags.splice(i, 1);
            t.unmount();
        }
    }

    /**
     * Move the nested custom tags in non custom loop tags
     * @param   { Object } child - non custom loop tag
     * @param   { Number } i - current position of the loop tag
     */
    function moveNestedTags(child, i) {
        Object.keys(child.tags).forEach(function (tagName) {
            var tag = child.tags[tagName];
            if (isArray(tag)) each(tag, function (t) {
                moveChildTag(t, tagName, i);
            });else moveChildTag(tag, tagName, i);
        });
    }

    /**
     * Adds the elements for a virtual tag
     * @param { Tag } tag - the tag whose root's children will be inserted or appended
     * @param { Node } src - the node that will do the inserting or appending
     * @param { Tag } target - only if inserting, insert before this tag's first child
     */
    function addVirtual(tag, src, target) {
        var el = tag._root,
            sib;
        tag._virts = [];
        while (el) {
            sib = el.nextSibling;
            if (target) src.insertBefore(el, target._root);else src.appendChild(el);

            tag._virts.push(el); // hold for unmounting
            el = sib;
        }
    }

    /**
     * Move virtual tag and all child nodes
     * @param { Tag } tag - first child reference used to start move
     * @param { Node } src  - the node that will do the inserting
     * @param { Tag } target - insert before this tag's first child
     * @param { Number } len - how many child nodes to move
     */
    function moveVirtual(tag, src, target, len) {
        var el = tag._root,
            sib,
            i = 0;
        for (; i < len; i++) {
            sib = el.nextSibling;
            src.insertBefore(el, target._root);
            el = sib;
        }
    }

    /**
     * Manage tags having the 'each'
     * @param   { Object } dom - DOM node we need to loop
     * @param   { Tag } parent - parent tag instance where the dom node is contained
     * @param   { String } expr - string contained in the 'each' attribute
     */
    function _each(dom, parent, expr) {

        // remove the each property from the original tag
        remAttr(dom, 'each');

        var mustReorder = _typeof(getAttr(dom, 'no-reorder')) !== T_STRING || remAttr(dom, 'no-reorder'),
            tagName = getTagName(dom),
            impl = __tagImpl[tagName] || { tmpl: dom.outerHTML },
            useRoot = SPECIAL_TAGS_REGEX.test(tagName),
            root = dom.parentNode,
            ref = document.createTextNode(''),
            child = getTag(dom),
            isOption = /^option$/i.test(tagName),
            // the option tags must be treated differently
        tags = [],
            oldItems = [],
            hasKeys,
            isVirtual = dom.tagName == 'VIRTUAL';

        // parse the each expression
        expr = tmpl.loopKeys(expr);

        // insert a marked where the loop tags will be injected
        root.insertBefore(ref, dom);

        // clean template code
        parent.one('before-mount', function () {

            // remove the original DOM node
            dom.parentNode.removeChild(dom);
            if (root.stub) root = parent.root;
        }).on('update', function () {
            // get the new items collection
            var items = tmpl(expr.val, parent),

            // create a fragment to hold the new DOM nodes to inject in the parent tag
            frag = document.createDocumentFragment();

            // object loop. any changes cause full redraw
            if (!isArray(items)) {
                hasKeys = items || false;
                items = hasKeys ? Object.keys(items).map(function (key) {
                    return mkitem(expr, key, items[key]);
                }) : [];
            }

            // loop all the new items
            items.forEach(function (item, i) {
                // reorder only if the items are objects
                var _mustReorder = mustReorder && item instanceof Object,
                    oldPos = oldItems.indexOf(item),
                    pos = ~oldPos && _mustReorder ? oldPos : i,

                // does a tag exist in this position?
                tag = tags[pos];

                item = !hasKeys && expr.key ? mkitem(expr, item, i) : item;

                // new tag
                if (!_mustReorder && !tag // with no-reorder we just update the old tags
                 || _mustReorder && ! ~oldPos || !tag // by default we always try to reorder the DOM elements
                ) {

                        tag = new Tag(impl, {
                            parent: parent,
                            isLoop: true,
                            hasImpl: !!__tagImpl[tagName],
                            root: useRoot ? root : dom.cloneNode(),
                            item: item
                        }, dom.innerHTML);

                        tag.mount();
                        if (isVirtual) tag._root = tag.root.firstChild; // save reference for further moves or inserts
                        // this tag must be appended
                        if (i == tags.length) {
                            if (isVirtual) addVirtual(tag, frag);else frag.appendChild(tag.root);
                        }
                        // this tag must be insert
                        else {
                                if (isVirtual) addVirtual(tag, root, tags[i]);else root.insertBefore(tag.root, tags[i].root);
                                oldItems.splice(i, 0, item);
                            }

                        tags.splice(i, 0, tag);
                        pos = i; // handled here so no move
                    } else tag.update(item);

                // reorder the tag if it's not located in its previous position
                if (pos !== i && _mustReorder) {
                    // update the DOM
                    if (isVirtual) moveVirtual(tag, root, tags[i], dom.childNodes.length);else root.insertBefore(tag.root, tags[i].root);
                    // update the position attribute if it exists
                    if (expr.pos) tag[expr.pos] = i;
                    // move the old tag instance
                    tags.splice(i, 0, tags.splice(pos, 1)[0]);
                    // move the old item
                    oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
                    // if the loop tags are not custom
                    // we need to move all their custom tags into the right position
                    if (!child && tag.tags) moveNestedTags(tag, i);
                }

                // cache the original item to use it in the events bound to this node
                // and its children
                tag._item = item;
                // cache the real parent tag internally
                defineProperty(tag, '_parent', parent);
            });

            // remove the redundant tags
            unmountRedundant(items, tags);

            // insert the new nodes
            if (isOption) root.appendChild(frag);else root.insertBefore(frag, ref);

            // set the 'tags' property of the parent tag
            // if child is 'undefined' it means that we don't need to set this property
            // for example:
            // we don't need store the `myTag.tags['div']` property if we are looping a div tag
            // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
            if (child) parent.tags[tagName] = tags;

            // clone the items array
            oldItems = items.slice();
        });
    }
    /**
     * Object that will be used to inject and manage the css of every tag instance
     */
    var styleManager = function (_riot) {

        if (!window) return { // skip injection on the server
            add: function add() {},
            inject: function inject() {}
        };

        var styleNode = function () {
            // create a new style element with the correct type
            var newNode = mkEl('style');
            setAttr(newNode, 'type', 'text/css');

            // replace any user node or insert the new one into the head
            var userNode = $('style[type=riot]');
            if (userNode) {
                if (userNode.id) newNode.id = userNode.id;
                userNode.parentNode.replaceChild(newNode, userNode);
            } else document.getElementsByTagName('head')[0].appendChild(newNode);

            return newNode;
        }();

        // Create cache and shortcut to the correct property
        var cssTextProp = styleNode.styleSheet,
            stylesToInject = '';

        // Expose the style node in a non-modificable property
        Object.defineProperty(_riot, 'styleNode', {
            value: styleNode,
            writable: true
        });

        /**
         * Public api
         */
        return {
            /**
             * Save a tag style to be later injected into DOM
             * @param   { String } css [description]
             */
            add: function add(css) {
                stylesToInject += css;
            },
            /**
             * Inject all previously saved tag styles into DOM
             * innerHTML seems slow: http://jsperf.com/riot-insert-style
             */
            inject: function inject() {
                if (stylesToInject) {
                    if (cssTextProp) cssTextProp.cssText += stylesToInject;else styleNode.innerHTML += stylesToInject;
                    stylesToInject = '';
                }
            }
        };
    }(riot);

    function parseNamedElements(root, tag, childTags, forceParsingNamed) {

        walk(root, function (dom) {
            if (dom.nodeType == 1) {
                dom.isLoop = dom.isLoop || dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each') ? 1 : 0;

                // custom child tag
                if (childTags) {
                    var child = getTag(dom);

                    if (child && !dom.isLoop) childTags.push(initChildTag(child, { root: dom, parent: tag }, dom.innerHTML, tag));
                }

                if (!dom.isLoop || forceParsingNamed) setNamed(dom, tag, []);
            }
        });
    }

    function parseExpressions(root, tag, expressions) {

        function addExpr(dom, val, extra) {
            if (tmpl.hasExpr(val)) {
                expressions.push(extend({ dom: dom, expr: val }, extra));
            }
        }

        walk(root, function (dom) {
            var type = dom.nodeType,
                attr;

            // text node
            if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue);
            if (type != 1) return;

            /* element */

            // loop
            attr = getAttr(dom, 'each');

            if (attr) {
                _each(dom, tag, attr);return false;
            }

            // attribute expressions
            each(dom.attributes, function (attr) {
                var name = attr.name,
                    bool = name.split('__')[1];

                addExpr(dom, attr.value, { attr: bool || name, bool: bool });
                if (bool) {
                    remAttr(dom, name);return false;
                }
            });

            // skip custom tags
            if (getTag(dom)) return false;
        });
    }
    function Tag(impl, conf, innerHTML) {

        var self = riot.observable(this),
            opts = inherit(conf.opts) || {},
            parent = conf.parent,
            isLoop = conf.isLoop,
            hasImpl = conf.hasImpl,
            item = cleanUpData(conf.item),
            expressions = [],
            childTags = [],
            root = conf.root,
            fn = impl.fn,
            tagName = root.tagName.toLowerCase(),
            attr = {},
            propsInSyncWithParent = [],
            dom;

        if (fn && root._tag) root._tag.unmount(true);

        // not yet mounted
        this.isMounted = false;
        root.isLoop = isLoop;

        // keep a reference to the tag just created
        // so we will be able to mount this tag multiple times
        root._tag = this;

        // create a unique id to this tag
        // it could be handy to use it also to improve the virtual dom rendering speed
        defineProperty(this, '_riot_id', ++__uid); // base 1 allows test !t._riot_id

        extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item);

        // grab attributes
        each(root.attributes, function (el) {
            var val = el.value;
            // remember attributes with expressions only
            if (tmpl.hasExpr(val)) attr[el.name] = val;
        });

        dom = mkdom(impl.tmpl, innerHTML);

        // options
        function updateOpts() {
            var ctx = hasImpl && isLoop ? self : parent || self;

            // update opts from current DOM attributes
            each(root.attributes, function (el) {
                var val = el.value;
                opts[toCamel(el.name)] = tmpl.hasExpr(val) ? tmpl(val, ctx) : val;
            });
            // recover those with expressions
            each(Object.keys(attr), function (name) {
                opts[toCamel(name)] = tmpl(attr[name], ctx);
            });
        }

        function normalizeData(data) {
            for (var key in item) {
                if (_typeof(self[key]) !== T_UNDEF && isWritable(self, key)) self[key] = data[key];
            }
        }

        function inheritFromParent() {
            if (!self.parent || !isLoop) return;
            each(Object.keys(self.parent), function (k) {
                // some properties must be always in sync with the parent tag
                var mustSync = !contains(RESERVED_WORDS_BLACKLIST, k) && contains(propsInSyncWithParent, k);
                if (_typeof(self[k]) === T_UNDEF || mustSync) {
                    // track the property to keep in sync
                    // so we can keep it updated
                    if (!mustSync) propsInSyncWithParent.push(k);
                    self[k] = self.parent[k];
                }
            });
        }

        defineProperty(this, 'update', function (data) {

            // make sure the data passed will not override
            // the component core methods
            data = cleanUpData(data);
            // inherit properties from the parent
            inheritFromParent();
            // normalize the tag properties in case an item object was initially passed
            if (data && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === T_OBJECT) {
                normalizeData(data);
                item = data;
            }
            extend(self, data);
            updateOpts();
            self.trigger('update', data);
            update(expressions, self);
            // the updated event will be triggered
            // once the DOM will be ready and all the reflows are completed
            // this is useful if you want to get the "real" root properties
            // 4 ex: root.offsetWidth ...
            rAF(function () {
                self.trigger('updated');
            });
            return this;
        });

        defineProperty(this, 'mixin', function () {
            each(arguments, function (mix) {
                var instance;

                mix = (typeof mix === 'undefined' ? 'undefined' : _typeof(mix)) === T_STRING ? riot.mixin(mix) : mix;

                // check if the mixin is a function
                if (isFunction(mix)) {
                    // create the new mixin instance
                    instance = new mix();
                    // save the prototype to loop it afterwards
                    mix = mix.prototype;
                } else instance = mix;

                // loop the keys in the function prototype or the all object keys
                each(Object.getOwnPropertyNames(mix), function (key) {
                    // bind methods to self
                    if (key != 'init') self[key] = isFunction(instance[key]) ? instance[key].bind(self) : instance[key];
                });

                // init method will be called automatically
                if (instance.init) instance.init.bind(self)();
            });
            return this;
        });

        defineProperty(this, 'mount', function _callee2() {
            return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                    case 0:

                        updateOpts();

                        // initialiation

                        if (!fn) {
                            _context2.next = 4;
                            break;
                        }

                        _context2.next = 4;
                        return regeneratorRuntime.awrap(function _callee() {
                            var ret, _fn;

                            return regeneratorRuntime.async(function _callee$(_context) {
                                while (1) switch (_context.prev = _context.next) {
                                    case 0:
                                        ret = fn.call(self, opts);

                                        if (!(ret && ret.then)) {
                                            _context.next = 5;
                                            break;
                                        }

                                        _fn = function _fn() {
                                            return ret;
                                        };

                                        _context.next = 5;
                                        return regeneratorRuntime.awrap(_fn());

                                    case 5:
                                    case 'end':
                                        return _context.stop();
                                }
                            }, null, this);
                        }());

                    case 4:

                        // parse layout after init. fn may calculate args for nested custom tags
                        parseExpressions(dom, self, expressions);

                        // mount the child tags
                        toggle(true);

                        // update the root adding custom attributes coming from the compiler
                        // it fixes also #1087
                        if (impl.attrs || hasImpl) {
                            walkAttributes(impl.attrs, function (k, v) {
                                setAttr(root, k, v);
                            });
                            parseExpressions(self.root, self, expressions);
                        }

                        if (!self.parent || isLoop) self.update(item);

                        // internal use only, fixes #403
                        self.trigger('before-mount');

                        if (isLoop && !hasImpl) {
                            // update the root attribute for the looped elements
                            self.root = root = dom.firstChild;
                        } else {
                            while (dom.firstChild) {
                                root.appendChild(dom.firstChild);
                            }if (root.stub) self.root = root = parent.root;
                        }

                        // parse the named dom nodes in the looped child
                        // adding them to the parent as well
                        if (isLoop) parseNamedElements(self.root, self.parent, null, true);

                        // if it's not a child tag we can trigger its mount event
                        if (!self.parent || self.parent.isMounted) {
                            self.isMounted = true;
                            self.on('mount', self.update);
                            self.trigger('mount');
                        }
                        // otherwise we need to wait that the parent event gets triggered
                        else self.parent.one('mount', function () {
                                // avoid to trigger the `mount` event for the tags
                                // not visible included in an if statement
                                if (!isInStub(self.root)) {
                                    self.parent.isMounted = self.isMounted = true;
                                    self.on('mount', self.update);
                                    self.trigger('mount');
                                }
                            });

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }, null, this);
        });

        defineProperty(this, 'unmount', function (keepRootTag) {
            var el = root,
                p = el.parentNode,
                ptag,
                tagIndex = __virtualDom.indexOf(self);

            self.trigger('before-unmount');

            // remove this tag instance from the global virtualDom variable
            if (~tagIndex) __virtualDom.splice(tagIndex, 1);

            if (this._virts) {
                each(this._virts, function (v) {
                    if (v.parentNode) v.parentNode.removeChild(v);
                });
            }

            if (p) {

                if (parent) {
                    ptag = getImmediateCustomParentTag(parent);
                    // remove this tag from the parent tags object
                    // if there are multiple nested tags with same name..
                    // remove this element form the array
                    if (isArray(ptag.tags[tagName])) each(ptag.tags[tagName], function (tag, i) {
                        if (tag._riot_id == self._riot_id) ptag.tags[tagName].splice(i, 1);
                    });else
                        // otherwise just delete the tag instance
                        ptag.tags[tagName] = undefined;
                } else while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }if (!keepRootTag) p.removeChild(el);else
                    // the riot-tag attribute isn't needed anymore, remove it
                    remAttr(p, 'riot-tag');
            }

            self.trigger('unmount');
            toggle();
            self.off('*');
            self.isMounted = false;
            delete root._tag;
        });

        function toggle(isMount) {

            // mount/unmount children
            each(childTags, function (child) {
                child[isMount ? 'mount' : 'unmount']();
            });

            // listen/unlisten parent (events flow one way from parent to children)
            if (!parent) return;
            var evt = isMount ? 'on' : 'off';

            // the loop tags will be always in sync with the parent automatically
            if (isLoop) parent[evt]('unmount', self.unmount);else parent[evt]('update', self.update)[evt]('unmount', self.unmount);
        }

        // named elements available for fn
        parseNamedElements(dom, this, childTags);
    }
    /**
     * Attach an event to a DOM node
     * @param { String } name - event name
     * @param { Function } handler - event callback
     * @param { Object } dom - dom node
     * @param { Tag } tag - tag instance
     */
    function setEventHandler(name, handler, dom, tag) {

        dom[name] = function (e) {

            var ptag = tag._parent,
                item = tag._item,
                el;

            if (!item) while (ptag && !item) {
                item = ptag._item;
                ptag = ptag._parent;
            }

            // cross browser event fix
            e = e || window.event;

            // override the event properties
            if (isWritable(e, 'currentTarget')) e.currentTarget = dom;
            if (isWritable(e, 'target')) e.target = e.srcElement;
            if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode;

            e.item = item;

            // prevent default behaviour (by default)
            if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
                if (e.preventDefault) e.preventDefault();
                e.returnValue = false;
            }

            if (!e.preventUpdate) {
                el = item ? getImmediateCustomParentTag(ptag) : tag;
                el.update();
            }
        };
    }

    /**
     * Insert a DOM node replacing another one (used by if- attribute)
     * @param   { Object } root - parent node
     * @param   { Object } node - node replaced
     * @param   { Object } before - node added
     */
    function insertTo(root, node, before) {
        if (!root) return;
        root.insertBefore(before, node);
        root.removeChild(node);
    }

    /**
     * Update the expressions in a Tag instance
     * @param   { Array } expressions - expression that must be re evaluated
     * @param   { Tag } tag - tag instance
     */
    function update(expressions, tag) {

        each(expressions, function (expr, i) {

            var dom = expr.dom,
                attrName = expr.attr,
                value = tmpl(expr.expr, tag),
                parent = expr.dom.parentNode;

            if (expr.bool) value = value ? attrName : false;else if (value == null) value = '';

            // leave out riot- prefixes from strings inside textarea
            // fix #815: any value -> string
            if (parent && parent.tagName == 'TEXTAREA') {
                value = ('' + value).replace(/riot-/g, '');
                // change textarea's value
                parent.value = value;
            }

            // no change
            if (expr.value === value) return;
            expr.value = value;

            // text node
            if (!attrName) {
                dom.nodeValue = '' + value; // #815 related
                return;
            }

            // remove original attribute
            remAttr(dom, attrName);
            // event handler
            if (isFunction(value)) {
                setEventHandler(attrName, value, dom, tag);

                // if- conditional
            } else if (attrName == 'if') {
                    var stub = expr.stub,
                        add = function add() {
                        insertTo(stub.parentNode, stub, dom);
                    },
                        remove = function remove() {
                        insertTo(dom.parentNode, dom, stub);
                    };

                    // add to DOM
                    if (value) {
                        if (stub) {
                            add();
                            dom.inStub = false;
                            // avoid to trigger the mount event if the tags is not visible yet
                            // maybe we can optimize this avoiding to mount the tag at all
                            if (!isInStub(dom)) {
                                walk(dom, function (el) {
                                    if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount');
                                });
                            }
                        }
                        // remove from DOM
                    } else {
                            stub = expr.stub = stub || document.createTextNode('');
                            // if the parentNode is defined we can easily replace the tag
                            if (dom.parentNode) remove();
                            // otherwise we need to wait the updated event
                            else (tag.parent || tag).one('updated', remove);

                            dom.inStub = true;
                        }
                    // show / hide
                } else if (/^(show|hide)$/.test(attrName)) {
                        if (attrName == 'hide') value = !value;
                        dom.style.display = value ? '' : 'none';

                        // field value
                    } else if (attrName == 'value') {
                            dom.value = value;

                            // <img src="{ expr }">
                        } else if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
                                if (value) setAttr(dom, attrName.slice(RIOT_PREFIX.length), value);
                            } else {
                                if (expr.bool) {
                                    dom[attrName] = value;
                                    if (!value) return;
                                }

                                if (value === 0 || value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== T_OBJECT) setAttr(dom, attrName, value);
                            }
        });
    }
    /**
     * Specialized function for looping an array-like collection with `each={}`
     * @param   { Array } els - collection of items
     * @param   {Function} fn - callback function
     * @returns { Array } the array looped
     */
    function each(els, fn) {
        var len = els ? els.length : 0;

        for (var i = 0, el; i < len; i++) {
            el = els[i];
            // return false -> current item was removed by fn during the loop
            if (el != null && fn(el, i) === false) i--;
        }
        return els;
    }

    /**
     * Detect if the argument passed is a function
     * @param   { * } v - whatever you want to pass to this function
     * @returns { Boolean } -
     */
    function isFunction(v) {
        return (typeof v === 'undefined' ? 'undefined' : _typeof(v)) === T_FUNCTION || false; // avoid IE problems
    }

    /**
     * Remove any DOM attribute from a node
     * @param   { Object } dom - DOM node we want to update
     * @param   { String } name - name of the property we want to remove
     */
    function remAttr(dom, name) {
        dom.removeAttribute(name);
    }

    /**
     * Convert a string containing dashes to camel case
     * @param   { String } string - input string
     * @returns { String } my-string -> myString
     */
    function toCamel(string) {
        return string.replace(/-(\w)/g, function (_, c) {
            return c.toUpperCase();
        });
    }

    /**
     * Get the value of any DOM attribute on a node
     * @param   { Object } dom - DOM node we want to parse
     * @param   { String } name - name of the attribute we want to get
     * @returns { String | undefined } name of the node attribute whether it exists
     */
    function getAttr(dom, name) {
        return dom.getAttribute(name);
    }

    /**
     * Set any DOM attribute
     * @param { Object } dom - DOM node we want to update
     * @param { String } name - name of the property we want to set
     * @param { String } val - value of the property we want to set
     */
    function setAttr(dom, name, val) {
        dom.setAttribute(name, val);
    }

    /**
     * Detect the tag implementation by a DOM node
     * @param   { Object } dom - DOM node we need to parse to get its tag implementation
     * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
     */
    function getTag(dom) {
        return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()];
    }
    /**
     * Add a child tag to its parent into the `tags` object
     * @param   { Object } tag - child tag instance
     * @param   { String } tagName - key where the new tag will be stored
     * @param   { Object } parent - tag instance where the new child tag will be included
     */
    function addChildTag(tag, tagName, parent) {
        var cachedTag = parent.tags[tagName];

        // if there are multiple children tags having the same name
        if (cachedTag) {
            // if the parent tags property is not yet an array
            // create it adding the first cached tag
            if (!isArray(cachedTag))
                // don't add the same tag twice
                if (cachedTag !== tag) parent.tags[tagName] = [cachedTag];
            // add the new nested tag to the array
            if (!contains(parent.tags[tagName], tag)) parent.tags[tagName].push(tag);
        } else {
            parent.tags[tagName] = tag;
        }
    }

    /**
     * Move the position of a custom tag in its parent tag
     * @param   { Object } tag - child tag instance
     * @param   { String } tagName - key where the tag was stored
     * @param   { Number } newPos - index where the new tag will be stored
     */
    function moveChildTag(tag, tagName, newPos) {
        var parent = tag.parent,
            tags;
        // no parent no move
        if (!parent) return;

        tags = parent.tags[tagName];

        if (isArray(tags)) tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0]);else addChildTag(tag, tagName, parent);
    }

    /**
     * Create a new child tag including it correctly into its parent
     * @param   { Object } child - child tag implementation
     * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
     * @param   { String } innerHTML - inner html of the child node
     * @param   { Object } parent - instance of the parent tag including the child custom tag
     * @returns { Object } instance of the new child tag just created
     */
    function initChildTag(child, opts, innerHTML, parent) {
        var tag = new Tag(child, opts, innerHTML),
            tagName = getTagName(opts.root),
            ptag = getImmediateCustomParentTag(parent);
        // fix for the parent attribute in the looped elements
        tag.parent = ptag;
        // store the real parent tag
        // in some cases this could be different from the custom parent tag
        // for example in nested loops
        tag._parent = parent;

        // add this tag to the custom parent tag
        addChildTag(tag, tagName, ptag);
        // and also to the real parent tag
        if (ptag !== parent) addChildTag(tag, tagName, parent);
        // empty the child node once we got its template
        // to avoid that its children get compiled multiple times
        opts.root.innerHTML = '';

        return tag;
    }

    /**
     * Loop backward all the parents tree to detect the first custom parent tag
     * @param   { Object } tag - a Tag instance
     * @returns { Object } the instance of the first custom parent tag found
     */
    function getImmediateCustomParentTag(tag) {
        var ptag = tag;
        while (!getTag(ptag.root)) {
            if (!ptag.parent) break;
            ptag = ptag.parent;
        }
        return ptag;
    }

    /**
     * Helper function to set an immutable property
     * @param   { Object } el - object where the new property will be set
     * @param   { String } key - object key where the new property will be stored
     * @param   { * } value - value of the new property
     * @param   { Object } options - set the propery overriding the default options
     * @returns { Object } - the initial object
     */
    function defineProperty(el, key, value, options) {
        Object.defineProperty(el, key, extend({
            value: value,
            enumerable: false,
            writable: false,
            configurable: false
        }, options));
        return el;
    }

    /**
     * Get the tag name of any DOM node
     * @param   { Object } dom - DOM node we want to parse
     * @returns { String } name to identify this dom node in riot
     */
    function getTagName(dom) {
        var child = getTag(dom),
            namedTag = getAttr(dom, 'name'),
            tagName = namedTag && !tmpl.hasExpr(namedTag) ? namedTag : child ? child.name : dom.tagName.toLowerCase();

        return tagName;
    }

    /**
     * Extend any object with other properties
     * @param   { Object } src - source object
     * @returns { Object } the resulting extended object
     *
     * var obj = { foo: 'baz' }
     * extend(obj, {bar: 'bar', foo: 'bar'})
     * console.log(obj) => {bar: 'bar', foo: 'bar'}
     *
     */
    function extend(src) {
        var obj,
            args = arguments;
        for (var i = 1; i < args.length; ++i) {
            if (obj = args[i]) {
                for (var key in obj) {
                    // check if this property of the source object could be overridden
                    if (isWritable(src, key)) src[key] = obj[key];
                }
            }
        }
        return src;
    }

    /**
     * Check whether an array contains an item
     * @param   { Array } arr - target array
     * @param   { * } item - item to test
     * @returns { Boolean } Does 'arr' contain 'item'?
     */
    function contains(arr, item) {
        return ~arr.indexOf(item);
    }

    /**
     * Check whether an object is a kind of array
     * @param   { * } a - anything
     * @returns {Boolean} is 'a' an array?
     */
    function isArray(a) {
        return Array.isArray(a) || a instanceof Array;
    }

    /**
     * Detect whether a property of an object could be overridden
     * @param   { Object }  obj - source object
     * @param   { String }  key - object property
     * @returns { Boolean } is this property writable?
     */
    function isWritable(obj, key) {
        var props = Object.getOwnPropertyDescriptor(obj, key);
        return _typeof(obj[key]) === T_UNDEF || props && props.writable;
    }

    /**
     * With this function we avoid that the internal Tag methods get overridden
     * @param   { Object } data - options we want to use to extend the tag instance
     * @returns { Object } clean object without containing the riot internal reserved words
     */
    function cleanUpData(data) {
        if (!(data instanceof Tag) && !(data && _typeof(data.trigger) == T_FUNCTION)) return data;

        var o = {};
        for (var key in data) {
            if (!contains(RESERVED_WORDS_BLACKLIST, key)) o[key] = data[key];
        }
        return o;
    }

    /**
     * Walk down recursively all the children tags starting dom node
     * @param   { Object }   dom - starting node where we will start the recursion
     * @param   { Function } fn - callback to transform the child node just found
     */
    function walk(dom, fn) {
        if (dom) {
            // stop the recursion
            if (fn(dom) === false) return;else {
                dom = dom.firstChild;

                while (dom) {
                    walk(dom, fn);
                    dom = dom.nextSibling;
                }
            }
        }
    }

    /**
     * Minimize risk: only zero or one _space_ between attr & value
     * @param   { String }   html - html string we want to parse
     * @param   { Function } fn - callback function to apply on any attribute found
     */
    function walkAttributes(html, fn) {
        var m,
            re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;

        while (m = re.exec(html)) {
            fn(m[1].toLowerCase(), m[2] || m[3] || m[4]);
        }
    }

    /**
     * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
     * @param   { Object }  dom - DOM node we want to parse
     * @returns { Boolean } -
     */
    function isInStub(dom) {
        while (dom) {
            if (dom.inStub) return true;
            dom = dom.parentNode;
        }
        return false;
    }

    /**
     * Create a generic DOM node
     * @param   { String } name - name of the DOM node we want to create
     * @returns { Object } DOM node just created
     */
    function mkEl(name) {
        return document.createElement(name);
    }

    /**
     * Shorter and fast way to select multiple nodes in the DOM
     * @param   { String } selector - DOM selector
     * @param   { Object } ctx - DOM node where the targets of our search will is located
     * @returns { Object } dom nodes found
     */
    function $$(selector, ctx) {
        return (ctx || document).querySelectorAll(selector);
    }

    /**
     * Shorter and fast way to select a single node in the DOM
     * @param   { String } selector - unique dom selector
     * @param   { Object } ctx - DOM node where the target of our search will is located
     * @returns { Object } dom node found
     */
    function $(selector, ctx) {
        return (ctx || document).querySelector(selector);
    }

    /**
     * Simple object prototypal inheritance
     * @param   { Object } parent - parent object
     * @returns { Object } child instance
     */
    function inherit(parent) {
        function Child() {}
        Child.prototype = parent;
        return new Child();
    }

    /**
     * Get the name property needed to identify a DOM node in riot
     * @param   { Object } dom - DOM node we need to parse
     * @returns { String | undefined } give us back a string to identify this dom node
     */
    function getNamedKey(dom) {
        return getAttr(dom, 'id') || getAttr(dom, 'name');
    }

    /**
     * Set the named properties of a tag element
     * @param { Object } dom - DOM node we need to parse
     * @param { Object } parent - tag instance where the named dom element will be eventually added
     * @param { Array } keys - list of all the tag instance properties
     */
    function setNamed(dom, parent, keys) {
        // get the key value we want to add to the tag instance
        var key = getNamedKey(dom),
            isArr,

        // add the node detected to a tag instance using the named property
        add = function add(value) {
            // avoid to override the tag properties already set
            if (contains(keys, key)) return;
            // check whether this value is an array
            isArr = isArray(value);
            // if the key was never set
            if (!value)
                // set it once on the tag instance
                parent[key] = dom;
                // if it was an array and not yet set
            else if (!isArr || isArr && !contains(value, dom)) {
                    // add the dom node into the array
                    if (isArr) value.push(dom);else parent[key] = [value, dom];
                }
        };

        // skip the elements with no named properties
        if (!key) return;

        // check whether this key has been already evaluated
        if (tmpl.hasExpr(key))
            // wait the first updated event only once
            parent.one('mount', function () {
                key = getNamedKey(dom);
                add(parent[key]);
            });else add(parent[key]);
    }

    /**
     * Faster String startsWith alternative
     * @param   { String } src - source string
     * @param   { String } str - test string
     * @returns { Boolean } -
     */
    function startsWith(src, str) {
        return src.slice(0, str.length) === str;
    }

    /**
     * requestAnimationFrame function
     * Adapted from https://gist.github.com/paulirish/1579671, license MIT
     */
    var rAF = function (w) {
        var raf = w.requestAnimationFrame || w.mozRequestAnimationFrame || w.webkitRequestAnimationFrame;

        if (!raf || /iP(ad|hone|od).*OS 6/.test(w.navigator.userAgent)) {
            // buggy iOS6
            var lastTime = 0;

            raf = function raf(cb) {
                var nowtime = Date.now(),
                    timeout = Math.max(16 - (nowtime - lastTime), 0);
                setTimeout(function () {
                    cb(lastTime = nowtime + timeout);
                }, timeout);
            };
        }
        return raf;
    }(window || {});

    /**
     * Mount a tag creating new Tag instance
     * @param   { Object } root - dom node where the tag will be mounted
     * @param   { String } tagName - name of the riot tag we want to mount
     * @param   { Object } opts - options to pass to the Tag instance
     * @returns { Tag } a new Tag instance
     */
    function mountTo(root, tagName, opts) {
        var tag = __tagImpl[tagName],

        // cache the inner HTML to fix #855
        innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;

        // clear the inner html
        root.innerHTML = '';

        if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML);

        if (tag && tag.mount) {
            tag.mount();
            // add this tag to the virtualDom variable
            if (!contains(__virtualDom, tag)) __virtualDom.push(tag);
        }

        return tag;
    }
    /**
     * Riot public api
     */

    // share methods for other riot parts, e.g. compiler
    riot.util = { brackets: brackets, tmpl: tmpl };

    /**
     * Create a mixin that could be globally shared across all the tags
     */
    riot.mixin = function () {
        var mixins = {};

        /**
         * Create/Return a mixin by its name
         * @param   { String } name - mixin name
         * @param   { Object } mixin - mixin logic
         * @returns { Object } the mixin logic
         */
        return function (name, mixin) {
            if (!mixin) return mixins[name];
            mixins[name] = mixin;
        };
    }();

    /**
     * Create a new riot tag implementation
     * @param   { String }   name - name/id of the new riot tag
     * @param   { String }   html - tag template
     * @param   { String }   css - custom tag css
     * @param   { String }   attrs - root tag attributes
     * @param   { Function } fn - user function
     * @returns { String } name/id of the tag just created
     */
    riot.tag = function (name, html, css, attrs, fn) {
        if (isFunction(attrs)) {
            fn = attrs;
            if (/^[\w\-]+\s?=/.test(css)) {
                attrs = css;
                css = '';
            } else attrs = '';
        }
        if (css) {
            if (isFunction(css)) fn = css;else styleManager.add(css);
        }
        __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn };
        return name;
    };

    /**
     * Create a new riot tag implementation (for use by the compiler)
     * @param   { String }   name - name/id of the new riot tag
     * @param   { String }   html - tag template
     * @param   { String }   css - custom tag css
     * @param   { String }   attrs - root tag attributes
     * @param   { Function } fn - user function
     * @param   { string }  [bpair] - brackets used in the compilation
     * @returns { String } name/id of the tag just created
     */
    riot.tag2 = function (name, html, css, attrs, fn, bpair) {
        if (css) styleManager.add(css);
        //if (bpair) riot.settings.brackets = bpair
        __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn };
        return name;
    };

    /**
     * Mount a tag using a specific tag implementation
     * @param   { String } selector - tag DOM selector
     * @param   { String } tagName - tag implementation name
     * @param   { Object } opts - tag logic
     * @returns { Array } new tags instances
     */
    riot.mount = function (selector, tagName, opts) {

        var els,
            allTags,
            tags = [];

        // helper functions

        function addRiotTags(arr) {
            var list = '';
            each(arr, function (e) {
                if (!/[^-\w]/.test(e)) list += ',*[' + RIOT_TAG + '=' + e.trim() + ']';
            });
            return list;
        }

        function selectAllTags() {
            var keys = Object.keys(__tagImpl);
            return keys + addRiotTags(keys);
        }

        function pushTags(root) {
            var last;

            if (root.tagName) {
                if (tagName && (!(last = getAttr(root, RIOT_TAG)) || last != tagName)) setAttr(root, RIOT_TAG, tagName);

                var tag = mountTo(root, tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts);

                if (tag) tags.push(tag);
            } else if (root.length) each(root, pushTags); // assume nodeList
        }

        // ----- mount code -----

        // inject styles into DOM
        styleManager.inject();

        if ((typeof tagName === 'undefined' ? 'undefined' : _typeof(tagName)) === T_OBJECT) {
            opts = tagName;
            tagName = 0;
        }

        // crawl the DOM to find the tag
        if ((typeof selector === 'undefined' ? 'undefined' : _typeof(selector)) === T_STRING) {
            if (selector === '*')
                // select all the tags registered
                // and also the tags found with the riot-tag attribute set
                selector = allTags = selectAllTags();else
                // or just the ones named like the selector
                selector += addRiotTags(selector.split(','));

            // make sure to pass always a selector
            // to the querySelectorAll function
            els = selector ? $$(selector) : [];
        } else
            // probably you have passed already a tag or a NodeList
            els = selector;

        // select all the registered and mount them inside their root elements
        if (tagName === '*') {
            // get all custom tags
            tagName = allTags || selectAllTags();
            // if the root els it's just a single tag
            if (els.tagName) els = $$(tagName, els);else {
                // select all the children for all the different root elements
                var nodeList = [];
                each(els, function (_el) {
                    nodeList.push($$(tagName, _el));
                });
                els = nodeList;
            }
            // get rid of the tagName
            tagName = 0;
        }

        if (els.tagName) pushTags(els);else each(els, pushTags);

        return tags;
    };

    /**
     * Update all the tags instances created
     * @returns { Array } all the tags instances
     */
    riot.update = function () {
        return each(__virtualDom, function (tag) {
            tag.update();
        });
    };

    /**
     * Export the Tag constructor
     */
    riot.Tag = Tag;
    // support CommonJS, AMD & browser
    /* istanbul ignore next */
    if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === T_OBJECT) module.exports = riot;else if ((typeof define === 'undefined' ? 'undefined' : _typeof(define)) === T_FUNCTION && _typeof(define.amd) !== T_UNDEF) define(function () {
        return riot;
    });else window.riot = riot;
})(typeof window != 'undefined' ? window : void 0);

},{}],12:[function(require,module,exports){
'use strict';

require('../Tags/App.es6');

require('../Tags/Notes.es6');

require('../Tags/UI.SelectColor.es6');

},{"../Tags/App.es6":13,"../Tags/Notes.es6":14,"../Tags/UI.SelectColor.es6":15}],13:[function(require,module,exports){
'use strict';

var _Riot = require('../Riot.es6');

var _Riot2 = _interopRequireDefault(_Riot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Riot2.default.tag('app', '<yield></yield>', function () {
    this.on('mount', function () {
        ci('Main App mount OK.');
    });
});

},{"../Riot.es6":11}],14:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Abstract2 = require('./_Abstract.es6');

var _Abstract3 = _interopRequireDefault(_Abstract2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

new (function (_Abstract) {
    _inherits(Notes, _Abstract);

    function Notes() {
        _classCallCheck(this, Notes);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Notes).apply(this, arguments));
    }

    _createClass(Notes, [{
        key: 'template',
        get: function get() {
            return '\n<input onblur="{ blur }" placeholder="Add new">\n<article class="note" each="{ name, v in $.Notes }">\n    <header>\n        <select-color selected="{ \'red\' }"></select-color>\n        <span class="date">Sept 12, 2013</span>\n        <span class="close">&times;</span>\n    </header>\n\n    <div class="content">\n        <p>{ v.doc.title }</p>\n    </div><!-- .content -->\n</article>\n    ';
        }
    }, {
        key: 'context',
        get: function get() {
            return context;
        }
    }]);

    return Notes;
}(_Abstract3.default))();

function context(opts) {
    return regeneratorRuntime.async(function context$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
            case 0:
                _context2.next = 2;
                return regeneratorRuntime.awrap($.Notes.load(this));

            case 2:

                this.blur = function _callee(ev) {
                    var v;
                    return regeneratorRuntime.async(function _callee$(_context) {
                        while (1) switch (_context.prev = _context.next) {
                            case 0:
                                v = ev.target.value.trim();

                                ev.target.value = '';
                                if (v) $.Notes.add(v);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }, null, this);
                };

                $.Notes.on('state', function () {
                    console.error('state', arguments, $.Notes);
                });

                //await Notes.add("De lehet hogy kolbasz")

                //let y = await this.$.Notes.doOtherSideStuff()

                //cw(y, this)

                return _context2.abrupt('return', new Promise(function (resolve) {
                    return resolve();
                }));

            case 5:
            case 'end':
                return _context2.stop();
        }
    }, null, this);
}

},{"./_Abstract.es6":16}],15:[function(require,module,exports){
"use strict";

var _Riot = require("../Riot.es6");

var _Riot2 = _interopRequireDefault(_Riot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Colors = ["red", "blue", "green", "yellow", "orange"];

_Riot2.default.tag('select-color', "\n    <span each=\"{ color in Colors }\" if=\"{ color === parent.opts.selected }\" class=\"{ color }\" onclick=\"{ click }\"></span>\n", function () {
    var _this = this;

    this.Colors = Colors;
    this.isOpen = 0;

    this.click = function () {
        console.log(_this.isOpen);
        _this.isOpen = 1 - _this.isOpen;
        console.log(_this.isOpen); // 1 - v
        _this.Colors = [];
        _this.update();
        console.log(_this.isOpen, _this.Colors);
    };
});

// @default: The color to show.

},{"../Riot.es6":11}],16:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _Riot = require('../Riot.es6');

var _Riot2 = _interopRequireDefault(_Riot);

var _Riot3 = require('../Defaults/Riot.es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Abstract = function () {
    function Abstract() {
        _classCallCheck(this, Abstract);

        this.register();
    }

    _createClass(Abstract, [{
        key: 'register',

        // [name, html, css, attrs, fn]
        // Only name important
        value: function register() {
            _Riot2.default.tag.apply(null, this.options);
        }
    }, {
        key: '_getTagName',
        value: function _getTagName() {
            var str = this.constructor.name;
            return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        }
    }, {
        key: 'options',
        get: function get() {
            return [this._getTagName(), this.template.replace(/(\r\n|\n|\r|\t)/gm, ""), this.context];
        }
    }, {
        key: 'settings',
        get: function get() {
            return _Riot3.Custom;
        }
    }, {
        key: 'context',
        get: function get() {
            var m = Abstract.settings.AutoMixins;
            return m ? function () {
                var _this = this;

                m.forEach(function (v) {
                    _this.mixin(v);
                });
            } : function () {};
        }
    }]);

    return Abstract;
}();

exports.default = Abstract;

},{"../Defaults/Riot.es6":5,"../Riot.es6":11}],17:[function(require,module,exports){
'use strict';

var _System = require('./Defaults/System.es6');

var ENV = _interopRequireWildcard(_System);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

try {
    self.window = self.window || {};
    self.document = self.document || { documentElement: { style: {} }, location: {} };
} catch (e) {}

var IS_WORKER = self.document && self.document.querySelector ? '' : ' W';

self.cl = function () {
    var _console;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    ENV.DEBUG && (_console = console).log.apply(_console, [IS_WORKER].concat(args));
};

self.cw = function () {
    var _console2;

    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    ENV.DEBUG && (_console2 = console).warn.apply(_console2, [IS_WORKER].concat(args));
};

self.ce = function () {
    var _console3;

    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
    }

    ENV.DEBUG && (_console3 = console).error.apply(_console3, [IS_WORKER].concat(args));
};

self.ci = function () {
    var _console4;

    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
    }

    ENV.DEBUG && (_console4 = console).info.apply(_console4, [IS_WORKER].concat(args));
};

self.ct = function () {
    var _console5;

    for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
    }

    ENV.DEBUG && (_console5 = console).trace.apply(_console5, [IS_WORKER].concat(args));
};

self.cci = 1;
self.cc = function (num) {
    self.cci = num || self.cci;
    ENV.DEBUG && console.trace(self.cci++);
};

},{"./Defaults/System.es6":6}],18:[function(require,module,exports){
(function (global){
"use strict";

require("core-js/shim");

require("babel-regenerator-runtime");

if (global._babelPolyfill) {
  throw new Error("only one instance of babel-polyfill is allowed");
}
global._babelPolyfill = true;
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"babel-regenerator-runtime":19,"core-js/shim":206}],19:[function(require,module,exports){
(function (process,global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided, then outerFn.prototype instanceof Generator.
    var generator = Object.create((outerFn || Generator).prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `value instanceof AwaitArgument` to determine if the yielded value is
  // meant to be awaited. Some may consider the name of this method too
  // cutesy, but they are curmudgeons.
  runtime.awrap = function(arg) {
    return new AwaitArgument(arg);
  };

  function AwaitArgument(arg) {
    this.arg = arg;
  }

  function AsyncIterator(generator) {
    // This invoke function is written in a style that assumes some
    // calling function (or Promise) will handle exceptions.
    function invoke(method, arg) {
      var result = generator[method](arg);
      var value = result.value;
      return value instanceof AwaitArgument
        ? Promise.resolve(value.arg).then(invokeNext, invokeThrow)
        : Promise.resolve(value).then(function(unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration. If the Promise is rejected, however, the
            // result for this iteration will be rejected with the same
            // reason. Note that rejections of yielded Promises are not
            // thrown back into the generator function, as is the case
            // when an awaited Promise is rejected. This difference in
            // behavior between yield and await is important, because it
            // allows the consumer to decide what to do with the yielded
            // rejection (swallow it and continue, manually .throw it back
            // into the generator, abandon iteration, whatever). With
            // await, by contrast, there is no opportunity to examine the
            // rejection reason outside the generator function, so the
            // only option is to throw it from the await expression, and
            // let the generator function handle the exception.
            result.value = unwrapped;
            return result;
          });
    }

    if (typeof process === "object" && process.domain) {
      invoke = process.domain.bind(invoke);
    }

    var invokeNext = invoke.bind(generator, "next");
    var invokeThrow = invoke.bind(generator, "throw");
    var invokeReturn = invoke.bind(generator, "return");
    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return invoke(method, arg);
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : new Promise(function (resolve) {
          resolve(callInvokeWithMethodAndArg());
        });
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          if (method === "return" ||
              (method === "throw" && delegate.iterator[method] === undefined)) {
            // A return or throw (when the delegate iterator has no throw
            // method) always terminates the yield* loop.
            context.delegate = null;

            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            var returnMethod = delegate.iterator["return"];
            if (returnMethod) {
              var record = tryCatch(returnMethod, delegate.iterator, arg);
              if (record.type === "throw") {
                // If the return method threw an exception, let that
                // exception prevail over the original return or throw.
                method = "throw";
                arg = record.arg;
                continue;
              }
            }

            if (method === "return") {
              // Continue with the outer return, now that the delegate
              // iterator has been terminated.
              continue;
            }
          }

          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;
            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          context._sent = arg;

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            context.sent = undefined;
          }
        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(arg) call above.
          method = "throw";
          arg = record.arg;
        }
      }
    };
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"_process":207}],20:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],21:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./$.wks')('unscopables')
  , ArrayProto  = Array.prototype;
if(ArrayProto[UNSCOPABLES] == undefined)require('./$.hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function(key){
  ArrayProto[UNSCOPABLES][key] = true;
};
},{"./$.hide":49,"./$.wks":101}],22:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":56}],23:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');

module.exports = [].copyWithin || function copyWithin(target/*= 0*/, start/*= 0, end = @length*/){
  var O     = toObject(this)
    , len   = toLength(O.length)
    , to    = toIndex(target, len)
    , from  = toIndex(start, len)
    , $$    = arguments
    , end   = $$.length > 2 ? $$[2] : undefined
    , count = Math.min((end === undefined ? len : toIndex(end, len)) - from, len - to)
    , inc   = 1;
  if(from < to && to < from + count){
    inc  = -1;
    from += count - 1;
    to   += count - 1;
  }
  while(count-- > 0){
    if(from in O)O[to] = O[from];
    else delete O[to];
    to   += inc;
    from += inc;
  } return O;
};
},{"./$.to-index":94,"./$.to-length":97,"./$.to-object":98}],24:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./$.to-object')
  , toIndex  = require('./$.to-index')
  , toLength = require('./$.to-length');
module.exports = [].fill || function fill(value /*, start = 0, end = @length */){
  var O      = toObject(this)
    , length = toLength(O.length)
    , $$     = arguments
    , $$len  = $$.length
    , index  = toIndex($$len > 1 ? $$[1] : undefined, length)
    , end    = $$len > 2 ? $$[2] : undefined
    , endPos = end === undefined ? length : toIndex(end, length);
  while(endPos > index)O[index++] = value;
  return O;
};
},{"./$.to-index":94,"./$.to-length":97,"./$.to-object":98}],25:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length')
  , toIndex   = require('./$.to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$.to-index":94,"./$.to-iobject":96,"./$.to-length":97}],26:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx      = require('./$.ctx')
  , IObject  = require('./$.iobject')
  , toObject = require('./$.to-object')
  , toLength = require('./$.to-length')
  , asc      = require('./$.array-species-create');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function($this, callbackfn, that){
    var O      = toObject($this)
      , self   = IObject(O)
      , f      = ctx(callbackfn, that, 3)
      , length = toLength(self.length)
      , index  = 0
      , result = IS_MAP ? asc($this, length) : IS_FILTER ? asc($this, 0) : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$.array-species-create":27,"./$.ctx":35,"./$.iobject":52,"./$.to-length":97,"./$.to-object":98}],27:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var isObject = require('./$.is-object')
  , isArray  = require('./$.is-array')
  , SPECIES  = require('./$.wks')('species');
module.exports = function(original, length){
  var C;
  if(isArray(original)){
    C = original.constructor;
    // cross-realm fallback
    if(typeof C == 'function' && (C === Array || isArray(C.prototype)))C = undefined;
    if(isObject(C)){
      C = C[SPECIES];
      if(C === null)C = undefined;
    }
  } return new (C === undefined ? Array : C)(length);
};
},{"./$.is-array":54,"./$.is-object":56,"./$.wks":101}],28:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./$.cof')
  , TAG = require('./$.wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./$.cof":29,"./$.wks":101}],29:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],30:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , hide         = require('./$.hide')
  , redefineAll  = require('./$.redefine-all')
  , ctx          = require('./$.ctx')
  , strictNew    = require('./$.strict-new')
  , defined      = require('./$.defined')
  , forOf        = require('./$.for-of')
  , $iterDefine  = require('./$.iter-define')
  , step         = require('./$.iter-step')
  , ID           = require('./$.uid')('id')
  , $has         = require('./$.has')
  , isObject     = require('./$.is-object')
  , setSpecies   = require('./$.set-species')
  , DESCRIPTORS  = require('./$.descriptors')
  , isExtensible = Object.isExtensible || isObject
  , SIZE         = DESCRIPTORS ? '_s' : 'size'
  , id           = 0;

var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!$has(it, ID)){
    // can't set id to frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
};

var getEntry = function(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index !== 'F')return that._i[index];
  // frozen object case
  for(entry = that._f; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = $.create(null); // index
      that._f = undefined;      // first entry
      that._l = undefined;      // last entry
      that[SIZE] = 0;           // size
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that._i, entry = that._f; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that._f == entry)that._f = next;
          if(that._l == entry)that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3)
          , entry;
        while(entry = entry ? entry.n : this._f){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if(DESCRIPTORS)$.setDesc(C.prototype, 'size', {
      get: function(){
        return defined(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that._f)that._f = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index !== 'F')that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function(C, NAME, IS_MAP){
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function(iterated, kind){
      this._t = iterated;  // target
      this._k = kind;      // kind
      this._l = undefined; // previous
    }, function(){
      var that  = this
        , kind  = that._k
        , entry = that._l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!that._t || !(that._l = entry = entry ? entry.n : that._t._f)){
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};
},{"./$":64,"./$.ctx":35,"./$.defined":36,"./$.descriptors":37,"./$.for-of":45,"./$.has":48,"./$.hide":49,"./$.is-object":56,"./$.iter-define":60,"./$.iter-step":62,"./$.redefine-all":78,"./$.set-species":83,"./$.strict-new":87,"./$.uid":100}],31:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var forOf   = require('./$.for-of')
  , classof = require('./$.classof');
module.exports = function(NAME){
  return function toJSON(){
    if(classof(this) != NAME)throw TypeError(NAME + "#toJSON isn't generic");
    var arr = [];
    forOf(this, false, arr.push, arr);
    return arr;
  };
};
},{"./$.classof":28,"./$.for-of":45}],32:[function(require,module,exports){
'use strict';
var hide              = require('./$.hide')
  , redefineAll       = require('./$.redefine-all')
  , anObject          = require('./$.an-object')
  , isObject          = require('./$.is-object')
  , strictNew         = require('./$.strict-new')
  , forOf             = require('./$.for-of')
  , createArrayMethod = require('./$.array-methods')
  , $has              = require('./$.has')
  , WEAK              = require('./$.uid')('weak')
  , isExtensible      = Object.isExtensible || isObject
  , arrayFind         = createArrayMethod(5)
  , arrayFindIndex    = createArrayMethod(6)
  , id                = 0;

// fallback for frozen keys
var frozenStore = function(that){
  return that._l || (that._l = new FrozenStore);
};
var FrozenStore = function(){
  this.a = [];
};
var findFrozen = function(store, key){
  return arrayFind(store.a, function(it){
    return it[0] === key;
  });
};
FrozenStore.prototype = {
  get: function(key){
    var entry = findFrozen(this, key);
    if(entry)return entry[1];
  },
  has: function(key){
    return !!findFrozen(this, key);
  },
  set: function(key, value){
    var entry = findFrozen(this, key);
    if(entry)entry[1] = value;
    else this.a.push([key, value]);
  },
  'delete': function(key){
    var index = arrayFindIndex(this.a, function(it){
      return it[0] === key;
    });
    if(~index)this.a.splice(index, 1);
    return !!~index;
  }
};

module.exports = {
  getConstructor: function(wrapper, NAME, IS_MAP, ADDER){
    var C = wrapper(function(that, iterable){
      strictNew(that, C, NAME);
      that._i = id++;      // collection id
      that._l = undefined; // leak store for frozen objects
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this)['delete'](key);
        return $has(key, WEAK) && $has(key[WEAK], this._i) && delete key[WEAK][this._i];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function has(key){
        if(!isObject(key))return false;
        if(!isExtensible(key))return frozenStore(this).has(key);
        return $has(key, WEAK) && $has(key[WEAK], this._i);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(!isExtensible(anObject(key))){
      frozenStore(that).set(key, value);
    } else {
      $has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that._i] = value;
    } return that;
  },
  frozenStore: frozenStore,
  WEAK: WEAK
};
},{"./$.an-object":22,"./$.array-methods":26,"./$.for-of":45,"./$.has":48,"./$.hide":49,"./$.is-object":56,"./$.redefine-all":78,"./$.strict-new":87,"./$.uid":100}],33:[function(require,module,exports){
'use strict';
var global         = require('./$.global')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , redefineAll    = require('./$.redefine-all')
  , forOf          = require('./$.for-of')
  , strictNew      = require('./$.strict-new')
  , isObject       = require('./$.is-object')
  , fails          = require('./$.fails')
  , $iterDetect    = require('./$.iter-detect')
  , setToStringTag = require('./$.set-to-string-tag');

module.exports = function(NAME, wrapper, methods, common, IS_MAP, IS_WEAK){
  var Base  = global[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  var fixMethod = function(KEY){
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a){
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a){
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a){ fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b){ fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if(typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function(){
    new C().entries().next();
  }))){
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
  } else {
    var instance             = new C
      // early implementations not supports chaining
      , HASNT_CHAINING       = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance
      // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
      , THROWS_ON_PRIMITIVES = fails(function(){ instance.has(1); })
      // most early implementations doesn't supports iterables, most modern - not close it correctly
      , ACCEPT_ITERABLES     = $iterDetect(function(iter){ new C(iter); }) // eslint-disable-line no-new
      // for early implementations -0 and +0 not the same
      , BUGGY_ZERO;
    if(!ACCEPT_ITERABLES){ 
      C = wrapper(function(target, iterable){
        strictNew(target, C, NAME);
        var that = new Base;
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    IS_WEAK || instance.forEach(function(val, key){
      BUGGY_ZERO = 1 / key === -Infinity;
    });
    if(THROWS_ON_PRIMITIVES || BUGGY_ZERO){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if(BUGGY_ZERO || HASNT_CHAINING)fixMethod(ADDER);
    // weak collections should not contains .clear method
    if(IS_WEAK && proto.clear)delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if(!IS_WEAK)common.setStrong(C, NAME, IS_MAP);

  return C;
};
},{"./$.export":40,"./$.fails":42,"./$.for-of":45,"./$.global":47,"./$.is-object":56,"./$.iter-detect":61,"./$.redefine":79,"./$.redefine-all":78,"./$.set-to-string-tag":84,"./$.strict-new":87}],34:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],35:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./$.a-function":20}],36:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],37:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":42}],38:[function(require,module,exports){
var isObject = require('./$.is-object')
  , document = require('./$.global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./$.global":47,"./$.is-object":56}],39:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":64}],40:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , hide      = require('./$.hide')
  , redefine  = require('./$.redefine')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
    , key, own, out, exp;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own)redefine(target, key, out);
    // export
    if(exports[key] != out)hide(exports, key, exp);
    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":34,"./$.ctx":35,"./$.global":47,"./$.hide":49,"./$.redefine":79}],41:[function(require,module,exports){
var MATCH = require('./$.wks')('match');
module.exports = function(KEY){
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch(e){
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch(f){ /* empty */ }
  } return true;
};
},{"./$.wks":101}],42:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],43:[function(require,module,exports){
'use strict';
var hide     = require('./$.hide')
  , redefine = require('./$.redefine')
  , fails    = require('./$.fails')
  , defined  = require('./$.defined')
  , wks      = require('./$.wks');

module.exports = function(KEY, length, exec){
  var SYMBOL   = wks(KEY)
    , original = ''[KEY];
  if(fails(function(){
    var O = {};
    O[SYMBOL] = function(){ return 7; };
    return ''[KEY](O) != 7;
  })){
    redefine(String.prototype, KEY, exec(defined, SYMBOL, original));
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function(string, arg){ return original.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function(string){ return original.call(string, this); }
    );
  }
};
},{"./$.defined":36,"./$.fails":42,"./$.hide":49,"./$.redefine":79,"./$.wks":101}],44:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./$.an-object');
module.exports = function(){
  var that   = anObject(this)
    , result = '';
  if(that.global)     result += 'g';
  if(that.ignoreCase) result += 'i';
  if(that.multiline)  result += 'm';
  if(that.unicode)    result += 'u';
  if(that.sticky)     result += 'y';
  return result;
};
},{"./$.an-object":22}],45:[function(require,module,exports){
var ctx         = require('./$.ctx')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , anObject    = require('./$.an-object')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
module.exports = function(iterable, entries, fn, that){
  var iterFn = getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    call(iterator, f, step.value, entries);
  }
};
},{"./$.an-object":22,"./$.ctx":35,"./$.is-array-iter":53,"./$.iter-call":58,"./$.to-length":97,"./core.get-iterator-method":102}],46:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":64,"./$.to-iobject":96}],47:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],48:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],49:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":64,"./$.descriptors":37,"./$.property-desc":77}],50:[function(require,module,exports){
module.exports = require('./$.global').document && document.documentElement;
},{"./$.global":47}],51:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],52:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":29}],53:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./$.iterators')
  , ITERATOR   = require('./$.wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./$.iterators":63,"./$.wks":101}],54:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":29}],55:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./$.is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./$.is-object":56}],56:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],57:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./$.is-object')
  , cof      = require('./$.cof')
  , MATCH    = require('./$.wks')('match');
module.exports = function(it){
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};
},{"./$.cof":29,"./$.is-object":56,"./$.wks":101}],58:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./$.an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./$.an-object":22}],59:[function(require,module,exports){
'use strict';
var $              = require('./$')
  , descriptor     = require('./$.property-desc')
  , setToStringTag = require('./$.set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./$.hide')(IteratorPrototype, require('./$.wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = $.create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./$":64,"./$.hide":49,"./$.property-desc":77,"./$.set-to-string-tag":84,"./$.wks":101}],60:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./$.library')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , hide           = require('./$.hide')
  , has            = require('./$.has')
  , Iterators      = require('./$.iterators')
  , $iterCreate    = require('./$.iter-create')
  , setToStringTag = require('./$.set-to-string-tag')
  , getProto       = require('./$').getProto
  , ITERATOR       = require('./$.wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , methods, key;
  // Fix native
  if($native){
    var IteratorPrototype = getProto($default.call(new Base));
    // Set @@toStringTag to native iterators
    setToStringTag(IteratorPrototype, TAG, true);
    // FF fix
    if(!LIBRARY && has(proto, FF_ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    // fix Array#{values, @@iterator}.name in V8 / FF
    if(DEF_VALUES && $native.name !== VALUES){
      VALUES_BUG = true;
      $default = function values(){ return $native.call(this); };
    }
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES  ? $default : getMethod(VALUES),
      keys:    IS_SET      ? $default : getMethod(KEYS),
      entries: !DEF_VALUES ? $default : getMethod('entries')
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./$":64,"./$.export":40,"./$.has":48,"./$.hide":49,"./$.iter-create":59,"./$.iterators":63,"./$.library":66,"./$.redefine":79,"./$.set-to-string-tag":84,"./$.wks":101}],61:[function(require,module,exports){
var ITERATOR     = require('./$.wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":101}],62:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],63:[function(require,module,exports){
module.exports = {};
},{}],64:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],65:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":64,"./$.to-iobject":96}],66:[function(require,module,exports){
module.exports = false;
},{}],67:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
module.exports = Math.expm1 || function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : Math.exp(x) - 1;
};
},{}],68:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
module.exports = Math.log1p || function log1p(x){
  return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : Math.log(1 + x);
};
},{}],69:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
module.exports = Math.sign || function sign(x){
  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
};
},{}],70:[function(require,module,exports){
var global    = require('./$.global')
  , macrotask = require('./$.task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./$.cof')(process) == 'process'
  , head, last, notify;

var flush = function(){
  var parent, domain, fn;
  if(isNode && (parent = process.domain)){
    process.domain = null;
    parent.exit();
  }
  while(head){
    domain = head.domain;
    fn     = head.fn;
    if(domain)domain.enter();
    fn(); // <- currently we use it only for Promise - try / catch not required
    if(domain)domain.exit();
    head = head.next;
  } last = undefined;
  if(parent)parent.enter();
};

// Node.js
if(isNode){
  notify = function(){
    process.nextTick(flush);
  };
// browsers with MutationObserver
} else if(Observer){
  var toggle = 1
    , node   = document.createTextNode('');
  new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
  notify = function(){
    node.data = toggle = -toggle;
  };
// environments with maybe non-completely correct, but existent Promise
} else if(Promise && Promise.resolve){
  notify = function(){
    Promise.resolve().then(flush);
  };
// for other environments - macrotask based on:
// - setImmediate
// - MessageChannel
// - window.postMessag
// - onreadystatechange
// - setTimeout
} else {
  notify = function(){
    // strange IE + webpack dev server bug - use .call(global)
    macrotask.call(global, flush);
  };
}

module.exports = function asap(fn){
  var task = {fn: fn, next: undefined, domain: isNode && process.domain};
  if(last)last.next = task;
  if(!head){
    head = task;
    notify();
  } last = task;
};
},{"./$.cof":29,"./$.global":47,"./$.task":93}],71:[function(require,module,exports){
// 19.1.2.1 Object.assign(target, source, ...)
var $        = require('./$')
  , toObject = require('./$.to-object')
  , IObject  = require('./$.iobject');

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = require('./$.fails')(function(){
  var a = Object.assign
    , A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return a({}, A)[S] != 7 || Object.keys(a({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , $$    = arguments
    , $$len = $$.length
    , index = 1
    , getKeys    = $.getKeys
    , getSymbols = $.getSymbols
    , isEnum     = $.isEnum;
  while($$len > index){
    var S      = IObject($$[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  }
  return T;
} : Object.assign;
},{"./$":64,"./$.fails":42,"./$.iobject":52,"./$.to-object":98}],72:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./$.export')
  , core    = require('./$.core')
  , fails   = require('./$.fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./$.core":34,"./$.export":40,"./$.fails":42}],73:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject')
  , isEnum    = $.isEnum;
module.exports = function(isEntries){
  return function(it){
    var O      = toIObject(it)
      , keys   = $.getKeys(O)
      , length = keys.length
      , i      = 0
      , result = []
      , key;
    while(length > i)if(isEnum.call(O, key = keys[i++])){
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};
},{"./$":64,"./$.to-iobject":96}],74:[function(require,module,exports){
// all object keys, includes non-enumerable and symbols
var $        = require('./$')
  , anObject = require('./$.an-object')
  , Reflect  = require('./$.global').Reflect;
module.exports = Reflect && Reflect.ownKeys || function ownKeys(it){
  var keys       = $.getNames(anObject(it))
    , getSymbols = $.getSymbols;
  return getSymbols ? keys.concat(getSymbols(it)) : keys;
};
},{"./$":64,"./$.an-object":22,"./$.global":47}],75:[function(require,module,exports){
'use strict';
var path      = require('./$.path')
  , invoke    = require('./$.invoke')
  , aFunction = require('./$.a-function');
module.exports = function(/* ...pargs */){
  var fn     = aFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that  = this
      , $$    = arguments
      , $$len = $$.length
      , j = 0, k = 0, args;
    if(!holder && !$$len)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = $$[k++];
    while($$len > k)args.push($$[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$.a-function":20,"./$.invoke":51,"./$.path":76}],76:[function(require,module,exports){
module.exports = require('./$.global');
},{"./$.global":47}],77:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],78:[function(require,module,exports){
var redefine = require('./$.redefine');
module.exports = function(target, src){
  for(var key in src)redefine(target, key, src[key]);
  return target;
};
},{"./$.redefine":79}],79:[function(require,module,exports){
// add fake Function#toString
// for correct work wrapped methods / constructors with methods like LoDash isNative
var global    = require('./$.global')
  , hide      = require('./$.hide')
  , SRC       = require('./$.uid')('src')
  , TO_STRING = 'toString'
  , $toString = Function[TO_STRING]
  , TPL       = ('' + $toString).split(TO_STRING);

require('./$.core').inspectSource = function(it){
  return $toString.call(it);
};

(module.exports = function(O, key, val, safe){
  if(typeof val == 'function'){
    val.hasOwnProperty(SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    val.hasOwnProperty('name') || hide(val, 'name', key);
  }
  if(O === global){
    O[key] = val;
  } else {
    if(!safe)delete O[key];
    hide(O, key, val);
  }
})(Function.prototype, TO_STRING, function toString(){
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});
},{"./$.core":34,"./$.global":47,"./$.hide":49,"./$.uid":100}],80:[function(require,module,exports){
module.exports = function(regExp, replace){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(it).replace(regExp, replacer);
  };
};
},{}],81:[function(require,module,exports){
// 7.2.9 SameValue(x, y)
module.exports = Object.is || function is(x, y){
  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
};
},{}],82:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var getDesc  = require('./$').getDesc
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./$.ctx')(Function.call, getDesc(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./$":64,"./$.an-object":22,"./$.ctx":35,"./$.is-object":56}],83:[function(require,module,exports){
'use strict';
var global      = require('./$.global')
  , $           = require('./$')
  , DESCRIPTORS = require('./$.descriptors')
  , SPECIES     = require('./$.wks')('species');

module.exports = function(KEY){
  var C = global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])$.setDesc(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./$":64,"./$.descriptors":37,"./$.global":47,"./$.wks":101}],84:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":64,"./$.has":48,"./$.wks":101}],85:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":47}],86:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./$.an-object')
  , aFunction = require('./$.a-function')
  , SPECIES   = require('./$.wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./$.a-function":20,"./$.an-object":22,"./$.wks":101}],87:[function(require,module,exports){
module.exports = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
},{}],88:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$.defined":36,"./$.to-integer":95}],89:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./$.is-regexp')
  , defined  = require('./$.defined');

module.exports = function(that, searchString, NAME){
  if(isRegExp(searchString))throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};
},{"./$.defined":36,"./$.is-regexp":57}],90:[function(require,module,exports){
// https://github.com/ljharb/proposal-string-pad-left-right
var toLength = require('./$.to-length')
  , repeat   = require('./$.string-repeat')
  , defined  = require('./$.defined');

module.exports = function(that, maxLength, fillString, left){
  var S            = String(defined(that))
    , stringLength = S.length
    , fillStr      = fillString === undefined ? ' ' : String(fillString)
    , intMaxLength = toLength(maxLength);
  if(intMaxLength <= stringLength)return S;
  if(fillStr == '')fillStr = ' ';
  var fillLen = intMaxLength - stringLength
    , stringFiller = repeat.call(fillStr, Math.ceil(fillLen / fillStr.length));
  if(stringFiller.length > fillLen)stringFiller = stringFiller.slice(0, fillLen);
  return left ? stringFiller + S : S + stringFiller;
};
},{"./$.defined":36,"./$.string-repeat":91,"./$.to-length":97}],91:[function(require,module,exports){
'use strict';
var toInteger = require('./$.to-integer')
  , defined   = require('./$.defined');

module.exports = function repeat(count){
  var str = String(defined(this))
    , res = ''
    , n   = toInteger(count);
  if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
  for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
  return res;
};
},{"./$.defined":36,"./$.to-integer":95}],92:[function(require,module,exports){
var $export = require('./$.export')
  , defined = require('./$.defined')
  , fails   = require('./$.fails')
  , spaces  = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
      '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF'
  , space   = '[' + spaces + ']'
  , non     = '\u200b\u0085'
  , ltrim   = RegExp('^' + space + space + '*')
  , rtrim   = RegExp(space + space + '*$');

var exporter = function(KEY, exec){
  var exp  = {};
  exp[KEY] = exec(trim);
  $export($export.P + $export.F * fails(function(){
    return !!spaces[KEY]() || non[KEY]() != non;
  }), 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function(string, TYPE){
  string = String(defined(string));
  if(TYPE & 1)string = string.replace(ltrim, '');
  if(TYPE & 2)string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;
},{"./$.defined":36,"./$.export":40,"./$.fails":42}],93:[function(require,module,exports){
var ctx                = require('./$.ctx')
  , invoke             = require('./$.invoke')
  , html               = require('./$.html')
  , cel                = require('./$.dom-create')
  , global             = require('./$.global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listner = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./$.cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listner, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$.cof":29,"./$.ctx":35,"./$.dom-create":38,"./$.global":47,"./$.html":50,"./$.invoke":51}],94:[function(require,module,exports){
var toInteger = require('./$.to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./$.to-integer":95}],95:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],96:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":36,"./$.iobject":52}],97:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./$.to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./$.to-integer":95}],98:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./$.defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./$.defined":36}],99:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./$.is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./$.is-object":56}],100:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],101:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":47,"./$.shared":85,"./$.uid":100}],102:[function(require,module,exports){
var classof   = require('./$.classof')
  , ITERATOR  = require('./$.wks')('iterator')
  , Iterators = require('./$.iterators');
module.exports = require('./$.core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./$.classof":28,"./$.core":34,"./$.iterators":63,"./$.wks":101}],103:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , $export           = require('./$.export')
  , DESCRIPTORS       = require('./$.descriptors')
  , createDesc        = require('./$.property-desc')
  , html              = require('./$.html')
  , cel               = require('./$.dom-create')
  , has               = require('./$.has')
  , cof               = require('./$.cof')
  , invoke            = require('./$.invoke')
  , fails             = require('./$.fails')
  , anObject          = require('./$.an-object')
  , aFunction         = require('./$.a-function')
  , isObject          = require('./$.is-object')
  , toObject          = require('./$.to-object')
  , toIObject         = require('./$.to-iobject')
  , toInteger         = require('./$.to-integer')
  , toIndex           = require('./$.to-index')
  , toLength          = require('./$.to-length')
  , IObject           = require('./$.iobject')
  , IE_PROTO          = require('./$.uid')('__proto__')
  , createArrayMethod = require('./$.array-methods')
  , arrayIndexOf      = require('./$.array-includes')(false)
  , ObjectProto       = Object.prototype
  , ArrayProto        = Array.prototype
  , arraySlice        = ArrayProto.slice
  , arrayJoin         = ArrayProto.join
  , defineProperty    = $.setDesc
  , getOwnDescriptor  = $.getDesc
  , defineProperties  = $.setDescs
  , factories         = {}
  , IE8_DOM_DEFINE;

if(!DESCRIPTORS){
  IE8_DOM_DEFINE = !fails(function(){
    return defineProperty(cel('div'), 'a', {get: function(){ return 7; }}).a != 7;
  });
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)anObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return createDesc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  $.setDescs = defineProperties = function(O, Properties){
    anObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$export($export.S + $export.F * !DESCRIPTORS, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = cel('iframe')
    , i      = keysLen1
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
var createGetKeys = function(names, length){
  return function(object){
    var O      = toIObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~arrayIndexOf(result, key) || result.push(key);
    }
    return result;
  };
};
var Empty = function(){};
$export($export.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = toObject(O);
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(typeof O.constructor == 'function' && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = anObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false)
});

var construct = function(F, len, args){
  if(!(len in factories)){
    for(var n = [], i = 0; i < len; i++)n[i] = 'a[' + i + ']';
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  }
  return factories[len](F, args);
};

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$export($export.P, 'Function', {
  bind: function bind(that /*, args... */){
    var fn       = aFunction(this)
      , partArgs = arraySlice.call(arguments, 1);
    var bound = function(/* args... */){
      var args = partArgs.concat(arraySlice.call(arguments));
      return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
    };
    if(isObject(fn.prototype))bound.prototype = fn.prototype;
    return bound;
  }
});

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * fails(function(){
  if(html)arraySlice.call(html);
}), 'Array', {
  slice: function(begin, end){
    var len   = toLength(this.length)
      , klass = cof(this);
    end = end === undefined ? len : end;
    if(klass == 'Array')return arraySlice.call(this, begin, end);
    var start  = toIndex(begin, len)
      , upTo   = toIndex(end, len)
      , size   = toLength(upTo - start)
      , cloned = Array(size)
      , i      = 0;
    for(; i < size; i++)cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});
$export($export.P + $export.F * (IObject != Object), 'Array', {
  join: function join(separator){
    return arrayJoin.call(IObject(this), separator === undefined ? ',' : separator);
  }
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$export($export.S, 'Array', {isArray: require('./$.is-array')});

var createArrayReduce = function(isRight){
  return function(callbackfn, memo){
    aFunction(callbackfn);
    var O      = IObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      if(isRight ? index < 0 : length <= index){
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
};

var methodize = function($fn){
  return function(arg1/*, arg2 = undefined */){
    return $fn(this, arg1, arguments[1]);
  };
};

$export($export.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || methodize(createArrayMethod(0)),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: methodize(createArrayMethod(1)),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: methodize(createArrayMethod(2)),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: methodize(createArrayMethod(3)),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: methodize(createArrayMethod(4)),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: methodize(arrayIndexOf),
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toIObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 20.3.3.1 / 15.9.4.4 Date.now()
$export($export.S, 'Date', {now: function(){ return +new Date; }});

var lz = function(num){
  return num > 9 ? num : '0' + num;
};

// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
// PhantomJS / old WebKit has a broken implementations
$export($export.P + $export.F * (fails(function(){
  return new Date(-5e13 - 1).toISOString() != '0385-07-25T07:06:39.999Z';
}) || !fails(function(){
  new Date(NaN).toISOString();
})), 'Date', {
  toISOString: function toISOString(){
    if(!isFinite(this))throw RangeError('Invalid time value');
    var d = this
      , y = d.getUTCFullYear()
      , m = d.getUTCMilliseconds()
      , s = y < 0 ? '-' : y > 9999 ? '+' : '';
    return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
      '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
      'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
      ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
  }
});
},{"./$":64,"./$.a-function":20,"./$.an-object":22,"./$.array-includes":25,"./$.array-methods":26,"./$.cof":29,"./$.descriptors":37,"./$.dom-create":38,"./$.export":40,"./$.fails":42,"./$.has":48,"./$.html":50,"./$.invoke":51,"./$.iobject":52,"./$.is-array":54,"./$.is-object":56,"./$.property-desc":77,"./$.to-index":94,"./$.to-integer":95,"./$.to-iobject":96,"./$.to-length":97,"./$.to-object":98,"./$.uid":100}],104:[function(require,module,exports){
// 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
var $export = require('./$.export');

$export($export.P, 'Array', {copyWithin: require('./$.array-copy-within')});

require('./$.add-to-unscopables')('copyWithin');
},{"./$.add-to-unscopables":21,"./$.array-copy-within":23,"./$.export":40}],105:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./$.export');

$export($export.P, 'Array', {fill: require('./$.array-fill')});

require('./$.add-to-unscopables')('fill');
},{"./$.add-to-unscopables":21,"./$.array-fill":24,"./$.export":40}],106:[function(require,module,exports){
'use strict';
// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = require('./$.export')
  , $find   = require('./$.array-methods')(6)
  , KEY     = 'findIndex'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./$.add-to-unscopables')(KEY);
},{"./$.add-to-unscopables":21,"./$.array-methods":26,"./$.export":40}],107:[function(require,module,exports){
'use strict';
// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = require('./$.export')
  , $find   = require('./$.array-methods')(5)
  , KEY     = 'find'
  , forced  = true;
// Shouldn't skip holes
if(KEY in [])Array(1)[KEY](function(){ forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn/*, that = undefined */){
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require('./$.add-to-unscopables')(KEY);
},{"./$.add-to-unscopables":21,"./$.array-methods":26,"./$.export":40}],108:[function(require,module,exports){
'use strict';
var ctx         = require('./$.ctx')
  , $export     = require('./$.export')
  , toObject    = require('./$.to-object')
  , call        = require('./$.iter-call')
  , isArrayIter = require('./$.is-array-iter')
  , toLength    = require('./$.to-length')
  , getIterFn   = require('./core.get-iterator-method');
$export($export.S + $export.F * !require('./$.iter-detect')(function(iter){ Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , $$      = arguments
      , $$len   = $$.length
      , mapfn   = $$len > 1 ? $$[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, $$len > 2 ? $$[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        result[index] = mapping ? call(iterator, mapfn, [step.value, index], true) : step.value;
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        result[index] = mapping ? mapfn(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});

},{"./$.ctx":35,"./$.export":40,"./$.is-array-iter":53,"./$.iter-call":58,"./$.iter-detect":61,"./$.to-length":97,"./$.to-object":98,"./core.get-iterator-method":102}],109:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./$.add-to-unscopables')
  , step             = require('./$.iter-step')
  , Iterators        = require('./$.iterators')
  , toIObject        = require('./$.to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./$.add-to-unscopables":21,"./$.iter-define":60,"./$.iter-step":62,"./$.iterators":63,"./$.to-iobject":96}],110:[function(require,module,exports){
'use strict';
var $export = require('./$.export');

// WebKit Array.of isn't generic
$export($export.S + $export.F * require('./$.fails')(function(){
  function F(){}
  return !(Array.of.call(F) instanceof F);
}), 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function of(/* ...args */){
    var index  = 0
      , $$     = arguments
      , $$len  = $$.length
      , result = new (typeof this == 'function' ? this : Array)($$len);
    while($$len > index)result[index] = $$[index++];
    result.length = $$len;
    return result;
  }
});
},{"./$.export":40,"./$.fails":42}],111:[function(require,module,exports){
require('./$.set-species')('Array');
},{"./$.set-species":83}],112:[function(require,module,exports){
'use strict';
var $             = require('./$')
  , isObject      = require('./$.is-object')
  , HAS_INSTANCE  = require('./$.wks')('hasInstance')
  , FunctionProto = Function.prototype;
// 19.2.3.6 Function.prototype[@@hasInstance](V)
if(!(HAS_INSTANCE in FunctionProto))$.setDesc(FunctionProto, HAS_INSTANCE, {value: function(O){
  if(typeof this != 'function' || !isObject(O))return false;
  if(!isObject(this.prototype))return O instanceof this;
  // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
  while(O = $.getProto(O))if(this.prototype === O)return true;
  return false;
}});
},{"./$":64,"./$.is-object":56,"./$.wks":101}],113:[function(require,module,exports){
var setDesc    = require('./$').setDesc
  , createDesc = require('./$.property-desc')
  , has        = require('./$.has')
  , FProto     = Function.prototype
  , nameRE     = /^\s*function ([^ (]*)/
  , NAME       = 'name';
// 19.2.4.2 name
NAME in FProto || require('./$.descriptors') && setDesc(FProto, NAME, {
  configurable: true,
  get: function(){
    var match = ('' + this).match(nameRE)
      , name  = match ? match[1] : '';
    has(this, NAME) || setDesc(this, NAME, createDesc(5, name));
    return name;
  }
});
},{"./$":64,"./$.descriptors":37,"./$.has":48,"./$.property-desc":77}],114:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', function(get){
  return function Map(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":33,"./$.collection-strong":30}],115:[function(require,module,exports){
// 20.2.2.3 Math.acosh(x)
var $export = require('./$.export')
  , log1p   = require('./$.math-log1p')
  , sqrt    = Math.sqrt
  , $acosh  = Math.acosh;

// V8 bug https://code.google.com/p/v8/issues/detail?id=3509
$export($export.S + $export.F * !($acosh && Math.floor($acosh(Number.MAX_VALUE)) == 710), 'Math', {
  acosh: function acosh(x){
    return (x = +x) < 1 ? NaN : x > 94906265.62425156
      ? Math.log(x) + Math.LN2
      : log1p(x - 1 + sqrt(x - 1) * sqrt(x + 1));
  }
});
},{"./$.export":40,"./$.math-log1p":68}],116:[function(require,module,exports){
// 20.2.2.5 Math.asinh(x)
var $export = require('./$.export');

function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : Math.log(x + Math.sqrt(x * x + 1));
}

$export($export.S, 'Math', {asinh: asinh});
},{"./$.export":40}],117:[function(require,module,exports){
// 20.2.2.7 Math.atanh(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  atanh: function atanh(x){
    return (x = +x) == 0 ? x : Math.log((1 + x) / (1 - x)) / 2;
  }
});
},{"./$.export":40}],118:[function(require,module,exports){
// 20.2.2.9 Math.cbrt(x)
var $export = require('./$.export')
  , sign    = require('./$.math-sign');

$export($export.S, 'Math', {
  cbrt: function cbrt(x){
    return sign(x = +x) * Math.pow(Math.abs(x), 1 / 3);
  }
});
},{"./$.export":40,"./$.math-sign":69}],119:[function(require,module,exports){
// 20.2.2.11 Math.clz32(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  clz32: function clz32(x){
    return (x >>>= 0) ? 31 - Math.floor(Math.log(x + 0.5) * Math.LOG2E) : 32;
  }
});
},{"./$.export":40}],120:[function(require,module,exports){
// 20.2.2.12 Math.cosh(x)
var $export = require('./$.export')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  cosh: function cosh(x){
    return (exp(x = +x) + exp(-x)) / 2;
  }
});
},{"./$.export":40}],121:[function(require,module,exports){
// 20.2.2.14 Math.expm1(x)
var $export = require('./$.export');

$export($export.S, 'Math', {expm1: require('./$.math-expm1')});
},{"./$.export":40,"./$.math-expm1":67}],122:[function(require,module,exports){
// 20.2.2.16 Math.fround(x)
var $export   = require('./$.export')
  , sign      = require('./$.math-sign')
  , pow       = Math.pow
  , EPSILON   = pow(2, -52)
  , EPSILON32 = pow(2, -23)
  , MAX32     = pow(2, 127) * (2 - EPSILON32)
  , MIN32     = pow(2, -126);

var roundTiesToEven = function(n){
  return n + 1 / EPSILON - 1 / EPSILON;
};


$export($export.S, 'Math', {
  fround: function fround(x){
    var $abs  = Math.abs(x)
      , $sign = sign(x)
      , a, result;
    if($abs < MIN32)return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
    a = (1 + EPSILON32 / EPSILON) * $abs;
    result = a - (a - $abs);
    if(result > MAX32 || result != result)return $sign * Infinity;
    return $sign * result;
  }
});
},{"./$.export":40,"./$.math-sign":69}],123:[function(require,module,exports){
// 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
var $export = require('./$.export')
  , abs     = Math.abs;

$export($export.S, 'Math', {
  hypot: function hypot(value1, value2){ // eslint-disable-line no-unused-vars
    var sum   = 0
      , i     = 0
      , $$    = arguments
      , $$len = $$.length
      , larg  = 0
      , arg, div;
    while(i < $$len){
      arg = abs($$[i++]);
      if(larg < arg){
        div  = larg / arg;
        sum  = sum * div * div + 1;
        larg = arg;
      } else if(arg > 0){
        div  = arg / larg;
        sum += div * div;
      } else sum += arg;
    }
    return larg === Infinity ? Infinity : larg * Math.sqrt(sum);
  }
});
},{"./$.export":40}],124:[function(require,module,exports){
// 20.2.2.18 Math.imul(x, y)
var $export = require('./$.export')
  , $imul   = Math.imul;

// some WebKit versions fails with big numbers, some has wrong arity
$export($export.S + $export.F * require('./$.fails')(function(){
  return $imul(0xffffffff, 5) != -5 || $imul.length != 2;
}), 'Math', {
  imul: function imul(x, y){
    var UINT16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UINT16 & xn
      , yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});
},{"./$.export":40,"./$.fails":42}],125:[function(require,module,exports){
// 20.2.2.21 Math.log10(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log10: function log10(x){
    return Math.log(x) / Math.LN10;
  }
});
},{"./$.export":40}],126:[function(require,module,exports){
// 20.2.2.20 Math.log1p(x)
var $export = require('./$.export');

$export($export.S, 'Math', {log1p: require('./$.math-log1p')});
},{"./$.export":40,"./$.math-log1p":68}],127:[function(require,module,exports){
// 20.2.2.22 Math.log2(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  log2: function log2(x){
    return Math.log(x) / Math.LN2;
  }
});
},{"./$.export":40}],128:[function(require,module,exports){
// 20.2.2.28 Math.sign(x)
var $export = require('./$.export');

$export($export.S, 'Math', {sign: require('./$.math-sign')});
},{"./$.export":40,"./$.math-sign":69}],129:[function(require,module,exports){
// 20.2.2.30 Math.sinh(x)
var $export = require('./$.export')
  , expm1   = require('./$.math-expm1')
  , exp     = Math.exp;

// V8 near Chromium 38 has a problem with very small numbers
$export($export.S + $export.F * require('./$.fails')(function(){
  return !Math.sinh(-2e-17) != -2e-17;
}), 'Math', {
  sinh: function sinh(x){
    return Math.abs(x = +x) < 1
      ? (expm1(x) - expm1(-x)) / 2
      : (exp(x - 1) - exp(-x - 1)) * (Math.E / 2);
  }
});
},{"./$.export":40,"./$.fails":42,"./$.math-expm1":67}],130:[function(require,module,exports){
// 20.2.2.33 Math.tanh(x)
var $export = require('./$.export')
  , expm1   = require('./$.math-expm1')
  , exp     = Math.exp;

$export($export.S, 'Math', {
  tanh: function tanh(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  }
});
},{"./$.export":40,"./$.math-expm1":67}],131:[function(require,module,exports){
// 20.2.2.34 Math.trunc(x)
var $export = require('./$.export');

$export($export.S, 'Math', {
  trunc: function trunc(it){
    return (it > 0 ? Math.floor : Math.ceil)(it);
  }
});
},{"./$.export":40}],132:[function(require,module,exports){
'use strict';
var $           = require('./$')
  , global      = require('./$.global')
  , has         = require('./$.has')
  , cof         = require('./$.cof')
  , toPrimitive = require('./$.to-primitive')
  , fails       = require('./$.fails')
  , $trim       = require('./$.string-trim').trim
  , NUMBER      = 'Number'
  , $Number     = global[NUMBER]
  , Base        = $Number
  , proto       = $Number.prototype
  // Opera ~12 has broken Object#toString
  , BROKEN_COF  = cof($.create(proto)) == NUMBER
  , TRIM        = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function(argument){
  var it = toPrimitive(argument, false);
  if(typeof it == 'string' && it.length > 2){
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0)
      , third, radix, maxCode;
    if(first === 43 || first === 45){
      third = it.charCodeAt(2);
      if(third === 88 || third === 120)return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if(first === 48){
      switch(it.charCodeAt(1)){
        case 66 : case 98  : radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79 : case 111 : radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default : return +it;
      }
      for(var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++){
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if(code < 48 || code > maxCode)return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if(!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')){
  $Number = function Number(value){
    var it = arguments.length < 1 ? 0 : value
      , that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function(){ proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call(require('./$.descriptors') ? $.getNames(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), function(key){
    if(has(Base, key) && !has($Number, key)){
      $.setDesc($Number, key, $.getDesc(Base, key));
    }
  });
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./$.redefine')(global, NUMBER, $Number);
}
},{"./$":64,"./$.cof":29,"./$.descriptors":37,"./$.fails":42,"./$.global":47,"./$.has":48,"./$.redefine":79,"./$.string-trim":92,"./$.to-primitive":99}],133:[function(require,module,exports){
// 20.1.2.1 Number.EPSILON
var $export = require('./$.export');

$export($export.S, 'Number', {EPSILON: Math.pow(2, -52)});
},{"./$.export":40}],134:[function(require,module,exports){
// 20.1.2.2 Number.isFinite(number)
var $export   = require('./$.export')
  , _isFinite = require('./$.global').isFinite;

$export($export.S, 'Number', {
  isFinite: function isFinite(it){
    return typeof it == 'number' && _isFinite(it);
  }
});
},{"./$.export":40,"./$.global":47}],135:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./$.export');

$export($export.S, 'Number', {isInteger: require('./$.is-integer')});
},{"./$.export":40,"./$.is-integer":55}],136:[function(require,module,exports){
// 20.1.2.4 Number.isNaN(number)
var $export = require('./$.export');

$export($export.S, 'Number', {
  isNaN: function isNaN(number){
    return number != number;
  }
});
},{"./$.export":40}],137:[function(require,module,exports){
// 20.1.2.5 Number.isSafeInteger(number)
var $export   = require('./$.export')
  , isInteger = require('./$.is-integer')
  , abs       = Math.abs;

$export($export.S, 'Number', {
  isSafeInteger: function isSafeInteger(number){
    return isInteger(number) && abs(number) <= 0x1fffffffffffff;
  }
});
},{"./$.export":40,"./$.is-integer":55}],138:[function(require,module,exports){
// 20.1.2.6 Number.MAX_SAFE_INTEGER
var $export = require('./$.export');

$export($export.S, 'Number', {MAX_SAFE_INTEGER: 0x1fffffffffffff});
},{"./$.export":40}],139:[function(require,module,exports){
// 20.1.2.10 Number.MIN_SAFE_INTEGER
var $export = require('./$.export');

$export($export.S, 'Number', {MIN_SAFE_INTEGER: -0x1fffffffffffff});
},{"./$.export":40}],140:[function(require,module,exports){
// 20.1.2.12 Number.parseFloat(string)
var $export = require('./$.export');

$export($export.S, 'Number', {parseFloat: parseFloat});
},{"./$.export":40}],141:[function(require,module,exports){
// 20.1.2.13 Number.parseInt(string, radix)
var $export = require('./$.export');

$export($export.S, 'Number', {parseInt: parseInt});
},{"./$.export":40}],142:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./$.export');

$export($export.S + $export.F, 'Object', {assign: require('./$.object-assign')});
},{"./$.export":40,"./$.object-assign":71}],143:[function(require,module,exports){
// 19.1.2.5 Object.freeze(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('freeze', function($freeze){
  return function freeze(it){
    return $freeze && isObject(it) ? $freeze(it) : it;
  };
});
},{"./$.is-object":56,"./$.object-sap":72}],144:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject = require('./$.to-iobject');

require('./$.object-sap')('getOwnPropertyDescriptor', function($getOwnPropertyDescriptor){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./$.object-sap":72,"./$.to-iobject":96}],145:[function(require,module,exports){
// 19.1.2.7 Object.getOwnPropertyNames(O)
require('./$.object-sap')('getOwnPropertyNames', function(){
  return require('./$.get-names').get;
});
},{"./$.get-names":46,"./$.object-sap":72}],146:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('getPrototypeOf', function($getPrototypeOf){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./$.object-sap":72,"./$.to-object":98}],147:[function(require,module,exports){
// 19.1.2.11 Object.isExtensible(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isExtensible', function($isExtensible){
  return function isExtensible(it){
    return isObject(it) ? $isExtensible ? $isExtensible(it) : true : false;
  };
});
},{"./$.is-object":56,"./$.object-sap":72}],148:[function(require,module,exports){
// 19.1.2.12 Object.isFrozen(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isFrozen', function($isFrozen){
  return function isFrozen(it){
    return isObject(it) ? $isFrozen ? $isFrozen(it) : false : true;
  };
});
},{"./$.is-object":56,"./$.object-sap":72}],149:[function(require,module,exports){
// 19.1.2.13 Object.isSealed(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('isSealed', function($isSealed){
  return function isSealed(it){
    return isObject(it) ? $isSealed ? $isSealed(it) : false : true;
  };
});
},{"./$.is-object":56,"./$.object-sap":72}],150:[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $export = require('./$.export');
$export($export.S, 'Object', {is: require('./$.same-value')});
},{"./$.export":40,"./$.same-value":81}],151:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./$.to-object');

require('./$.object-sap')('keys', function($keys){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./$.object-sap":72,"./$.to-object":98}],152:[function(require,module,exports){
// 19.1.2.15 Object.preventExtensions(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('preventExtensions', function($preventExtensions){
  return function preventExtensions(it){
    return $preventExtensions && isObject(it) ? $preventExtensions(it) : it;
  };
});
},{"./$.is-object":56,"./$.object-sap":72}],153:[function(require,module,exports){
// 19.1.2.17 Object.seal(O)
var isObject = require('./$.is-object');

require('./$.object-sap')('seal', function($seal){
  return function seal(it){
    return $seal && isObject(it) ? $seal(it) : it;
  };
});
},{"./$.is-object":56,"./$.object-sap":72}],154:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./$.export');
$export($export.S, 'Object', {setPrototypeOf: require('./$.set-proto').set});
},{"./$.export":40,"./$.set-proto":82}],155:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./$.classof')
  , test    = {};
test[require('./$.wks')('toStringTag')] = 'z';
if(test + '' != '[object z]'){
  require('./$.redefine')(Object.prototype, 'toString', function toString(){
    return '[object ' + classof(this) + ']';
  }, true);
}
},{"./$.classof":28,"./$.redefine":79,"./$.wks":101}],156:[function(require,module,exports){
'use strict';
var $          = require('./$')
  , LIBRARY    = require('./$.library')
  , global     = require('./$.global')
  , ctx        = require('./$.ctx')
  , classof    = require('./$.classof')
  , $export    = require('./$.export')
  , isObject   = require('./$.is-object')
  , anObject   = require('./$.an-object')
  , aFunction  = require('./$.a-function')
  , strictNew  = require('./$.strict-new')
  , forOf      = require('./$.for-of')
  , setProto   = require('./$.set-proto').set
  , same       = require('./$.same-value')
  , SPECIES    = require('./$.wks')('species')
  , speciesConstructor = require('./$.species-constructor')
  , asap       = require('./$.microtask')
  , PROMISE    = 'Promise'
  , process    = global.process
  , isNode     = classof(process) == 'process'
  , P          = global[PROMISE]
  , Wrapper;

var testResolve = function(sub){
  var test = new P(function(){});
  if(sub)test.constructor = Object;
  return P.resolve(test) === test;
};

var USE_NATIVE = function(){
  var works = false;
  function P2(x){
    var self = new P(x);
    setProto(self, P2.prototype);
    return self;
  }
  try {
    works = P && P.resolve && testResolve();
    setProto(P2, P);
    P2.prototype = $.create(P.prototype, {constructor: {value: P2}});
    // actual Firefox has broken subclass support, test that
    if(!(P2.resolve(5).then(function(){}) instanceof P2)){
      works = false;
    }
    // actual V8 bug, https://code.google.com/p/v8/issues/detail?id=4162
    if(works && require('./$.descriptors')){
      var thenableThenGotten = false;
      P.resolve($.setDesc({}, 'then', {
        get: function(){ thenableThenGotten = true; }
      }));
      works = thenableThenGotten;
    }
  } catch(e){ works = false; }
  return works;
}();

// helpers
var sameConstructor = function(a, b){
  // library wrapper special case
  if(LIBRARY && a === P && b === Wrapper)return true;
  return same(a, b);
};
var getConstructor = function(C){
  var S = anObject(C)[SPECIES];
  return S != undefined ? S : C;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var PromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve),
  this.reject  = aFunction(reject)
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(record, isReject){
  if(record.n)return;
  record.n = true;
  var chain = record.c;
  asap(function(){
    var value = record.v
      , ok    = record.s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , result, then;
      try {
        if(handler){
          if(!ok)record.h = true;
          result = handler === true ? value : handler(value);
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    chain.length = 0;
    record.n = false;
    if(isReject)setTimeout(function(){
      var promise = record.p
        , handler, console;
      if(isUnhandled(promise)){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      } record.a = undefined;
    }, 1);
  });
};
var isUnhandled = function(promise){
  var record = promise._d
    , chain  = record.a || record.c
    , i      = 0
    , reaction;
  if(record.h)return false;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var $reject = function(value){
  var record = this;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  record.v = value;
  record.s = 2;
  record.a = record.c.slice();
  notify(record, true);
};
var $resolve = function(value){
  var record = this
    , then;
  if(record.d)return;
  record.d = true;
  record = record.r || record; // unwrap
  try {
    if(record.p === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      asap(function(){
        var wrapper = {r: record, d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      record.v = value;
      record.s = 1;
      notify(record, false);
    }
  } catch(e){
    $reject.call({r: record, d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  P = function Promise(executor){
    aFunction(executor);
    var record = this._d = {
      p: strictNew(this, P, PROMISE),         // <- promise
      c: [],                                  // <- awaiting reactions
      a: undefined,                           // <- checked in isUnhandled reactions
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false,                               // <- handled rejection
      n: false                                // <- notify
    };
    try {
      executor(ctx($resolve, record, 1), ctx($reject, record, 1));
    } catch(err){
      $reject.call(record, err);
    }
  };
  require('./$.redefine-all')(P.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction = new PromiseCapability(speciesConstructor(this, P))
        , promise  = reaction.promise
        , record   = this._d;
      reaction.ok   = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      record.c.push(reaction);
      if(record.a)record.a.push(reaction);
      if(record.s)notify(record, false);
      return promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: P});
require('./$.set-to-string-tag')(P, PROMISE);
require('./$.set-species')(PROMISE);
Wrapper = require('./$.core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = new PromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (!USE_NATIVE || testResolve(true)), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof P && sameConstructor(x.constructor, this))return x;
    var capability = new PromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./$.iter-detect')(function(iter){
  P.all(iter)['catch'](function(){});
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject
      , values     = [];
    var abrupt = perform(function(){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        var alreadyCalled = false;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled = true;
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = getConstructor(this)
      , capability = new PromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./$":64,"./$.a-function":20,"./$.an-object":22,"./$.classof":28,"./$.core":34,"./$.ctx":35,"./$.descriptors":37,"./$.export":40,"./$.for-of":45,"./$.global":47,"./$.is-object":56,"./$.iter-detect":61,"./$.library":66,"./$.microtask":70,"./$.redefine-all":78,"./$.same-value":81,"./$.set-proto":82,"./$.set-species":83,"./$.set-to-string-tag":84,"./$.species-constructor":86,"./$.strict-new":87,"./$.wks":101}],157:[function(require,module,exports){
// 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
var $export = require('./$.export')
  , _apply  = Function.apply;

$export($export.S, 'Reflect', {
  apply: function apply(target, thisArgument, argumentsList){
    return _apply.call(target, thisArgument, argumentsList);
  }
});
},{"./$.export":40}],158:[function(require,module,exports){
// 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
var $         = require('./$')
  , $export   = require('./$.export')
  , aFunction = require('./$.a-function')
  , anObject  = require('./$.an-object')
  , isObject  = require('./$.is-object')
  , bind      = Function.bind || require('./$.core').Function.prototype.bind;

// MS Edge supports only 2 arguments
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
$export($export.S + $export.F * require('./$.fails')(function(){
  function F(){}
  return !(Reflect.construct(function(){}, [], F) instanceof F);
}), 'Reflect', {
  construct: function construct(Target, args /*, newTarget*/){
    aFunction(Target);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if(Target == newTarget){
      // w/o altered newTarget, optimization for 0-4 arguments
      if(args != undefined)switch(anObject(args).length){
        case 0: return new Target;
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (bind.apply(Target, $args));
    }
    // with altered newTarget, not support built-in constructors
    var proto    = newTarget.prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});
},{"./$":64,"./$.a-function":20,"./$.an-object":22,"./$.core":34,"./$.export":40,"./$.fails":42,"./$.is-object":56}],159:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var $        = require('./$')
  , $export  = require('./$.export')
  , anObject = require('./$.an-object');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./$.fails')(function(){
  Reflect.defineProperty($.setDesc({}, 1, {value: 1}), 1, {value: 2});
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes){
    anObject(target);
    try {
      $.setDesc(target, propertyKey, attributes);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$":64,"./$.an-object":22,"./$.export":40,"./$.fails":42}],160:[function(require,module,exports){
// 26.1.4 Reflect.deleteProperty(target, propertyKey)
var $export  = require('./$.export')
  , getDesc  = require('./$').getDesc
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  deleteProperty: function deleteProperty(target, propertyKey){
    var desc = getDesc(anObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  }
});
},{"./$":64,"./$.an-object":22,"./$.export":40}],161:[function(require,module,exports){
'use strict';
// 26.1.5 Reflect.enumerate(target)
var $export  = require('./$.export')
  , anObject = require('./$.an-object');
var Enumerate = function(iterated){
  this._t = anObject(iterated); // target
  this._i = 0;                  // next index
  var keys = this._k = []       // keys
    , key;
  for(key in iterated)keys.push(key);
};
require('./$.iter-create')(Enumerate, 'Object', function(){
  var that = this
    , keys = that._k
    , key;
  do {
    if(that._i >= keys.length)return {value: undefined, done: true};
  } while(!((key = keys[that._i++]) in that._t));
  return {value: key, done: false};
});

$export($export.S, 'Reflect', {
  enumerate: function enumerate(target){
    return new Enumerate(target);
  }
});
},{"./$.an-object":22,"./$.export":40,"./$.iter-create":59}],162:[function(require,module,exports){
// 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
var $        = require('./$')
  , $export  = require('./$.export')
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(target, propertyKey){
    return $.getDesc(anObject(target), propertyKey);
  }
});
},{"./$":64,"./$.an-object":22,"./$.export":40}],163:[function(require,module,exports){
// 26.1.8 Reflect.getPrototypeOf(target)
var $export  = require('./$.export')
  , getProto = require('./$').getProto
  , anObject = require('./$.an-object');

$export($export.S, 'Reflect', {
  getPrototypeOf: function getPrototypeOf(target){
    return getProto(anObject(target));
  }
});
},{"./$":64,"./$.an-object":22,"./$.export":40}],164:[function(require,module,exports){
// 26.1.6 Reflect.get(target, propertyKey [, receiver])
var $        = require('./$')
  , has      = require('./$.has')
  , $export  = require('./$.export')
  , isObject = require('./$.is-object')
  , anObject = require('./$.an-object');

function get(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc, proto;
  if(anObject(target) === receiver)return target[propertyKey];
  if(desc = $.getDesc(target, propertyKey))return has(desc, 'value')
    ? desc.value
    : desc.get !== undefined
      ? desc.get.call(receiver)
      : undefined;
  if(isObject(proto = $.getProto(target)))return get(proto, propertyKey, receiver);
}

$export($export.S, 'Reflect', {get: get});
},{"./$":64,"./$.an-object":22,"./$.export":40,"./$.has":48,"./$.is-object":56}],165:[function(require,module,exports){
// 26.1.9 Reflect.has(target, propertyKey)
var $export = require('./$.export');

$export($export.S, 'Reflect', {
  has: function has(target, propertyKey){
    return propertyKey in target;
  }
});
},{"./$.export":40}],166:[function(require,module,exports){
// 26.1.10 Reflect.isExtensible(target)
var $export       = require('./$.export')
  , anObject      = require('./$.an-object')
  , $isExtensible = Object.isExtensible;

$export($export.S, 'Reflect', {
  isExtensible: function isExtensible(target){
    anObject(target);
    return $isExtensible ? $isExtensible(target) : true;
  }
});
},{"./$.an-object":22,"./$.export":40}],167:[function(require,module,exports){
// 26.1.11 Reflect.ownKeys(target)
var $export = require('./$.export');

$export($export.S, 'Reflect', {ownKeys: require('./$.own-keys')});
},{"./$.export":40,"./$.own-keys":74}],168:[function(require,module,exports){
// 26.1.12 Reflect.preventExtensions(target)
var $export            = require('./$.export')
  , anObject           = require('./$.an-object')
  , $preventExtensions = Object.preventExtensions;

$export($export.S, 'Reflect', {
  preventExtensions: function preventExtensions(target){
    anObject(target);
    try {
      if($preventExtensions)$preventExtensions(target);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.an-object":22,"./$.export":40}],169:[function(require,module,exports){
// 26.1.14 Reflect.setPrototypeOf(target, proto)
var $export  = require('./$.export')
  , setProto = require('./$.set-proto');

if(setProto)$export($export.S, 'Reflect', {
  setPrototypeOf: function setPrototypeOf(target, proto){
    setProto.check(target, proto);
    try {
      setProto.set(target, proto);
      return true;
    } catch(e){
      return false;
    }
  }
});
},{"./$.export":40,"./$.set-proto":82}],170:[function(require,module,exports){
// 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
var $          = require('./$')
  , has        = require('./$.has')
  , $export    = require('./$.export')
  , createDesc = require('./$.property-desc')
  , anObject   = require('./$.an-object')
  , isObject   = require('./$.is-object');

function set(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = $.getDesc(anObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = $.getProto(target))){
      return set(proto, propertyKey, V, receiver);
    }
    ownDesc = createDesc(0);
  }
  if(has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = $.getDesc(receiver, propertyKey) || createDesc(0);
    existingDescriptor.value = V;
    $.setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

$export($export.S, 'Reflect', {set: set});
},{"./$":64,"./$.an-object":22,"./$.export":40,"./$.has":48,"./$.is-object":56,"./$.property-desc":77}],171:[function(require,module,exports){
var $        = require('./$')
  , global   = require('./$.global')
  , isRegExp = require('./$.is-regexp')
  , $flags   = require('./$.flags')
  , $RegExp  = global.RegExp
  , Base     = $RegExp
  , proto    = $RegExp.prototype
  , re1      = /a/g
  , re2      = /a/g
  // "new" creates a new object, old webkit buggy here
  , CORRECT_NEW = new $RegExp(re1) !== re1;

if(require('./$.descriptors') && (!CORRECT_NEW || require('./$.fails')(function(){
  re2[require('./$.wks')('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))){
  $RegExp = function RegExp(p, f){
    var piRE = isRegExp(p)
      , fiU  = f === undefined;
    return !(this instanceof $RegExp) && piRE && p.constructor === $RegExp && fiU ? p
      : CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f);
  };
  $.each.call($.getNames(Base), function(key){
    key in $RegExp || $.setDesc($RegExp, key, {
      configurable: true,
      get: function(){ return Base[key]; },
      set: function(it){ Base[key] = it; }
    });
  });
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  require('./$.redefine')(global, 'RegExp', $RegExp);
}

require('./$.set-species')('RegExp');
},{"./$":64,"./$.descriptors":37,"./$.fails":42,"./$.flags":44,"./$.global":47,"./$.is-regexp":57,"./$.redefine":79,"./$.set-species":83,"./$.wks":101}],172:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
var $ = require('./$');
if(require('./$.descriptors') && /./g.flags != 'g')$.setDesc(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./$.flags')
});
},{"./$":64,"./$.descriptors":37,"./$.flags":44}],173:[function(require,module,exports){
// @@match logic
require('./$.fix-re-wks')('match', 1, function(defined, MATCH){
  // 21.1.3.11 String.prototype.match(regexp)
  return function match(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[MATCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
  };
});
},{"./$.fix-re-wks":43}],174:[function(require,module,exports){
// @@replace logic
require('./$.fix-re-wks')('replace', 2, function(defined, REPLACE, $replace){
  // 21.1.3.14 String.prototype.replace(searchValue, replaceValue)
  return function replace(searchValue, replaceValue){
    'use strict';
    var O  = defined(this)
      , fn = searchValue == undefined ? undefined : searchValue[REPLACE];
    return fn !== undefined
      ? fn.call(searchValue, O, replaceValue)
      : $replace.call(String(O), searchValue, replaceValue);
  };
});
},{"./$.fix-re-wks":43}],175:[function(require,module,exports){
// @@search logic
require('./$.fix-re-wks')('search', 1, function(defined, SEARCH){
  // 21.1.3.15 String.prototype.search(regexp)
  return function search(regexp){
    'use strict';
    var O  = defined(this)
      , fn = regexp == undefined ? undefined : regexp[SEARCH];
    return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[SEARCH](String(O));
  };
});
},{"./$.fix-re-wks":43}],176:[function(require,module,exports){
// @@split logic
require('./$.fix-re-wks')('split', 2, function(defined, SPLIT, $split){
  // 21.1.3.17 String.prototype.split(separator, limit)
  return function split(separator, limit){
    'use strict';
    var O  = defined(this)
      , fn = separator == undefined ? undefined : separator[SPLIT];
    return fn !== undefined
      ? fn.call(separator, O, limit)
      : $split.call(String(O), separator, limit);
  };
});
},{"./$.fix-re-wks":43}],177:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', function(get){
  return function Set(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":33,"./$.collection-strong":30}],178:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $at     = require('./$.string-at')(false);
$export($export.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: function codePointAt(pos){
    return $at(this, pos);
  }
});
},{"./$.export":40,"./$.string-at":88}],179:[function(require,module,exports){
// 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
'use strict';
var $export   = require('./$.export')
  , toLength  = require('./$.to-length')
  , context   = require('./$.string-context')
  , ENDS_WITH = 'endsWith'
  , $endsWith = ''[ENDS_WITH];

$export($export.P + $export.F * require('./$.fails-is-regexp')(ENDS_WITH), 'String', {
  endsWith: function endsWith(searchString /*, endPosition = @length */){
    var that = context(this, searchString, ENDS_WITH)
      , $$   = arguments
      , endPosition = $$.length > 1 ? $$[1] : undefined
      , len    = toLength(that.length)
      , end    = endPosition === undefined ? len : Math.min(toLength(endPosition), len)
      , search = String(searchString);
    return $endsWith
      ? $endsWith.call(that, search, end)
      : that.slice(end - search.length, end) === search;
  }
});
},{"./$.export":40,"./$.fails-is-regexp":41,"./$.string-context":89,"./$.to-length":97}],180:[function(require,module,exports){
var $export        = require('./$.export')
  , toIndex        = require('./$.to-index')
  , fromCharCode   = String.fromCharCode
  , $fromCodePoint = String.fromCodePoint;

// length should be 1, old FF problem
$export($export.S + $export.F * (!!$fromCodePoint && $fromCodePoint.length != 1), 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function fromCodePoint(x){ // eslint-disable-line no-unused-vars
    var res   = []
      , $$    = arguments
      , $$len = $$.length
      , i     = 0
      , code;
    while($$len > i){
      code = +$$[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$.export":40,"./$.to-index":94}],181:[function(require,module,exports){
// 21.1.3.7 String.prototype.includes(searchString, position = 0)
'use strict';
var $export  = require('./$.export')
  , context  = require('./$.string-context')
  , INCLUDES = 'includes';

$export($export.P + $export.F * require('./$.fails-is-regexp')(INCLUDES), 'String', {
  includes: function includes(searchString /*, position = 0 */){
    return !!~context(this, searchString, INCLUDES)
      .indexOf(searchString, arguments.length > 1 ? arguments[1] : undefined);
  }
});
},{"./$.export":40,"./$.fails-is-regexp":41,"./$.string-context":89}],182:[function(require,module,exports){
'use strict';
var $at  = require('./$.string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./$.iter-define":60,"./$.string-at":88}],183:[function(require,module,exports){
var $export   = require('./$.export')
  , toIObject = require('./$.to-iobject')
  , toLength  = require('./$.to-length');

$export($export.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function raw(callSite){
    var tpl   = toIObject(callSite.raw)
      , len   = toLength(tpl.length)
      , $$    = arguments
      , $$len = $$.length
      , res   = []
      , i     = 0;
    while(len > i){
      res.push(String(tpl[i++]));
      if(i < $$len)res.push(String($$[i]));
    } return res.join('');
  }
});
},{"./$.export":40,"./$.to-iobject":96,"./$.to-length":97}],184:[function(require,module,exports){
var $export = require('./$.export');

$export($export.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: require('./$.string-repeat')
});
},{"./$.export":40,"./$.string-repeat":91}],185:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export     = require('./$.export')
  , toLength    = require('./$.to-length')
  , context     = require('./$.string-context')
  , STARTS_WITH = 'startsWith'
  , $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./$.fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /*, position = 0 */){
    var that   = context(this, searchString, STARTS_WITH)
      , $$     = arguments
      , index  = toLength(Math.min($$.length > 1 ? $$[1] : undefined, that.length))
      , search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});
},{"./$.export":40,"./$.fails-is-regexp":41,"./$.string-context":89,"./$.to-length":97}],186:[function(require,module,exports){
'use strict';
// 21.1.3.25 String.prototype.trim()
require('./$.string-trim')('trim', function($trim){
  return function trim(){
    return $trim(this, 3);
  };
});
},{"./$.string-trim":92}],187:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , DESCRIPTORS    = require('./$.descriptors')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setToStringTag = require('./$.set-to-string-tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":64,"./$.an-object":22,"./$.descriptors":37,"./$.enum-keys":39,"./$.export":40,"./$.fails":42,"./$.get-names":46,"./$.global":47,"./$.has":48,"./$.is-array":54,"./$.keyof":65,"./$.library":66,"./$.property-desc":77,"./$.redefine":79,"./$.set-to-string-tag":84,"./$.shared":85,"./$.to-iobject":96,"./$.uid":100,"./$.wks":101}],188:[function(require,module,exports){
'use strict';
var $            = require('./$')
  , redefine     = require('./$.redefine')
  , weak         = require('./$.collection-weak')
  , isObject     = require('./$.is-object')
  , has          = require('./$.has')
  , frozenStore  = weak.frozenStore
  , WEAK         = weak.WEAK
  , isExtensible = Object.isExtensible || isObject
  , tmp          = {};

// 23.3 WeakMap Objects
var $WeakMap = require('./$.collection')('WeakMap', function(get){
  return function WeakMap(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function get(key){
    if(isObject(key)){
      if(!isExtensible(key))return frozenStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this._i];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function set(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if(new $WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var proto  = $WeakMap.prototype
      , method = proto[key];
    redefine(proto, key, function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && !isExtensible(a)){
        var result = frozenStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    });
  });
}
},{"./$":64,"./$.collection":33,"./$.collection-weak":32,"./$.has":48,"./$.is-object":56,"./$.redefine":79}],189:[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', function(get){
  return function WeakSet(){ return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function add(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":33,"./$.collection-weak":32}],190:[function(require,module,exports){
'use strict';
var $export   = require('./$.export')
  , $includes = require('./$.array-includes')(true);

$export($export.P, 'Array', {
  // https://github.com/domenic/Array.prototype.includes
  includes: function includes(el /*, fromIndex = 0 */){
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

require('./$.add-to-unscopables')('includes');
},{"./$.add-to-unscopables":21,"./$.array-includes":25,"./$.export":40}],191:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Map', {toJSON: require('./$.collection-to-json')('Map')});
},{"./$.collection-to-json":31,"./$.export":40}],192:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $export  = require('./$.export')
  , $entries = require('./$.object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it){
    return $entries(it);
  }
});
},{"./$.export":40,"./$.object-to-array":73}],193:[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $          = require('./$')
  , $export    = require('./$.export')
  , ownKeys    = require('./$.own-keys')
  , toIObject  = require('./$.to-iobject')
  , createDesc = require('./$.property-desc');

$export($export.S, 'Object', {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object){
    var O       = toIObject(object)
      , setDesc = $.setDesc
      , getDesc = $.getDesc
      , keys    = ownKeys(O)
      , result  = {}
      , i       = 0
      , key, D;
    while(keys.length > i){
      D = getDesc(O, key = keys[i++]);
      if(key in result)setDesc(result, key, createDesc(0, D));
      else result[key] = D;
    } return result;
  }
});
},{"./$":64,"./$.export":40,"./$.own-keys":74,"./$.property-desc":77,"./$.to-iobject":96}],194:[function(require,module,exports){
// http://goo.gl/XkBrjD
var $export = require('./$.export')
  , $values = require('./$.object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it){
    return $values(it);
  }
});
},{"./$.export":40,"./$.object-to-array":73}],195:[function(require,module,exports){
// https://github.com/benjamingr/RexExp.escape
var $export = require('./$.export')
  , $re     = require('./$.replacer')(/[\\^$*+?.()|[\]{}]/g, '\\$&');

$export($export.S, 'RegExp', {escape: function escape(it){ return $re(it); }});

},{"./$.export":40,"./$.replacer":80}],196:[function(require,module,exports){
// https://github.com/DavidBruant/Map-Set.prototype.toJSON
var $export  = require('./$.export');

$export($export.P, 'Set', {toJSON: require('./$.collection-to-json')('Set')});
},{"./$.collection-to-json":31,"./$.export":40}],197:[function(require,module,exports){
'use strict';
// https://github.com/mathiasbynens/String.prototype.at
var $export = require('./$.export')
  , $at     = require('./$.string-at')(true);

$export($export.P, 'String', {
  at: function at(pos){
    return $at(this, pos);
  }
});
},{"./$.export":40,"./$.string-at":88}],198:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $pad    = require('./$.string-pad');

$export($export.P, 'String', {
  padLeft: function padLeft(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, true);
  }
});
},{"./$.export":40,"./$.string-pad":90}],199:[function(require,module,exports){
'use strict';
var $export = require('./$.export')
  , $pad    = require('./$.string-pad');

$export($export.P, 'String', {
  padRight: function padRight(maxLength /*, fillString = ' ' */){
    return $pad(this, maxLength, arguments.length > 1 ? arguments[1] : undefined, false);
  }
});
},{"./$.export":40,"./$.string-pad":90}],200:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimLeft', function($trim){
  return function trimLeft(){
    return $trim(this, 1);
  };
});
},{"./$.string-trim":92}],201:[function(require,module,exports){
'use strict';
// https://github.com/sebmarkbage/ecmascript-string-left-right-trim
require('./$.string-trim')('trimRight', function($trim){
  return function trimRight(){
    return $trim(this, 2);
  };
});
},{"./$.string-trim":92}],202:[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $export = require('./$.export')
  , $ctx    = require('./$.ctx')
  , $Array  = require('./$.core').Array || Array
  , statics = {};
var setStatics = function(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in $Array)statics[key] = $Array[key];
    else if(key in [])statics[key] = $ctx(Function.call, [][key], length);
  });
};
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill');
$export($export.S, 'Array', statics);
},{"./$":64,"./$.core":34,"./$.ctx":35,"./$.export":40}],203:[function(require,module,exports){
require('./es6.array.iterator');
var global      = require('./$.global')
  , hide        = require('./$.hide')
  , Iterators   = require('./$.iterators')
  , ITERATOR    = require('./$.wks')('iterator')
  , NL          = global.NodeList
  , HTC         = global.HTMLCollection
  , NLProto     = NL && NL.prototype
  , HTCProto    = HTC && HTC.prototype
  , ArrayValues = Iterators.NodeList = Iterators.HTMLCollection = Iterators.Array;
if(NLProto && !NLProto[ITERATOR])hide(NLProto, ITERATOR, ArrayValues);
if(HTCProto && !HTCProto[ITERATOR])hide(HTCProto, ITERATOR, ArrayValues);
},{"./$.global":47,"./$.hide":49,"./$.iterators":63,"./$.wks":101,"./es6.array.iterator":109}],204:[function(require,module,exports){
var $export = require('./$.export')
  , $task   = require('./$.task');
$export($export.G + $export.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.export":40,"./$.task":93}],205:[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var global     = require('./$.global')
  , $export    = require('./$.export')
  , invoke     = require('./$.invoke')
  , partial    = require('./$.partial')
  , navigator  = global.navigator
  , MSIE       = !!navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
var wrap = function(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      typeof fn == 'function' ? fn : Function(fn)
    ), time);
  } : set;
};
$export($export.G + $export.B + $export.F * MSIE, {
  setTimeout:  wrap(global.setTimeout),
  setInterval: wrap(global.setInterval)
});
},{"./$.export":40,"./$.global":47,"./$.invoke":51,"./$.partial":75}],206:[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.freeze');
require('./modules/es6.object.seal');
require('./modules/es6.object.prevent-extensions');
require('./modules/es6.object.is-frozen');
require('./modules/es6.object.is-sealed');
require('./modules/es6.object.is-extensible');
require('./modules/es6.object.get-own-property-descriptor');
require('./modules/es6.object.get-prototype-of');
require('./modules/es6.object.keys');
require('./modules/es6.object.get-own-property-names');
require('./modules/es6.function.name');
require('./modules/es6.function.has-instance');
require('./modules/es6.number.constructor');
require('./modules/es6.number.epsilon');
require('./modules/es6.number.is-finite');
require('./modules/es6.number.is-integer');
require('./modules/es6.number.is-nan');
require('./modules/es6.number.is-safe-integer');
require('./modules/es6.number.max-safe-integer');
require('./modules/es6.number.min-safe-integer');
require('./modules/es6.number.parse-float');
require('./modules/es6.number.parse-int');
require('./modules/es6.math.acosh');
require('./modules/es6.math.asinh');
require('./modules/es6.math.atanh');
require('./modules/es6.math.cbrt');
require('./modules/es6.math.clz32');
require('./modules/es6.math.cosh');
require('./modules/es6.math.expm1');
require('./modules/es6.math.fround');
require('./modules/es6.math.hypot');
require('./modules/es6.math.imul');
require('./modules/es6.math.log10');
require('./modules/es6.math.log1p');
require('./modules/es6.math.log2');
require('./modules/es6.math.sign');
require('./modules/es6.math.sinh');
require('./modules/es6.math.tanh');
require('./modules/es6.math.trunc');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.trim');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp.constructor');
require('./modules/es6.regexp.flags');
require('./modules/es6.regexp.match');
require('./modules/es6.regexp.replace');
require('./modules/es6.regexp.search');
require('./modules/es6.regexp.split');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect.apply');
require('./modules/es6.reflect.construct');
require('./modules/es6.reflect.define-property');
require('./modules/es6.reflect.delete-property');
require('./modules/es6.reflect.enumerate');
require('./modules/es6.reflect.get');
require('./modules/es6.reflect.get-own-property-descriptor');
require('./modules/es6.reflect.get-prototype-of');
require('./modules/es6.reflect.has');
require('./modules/es6.reflect.is-extensible');
require('./modules/es6.reflect.own-keys');
require('./modules/es6.reflect.prevent-extensions');
require('./modules/es6.reflect.set');
require('./modules/es6.reflect.set-prototype-of');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.string.pad-left');
require('./modules/es7.string.pad-right');
require('./modules/es7.string.trim-left');
require('./modules/es7.string.trim-right');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.values');
require('./modules/es7.object.entries');
require('./modules/es7.map.to-json');
require('./modules/es7.set.to-json');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$.core');
},{"./modules/$.core":34,"./modules/es5":103,"./modules/es6.array.copy-within":104,"./modules/es6.array.fill":105,"./modules/es6.array.find":107,"./modules/es6.array.find-index":106,"./modules/es6.array.from":108,"./modules/es6.array.iterator":109,"./modules/es6.array.of":110,"./modules/es6.array.species":111,"./modules/es6.function.has-instance":112,"./modules/es6.function.name":113,"./modules/es6.map":114,"./modules/es6.math.acosh":115,"./modules/es6.math.asinh":116,"./modules/es6.math.atanh":117,"./modules/es6.math.cbrt":118,"./modules/es6.math.clz32":119,"./modules/es6.math.cosh":120,"./modules/es6.math.expm1":121,"./modules/es6.math.fround":122,"./modules/es6.math.hypot":123,"./modules/es6.math.imul":124,"./modules/es6.math.log10":125,"./modules/es6.math.log1p":126,"./modules/es6.math.log2":127,"./modules/es6.math.sign":128,"./modules/es6.math.sinh":129,"./modules/es6.math.tanh":130,"./modules/es6.math.trunc":131,"./modules/es6.number.constructor":132,"./modules/es6.number.epsilon":133,"./modules/es6.number.is-finite":134,"./modules/es6.number.is-integer":135,"./modules/es6.number.is-nan":136,"./modules/es6.number.is-safe-integer":137,"./modules/es6.number.max-safe-integer":138,"./modules/es6.number.min-safe-integer":139,"./modules/es6.number.parse-float":140,"./modules/es6.number.parse-int":141,"./modules/es6.object.assign":142,"./modules/es6.object.freeze":143,"./modules/es6.object.get-own-property-descriptor":144,"./modules/es6.object.get-own-property-names":145,"./modules/es6.object.get-prototype-of":146,"./modules/es6.object.is":150,"./modules/es6.object.is-extensible":147,"./modules/es6.object.is-frozen":148,"./modules/es6.object.is-sealed":149,"./modules/es6.object.keys":151,"./modules/es6.object.prevent-extensions":152,"./modules/es6.object.seal":153,"./modules/es6.object.set-prototype-of":154,"./modules/es6.object.to-string":155,"./modules/es6.promise":156,"./modules/es6.reflect.apply":157,"./modules/es6.reflect.construct":158,"./modules/es6.reflect.define-property":159,"./modules/es6.reflect.delete-property":160,"./modules/es6.reflect.enumerate":161,"./modules/es6.reflect.get":164,"./modules/es6.reflect.get-own-property-descriptor":162,"./modules/es6.reflect.get-prototype-of":163,"./modules/es6.reflect.has":165,"./modules/es6.reflect.is-extensible":166,"./modules/es6.reflect.own-keys":167,"./modules/es6.reflect.prevent-extensions":168,"./modules/es6.reflect.set":170,"./modules/es6.reflect.set-prototype-of":169,"./modules/es6.regexp.constructor":171,"./modules/es6.regexp.flags":172,"./modules/es6.regexp.match":173,"./modules/es6.regexp.replace":174,"./modules/es6.regexp.search":175,"./modules/es6.regexp.split":176,"./modules/es6.set":177,"./modules/es6.string.code-point-at":178,"./modules/es6.string.ends-with":179,"./modules/es6.string.from-code-point":180,"./modules/es6.string.includes":181,"./modules/es6.string.iterator":182,"./modules/es6.string.raw":183,"./modules/es6.string.repeat":184,"./modules/es6.string.starts-with":185,"./modules/es6.string.trim":186,"./modules/es6.symbol":187,"./modules/es6.weak-map":188,"./modules/es6.weak-set":189,"./modules/es7.array.includes":190,"./modules/es7.map.to-json":191,"./modules/es7.object.entries":192,"./modules/es7.object.get-own-property-descriptors":193,"./modules/es7.object.values":194,"./modules/es7.regexp.escape":195,"./modules/es7.set.to-json":196,"./modules/es7.string.at":197,"./modules/es7.string.pad-left":198,"./modules/es7.string.pad-right":199,"./modules/es7.string.trim-left":200,"./modules/es7.string.trim-right":201,"./modules/js.array.statics":202,"./modules/web.dom.iterable":203,"./modules/web.immediate":204,"./modules/web.timers":205}],207:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],208:[function(require,module,exports){
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
    onEachEvent = function(e, fn) { e.replace(/\S+/g, fn) },
    defineProperty = function (key, value) {
      Object.defineProperty(el, key, {
        value: value,
        enumerable: false,
        writable: false,
        configurable: false
      })
    }

  /**
   * Listen to the given space separated list of `events` and execute the `callback` each time an event is triggered.
   * @param  { String } events - events ids
   * @param  { Function } fn - callback function
   * @returns { Object } el
   */
  defineProperty('on', function(events, fn) {
    if (typeof fn != 'function')  return el

    onEachEvent(events, function(name, pos) {
      (callbacks[name] = callbacks[name] || []).push(fn)
      fn.typed = pos > 0
    })

    return el
  })

  /**
   * Removes the given space separated list of `events` listeners
   * @param   { String } events - events ids
   * @param   { Function } fn - callback function
   * @returns { Object } el
   */
  defineProperty('off', function(events, fn) {
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
  })

  /**
   * Listen to the given space separated list of `events` and execute the `callback` at most once
   * @param   { String } events - events ids
   * @param   { Function } fn - callback function
   * @returns { Object } el
   */
  defineProperty('one', function(events, fn) {
    function on() {
      el.off(events, on)
      fn.apply(el, arguments)
    }
    return el.on(events, on)
  })

  /**
   * Execute all callback functions that listen to the given space separated list of `events`
   * @param   { String } events - events ids
   * @returns { Object } el
   */
  defineProperty('trigger', function(events) {

    // getting the arguments
    // skipping the first one
    var args = slice.call(arguments, 1),
      fns

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
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczZcXEJvb3QuZXM2IiwiZXM2XFxDaGFtYnJcXEJBU0tFVC5lczYiLCJlczZcXENoYW1iclxcQ2xpZW50LmVzNiIsImVzNlxcQ2hhbWJyXFxfQ29uc3RhbnRzLlNoYXJlZC5lczYiLCJlczZcXERlZmF1bHRzXFxSaW90LmVzNiIsImVzNlxcRGVmYXVsdHNcXFN5c3RlbS5lczYiLCJlczZcXEdhdGV3YXlcXENsaWVudC5lczYiLCJlczZcXEdhdGV3YXlcXFV0aWxzLlNoYXJlZC5lczYiLCJlczZcXEdhdGV3YXlcXF9BYnN0cmFjdC5TaGFyZWQuZXM2IiwiZXM2XFxHYXRld2F5XFxfQ29uc3RhbnRzLlNoYXJlZC5lczYiLCJlczZcXFJpb3QuZXM2IiwiZXM2L1RhZ3MvQWxsLmVzNiIsImVzNlxcVGFnc1xcQXBwLmVzNiIsImVzNlxcVGFnc1xcTm90ZXMuZXM2IiwiZXM2XFxUYWdzXFxVSS5TZWxlY3RDb2xvci5lczYiLCJlczZcXFRhZ3NcXF9BYnN0cmFjdC5lczYiLCJlczZcXF9EZWJ1Zy5lczYiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbGliL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9iYWJlbC1yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmEtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmFkZC10by11bnNjb3BhYmxlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hcnJheS1jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXJyYXktZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXJyYXktaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmFycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmFycmF5LXNwZWNpZXMtY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jbGFzc29mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jb2xsZWN0aW9uLXRvLWpzb24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvbGxlY3Rpb24td2Vhay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29yZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZG9tLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5leHBvcnQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZmFpbHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZpeC1yZS13a3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5mb3Itb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmdldC1uYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5oYXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmhpZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmh0bWwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmludm9rZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmlzLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmlzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXMtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pdGVyLWNhbGwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXItY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQua2V5b2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmxpYnJhcnkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLm1hdGgtZXhwbTEuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLm1hdGgtbG9nMXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLm1hdGgtc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQubWljcm90YXNrLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5vYmplY3QtYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5vYmplY3Qtc2FwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5vYmplY3QtdG8tYXJyYXkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLm93bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5wYXJ0aWFsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5wYXRoLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5yZWRlZmluZS1hbGwuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnJlZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5yZXBsYWNlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc2FtZS12YWx1ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zZXQtc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3RyaWN0LW5ldy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zdHJpbmctY29udGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3RyaW5nLXBhZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3RyaW5nLXJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3RyaW5nLXRyaW0uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnRhc2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnRvLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC50by1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC50by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC50by1sZW5ndGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnRvLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC51aWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLndrcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5jb3B5LXdpdGhpbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbmQtaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmluZC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lm9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LnNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZnVuY3Rpb24uaGFzLWluc3RhbmNlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguYWNvc2guanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5hc2luaC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmF0YW5oLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY2JydC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmNsejMyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguY29zaC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmV4cG0xLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguZnJvdW5kLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguaHlwb3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5pbXVsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGgubG9nMTAuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5sb2cxcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLmxvZzIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC5zaWduLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguc2luaC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXRoLnRhbmguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWF0aC50cnVuYy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmVwc2lsb24uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmlzLWZpbml0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuaXMtbmFuLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5pcy1zYWZlLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLm1heC1zYWZlLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLm1pbi1zYWZlLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLnBhcnNlLWZsb2F0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5wYXJzZS1pbnQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuZnJlZXplLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktbmFtZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmdldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLWV4dGVuc2libGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLWZyb3plbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuaXMtc2VhbGVkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5pcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QucHJldmVudC1leHRlbnNpb25zLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZWFsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmFwcGx5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuY29uc3RydWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZGVsZXRlLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZW51bWVyYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZmxlY3QuZ2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmdldC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0Lmhhcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmlzLWV4dGVuc2libGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5vd24ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LnByZXZlbnQtZXh0ZW5zaW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVmbGVjdC5zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5mbGFncy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAubWF0Y2guanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnNlYXJjaC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuc3BsaXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5lbmRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5yYXcuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnJlcGVhdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnRyaW0uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstbWFwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LndlYWstc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm1hcC50by1qc29uLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5lbnRyaWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC52YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcucmVnZXhwLmVzY2FwZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zZXQudG8tanNvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcuYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLnBhZC1sZWZ0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnN0cmluZy5wYWQtcmlnaHQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLnRyaW0tbGVmdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zdHJpbmcudHJpbS1yaWdodC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXBvbHlmaWxsL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLmltbWVkaWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1wb2x5ZmlsbC9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi50aW1lcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcG9seWZpbGwvbm9kZV9tb2R1bGVzL2NvcmUtanMvc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvcmlvdC1vYnNlcnZhYmxlL2Rpc3Qvb2JzZXJ2YWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ09BLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBOztBQUUxQixFQUFFLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxZQUFNO0FBQzFCLE1BQUUsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2xDLG1CQUFLLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQTtDQUNwQixDQUFDLENBQUE7Ozs7Ozs7O0FDWkssSUFBTSxNQUFNLFdBQU4sTUFBTSxHQUFHLEVBQUUsQ0FBQTs7QUFFeEIsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0N6QjtBQUdJLGFBSE0sTUFBTSxHQUdDOzs7OEJBSFAsTUFBTTs7QUFJUixZQUFJLE1BQU0sR0FBRyxJQUFJLENBQUE7QUFDakIsWUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsV0FBVyxFQUFFLFVBQUEsSUFBSSxFQUFJO0FBQzVCLGNBQUUsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsQ0FBQTtBQUM3QixrQkFBSyxJQUFJLEdBQUcsSUFBSSxDQUFBO0FBQ2hCLGdCQUFJLEVBQUUsR0FBRyxRQVhaLE1BQU0sQ0FXYSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBSyxRQUFRLEVBQUUsQ0FBQTs7QUFFNUMsZ0JBQUksQ0FBQyxFQUFFLENBQUMsUUFBUSxTQUFPLElBQUksQ0FBQyxJQUFJLEVBQUksVUFBUyxFQUFFLEVBQUM7QUFDNUMsa0JBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFBO0FBQ2Isb0JBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqcEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pFQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCAnYmFiZWwtcG9seWZpbGwnXHJcbmltcG9ydCAnLi9fRGVidWcuZXM2J1xyXG5pbXBvcnQgcmlvdCBmcm9tICcuL1Jpb3QuZXM2J1xyXG5pbXBvcnQgJy4vR2F0ZXdheS9DbGllbnQuZXM2J1xyXG5pbXBvcnQgJy4vQ2hhbWJyL0NsaWVudC5lczYnXHJcbmltcG9ydCAnLi9UYWdzL0FsbC5lczYnXHJcblxyXG5jaSgnU2l0ZSBlbmdpbmUgc3RhcnRlZC4nKVxyXG5cclxuR1cuc3ViKCdXb3JrZXItPlJlYWR5JywgKCkgPT4ge1xyXG4gICAgY2koJ01haW4gQXBwIGlzIHRyeWluZyB0byBtb3VudC4nKVxyXG4gICAgcmlvdC5tb3VudCgnYXBwJylcclxufSkiLCJleHBvcnQgY29uc3QgQkFTS0VUID0ge31cclxuXHJcbnNlbGYuJCA9IHNlbGYuJCB8fCBCQVNLRVQiLCJpbXBvcnQgeyBCQVNLRVQgfSBmcm9tICcuL0JBU0tFVC5lczYnXHJcbmltcG9ydCByaW90IGZyb20gJy4uL1Jpb3QuZXM2J1xyXG5cclxubmV3IGNsYXNzIENsaWVudCB7XHJcbiAgICBkYXRhO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgbGV0IGNsaWVudCA9IHRoaXNcclxuICAgICAgICBzZWxmLkdXLm9uKCckLT5FeHBvc2UnLCBkYXRhID0+IHtcclxuICAgICAgICAgICAgY2koJyQgSW5jb21pbmcgZXhwb3NlJywgZGF0YSlcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YVxyXG4gICAgICAgICAgICBsZXQgQlMgPSBCQVNLRVRbZGF0YS5uYW1lXSA9IHRoaXMuYXBwbHlBUEkoKVxyXG5cclxuICAgICAgICAgICAgc2VsZi5HVy5yZWdpc3RlcihgJC0+JHtkYXRhLm5hbWV9YCwgZnVuY3Rpb24oZXYpe1xyXG4gICAgICAgICAgICAgICAgZXYgPSBldiB8fCB7fVxyXG4gICAgICAgICAgICAgICAgbGV0IHBhcnNlZCA9IHNlbGYuR1cucGFyc2UoZXYubmFtZSlcclxuICAgICAgICAgICAgICAgIHBhcnNlZC5zdGF0ZSAmJiBCUy50cmlnZ2VyKCdzdGF0ZScsIHBhcnNlZClcclxuICAgICAgICAgICAgICAgIGlmIChwYXJzZWQuc3RhdGUgPT09ICdkb25lJyAmJiBldi5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayBpbiBCUykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoQlMuaGFzT3duUHJvcGVydHkoaykpIGRlbGV0ZSBCU1trXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKEJTLCBldi5kYXRhKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgQlMuc2NvcGVcclxuICAgICAgICAgICAgICAgICYmIHBhcnNlZC5zdGF0ZVxyXG4gICAgICAgICAgICAgICAgJiYgIXBhcnNlZC5zaWxlbnRcclxuICAgICAgICAgICAgICAgICYmIEJTLnNjb3BlLnVwZGF0ZSgpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBhcHBseUFQSSgpe1xyXG4gICAgICAgIGlmICh0aGlzLl9oYXNQcm90bykgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5faGFzUHJvdG8gPSB0cnVlXHJcbiAgICAgICAgbGV0IGQgPSB0aGlzLmRhdGEuZGF0YSB8fCB7fVxyXG4gICAgICAgIHRoaXMuZGF0YS5hcGkuZm9yRWFjaCgobWV0aG9kKSA9PiB7XHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkLCBtZXRob2QsIHtcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB0aGlzLl9fTUVUSE9EKHRoaXMuZGF0YS5uYW1lLCBtZXRob2QpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgICByaW90Lm9ic2VydmFibGUoZClcclxuICAgICAgICByZXR1cm4gZFxyXG4gICAgfVxyXG5cclxuICAgIF9fTUVUSE9EKG5hbWUsIG1ldGhvZCl7XHJcbiAgICAgICAgbGV0IF90aGF0ID0gdGhpc1xyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICBsZXQgdGhhdCA9IHRoaXNcclxuICAgICAgICAgICAgbGV0IGFnMSA9IGFyZ3VtZW50c1xyXG5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBhZzFbMF0gPT09ICdvYmplY3QnICYmIGFnMVswXS5taXhpbikge1xyXG4gICAgICAgICAgICAgICAgbGV0IHNjb3BlID0gQkFTS0VUW25hbWVdLnNjb3BlID0gYWcxWzBdXHJcbiAgICAgICAgICAgICAgICBhZzEgPSBbXS5zbGljZS5jYWxsKGFnMSwgMSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpe1xyXG4gICAgICAgICAgICAgICAgLy8gVE9ETyBvbmNlISEhIVxyXG4gICAgICAgICAgICAgICAgc2VsZi5HVy5zdWIoYCQtPiR7bmFtZX0tPiR7bWV0aG9kfTo6ZG9uZWAsIGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGFnMiA9IGFyZ3VtZW50c1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBzY29wZSA9IEJBU0tFVFtuYW1lXS5zY29wZVxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodGhhdCwgYWcyKVxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NvcGUgJiYgc2NvcGUudXBkYXRlKClcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIHNlbGYuR1cucHViKGAkLT4ke25hbWV9LT4ke21ldGhvZH1gLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJnTGlzdDogYWcxXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJleHBvcnQgY29uc3QgQ0hBTUJSX1JJT1RfTUlYSU4gPSAnJCdcclxuXHJcbmV4cG9ydCBjb25zdCBEQiA9IHtcclxuICAgIENIQU5HRTogICAnY2hhbmdlJyxcclxuICAgIENPTVBMRVRFOiAnY29tcGxldGUnLFxyXG4gICAgRVJST1I6ICAgICdlcnJvcicsXHJcbiAgICBOT1c6ICAgICAgJ25vdycsXHJcblxyXG4gICAgLy8gT25seSBhdCByZXBsaWNhdGlvbiBhbmQgc3luY1xyXG4gICAgREVOSUVEOiAnZGVuaWVkJyxcclxuICAgIEFDVElWRTogJ2FjdGl2ZScsXHJcbiAgICBQQVVTRUQ6ICdwYXVzZWQnXHJcbn0iLCJpbXBvcnQgeyBSSU9UX01JWElOIGFzIEFNX01JWElOIH0gZnJvbSAnLi4vQ2hhbWJyL19Db25zdGFudHMuU2hhcmVkLmVzNidcclxuXHJcbmV4cG9ydCB2YXIgSW1wbCA9IHtcclxuICAgIHRtcGw6ICcnLFxyXG4gICAgZm46IHVuZGVmaW5lZCxcclxuICAgIGF0dHJzOiB1bmRlZmluZWRcclxufVxyXG5cclxuZXhwb3J0IHZhciBDb25mID0ge1xyXG4gICAgcm9vdDogdW5kZWZpbmVkLFxyXG4gICAgb3B0czogdW5kZWZpbmVkLFxyXG4gICAgaXNMb29wOiBmYWxzZSxcclxuICAgIGhhc0ltcGw6IGZhbHNlLFxyXG4gICAgaXRlbTogdW5kZWZpbmVkXHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgQ3VzdG9tID0ge1xyXG4gICAgQXV0b1VwZGF0ZTogdHJ1ZSxcclxuICAgIEF1dG9NaXhpbnM6IFtBTV9NSVhJTl1cclxufVxyXG4iLCJleHBvcnQgY29uc3QgSU5GTyA9IHtcclxuICAgIHZlcnNpb246IDAuMVxyXG59XHJcblxyXG5leHBvcnQgY29uc3QgREVCVUcgPSB0cnVlIiwiaW1wb3J0IEFic3RyYWN0IGZyb20gJy4vX0Fic3RyYWN0LlNoYXJlZC5lczYnXHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgY2xhc3MgQ2xpZW50IGV4dGVuZHMgQWJzdHJhY3Qge1xyXG5cclxuICAgIFdvcmtlcjtcclxuXHJcbiAgICBnZXQgUHJvbWlzZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9wcm9taXNlXHJcbiAgICB9XHJcblxyXG4gICAgc2V0IFByb21pc2UocCl7XHJcbiAgICAgICAgdGhpcy5fcHJvbWlzZSA9IHBcclxuICAgIH1cclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHN1cGVyKClcclxuICAgICAgICBjaSgnR2F0ZXdheSBDbGllbnQgc3RhcnRlZC4nKVxyXG4gICAgICAgIHRoaXMuc3RhcnQoJ2Rpc3Qvd29ya2VyLmpzJylcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCh3b3JrZXIpe1xyXG4gICAgICAgIHRoaXMuUHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuV29ya2VyID0gbmV3IFdvcmtlcih3b3JrZXIpXHJcbiAgICAgICAgICAgIHRoaXMuV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXYpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoZXYuZGF0YSlcclxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlKGV2LmRhdGEpXHJcbiAgICAgICAgICAgIH0sIHRydWUpXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSIsImltcG9ydCAqIGFzIEMgZnJvbSAnLi9fQ29uc3RhbnRzLlNoYXJlZC5lczYnXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRSb3V0ZSAoKXtcclxuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwoYXJndW1lbnRzLCBCb29sZWFuKVxyXG4gICAgICAgICAgIC5qb2luKEMuRVZFTlRfREVMSU1JVEVSKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJIZWxwZXIobmFtZSwgaGFuZGxlciwgSGFuZGxlcnMpe1xyXG4gICAgLy8gRXh0cmFjdCBzZWdtZW50c1xyXG4gICAgbGV0IHNlZ21lbnRzID0gbmFtZS5zcGxpdChDLkVWRU5UX0RFTElNSVRFUilcclxuXHJcbiAgICAvLyBBcHBseSBzZWdtZW50cyBhbmQgcHJvdG90eXBlXHJcbiAgICBsZXQgdGVtcCA9IEhhbmRsZXJzXHJcbiAgICBzZWdtZW50cy5mb3JFYWNoKChrLCBpLCBhKSA9PiB7XHJcbiAgICAgICAgaWYgKCF0ZW1wLmhhc093blByb3BlcnR5KGspKSB7XHJcbiAgICAgICAgICAgIHRlbXBba10gPSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVyczogW11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0ZW1wID0gdGVtcFtrXVxyXG4gICAgICAgICsraSA9PT0gYS5sZW5ndGggJiYgdGVtcC5oYW5kbGVycy5wdXNoKGhhbmRsZXIpXHJcbiAgICB9KVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VSb3V0ZShyb3V0ZSwgSGFuZGxlcnMpe1xyXG4gICAgbGV0IHBhcnNlZCA9IEhhbmRsZXJzXHJcbiAgICByb3V0ZS5zcGxpdChDLkVWRU5UX0RFTElNSVRFUikuZm9yRWFjaCgocykgPT4ge1xyXG4gICAgICAgIHBhcnNlZC5oYXNPd25Qcm9wZXJ0eShzKSAmJiAocGFyc2VkID0gcGFyc2VkW3NdKVxyXG4gICAgfSlcclxuICAgIHJldHVybiBwYXJzZWRcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZXJIZWxwZXIoSGFuZGxlcnMsIGV2KXtcclxuICAgIGxldCBwYXJzZWQgPSBwYXJzZVJvdXRlKGV2Lm5hbWUsIEhhbmRsZXJzKVxyXG4gICAgYXBwbHlIYW5kbGVycyhwYXJzZWQsIGV2KVxyXG59XHJcblxyXG5mdW5jdGlvbiBhcHBseUhhbmRsZXJzKG9iaiwgZXYpe1xyXG4gICAgZm9yIChsZXQgaSBpbiBvYmopIHtcclxuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGkpKXtcclxuICAgICAgICAgICAgdHlwZW9mIG9ialtpXSA9PT0gJ29iamVjdCdcclxuICAgICAgICAgICAgJiYgaGFuZGxlckhlbHBlcihvYmpbaV0sIGV2KTtcclxuXHJcbiAgICAgICAgICAgIChpID0gb2JqLmhhbmRsZXJzKVxyXG4gICAgICAgICAgICAmJiBpLmxlbmd0aFxyXG4gICAgICAgICAgICAmJiBpLmZvckVhY2goKGZuKSA9PiBmbi5jYWxsKG51bGwsIGV2KSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgT2JzZXJ2YWJsZSBmcm9tICdyaW90LW9ic2VydmFibGUnXHJcbmltcG9ydCB7IHJlZ2lzdGVySGVscGVyLCBoYW5kbGVySGVscGVyLCBidWlsZFJvdXRlIH0gZnJvbSAnLi9VdGlscy5TaGFyZWQuZXM2J1xyXG5pbXBvcnQgKiBhcyBDIGZyb20gJy4vX0NvbnN0YW50cy5TaGFyZWQuZXM2J1xyXG5cclxuY29uc3QgSGFuZGxlcnMgPSB7fVxyXG5jb25zdCBERUJVR19FVkVOVFMgPSB0cnVlXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBYnN0cmFjdCB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICBPYnNlcnZhYmxlKHRoaXMpXHJcbiAgICAgICAgc2VsZi5HVyA9IHRoaXNcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlcihuYW1lLCBoYW5kbGVyKXtcclxuICAgICAgICByZWdpc3RlckhlbHBlcihuYW1lLCBoYW5kbGVyLCBIYW5kbGVycylcclxuICAgIH1cclxuXHJcbiAgICBwYXJzZShpbnB1dCl7XHJcbiAgICAgICAgbGV0IHBhcnNlZCA9IGlucHV0LnNwbGl0KEMuRVZFTlRfREVMSU1JVEVSKVxyXG4gICAgICAgIGxldCBsYXN0ID0gcGFyc2VkW3BhcnNlZC5sZW5ndGggLSAxXVxyXG4gICAgICAgIGxldCB2aXJ0dWFsID0gbGFzdC5zcGxpdCgnOjo6OicpWzFdXHJcbiAgICAgICAgbGV0IHN0YXRlID0gdmlydHVhbCB8fCBsYXN0LnNwbGl0KCc6OicpWzFdIHx8IGZhbHNlXHJcblxyXG4gICAgICAgIHN0YXRlICYmIChwYXJzZWRbcGFyc2VkLmxlbmd0aCAtIDFdID0gbGFzdC5zcGxpdCgnOjonKVswXSlcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2VnbWVudHM6IHBhcnNlZCxcclxuICAgICAgICAgICAgc3RhdGU6IHN0YXRlLFxyXG4gICAgICAgICAgICBzaWxlbnQ6ICEhdmlydHVhbFxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBidWlsZCguLi5hcmcpe1xyXG4gICAgICAgIHJldHVybiBidWlsZFJvdXRlKC4uLmFyZylcclxuICAgIH1cclxuXHJcbiAgICBzdWIobmFtZSwgaGFuZGxlcil7XHJcbiAgICAgICAgbmFtZSA9IHRoaXMuYnVpbGQobmFtZSlcclxuICAgICAgICB0aGlzLm9uKG5hbWUsIGhhbmRsZXIpXHJcbiAgICB9XHJcblxyXG4gICAgcHViKG5hbWUsIGRhdGEsIHNraXBQb3N0KXtcclxuICAgICAgICBuYW1lID0gdGhpcy5idWlsZChuYW1lKVxyXG4gICAgICAgIGlmICghc2tpcFBvc3QgJiYgIXNlbGYuZG9jdW1lbnQucXVlcnlTZWxlY3Rvcikge1xyXG4gICAgICAgICAgICBzZWxmLnBvc3RNZXNzYWdlKHtuYW1lLCBkYXRhfSlcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSBpZighc2tpcFBvc3Qpe1xyXG4gICAgICAgICAgICB0aGlzLldvcmtlci5wb3N0TWVzc2FnZSh7bmFtZSwgZGF0YX0pXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMudHJpZ2dlcihuYW1lLCBkYXRhKVxyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZShldil7XHJcbiAgICAgICAgY2koYEV2ZW50OiAke2V2Lm5hbWV9YClcclxuICAgICAgICB0aGlzLnB1Yihldi5uYW1lLCBldi5kYXRhLCB0cnVlKVxyXG4gICAgICAgIGhhbmRsZXJIZWxwZXIoSGFuZGxlcnMsIGV2KVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNvbnN0IFJJT1RfTUlYSU4gPSAnY2hhbWJyLXJpb3QtbWl4aW4nXHJcblxyXG5leHBvcnQgY29uc3QgRVZFTlRfRE9ORV9TVUZGSVggPSAnZG9uZSdcclxuZXhwb3J0IGNvbnN0IEVWRU5UX0RFTElNSVRFUiAgID0gJy0+J1xyXG5leHBvcnQgY29uc3QgRVZFTlRfQ0xJRU5UICAgICAgPSAnQ2xpZW50J1xyXG5leHBvcnQgY29uc3QgRVZFTlRfV09SS0VSICAgICAgPSAnV29ya2VyJyIsIi8qIFJpb3QgdjIuMy4xNSwgQGxpY2Vuc2UgTUlULCAoYykgMjAxNSBNdXV0IEluYy4gKyBjb250cmlidXRvcnMgKi9cclxuXHJcbjsoZnVuY3Rpb24od2luZG93LCB1bmRlZmluZWQpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIHZhciByaW90ID0geyB2ZXJzaW9uOiAndjIuMy4xNScsIHNldHRpbmdzOiB7fSB9LFxyXG4gICAgLy8gYmUgYXdhcmUsIGludGVybmFsIHVzYWdlXHJcbiAgICAvLyBBVFRFTlRJT046IHByZWZpeCB0aGUgZ2xvYmFsIGR5bmFtaWMgdmFyaWFibGVzIHdpdGggYF9fYFxyXG5cclxuICAgIC8vIGNvdW50ZXIgdG8gZ2l2ZSBhIHVuaXF1ZSBpZCB0byBhbGwgdGhlIFRhZyBpbnN0YW5jZXNcclxuICAgICAgICBfX3VpZCA9IDAsXHJcbiAgICAvLyB0YWdzIGluc3RhbmNlcyBjYWNoZVxyXG4gICAgICAgIF9fdmlydHVhbERvbSA9IFtdLFxyXG4gICAgLy8gdGFncyBpbXBsZW1lbnRhdGlvbiBjYWNoZVxyXG4gICAgICAgIF9fdGFnSW1wbCA9IHt9LFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDb25zdFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgICAgICAvLyByaW90IHNwZWNpZmljIHByZWZpeGVzXHJcbiAgICAgICAgUklPVF9QUkVGSVggPSAncmlvdC0nLFxyXG4gICAgICAgIFJJT1RfVEFHID0gUklPVF9QUkVGSVggKyAndGFnJyxcclxuXHJcbiAgICAvLyBmb3IgdHlwZW9mID09ICcnIGNvbXBhcmlzb25zXHJcbiAgICAgICAgVF9TVFJJTkcgPSAnc3RyaW5nJyxcclxuICAgICAgICBUX09CSkVDVCA9ICdvYmplY3QnLFxyXG4gICAgICAgIFRfVU5ERUYgID0gJ3VuZGVmaW5lZCcsXHJcbiAgICAgICAgVF9GVU5DVElPTiA9ICdmdW5jdGlvbicsXHJcbiAgICAvLyBzcGVjaWFsIG5hdGl2ZSB0YWdzIHRoYXQgY2Fubm90IGJlIHRyZWF0ZWQgbGlrZSB0aGUgb3RoZXJzXHJcbiAgICAgICAgU1BFQ0lBTF9UQUdTX1JFR0VYID0gL14oPzp0KD86Ym9keXxoZWFkfGZvb3R8W3JoZF0pfGNhcHRpb258Y29sKD86Z3JvdXApP3xvcHQoPzppb258Z3JvdXApKSQvLFxyXG4gICAgICAgIFJFU0VSVkVEX1dPUkRTX0JMQUNLTElTVCA9IFsnX2l0ZW0nLCAnX2lkJywgJ19wYXJlbnQnLCAndXBkYXRlJywgJ3Jvb3QnLCAnbW91bnQnLCAndW5tb3VudCcsICdtaXhpbicsICdpc01vdW50ZWQnLCAnaXNMb29wJywgJ3RhZ3MnLCAncGFyZW50JywgJ29wdHMnLCAndHJpZ2dlcicsICdvbicsICdvZmYnLCAnb25lJ10sXHJcblxyXG4gICAgLy8gdmVyc2lvbiMgZm9yIElFIDgtMTEsIDAgZm9yIG90aGVyc1xyXG4gICAgICAgIElFX1ZFUlNJT04gPSAod2luZG93ICYmIHdpbmRvdy5kb2N1bWVudCB8fCB7fSkuZG9jdW1lbnRNb2RlIHwgMFxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgIHJpb3Qub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEV4dGVuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IG9yIGNyZWF0ZSBhIG5ldyBlbXB0eSBvbmVcclxuICAgICAgICAgKiBAdHlwZSB7IE9iamVjdCB9XHJcbiAgICAgICAgICovXHJcblxyXG4gICAgICAgIGVsID0gZWwgfHwge31cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUHJpdmF0ZSB2YXJpYWJsZXMgYW5kIG1ldGhvZHNcclxuICAgICAgICAgKi9cclxuICAgICAgICB2YXIgY2FsbGJhY2tzID0ge30sXHJcbiAgICAgICAgICAgIHNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLFxyXG4gICAgICAgICAgICBvbkVhY2hFdmVudCA9IGZ1bmN0aW9uKGUsIGZuKSB7IGUucmVwbGFjZSgvXFxTKy9nLCBmbikgfSxcclxuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLCBrZXksIHtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBhbmQgZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBlYWNoIHRpbWUgYW4gZXZlbnQgaXMgdHJpZ2dlcmVkLlxyXG4gICAgICAgICAqIEBwYXJhbSAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXHJcbiAgICAgICAgICogQHBhcmFtICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSgnb24nLCBmdW5jdGlvbihldmVudHMsIGZuKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gIT0gJ2Z1bmN0aW9uJykgIHJldHVybiBlbFxyXG5cclxuICAgICAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MpIHtcclxuICAgICAgICAgICAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXHJcbiAgICAgICAgICAgICAgICBmbi50eXBlZCA9IHBvcyA+IDBcclxuICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBlbFxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFJlbW92ZXMgdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGxpc3RlbmVyc1xyXG4gICAgICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xyXG4gICAgICAgICAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGRlZmluZVByb3BlcnR5KCdvZmYnLCBmdW5jdGlvbihldmVudHMsIGZuKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudHMgPT0gJyonICYmICFmbikgY2FsbGJhY2tzID0ge31cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgY2I7IGNiID0gYXJyICYmIGFycltpXTsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY2IgPT0gZm4pIGFyci5zcGxpY2UoaS0tLCAxKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGRlbGV0ZSBjYWxsYmFja3NbbmFtZV1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGVsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYCBhbmQgZXhlY3V0ZSB0aGUgYGNhbGxiYWNrYCBhdCBtb3N0IG9uY2VcclxuICAgICAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcclxuICAgICAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxyXG4gICAgICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gZWxcclxuICAgICAgICAgKi9cclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSgnb25lJywgZnVuY3Rpb24oZXZlbnRzLCBmbikge1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBvbigpIHtcclxuICAgICAgICAgICAgICAgIGVsLm9mZihldmVudHMsIG9uKVxyXG4gICAgICAgICAgICAgICAgZm4uYXBwbHkoZWwsIGFyZ3VtZW50cylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZWwub24oZXZlbnRzLCBvbilcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgXHJcbiAgICAgICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXHJcbiAgICAgICAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGRlZmluZVByb3BlcnR5KCd0cmlnZ2VyJywgZnVuY3Rpb24oZXZlbnRzKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBnZXR0aW5nIHRoZSBhcmd1bWVudHNcclxuICAgICAgICAgICAgLy8gc2tpcHBpbmcgdGhlIGZpcnN0IG9uZVxyXG4gICAgICAgICAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcclxuICAgICAgICAgICAgICAgIGZuc1xyXG5cclxuICAgICAgICAgICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZm5zID0gc2xpY2UuY2FsbChjYWxsYmFja3NbbmFtZV0gfHwgW10sIDApXHJcblxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGZuOyBmbiA9IGZuc1tpXTsgKytpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuLmJ1c3kpIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIGZuLmJ1c3kgPSAxXHJcbiAgICAgICAgICAgICAgICAgICAgZm4uYXBwbHkoZWwsIGZuLnR5cGVkID8gW25hbWVdLmNvbmNhdChhcmdzKSA6IGFyZ3MpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cclxuICAgICAgICAgICAgICAgICAgICBmbi5idXN5ID0gMFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFja3NbJyonXSAmJiBuYW1lICE9ICcqJylcclxuICAgICAgICAgICAgICAgICAgICBlbC50cmlnZ2VyLmFwcGx5KGVsLCBbJyonLCBuYW1lXS5jb25jYXQoYXJncykpXHJcblxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGVsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGVsXHJcblxyXG4gICAgfVxyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICA7KGZ1bmN0aW9uKHJpb3QpIHtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2ltcGxlIGNsaWVudC1zaWRlIHJvdXRlclxyXG4gICAgICAgICAqIEBtb2R1bGUgcmlvdC1yb3V0ZVxyXG4gICAgICAgICAqL1xyXG5cclxuXHJcbiAgICAgICAgdmFyIFJFX09SSUdJTiA9IC9eLis/XFwvK1teXFwvXSsvLFxyXG4gICAgICAgICAgICBFVkVOVF9MSVNURU5FUiA9ICdFdmVudExpc3RlbmVyJyxcclxuICAgICAgICAgICAgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSID0gJ3JlbW92ZScgKyBFVkVOVF9MSVNURU5FUixcclxuICAgICAgICAgICAgQUREX0VWRU5UX0xJU1RFTkVSID0gJ2FkZCcgKyBFVkVOVF9MSVNURU5FUixcclxuICAgICAgICAgICAgSEFTX0FUVFJJQlVURSA9ICdoYXNBdHRyaWJ1dGUnLFxyXG4gICAgICAgICAgICBSRVBMQUNFID0gJ3JlcGxhY2UnLFxyXG4gICAgICAgICAgICBQT1BTVEFURSA9ICdwb3BzdGF0ZScsXHJcbiAgICAgICAgICAgIEhBU0hDSEFOR0UgPSAnaGFzaGNoYW5nZScsXHJcbiAgICAgICAgICAgIFRSSUdHRVIgPSAndHJpZ2dlcicsXHJcbiAgICAgICAgICAgIE1BWF9FTUlUX1NUQUNLX0xFVkVMID0gMyxcclxuICAgICAgICAgICAgd2luID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3csXHJcbiAgICAgICAgICAgIGRvYyA9IHR5cGVvZiBkb2N1bWVudCAhPSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudCxcclxuICAgICAgICAgICAgaGlzdCA9IHdpbiAmJiBoaXN0b3J5LFxyXG4gICAgICAgICAgICBsb2MgPSB3aW4gJiYgKGhpc3QubG9jYXRpb24gfHwgd2luLmxvY2F0aW9uKSwgLy8gc2VlIGh0bWw1LWhpc3RvcnktYXBpXHJcbiAgICAgICAgICAgIHByb3QgPSBSb3V0ZXIucHJvdG90eXBlLCAvLyB0byBtaW5pZnkgbW9yZVxyXG4gICAgICAgICAgICBjbGlja0V2ZW50ID0gZG9jICYmIGRvYy5vbnRvdWNoc3RhcnQgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snLFxyXG4gICAgICAgICAgICBzdGFydGVkID0gZmFsc2UsXHJcbiAgICAgICAgICAgIGNlbnRyYWwgPSByaW90Lm9ic2VydmFibGUoKSxcclxuICAgICAgICAgICAgcm91dGVGb3VuZCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBkZWJvdW5jZWRFbWl0LFxyXG4gICAgICAgICAgICBiYXNlLCBjdXJyZW50LCBwYXJzZXIsIHNlY29uZFBhcnNlciwgZW1pdFN0YWNrID0gW10sIGVtaXRTdGFja0xldmVsID0gMFxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBEZWZhdWx0IHBhcnNlci4gWW91IGNhbiByZXBsYWNlIGl0IHZpYSByb3V0ZXIucGFyc2VyIG1ldGhvZC5cclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIGN1cnJlbnQgcGF0aCAobm9ybWFsaXplZClcclxuICAgICAgICAgKiBAcmV0dXJucyB7YXJyYXl9IGFycmF5XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gREVGQVVMVF9QQVJTRVIocGF0aCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcGF0aC5zcGxpdCgvWy8/I10vKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRGVmYXVsdCBwYXJzZXIgKHNlY29uZCkuIFlvdSBjYW4gcmVwbGFjZSBpdCB2aWEgcm91dGVyLnBhcnNlciBtZXRob2QuXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBjdXJyZW50IHBhdGggKG5vcm1hbGl6ZWQpXHJcbiAgICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbHRlciAtIGZpbHRlciBzdHJpbmcgKG5vcm1hbGl6ZWQpXHJcbiAgICAgICAgICogQHJldHVybnMge2FycmF5fSBhcnJheVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIERFRkFVTFRfU0VDT05EX1BBUlNFUihwYXRoLCBmaWx0ZXIpIHtcclxuICAgICAgICAgICAgdmFyIHJlID0gbmV3IFJlZ0V4cCgnXicgKyBmaWx0ZXJbUkVQTEFDRV0oL1xcKi9nLCAnKFteLz8jXSs/KScpW1JFUExBQ0VdKC9cXC5cXC4vLCAnLionKSArICckJyksXHJcbiAgICAgICAgICAgICAgICBhcmdzID0gcGF0aC5tYXRjaChyZSlcclxuXHJcbiAgICAgICAgICAgIGlmIChhcmdzKSByZXR1cm4gYXJncy5zbGljZSgxKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU2ltcGxlL2NoZWFwIGRlYm91bmNlIGltcGxlbWVudGF0aW9uXHJcbiAgICAgICAgICogQHBhcmFtICAge2Z1bmN0aW9ufSBmbiAtIGNhbGxiYWNrXHJcbiAgICAgICAgICogQHBhcmFtICAge251bWJlcn0gZGVsYXkgLSBkZWxheSBpbiBzZWNvbmRzXHJcbiAgICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufSBkZWJvdW5jZWQgZnVuY3Rpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBkZWJvdW5jZShmbiwgZGVsYXkpIHtcclxuICAgICAgICAgICAgdmFyIHRcclxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0KVxyXG4gICAgICAgICAgICAgICAgdCA9IHNldFRpbWVvdXQoZm4sIGRlbGF5KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgdGhlIHdpbmRvdyBsaXN0ZW5lcnMgdG8gdHJpZ2dlciB0aGUgcm91dGVzXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSBhdXRvRXhlYyAtIHNlZSByb3V0ZS5zdGFydFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHN0YXJ0KGF1dG9FeGVjKSB7XHJcbiAgICAgICAgICAgIGRlYm91bmNlZEVtaXQgPSBkZWJvdW5jZShlbWl0LCAxKVxyXG4gICAgICAgICAgICB3aW5bQUREX0VWRU5UX0xJU1RFTkVSXShQT1BTVEFURSwgZGVib3VuY2VkRW1pdClcclxuICAgICAgICAgICAgd2luW0FERF9FVkVOVF9MSVNURU5FUl0oSEFTSENIQU5HRSwgZGVib3VuY2VkRW1pdClcclxuICAgICAgICAgICAgZG9jW0FERF9FVkVOVF9MSVNURU5FUl0oY2xpY2tFdmVudCwgY2xpY2spXHJcbiAgICAgICAgICAgIGlmIChhdXRvRXhlYykgZW1pdCh0cnVlKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUm91dGVyIGNsYXNzXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gUm91dGVyKCkge1xyXG4gICAgICAgICAgICB0aGlzLiQgPSBbXVxyXG4gICAgICAgICAgICByaW90Lm9ic2VydmFibGUodGhpcykgLy8gbWFrZSBpdCBvYnNlcnZhYmxlXHJcbiAgICAgICAgICAgIGNlbnRyYWwub24oJ3N0b3AnLCB0aGlzLnMuYmluZCh0aGlzKSlcclxuICAgICAgICAgICAgY2VudHJhbC5vbignZW1pdCcsIHRoaXMuZS5iaW5kKHRoaXMpKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbm9ybWFsaXplKHBhdGgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHBhdGhbUkVQTEFDRV0oL15cXC98XFwvJC8sICcnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNTdHJpbmcoc3RyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2Ygc3RyID09ICdzdHJpbmcnXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIHBhcnQgYWZ0ZXIgZG9tYWluIG5hbWVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gaHJlZiAtIGZ1bGxwYXRoXHJcbiAgICAgICAgICogQHJldHVybnMge3N0cmluZ30gcGF0aCBmcm9tIHJvb3RcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiBnZXRQYXRoRnJvbVJvb3QoaHJlZikge1xyXG4gICAgICAgICAgICByZXR1cm4gKGhyZWYgfHwgbG9jLmhyZWYgfHwgJycpW1JFUExBQ0VdKFJFX09SSUdJTiwgJycpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHZXQgdGhlIHBhcnQgYWZ0ZXIgYmFzZVxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBocmVmIC0gZnVsbHBhdGhcclxuICAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBwYXRoIGZyb20gYmFzZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBhdGhGcm9tQmFzZShocmVmKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBiYXNlWzBdID09ICcjJ1xyXG4gICAgICAgICAgICAgICAgPyAoaHJlZiB8fCBsb2MuaHJlZiB8fCAnJykuc3BsaXQoYmFzZSlbMV0gfHwgJydcclxuICAgICAgICAgICAgICAgIDogZ2V0UGF0aEZyb21Sb290KGhyZWYpW1JFUExBQ0VdKGJhc2UsICcnKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZW1pdChmb3JjZSkge1xyXG4gICAgICAgICAgICAvLyB0aGUgc3RhY2sgaXMgbmVlZGVkIGZvciByZWRpcmVjdGlvbnNcclxuICAgICAgICAgICAgdmFyIGlzUm9vdCA9IGVtaXRTdGFja0xldmVsID09IDBcclxuICAgICAgICAgICAgaWYgKE1BWF9FTUlUX1NUQUNLX0xFVkVMIDw9IGVtaXRTdGFja0xldmVsKSByZXR1cm5cclxuXHJcbiAgICAgICAgICAgIGVtaXRTdGFja0xldmVsKytcclxuICAgICAgICAgICAgZW1pdFN0YWNrLnB1c2goZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IGdldFBhdGhGcm9tQmFzZSgpXHJcbiAgICAgICAgICAgICAgICBpZiAoZm9yY2UgfHwgcGF0aCAhPSBjdXJyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2VudHJhbFtUUklHR0VSXSgnZW1pdCcsIHBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IHBhdGhcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgaWYgKGlzUm9vdCkge1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGVtaXRTdGFjay5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgICAgICBlbWl0U3RhY2tbMF0oKVxyXG4gICAgICAgICAgICAgICAgICAgIGVtaXRTdGFjay5zaGlmdCgpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBlbWl0U3RhY2tMZXZlbCA9IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2xpY2soZSkge1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICBlLndoaWNoICE9IDEgLy8gbm90IGxlZnQgY2xpY2tcclxuICAgICAgICAgICAgICAgIHx8IGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSAvLyBvciBtZXRhIGtleXNcclxuICAgICAgICAgICAgICAgIHx8IGUuZGVmYXVsdFByZXZlbnRlZCAvLyBvciBkZWZhdWx0IHByZXZlbnRlZFxyXG4gICAgICAgICAgICApIHJldHVyblxyXG5cclxuICAgICAgICAgICAgdmFyIGVsID0gZS50YXJnZXRcclxuICAgICAgICAgICAgd2hpbGUgKGVsICYmIGVsLm5vZGVOYW1lICE9ICdBJykgZWwgPSBlbC5wYXJlbnROb2RlXHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICFlbCB8fCBlbC5ub2RlTmFtZSAhPSAnQScgLy8gbm90IEEgdGFnXHJcbiAgICAgICAgICAgICAgICB8fCBlbFtIQVNfQVRUUklCVVRFXSgnZG93bmxvYWQnKSAvLyBoYXMgZG93bmxvYWQgYXR0clxyXG4gICAgICAgICAgICAgICAgfHwgIWVsW0hBU19BVFRSSUJVVEVdKCdocmVmJykgLy8gaGFzIG5vIGhyZWYgYXR0clxyXG4gICAgICAgICAgICAgICAgfHwgZWwudGFyZ2V0ICYmIGVsLnRhcmdldCAhPSAnX3NlbGYnIC8vIGFub3RoZXIgd2luZG93IG9yIGZyYW1lXHJcbiAgICAgICAgICAgICAgICB8fCBlbC5ocmVmLmluZGV4T2YobG9jLmhyZWYubWF0Y2goUkVfT1JJR0lOKVswXSkgPT0gLTEgLy8gY3Jvc3Mgb3JpZ2luXHJcbiAgICAgICAgICAgICkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBpZiAoZWwuaHJlZiAhPSBsb2MuaHJlZikge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGVsLmhyZWYuc3BsaXQoJyMnKVswXSA9PSBsb2MuaHJlZi5zcGxpdCgnIycpWzBdIC8vIGludGVybmFsIGp1bXBcclxuICAgICAgICAgICAgICAgICAgICB8fCBiYXNlICE9ICcjJyAmJiBnZXRQYXRoRnJvbVJvb3QoZWwuaHJlZikuaW5kZXhPZihiYXNlKSAhPT0gMCAvLyBvdXRzaWRlIG9mIGJhc2VcclxuICAgICAgICAgICAgICAgICAgICB8fCAhZ28oZ2V0UGF0aEZyb21CYXNlKGVsLmhyZWYpLCBlbC50aXRsZSB8fCBkb2MudGl0bGUpIC8vIHJvdXRlIG5vdCBmb3VuZFxyXG4gICAgICAgICAgICAgICAgKSByZXR1cm5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHbyB0byB0aGUgcGF0aFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gZGVzdGluYXRpb24gcGF0aFxyXG4gICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0aXRsZSAtIHBhZ2UgdGl0bGVcclxuICAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHNob3VsZFJlcGxhY2UgLSB1c2UgcmVwbGFjZVN0YXRlIG9yIHB1c2hTdGF0ZVxyXG4gICAgICAgICAqIEByZXR1cm5zIHtib29sZWFufSAtIHJvdXRlIG5vdCBmb3VuZCBmbGFnXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgZnVuY3Rpb24gZ28ocGF0aCwgdGl0bGUsIHNob3VsZFJlcGxhY2UpIHtcclxuICAgICAgICAgICAgaWYgKGhpc3QpIHsgLy8gaWYgYSBicm93c2VyXHJcbiAgICAgICAgICAgICAgICBwYXRoID0gYmFzZSArIG5vcm1hbGl6ZShwYXRoKVxyXG4gICAgICAgICAgICAgICAgdGl0bGUgPSB0aXRsZSB8fCBkb2MudGl0bGVcclxuICAgICAgICAgICAgICAgIC8vIGJyb3dzZXJzIGlnbm9yZXMgdGhlIHNlY29uZCBwYXJhbWV0ZXIgYHRpdGxlYFxyXG4gICAgICAgICAgICAgICAgc2hvdWxkUmVwbGFjZVxyXG4gICAgICAgICAgICAgICAgICAgID8gaGlzdC5yZXBsYWNlU3RhdGUobnVsbCwgdGl0bGUsIHBhdGgpXHJcbiAgICAgICAgICAgICAgICAgICAgOiBoaXN0LnB1c2hTdGF0ZShudWxsLCB0aXRsZSwgcGF0aClcclxuICAgICAgICAgICAgICAgIC8vIHNvIHdlIG5lZWQgdG8gc2V0IGl0IG1hbnVhbGx5XHJcbiAgICAgICAgICAgICAgICBkb2MudGl0bGUgPSB0aXRsZVxyXG4gICAgICAgICAgICAgICAgcm91dGVGb3VuZCA9IGZhbHNlXHJcbiAgICAgICAgICAgICAgICBlbWl0KClcclxuICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZUZvdW5kXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNlcnZlci1zaWRlIHVzYWdlOiBkaXJlY3RseSBleGVjdXRlIGhhbmRsZXJzIGZvciB0aGUgcGF0aFxyXG4gICAgICAgICAgICByZXR1cm4gY2VudHJhbFtUUklHR0VSXSgnZW1pdCcsIGdldFBhdGhGcm9tQmFzZShwYXRoKSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdvIHRvIHBhdGggb3Igc2V0IGFjdGlvblxyXG4gICAgICAgICAqIGEgc2luZ2xlIHN0cmluZzogICAgICAgICAgICAgICAgZ28gdGhlcmVcclxuICAgICAgICAgKiB0d28gc3RyaW5nczogICAgICAgICAgICAgICAgICAgIGdvIHRoZXJlIHdpdGggc2V0dGluZyBhIHRpdGxlXHJcbiAgICAgICAgICogdHdvIHN0cmluZ3MgYW5kIGJvb2xlYW46ICAgICAgICByZXBsYWNlIGhpc3Rvcnkgd2l0aCBzZXR0aW5nIGEgdGl0bGVcclxuICAgICAgICAgKiBhIHNpbmdsZSBmdW5jdGlvbjogICAgICAgICAgICAgIHNldCBhbiBhY3Rpb24gb24gdGhlIGRlZmF1bHQgcm91dGVcclxuICAgICAgICAgKiBhIHN0cmluZy9SZWdFeHAgYW5kIGEgZnVuY3Rpb246IHNldCBhbiBhY3Rpb24gb24gdGhlIHJvdXRlXHJcbiAgICAgICAgICogQHBhcmFtIHsoc3RyaW5nfGZ1bmN0aW9uKX0gZmlyc3QgLSBwYXRoIC8gYWN0aW9uIC8gZmlsdGVyXHJcbiAgICAgICAgICogQHBhcmFtIHsoc3RyaW5nfFJlZ0V4cHxmdW5jdGlvbil9IHNlY29uZCAtIHRpdGxlIC8gYWN0aW9uXHJcbiAgICAgICAgICogQHBhcmFtIHtib29sZWFufSB0aGlyZCAtIHJlcGxhY2UgZmxhZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHByb3QubSA9IGZ1bmN0aW9uKGZpcnN0LCBzZWNvbmQsIHRoaXJkKSB7XHJcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyhmaXJzdCkgJiYgKCFzZWNvbmQgfHwgaXNTdHJpbmcoc2Vjb25kKSkpIGdvKGZpcnN0LCBzZWNvbmQsIHRoaXJkIHx8IGZhbHNlKVxyXG4gICAgICAgICAgICBlbHNlIGlmIChzZWNvbmQpIHRoaXMucihmaXJzdCwgc2Vjb25kKVxyXG4gICAgICAgICAgICBlbHNlIHRoaXMucignQCcsIGZpcnN0KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3RvcCByb3V0aW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcHJvdC5zID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHRoaXMub2ZmKCcqJylcclxuICAgICAgICAgICAgdGhpcy4kID0gW11cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEVtaXRcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAtIHBhdGhcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm90LmUgPSBmdW5jdGlvbihwYXRoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuJC5jb25jYXQoJ0AnKS5zb21lKGZ1bmN0aW9uKGZpbHRlcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyZ3MgPSAoZmlsdGVyID09ICdAJyA/IHBhcnNlciA6IHNlY29uZFBhcnNlcikobm9ybWFsaXplKHBhdGgpLCBub3JtYWxpemUoZmlsdGVyKSlcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJncyAhPSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXNbVFJJR0dFUl0uYXBwbHkobnVsbCwgW2ZpbHRlcl0uY29uY2F0KGFyZ3MpKVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByb3V0ZUZvdW5kID0gdHJ1ZSAvLyBleGl0IGZyb20gbG9vcFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCB0aGlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVnaXN0ZXIgcm91dGVcclxuICAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlsdGVyIC0gZmlsdGVyIGZvciBtYXRjaGluZyB0byB1cmxcclxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBhY3Rpb24gLSBhY3Rpb24gdG8gcmVnaXN0ZXJcclxuICAgICAgICAgKi9cclxuICAgICAgICBwcm90LnIgPSBmdW5jdGlvbihmaWx0ZXIsIGFjdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoZmlsdGVyICE9ICdAJykge1xyXG4gICAgICAgICAgICAgICAgZmlsdGVyID0gJy8nICsgbm9ybWFsaXplKGZpbHRlcilcclxuICAgICAgICAgICAgICAgIHRoaXMuJC5wdXNoKGZpbHRlcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9uKGZpbHRlciwgYWN0aW9uKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG1haW5Sb3V0ZXIgPSBuZXcgUm91dGVyKClcclxuICAgICAgICB2YXIgcm91dGUgPSBtYWluUm91dGVyLm0uYmluZChtYWluUm91dGVyKVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBDcmVhdGUgYSBzdWIgcm91dGVyXHJcbiAgICAgICAgICogQHJldHVybnMge2Z1bmN0aW9ufSB0aGUgbWV0aG9kIG9mIGEgbmV3IFJvdXRlciBvYmplY3RcclxuICAgICAgICAgKi9cclxuICAgICAgICByb3V0ZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1N1YlJvdXRlciA9IG5ldyBSb3V0ZXIoKVxyXG4gICAgICAgICAgICAvLyBzdG9wIG9ubHkgdGhpcyBzdWItcm91dGVyXHJcbiAgICAgICAgICAgIG5ld1N1YlJvdXRlci5tLnN0b3AgPSBuZXdTdWJSb3V0ZXIucy5iaW5kKG5ld1N1YlJvdXRlcilcclxuICAgICAgICAgICAgLy8gcmV0dXJuIHN1Yi1yb3V0ZXIncyBtYWluIG1ldGhvZFxyXG4gICAgICAgICAgICByZXR1cm4gbmV3U3ViUm91dGVyLm0uYmluZChuZXdTdWJSb3V0ZXIpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBTZXQgdGhlIGJhc2Ugb2YgdXJsXHJcbiAgICAgICAgICogQHBhcmFtIHsoc3RyfFJlZ0V4cCl9IGFyZyAtIGEgbmV3IGJhc2Ugb3IgJyMnIG9yICcjISdcclxuICAgICAgICAgKi9cclxuICAgICAgICByb3V0ZS5iYXNlID0gZnVuY3Rpb24oYXJnKSB7XHJcbiAgICAgICAgICAgIGJhc2UgPSBhcmcgfHwgJyMnXHJcbiAgICAgICAgICAgIGN1cnJlbnQgPSBnZXRQYXRoRnJvbUJhc2UoKSAvLyByZWNhbGN1bGF0ZSBjdXJyZW50IHBhdGhcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKiBFeGVjIHJvdXRpbmcgcmlnaHQgbm93ICoqL1xyXG4gICAgICAgIHJvdXRlLmV4ZWMgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZW1pdCh0cnVlKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUmVwbGFjZSB0aGUgZGVmYXVsdCByb3V0ZXIgdG8geW91cnNcclxuICAgICAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmbiAtIHlvdXIgcGFyc2VyIGZ1bmN0aW9uXHJcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZm4yIC0geW91ciBzZWNvbmRQYXJzZXIgZnVuY3Rpb25cclxuICAgICAgICAgKi9cclxuICAgICAgICByb3V0ZS5wYXJzZXIgPSBmdW5jdGlvbihmbiwgZm4yKSB7XHJcbiAgICAgICAgICAgIGlmICghZm4gJiYgIWZuMikge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVzZXQgcGFyc2VyIGZvciB0ZXN0aW5nLi4uXHJcbiAgICAgICAgICAgICAgICBwYXJzZXIgPSBERUZBVUxUX1BBUlNFUlxyXG4gICAgICAgICAgICAgICAgc2Vjb25kUGFyc2VyID0gREVGQVVMVF9TRUNPTkRfUEFSU0VSXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZuKSBwYXJzZXIgPSBmblxyXG4gICAgICAgICAgICBpZiAoZm4yKSBzZWNvbmRQYXJzZXIgPSBmbjJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEhlbHBlciBmdW5jdGlvbiB0byBnZXQgdXJsIHF1ZXJ5IGFzIGFuIG9iamVjdFxyXG4gICAgICAgICAqIEByZXR1cm5zIHtvYmplY3R9IHBhcnNlZCBxdWVyeVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJvdXRlLnF1ZXJ5ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBxID0ge31cclxuICAgICAgICAgICAgdmFyIGhyZWYgPSBsb2MuaHJlZiB8fCBjdXJyZW50XHJcbiAgICAgICAgICAgIGhyZWZbUkVQTEFDRV0oL1s/Jl0oLis/KT0oW14mXSopL2csIGZ1bmN0aW9uKF8sIGssIHYpIHsgcVtrXSA9IHYgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHFcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qKiBTdG9wIHJvdXRpbmcgKiovXHJcbiAgICAgICAgcm91dGUuc3RvcCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHN0YXJ0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh3aW4pIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXShQT1BTVEFURSwgZGVib3VuY2VkRW1pdClcclxuICAgICAgICAgICAgICAgICAgICB3aW5bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXShIQVNIQ0hBTkdFLCBkZWJvdW5jZWRFbWl0KVxyXG4gICAgICAgICAgICAgICAgICAgIGRvY1tSRU1PVkVfRVZFTlRfTElTVEVORVJdKGNsaWNrRXZlbnQsIGNsaWNrKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2VudHJhbFtUUklHR0VSXSgnc3RvcCcpXHJcbiAgICAgICAgICAgICAgICBzdGFydGVkID0gZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogU3RhcnQgcm91dGluZ1xyXG4gICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b0V4ZWMgLSBhdXRvbWF0aWNhbGx5IGV4ZWMgYWZ0ZXIgc3RhcnRpbmcgaWYgdHJ1ZVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJvdXRlLnN0YXJ0ID0gZnVuY3Rpb24gKGF1dG9FeGVjKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RhcnRlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHdpbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09ICdjb21wbGV0ZScpIHN0YXJ0KGF1dG9FeGVjKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSB0aW1lb3V0IGlzIG5lZWRlZCB0byBzb2x2ZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGEgd2VpcmQgc2FmYXJpIGJ1ZyBodHRwczovL2dpdGh1Yi5jb20vcmlvdC9yb3V0ZS9pc3N1ZXMvMzNcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHdpbltBRERfRVZFTlRfTElTVEVORVJdKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IHN0YXJ0KGF1dG9FeGVjKSB9LCAxKVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdGFydGVkID0gdHJ1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiogUHJlcGFyZSB0aGUgcm91dGVyICoqL1xyXG4gICAgICAgIHJvdXRlLmJhc2UoKVxyXG4gICAgICAgIHJvdXRlLnBhcnNlcigpXHJcblxyXG4gICAgICAgIHJpb3Qucm91dGUgPSByb3V0ZVxyXG4gICAgfSkocmlvdClcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBUaGUgcmlvdCB0ZW1wbGF0ZSBlbmdpbmVcclxuICAgICAqIEB2ZXJzaW9uIHYyLjMuMjFcclxuICAgICAqL1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogcmlvdC51dGlsLmJyYWNrZXRzXHJcbiAgICAgKlxyXG4gICAgICogLSBgYnJhY2tldHMgICAgYCAtIFJldHVybnMgYSBzdHJpbmcgb3IgcmVnZXggYmFzZWQgb24gaXRzIHBhcmFtZXRlclxyXG4gICAgICogLSBgYnJhY2tldHMuc2V0YCAtIENoYW5nZSB0aGUgY3VycmVudCByaW90IGJyYWNrZXRzXHJcbiAgICAgKlxyXG4gICAgICogQG1vZHVsZVxyXG4gICAgICovXHJcblxyXG4gICAgdmFyIGJyYWNrZXRzID0gKGZ1bmN0aW9uIChVTkRFRikge1xyXG5cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgUkVHTE9CID0gJ2cnLFxyXG5cclxuICAgICAgICAgICAgUl9NTENPTU1TID0gL1xcL1xcKlteKl0qXFwqKyg/OlteKlxcL11bXipdKlxcKispKlxcLy9nLFxyXG5cclxuICAgICAgICAgICAgUl9TVFJJTkdTID0gL1wiW15cIlxcXFxdKig/OlxcXFxbXFxTXFxzXVteXCJcXFxcXSopKlwifCdbXidcXFxcXSooPzpcXFxcW1xcU1xcc11bXidcXFxcXSopKicvZyxcclxuXHJcbiAgICAgICAgICAgIFNfUUJMT0NLUyA9IFJfU1RSSU5HUy5zb3VyY2UgKyAnfCcgK1xyXG4gICAgICAgICAgICAgICAgLyg/OlxcYnJldHVyblxccyt8KD86WyRcXHdcXClcXF1dfFxcK1xcK3wtLSlcXHMqKFxcLykoPyFbKlxcL10pKS8uc291cmNlICsgJ3wnICtcclxuICAgICAgICAgICAgICAgIC9cXC8oPz1bXipcXC9dKVteW1xcL1xcXFxdKig/Oig/OlxcWyg/OlxcXFwufFteXFxdXFxcXF0qKSpcXF18XFxcXC4pW15bXFwvXFxcXF0qKSo/KFxcLylbZ2ltXSovLnNvdXJjZSxcclxuXHJcbiAgICAgICAgICAgIEZJTkRCUkFDRVMgPSB7XHJcbiAgICAgICAgICAgICAgICAnKCc6IFJlZ0V4cCgnKFsoKV0pfCcgICArIFNfUUJMT0NLUywgUkVHTE9CKSxcclxuICAgICAgICAgICAgICAgICdbJzogUmVnRXhwKCcoW1tcXFxcXV0pfCcgKyBTX1FCTE9DS1MsIFJFR0xPQiksXHJcbiAgICAgICAgICAgICAgICAneyc6IFJlZ0V4cCgnKFt7fV0pfCcgICArIFNfUUJMT0NLUywgUkVHTE9CKVxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgREVGQVVMVCA9ICd7IH0nXHJcblxyXG4gICAgICAgIHZhciBfcGFpcnMgPSBbXHJcbiAgICAgICAgICAgICd7JywgJ30nLFxyXG4gICAgICAgICAgICAneycsICd9JyxcclxuICAgICAgICAgICAgL3tbXn1dKn0vLFxyXG4gICAgICAgICAgICAvXFxcXChbe31dKS9nLFxyXG4gICAgICAgICAgICAvXFxcXCh7KXx7L2csXHJcbiAgICAgICAgICAgIFJlZ0V4cCgnXFxcXFxcXFwofSl8KFtbKHtdKXwofSl8JyArIFNfUUJMT0NLUywgUkVHTE9CKSxcclxuICAgICAgICAgICAgREVGQVVMVCxcclxuICAgICAgICAgICAgL15cXHMqe1xcXj9cXHMqKFskXFx3XSspKD86XFxzKixcXHMqKFxcUyspKT9cXHMraW5cXHMrKFxcUy4qKVxccyp9LyxcclxuICAgICAgICAgICAgLyhefFteXFxcXF0pez1bXFxTXFxzXSo/fS9cclxuICAgICAgICBdXHJcblxyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICBjYWNoZWRCcmFja2V0cyA9IFVOREVGLFxyXG4gICAgICAgICAgICBfcmVnZXgsXHJcbiAgICAgICAgICAgIF9jYWNoZSA9IFtdLFxyXG4gICAgICAgICAgICBfc2V0dGluZ3NcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2xvb3BiYWNrIChyZSkgeyByZXR1cm4gcmUgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfcmV3cml0ZSAocmUsIGJwKSB7XHJcbiAgICAgICAgICAgIGlmICghYnApIGJwID0gX2NhY2hlXHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKFxyXG4gICAgICAgICAgICAgICAgcmUuc291cmNlLnJlcGxhY2UoL3svZywgYnBbMl0pLnJlcGxhY2UoL30vZywgYnBbM10pLCByZS5nbG9iYWwgPyBSRUdMT0IgOiAnJ1xyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfY3JlYXRlIChwYWlyKSB7XHJcbiAgICAgICAgICAgIGlmIChwYWlyID09PSBERUZBVUxUKSByZXR1cm4gX3BhaXJzXHJcblxyXG4gICAgICAgICAgICB2YXIgYXJyID0gcGFpci5zcGxpdCgnICcpXHJcblxyXG4gICAgICAgICAgICBpZiAoYXJyLmxlbmd0aCAhPT0gMiB8fCAvW1xceDAwLVxceDFGPD5hLXpBLVowLTknXCIsO1xcXFxdLy50ZXN0KHBhaXIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGJyYWNrZXRzIFwiJyArIHBhaXIgKyAnXCInKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGFyciA9IGFyci5jb25jYXQocGFpci5yZXBsYWNlKC8oPz1bW1xcXSgpKis/Ll4kfF0pL2csICdcXFxcJykuc3BsaXQoJyAnKSlcclxuXHJcbiAgICAgICAgICAgIGFycls0XSA9IF9yZXdyaXRlKGFyclsxXS5sZW5ndGggPiAxID8gL3tbXFxTXFxzXSo/fS8gOiBfcGFpcnNbNF0sIGFycilcclxuICAgICAgICAgICAgYXJyWzVdID0gX3Jld3JpdGUocGFpci5sZW5ndGggPiAzID8gL1xcXFwoe3x9KS9nIDogX3BhaXJzWzVdLCBhcnIpXHJcbiAgICAgICAgICAgIGFycls2XSA9IF9yZXdyaXRlKF9wYWlyc1s2XSwgYXJyKVxyXG4gICAgICAgICAgICBhcnJbN10gPSBSZWdFeHAoJ1xcXFxcXFxcKCcgKyBhcnJbM10gKyAnKXwoW1soe10pfCgnICsgYXJyWzNdICsgJyl8JyArIFNfUUJMT0NLUywgUkVHTE9CKVxyXG4gICAgICAgICAgICBhcnJbOF0gPSBwYWlyXHJcbiAgICAgICAgICAgIHJldHVybiBhcnJcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9icmFja2V0cyAocmVPcklkeCkge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVPcklkeCBpbnN0YW5jZW9mIFJlZ0V4cCA/IF9yZWdleChyZU9ySWR4KSA6IF9jYWNoZVtyZU9ySWR4XVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2JyYWNrZXRzLnNwbGl0ID0gZnVuY3Rpb24gc3BsaXQgKHN0ciwgdG1wbCwgX2JwKSB7XHJcbiAgICAgICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBfYnAgaXMgZm9yIHRoZSBjb21waWxlclxyXG4gICAgICAgICAgICBpZiAoIV9icCkgX2JwID0gX2NhY2hlXHJcblxyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgIHBhcnRzID0gW10sXHJcbiAgICAgICAgICAgICAgICBtYXRjaCxcclxuICAgICAgICAgICAgICAgIGlzZXhwcixcclxuICAgICAgICAgICAgICAgIHN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgcG9zLFxyXG4gICAgICAgICAgICAgICAgcmUgPSBfYnBbNl1cclxuXHJcbiAgICAgICAgICAgIGlzZXhwciA9IHN0YXJ0ID0gcmUubGFzdEluZGV4ID0gMFxyXG5cclxuICAgICAgICAgICAgd2hpbGUgKG1hdGNoID0gcmUuZXhlYyhzdHIpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgcG9zID0gbWF0Y2guaW5kZXhcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoaXNleHByKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaFsyXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZS5sYXN0SW5kZXggPSBza2lwQnJhY2VzKHN0ciwgbWF0Y2hbMl0sIHJlLmxhc3RJbmRleClcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFtYXRjaFszXSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWVcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIW1hdGNoWzFdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdW5lc2NhcGVTdHIoc3RyLnNsaWNlKHN0YXJ0LCBwb3MpKVxyXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gcmUubGFzdEluZGV4XHJcbiAgICAgICAgICAgICAgICAgICAgcmUgPSBfYnBbNiArIChpc2V4cHIgXj0gMSldXHJcbiAgICAgICAgICAgICAgICAgICAgcmUubGFzdEluZGV4ID0gc3RhcnRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHN0ciAmJiBzdGFydCA8IHN0ci5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHVuZXNjYXBlU3RyKHN0ci5zbGljZShzdGFydCkpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwYXJ0c1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdW5lc2NhcGVTdHIgKHMpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0bXBsIHx8IGlzZXhwcilcclxuICAgICAgICAgICAgICAgICAgICBwYXJ0cy5wdXNoKHMgJiYgcy5yZXBsYWNlKF9icFs1XSwgJyQxJykpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgcGFydHMucHVzaChzKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBza2lwQnJhY2VzIChzLCBjaCwgaXgpIHtcclxuICAgICAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoLFxyXG4gICAgICAgICAgICAgICAgICAgIHJlY2NoID0gRklOREJSQUNFU1tjaF1cclxuXHJcbiAgICAgICAgICAgICAgICByZWNjaC5sYXN0SW5kZXggPSBpeFxyXG4gICAgICAgICAgICAgICAgaXggPSAxXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAobWF0Y2ggPSByZWNjaC5leGVjKHMpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1hdGNoWzFdICYmXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICEobWF0Y2hbMV0gPT09IGNoID8gKytpeCA6IC0taXgpKSBicmVha1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGl4ID8gcy5sZW5ndGggOiByZWNjaC5sYXN0SW5kZXhcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2JyYWNrZXRzLmhhc0V4cHIgPSBmdW5jdGlvbiBoYXNFeHByIChzdHIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9jYWNoZVs0XS50ZXN0KHN0cilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF9icmFja2V0cy5sb29wS2V5cyA9IGZ1bmN0aW9uIGxvb3BLZXlzIChleHByKSB7XHJcbiAgICAgICAgICAgIHZhciBtID0gZXhwci5tYXRjaChfY2FjaGVbOV0pXHJcbiAgICAgICAgICAgIHJldHVybiBtXHJcbiAgICAgICAgICAgICAgICA/IHsga2V5OiBtWzFdLCBwb3M6IG1bMl0sIHZhbDogX2NhY2hlWzBdICsgbVszXS50cmltKCkgKyBfY2FjaGVbMV0gfVxyXG4gICAgICAgICAgICAgICAgOiB7IHZhbDogZXhwci50cmltKCkgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgX2JyYWNrZXRzLmhhc1JhdyA9IGZ1bmN0aW9uIChzcmMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9jYWNoZVsxMF0udGVzdChzcmMpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBfYnJhY2tldHMuYXJyYXkgPSBmdW5jdGlvbiBhcnJheSAocGFpcikge1xyXG4gICAgICAgICAgICByZXR1cm4gcGFpciA/IF9jcmVhdGUocGFpcikgOiBfY2FjaGVcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9yZXNldCAocGFpcikge1xyXG4gICAgICAgICAgICBpZiAoKHBhaXIgfHwgKHBhaXIgPSBERUZBVUxUKSkgIT09IF9jYWNoZVs4XSkge1xyXG4gICAgICAgICAgICAgICAgX2NhY2hlID0gX2NyZWF0ZShwYWlyKVxyXG4gICAgICAgICAgICAgICAgX3JlZ2V4ID0gcGFpciA9PT0gREVGQVVMVCA/IF9sb29wYmFjayA6IF9yZXdyaXRlXHJcbiAgICAgICAgICAgICAgICBfY2FjaGVbOV0gPSBfcmVnZXgoX3BhaXJzWzldKVxyXG4gICAgICAgICAgICAgICAgX2NhY2hlWzEwXSA9IF9yZWdleChfcGFpcnNbMTBdKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhY2hlZEJyYWNrZXRzID0gcGFpclxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX3NldFNldHRpbmdzIChvKSB7XHJcbiAgICAgICAgICAgIHZhciBiXHJcbiAgICAgICAgICAgIG8gPSBvIHx8IHt9XHJcbiAgICAgICAgICAgIGIgPSBvLmJyYWNrZXRzXHJcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCAnYnJhY2tldHMnLCB7XHJcbiAgICAgICAgICAgICAgICBzZXQ6IF9yZXNldCxcclxuICAgICAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY2FjaGVkQnJhY2tldHMgfSxcclxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IHRydWVcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgX3NldHRpbmdzID0gb1xyXG4gICAgICAgICAgICBfcmVzZXQoYilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYnJhY2tldHMsICdzZXR0aW5ncycsIHtcclxuICAgICAgICAgICAgc2V0OiBfc2V0U2V0dGluZ3MsXHJcbiAgICAgICAgICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX3NldHRpbmdzIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogaW4gdGhlIGJyb3dzZXIgcmlvdCBpcyBhbHdheXMgaW4gdGhlIHNjb3BlICovXHJcbiAgICAgICAgX2JyYWNrZXRzLnNldHRpbmdzID0gdHlwZW9mIHJpb3QgIT09ICd1bmRlZmluZWQnICYmIHJpb3Quc2V0dGluZ3MgfHwge31cclxuICAgICAgICBfYnJhY2tldHMuc2V0ID0gX3Jlc2V0XHJcblxyXG4gICAgICAgIF9icmFja2V0cy5SX1NUUklOR1MgPSBSX1NUUklOR1NcclxuICAgICAgICBfYnJhY2tldHMuUl9NTENPTU1TID0gUl9NTENPTU1TXHJcbiAgICAgICAgX2JyYWNrZXRzLlNfUUJMT0NLUyA9IFNfUUJMT0NLU1xyXG5cclxuICAgICAgICByZXR1cm4gX2JyYWNrZXRzXHJcblxyXG4gICAgfSkoKVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG1vZHVsZSB0bXBsXHJcbiAgICAgKlxyXG4gICAgICogdG1wbCAgICAgICAgICAtIFJvb3QgZnVuY3Rpb24sIHJldHVybnMgdGhlIHRlbXBsYXRlIHZhbHVlLCByZW5kZXIgd2l0aCBkYXRhXHJcbiAgICAgKiB0bXBsLmhhc0V4cHIgIC0gVGVzdCB0aGUgZXhpc3RlbmNlIG9mIGEgZXhwcmVzc2lvbiBpbnNpZGUgYSBzdHJpbmdcclxuICAgICAqIHRtcGwubG9vcEtleXMgLSBHZXQgdGhlIGtleXMgZm9yIGFuICdlYWNoJyBsb29wICh1c2VkIGJ5IGBfZWFjaGApXHJcbiAgICAgKi9cclxuXHJcbiAgICB2YXIgdG1wbCA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgIHZhciBfY2FjaGUgPSB7fVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfdG1wbCAoc3RyLCBkYXRhKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RyKSByZXR1cm4gc3RyXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gKF9jYWNoZVtzdHJdIHx8IChfY2FjaGVbc3RyXSA9IF9jcmVhdGUoc3RyKSkpLmNhbGwoZGF0YSwgX2xvZ0VycilcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIF90bXBsLmhhdmVSYXcgPSBicmFja2V0cy5oYXNSYXdcclxuXHJcbiAgICAgICAgX3RtcGwuaGFzRXhwciA9IGJyYWNrZXRzLmhhc0V4cHJcclxuXHJcbiAgICAgICAgX3RtcGwubG9vcEtleXMgPSBicmFja2V0cy5sb29wS2V5c1xyXG5cclxuICAgICAgICBfdG1wbC5lcnJvckhhbmRsZXIgPSBudWxsXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF9sb2dFcnIgKGVyciwgY3R4KSB7XHJcblxyXG4gICAgICAgICAgICBpZiAoX3RtcGwuZXJyb3JIYW5kbGVyKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZXJyLnJpb3REYXRhID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRhZ05hbWU6IGN0eCAmJiBjdHgucm9vdCAmJiBjdHgucm9vdC50YWdOYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIF9yaW90X2lkOiBjdHggJiYgY3R4Ll9yaW90X2lkICAvL2VzbGludC1kaXNhYmxlLWxpbmUgY2FtZWxjYXNlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBfdG1wbC5lcnJvckhhbmRsZXIoZXJyKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBfY3JlYXRlIChzdHIpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBleHByID0gX2dldFRtcGwoc3RyKVxyXG4gICAgICAgICAgICBpZiAoZXhwci5zbGljZSgwLCAxMSkgIT09ICd0cnl7cmV0dXJuICcpIGV4cHIgPSAncmV0dXJuICcgKyBleHByXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZ1bmN0aW9uKCdFJywgZXhwciArICc7JylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICBSRV9RQkxPQ0sgPSBSZWdFeHAoYnJhY2tldHMuU19RQkxPQ0tTLCAnZycpLFxyXG4gICAgICAgICAgICBSRV9RQk1BUksgPSAvXFx4MDEoXFxkKyl+L2dcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gX2dldFRtcGwgKHN0cikge1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgIHFzdHIgPSBbXSxcclxuICAgICAgICAgICAgICAgIGV4cHIsXHJcbiAgICAgICAgICAgICAgICBwYXJ0cyA9IGJyYWNrZXRzLnNwbGl0KHN0ci5yZXBsYWNlKC9cXHUyMDU3L2csICdcIicpLCAxKVxyXG5cclxuICAgICAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA+IDIgfHwgcGFydHNbMF0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBpLCBqLCBsaXN0ID0gW11cclxuXHJcbiAgICAgICAgICAgICAgICBmb3IgKGkgPSBqID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgKytpKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHIgPSBwYXJ0c1tpXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXhwciAmJiAoZXhwciA9IGkgJiAxID9cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3BhcnNlRXhwcihleHByLCAxLCBxc3RyKSA6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiJyArIGV4cHJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJcXG4/fFxcbi9nLCAnXFxcXG4nKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ1wiJ1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSkgbGlzdFtqKytdID0gZXhwclxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBleHByID0gaiA8IDIgPyBsaXN0WzBdIDpcclxuICAgICAgICAgICAgICAgICdbJyArIGxpc3Quam9pbignLCcpICsgJ10uam9pbihcIlwiKSdcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwciA9IF9wYXJzZUV4cHIocGFydHNbMV0sIDAsIHFzdHIpXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChxc3RyWzBdKVxyXG4gICAgICAgICAgICAgICAgZXhwciA9IGV4cHIucmVwbGFjZShSRV9RQk1BUkssIGZ1bmN0aW9uIChfLCBwb3MpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcXN0cltwb3NdXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHIvZywgJ1xcXFxyJylcclxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcbi9nLCAnXFxcXG4nKVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBleHByXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgUkVfQlJFTkQgPSB7XHJcbiAgICAgICAgICAgICAgICAnKCc6IC9bKCldL2csXHJcbiAgICAgICAgICAgICAgICAnWyc6IC9bW1xcXV0vZyxcclxuICAgICAgICAgICAgICAgICd7JzogL1t7fV0vZ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBDU19JREVOVCA9IC9eKD86KC0/W19BLVphLXpcXHhBMC1cXHhGRl1bLVxcd1xceEEwLVxceEZGXSopfFxceDAxKFxcZCspfik6L1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBfcGFyc2VFeHByIChleHByLCBhc1RleHQsIHFzdHIpIHtcclxuXHJcbiAgICAgICAgICAgIGlmIChleHByWzBdID09PSAnPScpIGV4cHIgPSBleHByLnNsaWNlKDEpXHJcblxyXG4gICAgICAgICAgICBleHByID0gZXhwclxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoUkVfUUJMT0NLLCBmdW5jdGlvbiAocywgZGl2KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHMubGVuZ3RoID4gMiAmJiAhZGl2ID8gJ1xceDAxJyArIChxc3RyLnB1c2gocykgLSAxKSArICd+JyA6IHNcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKVxyXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcID8oW1tcXCh7fSw/XFwuOl0pXFwgPy9nLCAnJDEnKVxyXG5cclxuICAgICAgICAgICAgaWYgKGV4cHIpIHtcclxuICAgICAgICAgICAgICAgIHZhclxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBbXSxcclxuICAgICAgICAgICAgICAgICAgICBjbnQgPSAwLFxyXG4gICAgICAgICAgICAgICAgICAgIG1hdGNoXHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKGV4cHIgJiZcclxuICAgICAgICAgICAgICAgIChtYXRjaCA9IGV4cHIubWF0Y2goQ1NfSURFTlQpKSAmJlxyXG4gICAgICAgICAgICAgICAgIW1hdGNoLmluZGV4XHJcbiAgICAgICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgICAgICAgICAgICAganNiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZSA9IC8sfChbW3soXSl8JC9nXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGV4cHIgPSBSZWdFeHAucmlnaHRDb250ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAga2V5ICA9IG1hdGNoWzJdID8gcXN0clttYXRjaFsyXV0uc2xpY2UoMSwgLTEpLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJykgOiBtYXRjaFsxXVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoanNiID0gKG1hdGNoID0gcmUuZXhlYyhleHByKSlbMV0pIHNraXBCcmFjZXMoanNiLCByZSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAganNiICA9IGV4cHIuc2xpY2UoMCwgbWF0Y2guaW5kZXgpXHJcbiAgICAgICAgICAgICAgICAgICAgZXhwciA9IFJlZ0V4cC5yaWdodENvbnRleHRcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdFtjbnQrK10gPSBfd3JhcEV4cHIoanNiLCAxLCBrZXkpXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgZXhwciA9ICFjbnQgPyBfd3JhcEV4cHIoZXhwciwgYXNUZXh0KSA6XHJcbiAgICAgICAgICAgICAgICAgICAgY250ID4gMSA/ICdbJyArIGxpc3Quam9pbignLCcpICsgJ10uam9pbihcIiBcIikudHJpbSgpJyA6IGxpc3RbMF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZXhwclxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2tpcEJyYWNlcyAoY2gsIHJlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgICAgICBtbSxcclxuICAgICAgICAgICAgICAgICAgICBsdiA9IDEsXHJcbiAgICAgICAgICAgICAgICAgICAgaXIgPSBSRV9CUkVORFtjaF1cclxuXHJcbiAgICAgICAgICAgICAgICBpci5sYXN0SW5kZXggPSByZS5sYXN0SW5kZXhcclxuICAgICAgICAgICAgICAgIHdoaWxlIChtbSA9IGlyLmV4ZWMoZXhwcikpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobW1bMF0gPT09IGNoKSArK2x2XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAoIS0tbHYpIGJyZWFrXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZS5sYXN0SW5kZXggPSBsdiA/IGV4cHIubGVuZ3RoIDogaXIubGFzdEluZGV4XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgYm90aFxyXG4gICAgICAgIHZhclxyXG4gICAgICAgICAgICBKU19DT05URVhUID0gJ1wiaW4gdGhpcz90aGlzOicgKyAodHlwZW9mIHdpbmRvdyAhPT0gJ29iamVjdCcgPyAnZ2xvYmFsJyA6ICd3aW5kb3cnKSArICcpLicsXHJcbiAgICAgICAgICAgIEpTX1ZBUk5BTUUgPSAvWyx7XVskXFx3XSs6fCheICp8W14kXFx3XFwuXSkoPyEoPzp0eXBlb2Z8dHJ1ZXxmYWxzZXxudWxsfHVuZGVmaW5lZHxpbnxpbnN0YW5jZW9mfGlzKD86RmluaXRlfE5hTil8dm9pZHxOYU58bmV3fERhdGV8UmVnRXhwfE1hdGgpKD8hWyRcXHddKSkoWyRfQS1aYS16XVskXFx3XSopL2csXHJcbiAgICAgICAgICAgIEpTX05PUFJPUFMgPSAvXig/PShcXC5bJFxcd10rKSlcXDEoPzpbXi5bKF18JCkvXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIF93cmFwRXhwciAoZXhwciwgYXNUZXh0LCBrZXkpIHtcclxuICAgICAgICAgICAgdmFyIHRiXHJcblxyXG4gICAgICAgICAgICBleHByID0gZXhwci5yZXBsYWNlKEpTX1ZBUk5BTUUsIGZ1bmN0aW9uIChtYXRjaCwgcCwgbXZhciwgcG9zLCBzKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobXZhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IHRiID8gMCA6IHBvcyArIG1hdGNoLmxlbmd0aFxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAobXZhciAhPT0gJ3RoaXMnICYmIG12YXIgIT09ICdnbG9iYWwnICYmIG12YXIgIT09ICd3aW5kb3cnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoID0gcCArICcoXCInICsgbXZhciArIEpTX0NPTlRFWFQgKyBtdmFyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChwb3MpIHRiID0gKHMgPSBzW3Bvc10pID09PSAnLicgfHwgcyA9PT0gJygnIHx8IHMgPT09ICdbJ1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocG9zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRiID0gIUpTX05PUFJPUFMudGVzdChzLnNsaWNlKHBvcykpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICBpZiAodGIpIHtcclxuICAgICAgICAgICAgICAgIGV4cHIgPSAndHJ5e3JldHVybiAnICsgZXhwciArICd9Y2F0Y2goZSl7RShlLHRoaXMpfSdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGtleSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGV4cHIgPSAodGIgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnZnVuY3Rpb24oKXsnICsgZXhwciArICd9LmNhbGwodGhpcyknIDogJygnICsgZXhwciArICcpJ1xyXG4gICAgICAgICAgICAgICAgICAgICkgKyAnP1wiJyArIGtleSArICdcIjpcIlwiJ1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmIChhc1RleHQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBleHByID0gJ2Z1bmN0aW9uKHYpeycgKyAodGIgP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwci5yZXBsYWNlKCdyZXR1cm4gJywgJ3Y9JykgOiAndj0oJyArIGV4cHIgKyAnKSdcclxuICAgICAgICAgICAgICAgICAgICApICsgJztyZXR1cm4gdnx8dj09PTA/djpcIlwifS5jYWxsKHRoaXMpJ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZXhwclxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHQ6IGNvbXBhdGliaWxpdHkgZml4IGZvciBiZXRhIHZlcnNpb25zXHJcbiAgICAgICAgX3RtcGwucGFyc2UgPSBmdW5jdGlvbiAocykgeyByZXR1cm4gcyB9XHJcblxyXG4gICAgICAgIF90bXBsLnZlcnNpb24gPSBicmFja2V0cy52ZXJzaW9uID0gJ3YyLjMuMjEnXHJcblxyXG4gICAgICAgIHJldHVybiBfdG1wbFxyXG5cclxuICAgIH0pKClcclxuXHJcbiAgICAvKlxyXG4gICAgIGxpYi9icm93c2VyL3RhZy9ta2RvbS5qc1xyXG5cclxuICAgICBJbmNsdWRlcyBoYWNrcyBuZWVkZWQgZm9yIHRoZSBJbnRlcm5ldCBFeHBsb3JlciB2ZXJzaW9uIDkgYW5kIGJlbG93XHJcbiAgICAgU2VlOiBodHRwOi8va2FuZ2F4LmdpdGh1Yi5pby9jb21wYXQtdGFibGUvZXM1LyNpZThcclxuICAgICBodHRwOi8vY29kZXBsYW5ldC5pby9kcm9wcGluZy1pZTgvXHJcbiAgICAgKi9cclxuICAgIHZhciBta2RvbSA9IChmdW5jdGlvbiAoY2hlY2tJRSkge1xyXG5cclxuICAgICAgICB2YXJcclxuICAgICAgICAgICAgcmVUb1NyYyA9IC88eWllbGRcXHMrdG89KFsnXCJdKT9AXFwxXFxzKj4oW1xcU1xcc10rPyk8XFwveWllbGRcXHMqPi8uc291cmNlLFxyXG4gICAgICAgICAgICByb290RWxzID0geyB0cjogJ3Rib2R5JywgdGg6ICd0cicsIHRkOiAndHInLCBjb2w6ICdjb2xncm91cCcgfSxcclxuICAgICAgICAgICAgR0VORVJJQyA9ICdkaXYnXHJcblxyXG4gICAgICAgIGNoZWNrSUUgPSBjaGVja0lFICYmIGNoZWNrSUUgPCAxMFxyXG4gICAgICAgIHZhciB0YmxUYWdzID0gY2hlY2tJRVxyXG4gICAgICAgICAgICA/IFNQRUNJQUxfVEFHU19SRUdFWCA6IC9eKD86dCg/OmJvZHl8aGVhZHxmb290fFtyaGRdKXxjYXB0aW9ufGNvbCg/Omdyb3VwKT8pJC9cclxuXHJcbiAgICAgICAgLy8gY3JlYXRlcyBhbnkgZG9tIGVsZW1lbnQgaW4gYSBkaXYsIHRhYmxlLCBvciBjb2xncm91cCBjb250YWluZXJcclxuICAgICAgICBmdW5jdGlvbiBfbWtkb20odGVtcGwsIGh0bWwpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXRjaCA9IHRlbXBsICYmIHRlbXBsLm1hdGNoKC9eXFxzKjwoWy1cXHddKykvKSxcclxuICAgICAgICAgICAgICAgIHRhZ05hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpLFxyXG4gICAgICAgICAgICAgICAgZWwgPSBta0VsKEdFTkVSSUMpXHJcblxyXG4gICAgICAgICAgICAvLyByZXBsYWNlIGFsbCB0aGUgeWllbGQgdGFncyB3aXRoIHRoZSB0YWcgaW5uZXIgaHRtbFxyXG4gICAgICAgICAgICB0ZW1wbCA9IHJlcGxhY2VZaWVsZCh0ZW1wbCwgaHRtbCB8fCAnJylcclxuXHJcbiAgICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgICAgIC8vaWYgKChjaGVja0lFIHx8ICFzdGFydHNXaXRoKHRhZ05hbWUsICdvcHQnKSkgJiYgU1BFQ0lBTF9UQUdTX1JFR0VYLnRlc3QodGFnTmFtZSkpXHJcbiAgICAgICAgICAgIGlmICh0YmxUYWdzLnRlc3QodGFnTmFtZSkpXHJcbiAgICAgICAgICAgICAgICBlbCA9IHNwZWNpYWxUYWdzKGVsLCB0ZW1wbCwgdGFnTmFtZSlcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgZWwuaW5uZXJIVE1MID0gdGVtcGxcclxuXHJcbiAgICAgICAgICAgIGVsLnN0dWIgPSB0cnVlXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZWxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNyZWF0ZXMgdGhlIHJvb3QgZWxlbWVudCBmb3IgdGFibGUgYW5kIHNlbGVjdCBjaGlsZCBlbGVtZW50c1xyXG4gICAgICAgIC8vIHRyL3RoL3RkL3RoZWFkL3Rmb290L3Rib2R5L2NhcHRpb24vY29sL2NvbGdyb3VwL29wdGlvbi9vcHRncm91cFxyXG4gICAgICAgIGZ1bmN0aW9uIHNwZWNpYWxUYWdzKGVsLCB0ZW1wbCwgdGFnTmFtZSkge1xyXG4gICAgICAgICAgICB2YXJcclxuICAgICAgICAgICAgICAgIHNlbGVjdCA9IHRhZ05hbWVbMF0gPT09ICdvJyxcclxuICAgICAgICAgICAgICAgIHBhcmVudCA9IHNlbGVjdCA/ICdzZWxlY3Q+JyA6ICd0YWJsZT4nXHJcblxyXG4gICAgICAgICAgICAvLyB0cmltKCkgaXMgaW1wb3J0YW50IGhlcmUsIHRoaXMgZW5zdXJlcyB3ZSBkb24ndCBoYXZlIGFydGlmYWN0cyxcclxuICAgICAgICAgICAgLy8gc28gd2UgY2FuIGNoZWNrIGlmIHdlIGhhdmUgb25seSBvbmUgZWxlbWVudCBpbnNpZGUgdGhlIHBhcmVudFxyXG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSAnPCcgKyBwYXJlbnQgKyB0ZW1wbC50cmltKCkgKyAnPC8nICsgcGFyZW50XHJcbiAgICAgICAgICAgIHBhcmVudCA9IGVsLmZpcnN0Q2hpbGRcclxuXHJcbiAgICAgICAgICAgIC8vIHJldHVybnMgdGhlIGltbWVkaWF0ZSBwYXJlbnQgaWYgdHIvdGgvdGQvY29sIGlzIHRoZSBvbmx5IGVsZW1lbnQsIGlmIG5vdFxyXG4gICAgICAgICAgICAvLyByZXR1cm5zIHRoZSB3aG9sZSB0cmVlLCBhcyB0aGlzIGNhbiBpbmNsdWRlIGFkZGl0aW9uYWwgZWxlbWVudHNcclxuICAgICAgICAgICAgaWYgKHNlbGVjdCkge1xyXG4gICAgICAgICAgICAgICAgcGFyZW50LnNlbGVjdGVkSW5kZXggPSAtMSAgLy8gZm9yIElFOSwgY29tcGF0aWJsZSB3L2N1cnJlbnQgcmlvdCBiZWhhdmlvclxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHRuYW1lID0gcm9vdEVsc1t0YWdOYW1lXVxyXG4gICAgICAgICAgICAgICAgaWYgKHRuYW1lICYmIHBhcmVudC5jaGlsZHJlbi5sZW5ndGggPT09IDEpIHBhcmVudCA9ICQodG5hbWUsIHBhcmVudClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcGFyZW50XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBSZXBsYWNlIHRoZSB5aWVsZCB0YWcgZnJvbSBhbnkgdGFnIHRlbXBsYXRlIHdpdGggdGhlIGlubmVySFRNTCBvZiB0aGVcclxuICAgICAgICAgKiBvcmlnaW5hbCB0YWcgaW4gdGhlIHBhZ2VcclxuICAgICAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IHRlbXBsIC0gdGFnIGltcGxlbWVudGF0aW9uIHRlbXBsYXRlXHJcbiAgICAgICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBodG1sICAtIG9yaWdpbmFsIGNvbnRlbnQgb2YgdGhlIHRhZyBpbiB0aGUgRE9NXHJcbiAgICAgICAgICogQHJldHVybnMgeyBTdHJpbmcgfSB0YWcgdGVtcGxhdGUgdXBkYXRlZCB3aXRob3V0IHRoZSB5aWVsZCB0YWdcclxuICAgICAgICAgKi9cclxuICAgICAgICBmdW5jdGlvbiByZXBsYWNlWWllbGQodGVtcGwsIGh0bWwpIHtcclxuICAgICAgICAgICAgLy8gZG8gbm90aGluZyBpZiBubyB5aWVsZFxyXG4gICAgICAgICAgICBpZiAoIS88eWllbGRcXGIvaS50ZXN0KHRlbXBsKSkgcmV0dXJuIHRlbXBsXHJcblxyXG4gICAgICAgICAgICAvLyBiZSBjYXJlZnVsIHdpdGggIzEzNDMgLSBzdHJpbmcgb24gdGhlIHNvdXJjZSBoYXZpbmcgYCQxYFxyXG4gICAgICAgICAgICB2YXIgbiA9IDBcclxuICAgICAgICAgICAgdGVtcGwgPSB0ZW1wbC5yZXBsYWNlKC88eWllbGRcXHMrZnJvbT1bJ1wiXShbLVxcd10rKVsnXCJdXFxzKig/OlxcLz58Plxccyo8XFwveWllbGRcXHMqPikvaWcsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoc3RyLCByZWYpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbSA9IGh0bWwubWF0Y2goUmVnRXhwKHJlVG9TcmMucmVwbGFjZSgnQCcsIHJlZiksICdpJykpXHJcbiAgICAgICAgICAgICAgICAgICAgKytuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG0gJiYgbVsyXSB8fCAnJ1xyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIHlpZWxkIHdpdGhvdXQgYW55IFwiZnJvbVwiLCByZXBsYWNlIHlpZWxkIGluIHRlbXBsIHdpdGggdGhlIGlubmVySFRNTFxyXG4gICAgICAgICAgICByZXR1cm4gbiA/IHRlbXBsIDogdGVtcGwucmVwbGFjZSgvPHlpZWxkXFxzKig/OlxcLz58Plxccyo8XFwveWllbGRcXHMqPikvZ2ksIGh0bWwpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gX21rZG9tXHJcblxyXG4gICAgfSkoSUVfVkVSU0lPTilcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnZlcnQgdGhlIGl0ZW0gbG9vcGVkIGludG8gYW4gb2JqZWN0IHVzZWQgdG8gZXh0ZW5kIHRoZSBjaGlsZCB0YWcgcHJvcGVydGllc1xyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBleHByIC0gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGtleXMgdXNlZCB0byBleHRlbmQgdGhlIGNoaWxkcmVuIHRhZ3NcclxuICAgICAqIEBwYXJhbSAgIHsgKiB9IGtleSAtIHZhbHVlIHRvIGFzc2lnbiB0byB0aGUgbmV3IG9iamVjdCByZXR1cm5lZFxyXG4gICAgICogQHBhcmFtICAgeyAqIH0gdmFsIC0gdmFsdWUgY29udGFpbmluZyB0aGUgcG9zaXRpb24gb2YgdGhlIGl0ZW0gaW4gdGhlIGFycmF5XHJcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IC0gbmV3IG9iamVjdCBjb250YWluaW5nIHRoZSB2YWx1ZXMgb2YgdGhlIG9yaWdpbmFsIGl0ZW1cclxuICAgICAqXHJcbiAgICAgKiBUaGUgdmFyaWFibGVzICdrZXknIGFuZCAndmFsJyBhcmUgYXJiaXRyYXJ5LlxyXG4gICAgICogVGhleSBkZXBlbmQgb24gdGhlIGNvbGxlY3Rpb24gdHlwZSBsb29wZWQgKEFycmF5LCBPYmplY3QpXHJcbiAgICAgKiBhbmQgb24gdGhlIGV4cHJlc3Npb24gdXNlZCBvbiB0aGUgZWFjaCB0YWdcclxuICAgICAqXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1raXRlbShleHByLCBrZXksIHZhbCkge1xyXG4gICAgICAgIHZhciBpdGVtID0ge31cclxuICAgICAgICBpdGVtW2V4cHIua2V5XSA9IGtleVxyXG4gICAgICAgIGlmIChleHByLnBvcykgaXRlbVtleHByLnBvc10gPSB2YWxcclxuICAgICAgICByZXR1cm4gaXRlbVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVW5tb3VudCB0aGUgcmVkdW5kYW50IHRhZ3NcclxuICAgICAqIEBwYXJhbSAgIHsgQXJyYXkgfSBpdGVtcyAtIGFycmF5IGNvbnRhaW5pbmcgdGhlIGN1cnJlbnQgaXRlbXMgdG8gbG9vcFxyXG4gICAgICogQHBhcmFtICAgeyBBcnJheSB9IHRhZ3MgLSBhcnJheSBjb250YWluaW5nIGFsbCB0aGUgY2hpbGRyZW4gdGFnc1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB1bm1vdW50UmVkdW5kYW50KGl0ZW1zLCB0YWdzKSB7XHJcblxyXG4gICAgICAgIHZhciBpID0gdGFncy5sZW5ndGgsXHJcbiAgICAgICAgICAgIGogPSBpdGVtcy5sZW5ndGgsXHJcbiAgICAgICAgICAgIHRcclxuXHJcbiAgICAgICAgd2hpbGUgKGkgPiBqKSB7XHJcbiAgICAgICAgICAgIHQgPSB0YWdzWy0taV1cclxuICAgICAgICAgICAgdGFncy5zcGxpY2UoaSwgMSlcclxuICAgICAgICAgICAgdC51bm1vdW50KClcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNb3ZlIHRoZSBuZXN0ZWQgY3VzdG9tIHRhZ3MgaW4gbm9uIGN1c3RvbSBsb29wIHRhZ3NcclxuICAgICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gY2hpbGQgLSBub24gY3VzdG9tIGxvb3AgdGFnXHJcbiAgICAgKiBAcGFyYW0gICB7IE51bWJlciB9IGkgLSBjdXJyZW50IHBvc2l0aW9uIG9mIHRoZSBsb29wIHRhZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtb3ZlTmVzdGVkVGFncyhjaGlsZCwgaSkge1xyXG4gICAgICAgIE9iamVjdC5rZXlzKGNoaWxkLnRhZ3MpLmZvckVhY2goZnVuY3Rpb24odGFnTmFtZSkge1xyXG4gICAgICAgICAgICB2YXIgdGFnID0gY2hpbGQudGFnc1t0YWdOYW1lXVxyXG4gICAgICAgICAgICBpZiAoaXNBcnJheSh0YWcpKVxyXG4gICAgICAgICAgICAgICAgZWFjaCh0YWcsIGZ1bmN0aW9uICh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW92ZUNoaWxkVGFnKHQsIHRhZ05hbWUsIGkpXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBtb3ZlQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBpKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGRzIHRoZSBlbGVtZW50cyBmb3IgYSB2aXJ0dWFsIHRhZ1xyXG4gICAgICogQHBhcmFtIHsgVGFnIH0gdGFnIC0gdGhlIHRhZyB3aG9zZSByb290J3MgY2hpbGRyZW4gd2lsbCBiZSBpbnNlcnRlZCBvciBhcHBlbmRlZFxyXG4gICAgICogQHBhcmFtIHsgTm9kZSB9IHNyYyAtIHRoZSBub2RlIHRoYXQgd2lsbCBkbyB0aGUgaW5zZXJ0aW5nIG9yIGFwcGVuZGluZ1xyXG4gICAgICogQHBhcmFtIHsgVGFnIH0gdGFyZ2V0IC0gb25seSBpZiBpbnNlcnRpbmcsIGluc2VydCBiZWZvcmUgdGhpcyB0YWcncyBmaXJzdCBjaGlsZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhZGRWaXJ0dWFsKHRhZywgc3JjLCB0YXJnZXQpIHtcclxuICAgICAgICB2YXIgZWwgPSB0YWcuX3Jvb3QsIHNpYlxyXG4gICAgICAgIHRhZy5fdmlydHMgPSBbXVxyXG4gICAgICAgIHdoaWxlIChlbCkge1xyXG4gICAgICAgICAgICBzaWIgPSBlbC5uZXh0U2libGluZ1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0KVxyXG4gICAgICAgICAgICAgICAgc3JjLmluc2VydEJlZm9yZShlbCwgdGFyZ2V0Ll9yb290KVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBzcmMuYXBwZW5kQ2hpbGQoZWwpXHJcblxyXG4gICAgICAgICAgICB0YWcuX3ZpcnRzLnB1c2goZWwpIC8vIGhvbGQgZm9yIHVubW91bnRpbmdcclxuICAgICAgICAgICAgZWwgPSBzaWJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNb3ZlIHZpcnR1YWwgdGFnIGFuZCBhbGwgY2hpbGQgbm9kZXNcclxuICAgICAqIEBwYXJhbSB7IFRhZyB9IHRhZyAtIGZpcnN0IGNoaWxkIHJlZmVyZW5jZSB1c2VkIHRvIHN0YXJ0IG1vdmVcclxuICAgICAqIEBwYXJhbSB7IE5vZGUgfSBzcmMgIC0gdGhlIG5vZGUgdGhhdCB3aWxsIGRvIHRoZSBpbnNlcnRpbmdcclxuICAgICAqIEBwYXJhbSB7IFRhZyB9IHRhcmdldCAtIGluc2VydCBiZWZvcmUgdGhpcyB0YWcncyBmaXJzdCBjaGlsZFxyXG4gICAgICogQHBhcmFtIHsgTnVtYmVyIH0gbGVuIC0gaG93IG1hbnkgY2hpbGQgbm9kZXMgdG8gbW92ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtb3ZlVmlydHVhbCh0YWcsIHNyYywgdGFyZ2V0LCBsZW4pIHtcclxuICAgICAgICB2YXIgZWwgPSB0YWcuX3Jvb3QsIHNpYiwgaSA9IDBcclxuICAgICAgICBmb3IgKDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHNpYiA9IGVsLm5leHRTaWJsaW5nXHJcbiAgICAgICAgICAgIHNyYy5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5fcm9vdClcclxuICAgICAgICAgICAgZWwgPSBzaWJcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTWFuYWdlIHRhZ3MgaGF2aW5nIHRoZSAnZWFjaCdcclxuICAgICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2UgbmVlZCB0byBsb29wXHJcbiAgICAgKiBAcGFyYW0gICB7IFRhZyB9IHBhcmVudCAtIHBhcmVudCB0YWcgaW5zdGFuY2Ugd2hlcmUgdGhlIGRvbSBub2RlIGlzIGNvbnRhaW5lZFxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBleHByIC0gc3RyaW5nIGNvbnRhaW5lZCBpbiB0aGUgJ2VhY2gnIGF0dHJpYnV0ZVxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBfZWFjaChkb20sIHBhcmVudCwgZXhwcikge1xyXG5cclxuICAgICAgICAvLyByZW1vdmUgdGhlIGVhY2ggcHJvcGVydHkgZnJvbSB0aGUgb3JpZ2luYWwgdGFnXHJcbiAgICAgICAgcmVtQXR0cihkb20sICdlYWNoJylcclxuXHJcbiAgICAgICAgdmFyIG11c3RSZW9yZGVyID0gdHlwZW9mIGdldEF0dHIoZG9tLCAnbm8tcmVvcmRlcicpICE9PSBUX1NUUklORyB8fCByZW1BdHRyKGRvbSwgJ25vLXJlb3JkZXInKSxcclxuICAgICAgICAgICAgdGFnTmFtZSA9IGdldFRhZ05hbWUoZG9tKSxcclxuICAgICAgICAgICAgaW1wbCA9IF9fdGFnSW1wbFt0YWdOYW1lXSB8fCB7IHRtcGw6IGRvbS5vdXRlckhUTUwgfSxcclxuICAgICAgICAgICAgdXNlUm9vdCA9IFNQRUNJQUxfVEFHU19SRUdFWC50ZXN0KHRhZ05hbWUpLFxyXG4gICAgICAgICAgICByb290ID0gZG9tLnBhcmVudE5vZGUsXHJcbiAgICAgICAgICAgIHJlZiA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKSxcclxuICAgICAgICAgICAgY2hpbGQgPSBnZXRUYWcoZG9tKSxcclxuICAgICAgICAgICAgaXNPcHRpb24gPSAvXm9wdGlvbiQvaS50ZXN0KHRhZ05hbWUpLCAvLyB0aGUgb3B0aW9uIHRhZ3MgbXVzdCBiZSB0cmVhdGVkIGRpZmZlcmVudGx5XHJcbiAgICAgICAgICAgIHRhZ3MgPSBbXSxcclxuICAgICAgICAgICAgb2xkSXRlbXMgPSBbXSxcclxuICAgICAgICAgICAgaGFzS2V5cyxcclxuICAgICAgICAgICAgaXNWaXJ0dWFsID0gZG9tLnRhZ05hbWUgPT0gJ1ZJUlRVQUwnXHJcblxyXG4gICAgICAgIC8vIHBhcnNlIHRoZSBlYWNoIGV4cHJlc3Npb25cclxuICAgICAgICBleHByID0gdG1wbC5sb29wS2V5cyhleHByKVxyXG5cclxuICAgICAgICAvLyBpbnNlcnQgYSBtYXJrZWQgd2hlcmUgdGhlIGxvb3AgdGFncyB3aWxsIGJlIGluamVjdGVkXHJcbiAgICAgICAgcm9vdC5pbnNlcnRCZWZvcmUocmVmLCBkb20pXHJcblxyXG4gICAgICAgIC8vIGNsZWFuIHRlbXBsYXRlIGNvZGVcclxuICAgICAgICBwYXJlbnQub25lKCdiZWZvcmUtbW91bnQnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIG9yaWdpbmFsIERPTSBub2RlXHJcbiAgICAgICAgICAgIGRvbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbSlcclxuICAgICAgICAgICAgaWYgKHJvb3Quc3R1Yikgcm9vdCA9IHBhcmVudC5yb290XHJcblxyXG4gICAgICAgIH0pLm9uKCd1cGRhdGUnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vIGdldCB0aGUgbmV3IGl0ZW1zIGNvbGxlY3Rpb25cclxuICAgICAgICAgICAgdmFyIGl0ZW1zID0gdG1wbChleHByLnZhbCwgcGFyZW50KSxcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGEgZnJhZ21lbnQgdG8gaG9sZCB0aGUgbmV3IERPTSBub2RlcyB0byBpbmplY3QgaW4gdGhlIHBhcmVudCB0YWdcclxuICAgICAgICAgICAgICAgIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcclxuXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gb2JqZWN0IGxvb3AuIGFueSBjaGFuZ2VzIGNhdXNlIGZ1bGwgcmVkcmF3XHJcbiAgICAgICAgICAgIGlmICghaXNBcnJheShpdGVtcykpIHtcclxuICAgICAgICAgICAgICAgIGhhc0tleXMgPSBpdGVtcyB8fCBmYWxzZVxyXG4gICAgICAgICAgICAgICAgaXRlbXMgPSBoYXNLZXlzID9cclxuICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyhpdGVtcykubWFwKGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1raXRlbShleHByLCBrZXksIGl0ZW1zW2tleV0pXHJcbiAgICAgICAgICAgICAgICAgICAgfSkgOiBbXVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBsb29wIGFsbCB0aGUgbmV3IGl0ZW1zXHJcbiAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xyXG4gICAgICAgICAgICAgICAgLy8gcmVvcmRlciBvbmx5IGlmIHRoZSBpdGVtcyBhcmUgb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgdmFyIF9tdXN0UmVvcmRlciA9IG11c3RSZW9yZGVyICYmIGl0ZW0gaW5zdGFuY2VvZiBPYmplY3QsXHJcbiAgICAgICAgICAgICAgICAgICAgb2xkUG9zID0gb2xkSXRlbXMuaW5kZXhPZihpdGVtKSxcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSB+b2xkUG9zICYmIF9tdXN0UmVvcmRlciA/IG9sZFBvcyA6IGksXHJcbiAgICAgICAgICAgICAgICAvLyBkb2VzIGEgdGFnIGV4aXN0IGluIHRoaXMgcG9zaXRpb24/XHJcbiAgICAgICAgICAgICAgICAgICAgdGFnID0gdGFnc1twb3NdXHJcblxyXG4gICAgICAgICAgICAgICAgaXRlbSA9ICFoYXNLZXlzICYmIGV4cHIua2V5ID8gbWtpdGVtKGV4cHIsIGl0ZW0sIGkpIDogaXRlbVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIG5ldyB0YWdcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICAhX211c3RSZW9yZGVyICYmICF0YWcgLy8gd2l0aCBuby1yZW9yZGVyIHdlIGp1c3QgdXBkYXRlIHRoZSBvbGQgdGFnc1xyXG4gICAgICAgICAgICAgICAgICAgIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgX211c3RSZW9yZGVyICYmICF+b2xkUG9zIHx8ICF0YWcgLy8gYnkgZGVmYXVsdCB3ZSBhbHdheXMgdHJ5IHRvIHJlb3JkZXIgdGhlIERPTSBlbGVtZW50c1xyXG4gICAgICAgICAgICAgICAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRhZyA9IG5ldyBUYWcoaW1wbCwge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IHBhcmVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaXNMb29wOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNJbXBsOiAhIV9fdGFnSW1wbFt0YWdOYW1lXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm9vdDogdXNlUm9vdCA/IHJvb3QgOiBkb20uY2xvbmVOb2RlKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW1cclxuICAgICAgICAgICAgICAgICAgICB9LCBkb20uaW5uZXJIVE1MKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0YWcubW91bnQoKVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1ZpcnR1YWwpIHRhZy5fcm9vdCA9IHRhZy5yb290LmZpcnN0Q2hpbGQgLy8gc2F2ZSByZWZlcmVuY2UgZm9yIGZ1cnRoZXIgbW92ZXMgb3IgaW5zZXJ0c1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoaXMgdGFnIG11c3QgYmUgYXBwZW5kZWRcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA9PSB0YWdzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNWaXJ0dWFsKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkVmlydHVhbCh0YWcsIGZyYWcpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgZnJhZy5hcHBlbmRDaGlsZCh0YWcucm9vdClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyB0YWcgbXVzdCBiZSBpbnNlcnRcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmlydHVhbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFkZFZpcnR1YWwodGFnLCByb290LCB0YWdzW2ldKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHJvb3QuaW5zZXJ0QmVmb3JlKHRhZy5yb290LCB0YWdzW2ldLnJvb3QpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9sZEl0ZW1zLnNwbGljZShpLCAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGFncy5zcGxpY2UoaSwgMCwgdGFnKVxyXG4gICAgICAgICAgICAgICAgICAgIHBvcyA9IGkgLy8gaGFuZGxlZCBoZXJlIHNvIG5vIG1vdmVcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB0YWcudXBkYXRlKGl0ZW0pXHJcblxyXG4gICAgICAgICAgICAgICAgLy8gcmVvcmRlciB0aGUgdGFnIGlmIGl0J3Mgbm90IGxvY2F0ZWQgaW4gaXRzIHByZXZpb3VzIHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAocG9zICE9PSBpICYmIF9tdXN0UmVvcmRlcikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgRE9NXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzVmlydHVhbClcclxuICAgICAgICAgICAgICAgICAgICAgICAgbW92ZVZpcnR1YWwodGFnLCByb290LCB0YWdzW2ldLCBkb20uY2hpbGROb2Rlcy5sZW5ndGgpXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSByb290Lmluc2VydEJlZm9yZSh0YWcucm9vdCwgdGFnc1tpXS5yb290KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgcG9zaXRpb24gYXR0cmlidXRlIGlmIGl0IGV4aXN0c1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChleHByLnBvcylcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGFnW2V4cHIucG9zXSA9IGlcclxuICAgICAgICAgICAgICAgICAgICAvLyBtb3ZlIHRoZSBvbGQgdGFnIGluc3RhbmNlXHJcbiAgICAgICAgICAgICAgICAgICAgdGFncy5zcGxpY2UoaSwgMCwgdGFncy5zcGxpY2UocG9zLCAxKVswXSlcclxuICAgICAgICAgICAgICAgICAgICAvLyBtb3ZlIHRoZSBvbGQgaXRlbVxyXG4gICAgICAgICAgICAgICAgICAgIG9sZEl0ZW1zLnNwbGljZShpLCAwLCBvbGRJdGVtcy5zcGxpY2UocG9zLCAxKVswXSlcclxuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgbG9vcCB0YWdzIGFyZSBub3QgY3VzdG9tXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gd2UgbmVlZCB0byBtb3ZlIGFsbCB0aGVpciBjdXN0b20gdGFncyBpbnRvIHRoZSByaWdodCBwb3NpdGlvblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2hpbGQgJiYgdGFnLnRhZ3MpIG1vdmVOZXN0ZWRUYWdzKHRhZywgaSlcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaXRlbSB0byB1c2UgaXQgaW4gdGhlIGV2ZW50cyBib3VuZCB0byB0aGlzIG5vZGVcclxuICAgICAgICAgICAgICAgIC8vIGFuZCBpdHMgY2hpbGRyZW5cclxuICAgICAgICAgICAgICAgIHRhZy5faXRlbSA9IGl0ZW1cclxuICAgICAgICAgICAgICAgIC8vIGNhY2hlIHRoZSByZWFsIHBhcmVudCB0YWcgaW50ZXJuYWxseVxyXG4gICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkodGFnLCAnX3BhcmVudCcsIHBhcmVudClcclxuXHJcbiAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIHJlZHVuZGFudCB0YWdzXHJcbiAgICAgICAgICAgIHVubW91bnRSZWR1bmRhbnQoaXRlbXMsIHRhZ3MpXHJcblxyXG4gICAgICAgICAgICAvLyBpbnNlcnQgdGhlIG5ldyBub2Rlc1xyXG4gICAgICAgICAgICBpZiAoaXNPcHRpb24pIHJvb3QuYXBwZW5kQ2hpbGQoZnJhZylcclxuICAgICAgICAgICAgZWxzZSByb290Lmluc2VydEJlZm9yZShmcmFnLCByZWYpXHJcblxyXG4gICAgICAgICAgICAvLyBzZXQgdGhlICd0YWdzJyBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRhZ1xyXG4gICAgICAgICAgICAvLyBpZiBjaGlsZCBpcyAndW5kZWZpbmVkJyBpdCBtZWFucyB0aGF0IHdlIGRvbid0IG5lZWQgdG8gc2V0IHRoaXMgcHJvcGVydHlcclxuICAgICAgICAgICAgLy8gZm9yIGV4YW1wbGU6XHJcbiAgICAgICAgICAgIC8vIHdlIGRvbid0IG5lZWQgc3RvcmUgdGhlIGBteVRhZy50YWdzWydkaXYnXWAgcHJvcGVydHkgaWYgd2UgYXJlIGxvb3BpbmcgYSBkaXYgdGFnXHJcbiAgICAgICAgICAgIC8vIGJ1dCB3ZSBuZWVkIHRvIHRyYWNrIHRoZSBgbXlUYWcudGFnc1snY2hpbGQnXWAgcHJvcGVydHkgbG9vcGluZyBhIGN1c3RvbSBjaGlsZCBub2RlIG5hbWVkIGBjaGlsZGBcclxuICAgICAgICAgICAgaWYgKGNoaWxkKSBwYXJlbnQudGFnc1t0YWdOYW1lXSA9IHRhZ3NcclxuXHJcbiAgICAgICAgICAgIC8vIGNsb25lIHRoZSBpdGVtcyBhcnJheVxyXG4gICAgICAgICAgICBvbGRJdGVtcyA9IGl0ZW1zLnNsaWNlKClcclxuXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIE9iamVjdCB0aGF0IHdpbGwgYmUgdXNlZCB0byBpbmplY3QgYW5kIG1hbmFnZSB0aGUgY3NzIG9mIGV2ZXJ5IHRhZyBpbnN0YW5jZVxyXG4gICAgICovXHJcbiAgICB2YXIgc3R5bGVNYW5hZ2VyID0gKGZ1bmN0aW9uKF9yaW90KSB7XHJcblxyXG4gICAgICAgIGlmICghd2luZG93KSByZXR1cm4geyAvLyBza2lwIGluamVjdGlvbiBvbiB0aGUgc2VydmVyXHJcbiAgICAgICAgICAgIGFkZDogZnVuY3Rpb24gKCkge30sXHJcbiAgICAgICAgICAgIGluamVjdDogZnVuY3Rpb24gKCkge31cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBzdHlsZU5vZGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgc3R5bGUgZWxlbWVudCB3aXRoIHRoZSBjb3JyZWN0IHR5cGVcclxuICAgICAgICAgICAgdmFyIG5ld05vZGUgPSBta0VsKCdzdHlsZScpXHJcbiAgICAgICAgICAgIHNldEF0dHIobmV3Tm9kZSwgJ3R5cGUnLCAndGV4dC9jc3MnKVxyXG5cclxuICAgICAgICAgICAgLy8gcmVwbGFjZSBhbnkgdXNlciBub2RlIG9yIGluc2VydCB0aGUgbmV3IG9uZSBpbnRvIHRoZSBoZWFkXHJcbiAgICAgICAgICAgIHZhciB1c2VyTm9kZSA9ICQoJ3N0eWxlW3R5cGU9cmlvdF0nKVxyXG4gICAgICAgICAgICBpZiAodXNlck5vZGUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh1c2VyTm9kZS5pZCkgbmV3Tm9kZS5pZCA9IHVzZXJOb2RlLmlkXHJcbiAgICAgICAgICAgICAgICB1c2VyTm9kZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdOb2RlLCB1c2VyTm9kZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNlIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQobmV3Tm9kZSlcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBuZXdOb2RlXHJcbiAgICAgICAgfSkoKVxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgY2FjaGUgYW5kIHNob3J0Y3V0IHRvIHRoZSBjb3JyZWN0IHByb3BlcnR5XHJcbiAgICAgICAgdmFyIGNzc1RleHRQcm9wID0gc3R5bGVOb2RlLnN0eWxlU2hlZXQsXHJcbiAgICAgICAgICAgIHN0eWxlc1RvSW5qZWN0ID0gJydcclxuXHJcbiAgICAgICAgLy8gRXhwb3NlIHRoZSBzdHlsZSBub2RlIGluIGEgbm9uLW1vZGlmaWNhYmxlIHByb3BlcnR5XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9yaW90LCAnc3R5bGVOb2RlJywge1xyXG4gICAgICAgICAgICB2YWx1ZTogc3R5bGVOb2RlLFxyXG4gICAgICAgICAgICB3cml0YWJsZTogdHJ1ZVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFB1YmxpYyBhcGlcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgICogU2F2ZSBhIHRhZyBzdHlsZSB0byBiZSBsYXRlciBpbmplY3RlZCBpbnRvIERPTVxyXG4gICAgICAgICAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGNzcyBbZGVzY3JpcHRpb25dXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKGNzcykge1xyXG4gICAgICAgICAgICAgICAgc3R5bGVzVG9JbmplY3QgKz0gY3NzXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBJbmplY3QgYWxsIHByZXZpb3VzbHkgc2F2ZWQgdGFnIHN0eWxlcyBpbnRvIERPTVxyXG4gICAgICAgICAgICAgKiBpbm5lckhUTUwgc2VlbXMgc2xvdzogaHR0cDovL2pzcGVyZi5jb20vcmlvdC1pbnNlcnQtc3R5bGVcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgIGluamVjdDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc3R5bGVzVG9JbmplY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoY3NzVGV4dFByb3ApIGNzc1RleHRQcm9wLmNzc1RleHQgKz0gc3R5bGVzVG9JbmplY3RcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHN0eWxlTm9kZS5pbm5lckhUTUwgKz0gc3R5bGVzVG9JbmplY3RcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZXNUb0luamVjdCA9ICcnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfSkocmlvdClcclxuXHJcblxyXG4gICAgZnVuY3Rpb24gcGFyc2VOYW1lZEVsZW1lbnRzKHJvb3QsIHRhZywgY2hpbGRUYWdzLCBmb3JjZVBhcnNpbmdOYW1lZCkge1xyXG5cclxuICAgICAgICB3YWxrKHJvb3QsIGZ1bmN0aW9uKGRvbSkge1xyXG4gICAgICAgICAgICBpZiAoZG9tLm5vZGVUeXBlID09IDEpIHtcclxuICAgICAgICAgICAgICAgIGRvbS5pc0xvb3AgPSBkb20uaXNMb29wIHx8XHJcbiAgICAgICAgICAgICAgICAoZG9tLnBhcmVudE5vZGUgJiYgZG9tLnBhcmVudE5vZGUuaXNMb29wIHx8IGdldEF0dHIoZG9tLCAnZWFjaCcpKVxyXG4gICAgICAgICAgICAgICAgICAgID8gMSA6IDBcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjdXN0b20gY2hpbGQgdGFnXHJcbiAgICAgICAgICAgICAgICBpZiAoY2hpbGRUYWdzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkID0gZ2V0VGFnKGRvbSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkICYmICFkb20uaXNMb29wKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGlsZFRhZ3MucHVzaChpbml0Q2hpbGRUYWcoY2hpbGQsIHtyb290OiBkb20sIHBhcmVudDogdGFnfSwgZG9tLmlubmVySFRNTCwgdGFnKSlcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWRvbS5pc0xvb3AgfHwgZm9yY2VQYXJzaW5nTmFtZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0TmFtZWQoZG9tLCB0YWcsIFtdKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbnMocm9vdCwgdGFnLCBleHByZXNzaW9ucykge1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhZGRFeHByKGRvbSwgdmFsLCBleHRyYSkge1xyXG4gICAgICAgICAgICBpZiAodG1wbC5oYXNFeHByKHZhbCkpIHtcclxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zLnB1c2goZXh0ZW5kKHsgZG9tOiBkb20sIGV4cHI6IHZhbCB9LCBleHRyYSkpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHdhbGsocm9vdCwgZnVuY3Rpb24oZG9tKSB7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gZG9tLm5vZGVUeXBlLFxyXG4gICAgICAgICAgICAgICAgYXR0clxyXG5cclxuICAgICAgICAgICAgLy8gdGV4dCBub2RlXHJcbiAgICAgICAgICAgIGlmICh0eXBlID09IDMgJiYgZG9tLnBhcmVudE5vZGUudGFnTmFtZSAhPSAnU1RZTEUnKSBhZGRFeHByKGRvbSwgZG9tLm5vZGVWYWx1ZSlcclxuICAgICAgICAgICAgaWYgKHR5cGUgIT0gMSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICAvKiBlbGVtZW50ICovXHJcblxyXG4gICAgICAgICAgICAvLyBsb29wXHJcbiAgICAgICAgICAgIGF0dHIgPSBnZXRBdHRyKGRvbSwgJ2VhY2gnKVxyXG5cclxuICAgICAgICAgICAgaWYgKGF0dHIpIHsgX2VhY2goZG9tLCB0YWcsIGF0dHIpOyByZXR1cm4gZmFsc2UgfVxyXG5cclxuICAgICAgICAgICAgLy8gYXR0cmlidXRlIGV4cHJlc3Npb25zXHJcbiAgICAgICAgICAgIGVhY2goZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcclxuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gYXR0ci5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgIGJvb2wgPSBuYW1lLnNwbGl0KCdfXycpWzFdXHJcblxyXG4gICAgICAgICAgICAgICAgYWRkRXhwcihkb20sIGF0dHIudmFsdWUsIHsgYXR0cjogYm9vbCB8fCBuYW1lLCBib29sOiBib29sIH0pXHJcbiAgICAgICAgICAgICAgICBpZiAoYm9vbCkgeyByZW1BdHRyKGRvbSwgbmFtZSk7IHJldHVybiBmYWxzZSB9XHJcblxyXG4gICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgLy8gc2tpcCBjdXN0b20gdGFnc1xyXG4gICAgICAgICAgICBpZiAoZ2V0VGFnKGRvbSkpIHJldHVybiBmYWxzZVxyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuICAgIGZ1bmN0aW9uIFRhZyhpbXBsLCBjb25mLCBpbm5lckhUTUwpIHtcclxuXHJcbiAgICAgICAgdmFyIHNlbGYgPSByaW90Lm9ic2VydmFibGUodGhpcyksXHJcbiAgICAgICAgICAgIG9wdHMgPSBpbmhlcml0KGNvbmYub3B0cykgfHwge30sXHJcbiAgICAgICAgICAgIHBhcmVudCA9IGNvbmYucGFyZW50LFxyXG4gICAgICAgICAgICBpc0xvb3AgPSBjb25mLmlzTG9vcCxcclxuICAgICAgICAgICAgaGFzSW1wbCA9IGNvbmYuaGFzSW1wbCxcclxuICAgICAgICAgICAgaXRlbSA9IGNsZWFuVXBEYXRhKGNvbmYuaXRlbSksXHJcbiAgICAgICAgICAgIGV4cHJlc3Npb25zID0gW10sXHJcbiAgICAgICAgICAgIGNoaWxkVGFncyA9IFtdLFxyXG4gICAgICAgICAgICByb290ID0gY29uZi5yb290LFxyXG4gICAgICAgICAgICBmbiA9IGltcGwuZm4sXHJcbiAgICAgICAgICAgIHRhZ05hbWUgPSByb290LnRhZ05hbWUudG9Mb3dlckNhc2UoKSxcclxuICAgICAgICAgICAgYXR0ciA9IHt9LFxyXG4gICAgICAgICAgICBwcm9wc0luU3luY1dpdGhQYXJlbnQgPSBbXSxcclxuICAgICAgICAgICAgZG9tXHJcblxyXG4gICAgICAgIGlmIChmbiAmJiByb290Ll90YWcpIHJvb3QuX3RhZy51bm1vdW50KHRydWUpXHJcblxyXG4gICAgICAgIC8vIG5vdCB5ZXQgbW91bnRlZFxyXG4gICAgICAgIHRoaXMuaXNNb3VudGVkID0gZmFsc2VcclxuICAgICAgICByb290LmlzTG9vcCA9IGlzTG9vcFxyXG5cclxuICAgICAgICAvLyBrZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSB0YWcganVzdCBjcmVhdGVkXHJcbiAgICAgICAgLy8gc28gd2Ugd2lsbCBiZSBhYmxlIHRvIG1vdW50IHRoaXMgdGFnIG11bHRpcGxlIHRpbWVzXHJcbiAgICAgICAgcm9vdC5fdGFnID0gdGhpc1xyXG5cclxuICAgICAgICAvLyBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gdGhpcyB0YWdcclxuICAgICAgICAvLyBpdCBjb3VsZCBiZSBoYW5keSB0byB1c2UgaXQgYWxzbyB0byBpbXByb3ZlIHRoZSB2aXJ0dWFsIGRvbSByZW5kZXJpbmcgc3BlZWRcclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX3Jpb3RfaWQnLCArK19fdWlkKSAvLyBiYXNlIDEgYWxsb3dzIHRlc3QgIXQuX3Jpb3RfaWRcclxuXHJcbiAgICAgICAgZXh0ZW5kKHRoaXMsIHsgcGFyZW50OiBwYXJlbnQsIHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMsIHRhZ3M6IHt9IH0sIGl0ZW0pXHJcblxyXG4gICAgICAgIC8vIGdyYWIgYXR0cmlidXRlc1xyXG4gICAgICAgIGVhY2gocm9vdC5hdHRyaWJ1dGVzLCBmdW5jdGlvbihlbCkge1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gZWwudmFsdWVcclxuICAgICAgICAgICAgLy8gcmVtZW1iZXIgYXR0cmlidXRlcyB3aXRoIGV4cHJlc3Npb25zIG9ubHlcclxuICAgICAgICAgICAgaWYgKHRtcGwuaGFzRXhwcih2YWwpKSBhdHRyW2VsLm5hbWVdID0gdmFsXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgZG9tID0gbWtkb20oaW1wbC50bXBsLCBpbm5lckhUTUwpXHJcblxyXG4gICAgICAgIC8vIG9wdGlvbnNcclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVPcHRzKCkge1xyXG4gICAgICAgICAgICB2YXIgY3R4ID0gaGFzSW1wbCAmJiBpc0xvb3AgPyBzZWxmIDogcGFyZW50IHx8IHNlbGZcclxuXHJcbiAgICAgICAgICAgIC8vIHVwZGF0ZSBvcHRzIGZyb20gY3VycmVudCBET00gYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBlYWNoKHJvb3QuYXR0cmlidXRlcywgZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWwgPSBlbC52YWx1ZVxyXG4gICAgICAgICAgICAgICAgb3B0c1t0b0NhbWVsKGVsLm5hbWUpXSA9IHRtcGwuaGFzRXhwcih2YWwpID8gdG1wbCh2YWwsIGN0eCkgOiB2YWxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLy8gcmVjb3ZlciB0aG9zZSB3aXRoIGV4cHJlc3Npb25zXHJcbiAgICAgICAgICAgIGVhY2goT2JqZWN0LmtleXMoYXR0ciksIGZ1bmN0aW9uKG5hbWUpIHtcclxuICAgICAgICAgICAgICAgIG9wdHNbdG9DYW1lbChuYW1lKV0gPSB0bXBsKGF0dHJbbmFtZV0sIGN0eClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZURhdGEoZGF0YSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzZWxmW2tleV0gIT09IFRfVU5ERUYgJiYgaXNXcml0YWJsZShzZWxmLCBrZXkpKVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGZba2V5XSA9IGRhdGFba2V5XVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpbmhlcml0RnJvbVBhcmVudCAoKSB7XHJcbiAgICAgICAgICAgIGlmICghc2VsZi5wYXJlbnQgfHwgIWlzTG9vcCkgcmV0dXJuXHJcbiAgICAgICAgICAgIGVhY2goT2JqZWN0LmtleXMoc2VsZi5wYXJlbnQpLCBmdW5jdGlvbihrKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBzb21lIHByb3BlcnRpZXMgbXVzdCBiZSBhbHdheXMgaW4gc3luYyB3aXRoIHRoZSBwYXJlbnQgdGFnXHJcbiAgICAgICAgICAgICAgICB2YXIgbXVzdFN5bmMgPSAhY29udGFpbnMoUkVTRVJWRURfV09SRFNfQkxBQ0tMSVNULCBrKSAmJiBjb250YWlucyhwcm9wc0luU3luY1dpdGhQYXJlbnQsIGspXHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNlbGZba10gPT09IFRfVU5ERUYgfHwgbXVzdFN5bmMpIHtcclxuICAgICAgICAgICAgICAgICAgICAvLyB0cmFjayB0aGUgcHJvcGVydHkgdG8ga2VlcCBpbiBzeW5jXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc28gd2UgY2FuIGtlZXAgaXQgdXBkYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbXVzdFN5bmMpIHByb3BzSW5TeW5jV2l0aFBhcmVudC5wdXNoKGspXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZltrXSA9IHNlbGYucGFyZW50W2tdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAndXBkYXRlJywgZnVuY3Rpb24oZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSBkYXRhIHBhc3NlZCB3aWxsIG5vdCBvdmVycmlkZVxyXG4gICAgICAgICAgICAvLyB0aGUgY29tcG9uZW50IGNvcmUgbWV0aG9kc1xyXG4gICAgICAgICAgICBkYXRhID0gY2xlYW5VcERhdGEoZGF0YSlcclxuICAgICAgICAgICAgLy8gaW5oZXJpdCBwcm9wZXJ0aWVzIGZyb20gdGhlIHBhcmVudFxyXG4gICAgICAgICAgICBpbmhlcml0RnJvbVBhcmVudCgpXHJcbiAgICAgICAgICAgIC8vIG5vcm1hbGl6ZSB0aGUgdGFnIHByb3BlcnRpZXMgaW4gY2FzZSBhbiBpdGVtIG9iamVjdCB3YXMgaW5pdGlhbGx5IHBhc3NlZFxyXG4gICAgICAgICAgICBpZiAoZGF0YSAmJiB0eXBlb2YgaXRlbSA9PT0gVF9PQkpFQ1QpIHtcclxuICAgICAgICAgICAgICAgIG5vcm1hbGl6ZURhdGEoZGF0YSlcclxuICAgICAgICAgICAgICAgIGl0ZW0gPSBkYXRhXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXh0ZW5kKHNlbGYsIGRhdGEpXHJcbiAgICAgICAgICAgIHVwZGF0ZU9wdHMoKVxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3VwZGF0ZScsIGRhdGEpXHJcbiAgICAgICAgICAgIHVwZGF0ZShleHByZXNzaW9ucywgc2VsZilcclxuICAgICAgICAgICAgLy8gdGhlIHVwZGF0ZWQgZXZlbnQgd2lsbCBiZSB0cmlnZ2VyZWRcclxuICAgICAgICAgICAgLy8gb25jZSB0aGUgRE9NIHdpbGwgYmUgcmVhZHkgYW5kIGFsbCB0aGUgcmVmbG93cyBhcmUgY29tcGxldGVkXHJcbiAgICAgICAgICAgIC8vIHRoaXMgaXMgdXNlZnVsIGlmIHlvdSB3YW50IHRvIGdldCB0aGUgXCJyZWFsXCIgcm9vdCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgICAgIC8vIDQgZXg6IHJvb3Qub2Zmc2V0V2lkdGggLi4uXHJcbiAgICAgICAgICAgIHJBRihmdW5jdGlvbigpIHsgc2VsZi50cmlnZ2VyKCd1cGRhdGVkJykgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWl4aW4nLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgZWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKG1peCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGluc3RhbmNlXHJcblxyXG4gICAgICAgICAgICAgICAgbWl4ID0gdHlwZW9mIG1peCA9PT0gVF9TVFJJTkcgPyByaW90Lm1peGluKG1peCkgOiBtaXhcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgbWl4aW4gaXMgYSBmdW5jdGlvblxyXG4gICAgICAgICAgICAgICAgaWYgKGlzRnVuY3Rpb24obWl4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNyZWF0ZSB0aGUgbmV3IG1peGluIGluc3RhbmNlXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UgPSBuZXcgbWl4KClcclxuICAgICAgICAgICAgICAgICAgICAvLyBzYXZlIHRoZSBwcm90b3R5cGUgdG8gbG9vcCBpdCBhZnRlcndhcmRzXHJcbiAgICAgICAgICAgICAgICAgICAgbWl4ID0gbWl4LnByb3RvdHlwZVxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGluc3RhbmNlID0gbWl4XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gbG9vcCB0aGUga2V5cyBpbiB0aGUgZnVuY3Rpb24gcHJvdG90eXBlIG9yIHRoZSBhbGwgb2JqZWN0IGtleXNcclxuICAgICAgICAgICAgICAgIGVhY2goT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMobWl4KSwgZnVuY3Rpb24oa2V5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmluZCBtZXRob2RzIHRvIHNlbGZcclxuICAgICAgICAgICAgICAgICAgICBpZiAoa2V5ICE9ICdpbml0JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZltrZXldID0gaXNGdW5jdGlvbihpbnN0YW5jZVtrZXldKSA/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVtrZXldLmJpbmQoc2VsZikgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2Vba2V5XVxyXG4gICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpbml0IG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBhdXRvbWF0aWNhbGx5XHJcbiAgICAgICAgICAgICAgICBpZiAoaW5zdGFuY2UuaW5pdCkgaW5zdGFuY2UuaW5pdC5iaW5kKHNlbGYpKClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbW91bnQnLCBhc3luYyBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHVwZGF0ZU9wdHMoKVxyXG5cclxuICAgICAgICAgICAgLy8gaW5pdGlhbGlhdGlvblxyXG4gICAgICAgICAgICBpZiAoZm4pIHtcclxuICAgICAgICAgICAgICAgIGxldCByZXQgPSBmbi5jYWxsKHNlbGYsIG9wdHMpXHJcbiAgICAgICAgICAgICAgICBpZiAocmV0ICYmIHJldC50aGVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZuID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJldFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBhd2FpdCBmbigpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHBhcnNlIGxheW91dCBhZnRlciBpbml0LiBmbiBtYXkgY2FsY3VsYXRlIGFyZ3MgZm9yIG5lc3RlZCBjdXN0b20gdGFnc1xyXG4gICAgICAgICAgICBwYXJzZUV4cHJlc3Npb25zKGRvbSwgc2VsZiwgZXhwcmVzc2lvbnMpXHJcblxyXG4gICAgICAgICAgICAvLyBtb3VudCB0aGUgY2hpbGQgdGFnc1xyXG4gICAgICAgICAgICB0b2dnbGUodHJ1ZSlcclxuXHJcbiAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgcm9vdCBhZGRpbmcgY3VzdG9tIGF0dHJpYnV0ZXMgY29taW5nIGZyb20gdGhlIGNvbXBpbGVyXHJcbiAgICAgICAgICAgIC8vIGl0IGZpeGVzIGFsc28gIzEwODdcclxuICAgICAgICAgICAgaWYgKGltcGwuYXR0cnMgfHwgaGFzSW1wbCkge1xyXG4gICAgICAgICAgICAgICAgd2Fsa0F0dHJpYnV0ZXMoaW1wbC5hdHRycywgZnVuY3Rpb24gKGssIHYpIHsgc2V0QXR0cihyb290LCBrLCB2KSB9KVxyXG4gICAgICAgICAgICAgICAgcGFyc2VFeHByZXNzaW9ucyhzZWxmLnJvb3QsIHNlbGYsIGV4cHJlc3Npb25zKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIXNlbGYucGFyZW50IHx8IGlzTG9vcCkgc2VsZi51cGRhdGUoaXRlbSlcclxuXHJcbiAgICAgICAgICAgIC8vIGludGVybmFsIHVzZSBvbmx5LCBmaXhlcyAjNDAzXHJcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlcignYmVmb3JlLW1vdW50JylcclxuXHJcbiAgICAgICAgICAgIGlmIChpc0xvb3AgJiYgIWhhc0ltcGwpIHtcclxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgcm9vdCBhdHRyaWJ1dGUgZm9yIHRoZSBsb29wZWQgZWxlbWVudHNcclxuICAgICAgICAgICAgICAgIHNlbGYucm9vdCA9IHJvb3QgPSBkb20uZmlyc3RDaGlsZFxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkgcm9vdC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZClcclxuICAgICAgICAgICAgICAgIGlmIChyb290LnN0dWIpIHNlbGYucm9vdCA9IHJvb3QgPSBwYXJlbnQucm9vdFxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBwYXJzZSB0aGUgbmFtZWQgZG9tIG5vZGVzIGluIHRoZSBsb29wZWQgY2hpbGRcclxuICAgICAgICAgICAgLy8gYWRkaW5nIHRoZW0gdG8gdGhlIHBhcmVudCBhcyB3ZWxsXHJcbiAgICAgICAgICAgIGlmIChpc0xvb3ApXHJcbiAgICAgICAgICAgICAgICBwYXJzZU5hbWVkRWxlbWVudHMoc2VsZi5yb290LCBzZWxmLnBhcmVudCwgbnVsbCwgdHJ1ZSlcclxuXHJcbiAgICAgICAgICAgIC8vIGlmIGl0J3Mgbm90IGEgY2hpbGQgdGFnIHdlIGNhbiB0cmlnZ2VyIGl0cyBtb3VudCBldmVudFxyXG4gICAgICAgICAgICBpZiAoIXNlbGYucGFyZW50IHx8IHNlbGYucGFyZW50LmlzTW91bnRlZCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5pc01vdW50ZWQgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uKCdtb3VudCcsIHNlbGYudXBkYXRlKVxyXG4gICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdtb3VudCcpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIG5lZWQgdG8gd2FpdCB0aGF0IHRoZSBwYXJlbnQgZXZlbnQgZ2V0cyB0cmlnZ2VyZWRcclxuICAgICAgICAgICAgZWxzZSBzZWxmLnBhcmVudC5vbmUoJ21vdW50JywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhdm9pZCB0byB0cmlnZ2VyIHRoZSBgbW91bnRgIGV2ZW50IGZvciB0aGUgdGFnc1xyXG4gICAgICAgICAgICAgICAgLy8gbm90IHZpc2libGUgaW5jbHVkZWQgaW4gYW4gaWYgc3RhdGVtZW50XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzSW5TdHViKHNlbGYucm9vdCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnBhcmVudC5pc01vdW50ZWQgPSBzZWxmLmlzTW91bnRlZCA9IHRydWVcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uKCdtb3VudCcsIHNlbGYudXBkYXRlKVxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudHJpZ2dlcignbW91bnQnKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICBkZWZpbmVQcm9wZXJ0eSh0aGlzLCAndW5tb3VudCcsIGZ1bmN0aW9uKGtlZXBSb290VGFnKSB7XHJcbiAgICAgICAgICAgIHZhciBlbCA9IHJvb3QsXHJcbiAgICAgICAgICAgICAgICBwID0gZWwucGFyZW50Tm9kZSxcclxuICAgICAgICAgICAgICAgIHB0YWcsXHJcbiAgICAgICAgICAgICAgICB0YWdJbmRleCA9IF9fdmlydHVhbERvbS5pbmRleE9mKHNlbGYpXHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2JlZm9yZS11bm1vdW50JylcclxuXHJcbiAgICAgICAgICAgIC8vIHJlbW92ZSB0aGlzIHRhZyBpbnN0YW5jZSBmcm9tIHRoZSBnbG9iYWwgdmlydHVhbERvbSB2YXJpYWJsZVxyXG4gICAgICAgICAgICBpZiAofnRhZ0luZGV4KVxyXG4gICAgICAgICAgICAgICAgX192aXJ0dWFsRG9tLnNwbGljZSh0YWdJbmRleCwgMSlcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLl92aXJ0cykge1xyXG4gICAgICAgICAgICAgICAgZWFjaCh0aGlzLl92aXJ0cywgZnVuY3Rpb24odikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2LnBhcmVudE5vZGUpIHYucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh2KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocGFyZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHRhZyA9IGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyhwYXJlbnQpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoaXMgdGFnIGZyb20gdGhlIHBhcmVudCB0YWdzIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZXJlIGFyZSBtdWx0aXBsZSBuZXN0ZWQgdGFncyB3aXRoIHNhbWUgbmFtZS4uXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoaXMgZWxlbWVudCBmb3JtIHRoZSBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KHB0YWcudGFnc1t0YWdOYW1lXSkpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhY2gocHRhZy50YWdzW3RhZ05hbWVdLCBmdW5jdGlvbih0YWcsIGkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0YWcuX3Jpb3RfaWQgPT0gc2VsZi5fcmlvdF9pZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwdGFnLnRhZ3NbdGFnTmFtZV0uc3BsaWNlKGksIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBqdXN0IGRlbGV0ZSB0aGUgdGFnIGluc3RhbmNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHB0YWcudGFnc1t0YWdOYW1lXSA9IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoZWwuZmlyc3RDaGlsZCkgZWwucmVtb3ZlQ2hpbGQoZWwuZmlyc3RDaGlsZClcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIWtlZXBSb290VGFnKVxyXG4gICAgICAgICAgICAgICAgICAgIHAucmVtb3ZlQ2hpbGQoZWwpXHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAvLyB0aGUgcmlvdC10YWcgYXR0cmlidXRlIGlzbid0IG5lZWRlZCBhbnltb3JlLCByZW1vdmUgaXRcclxuICAgICAgICAgICAgICAgICAgICByZW1BdHRyKHAsICdyaW90LXRhZycpXHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ3VubW91bnQnKVxyXG4gICAgICAgICAgICB0b2dnbGUoKVxyXG4gICAgICAgICAgICBzZWxmLm9mZignKicpXHJcbiAgICAgICAgICAgIHNlbGYuaXNNb3VudGVkID0gZmFsc2VcclxuICAgICAgICAgICAgZGVsZXRlIHJvb3QuX3RhZ1xyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB0b2dnbGUoaXNNb3VudCkge1xyXG5cclxuICAgICAgICAgICAgLy8gbW91bnQvdW5tb3VudCBjaGlsZHJlblxyXG4gICAgICAgICAgICBlYWNoKGNoaWxkVGFncywgZnVuY3Rpb24oY2hpbGQpIHsgY2hpbGRbaXNNb3VudCA/ICdtb3VudCcgOiAndW5tb3VudCddKCkgfSlcclxuXHJcbiAgICAgICAgICAgIC8vIGxpc3Rlbi91bmxpc3RlbiBwYXJlbnQgKGV2ZW50cyBmbG93IG9uZSB3YXkgZnJvbSBwYXJlbnQgdG8gY2hpbGRyZW4pXHJcbiAgICAgICAgICAgIGlmICghcGFyZW50KSByZXR1cm5cclxuICAgICAgICAgICAgdmFyIGV2dCA9IGlzTW91bnQgPyAnb24nIDogJ29mZidcclxuXHJcbiAgICAgICAgICAgIC8vIHRoZSBsb29wIHRhZ3Mgd2lsbCBiZSBhbHdheXMgaW4gc3luYyB3aXRoIHRoZSBwYXJlbnQgYXV0b21hdGljYWxseVxyXG4gICAgICAgICAgICBpZiAoaXNMb29wKVxyXG4gICAgICAgICAgICAgICAgcGFyZW50W2V2dF0oJ3VubW91bnQnLCBzZWxmLnVubW91bnQpXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHBhcmVudFtldnRdKCd1cGRhdGUnLCBzZWxmLnVwZGF0ZSlbZXZ0XSgndW5tb3VudCcsIHNlbGYudW5tb3VudClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIG5hbWVkIGVsZW1lbnRzIGF2YWlsYWJsZSBmb3IgZm5cclxuICAgICAgICBwYXJzZU5hbWVkRWxlbWVudHMoZG9tLCB0aGlzLCBjaGlsZFRhZ3MpXHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBBdHRhY2ggYW4gZXZlbnQgdG8gYSBET00gbm9kZVxyXG4gICAgICogQHBhcmFtIHsgU3RyaW5nIH0gbmFtZSAtIGV2ZW50IG5hbWVcclxuICAgICAqIEBwYXJhbSB7IEZ1bmN0aW9uIH0gaGFuZGxlciAtIGV2ZW50IGNhbGxiYWNrXHJcbiAgICAgKiBAcGFyYW0geyBPYmplY3QgfSBkb20gLSBkb20gbm9kZVxyXG4gICAgICogQHBhcmFtIHsgVGFnIH0gdGFnIC0gdGFnIGluc3RhbmNlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldEV2ZW50SGFuZGxlcihuYW1lLCBoYW5kbGVyLCBkb20sIHRhZykge1xyXG5cclxuICAgICAgICBkb21bbmFtZV0gPSBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcHRhZyA9IHRhZy5fcGFyZW50LFxyXG4gICAgICAgICAgICAgICAgaXRlbSA9IHRhZy5faXRlbSxcclxuICAgICAgICAgICAgICAgIGVsXHJcblxyXG4gICAgICAgICAgICBpZiAoIWl0ZW0pXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAocHRhZyAmJiAhaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0gPSBwdGFnLl9pdGVtXHJcbiAgICAgICAgICAgICAgICAgICAgcHRhZyA9IHB0YWcuX3BhcmVudFxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gY3Jvc3MgYnJvd3NlciBldmVudCBmaXhcclxuICAgICAgICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XHJcblxyXG4gICAgICAgICAgICAvLyBvdmVycmlkZSB0aGUgZXZlbnQgcHJvcGVydGllc1xyXG4gICAgICAgICAgICBpZiAoaXNXcml0YWJsZShlLCAnY3VycmVudFRhcmdldCcpKSBlLmN1cnJlbnRUYXJnZXQgPSBkb21cclxuICAgICAgICAgICAgaWYgKGlzV3JpdGFibGUoZSwgJ3RhcmdldCcpKSBlLnRhcmdldCA9IGUuc3JjRWxlbWVudFxyXG4gICAgICAgICAgICBpZiAoaXNXcml0YWJsZShlLCAnd2hpY2gnKSkgZS53aGljaCA9IGUuY2hhckNvZGUgfHwgZS5rZXlDb2RlXHJcblxyXG4gICAgICAgICAgICBlLml0ZW0gPSBpdGVtXHJcblxyXG4gICAgICAgICAgICAvLyBwcmV2ZW50IGRlZmF1bHQgYmVoYXZpb3VyIChieSBkZWZhdWx0KVxyXG4gICAgICAgICAgICBpZiAoaGFuZGxlci5jYWxsKHRhZywgZSkgIT09IHRydWUgJiYgIS9yYWRpb3xjaGVjay8udGVzdChkb20udHlwZSkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSBlLnByZXZlbnREZWZhdWx0KClcclxuICAgICAgICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWUucHJldmVudFVwZGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgZWwgPSBpdGVtID8gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHB0YWcpIDogdGFnXHJcbiAgICAgICAgICAgICAgICBlbC51cGRhdGUoKVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5zZXJ0IGEgRE9NIG5vZGUgcmVwbGFjaW5nIGFub3RoZXIgb25lICh1c2VkIGJ5IGlmLSBhdHRyaWJ1dGUpXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IHJvb3QgLSBwYXJlbnQgbm9kZVxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBub2RlIC0gbm9kZSByZXBsYWNlZFxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBiZWZvcmUgLSBub2RlIGFkZGVkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGluc2VydFRvKHJvb3QsIG5vZGUsIGJlZm9yZSkge1xyXG4gICAgICAgIGlmICghcm9vdCkgcmV0dXJuXHJcbiAgICAgICAgcm9vdC5pbnNlcnRCZWZvcmUoYmVmb3JlLCBub2RlKVxyXG4gICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQobm9kZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFVwZGF0ZSB0aGUgZXhwcmVzc2lvbnMgaW4gYSBUYWcgaW5zdGFuY2VcclxuICAgICAqIEBwYXJhbSAgIHsgQXJyYXkgfSBleHByZXNzaW9ucyAtIGV4cHJlc3Npb24gdGhhdCBtdXN0IGJlIHJlIGV2YWx1YXRlZFxyXG4gICAgICogQHBhcmFtICAgeyBUYWcgfSB0YWcgLSB0YWcgaW5zdGFuY2VcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gdXBkYXRlKGV4cHJlc3Npb25zLCB0YWcpIHtcclxuXHJcbiAgICAgICAgZWFjaChleHByZXNzaW9ucywgZnVuY3Rpb24oZXhwciwgaSkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGRvbSA9IGV4cHIuZG9tLFxyXG4gICAgICAgICAgICAgICAgYXR0ck5hbWUgPSBleHByLmF0dHIsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRtcGwoZXhwci5leHByLCB0YWcpLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50ID0gZXhwci5kb20ucGFyZW50Tm9kZVxyXG5cclxuICAgICAgICAgICAgaWYgKGV4cHIuYm9vbClcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgPyBhdHRyTmFtZSA6IGZhbHNlXHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHZhbHVlID09IG51bGwpXHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9ICcnXHJcblxyXG4gICAgICAgICAgICAvLyBsZWF2ZSBvdXQgcmlvdC0gcHJlZml4ZXMgZnJvbSBzdHJpbmdzIGluc2lkZSB0ZXh0YXJlYVxyXG4gICAgICAgICAgICAvLyBmaXggIzgxNTogYW55IHZhbHVlIC0+IHN0cmluZ1xyXG4gICAgICAgICAgICBpZiAocGFyZW50ICYmIHBhcmVudC50YWdOYW1lID09ICdURVhUQVJFQScpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gKCcnICsgdmFsdWUpLnJlcGxhY2UoL3Jpb3QtL2csICcnKVxyXG4gICAgICAgICAgICAgICAgLy8gY2hhbmdlIHRleHRhcmVhJ3MgdmFsdWVcclxuICAgICAgICAgICAgICAgIHBhcmVudC52YWx1ZSA9IHZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIG5vIGNoYW5nZVxyXG4gICAgICAgICAgICBpZiAoZXhwci52YWx1ZSA9PT0gdmFsdWUpIHJldHVyblxyXG4gICAgICAgICAgICBleHByLnZhbHVlID0gdmFsdWVcclxuXHJcbiAgICAgICAgICAgIC8vIHRleHQgbm9kZVxyXG4gICAgICAgICAgICBpZiAoIWF0dHJOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBkb20ubm9kZVZhbHVlID0gJycgKyB2YWx1ZSAgICAvLyAjODE1IHJlbGF0ZWRcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyByZW1vdmUgb3JpZ2luYWwgYXR0cmlidXRlXHJcbiAgICAgICAgICAgIHJlbUF0dHIoZG9tLCBhdHRyTmFtZSlcclxuICAgICAgICAgICAgLy8gZXZlbnQgaGFuZGxlclxyXG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHNldEV2ZW50SGFuZGxlcihhdHRyTmFtZSwgdmFsdWUsIGRvbSwgdGFnKVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGlmLSBjb25kaXRpb25hbFxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09ICdpZicpIHtcclxuICAgICAgICAgICAgICAgIHZhciBzdHViID0gZXhwci5zdHViLFxyXG4gICAgICAgICAgICAgICAgICAgIGFkZCA9IGZ1bmN0aW9uKCkgeyBpbnNlcnRUbyhzdHViLnBhcmVudE5vZGUsIHN0dWIsIGRvbSkgfSxcclxuICAgICAgICAgICAgICAgICAgICByZW1vdmUgPSBmdW5jdGlvbigpIHsgaW5zZXJ0VG8oZG9tLnBhcmVudE5vZGUsIGRvbSwgc3R1YikgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIGFkZCB0byBET01cclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzdHViKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZCgpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbS5pblN0dWIgPSBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhdm9pZCB0byB0cmlnZ2VyIHRoZSBtb3VudCBldmVudCBpZiB0aGUgdGFncyBpcyBub3QgdmlzaWJsZSB5ZXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWF5YmUgd2UgY2FuIG9wdGltaXplIHRoaXMgYXZvaWRpbmcgdG8gbW91bnQgdGhlIHRhZyBhdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0luU3R1Yihkb20pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3YWxrKGRvbSwgZnVuY3Rpb24oZWwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWwuX3RhZyAmJiAhZWwuX3RhZy5pc01vdW50ZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsLl90YWcuaXNNb3VudGVkID0gISFlbC5fdGFnLnRyaWdnZXIoJ21vdW50JylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGZyb20gRE9NXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0dWIgPSBleHByLnN0dWIgPSBzdHViIHx8IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBwYXJlbnROb2RlIGlzIGRlZmluZWQgd2UgY2FuIGVhc2lseSByZXBsYWNlIHRoZSB0YWdcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIG5lZWQgdG8gd2FpdCB0aGUgdXBkYXRlZCBldmVudFxyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgKHRhZy5wYXJlbnQgfHwgdGFnKS5vbmUoJ3VwZGF0ZWQnLCByZW1vdmUpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGRvbS5pblN0dWIgPSB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBzaG93IC8gaGlkZVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9eKHNob3d8aGlkZSkkLy50ZXN0KGF0dHJOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0dHJOYW1lID09ICdoaWRlJykgdmFsdWUgPSAhdmFsdWVcclxuICAgICAgICAgICAgICAgIGRvbS5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJ1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGZpZWxkIHZhbHVlXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT0gJ3ZhbHVlJykge1xyXG4gICAgICAgICAgICAgICAgZG9tLnZhbHVlID0gdmFsdWVcclxuXHJcbiAgICAgICAgICAgICAgICAvLyA8aW1nIHNyYz1cInsgZXhwciB9XCI+XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnRzV2l0aChhdHRyTmFtZSwgUklPVF9QUkVGSVgpICYmIGF0dHJOYW1lICE9IFJJT1RfVEFHKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUpXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0QXR0cihkb20sIGF0dHJOYW1lLnNsaWNlKFJJT1RfUFJFRklYLmxlbmd0aCksIHZhbHVlKVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChleHByLmJvb2wpIHtcclxuICAgICAgICAgICAgICAgICAgICBkb21bYXR0ck5hbWVdID0gdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPT09IDAgfHwgdmFsdWUgJiYgdHlwZW9mIHZhbHVlICE9PSBUX09CSkVDVClcclxuICAgICAgICAgICAgICAgICAgICBzZXRBdHRyKGRvbSwgYXR0ck5hbWUsIHZhbHVlKVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KVxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogU3BlY2lhbGl6ZWQgZnVuY3Rpb24gZm9yIGxvb3BpbmcgYW4gYXJyYXktbGlrZSBjb2xsZWN0aW9uIHdpdGggYGVhY2g9e31gXHJcbiAgICAgKiBAcGFyYW0gICB7IEFycmF5IH0gZWxzIC0gY29sbGVjdGlvbiBvZiBpdGVtc1xyXG4gICAgICogQHBhcmFtICAge0Z1bmN0aW9ufSBmbiAtIGNhbGxiYWNrIGZ1bmN0aW9uXHJcbiAgICAgKiBAcmV0dXJucyB7IEFycmF5IH0gdGhlIGFycmF5IGxvb3BlZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBlYWNoKGVscywgZm4pIHtcclxuICAgICAgICB2YXIgbGVuID0gZWxzID8gZWxzLmxlbmd0aCA6IDBcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGVsOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICAgICAgZWwgPSBlbHNbaV1cclxuICAgICAgICAgICAgLy8gcmV0dXJuIGZhbHNlIC0+IGN1cnJlbnQgaXRlbSB3YXMgcmVtb3ZlZCBieSBmbiBkdXJpbmcgdGhlIGxvb3BcclxuICAgICAgICAgICAgaWYgKGVsICE9IG51bGwgJiYgZm4oZWwsIGkpID09PSBmYWxzZSkgaS0tXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBlbHNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIERldGVjdCBpZiB0aGUgYXJndW1lbnQgcGFzc2VkIGlzIGEgZnVuY3Rpb25cclxuICAgICAqIEBwYXJhbSAgIHsgKiB9IHYgLSB3aGF0ZXZlciB5b3Ugd2FudCB0byBwYXNzIHRvIHRoaXMgZnVuY3Rpb25cclxuICAgICAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaXNGdW5jdGlvbih2KSB7XHJcbiAgICAgICAgcmV0dXJuIHR5cGVvZiB2ID09PSBUX0ZVTkNUSU9OIHx8IGZhbHNlICAgLy8gYXZvaWQgSUUgcHJvYmxlbXNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhbnkgRE9NIGF0dHJpYnV0ZSBmcm9tIGEgbm9kZVxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHVwZGF0ZVxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byByZW1vdmVcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gcmVtQXR0cihkb20sIG5hbWUpIHtcclxuICAgICAgICBkb20ucmVtb3ZlQXR0cmlidXRlKG5hbWUpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb252ZXJ0IGEgc3RyaW5nIGNvbnRhaW5pbmcgZGFzaGVzIHRvIGNhbWVsIGNhc2VcclxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc3RyaW5nIC0gaW5wdXQgc3RyaW5nXHJcbiAgICAgKiBAcmV0dXJucyB7IFN0cmluZyB9IG15LXN0cmluZyAtPiBteVN0cmluZ1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB0b0NhbWVsKHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvLShcXHcpL2csIGZ1bmN0aW9uKF8sIGMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGMudG9VcHBlckNhc2UoKVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHZhbHVlIG9mIGFueSBET00gYXR0cmlidXRlIG9uIGEgbm9kZVxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHBhcnNlXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IG5hbWUgLSBuYW1lIG9mIHRoZSBhdHRyaWJ1dGUgd2Ugd2FudCB0byBnZXRcclxuICAgICAqIEByZXR1cm5zIHsgU3RyaW5nIHwgdW5kZWZpbmVkIH0gbmFtZSBvZiB0aGUgbm9kZSBhdHRyaWJ1dGUgd2hldGhlciBpdCBleGlzdHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gZ2V0QXR0cihkb20sIG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gZG9tLmdldEF0dHJpYnV0ZShuYW1lKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGFueSBET00gYXR0cmlidXRlXHJcbiAgICAgKiBAcGFyYW0geyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHVwZGF0ZVxyXG4gICAgICogQHBhcmFtIHsgU3RyaW5nIH0gbmFtZSAtIG5hbWUgb2YgdGhlIHByb3BlcnR5IHdlIHdhbnQgdG8gc2V0XHJcbiAgICAgKiBAcGFyYW0geyBTdHJpbmcgfSB2YWwgLSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byBzZXRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gc2V0QXR0cihkb20sIG5hbWUsIHZhbCkge1xyXG4gICAgICAgIGRvbS5zZXRBdHRyaWJ1dGUobmFtZSwgdmFsKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZWN0IHRoZSB0YWcgaW1wbGVtZW50YXRpb24gYnkgYSBET00gbm9kZVxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIHBhcnNlIHRvIGdldCBpdHMgdGFnIGltcGxlbWVudGF0aW9uXHJcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGl0IHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGltcGxlbWVudGF0aW9uIG9mIGEgY3VzdG9tIHRhZyAodGVtcGxhdGUgYW5kIGJvb3QgZnVuY3Rpb24pXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldFRhZyhkb20pIHtcclxuICAgICAgICByZXR1cm4gZG9tLnRhZ05hbWUgJiYgX190YWdJbXBsW2dldEF0dHIoZG9tLCBSSU9UX1RBRykgfHwgZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKV1cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgY2hpbGQgdGFnIHRvIGl0cyBwYXJlbnQgaW50byB0aGUgYHRhZ3NgIG9iamVjdFxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSB0YWcgLSBjaGlsZCB0YWcgaW5zdGFuY2VcclxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdGFnTmFtZSAtIGtleSB3aGVyZSB0aGUgbmV3IHRhZyB3aWxsIGJlIHN0b3JlZFxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBwYXJlbnQgLSB0YWcgaW5zdGFuY2Ugd2hlcmUgdGhlIG5ldyBjaGlsZCB0YWcgd2lsbCBiZSBpbmNsdWRlZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBhZGRDaGlsZFRhZyh0YWcsIHRhZ05hbWUsIHBhcmVudCkge1xyXG4gICAgICAgIHZhciBjYWNoZWRUYWcgPSBwYXJlbnQudGFnc1t0YWdOYW1lXVxyXG5cclxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgY2hpbGRyZW4gdGFncyBoYXZpbmcgdGhlIHNhbWUgbmFtZVxyXG4gICAgICAgIGlmIChjYWNoZWRUYWcpIHtcclxuICAgICAgICAgICAgLy8gaWYgdGhlIHBhcmVudCB0YWdzIHByb3BlcnR5IGlzIG5vdCB5ZXQgYW4gYXJyYXlcclxuICAgICAgICAgICAgLy8gY3JlYXRlIGl0IGFkZGluZyB0aGUgZmlyc3QgY2FjaGVkIHRhZ1xyXG4gICAgICAgICAgICBpZiAoIWlzQXJyYXkoY2FjaGVkVGFnKSlcclxuICAgICAgICAgICAgLy8gZG9uJ3QgYWRkIHRoZSBzYW1lIHRhZyB0d2ljZVxyXG4gICAgICAgICAgICAgICAgaWYgKGNhY2hlZFRhZyAhPT0gdGFnKVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudC50YWdzW3RhZ05hbWVdID0gW2NhY2hlZFRhZ11cclxuICAgICAgICAgICAgLy8gYWRkIHRoZSBuZXcgbmVzdGVkIHRhZyB0byB0aGUgYXJyYXlcclxuICAgICAgICAgICAgaWYgKCFjb250YWlucyhwYXJlbnQudGFnc1t0YWdOYW1lXSwgdGFnKSlcclxuICAgICAgICAgICAgICAgIHBhcmVudC50YWdzW3RhZ05hbWVdLnB1c2godGFnKVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHBhcmVudC50YWdzW3RhZ05hbWVdID0gdGFnXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTW92ZSB0aGUgcG9zaXRpb24gb2YgYSBjdXN0b20gdGFnIGluIGl0cyBwYXJlbnQgdGFnXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IHRhZyAtIGNoaWxkIHRhZyBpbnN0YW5jZVxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0ga2V5IHdoZXJlIHRoZSB0YWcgd2FzIHN0b3JlZFxyXG4gICAgICogQHBhcmFtICAgeyBOdW1iZXIgfSBuZXdQb3MgLSBpbmRleCB3aGVyZSB0aGUgbmV3IHRhZyB3aWxsIGJlIHN0b3JlZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBtb3ZlQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBuZXdQb3MpIHtcclxuICAgICAgICB2YXIgcGFyZW50ID0gdGFnLnBhcmVudCxcclxuICAgICAgICAgICAgdGFnc1xyXG4gICAgICAgIC8vIG5vIHBhcmVudCBubyBtb3ZlXHJcbiAgICAgICAgaWYgKCFwYXJlbnQpIHJldHVyblxyXG5cclxuICAgICAgICB0YWdzID0gcGFyZW50LnRhZ3NbdGFnTmFtZV1cclxuXHJcbiAgICAgICAgaWYgKGlzQXJyYXkodGFncykpXHJcbiAgICAgICAgICAgIHRhZ3Muc3BsaWNlKG5ld1BvcywgMCwgdGFncy5zcGxpY2UodGFncy5pbmRleE9mKHRhZyksIDEpWzBdKVxyXG4gICAgICAgIGVsc2UgYWRkQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBwYXJlbnQpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBuZXcgY2hpbGQgdGFnIGluY2x1ZGluZyBpdCBjb3JyZWN0bHkgaW50byBpdHMgcGFyZW50XHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IGNoaWxkIC0gY2hpbGQgdGFnIGltcGxlbWVudGF0aW9uXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdHMgLSB0YWcgb3B0aW9ucyBjb250YWluaW5nIHRoZSBET00gbm9kZSB3aGVyZSB0aGUgdGFnIHdpbGwgYmUgbW91bnRlZFxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBpbm5lckhUTUwgLSBpbm5lciBodG1sIG9mIHRoZSBjaGlsZCBub2RlXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IHBhcmVudCAtIGluc3RhbmNlIG9mIHRoZSBwYXJlbnQgdGFnIGluY2x1ZGluZyB0aGUgY2hpbGQgY3VzdG9tIHRhZ1xyXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBpbnN0YW5jZSBvZiB0aGUgbmV3IGNoaWxkIHRhZyBqdXN0IGNyZWF0ZWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5pdENoaWxkVGFnKGNoaWxkLCBvcHRzLCBpbm5lckhUTUwsIHBhcmVudCkge1xyXG4gICAgICAgIHZhciB0YWcgPSBuZXcgVGFnKGNoaWxkLCBvcHRzLCBpbm5lckhUTUwpLFxyXG4gICAgICAgICAgICB0YWdOYW1lID0gZ2V0VGFnTmFtZShvcHRzLnJvb3QpLFxyXG4gICAgICAgICAgICBwdGFnID0gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHBhcmVudClcclxuICAgICAgICAvLyBmaXggZm9yIHRoZSBwYXJlbnQgYXR0cmlidXRlIGluIHRoZSBsb29wZWQgZWxlbWVudHNcclxuICAgICAgICB0YWcucGFyZW50ID0gcHRhZ1xyXG4gICAgICAgIC8vIHN0b3JlIHRoZSByZWFsIHBhcmVudCB0YWdcclxuICAgICAgICAvLyBpbiBzb21lIGNhc2VzIHRoaXMgY291bGQgYmUgZGlmZmVyZW50IGZyb20gdGhlIGN1c3RvbSBwYXJlbnQgdGFnXHJcbiAgICAgICAgLy8gZm9yIGV4YW1wbGUgaW4gbmVzdGVkIGxvb3BzXHJcbiAgICAgICAgdGFnLl9wYXJlbnQgPSBwYXJlbnRcclxuXHJcbiAgICAgICAgLy8gYWRkIHRoaXMgdGFnIHRvIHRoZSBjdXN0b20gcGFyZW50IHRhZ1xyXG4gICAgICAgIGFkZENoaWxkVGFnKHRhZywgdGFnTmFtZSwgcHRhZylcclxuICAgICAgICAvLyBhbmQgYWxzbyB0byB0aGUgcmVhbCBwYXJlbnQgdGFnXHJcbiAgICAgICAgaWYgKHB0YWcgIT09IHBhcmVudClcclxuICAgICAgICAgICAgYWRkQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBwYXJlbnQpXHJcbiAgICAgICAgLy8gZW1wdHkgdGhlIGNoaWxkIG5vZGUgb25jZSB3ZSBnb3QgaXRzIHRlbXBsYXRlXHJcbiAgICAgICAgLy8gdG8gYXZvaWQgdGhhdCBpdHMgY2hpbGRyZW4gZ2V0IGNvbXBpbGVkIG11bHRpcGxlIHRpbWVzXHJcbiAgICAgICAgb3B0cy5yb290LmlubmVySFRNTCA9ICcnXHJcblxyXG4gICAgICAgIHJldHVybiB0YWdcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIExvb3AgYmFja3dhcmQgYWxsIHRoZSBwYXJlbnRzIHRyZWUgdG8gZGV0ZWN0IHRoZSBmaXJzdCBjdXN0b20gcGFyZW50IHRhZ1xyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSB0YWcgLSBhIFRhZyBpbnN0YW5jZVxyXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSB0aGUgaW5zdGFuY2Ugb2YgdGhlIGZpcnN0IGN1c3RvbSBwYXJlbnQgdGFnIGZvdW5kXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyh0YWcpIHtcclxuICAgICAgICB2YXIgcHRhZyA9IHRhZ1xyXG4gICAgICAgIHdoaWxlICghZ2V0VGFnKHB0YWcucm9vdCkpIHtcclxuICAgICAgICAgICAgaWYgKCFwdGFnLnBhcmVudCkgYnJlYWtcclxuICAgICAgICAgICAgcHRhZyA9IHB0YWcucGFyZW50XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwdGFnXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBIZWxwZXIgZnVuY3Rpb24gdG8gc2V0IGFuIGltbXV0YWJsZSBwcm9wZXJ0eVxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBlbCAtIG9iamVjdCB3aGVyZSB0aGUgbmV3IHByb3BlcnR5IHdpbGwgYmUgc2V0XHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGtleSAtIG9iamVjdCBrZXkgd2hlcmUgdGhlIG5ldyBwcm9wZXJ0eSB3aWxsIGJlIHN0b3JlZFxyXG4gICAgICogQHBhcmFtICAgeyAqIH0gdmFsdWUgLSB2YWx1ZSBvZiB0aGUgbmV3IHByb3BlcnR5XHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdGlvbnMgLSBzZXQgdGhlIHByb3Blcnkgb3ZlcnJpZGluZyB0aGUgZGVmYXVsdCBvcHRpb25zXHJcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IC0gdGhlIGluaXRpYWwgb2JqZWN0XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGVsLCBrZXksIHZhbHVlLCBvcHRpb25zKSB7XHJcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLCBrZXksIGV4dGVuZCh7XHJcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcclxuICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZVxyXG4gICAgICAgIH0sIG9wdGlvbnMpKVxyXG4gICAgICAgIHJldHVybiBlbFxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSB0YWcgbmFtZSBvZiBhbnkgRE9NIG5vZGVcclxuICAgICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2Ugd2FudCB0byBwYXJzZVxyXG4gICAgICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lIHRvIGlkZW50aWZ5IHRoaXMgZG9tIG5vZGUgaW4gcmlvdFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBnZXRUYWdOYW1lKGRvbSkge1xyXG4gICAgICAgIHZhciBjaGlsZCA9IGdldFRhZyhkb20pLFxyXG4gICAgICAgICAgICBuYW1lZFRhZyA9IGdldEF0dHIoZG9tLCAnbmFtZScpLFxyXG4gICAgICAgICAgICB0YWdOYW1lID0gbmFtZWRUYWcgJiYgIXRtcGwuaGFzRXhwcihuYW1lZFRhZykgP1xyXG4gICAgICAgICAgICAgICAgbmFtZWRUYWcgOlxyXG4gICAgICAgICAgICAgICAgY2hpbGQgPyBjaGlsZC5uYW1lIDogZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKVxyXG5cclxuICAgICAgICByZXR1cm4gdGFnTmFtZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXh0ZW5kIGFueSBvYmplY3Qgd2l0aCBvdGhlciBwcm9wZXJ0aWVzXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IHNyYyAtIHNvdXJjZSBvYmplY3RcclxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gdGhlIHJlc3VsdGluZyBleHRlbmRlZCBvYmplY3RcclxuICAgICAqXHJcbiAgICAgKiB2YXIgb2JqID0geyBmb286ICdiYXonIH1cclxuICAgICAqIGV4dGVuZChvYmosIHtiYXI6ICdiYXInLCBmb286ICdiYXInfSlcclxuICAgICAqIGNvbnNvbGUubG9nKG9iaikgPT4ge2JhcjogJ2JhcicsIGZvbzogJ2Jhcid9XHJcbiAgICAgKlxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBleHRlbmQoc3JjKSB7XHJcbiAgICAgICAgdmFyIG9iaiwgYXJncyA9IGFyZ3VtZW50c1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJncy5sZW5ndGg7ICsraSkge1xyXG4gICAgICAgICAgICBpZiAob2JqID0gYXJnc1tpXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNoZWNrIGlmIHRoaXMgcHJvcGVydHkgb2YgdGhlIHNvdXJjZSBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1dyaXRhYmxlKHNyYywga2V5KSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjW2tleV0gPSBvYmpba2V5XVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzcmNcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIHdoZXRoZXIgYW4gYXJyYXkgY29udGFpbnMgYW4gaXRlbVxyXG4gICAgICogQHBhcmFtICAgeyBBcnJheSB9IGFyciAtIHRhcmdldCBhcnJheVxyXG4gICAgICogQHBhcmFtICAgeyAqIH0gaXRlbSAtIGl0ZW0gdG8gdGVzdFxyXG4gICAgICogQHJldHVybnMgeyBCb29sZWFuIH0gRG9lcyAnYXJyJyBjb250YWluICdpdGVtJz9cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY29udGFpbnMoYXJyLCBpdGVtKSB7XHJcbiAgICAgICAgcmV0dXJuIH5hcnIuaW5kZXhPZihpdGVtKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgd2hldGhlciBhbiBvYmplY3QgaXMgYSBraW5kIG9mIGFycmF5XHJcbiAgICAgKiBAcGFyYW0gICB7ICogfSBhIC0gYW55dGhpbmdcclxuICAgICAqIEByZXR1cm5zIHtCb29sZWFufSBpcyAnYScgYW4gYXJyYXk/XHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGlzQXJyYXkoYSkgeyByZXR1cm4gQXJyYXkuaXNBcnJheShhKSB8fCBhIGluc3RhbmNlb2YgQXJyYXkgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRGV0ZWN0IHdoZXRoZXIgYSBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSAgb2JqIC0gc291cmNlIG9iamVjdFxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAga2V5IC0gb2JqZWN0IHByb3BlcnR5XHJcbiAgICAgKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBpcyB0aGlzIHByb3BlcnR5IHdyaXRhYmxlP1xyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBpc1dyaXRhYmxlKG9iaiwga2V5KSB7XHJcbiAgICAgICAgdmFyIHByb3BzID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIGtleSlcclxuICAgICAgICByZXR1cm4gdHlwZW9mIG9ialtrZXldID09PSBUX1VOREVGIHx8IHByb3BzICYmIHByb3BzLndyaXRhYmxlXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogV2l0aCB0aGlzIGZ1bmN0aW9uIHdlIGF2b2lkIHRoYXQgdGhlIGludGVybmFsIFRhZyBtZXRob2RzIGdldCBvdmVycmlkZGVuXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IGRhdGEgLSBvcHRpb25zIHdlIHdhbnQgdG8gdXNlIHRvIGV4dGVuZCB0aGUgdGFnIGluc3RhbmNlXHJcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGNsZWFuIG9iamVjdCB3aXRob3V0IGNvbnRhaW5pbmcgdGhlIHJpb3QgaW50ZXJuYWwgcmVzZXJ2ZWQgd29yZHNcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2xlYW5VcERhdGEoZGF0YSkge1xyXG4gICAgICAgIGlmICghKGRhdGEgaW5zdGFuY2VvZiBUYWcpICYmICEoZGF0YSAmJiB0eXBlb2YgZGF0YS50cmlnZ2VyID09IFRfRlVOQ1RJT04pKVxyXG4gICAgICAgICAgICByZXR1cm4gZGF0YVxyXG5cclxuICAgICAgICB2YXIgbyA9IHt9XHJcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGRhdGEpIHtcclxuICAgICAgICAgICAgaWYgKCFjb250YWlucyhSRVNFUlZFRF9XT1JEU19CTEFDS0xJU1QsIGtleSkpXHJcbiAgICAgICAgICAgICAgICBvW2tleV0gPSBkYXRhW2tleV1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG9cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFdhbGsgZG93biByZWN1cnNpdmVseSBhbGwgdGhlIGNoaWxkcmVuIHRhZ3Mgc3RhcnRpbmcgZG9tIG5vZGVcclxuICAgICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gICBkb20gLSBzdGFydGluZyBub2RlIHdoZXJlIHdlIHdpbGwgc3RhcnQgdGhlIHJlY3Vyc2lvblxyXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgdG8gdHJhbnNmb3JtIHRoZSBjaGlsZCBub2RlIGp1c3QgZm91bmRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gd2Fsayhkb20sIGZuKSB7XHJcbiAgICAgICAgaWYgKGRvbSkge1xyXG4gICAgICAgICAgICAvLyBzdG9wIHRoZSByZWN1cnNpb25cclxuICAgICAgICAgICAgaWYgKGZuKGRvbSkgPT09IGZhbHNlKSByZXR1cm5cclxuICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkb20gPSBkb20uZmlyc3RDaGlsZFxyXG5cclxuICAgICAgICAgICAgICAgIHdoaWxlIChkb20pIHtcclxuICAgICAgICAgICAgICAgICAgICB3YWxrKGRvbSwgZm4pXHJcbiAgICAgICAgICAgICAgICAgICAgZG9tID0gZG9tLm5leHRTaWJsaW5nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNaW5pbWl6ZSByaXNrOiBvbmx5IHplcm8gb3Igb25lIF9zcGFjZV8gYmV0d2VlbiBhdHRyICYgdmFsdWVcclxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBodG1sIC0gaHRtbCBzdHJpbmcgd2Ugd2FudCB0byBwYXJzZVxyXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYXBwbHkgb24gYW55IGF0dHJpYnV0ZSBmb3VuZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiB3YWxrQXR0cmlidXRlcyhodG1sLCBmbikge1xyXG4gICAgICAgIHZhciBtLFxyXG4gICAgICAgICAgICByZSA9IC8oWy1cXHddKykgPz0gPyg/OlwiKFteXCJdKil8JyhbXiddKil8KHtbXn1dKn0pKS9nXHJcblxyXG4gICAgICAgIHdoaWxlIChtID0gcmUuZXhlYyhodG1sKSkge1xyXG4gICAgICAgICAgICBmbihtWzFdLnRvTG93ZXJDYXNlKCksIG1bMl0gfHwgbVszXSB8fCBtWzRdKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIHdoZXRoZXIgYSBET00gbm9kZSBpcyBpbiBzdHViIG1vZGUsIHVzZWZ1bCBmb3IgdGhlIHJpb3QgJ2lmJyBkaXJlY3RpdmVcclxuICAgICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gcGFyc2VcclxuICAgICAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaXNJblN0dWIoZG9tKSB7XHJcbiAgICAgICAgd2hpbGUgKGRvbSkge1xyXG4gICAgICAgICAgICBpZiAoZG9tLmluU3R1YikgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgZG9tID0gZG9tLnBhcmVudE5vZGVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSBnZW5lcmljIERPTSBub2RlXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IG5hbWUgLSBuYW1lIG9mIHRoZSBET00gbm9kZSB3ZSB3YW50IHRvIGNyZWF0ZVxyXG4gICAgICogQHJldHVybnMgeyBPYmplY3QgfSBET00gbm9kZSBqdXN0IGNyZWF0ZWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gbWtFbChuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNob3J0ZXIgYW5kIGZhc3Qgd2F5IHRvIHNlbGVjdCBtdWx0aXBsZSBub2RlcyBpbiB0aGUgRE9NXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gRE9NIHNlbGVjdG9yXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IGN0eCAtIERPTSBub2RlIHdoZXJlIHRoZSB0YXJnZXRzIG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXHJcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlcyBmb3VuZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiAkJChzZWxlY3RvciwgY3R4KSB7XHJcbiAgICAgICAgcmV0dXJuIChjdHggfHwgZG9jdW1lbnQpLnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgYSBzaW5nbGUgbm9kZSBpbiB0aGUgRE9NXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gdW5pcXVlIGRvbSBzZWxlY3RvclxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0IG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXHJcbiAgICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlIGZvdW5kXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uICQoc2VsZWN0b3IsIGN0eCkge1xyXG4gICAgICAgIHJldHVybiAoY3R4IHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2ltcGxlIG9iamVjdCBwcm90b3R5cGFsIGluaGVyaXRhbmNlXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IHBhcmVudCAtIHBhcmVudCBvYmplY3RcclxuICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gY2hpbGQgaW5zdGFuY2VcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQpIHtcclxuICAgICAgICBmdW5jdGlvbiBDaGlsZCgpIHt9XHJcbiAgICAgICAgQ2hpbGQucHJvdG90eXBlID0gcGFyZW50XHJcbiAgICAgICAgcmV0dXJuIG5ldyBDaGlsZCgpXHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIG5hbWUgcHJvcGVydHkgbmVlZGVkIHRvIGlkZW50aWZ5IGEgRE9NIG5vZGUgaW4gcmlvdFxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIHBhcnNlXHJcbiAgICAgKiBAcmV0dXJucyB7IFN0cmluZyB8IHVuZGVmaW5lZCB9IGdpdmUgdXMgYmFjayBhIHN0cmluZyB0byBpZGVudGlmeSB0aGlzIGRvbSBub2RlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIGdldE5hbWVkS2V5KGRvbSkge1xyXG4gICAgICAgIHJldHVybiBnZXRBdHRyKGRvbSwgJ2lkJykgfHwgZ2V0QXR0cihkb20sICduYW1lJylcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCB0aGUgbmFtZWQgcHJvcGVydGllcyBvZiBhIHRhZyBlbGVtZW50XHJcbiAgICAgKiBAcGFyYW0geyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIHBhcnNlXHJcbiAgICAgKiBAcGFyYW0geyBPYmplY3QgfSBwYXJlbnQgLSB0YWcgaW5zdGFuY2Ugd2hlcmUgdGhlIG5hbWVkIGRvbSBlbGVtZW50IHdpbGwgYmUgZXZlbnR1YWxseSBhZGRlZFxyXG4gICAgICogQHBhcmFtIHsgQXJyYXkgfSBrZXlzIC0gbGlzdCBvZiBhbGwgdGhlIHRhZyBpbnN0YW5jZSBwcm9wZXJ0aWVzXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHNldE5hbWVkKGRvbSwgcGFyZW50LCBrZXlzKSB7XHJcbiAgICAgICAgLy8gZ2V0IHRoZSBrZXkgdmFsdWUgd2Ugd2FudCB0byBhZGQgdG8gdGhlIHRhZyBpbnN0YW5jZVxyXG4gICAgICAgIHZhciBrZXkgPSBnZXROYW1lZEtleShkb20pLFxyXG4gICAgICAgICAgICBpc0FycixcclxuICAgICAgICAvLyBhZGQgdGhlIG5vZGUgZGV0ZWN0ZWQgdG8gYSB0YWcgaW5zdGFuY2UgdXNpbmcgdGhlIG5hbWVkIHByb3BlcnR5XHJcbiAgICAgICAgICAgIGFkZCA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBhdm9pZCB0byBvdmVycmlkZSB0aGUgdGFnIHByb3BlcnRpZXMgYWxyZWFkeSBzZXRcclxuICAgICAgICAgICAgICAgIGlmIChjb250YWlucyhrZXlzLCBrZXkpKSByZXR1cm5cclxuICAgICAgICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgdGhpcyB2YWx1ZSBpcyBhbiBhcnJheVxyXG4gICAgICAgICAgICAgICAgaXNBcnIgPSBpc0FycmF5KHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgLy8gaWYgdGhlIGtleSB3YXMgbmV2ZXIgc2V0XHJcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKVxyXG4gICAgICAgICAgICAgICAgLy8gc2V0IGl0IG9uY2Ugb24gdGhlIHRhZyBpbnN0YW5jZVxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudFtrZXldID0gZG9tXHJcbiAgICAgICAgICAgICAgICAvLyBpZiBpdCB3YXMgYW4gYXJyYXkgYW5kIG5vdCB5ZXQgc2V0XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmICghaXNBcnIgfHwgaXNBcnIgJiYgIWNvbnRhaW5zKHZhbHVlLCBkb20pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYWRkIHRoZSBkb20gbm9kZSBpbnRvIHRoZSBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0FycilcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWUucHVzaChkb20pXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRba2V5XSA9IFt2YWx1ZSwgZG9tXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHNraXAgdGhlIGVsZW1lbnRzIHdpdGggbm8gbmFtZWQgcHJvcGVydGllc1xyXG4gICAgICAgIGlmICgha2V5KSByZXR1cm5cclxuXHJcbiAgICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGlzIGtleSBoYXMgYmVlbiBhbHJlYWR5IGV2YWx1YXRlZFxyXG4gICAgICAgIGlmICh0bXBsLmhhc0V4cHIoa2V5KSlcclxuICAgICAgICAvLyB3YWl0IHRoZSBmaXJzdCB1cGRhdGVkIGV2ZW50IG9ubHkgb25jZVxyXG4gICAgICAgICAgICBwYXJlbnQub25lKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAga2V5ID0gZ2V0TmFtZWRLZXkoZG9tKVxyXG4gICAgICAgICAgICAgICAgYWRkKHBhcmVudFtrZXldKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgYWRkKHBhcmVudFtrZXldKVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEZhc3RlciBTdHJpbmcgc3RhcnRzV2l0aCBhbHRlcm5hdGl2ZVxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBzcmMgLSBzb3VyY2Ugc3RyaW5nXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IHN0ciAtIHRlc3Qgc3RyaW5nXHJcbiAgICAgKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHN0YXJ0c1dpdGgoc3JjLCBzdHIpIHtcclxuICAgICAgICByZXR1cm4gc3JjLnNsaWNlKDAsIHN0ci5sZW5ndGgpID09PSBzdHJcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIHJlcXVlc3RBbmltYXRpb25GcmFtZSBmdW5jdGlvblxyXG4gICAgICogQWRhcHRlZCBmcm9tIGh0dHBzOi8vZ2lzdC5naXRodWIuY29tL3BhdWxpcmlzaC8xNTc5NjcxLCBsaWNlbnNlIE1JVFxyXG4gICAgICovXHJcbiAgICB2YXIgckFGID0gKGZ1bmN0aW9uICh3KSB7XHJcbiAgICAgICAgdmFyIHJhZiA9IHcucmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XHJcbiAgICAgICAgICAgIHcubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHcud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcblxyXG4gICAgICAgIGlmICghcmFmIHx8IC9pUChhZHxob25lfG9kKS4qT1MgNi8udGVzdCh3Lm5hdmlnYXRvci51c2VyQWdlbnQpKSB7ICAvLyBidWdneSBpT1M2XHJcbiAgICAgICAgICAgIHZhciBsYXN0VGltZSA9IDBcclxuXHJcbiAgICAgICAgICAgIHJhZiA9IGZ1bmN0aW9uIChjYikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5vd3RpbWUgPSBEYXRlLm5vdygpLCB0aW1lb3V0ID0gTWF0aC5tYXgoMTYgLSAobm93dGltZSAtIGxhc3RUaW1lKSwgMClcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBjYihsYXN0VGltZSA9IG5vd3RpbWUgKyB0aW1lb3V0KSB9LCB0aW1lb3V0KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByYWZcclxuXHJcbiAgICB9KSh3aW5kb3cgfHwge30pXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBNb3VudCBhIHRhZyBjcmVhdGluZyBuZXcgVGFnIGluc3RhbmNlXHJcbiAgICAgKiBAcGFyYW0gICB7IE9iamVjdCB9IHJvb3QgLSBkb20gbm9kZSB3aGVyZSB0aGUgdGFnIHdpbGwgYmUgbW91bnRlZFxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0gbmFtZSBvZiB0aGUgcmlvdCB0YWcgd2Ugd2FudCB0byBtb3VudFxyXG4gICAgICogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRzIC0gb3B0aW9ucyB0byBwYXNzIHRvIHRoZSBUYWcgaW5zdGFuY2VcclxuICAgICAqIEByZXR1cm5zIHsgVGFnIH0gYSBuZXcgVGFnIGluc3RhbmNlXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG1vdW50VG8ocm9vdCwgdGFnTmFtZSwgb3B0cykge1xyXG4gICAgICAgIHZhciB0YWcgPSBfX3RhZ0ltcGxbdGFnTmFtZV0sXHJcbiAgICAgICAgLy8gY2FjaGUgdGhlIGlubmVyIEhUTUwgdG8gZml4ICM4NTVcclxuICAgICAgICAgICAgaW5uZXJIVE1MID0gcm9vdC5faW5uZXJIVE1MID0gcm9vdC5faW5uZXJIVE1MIHx8IHJvb3QuaW5uZXJIVE1MXHJcblxyXG4gICAgICAgIC8vIGNsZWFyIHRoZSBpbm5lciBodG1sXHJcbiAgICAgICAgcm9vdC5pbm5lckhUTUwgPSAnJ1xyXG5cclxuICAgICAgICBpZiAodGFnICYmIHJvb3QpIHRhZyA9IG5ldyBUYWcodGFnLCB7IHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMgfSwgaW5uZXJIVE1MKVxyXG5cclxuICAgICAgICBpZiAodGFnICYmIHRhZy5tb3VudCkge1xyXG4gICAgICAgICAgICB0YWcubW91bnQoKVxyXG4gICAgICAgICAgICAvLyBhZGQgdGhpcyB0YWcgdG8gdGhlIHZpcnR1YWxEb20gdmFyaWFibGVcclxuICAgICAgICAgICAgaWYgKCFjb250YWlucyhfX3ZpcnR1YWxEb20sIHRhZykpIF9fdmlydHVhbERvbS5wdXNoKHRhZylcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0YWdcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogUmlvdCBwdWJsaWMgYXBpXHJcbiAgICAgKi9cclxuXHJcbi8vIHNoYXJlIG1ldGhvZHMgZm9yIG90aGVyIHJpb3QgcGFydHMsIGUuZy4gY29tcGlsZXJcclxuICAgIHJpb3QudXRpbCA9IHsgYnJhY2tldHM6IGJyYWNrZXRzLCB0bXBsOiB0bXBsIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIENyZWF0ZSBhIG1peGluIHRoYXQgY291bGQgYmUgZ2xvYmFsbHkgc2hhcmVkIGFjcm9zcyBhbGwgdGhlIHRhZ3NcclxuICAgICAqL1xyXG4gICAgcmlvdC5taXhpbiA9IChmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgbWl4aW5zID0ge31cclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogQ3JlYXRlL1JldHVybiBhIG1peGluIGJ5IGl0cyBuYW1lXHJcbiAgICAgICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbWl4aW4gbmFtZVxyXG4gICAgICAgICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gbWl4aW4gLSBtaXhpbiBsb2dpY1xyXG4gICAgICAgICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gdGhlIG1peGluIGxvZ2ljXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKG5hbWUsIG1peGluKSB7XHJcbiAgICAgICAgICAgIGlmICghbWl4aW4pIHJldHVybiBtaXhpbnNbbmFtZV1cclxuICAgICAgICAgICAgbWl4aW5zW25hbWVdID0gbWl4aW5cclxuICAgICAgICB9XHJcblxyXG4gICAgfSkoKVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbmV3IHJpb3QgdGFnIGltcGxlbWVudGF0aW9uXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgbmFtZSAtIG5hbWUvaWQgb2YgdGhlIG5ldyByaW90IHRhZ1xyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGh0bWwgLSB0YWcgdGVtcGxhdGVcclxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBjc3MgLSBjdXN0b20gdGFnIGNzc1xyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGF0dHJzIC0gcm9vdCB0YWcgYXR0cmlidXRlc1xyXG4gICAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gdXNlciBmdW5jdGlvblxyXG4gICAgICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lL2lkIG9mIHRoZSB0YWcganVzdCBjcmVhdGVkXHJcbiAgICAgKi9cclxuICAgIHJpb3QudGFnID0gZnVuY3Rpb24obmFtZSwgaHRtbCwgY3NzLCBhdHRycywgZm4pIHtcclxuICAgICAgICBpZiAoaXNGdW5jdGlvbihhdHRycykpIHtcclxuICAgICAgICAgICAgZm4gPSBhdHRyc1xyXG4gICAgICAgICAgICBpZiAoL15bXFx3XFwtXStcXHM/PS8udGVzdChjc3MpKSB7XHJcbiAgICAgICAgICAgICAgICBhdHRycyA9IGNzc1xyXG4gICAgICAgICAgICAgICAgY3NzID0gJydcclxuICAgICAgICAgICAgfSBlbHNlIGF0dHJzID0gJydcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGNzcykge1xyXG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihjc3MpKSBmbiA9IGNzc1xyXG4gICAgICAgICAgICBlbHNlIHN0eWxlTWFuYWdlci5hZGQoY3NzKVxyXG4gICAgICAgIH1cclxuICAgICAgICBfX3RhZ0ltcGxbbmFtZV0gPSB7IG5hbWU6IG5hbWUsIHRtcGw6IGh0bWwsIGF0dHJzOiBhdHRycywgZm46IGZuIH1cclxuICAgICAgICByZXR1cm4gbmFtZVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgbmV3IHJpb3QgdGFnIGltcGxlbWVudGF0aW9uIChmb3IgdXNlIGJ5IHRoZSBjb21waWxlcilcclxuICAgICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBuYW1lIC0gbmFtZS9pZCBvZiB0aGUgbmV3IHJpb3QgdGFnXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgaHRtbCAtIHRhZyB0ZW1wbGF0ZVxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGNzcyAtIGN1c3RvbSB0YWcgY3NzXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgYXR0cnMgLSByb290IHRhZyBhdHRyaWJ1dGVzXHJcbiAgICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSB1c2VyIGZ1bmN0aW9uXHJcbiAgICAgKiBAcGFyYW0gICB7IHN0cmluZyB9ICBbYnBhaXJdIC0gYnJhY2tldHMgdXNlZCBpbiB0aGUgY29tcGlsYXRpb25cclxuICAgICAqIEByZXR1cm5zIHsgU3RyaW5nIH0gbmFtZS9pZCBvZiB0aGUgdGFnIGp1c3QgY3JlYXRlZFxyXG4gICAgICovXHJcbiAgICByaW90LnRhZzIgPSBmdW5jdGlvbihuYW1lLCBodG1sLCBjc3MsIGF0dHJzLCBmbiwgYnBhaXIpIHtcclxuICAgICAgICBpZiAoY3NzKSBzdHlsZU1hbmFnZXIuYWRkKGNzcylcclxuICAgICAgICAvL2lmIChicGFpcikgcmlvdC5zZXR0aW5ncy5icmFja2V0cyA9IGJwYWlyXHJcbiAgICAgICAgX190YWdJbXBsW25hbWVdID0geyBuYW1lOiBuYW1lLCB0bXBsOiBodG1sLCBhdHRyczogYXR0cnMsIGZuOiBmbiB9XHJcbiAgICAgICAgcmV0dXJuIG5hbWVcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIE1vdW50IGEgdGFnIHVzaW5nIGEgc3BlY2lmaWMgdGFnIGltcGxlbWVudGF0aW9uXHJcbiAgICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gdGFnIERPTSBzZWxlY3RvclxyXG4gICAgICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0gdGFnIGltcGxlbWVudGF0aW9uIG5hbWVcclxuICAgICAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gb3B0cyAtIHRhZyBsb2dpY1xyXG4gICAgICogQHJldHVybnMgeyBBcnJheSB9IG5ldyB0YWdzIGluc3RhbmNlc1xyXG4gICAgICovXHJcbiAgICByaW90Lm1vdW50ID0gZnVuY3Rpb24oc2VsZWN0b3IsIHRhZ05hbWUsIG9wdHMpIHtcclxuXHJcbiAgICAgICAgdmFyIGVscyxcclxuICAgICAgICAgICAgYWxsVGFncyxcclxuICAgICAgICAgICAgdGFncyA9IFtdXHJcblxyXG4gICAgICAgIC8vIGhlbHBlciBmdW5jdGlvbnNcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkUmlvdFRhZ3MoYXJyKSB7XHJcbiAgICAgICAgICAgIHZhciBsaXN0ID0gJydcclxuICAgICAgICAgICAgZWFjaChhcnIsIGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIS9bXi1cXHddLy50ZXN0KGUpKVxyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgKz0gJywqWycgKyBSSU9UX1RBRyArICc9JyArIGUudHJpbSgpICsgJ10nXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIHJldHVybiBsaXN0XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZWxlY3RBbGxUYWdzKCkge1xyXG4gICAgICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKF9fdGFnSW1wbClcclxuICAgICAgICAgICAgcmV0dXJuIGtleXMgKyBhZGRSaW90VGFncyhrZXlzKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcHVzaFRhZ3Mocm9vdCkge1xyXG4gICAgICAgICAgICB2YXIgbGFzdFxyXG5cclxuICAgICAgICAgICAgaWYgKHJvb3QudGFnTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRhZ05hbWUgJiYgKCEobGFzdCA9IGdldEF0dHIocm9vdCwgUklPVF9UQUcpKSB8fCBsYXN0ICE9IHRhZ05hbWUpKVxyXG4gICAgICAgICAgICAgICAgICAgIHNldEF0dHIocm9vdCwgUklPVF9UQUcsIHRhZ05hbWUpXHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHRhZyA9IG1vdW50VG8ocm9vdCwgdGFnTmFtZSB8fCByb290LmdldEF0dHJpYnV0ZShSSU9UX1RBRykgfHwgcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCksIG9wdHMpXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHRhZykgdGFncy5wdXNoKHRhZylcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChyb290Lmxlbmd0aClcclxuICAgICAgICAgICAgICAgIGVhY2gocm9vdCwgcHVzaFRhZ3MpICAgLy8gYXNzdW1lIG5vZGVMaXN0XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gLS0tLS0gbW91bnQgY29kZSAtLS0tLVxyXG5cclxuICAgICAgICAvLyBpbmplY3Qgc3R5bGVzIGludG8gRE9NXHJcbiAgICAgICAgc3R5bGVNYW5hZ2VyLmluamVjdCgpXHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgdGFnTmFtZSA9PT0gVF9PQkpFQ1QpIHtcclxuICAgICAgICAgICAgb3B0cyA9IHRhZ05hbWVcclxuICAgICAgICAgICAgdGFnTmFtZSA9IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGNyYXdsIHRoZSBET00gdG8gZmluZCB0aGUgdGFnXHJcbiAgICAgICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gVF9TVFJJTkcpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGVjdG9yID09PSAnKicpXHJcbiAgICAgICAgICAgIC8vIHNlbGVjdCBhbGwgdGhlIHRhZ3MgcmVnaXN0ZXJlZFxyXG4gICAgICAgICAgICAvLyBhbmQgYWxzbyB0aGUgdGFncyBmb3VuZCB3aXRoIHRoZSByaW90LXRhZyBhdHRyaWJ1dGUgc2V0XHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvciA9IGFsbFRhZ3MgPSBzZWxlY3RBbGxUYWdzKClcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAvLyBvciBqdXN0IHRoZSBvbmVzIG5hbWVkIGxpa2UgdGhlIHNlbGVjdG9yXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RvciArPSBhZGRSaW90VGFncyhzZWxlY3Rvci5zcGxpdCgnLCcpKVxyXG5cclxuICAgICAgICAgICAgLy8gbWFrZSBzdXJlIHRvIHBhc3MgYWx3YXlzIGEgc2VsZWN0b3JcclxuICAgICAgICAgICAgLy8gdG8gdGhlIHF1ZXJ5U2VsZWN0b3JBbGwgZnVuY3Rpb25cclxuICAgICAgICAgICAgZWxzID0gc2VsZWN0b3IgPyAkJChzZWxlY3RvcikgOiBbXVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgLy8gcHJvYmFibHkgeW91IGhhdmUgcGFzc2VkIGFscmVhZHkgYSB0YWcgb3IgYSBOb2RlTGlzdFxyXG4gICAgICAgICAgICBlbHMgPSBzZWxlY3RvclxyXG5cclxuICAgICAgICAvLyBzZWxlY3QgYWxsIHRoZSByZWdpc3RlcmVkIGFuZCBtb3VudCB0aGVtIGluc2lkZSB0aGVpciByb290IGVsZW1lbnRzXHJcbiAgICAgICAgaWYgKHRhZ05hbWUgPT09ICcqJykge1xyXG4gICAgICAgICAgICAvLyBnZXQgYWxsIGN1c3RvbSB0YWdzXHJcbiAgICAgICAgICAgIHRhZ05hbWUgPSBhbGxUYWdzIHx8IHNlbGVjdEFsbFRhZ3MoKVxyXG4gICAgICAgICAgICAvLyBpZiB0aGUgcm9vdCBlbHMgaXQncyBqdXN0IGEgc2luZ2xlIHRhZ1xyXG4gICAgICAgICAgICBpZiAoZWxzLnRhZ05hbWUpXHJcbiAgICAgICAgICAgICAgICBlbHMgPSAkJCh0YWdOYW1lLCBlbHMpXHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gc2VsZWN0IGFsbCB0aGUgY2hpbGRyZW4gZm9yIGFsbCB0aGUgZGlmZmVyZW50IHJvb3QgZWxlbWVudHNcclxuICAgICAgICAgICAgICAgIHZhciBub2RlTGlzdCA9IFtdXHJcbiAgICAgICAgICAgICAgICBlYWNoKGVscywgZnVuY3Rpb24gKF9lbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vZGVMaXN0LnB1c2goJCQodGFnTmFtZSwgX2VsKSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBlbHMgPSBub2RlTGlzdFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGdldCByaWQgb2YgdGhlIHRhZ05hbWVcclxuICAgICAgICAgICAgdGFnTmFtZSA9IDBcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChlbHMudGFnTmFtZSlcclxuICAgICAgICAgICAgcHVzaFRhZ3MoZWxzKVxyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZWFjaChlbHMsIHB1c2hUYWdzKVxyXG5cclxuICAgICAgICByZXR1cm4gdGFnc1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIGFsbCB0aGUgdGFncyBpbnN0YW5jZXMgY3JlYXRlZFxyXG4gICAgICogQHJldHVybnMgeyBBcnJheSB9IGFsbCB0aGUgdGFncyBpbnN0YW5jZXNcclxuICAgICAqL1xyXG4gICAgcmlvdC51cGRhdGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gZWFjaChfX3ZpcnR1YWxEb20sIGZ1bmN0aW9uKHRhZykge1xyXG4gICAgICAgICAgICB0YWcudXBkYXRlKClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogRXhwb3J0IHRoZSBUYWcgY29uc3RydWN0b3JcclxuICAgICAqL1xyXG4gICAgcmlvdC5UYWcgPSBUYWdcclxuICAgIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFRfT0JKRUNUKVxyXG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gcmlvdFxyXG4gICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gVF9GVU5DVElPTiAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gVF9VTkRFRilcclxuICAgICAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiByaW90IH0pXHJcbiAgICBlbHNlXHJcbiAgICAgICAgd2luZG93LnJpb3QgPSByaW90XHJcblxyXG59KSh0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnID8gd2luZG93IDogdm9pZCAwKTsiLCIndXNlIHN0cmljdCc7XG5cbnJlcXVpcmUoJy4uL1RhZ3MvQXBwLmVzNicpO1xuXG5yZXF1aXJlKCcuLi9UYWdzL05vdGVzLmVzNicpO1xuXG5yZXF1aXJlKCcuLi9UYWdzL1VJLlNlbGVjdENvbG9yLmVzNicpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lKQmJHd3VaWE0ySWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJpbXBvcnQgcmlvdCBmcm9tICcuLi9SaW90LmVzNidcclxuXHJcbnJpb3QudGFnKCdhcHAnLCAnPHlpZWxkPjwveWllbGQ+JywgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMub24oJ21vdW50JywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjaSgnTWFpbiBBcHAgbW91bnQgT0suJylcclxuICAgIH0pXHJcbn0pIiwiaW1wb3J0IEFic3RyYWN0IGZyb20gJy4vX0Fic3RyYWN0LmVzNidcclxuXHJcbm5ldyBjbGFzcyBOb3RlcyBleHRlbmRzIEFic3RyYWN0IHtcclxuXHJcbiAgICBnZXQgdGVtcGxhdGUoKXsgcmV0dXJuIGBcclxuPGlucHV0IG9uYmx1cj1cInsgYmx1ciB9XCIgcGxhY2Vob2xkZXI9XCJBZGQgbmV3XCI+XHJcbjxhcnRpY2xlIGNsYXNzPVwibm90ZVwiIGVhY2g9XCJ7IG5hbWUsIHYgaW4gJC5Ob3RlcyB9XCI+XHJcbiAgICA8aGVhZGVyPlxyXG4gICAgICAgIDxzZWxlY3QtY29sb3Igc2VsZWN0ZWQ9XCJ7ICdyZWQnIH1cIj48L3NlbGVjdC1jb2xvcj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImRhdGVcIj5TZXB0IDEyLCAyMDEzPC9zcGFuPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiY2xvc2VcIj4mdGltZXM7PC9zcGFuPlxyXG4gICAgPC9oZWFkZXI+XHJcblxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj5cclxuICAgICAgICA8cD57IHYuZG9jLnRpdGxlIH08L3A+XHJcbiAgICA8L2Rpdj48IS0tIC5jb250ZW50IC0tPlxyXG48L2FydGljbGU+XHJcbiAgICBgfVxyXG5cclxuICAgIGdldCBjb250ZXh0KCl7XHJcbiAgICAgICAgcmV0dXJuIGNvbnRleHRcclxuICAgIH1cclxufVxyXG5cclxuYXN5bmMgZnVuY3Rpb24gY29udGV4dChvcHRzKXtcclxuICAgIGF3YWl0ICQuTm90ZXMubG9hZCh0aGlzKVxyXG5cclxuICAgIHRoaXMuYmx1ciA9IGFzeW5jIGZ1bmN0aW9uKGV2KXtcclxuICAgICAgICBsZXQgdiA9IGV2LnRhcmdldC52YWx1ZS50cmltKClcclxuICAgICAgICBldi50YXJnZXQudmFsdWUgPSAnJ1xyXG4gICAgICAgIGlmICh2KSAkLk5vdGVzLmFkZCh2KVxyXG4gICAgfVxyXG5cclxuICAgICQuTm90ZXMub24oJ3N0YXRlJywgZnVuY3Rpb24oKXtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdzdGF0ZScsIGFyZ3VtZW50cywgJC5Ob3RlcylcclxuICAgIH0pXHJcblxyXG4gICAgLy9hd2FpdCBOb3Rlcy5hZGQoXCJEZSBsZWhldCBob2d5IGtvbGJhc3pcIilcclxuXHJcbiAgICAvL2xldCB5ID0gYXdhaXQgdGhpcy4kLk5vdGVzLmRvT3RoZXJTaWRlU3R1ZmYoKVxyXG5cclxuICAgIC8vY3coeSwgdGhpcylcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiByZXNvbHZlKCkpXHJcbn0iLCJpbXBvcnQgcmlvdCBmcm9tICcuLi9SaW90LmVzNidcclxuXHJcbmNvbnN0IENvbG9ycyA9IFtcclxuICAgIFwicmVkXCIsXHJcbiAgICBcImJsdWVcIixcclxuICAgIFwiZ3JlZW5cIixcclxuICAgIFwieWVsbG93XCIsXHJcbiAgICBcIm9yYW5nZVwiXHJcbl1cclxuXHJcbnJpb3QudGFnKCdzZWxlY3QtY29sb3InLCBgXHJcbiAgICA8c3BhbiBlYWNoPVwieyBjb2xvciBpbiBDb2xvcnMgfVwiIGlmPVwieyBjb2xvciA9PT0gcGFyZW50Lm9wdHMuc2VsZWN0ZWQgfVwiIGNsYXNzPVwieyBjb2xvciB9XCIgb25jbGljaz1cInsgY2xpY2sgfVwiPjwvc3Bhbj5cclxuYCwgZnVuY3Rpb24oKXtcclxuICAgIHRoaXMuQ29sb3JzID0gQ29sb3JzXHJcbiAgICB0aGlzLmlzT3BlbiA9IDBcclxuXHJcbiAgICB0aGlzLmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMuaXNPcGVuKVxyXG4gICAgICAgIHRoaXMuaXNPcGVuID0gMSAtIHRoaXMuaXNPcGVuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5pc09wZW4pIC8vIDEgLSB2XHJcbiAgICAgICAgdGhpcy5Db2xvcnMgPSBbXVxyXG4gICAgICAgIHRoaXMudXBkYXRlKClcclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlzT3BlbiwgdGhpcy5Db2xvcnMpXHJcbiAgICB9XHJcbn0pXHJcblxyXG5cclxuLy8gQGRlZmF1bHQ6IFRoZSBjb2xvciB0byBzaG93LiIsImltcG9ydCByaW90IGZyb20gJy4uL1Jpb3QuZXM2J1xyXG5pbXBvcnQgeyBDdXN0b20gYXMgRCB9IGZyb20gJy4uL0RlZmF1bHRzL1Jpb3QuZXM2J1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWJzdHJhY3Qge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlcigpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG9wdGlvbnMoKXtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB0aGlzLl9nZXRUYWdOYW1lKCksXHJcbiAgICAgICAgICAgIHRoaXMudGVtcGxhdGUucmVwbGFjZSgvKFxcclxcbnxcXG58XFxyfFxcdCkvZ20sXCJcIiksXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dFxyXG4gICAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBnZXQgc2V0dGluZ3MoKXtcclxuICAgICAgICByZXR1cm4gRFxyXG4gICAgfVxyXG5cclxuICAgIGdldCBjb250ZXh0KCl7XHJcbiAgICAgICAgdmFyIG0gPSBBYnN0cmFjdC5zZXR0aW5ncy5BdXRvTWl4aW5zXHJcbiAgICAgICAgcmV0dXJuIG1cclxuICAgICAgICAgICAgPyBmdW5jdGlvbiAoKSB7IG0uZm9yRWFjaCggKHYpID0+IHsgdGhpcy5taXhpbih2KSB9ICkgfVxyXG4gICAgICAgICAgICA6IGZ1bmN0aW9uICgpIHsgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIFtuYW1lLCBodG1sLCBjc3MsIGF0dHJzLCBmbl1cclxuICAgIC8vIE9ubHkgbmFtZSBpbXBvcnRhbnRcclxuICAgIHJlZ2lzdGVyKCl7XHJcbiAgICAgICAgcmlvdC50YWcuYXBwbHkobnVsbCwgdGhpcy5vcHRpb25zKVxyXG4gICAgfVxyXG5cclxuICAgIF9nZXRUYWdOYW1lKCl7XHJcbiAgICAgICAgbGV0IHN0ciA9IHRoaXMuY29uc3RydWN0b3IubmFtZVxyXG4gICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCAqIGFzIEVOViBmcm9tICcuL0RlZmF1bHRzL1N5c3RlbS5lczYnXHJcblxyXG50cnkge1xyXG4gICAgc2VsZi53aW5kb3cgPSBzZWxmLndpbmRvdyB8fCB7fVxyXG4gICAgc2VsZi5kb2N1bWVudCA9IHNlbGYuZG9jdW1lbnQgfHwge2RvY3VtZW50RWxlbWVudDoge3N0eWxlOiB7fX0sIGxvY2F0aW9uOiB7fX1cclxufSBjYXRjaChlKXt9XHJcblxyXG5sZXQgSVNfV09SS0VSID0gc2VsZi5kb2N1bWVudCAmJiBzZWxmLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IgPyAnJyA6ICcgVydcclxuXHJcbnNlbGYuY2wgPSBmdW5jdGlvbiguLi5hcmdzKXtcclxuICAgIEVOVi5ERUJVRyAmJiBjb25zb2xlLmxvZyhJU19XT1JLRVIsIC4uLmFyZ3MpXHJcbn1cclxuXHJcbnNlbGYuY3cgPSBmdW5jdGlvbiguLi5hcmdzKXtcclxuICAgIEVOVi5ERUJVRyAmJiBjb25zb2xlLndhcm4oSVNfV09SS0VSLCAuLi5hcmdzKVxyXG59XHJcblxyXG5zZWxmLmNlID0gZnVuY3Rpb24oLi4uYXJncyl7XHJcbiAgICBFTlYuREVCVUcgJiYgY29uc29sZS5lcnJvcihJU19XT1JLRVIsIC4uLmFyZ3MpXHJcbn1cclxuXHJcbnNlbGYuY2kgPSBmdW5jdGlvbiguLi5hcmdzKXtcclxuICAgIEVOVi5ERUJVRyAmJiBjb25zb2xlLmluZm8oSVNfV09SS0VSLCAuLi5hcmdzKVxyXG59XHJcblxyXG5zZWxmLmN0ID0gZnVuY3Rpb24oLi4uYXJncyl7XHJcbiAgICBFTlYuREVCVUcgJiYgY29uc29sZS50cmFjZShJU19XT1JLRVIsIC4uLmFyZ3MpXHJcbn1cclxuXHJcbnNlbGYuY2NpID0gMVxyXG5zZWxmLmNjID0gZnVuY3Rpb24obnVtKXtcclxuICAgIHNlbGYuY2NpID0gbnVtIHx8IHNlbGYuY2NpXHJcbiAgICBFTlYuREVCVUcgJiYgY29uc29sZS50cmFjZShzZWxmLmNjaSsrKVxyXG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnJlcXVpcmUoXCJjb3JlLWpzL3NoaW1cIik7XG5cbnJlcXVpcmUoXCJiYWJlbC1yZWdlbmVyYXRvci1ydW50aW1lXCIpO1xuXG5pZiAoZ2xvYmFsLl9iYWJlbFBvbHlmaWxsKSB7XG4gIHRocm93IG5ldyBFcnJvcihcIm9ubHkgb25lIGluc3RhbmNlIG9mIGJhYmVsLXBvbHlmaWxsIGlzIGFsbG93ZWRcIik7XG59XG5nbG9iYWwuX2JhYmVsUG9seWZpbGwgPSB0cnVlOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvbWFzdGVyL0xJQ0VOU0UgZmlsZS4gQW5cbiAqIGFkZGl0aW9uYWwgZ3JhbnQgb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpblxuICogdGhlIHNhbWUgZGlyZWN0b3J5LlxuICovXG5cbiEoZnVuY3Rpb24oZ2xvYmFsKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID1cbiAgICB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuXG4gIHZhciBpbk1vZHVsZSA9IHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCI7XG4gIHZhciBydW50aW1lID0gZ2xvYmFsLnJlZ2VuZXJhdG9yUnVudGltZTtcbiAgaWYgKHJ1bnRpbWUpIHtcbiAgICBpZiAoaW5Nb2R1bGUpIHtcbiAgICAgIC8vIElmIHJlZ2VuZXJhdG9yUnVudGltZSBpcyBkZWZpbmVkIGdsb2JhbGx5IGFuZCB3ZSdyZSBpbiBhIG1vZHVsZSxcbiAgICAgIC8vIG1ha2UgdGhlIGV4cG9ydHMgb2JqZWN0IGlkZW50aWNhbCB0byByZWdlbmVyYXRvclJ1bnRpbWUuXG4gICAgICBtb2R1bGUuZXhwb3J0cyA9IHJ1bnRpbWU7XG4gICAgfVxuICAgIC8vIERvbid0IGJvdGhlciBldmFsdWF0aW5nIHRoZSByZXN0IG9mIHRoaXMgZmlsZSBpZiB0aGUgcnVudGltZSB3YXNcbiAgICAvLyBhbHJlYWR5IGRlZmluZWQgZ2xvYmFsbHkuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gRGVmaW5lIHRoZSBydW50aW1lIGdsb2JhbGx5IChhcyBleHBlY3RlZCBieSBnZW5lcmF0ZWQgY29kZSkgYXMgZWl0aGVyXG4gIC8vIG1vZHVsZS5leHBvcnRzIChpZiB3ZSdyZSBpbiBhIG1vZHVsZSkgb3IgYSBuZXcsIGVtcHR5IG9iamVjdC5cbiAgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWUgPSBpbk1vZHVsZSA/IG1vZHVsZS5leHBvcnRzIDoge307XG5cbiAgZnVuY3Rpb24gd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIC8vIElmIG91dGVyRm4gcHJvdmlkZWQsIHRoZW4gb3V0ZXJGbi5wcm90b3R5cGUgaW5zdGFuY2VvZiBHZW5lcmF0b3IuXG4gICAgdmFyIGdlbmVyYXRvciA9IE9iamVjdC5jcmVhdGUoKG91dGVyRm4gfHwgR2VuZXJhdG9yKS5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIHJ1bnRpbWUud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIHZhciBHcCA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLnByb3RvdHlwZSA9IEdlbmVyYXRvci5wcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gXCJHZW5lcmF0b3JGdW5jdGlvblwiO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIHByb3RvdHlwZVttZXRob2RdID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIHJ1bnRpbWUuaXNHZW5lcmF0b3JGdW5jdGlvbiA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIHZhciBjdG9yID0gdHlwZW9mIGdlbkZ1biA9PT0gXCJmdW5jdGlvblwiICYmIGdlbkZ1bi5jb25zdHJ1Y3RvcjtcbiAgICByZXR1cm4gY3RvclxuICAgICAgPyBjdG9yID09PSBHZW5lcmF0b3JGdW5jdGlvbiB8fFxuICAgICAgICAvLyBGb3IgdGhlIG5hdGl2ZSBHZW5lcmF0b3JGdW5jdGlvbiBjb25zdHJ1Y3RvciwgdGhlIGJlc3Qgd2UgY2FuXG4gICAgICAgIC8vIGRvIGlzIHRvIGNoZWNrIGl0cyAubmFtZSBwcm9wZXJ0eS5cbiAgICAgICAgKGN0b3IuZGlzcGxheU5hbWUgfHwgY3Rvci5uYW1lKSA9PT0gXCJHZW5lcmF0b3JGdW5jdGlvblwiXG4gICAgICA6IGZhbHNlO1xuICB9O1xuXG4gIHJ1bnRpbWUubWFyayA9IGZ1bmN0aW9uKGdlbkZ1bikge1xuICAgIGlmIChPYmplY3Quc2V0UHJvdG90eXBlT2YpIHtcbiAgICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihnZW5GdW4sIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZ2VuRnVuLl9fcHJvdG9fXyA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYHZhbHVlIGluc3RhbmNlb2YgQXdhaXRBcmd1bWVudGAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuIFNvbWUgbWF5IGNvbnNpZGVyIHRoZSBuYW1lIG9mIHRoaXMgbWV0aG9kIHRvb1xuICAvLyBjdXRlc3ksIGJ1dCB0aGV5IGFyZSBjdXJtdWRnZW9ucy5cbiAgcnVudGltZS5hd3JhcCA9IGZ1bmN0aW9uKGFyZykge1xuICAgIHJldHVybiBuZXcgQXdhaXRBcmd1bWVudChhcmcpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEF3YWl0QXJndW1lbnQoYXJnKSB7XG4gICAgdGhpcy5hcmcgPSBhcmc7XG4gIH1cblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIC8vIFRoaXMgaW52b2tlIGZ1bmN0aW9uIGlzIHdyaXR0ZW4gaW4gYSBzdHlsZSB0aGF0IGFzc3VtZXMgc29tZVxuICAgIC8vIGNhbGxpbmcgZnVuY3Rpb24gKG9yIFByb21pc2UpIHdpbGwgaGFuZGxlIGV4Y2VwdGlvbnMuXG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gZ2VuZXJhdG9yW21ldGhvZF0oYXJnKTtcbiAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEF3YWl0QXJndW1lbnRcbiAgICAgICAgPyBQcm9taXNlLnJlc29sdmUodmFsdWUuYXJnKS50aGVuKGludm9rZU5leHQsIGludm9rZVRocm93KVxuICAgICAgICA6IFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAgIC8vIFdoZW4gYSB5aWVsZGVkIFByb21pc2UgaXMgcmVzb2x2ZWQsIGl0cyBmaW5hbCB2YWx1ZSBiZWNvbWVzXG4gICAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLiBJZiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZCwgaG93ZXZlciwgdGhlXG4gICAgICAgICAgICAvLyByZXN1bHQgZm9yIHRoaXMgaXRlcmF0aW9uIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCB0aGUgc2FtZVxuICAgICAgICAgICAgLy8gcmVhc29uLiBOb3RlIHRoYXQgcmVqZWN0aW9ucyBvZiB5aWVsZGVkIFByb21pc2VzIGFyZSBub3RcbiAgICAgICAgICAgIC8vIHRocm93biBiYWNrIGludG8gdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgYXMgaXMgdGhlIGNhc2VcbiAgICAgICAgICAgIC8vIHdoZW4gYW4gYXdhaXRlZCBQcm9taXNlIGlzIHJlamVjdGVkLiBUaGlzIGRpZmZlcmVuY2UgaW5cbiAgICAgICAgICAgIC8vIGJlaGF2aW9yIGJldHdlZW4geWllbGQgYW5kIGF3YWl0IGlzIGltcG9ydGFudCwgYmVjYXVzZSBpdFxuICAgICAgICAgICAgLy8gYWxsb3dzIHRoZSBjb25zdW1lciB0byBkZWNpZGUgd2hhdCB0byBkbyB3aXRoIHRoZSB5aWVsZGVkXG4gICAgICAgICAgICAvLyByZWplY3Rpb24gKHN3YWxsb3cgaXQgYW5kIGNvbnRpbnVlLCBtYW51YWxseSAudGhyb3cgaXQgYmFja1xuICAgICAgICAgICAgLy8gaW50byB0aGUgZ2VuZXJhdG9yLCBhYmFuZG9uIGl0ZXJhdGlvbiwgd2hhdGV2ZXIpLiBXaXRoXG4gICAgICAgICAgICAvLyBhd2FpdCwgYnkgY29udHJhc3QsIHRoZXJlIGlzIG5vIG9wcG9ydHVuaXR5IHRvIGV4YW1pbmUgdGhlXG4gICAgICAgICAgICAvLyByZWplY3Rpb24gcmVhc29uIG91dHNpZGUgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiwgc28gdGhlXG4gICAgICAgICAgICAvLyBvbmx5IG9wdGlvbiBpcyB0byB0aHJvdyBpdCBmcm9tIHRoZSBhd2FpdCBleHByZXNzaW9uLCBhbmRcbiAgICAgICAgICAgIC8vIGxldCB0aGUgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhbmRsZSB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgICAgcmVzdWx0LnZhbHVlID0gdW53cmFwcGVkO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2Vzcy5kb21haW4pIHtcbiAgICAgIGludm9rZSA9IHByb2Nlc3MuZG9tYWluLmJpbmQoaW52b2tlKTtcbiAgICB9XG5cbiAgICB2YXIgaW52b2tlTmV4dCA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJuZXh0XCIpO1xuICAgIHZhciBpbnZva2VUaHJvdyA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJ0aHJvd1wiKTtcbiAgICB2YXIgaW52b2tlUmV0dXJuID0gaW52b2tlLmJpbmQoZ2VuZXJhdG9yLCBcInJldHVyblwiKTtcbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBpbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSkge1xuICAgICAgICAgIHJlc29sdmUoY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIHJ1bnRpbWUuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBpdGVyID0gbmV3IEFzeW5jSXRlcmF0b3IoXG4gICAgICB3cmFwKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KVxuICAgICk7XG5cbiAgICByZXR1cm4gcnVudGltZS5pc0dlbmVyYXRvckZ1bmN0aW9uKG91dGVyRm4pXG4gICAgICA/IGl0ZXIgLy8gSWYgb3V0ZXJGbiBpcyBhIGdlbmVyYXRvciwgcmV0dXJuIHRoZSBmdWxsIGl0ZXJhdG9yLlxuICAgICAgOiBpdGVyLm5leHQoKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICAgIHJldHVybiByZXN1bHQuZG9uZSA/IHJlc3VsdC52YWx1ZSA6IGl0ZXIubmV4dCgpO1xuICAgICAgICB9KTtcbiAgfTtcblxuICBmdW5jdGlvbiBtYWtlSW52b2tlTWV0aG9kKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpIHtcbiAgICB2YXIgc3RhdGUgPSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0O1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZykge1xuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUV4ZWN1dGluZykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBydW5uaW5nXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlQ29tcGxldGVkKSB7XG4gICAgICAgIGlmIChtZXRob2QgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgIHRocm93IGFyZztcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEJlIGZvcmdpdmluZywgcGVyIDI1LjMuMy4zLjMgb2YgdGhlIHNwZWM6XG4gICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgcmV0dXJuIGRvbmVSZXN1bHQoKTtcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGRlbGVnYXRlID0gY29udGV4dC5kZWxlZ2F0ZTtcbiAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJyZXR1cm5cIiB8fFxuICAgICAgICAgICAgICAobWV0aG9kID09PSBcInRocm93XCIgJiYgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSA9PT0gdW5kZWZpbmVkKSkge1xuICAgICAgICAgICAgLy8gQSByZXR1cm4gb3IgdGhyb3cgKHdoZW4gdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBubyB0aHJvd1xuICAgICAgICAgICAgLy8gbWV0aG9kKSBhbHdheXMgdGVybWluYXRlcyB0aGUgeWllbGQqIGxvb3AuXG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGhhcyBhIHJldHVybiBtZXRob2QsIGdpdmUgaXQgYVxuICAgICAgICAgICAgLy8gY2hhbmNlIHRvIGNsZWFuIHVwLlxuICAgICAgICAgICAgdmFyIHJldHVybk1ldGhvZCA9IGRlbGVnYXRlLml0ZXJhdG9yW1wicmV0dXJuXCJdO1xuICAgICAgICAgICAgaWYgKHJldHVybk1ldGhvZCkge1xuICAgICAgICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gocmV0dXJuTWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgYXJnKTtcbiAgICAgICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgcmV0dXJuIG1ldGhvZCB0aHJldyBhbiBleGNlcHRpb24sIGxldCB0aGF0XG4gICAgICAgICAgICAgICAgLy8gZXhjZXB0aW9uIHByZXZhaWwgb3ZlciB0aGUgb3JpZ2luYWwgcmV0dXJuIG9yIHRocm93LlxuICAgICAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgICAgICBhcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICAgICAgLy8gQ29udGludWUgd2l0aCB0aGUgb3V0ZXIgcmV0dXJuLCBub3cgdGhhdCB0aGUgZGVsZWdhdGVcbiAgICAgICAgICAgICAgLy8gaXRlcmF0b3IgaGFzIGJlZW4gdGVybWluYXRlZC5cbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKFxuICAgICAgICAgICAgZGVsZWdhdGUuaXRlcmF0b3JbbWV0aG9kXSxcbiAgICAgICAgICAgIGRlbGVnYXRlLml0ZXJhdG9yLFxuICAgICAgICAgICAgYXJnXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgICAgICAgLy8gTGlrZSByZXR1cm5pbmcgZ2VuZXJhdG9yLnRocm93KHVuY2F1Z2h0KSwgYnV0IHdpdGhvdXQgdGhlXG4gICAgICAgICAgICAvLyBvdmVyaGVhZCBvZiBhbiBleHRyYSBmdW5jdGlvbiBjYWxsLlxuICAgICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgICAgYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgY29udGV4dC5fc2VudCA9IGFyZztcblxuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCkge1xuICAgICAgICAgICAgY29udGV4dC5zZW50ID0gYXJnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgYXJnO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGFyZykpIHtcbiAgICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgICAgbWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInJldHVyblwiKSB7XG4gICAgICAgICAgY29udGV4dC5hYnJ1cHQoXCJyZXR1cm5cIiwgYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGlmIChyZWNvcmQuYXJnID09PSBDb250aW51ZVNlbnRpbmVsKSB7XG4gICAgICAgICAgICBpZiAoY29udGV4dC5kZWxlZ2F0ZSAmJiBtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgICAgIC8vIERlbGliZXJhdGVseSBmb3JnZXQgdGhlIGxhc3Qgc2VudCB2YWx1ZSBzbyB0aGF0IHdlIGRvbid0XG4gICAgICAgICAgICAgIC8vIGFjY2lkZW50YWxseSBwYXNzIGl0IG9uIHRvIHRoZSBkZWxlZ2F0ZS5cbiAgICAgICAgICAgICAgYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUNvbXBsZXRlZDtcbiAgICAgICAgICAvLyBEaXNwYXRjaCB0aGUgZXhjZXB0aW9uIGJ5IGxvb3BpbmcgYmFjayBhcm91bmQgdG8gdGhlXG4gICAgICAgICAgLy8gY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihhcmcpIGNhbGwgYWJvdmUuXG4gICAgICAgICAgbWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQodHJ1ZSk7XG4gIH1cblxuICBydW50aW1lLmtleXMgPSBmdW5jdGlvbihvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH1cbiAgICBrZXlzLnJldmVyc2UoKTtcblxuICAgIC8vIFJhdGhlciB0aGFuIHJldHVybmluZyBhbiBvYmplY3Qgd2l0aCBhIG5leHQgbWV0aG9kLCB3ZSBrZWVwXG4gICAgLy8gdGhpbmdzIHNpbXBsZSBhbmQgcmV0dXJuIHRoZSBuZXh0IGZ1bmN0aW9uIGl0c2VsZi5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgIHdoaWxlIChrZXlzLmxlbmd0aCkge1xuICAgICAgICB2YXIga2V5ID0ga2V5cy5wb3AoKTtcbiAgICAgICAgaWYgKGtleSBpbiBvYmplY3QpIHtcbiAgICAgICAgICBuZXh0LnZhbHVlID0ga2V5O1xuICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRvIGF2b2lkIGNyZWF0aW5nIGFuIGFkZGl0aW9uYWwgb2JqZWN0LCB3ZSBqdXN0IGhhbmcgdGhlIC52YWx1ZVxuICAgICAgLy8gYW5kIC5kb25lIHByb3BlcnRpZXMgb2ZmIHRoZSBuZXh0IGZ1bmN0aW9uIG9iamVjdCBpdHNlbGYuIFRoaXNcbiAgICAgIC8vIGFsc28gZW5zdXJlcyB0aGF0IHRoZSBtaW5pZmllciB3aWxsIG5vdCBhbm9ueW1pemUgdGhlIGZ1bmN0aW9uLlxuICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcbiAgICAgIHJldHVybiBuZXh0O1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gdmFsdWVzKGl0ZXJhYmxlKSB7XG4gICAgaWYgKGl0ZXJhYmxlKSB7XG4gICAgICB2YXIgaXRlcmF0b3JNZXRob2QgPSBpdGVyYWJsZVtpdGVyYXRvclN5bWJvbF07XG4gICAgICBpZiAoaXRlcmF0b3JNZXRob2QpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yTWV0aG9kLmNhbGwoaXRlcmFibGUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIGl0ZXJhYmxlLm5leHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gaXRlcmFibGU7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNOYU4oaXRlcmFibGUubGVuZ3RoKSkge1xuICAgICAgICB2YXIgaSA9IC0xLCBuZXh0ID0gZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICB3aGlsZSAoKytpIDwgaXRlcmFibGUubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoaGFzT3duLmNhbGwoaXRlcmFibGUsIGkpKSB7XG4gICAgICAgICAgICAgIG5leHQudmFsdWUgPSBpdGVyYWJsZVtpXTtcbiAgICAgICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIG5leHQudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgbmV4dC5kb25lID0gdHJ1ZTtcblxuICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBuZXh0Lm5leHQgPSBuZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFJldHVybiBhbiBpdGVyYXRvciB3aXRoIG5vIHZhbHVlcy5cbiAgICByZXR1cm4geyBuZXh0OiBkb25lUmVzdWx0IH07XG4gIH1cbiAgcnVudGltZS52YWx1ZXMgPSB2YWx1ZXM7XG5cbiAgZnVuY3Rpb24gZG9uZVJlc3VsdCgpIHtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cblxuICBDb250ZXh0LnByb3RvdHlwZSA9IHtcbiAgICBjb25zdHJ1Y3RvcjogQ29udGV4dCxcblxuICAgIHJlc2V0OiBmdW5jdGlvbihza2lwVGVtcFJlc2V0KSB7XG4gICAgICB0aGlzLnByZXYgPSAwO1xuICAgICAgdGhpcy5uZXh0ID0gMDtcbiAgICAgIHRoaXMuc2VudCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuZG9uZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcbiAgICAgICAgcmV0dXJuICEhY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH1cbiAgfTtcbn0pKFxuICAvLyBBbW9uZyB0aGUgdmFyaW91cyB0cmlja3MgZm9yIG9idGFpbmluZyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsXG4gIC8vIG9iamVjdCwgdGhpcyBzZWVtcyB0byBiZSB0aGUgbW9zdCByZWxpYWJsZSB0ZWNobmlxdWUgdGhhdCBkb2VzIG5vdFxuICAvLyB1c2UgaW5kaXJlY3QgZXZhbCAod2hpY2ggdmlvbGF0ZXMgQ29udGVudCBTZWN1cml0eSBQb2xpY3kpLlxuICB0eXBlb2YgZ2xvYmFsID09PSBcIm9iamVjdFwiID8gZ2xvYmFsIDpcbiAgdHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIiA/IHdpbmRvdyA6XG4gIHR5cGVvZiBzZWxmID09PSBcIm9iamVjdFwiID8gc2VsZiA6IHRoaXNcbik7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyAyMi4xLjMuMzEgQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG52YXIgVU5TQ09QQUJMRVMgPSByZXF1aXJlKCcuLyQud2tzJykoJ3Vuc2NvcGFibGVzJylcbiAgLCBBcnJheVByb3RvICA9IEFycmF5LnByb3RvdHlwZTtcbmlmKEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdID09IHVuZGVmaW5lZClyZXF1aXJlKCcuLyQuaGlkZScpKEFycmF5UHJvdG8sIFVOU0NPUEFCTEVTLCB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gMjIuMS4zLjMgQXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4odGFyZ2V0LCBzdGFydCwgZW5kID0gdGhpcy5sZW5ndGgpXG4ndXNlIHN0cmljdCc7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLyQudG8tb2JqZWN0JylcbiAgLCB0b0luZGV4ICA9IHJlcXVpcmUoJy4vJC50by1pbmRleCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gW10uY29weVdpdGhpbiB8fCBmdW5jdGlvbiBjb3B5V2l0aGluKHRhcmdldC8qPSAwKi8sIHN0YXJ0Lyo9IDAsIGVuZCA9IEBsZW5ndGgqLyl7XG4gIHZhciBPICAgICA9IHRvT2JqZWN0KHRoaXMpXG4gICAgLCBsZW4gICA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICwgdG8gICAgPSB0b0luZGV4KHRhcmdldCwgbGVuKVxuICAgICwgZnJvbSAgPSB0b0luZGV4KHN0YXJ0LCBsZW4pXG4gICAgLCAkJCAgICA9IGFyZ3VtZW50c1xuICAgICwgZW5kICAgPSAkJC5sZW5ndGggPiAyID8gJCRbMl0gOiB1bmRlZmluZWRcbiAgICAsIGNvdW50ID0gTWF0aC5taW4oKGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogdG9JbmRleChlbmQsIGxlbikpIC0gZnJvbSwgbGVuIC0gdG8pXG4gICAgLCBpbmMgICA9IDE7XG4gIGlmKGZyb20gPCB0byAmJiB0byA8IGZyb20gKyBjb3VudCl7XG4gICAgaW5jICA9IC0xO1xuICAgIGZyb20gKz0gY291bnQgLSAxO1xuICAgIHRvICAgKz0gY291bnQgLSAxO1xuICB9XG4gIHdoaWxlKGNvdW50LS0gPiAwKXtcbiAgICBpZihmcm9tIGluIE8pT1t0b10gPSBPW2Zyb21dO1xuICAgIGVsc2UgZGVsZXRlIE9bdG9dO1xuICAgIHRvICAgKz0gaW5jO1xuICAgIGZyb20gKz0gaW5jO1xuICB9IHJldHVybiBPO1xufTsiLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbid1c2Ugc3RyaWN0JztcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vJC50by1vYmplY3QnKVxuICAsIHRvSW5kZXggID0gcmVxdWlyZSgnLi8kLnRvLWluZGV4JylcbiAgLCB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vJC50by1sZW5ndGgnKTtcbm1vZHVsZS5leHBvcnRzID0gW10uZmlsbCB8fCBmdW5jdGlvbiBmaWxsKHZhbHVlIC8qLCBzdGFydCA9IDAsIGVuZCA9IEBsZW5ndGggKi8pe1xuICB2YXIgTyAgICAgID0gdG9PYmplY3QodGhpcylcbiAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICwgJCQgICAgID0gYXJndW1lbnRzXG4gICAgLCAkJGxlbiAgPSAkJC5sZW5ndGhcbiAgICAsIGluZGV4ICA9IHRvSW5kZXgoJCRsZW4gPiAxID8gJCRbMV0gOiB1bmRlZmluZWQsIGxlbmd0aClcbiAgICAsIGVuZCAgICA9ICQkbGVuID4gMiA/ICQkWzJdIDogdW5kZWZpbmVkXG4gICAgLCBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvSW5kZXgoZW5kLCBsZW5ndGgpO1xuICB3aGlsZShlbmRQb3MgPiBpbmRleClPW2luZGV4KytdID0gdmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCB0b0luZGV4ICAgPSByZXF1aXJlKCcuLyQudG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIElPYmplY3QgID0gcmVxdWlyZSgnLi8kLmlvYmplY3QnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLW9iamVjdCcpXG4gICwgdG9MZW5ndGggPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCBhc2MgICAgICA9IHJlcXVpcmUoJy4vJC5hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUWVBFKXtcbiAgdmFyIElTX01BUCAgICAgICAgPSBUWVBFID09IDFcbiAgICAsIElTX0ZJTFRFUiAgICAgPSBUWVBFID09IDJcbiAgICAsIElTX1NPTUUgICAgICAgPSBUWVBFID09IDNcbiAgICAsIElTX0VWRVJZICAgICAgPSBUWVBFID09IDRcbiAgICAsIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDZcbiAgICAsIE5PX0hPTEVTICAgICAgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KXtcbiAgICB2YXIgTyAgICAgID0gdG9PYmplY3QoJHRoaXMpXG4gICAgICAsIHNlbGYgICA9IElPYmplY3QoTylcbiAgICAgICwgZiAgICAgID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSAwXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IGFzYygkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGFzYygkdGhpcywgMCkgOiB1bmRlZmluZWRcbiAgICAgICwgdmFsLCByZXM7XG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmKFRZUEUpe1xuICAgICAgICBpZihJU19NQVApcmVzdWx0W2luZGV4XSA9IHJlczsgICAgICAgICAgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZihyZXMpc3dpdGNoKFRZUEUpe1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYoSVNfRVZFUlkpcmV0dXJuIGZhbHNlOyAgICAgICAgICAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTsiLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBpc0FycmF5ICA9IHJlcXVpcmUoJy4vJC5pcy1hcnJheScpXG4gICwgU1BFQ0lFUyAgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob3JpZ2luYWwsIGxlbmd0aCl7XG4gIHZhciBDO1xuICBpZihpc0FycmF5KG9yaWdpbmFsKSl7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKUMgPSB1bmRlZmluZWQ7XG4gICAgaWYoaXNPYmplY3QoQykpe1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZihDID09PSBudWxsKUMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBuZXcgKEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQykobGVuZ3RoKTtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJylcbiAgLy8gRVMzIHdyb25nIGhlcmVcbiAgLCBBUkcgPSBjb2YoZnVuY3Rpb24oKXsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IChPID0gT2JqZWN0KGl0KSlbVEFHXSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaGlkZSAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhpZGUnKVxuICAsIHJlZGVmaW5lQWxsICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZS1hbGwnKVxuICAsIGN0eCAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIHN0cmljdE5ldyAgICA9IHJlcXVpcmUoJy4vJC5zdHJpY3QtbmV3JylcbiAgLCBkZWZpbmVkICAgICAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpXG4gICwgZm9yT2YgICAgICAgID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXG4gICwgJGl0ZXJEZWZpbmUgID0gcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJylcbiAgLCBzdGVwICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXRlci1zdGVwJylcbiAgLCBJRCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykoJ2lkJylcbiAgLCAkaGFzICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBpc09iamVjdCAgICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBzZXRTcGVjaWVzICAgPSByZXF1aXJlKCcuLyQuc2V0LXNwZWNpZXMnKVxuICAsIERFU0NSSVBUT1JTICA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpXG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIFNJWkUgICAgICAgICA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJ1xuICAsIGlkICAgICAgICAgICA9IDA7XG5cbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighJGhhcyhpdCwgSUQpKXtcbiAgICAvLyBjYW4ndCBzZXQgaWQgdG8gZnJvemVuIG9iamVjdFxuICAgIGlmKCFpc0V4dGVuc2libGUoaXQpKXJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgaWRcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3Npbmcgb2JqZWN0IGlkXG4gICAgaGlkZShpdCwgSUQsICsraWQpO1xuICAvLyByZXR1cm4gb2JqZWN0IGlkIHdpdGggcHJlZml4XG4gIH0gcmV0dXJuICdPJyArIGl0W0lEXTtcbn07XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uKHRoYXQsIGtleSl7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xuICBpZihpbmRleCAhPT0gJ0YnKXJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvcihlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKXtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24odGhhdCwgaXRlcmFibGUpe1xuICAgICAgc3RyaWN0TmV3KHRoYXQsIEMsIE5BTUUpO1xuICAgICAgdGhhdC5faSA9ICQuY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKXtcbiAgICAgICAgZm9yKHZhciB0aGF0ID0gdGhpcywgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYoZW50cnkucCllbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXG4gICAgICAgICAgLCBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmKGVudHJ5KXtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cbiAgICAgICAgICAgICwgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmKG5leHQpbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZih0aGF0Ll9mID09IGVudHJ5KXRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmKHRoYXQuX2wgPT0gZW50cnkpdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMylcbiAgICAgICAgICAsIGVudHJ5O1xuICAgICAgICB3aGlsZShlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2Ype1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSl7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYoREVTQ1JJUFRPUlMpJC5zZXREZXNjKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcbiAgICAgICAgcmV0dXJuIGRlZmluZWQodGhpc1tTSVpFXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxuICAgICAgLCBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZihlbnRyeSl7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZighdGhhdC5fZil0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZihpbmRleCAhPT0gJ0YnKXRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uKEMsIE5BTUUsIElTX01BUCl7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgICAgIHRoaXMuX3QgPSBpdGVyYXRlZDsgIC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgICAsIGtpbmQgID0gdGhhdC5fa1xuICAgICAgICAsIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSl7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL0RhdmlkQnJ1YW50L01hcC1TZXQucHJvdG90eXBlLnRvSlNPTlxudmFyIGZvck9mICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBjbGFzc29mID0gcmVxdWlyZSgnLi8kLmNsYXNzb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSl7XG4gIHJldHVybiBmdW5jdGlvbiB0b0pTT04oKXtcbiAgICBpZihjbGFzc29mKHRoaXMpICE9IE5BTUUpdGhyb3cgVHlwZUVycm9yKE5BTUUgKyBcIiN0b0pTT04gaXNuJ3QgZ2VuZXJpY1wiKTtcbiAgICB2YXIgYXJyID0gW107XG4gICAgZm9yT2YodGhpcywgZmFsc2UsIGFyci5wdXNoLCBhcnIpO1xuICAgIHJldHVybiBhcnI7XG4gIH07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBoaWRlICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCByZWRlZmluZUFsbCAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZS1hbGwnKVxuICAsIGFuT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgaXNPYmplY3QgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBzdHJpY3ROZXcgICAgICAgICA9IHJlcXVpcmUoJy4vJC5zdHJpY3QtbmV3JylcbiAgLCBmb3JPZiAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIGNyZWF0ZUFycmF5TWV0aG9kID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKVxuICAsICRoYXMgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhhcycpXG4gICwgV0VBSyAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykoJ3dlYWsnKVxuICAsIGlzRXh0ZW5zaWJsZSAgICAgID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBpc09iamVjdFxuICAsIGFycmF5RmluZCAgICAgICAgID0gY3JlYXRlQXJyYXlNZXRob2QoNSlcbiAgLCBhcnJheUZpbmRJbmRleCAgICA9IGNyZWF0ZUFycmF5TWV0aG9kKDYpXG4gICwgaWQgICAgICAgICAgICAgICAgPSAwO1xuXG4vLyBmYWxsYmFjayBmb3IgZnJvemVuIGtleXNcbnZhciBmcm96ZW5TdG9yZSA9IGZ1bmN0aW9uKHRoYXQpe1xuICByZXR1cm4gdGhhdC5fbCB8fCAodGhhdC5fbCA9IG5ldyBGcm96ZW5TdG9yZSk7XG59O1xudmFyIEZyb3plblN0b3JlID0gZnVuY3Rpb24oKXtcbiAgdGhpcy5hID0gW107XG59O1xudmFyIGZpbmRGcm96ZW4gPSBmdW5jdGlvbihzdG9yZSwga2V5KXtcbiAgcmV0dXJuIGFycmF5RmluZChzdG9yZS5hLCBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0WzBdID09PSBrZXk7XG4gIH0pO1xufTtcbkZyb3plblN0b3JlLnByb3RvdHlwZSA9IHtcbiAgZ2V0OiBmdW5jdGlvbihrZXkpe1xuICAgIHZhciBlbnRyeSA9IGZpbmRGcm96ZW4odGhpcywga2V5KTtcbiAgICBpZihlbnRyeSlyZXR1cm4gZW50cnlbMV07XG4gIH0sXG4gIGhhczogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gISFmaW5kRnJvemVuKHRoaXMsIGtleSk7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgdmFyIGVudHJ5ID0gZmluZEZyb3plbih0aGlzLCBrZXkpO1xuICAgIGlmKGVudHJ5KWVudHJ5WzFdID0gdmFsdWU7XG4gICAgZWxzZSB0aGlzLmEucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9LFxuICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcbiAgICB2YXIgaW5kZXggPSBhcnJheUZpbmRJbmRleCh0aGlzLmEsIGZ1bmN0aW9uKGl0KXtcbiAgICAgIHJldHVybiBpdFswXSA9PT0ga2V5O1xuICAgIH0pO1xuICAgIGlmKH5pbmRleCl0aGlzLmEuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gISF+aW5kZXg7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24od3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUil7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uKHRoYXQsIGl0ZXJhYmxlKXtcbiAgICAgIHN0cmljdE5ldyh0aGF0LCBDLCBOQU1FKTtcbiAgICAgIHRoYXQuX2kgPSBpZCsrOyAgICAgIC8vIGNvbGxlY3Rpb24gaWRcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7IC8vIGxlYWsgc3RvcmUgZm9yIGZyb3plbiBvYmplY3RzXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4zLjMuMiBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuNC4zLjMgV2Vha1NldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcbiAgICAgICAgaWYoIWlzRXh0ZW5zaWJsZShrZXkpKXJldHVybiBmcm96ZW5TdG9yZSh0aGlzKVsnZGVsZXRlJ10oa2V5KTtcbiAgICAgICAgcmV0dXJuICRoYXMoa2V5LCBXRUFLKSAmJiAkaGFzKGtleVtXRUFLXSwgdGhpcy5faSkgJiYgZGVsZXRlIGtleVtXRUFLXVt0aGlzLl9pXTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4zLjMuNCBXZWFrTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuNC4zLjQgV2Vha1NldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KXtcbiAgICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xuICAgICAgICBpZighaXNFeHRlbnNpYmxlKGtleSkpcmV0dXJuIGZyb3plblN0b3JlKHRoaXMpLmhhcyhrZXkpO1xuICAgICAgICByZXR1cm4gJGhhcyhrZXksIFdFQUspICYmICRoYXMoa2V5W1dFQUtdLCB0aGlzLl9pKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcbiAgICBpZighaXNFeHRlbnNpYmxlKGFuT2JqZWN0KGtleSkpKXtcbiAgICAgIGZyb3plblN0b3JlKHRoYXQpLnNldChrZXksIHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGhhcyhrZXksIFdFQUspIHx8IGhpZGUoa2V5LCBXRUFLLCB7fSk7XG4gICAgICBrZXlbV0VBS11bdGhhdC5faV0gPSB2YWx1ZTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBmcm96ZW5TdG9yZTogZnJvemVuU3RvcmUsXG4gIFdFQUs6IFdFQUtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpXG4gICwgcmVkZWZpbmVBbGwgICAgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUtYWxsJylcbiAgLCBmb3JPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5mb3Itb2YnKVxuICAsIHN0cmljdE5ldyAgICAgID0gcmVxdWlyZSgnLi8kLnN0cmljdC1uZXcnKVxuICAsIGlzT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpXG4gICwgZmFpbHMgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKVxuICAsICRpdGVyRGV0ZWN0ICAgID0gcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKXtcbiAgdmFyIEJhc2UgID0gZ2xvYmFsW05BTUVdXG4gICAgLCBDICAgICA9IEJhc2VcbiAgICAsIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJ1xuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXG4gICAgLCBPICAgICA9IHt9O1xuICB2YXIgZml4TWV0aG9kID0gZnVuY3Rpb24oS0VZKXtcbiAgICB2YXIgZm4gPSBwcm90b1tLRVldO1xuICAgIHJlZGVmaW5lKHByb3RvLCBLRVksXG4gICAgICBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbihhKXtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gZmFsc2UgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdoYXMnID8gZnVuY3Rpb24gaGFzKGEpe1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoYSl7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IHVuZGVmaW5lZCA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2FkZCcgPyBmdW5jdGlvbiBhZGQoYSl7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTsgcmV0dXJuIHRoaXM7IH1cbiAgICAgICAgOiBmdW5jdGlvbiBzZXQoYSwgYil7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTsgcmV0dXJuIHRoaXM7IH1cbiAgICApO1xuICB9O1xuICBpZih0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbigpe1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKXtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0YW5jZSAgICAgICAgICAgICA9IG5ldyBDXG4gICAgICAvLyBlYXJseSBpbXBsZW1lbnRhdGlvbnMgbm90IHN1cHBvcnRzIGNoYWluaW5nXG4gICAgICAsIEhBU05UX0NIQUlOSU5HICAgICAgID0gaW5zdGFuY2VbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKSAhPSBpbnN0YW5jZVxuICAgICAgLy8gVjggfiAgQ2hyb21pdW0gNDAtIHdlYWstY29sbGVjdGlvbnMgdGhyb3dzIG9uIHByaW1pdGl2ZXMsIGJ1dCBzaG91bGQgcmV0dXJuIGZhbHNlXG4gICAgICAsIFRIUk9XU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24oKXsgaW5zdGFuY2UuaGFzKDEpOyB9KVxuICAgICAgLy8gbW9zdCBlYXJseSBpbXBsZW1lbnRhdGlvbnMgZG9lc24ndCBzdXBwb3J0cyBpdGVyYWJsZXMsIG1vc3QgbW9kZXJuIC0gbm90IGNsb3NlIGl0IGNvcnJlY3RseVxuICAgICAgLCBBQ0NFUFRfSVRFUkFCTEVTICAgICA9ICRpdGVyRGV0ZWN0KGZ1bmN0aW9uKGl0ZXIpeyBuZXcgQyhpdGVyKTsgfSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAgIC8vIGZvciBlYXJseSBpbXBsZW1lbnRhdGlvbnMgLTAgYW5kICswIG5vdCB0aGUgc2FtZVxuICAgICAgLCBCVUdHWV9aRVJPO1xuICAgIGlmKCFBQ0NFUFRfSVRFUkFCTEVTKXsgXG4gICAgICBDID0gd3JhcHBlcihmdW5jdGlvbih0YXJnZXQsIGl0ZXJhYmxlKXtcbiAgICAgICAgc3RyaWN0TmV3KHRhcmdldCwgQywgTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gbmV3IEJhc2U7XG4gICAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgfSk7XG4gICAgICBDLnByb3RvdHlwZSA9IHByb3RvO1xuICAgICAgcHJvdG8uY29uc3RydWN0b3IgPSBDO1xuICAgIH1cbiAgICBJU19XRUFLIHx8IGluc3RhbmNlLmZvckVhY2goZnVuY3Rpb24odmFsLCBrZXkpe1xuICAgICAgQlVHR1lfWkVSTyA9IDEgLyBrZXkgPT09IC1JbmZpbml0eTtcbiAgICB9KTtcbiAgICBpZihUSFJPV1NfT05fUFJJTUlUSVZFUyB8fCBCVUdHWV9aRVJPKXtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuICAgIGlmKEJVR0dZX1pFUk8gfHwgSEFTTlRfQ0hBSU5JTkcpZml4TWV0aG9kKEFEREVSKTtcbiAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIHNob3VsZCBub3QgY29udGFpbnMgLmNsZWFyIG1ldGhvZFxuICAgIGlmKElTX1dFQUsgJiYgcHJvdG8uY2xlYXIpZGVsZXRlIHByb3RvLmNsZWFyO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogKEMgIT0gQmFzZSksIE8pO1xuXG4gIGlmKCFJU19XRUFLKWNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMS4yLjYnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpXG4gICwgZG9jdW1lbnQgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIGtleXMgICAgICAgPSAkLmdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSAkLmlzRW51bVxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKWtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCByZWRlZmluZSAgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KVxuICAgICwga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIGtleSBpbiB0YXJnZXQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmKHRhcmdldCAmJiAhb3duKXJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmKGV4cG9ydHNba2V5XSAhPSBvdXQpaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgLy8gd3JhcFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsInZhciBNQVRDSCA9IHJlcXVpcmUoJy4vJC53a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIHJlID0gLy4vO1xuICB0cnkge1xuICAgICcvLi8nW0tFWV0ocmUpO1xuICB9IGNhdGNoKGUpe1xuICAgIHRyeSB7XG4gICAgICByZVtNQVRDSF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiAhJy8uLydbS0VZXShyZSk7XG4gICAgfSBjYXRjaChmKXsgLyogZW1wdHkgKi8gfVxuICB9IHJldHVybiB0cnVlO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG52YXIgaGlkZSAgICAgPSByZXF1aXJlKCcuLyQuaGlkZScpXG4gICwgcmVkZWZpbmUgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKVxuICAsIGZhaWxzICAgID0gcmVxdWlyZSgnLi8kLmZhaWxzJylcbiAgLCBkZWZpbmVkICA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJylcbiAgLCB3a3MgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihLRVksIGxlbmd0aCwgZXhlYyl7XG4gIHZhciBTWU1CT0wgICA9IHdrcyhLRVkpXG4gICAgLCBvcmlnaW5hbCA9ICcnW0tFWV07XG4gIGlmKGZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgdmFyIE8gPSB7fTtcbiAgICBPW1NZTUJPTF0gPSBmdW5jdGlvbigpeyByZXR1cm4gNzsgfTtcbiAgICByZXR1cm4gJydbS0VZXShPKSAhPSA3O1xuICB9KSl7XG4gICAgcmVkZWZpbmUoU3RyaW5nLnByb3RvdHlwZSwgS0VZLCBleGVjKGRlZmluZWQsIFNZTUJPTCwgb3JpZ2luYWwpKTtcbiAgICBoaWRlKFJlZ0V4cC5wcm90b3R5cGUsIFNZTUJPTCwgbGVuZ3RoID09IDJcbiAgICAgIC8vIDIxLjIuNS44IFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXShzdHJpbmcsIHJlcGxhY2VWYWx1ZSlcbiAgICAgIC8vIDIxLjIuNS4xMSBSZWdFeHAucHJvdG90eXBlW0BAc3BsaXRdKHN0cmluZywgbGltaXQpXG4gICAgICA/IGZ1bmN0aW9uKHN0cmluZywgYXJnKXsgcmV0dXJuIG9yaWdpbmFsLmNhbGwoc3RyaW5nLCB0aGlzLCBhcmcpOyB9XG4gICAgICAvLyAyMS4yLjUuNiBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdKHN0cmluZylcbiAgICAgIC8vIDIxLjIuNS45IFJlZ0V4cC5wcm90b3R5cGVbQEBzZWFyY2hdKHN0cmluZylcbiAgICAgIDogZnVuY3Rpb24oc3RyaW5nKXsgcmV0dXJuIG9yaWdpbmFsLmNhbGwoc3RyaW5nLCB0aGlzKTsgfVxuICAgICk7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3NcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgdmFyIHRoYXQgICA9IGFuT2JqZWN0KHRoaXMpXG4gICAgLCByZXN1bHQgPSAnJztcbiAgaWYodGhhdC5nbG9iYWwpICAgICByZXN1bHQgKz0gJ2cnO1xuICBpZih0aGF0Lmlnbm9yZUNhc2UpIHJlc3VsdCArPSAnaSc7XG4gIGlmKHRoYXQubXVsdGlsaW5lKSAgcmVzdWx0ICs9ICdtJztcbiAgaWYodGhhdC51bmljb2RlKSAgICByZXN1bHQgKz0gJ3UnO1xuICBpZih0aGF0LnN0aWNreSkgICAgIHJlc3VsdCArPSAneSc7XG4gIHJldHVybiByZXN1bHQ7XG59OyIsInZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNhbGwgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuLyQuaXMtYXJyYXktaXRlcicpXG4gICwgYW5PYmplY3QgICAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgICA9IHJlcXVpcmUoJy4vJC50by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcbiAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihpdGVyYWJsZSlcbiAgICAsIGYgICAgICA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxuICAgICwgaW5kZXggID0gMFxuICAgICwgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvcjtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgfSBlbHNlIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyApe1xuICAgIGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICB9XG59OyIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpXG4gICwgZ2V0TmFtZXMgID0gcmVxdWlyZSgnLi8kJykuZ2V0TmFtZXNcbiAgLCB0b1N0cmluZyAgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnZXROYW1lcyhpdCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmdldCA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICBpZih3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJylyZXR1cm4gZ2V0V2luZG93TmFtZXMoaXQpO1xuICByZXR1cm4gZ2V0TmFtZXModG9JT2JqZWN0KGl0KSk7XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGYgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYodHlwZW9mIF9fZyA9PSAnbnVtYmVyJylfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuICQuc2V0RGVzYyhvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIGFyZ3MsIHRoYXQpe1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuICAgICAgICAgICAgICBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxuICAsIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTsiLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbihhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwiLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBmbG9vciAgICA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzSW50ZWdlcihpdCl7XG4gIHJldHVybiAhaXNPYmplY3QoaXQpICYmIGlzRmluaXRlKGl0KSAmJiBmbG9vcihpdCkgPT09IGl0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07IiwiLy8gNy4yLjggSXNSZWdFeHAoYXJndW1lbnQpXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBjb2YgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIE1BVENIICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdtYXRjaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHZhciBpc1JlZ0V4cDtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiAoKGlzUmVnRXhwID0gaXRbTUFUQ0hdKSAhPT0gdW5kZWZpbmVkID8gISFpc1JlZ0V4cCA6IGNvZihpdCkgPT0gJ1JlZ0V4cCcpO1xufTsiLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpe1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2goZSl7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZihyZXQgIT09IHVuZGVmaW5lZClhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBkZXNjcmlwdG9yICAgICA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vJC5oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24oKXsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KXtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTsiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgPSByZXF1aXJlKCcuLyQubGlicmFyeScpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vJC5yZWRlZmluZScpXG4gICwgaGlkZSAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGlkZScpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsICRpdGVyQ3JlYXRlICAgID0gcmVxdWlyZSgnLi8kLml0ZXItY3JlYXRlJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG8gICAgICAgPSByZXF1aXJlKCcuLyQnKS5nZXRQcm90b1xuICAsIElURVJBVE9SICAgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgbWV0aG9kcywga2V5O1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRuYXRpdmUpe1xuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvKCRkZWZhdWx0LmNhbGwobmV3IEJhc2UpKTtcbiAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgLy8gRkYgZml4XG4gICAgaWYoIUxJQlJBUlkgJiYgaGFzKHByb3RvLCBGRl9JVEVSQVRPUikpaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgICBpZihERUZfVkFMVUVTICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKXsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgICB9XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKXtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddICA9IHJldHVyblRoaXM7XG4gIGlmKERFRkFVTFQpe1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6ICBERUZfVkFMVUVTICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgICA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpXG4gICAgfTtcbiAgICBpZihGT1JDRUQpZm9yKGtleSBpbiBtZXRob2RzKXtcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSlyZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59OyIsInZhciBJVEVSQVRPUiAgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHNhZmUgPSB0cnVlOyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJ2YXIgJE9iamVjdCA9IE9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6ICAgICAkT2JqZWN0LmNyZWF0ZSxcbiAgZ2V0UHJvdG86ICAgJE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgaXNFbnVtOiAgICAge30ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gIGdldERlc2M6ICAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBzZXREZXNjOiAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICBzZXREZXNjczogICAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXG4gIGdldEtleXM6ICAgICRPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICBnZXRTeW1ib2xzOiAkT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgZWFjaDogICAgICAgW10uZm9yRWFjaFxufTsiLCJ2YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIGVsKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7IiwiLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcbm1vZHVsZS5leHBvcnRzID0gTWF0aC5leHBtMSB8fCBmdW5jdGlvbiBleHBtMSh4KXtcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogeCA+IC0xZS02ICYmIHggPCAxZS02ID8geCArIHggKiB4IC8gMiA6IE1hdGguZXhwKHgpIC0gMTtcbn07IiwiLy8gMjAuMi4yLjIwIE1hdGgubG9nMXAoeClcbm1vZHVsZS5leHBvcnRzID0gTWF0aC5sb2cxcCB8fCBmdW5jdGlvbiBsb2cxcCh4KXtcbiAgcmV0dXJuICh4ID0gK3gpID4gLTFlLTggJiYgeCA8IDFlLTggPyB4IC0geCAqIHggLyAyIDogTWF0aC5sb2coMSArIHgpO1xufTsiLCIvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXG5tb2R1bGUuZXhwb3J0cyA9IE1hdGguc2lnbiB8fCBmdW5jdGlvbiBzaWduKHgpe1xuICByZXR1cm4gKHggPSAreCkgPT0gMCB8fCB4ICE9IHggPyB4IDogeCA8IDAgPyAtMSA6IDE7XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuLyQudGFzaycpLnNldFxuICAsIE9ic2VydmVyICA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyXG4gICwgcHJvY2VzcyAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBQcm9taXNlICAgPSBnbG9iYWwuUHJvbWlzZVxuICAsIGlzTm9kZSAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbnZhciBmbHVzaCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBwYXJlbnQsIGRvbWFpbiwgZm47XG4gIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXtcbiAgICBwcm9jZXNzLmRvbWFpbiA9IG51bGw7XG4gICAgcGFyZW50LmV4aXQoKTtcbiAgfVxuICB3aGlsZShoZWFkKXtcbiAgICBkb21haW4gPSBoZWFkLmRvbWFpbjtcbiAgICBmbiAgICAgPSBoZWFkLmZuO1xuICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICBmbigpOyAvLyA8LSBjdXJyZW50bHkgd2UgdXNlIGl0IG9ubHkgZm9yIFByb21pc2UgLSB0cnkgLyBjYXRjaCBub3QgcmVxdWlyZWRcbiAgICBpZihkb21haW4pZG9tYWluLmV4aXQoKTtcbiAgICBoZWFkID0gaGVhZC5uZXh0O1xuICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gIGlmKHBhcmVudClwYXJlbnQuZW50ZXIoKTtcbn07XG5cbi8vIE5vZGUuanNcbmlmKGlzTm9kZSl7XG4gIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gIH07XG4vLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbn0gZWxzZSBpZihPYnNlcnZlcil7XG4gIHZhciB0b2dnbGUgPSAxXG4gICAgLCBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7Y2hhcmFjdGVyRGF0YTogdHJ1ZX0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9IC10b2dnbGU7XG4gIH07XG4vLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxufSBlbHNlIGlmKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKXtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKGZsdXNoKTtcbiAgfTtcbi8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4vLyAtIHNldEltbWVkaWF0ZVxuLy8gLSBNZXNzYWdlQ2hhbm5lbFxuLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2Vcbi8vIC0gc2V0VGltZW91dFxufSBlbHNlIHtcbiAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYXNhcChmbil7XG4gIHZhciB0YXNrID0ge2ZuOiBmbiwgbmV4dDogdW5kZWZpbmVkLCBkb21haW46IGlzTm9kZSAmJiBwcm9jZXNzLmRvbWFpbn07XG4gIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgaWYoIWhlYWQpe1xuICAgIGhlYWQgPSB0YXNrO1xuICAgIG5vdGlmeSgpO1xuICB9IGxhc3QgPSB0YXNrO1xufTsiLCIvLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLW9iamVjdCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIGEgPSBPYmplY3QuYXNzaWduXG4gICAgLCBBID0ge31cbiAgICAsIEIgPSB7fVxuICAgICwgUyA9IFN5bWJvbCgpXG4gICAgLCBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24oayl7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuIGEoe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoYSh7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgICAgID0gdG9PYmplY3QodGFyZ2V0KVxuICAgICwgJCQgICAgPSBhcmd1bWVudHNcbiAgICAsICQkbGVuID0gJCQubGVuZ3RoXG4gICAgLCBpbmRleCA9IDFcbiAgICAsIGdldEtleXMgICAgPSAkLmdldEtleXNcbiAgICAsIGdldFN5bWJvbHMgPSAkLmdldFN5bWJvbHNcbiAgICAsIGlzRW51bSAgICAgPSAkLmlzRW51bTtcbiAgd2hpbGUoJCRsZW4gPiBpbmRleCl7XG4gICAgdmFyIFMgICAgICA9IElPYmplY3QoJCRbaW5kZXgrK10pXG4gICAgICAsIGtleXMgICA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaiAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gailpZihpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKVRba2V5XSA9IFNba2V5XTtcbiAgfVxuICByZXR1cm4gVDtcbn0gOiBPYmplY3QuYXNzaWduOyIsIi8vIG1vc3QgT2JqZWN0IG1ldGhvZHMgYnkgRVM2IHNob3VsZCBhY2NlcHQgcHJpbWl0aXZlc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBjb3JlICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsIGZhaWxzICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZLCBleGVjKXtcbiAgdmFyIGZuICA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXVxuICAgICwgZXhwID0ge307XG4gIGV4cFtLRVldID0gZXhlYyhmbik7XG4gICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24oKXsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07IiwidmFyICQgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKVxuICAsIGlzRW51bSAgICA9ICQuaXNFbnVtO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpc0VudHJpZXMpe1xuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoaXQpXG4gICAgICAsIGtleXMgICA9ICQuZ2V0S2V5cyhPKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBpICAgICAgPSAwXG4gICAgICAsIHJlc3VsdCA9IFtdXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKE8sIGtleSA9IGtleXNbaSsrXSkpe1xuICAgICAgcmVzdWx0LnB1c2goaXNFbnRyaWVzID8gW2tleSwgT1trZXldXSA6IE9ba2V5XSk7XG4gICAgfSByZXR1cm4gcmVzdWx0O1xuICB9O1xufTsiLCIvLyBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGVzIG5vbi1lbnVtZXJhYmxlIGFuZCBzeW1ib2xzXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgUmVmbGVjdCAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJykuUmVmbGVjdDtcbm1vZHVsZS5leHBvcnRzID0gUmVmbGVjdCAmJiBSZWZsZWN0Lm93bktleXMgfHwgZnVuY3Rpb24gb3duS2V5cyhpdCl7XG4gIHZhciBrZXlzICAgICAgID0gJC5nZXROYW1lcyhhbk9iamVjdChpdCkpXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzO1xuICByZXR1cm4gZ2V0U3ltYm9scyA/IGtleXMuY29uY2F0KGdldFN5bWJvbHMoaXQpKSA6IGtleXM7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBwYXRoICAgICAgPSByZXF1aXJlKCcuLyQucGF0aCcpXG4gICwgaW52b2tlICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oLyogLi4ucGFyZ3MgKi8pe1xuICB2YXIgZm4gICAgID0gYUZ1bmN0aW9uKHRoaXMpXG4gICAgLCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBwYXJncyAgPSBBcnJheShsZW5ndGgpXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBfICAgICAgPSBwYXRoLl9cbiAgICAsIGhvbGRlciA9IGZhbHNlO1xuICB3aGlsZShsZW5ndGggPiBpKWlmKChwYXJnc1tpXSA9IGFyZ3VtZW50c1tpKytdKSA9PT0gXylob2xkZXIgPSB0cnVlO1xuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgdmFyIHRoYXQgID0gdGhpc1xuICAgICAgLCAkJCAgICA9IGFyZ3VtZW50c1xuICAgICAgLCAkJGxlbiA9ICQkLmxlbmd0aFxuICAgICAgLCBqID0gMCwgayA9IDAsIGFyZ3M7XG4gICAgaWYoIWhvbGRlciAmJiAhJCRsZW4pcmV0dXJuIGludm9rZShmbiwgcGFyZ3MsIHRoYXQpO1xuICAgIGFyZ3MgPSBwYXJncy5zbGljZSgpO1xuICAgIGlmKGhvbGRlcilmb3IoO2xlbmd0aCA+IGo7IGorKylpZihhcmdzW2pdID09PSBfKWFyZ3Nbal0gPSAkJFtrKytdO1xuICAgIHdoaWxlKCQkbGVuID4gaylhcmdzLnB1c2goJCRbaysrXSk7XG4gICAgcmV0dXJuIGludm9rZShmbiwgYXJncywgdGhhdCk7XG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07IiwiLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmdcbi8vIGZvciBjb3JyZWN0IHdvcmsgd3JhcHBlZCBtZXRob2RzIC8gY29uc3RydWN0b3JzIHdpdGggbWV0aG9kcyBsaWtlIExvRGFzaCBpc05hdGl2ZVxudmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vJC5oaWRlJylcbiAgLCBTUkMgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykoJ3NyYycpXG4gICwgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJ1xuICAsICR0b1N0cmluZyA9IEZ1bmN0aW9uW1RPX1NUUklOR11cbiAgLCBUUEwgICAgICAgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vJC5jb3JlJykuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKE8sIGtleSwgdmFsLCBzYWZlKXtcbiAgaWYodHlwZW9mIHZhbCA9PSAnZnVuY3Rpb24nKXtcbiAgICB2YWwuaGFzT3duUHJvcGVydHkoU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gICAgdmFsLmhhc093blByb3BlcnR5KCduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgfVxuICBpZihPID09PSBnbG9iYWwpe1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBpZighc2FmZSlkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZWdFeHAsIHJlcGxhY2Upe1xuICB2YXIgcmVwbGFjZXIgPSByZXBsYWNlID09PSBPYmplY3QocmVwbGFjZSkgPyBmdW5jdGlvbihwYXJ0KXtcbiAgICByZXR1cm4gcmVwbGFjZVtwYXJ0XTtcbiAgfSA6IHJlcGxhY2U7XG4gIHJldHVybiBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIFN0cmluZyhpdCkucmVwbGFjZShyZWdFeHAsIHJlcGxhY2VyKTtcbiAgfTtcbn07IiwiLy8gNy4yLjkgU2FtZVZhbHVlKHgsIHkpXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5pcyB8fCBmdW5jdGlvbiBpcyh4LCB5KXtcbiAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XG59OyIsIi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cbnZhciBnZXREZXNjICA9IHJlcXVpcmUoJy4vJCcpLmdldERlc2NcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24oTywgcHJvdG8pe1xuICBhbk9iamVjdChPKTtcbiAgaWYoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCl0aHJvdyBUeXBlRXJyb3IocHJvdG8gKyBcIjogY2FuJ3Qgc2V0IGFzIHByb3RvdHlwZSFcIik7XG59O1xubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSA/IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcbiAgICBmdW5jdGlvbih0ZXN0LCBidWdneSwgc2V0KXtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBnZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgJCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJylcbiAgLCBTUEVDSUVTICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSl7XG4gIHZhciBDID0gZ2xvYmFsW0tFWV07XG4gIGlmKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pJC5zZXREZXNjKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vJCcpLnNldERlc2NcbiAgLCBoYXMgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIHRhZywgc3RhdCl7XG4gIGlmKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpZGVmKGl0LCBUQUcsIHtjb25maWd1cmFibGU6IHRydWUsIHZhbHVlOiB0YWd9KTtcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi8kLmEtZnVuY3Rpb24nKVxuICAsIFNQRUNJRVMgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpdGhyb3cgVHlwZUVycm9yKG5hbWUgKyBcIjogdXNlIHRoZSAnbmV3JyBvcGVyYXRvciFcIik7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBkZWZpbmVkICAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCIvLyBoZWxwZXIgZm9yIFN0cmluZyN7c3RhcnRzV2l0aCwgZW5kc1dpdGgsIGluY2x1ZGVzfVxudmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi8kLmlzLXJlZ2V4cCcpXG4gICwgZGVmaW5lZCAgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHRoYXQsIHNlYXJjaFN0cmluZywgTkFNRSl7XG4gIGlmKGlzUmVnRXhwKHNlYXJjaFN0cmluZykpdGhyb3cgVHlwZUVycm9yKCdTdHJpbmcjJyArIE5BTUUgKyBcIiBkb2Vzbid0IGFjY2VwdCByZWdleCFcIik7XG4gIHJldHVybiBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG59OyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9samhhcmIvcHJvcG9zYWwtc3RyaW5nLXBhZC1sZWZ0LXJpZ2h0XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCByZXBlYXQgICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctcmVwZWF0JylcbiAgLCBkZWZpbmVkICA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGhhdCwgbWF4TGVuZ3RoLCBmaWxsU3RyaW5nLCBsZWZ0KXtcbiAgdmFyIFMgICAgICAgICAgICA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKVxuICAgICwgc3RyaW5nTGVuZ3RoID0gUy5sZW5ndGhcbiAgICAsIGZpbGxTdHIgICAgICA9IGZpbGxTdHJpbmcgPT09IHVuZGVmaW5lZCA/ICcgJyA6IFN0cmluZyhmaWxsU3RyaW5nKVxuICAgICwgaW50TWF4TGVuZ3RoID0gdG9MZW5ndGgobWF4TGVuZ3RoKTtcbiAgaWYoaW50TWF4TGVuZ3RoIDw9IHN0cmluZ0xlbmd0aClyZXR1cm4gUztcbiAgaWYoZmlsbFN0ciA9PSAnJylmaWxsU3RyID0gJyAnO1xuICB2YXIgZmlsbExlbiA9IGludE1heExlbmd0aCAtIHN0cmluZ0xlbmd0aFxuICAgICwgc3RyaW5nRmlsbGVyID0gcmVwZWF0LmNhbGwoZmlsbFN0ciwgTWF0aC5jZWlsKGZpbGxMZW4gLyBmaWxsU3RyLmxlbmd0aCkpO1xuICBpZihzdHJpbmdGaWxsZXIubGVuZ3RoID4gZmlsbExlbilzdHJpbmdGaWxsZXIgPSBzdHJpbmdGaWxsZXIuc2xpY2UoMCwgZmlsbExlbik7XG4gIHJldHVybiBsZWZ0ID8gc3RyaW5nRmlsbGVyICsgUyA6IFMgKyBzdHJpbmdGaWxsZXI7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi8kLmRlZmluZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZXBlYXQoY291bnQpe1xuICB2YXIgc3RyID0gU3RyaW5nKGRlZmluZWQodGhpcykpXG4gICAgLCByZXMgPSAnJ1xuICAgICwgbiAgID0gdG9JbnRlZ2VyKGNvdW50KTtcbiAgaWYobiA8IDAgfHwgbiA9PSBJbmZpbml0eSl0aHJvdyBSYW5nZUVycm9yKFwiQ291bnQgY2FuJ3QgYmUgbmVnYXRpdmVcIik7XG4gIGZvcig7biA+IDA7IChuID4+Pj0gMSkgJiYgKHN0ciArPSBzdHIpKWlmKG4gJiAxKXJlcyArPSBzdHI7XG4gIHJldHVybiByZXM7XG59OyIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJylcbiAgLCBmYWlscyAgID0gcmVxdWlyZSgnLi8kLmZhaWxzJylcbiAgLCBzcGFjZXMgID0gJ1xceDA5XFx4MEFcXHgwQlxceDBDXFx4MERcXHgyMFxceEEwXFx1MTY4MFxcdTE4MEVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzJyArXG4gICAgICAnXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjhcXHUyMDI5XFx1RkVGRidcbiAgLCBzcGFjZSAgID0gJ1snICsgc3BhY2VzICsgJ10nXG4gICwgbm9uICAgICA9ICdcXHUyMDBiXFx1MDA4NSdcbiAgLCBsdHJpbSAgID0gUmVnRXhwKCdeJyArIHNwYWNlICsgc3BhY2UgKyAnKicpXG4gICwgcnRyaW0gICA9IFJlZ0V4cChzcGFjZSArIHNwYWNlICsgJyokJyk7XG5cbnZhciBleHBvcnRlciA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBleHAgID0ge307XG4gIGV4cFtLRVldID0gZXhlYyh0cmltKTtcbiAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbigpe1xuICAgIHJldHVybiAhIXNwYWNlc1tLRVldKCkgfHwgbm9uW0tFWV0oKSAhPSBub247XG4gIH0pLCAnU3RyaW5nJywgZXhwKTtcbn07XG5cbi8vIDEgLT4gU3RyaW5nI3RyaW1MZWZ0XG4vLyAyIC0+IFN0cmluZyN0cmltUmlnaHRcbi8vIDMgLT4gU3RyaW5nI3RyaW1cbnZhciB0cmltID0gZXhwb3J0ZXIudHJpbSA9IGZ1bmN0aW9uKHN0cmluZywgVFlQRSl7XG4gIHN0cmluZyA9IFN0cmluZyhkZWZpbmVkKHN0cmluZykpO1xuICBpZihUWVBFICYgMSlzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShsdHJpbSwgJycpO1xuICBpZihUWVBFICYgMilzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShydHJpbSwgJycpO1xuICByZXR1cm4gc3RyaW5nO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRlcjsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgaW52b2tlICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgaHRtbCAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmh0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kb20tY3JlYXRlJylcbiAgLCBnbG9iYWwgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsIHNldFRhc2sgICAgICAgICAgICA9IGdsb2JhbC5zZXRJbW1lZGlhdGVcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcbiAgLCBNZXNzYWdlQ2hhbm5lbCAgICAgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWxcbiAgLCBjb3VudGVyICAgICAgICAgICAgPSAwXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cbiAgLCBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJ1xuICAsIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uKCl7XG4gIHZhciBpZCA9ICt0aGlzO1xuICBpZihxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpe1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdG5lciA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYoIXNldFRhc2sgfHwgIWNsZWFyVGFzayl7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pe1xuICAgIHZhciBhcmdzID0gW10sIGkgPSAxO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpe1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZihyZXF1aXJlKCcuLyQuY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZihNZXNzYWdlQ2hhbm5lbCl7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbDtcbiAgICBwb3J0ICAgID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vJC50by1pbnRlZ2VyJylcbiAgLCBtYXggICAgICAgPSBNYXRoLm1heFxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07IiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCAgPSBNYXRoLmNlaWxcbiAgLCBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLyQudG8taW50ZWdlcicpXG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07IiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuLyQuZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcclxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpO1xyXG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxyXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcclxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiBpdDtcclxuICB2YXIgZm4sIHZhbDtcclxuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XHJcbiAgaWYodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xyXG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XHJcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xyXG59OyIsInZhciBpZCA9IDBcbiAgLCBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59OyIsInZhciBzdG9yZSAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJykoJ3drcycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpXG4gICwgU3ltYm9sID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLlN5bWJvbDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFN5bWJvbCAmJiBTeW1ib2xbbmFtZV0gfHwgKFN5bWJvbCB8fCB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vJC5jbGFzc29mJylcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLyQuaXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ICE9IHVuZGVmaW5lZClyZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciAkICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGV4cG9ydCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBERVNDUklQVE9SUyAgICAgICA9IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpXG4gICwgY3JlYXRlRGVzYyAgICAgICAgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpXG4gICwgaHRtbCAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaHRtbCcpXG4gICwgY2VsICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZG9tLWNyZWF0ZScpXG4gICwgaGFzICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBjb2YgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIGludm9rZSAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmludm9rZScpXG4gICwgZmFpbHMgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKVxuICAsIGFuT2JqZWN0ICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICAgICAgICAgPSByZXF1aXJlKCcuLyQuYS1mdW5jdGlvbicpXG4gICwgaXNPYmplY3QgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCB0b09iamVjdCAgICAgICAgICA9IHJlcXVpcmUoJy4vJC50by1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgICAgID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKVxuICAsIHRvSW50ZWdlciAgICAgICAgID0gcmVxdWlyZSgnLi8kLnRvLWludGVnZXInKVxuICAsIHRvSW5kZXggICAgICAgICAgID0gcmVxdWlyZSgnLi8kLnRvLWluZGV4JylcbiAgLCB0b0xlbmd0aCAgICAgICAgICA9IHJlcXVpcmUoJy4vJC50by1sZW5ndGgnKVxuICAsIElPYmplY3QgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmlvYmplY3QnKVxuICAsIElFX1BST1RPICAgICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpKCdfX3Byb3RvX18nKVxuICAsIGNyZWF0ZUFycmF5TWV0aG9kID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKVxuICAsIGFycmF5SW5kZXhPZiAgICAgID0gcmVxdWlyZSgnLi8kLmFycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgT2JqZWN0UHJvdG8gICAgICAgPSBPYmplY3QucHJvdG90eXBlXG4gICwgQXJyYXlQcm90byAgICAgICAgPSBBcnJheS5wcm90b3R5cGVcbiAgLCBhcnJheVNsaWNlICAgICAgICA9IEFycmF5UHJvdG8uc2xpY2VcbiAgLCBhcnJheUpvaW4gICAgICAgICA9IEFycmF5UHJvdG8uam9pblxuICAsIGRlZmluZVByb3BlcnR5ICAgID0gJC5zZXREZXNjXG4gICwgZ2V0T3duRGVzY3JpcHRvciAgPSAkLmdldERlc2NcbiAgLCBkZWZpbmVQcm9wZXJ0aWVzICA9ICQuc2V0RGVzY3NcbiAgLCBmYWN0b3JpZXMgICAgICAgICA9IHt9XG4gICwgSUU4X0RPTV9ERUZJTkU7XG5cbmlmKCFERVNDUklQVE9SUyl7XG4gIElFOF9ET01fREVGSU5FID0gIWZhaWxzKGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KGNlbCgnZGl2JyksICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG4gIH0pO1xuICAkLnNldERlc2MgPSBmdW5jdGlvbihPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgICAgcmV0dXJuIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xuICAgIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpYW5PYmplY3QoTylbUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICAgIHJldHVybiBPO1xuICB9O1xuICAkLmdldERlc2MgPSBmdW5jdGlvbihPLCBQKXtcbiAgICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgICAgcmV0dXJuIGdldE93bkRlc2NyaXB0b3IoTywgUCk7XG4gICAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICAgIGlmKGhhcyhPLCBQKSlyZXR1cm4gY3JlYXRlRGVzYyghT2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChPLCBQKSwgT1tQXSk7XG4gIH07XG4gICQuc2V0RGVzY3MgPSBkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24oTywgUHJvcGVydGllcyl7XG4gICAgYW5PYmplY3QoTyk7XG4gICAgdmFyIGtleXMgICA9ICQuZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBpID0gMFxuICAgICAgLCBQO1xuICAgIHdoaWxlKGxlbmd0aCA+IGkpJC5zZXREZXNjKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICAgIHJldHVybiBPO1xuICB9O1xufVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhREVTQ1JJUFRPUlMsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi42IC8gMTUuMi4zLjMgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICQuZ2V0RGVzYyxcbiAgLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICQuc2V0RGVzYyxcbiAgLy8gMTkuMS4yLjMgLyAxNS4yLjMuNyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiBkZWZpbmVQcm9wZXJ0aWVzXG59KTtcblxuICAvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG52YXIga2V5czEgPSAoJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsJyArXG4gICAgICAgICAgICAndG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZicpLnNwbGl0KCcsJylcbiAgLy8gQWRkaXRpb25hbCBrZXlzIGZvciBnZXRPd25Qcm9wZXJ0eU5hbWVzXG4gICwga2V5czIgPSBrZXlzMS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKVxuICAsIGtleXNMZW4xID0ga2V5czEubGVuZ3RoO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gY2VsKCdpZnJhbWUnKVxuICAgICwgaSAgICAgID0ga2V5c0xlbjFcbiAgICAsIGd0ICAgICA9ICc+J1xuICAgICwgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBodG1sLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKCc8c2NyaXB0PmRvY3VtZW50LkY9T2JqZWN0PC9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0LnByb3RvdHlwZVtrZXlzMVtpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xudmFyIGNyZWF0ZUdldEtleXMgPSBmdW5jdGlvbihuYW1lcywgbGVuZ3RoKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgICAsIGkgICAgICA9IDBcbiAgICAgICwgcmVzdWx0ID0gW11cbiAgICAgICwga2V5O1xuICAgIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gICAgd2hpbGUobGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xuICAgICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG52YXIgRW1wdHkgPSBmdW5jdGlvbigpe307XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbiAgZ2V0UHJvdG90eXBlT2Y6ICQuZ2V0UHJvdG8gPSAkLmdldFByb3RvIHx8IGZ1bmN0aW9uKE8pe1xuICAgIE8gPSB0b09iamVjdChPKTtcbiAgICBpZihoYXMoTywgSUVfUFJPVE8pKXJldHVybiBPW0lFX1BST1RPXTtcbiAgICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xuICB9LFxuICAvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICQuZ2V0TmFtZXMgPSAkLmdldE5hbWVzIHx8IGNyZWF0ZUdldEtleXMoa2V5czIsIGtleXMyLmxlbmd0aCwgdHJ1ZSksXG4gIC8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICQuY3JlYXRlID0gJC5jcmVhdGUgfHwgZnVuY3Rpb24oTywgLyo/Ki9Qcm9wZXJ0aWVzKXtcbiAgICB2YXIgcmVzdWx0O1xuICAgIGlmKE8gIT09IG51bGwpe1xuICAgICAgRW1wdHkucHJvdG90eXBlID0gYW5PYmplY3QoTyk7XG4gICAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICAgIEVtcHR5LnByb3RvdHlwZSA9IG51bGw7XG4gICAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHNoaW1cbiAgICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICAgIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gICAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRlZmluZVByb3BlcnRpZXMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbiAgfSxcbiAgLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG4gIGtleXM6ICQuZ2V0S2V5cyA9ICQuZ2V0S2V5cyB8fCBjcmVhdGVHZXRLZXlzKGtleXMxLCBrZXlzTGVuMSwgZmFsc2UpXG59KTtcblxudmFyIGNvbnN0cnVjdCA9IGZ1bmN0aW9uKEYsIGxlbiwgYXJncyl7XG4gIGlmKCEobGVuIGluIGZhY3Rvcmllcykpe1xuICAgIGZvcih2YXIgbiA9IFtdLCBpID0gMDsgaSA8IGxlbjsgaSsrKW5baV0gPSAnYVsnICsgaSArICddJztcbiAgICBmYWN0b3JpZXNbbGVuXSA9IEZ1bmN0aW9uKCdGLGEnLCAncmV0dXJuIG5ldyBGKCcgKyBuLmpvaW4oJywnKSArICcpJyk7XG4gIH1cbiAgcmV0dXJuIGZhY3Rvcmllc1tsZW5dKEYsIGFyZ3MpO1xufTtcblxuLy8gMTkuMi4zLjIgLyAxNS4zLjQuNSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCh0aGlzQXJnLCBhcmdzLi4uKVxuJGV4cG9ydCgkZXhwb3J0LlAsICdGdW5jdGlvbicsIHtcbiAgYmluZDogZnVuY3Rpb24gYmluZCh0aGF0IC8qLCBhcmdzLi4uICovKXtcbiAgICB2YXIgZm4gICAgICAgPSBhRnVuY3Rpb24odGhpcylcbiAgICAgICwgcGFydEFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICB2YXIgYm91bmQgPSBmdW5jdGlvbigvKiBhcmdzLi4uICovKXtcbiAgICAgIHZhciBhcmdzID0gcGFydEFyZ3MuY29uY2F0KGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgYm91bmQgPyBjb25zdHJ1Y3QoZm4sIGFyZ3MubGVuZ3RoLCBhcmdzKSA6IGludm9rZShmbiwgYXJncywgdGhhdCk7XG4gICAgfTtcbiAgICBpZihpc09iamVjdChmbi5wcm90b3R5cGUpKWJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcbiAgICByZXR1cm4gYm91bmQ7XG4gIH1cbn0pO1xuXG4vLyBmYWxsYmFjayBmb3Igbm90IGFycmF5LWxpa2UgRVMzIHN0cmluZ3MgYW5kIERPTSBvYmplY3RzXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7XG4gIGlmKGh0bWwpYXJyYXlTbGljZS5jYWxsKGh0bWwpO1xufSksICdBcnJheScsIHtcbiAgc2xpY2U6IGZ1bmN0aW9uKGJlZ2luLCBlbmQpe1xuICAgIHZhciBsZW4gICA9IHRvTGVuZ3RoKHRoaXMubGVuZ3RoKVxuICAgICAgLCBrbGFzcyA9IGNvZih0aGlzKTtcbiAgICBlbmQgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbiA6IGVuZDtcbiAgICBpZihrbGFzcyA9PSAnQXJyYXknKXJldHVybiBhcnJheVNsaWNlLmNhbGwodGhpcywgYmVnaW4sIGVuZCk7XG4gICAgdmFyIHN0YXJ0ICA9IHRvSW5kZXgoYmVnaW4sIGxlbilcbiAgICAgICwgdXBUbyAgID0gdG9JbmRleChlbmQsIGxlbilcbiAgICAgICwgc2l6ZSAgID0gdG9MZW5ndGgodXBUbyAtIHN0YXJ0KVxuICAgICAgLCBjbG9uZWQgPSBBcnJheShzaXplKVxuICAgICAgLCBpICAgICAgPSAwO1xuICAgIGZvcig7IGkgPCBzaXplOyBpKyspY2xvbmVkW2ldID0ga2xhc3MgPT0gJ1N0cmluZydcbiAgICAgID8gdGhpcy5jaGFyQXQoc3RhcnQgKyBpKVxuICAgICAgOiB0aGlzW3N0YXJ0ICsgaV07XG4gICAgcmV0dXJuIGNsb25lZDtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChJT2JqZWN0ICE9IE9iamVjdCksICdBcnJheScsIHtcbiAgam9pbjogZnVuY3Rpb24gam9pbihzZXBhcmF0b3Ipe1xuICAgIHJldHVybiBhcnJheUpvaW4uY2FsbChJT2JqZWN0KHRoaXMpLCBzZXBhcmF0b3IgPT09IHVuZGVmaW5lZCA/ICcsJyA6IHNlcGFyYXRvcik7XG4gIH1cbn0pO1xuXG4vLyAyMi4xLjIuMiAvIDE1LjQuMy4yIEFycmF5LmlzQXJyYXkoYXJnKVxuJGV4cG9ydCgkZXhwb3J0LlMsICdBcnJheScsIHtpc0FycmF5OiByZXF1aXJlKCcuLyQuaXMtYXJyYXknKX0pO1xuXG52YXIgY3JlYXRlQXJyYXlSZWR1Y2UgPSBmdW5jdGlvbihpc1JpZ2h0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGNhbGxiYWNrZm4sIG1lbW8pe1xuICAgIGFGdW5jdGlvbihjYWxsYmFja2ZuKTtcbiAgICB2YXIgTyAgICAgID0gSU9iamVjdCh0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gaXNSaWdodCA/IGxlbmd0aCAtIDEgOiAwXG4gICAgICAsIGkgICAgICA9IGlzUmlnaHQgPyAtMSA6IDE7XG4gICAgaWYoYXJndW1lbnRzLmxlbmd0aCA8IDIpZm9yKDs7KXtcbiAgICAgIGlmKGluZGV4IGluIE8pe1xuICAgICAgICBtZW1vID0gT1tpbmRleF07XG4gICAgICAgIGluZGV4ICs9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXggKz0gaTtcbiAgICAgIGlmKGlzUmlnaHQgPyBpbmRleCA8IDAgOiBsZW5ndGggPD0gaW5kZXgpe1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZm9yKDtpc1JpZ2h0ID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4OyBpbmRleCArPSBpKWlmKGluZGV4IGluIE8pe1xuICAgICAgbWVtbyA9IGNhbGxiYWNrZm4obWVtbywgT1tpbmRleF0sIGluZGV4LCB0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59O1xuXG52YXIgbWV0aG9kaXplID0gZnVuY3Rpb24oJGZuKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKGFyZzEvKiwgYXJnMiA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmbih0aGlzLCBhcmcxLCBhcmd1bWVudHNbMV0pO1xuICB9O1xufTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjEwIC8gMTUuNC40LjE4IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIGZvckVhY2g6ICQuZWFjaCA9ICQuZWFjaCB8fCBtZXRob2RpemUoY3JlYXRlQXJyYXlNZXRob2QoMCkpLFxuICAvLyAyMi4xLjMuMTUgLyAxNS40LjQuMTkgQXJyYXkucHJvdG90eXBlLm1hcChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBtYXA6IG1ldGhvZGl6ZShjcmVhdGVBcnJheU1ldGhvZCgxKSksXG4gIC8vIDIyLjEuMy43IC8gMTUuNC40LjIwIEFycmF5LnByb3RvdHlwZS5maWx0ZXIoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgZmlsdGVyOiBtZXRob2RpemUoY3JlYXRlQXJyYXlNZXRob2QoMikpLFxuICAvLyAyMi4xLjMuMjMgLyAxNS40LjQuMTcgQXJyYXkucHJvdG90eXBlLnNvbWUoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgc29tZTogbWV0aG9kaXplKGNyZWF0ZUFycmF5TWV0aG9kKDMpKSxcbiAgLy8gMjIuMS4zLjUgLyAxNS40LjQuMTYgQXJyYXkucHJvdG90eXBlLmV2ZXJ5KGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIGV2ZXJ5OiBtZXRob2RpemUoY3JlYXRlQXJyYXlNZXRob2QoNCkpLFxuICAvLyAyMi4xLjMuMTggLyAxNS40LjQuMjEgQXJyYXkucHJvdG90eXBlLnJlZHVjZShjYWxsYmFja2ZuIFssIGluaXRpYWxWYWx1ZV0pXG4gIHJlZHVjZTogY3JlYXRlQXJyYXlSZWR1Y2UoZmFsc2UpLFxuICAvLyAyMi4xLjMuMTkgLyAxNS40LjQuMjIgQXJyYXkucHJvdG90eXBlLnJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4gWywgaW5pdGlhbFZhbHVlXSlcbiAgcmVkdWNlUmlnaHQ6IGNyZWF0ZUFycmF5UmVkdWNlKHRydWUpLFxuICAvLyAyMi4xLjMuMTEgLyAxNS40LjQuMTQgQXJyYXkucHJvdG90eXBlLmluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxuICBpbmRleE9mOiBtZXRob2RpemUoYXJyYXlJbmRleE9mKSxcbiAgLy8gMjIuMS4zLjE0IC8gMTUuNC40LjE1IEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXG4gIGxhc3RJbmRleE9mOiBmdW5jdGlvbihlbCwgZnJvbUluZGV4IC8qID0gQFsqLTFdICovKXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSBsZW5ndGggLSAxO1xuICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPiAxKWluZGV4ID0gTWF0aC5taW4oaW5kZXgsIHRvSW50ZWdlcihmcm9tSW5kZXgpKTtcbiAgICBpZihpbmRleCA8IDApaW5kZXggPSB0b0xlbmd0aChsZW5ndGggKyBpbmRleCk7XG4gICAgZm9yKDtpbmRleCA+PSAwOyBpbmRleC0tKWlmKGluZGV4IGluIE8paWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBpbmRleDtcbiAgICByZXR1cm4gLTE7XG4gIH1cbn0pO1xuXG4vLyAyMC4zLjMuMSAvIDE1LjkuNC40IERhdGUubm93KClcbiRleHBvcnQoJGV4cG9ydC5TLCAnRGF0ZScsIHtub3c6IGZ1bmN0aW9uKCl7IHJldHVybiArbmV3IERhdGU7IH19KTtcblxudmFyIGx6ID0gZnVuY3Rpb24obnVtKXtcbiAgcmV0dXJuIG51bSA+IDkgPyBudW0gOiAnMCcgKyBudW07XG59O1xuXG4vLyAyMC4zLjQuMzYgLyAxNS45LjUuNDMgRGF0ZS5wcm90b3R5cGUudG9JU09TdHJpbmcoKVxuLy8gUGhhbnRvbUpTIC8gb2xkIFdlYktpdCBoYXMgYSBicm9rZW4gaW1wbGVtZW50YXRpb25zXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChmYWlscyhmdW5jdGlvbigpe1xuICByZXR1cm4gbmV3IERhdGUoLTVlMTMgLSAxKS50b0lTT1N0cmluZygpICE9ICcwMzg1LTA3LTI1VDA3OjA2OjM5Ljk5OVonO1xufSkgfHwgIWZhaWxzKGZ1bmN0aW9uKCl7XG4gIG5ldyBEYXRlKE5hTikudG9JU09TdHJpbmcoKTtcbn0pKSwgJ0RhdGUnLCB7XG4gIHRvSVNPU3RyaW5nOiBmdW5jdGlvbiB0b0lTT1N0cmluZygpe1xuICAgIGlmKCFpc0Zpbml0ZSh0aGlzKSl0aHJvdyBSYW5nZUVycm9yKCdJbnZhbGlkIHRpbWUgdmFsdWUnKTtcbiAgICB2YXIgZCA9IHRoaXNcbiAgICAgICwgeSA9IGQuZ2V0VVRDRnVsbFllYXIoKVxuICAgICAgLCBtID0gZC5nZXRVVENNaWxsaXNlY29uZHMoKVxuICAgICAgLCBzID0geSA8IDAgPyAnLScgOiB5ID4gOTk5OSA/ICcrJyA6ICcnO1xuICAgIHJldHVybiBzICsgKCcwMDAwMCcgKyBNYXRoLmFicyh5KSkuc2xpY2UocyA/IC02IDogLTQpICtcbiAgICAgICctJyArIGx6KGQuZ2V0VVRDTW9udGgoKSArIDEpICsgJy0nICsgbHooZC5nZXRVVENEYXRlKCkpICtcbiAgICAgICdUJyArIGx6KGQuZ2V0VVRDSG91cnMoKSkgKyAnOicgKyBseihkLmdldFVUQ01pbnV0ZXMoKSkgK1xuICAgICAgJzonICsgbHooZC5nZXRVVENTZWNvbmRzKCkpICsgJy4nICsgKG0gPiA5OSA/IG0gOiAnMCcgKyBseihtKSkgKyAnWic7XG4gIH1cbn0pOyIsIi8vIDIyLjEuMy4zIEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIGVuZCA9IHRoaXMubGVuZ3RoKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7Y29weVdpdGhpbjogcmVxdWlyZSgnLi8kLmFycmF5LWNvcHktd2l0aGluJyl9KTtcblxucmVxdWlyZSgnLi8kLmFkZC10by11bnNjb3BhYmxlcycpKCdjb3B5V2l0aGluJyk7IiwiLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHtmaWxsOiByZXF1aXJlKCcuLyQuYXJyYXktZmlsbCcpfSk7XG5cbnJlcXVpcmUoJy4vJC5hZGQtdG8tdW5zY29wYWJsZXMnKSgnZmlsbCcpOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDIyLjEuMy45IEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXgocHJlZGljYXRlLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCAkZmluZCAgID0gcmVxdWlyZSgnLi8kLmFycmF5LW1ldGhvZHMnKSg2KVxuICAsIEtFWSAgICAgPSAnZmluZEluZGV4J1xuICAsIGZvcmNlZCAgPSB0cnVlO1xuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbmlmKEtFWSBpbiBbXSlBcnJheSgxKVtLRVldKGZ1bmN0aW9uKCl7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmRJbmRleDogZnVuY3Rpb24gZmluZEluZGV4KGNhbGxiYWNrZm4vKiwgdGhhdCA9IHVuZGVmaW5lZCAqLyl7XG4gICAgcmV0dXJuICRmaW5kKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG5yZXF1aXJlKCcuLyQuYWRkLXRvLXVuc2NvcGFibGVzJykoS0VZKTsiLCIndXNlIHN0cmljdCc7XG4vLyAyMi4xLjMuOCBBcnJheS5wcm90b3R5cGUuZmluZChwcmVkaWNhdGUsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsICRmaW5kICAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpKDUpXG4gICwgS0VZICAgICA9ICdmaW5kJ1xuICAsIGZvcmNlZCAgPSB0cnVlO1xuLy8gU2hvdWxkbid0IHNraXAgaG9sZXNcbmlmKEtFWSBpbiBbXSlBcnJheSgxKVtLRVldKGZ1bmN0aW9uKCl7IGZvcmNlZCA9IGZhbHNlOyB9KTtcbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZm9yY2VkLCAnQXJyYXknLCB7XG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQoY2FsbGJhY2tmbi8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcbiAgICByZXR1cm4gJGZpbmQodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbnJlcXVpcmUoJy4vJC5hZGQtdG8tdW5zY29wYWJsZXMnKShLRVkpOyIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsICRleHBvcnQgICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgdG9PYmplY3QgICAgPSByZXF1aXJlKCcuLyQudG8tb2JqZWN0JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyLWNhbGwnKVxuICAsIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi8kLmlzLWFycmF5LWl0ZXInKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi8kLnRvLWxlbmd0aCcpXG4gICwgZ2V0SXRlckZuICAgPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi8kLml0ZXItZGV0ZWN0JykoZnVuY3Rpb24oaXRlcil7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UvKiwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQqLyl7XG4gICAgdmFyIE8gICAgICAgPSB0b09iamVjdChhcnJheUxpa2UpXG4gICAgICAsIEMgICAgICAgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5XG4gICAgICAsICQkICAgICAgPSBhcmd1bWVudHNcbiAgICAgICwgJCRsZW4gICA9ICQkLmxlbmd0aFxuICAgICAgLCBtYXBmbiAgID0gJCRsZW4gPiAxID8gJCRbMV0gOiB1bmRlZmluZWRcbiAgICAgICwgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWRcbiAgICAgICwgaW5kZXggICA9IDBcbiAgICAgICwgaXRlckZuICA9IGdldEl0ZXJGbihPKVxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYobWFwcGluZyltYXBmbiA9IGN0eChtYXBmbiwgJCRsZW4gPiAyID8gJCRbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKXtcbiAgICAgIGZvcihpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQzsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKXtcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgICAgICByZXN1bHRbaW5kZXhdID0gbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuLyQuYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXItc3RlcCcpXG4gICwgSXRlcmF0b3JzICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwga2luZCAgPSB0aGlzLl9rXG4gICAgLCBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpe1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmKGtpbmQgPT0gJ3ZhbHVlcycpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4vLyBXZWJLaXQgQXJyYXkub2YgaXNuJ3QgZ2VuZXJpY1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpe1xuICBmdW5jdGlvbiBGKCl7fVxuICByZXR1cm4gIShBcnJheS5vZi5jYWxsKEYpIGluc3RhbmNlb2YgRik7XG59KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMyBBcnJheS5vZiggLi4uaXRlbXMpXG4gIG9mOiBmdW5jdGlvbiBvZigvKiAuLi5hcmdzICovKXtcbiAgICB2YXIgaW5kZXggID0gMFxuICAgICAgLCAkJCAgICAgPSBhcmd1bWVudHNcbiAgICAgICwgJCRsZW4gID0gJCQubGVuZ3RoXG4gICAgICAsIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkoJCRsZW4pO1xuICAgIHdoaWxlKCQkbGVuID4gaW5kZXgpcmVzdWx0W2luZGV4XSA9ICQkW2luZGV4KytdO1xuICAgIHJlc3VsdC5sZW5ndGggPSAkJGxlbjtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTsiLCJyZXF1aXJlKCcuLyQuc2V0LXNwZWNpZXMnKSgnQXJyYXknKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaXNPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIEhBU19JTlNUQU5DRSAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2hhc0luc3RhbmNlJylcbiAgLCBGdW5jdGlvblByb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuLy8gMTkuMi4zLjYgRnVuY3Rpb24ucHJvdG90eXBlW0BAaGFzSW5zdGFuY2VdKFYpXG5pZighKEhBU19JTlNUQU5DRSBpbiBGdW5jdGlvblByb3RvKSkkLnNldERlc2MoRnVuY3Rpb25Qcm90bywgSEFTX0lOU1RBTkNFLCB7dmFsdWU6IGZ1bmN0aW9uKE8pe1xuICBpZih0eXBlb2YgdGhpcyAhPSAnZnVuY3Rpb24nIHx8ICFpc09iamVjdChPKSlyZXR1cm4gZmFsc2U7XG4gIGlmKCFpc09iamVjdCh0aGlzLnByb3RvdHlwZSkpcmV0dXJuIE8gaW5zdGFuY2VvZiB0aGlzO1xuICAvLyBmb3IgZW52aXJvbm1lbnQgdy9vIG5hdGl2ZSBgQEBoYXNJbnN0YW5jZWAgbG9naWMgZW5vdWdoIGBpbnN0YW5jZW9mYCwgYnV0IGFkZCB0aGlzOlxuICB3aGlsZShPID0gJC5nZXRQcm90byhPKSlpZih0aGlzLnByb3RvdHlwZSA9PT0gTylyZXR1cm4gdHJ1ZTtcbiAgcmV0dXJuIGZhbHNlO1xufX0pOyIsInZhciBzZXREZXNjICAgID0gcmVxdWlyZSgnLi8kJykuc2V0RGVzY1xuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpXG4gICwgaGFzICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIEZQcm90byAgICAgPSBGdW5jdGlvbi5wcm90b3R5cGVcbiAgLCBuYW1lUkUgICAgID0gL15cXHMqZnVuY3Rpb24gKFteIChdKikvXG4gICwgTkFNRSAgICAgICA9ICduYW1lJztcbi8vIDE5LjIuNC4yIG5hbWVcbk5BTUUgaW4gRlByb3RvIHx8IHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpICYmIHNldERlc2MoRlByb3RvLCBOQU1FLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpe1xuICAgIHZhciBtYXRjaCA9ICgnJyArIHRoaXMpLm1hdGNoKG5hbWVSRSlcbiAgICAgICwgbmFtZSAgPSBtYXRjaCA/IG1hdGNoWzFdIDogJyc7XG4gICAgaGFzKHRoaXMsIE5BTUUpIHx8IHNldERlc2ModGhpcywgTkFNRSwgY3JlYXRlRGVzYyg1LCBuYW1lKSk7XG4gICAgcmV0dXJuIG5hbWU7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0JztcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIE1hcCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZywgdHJ1ZSk7IiwiLy8gMjAuMi4yLjMgTWF0aC5hY29zaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBsb2cxcCAgID0gcmVxdWlyZSgnLi8kLm1hdGgtbG9nMXAnKVxuICAsIHNxcnQgICAgPSBNYXRoLnNxcnRcbiAgLCAkYWNvc2ggID0gTWF0aC5hY29zaDtcblxuLy8gVjggYnVnIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zNTA5XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoJGFjb3NoICYmIE1hdGguZmxvb3IoJGFjb3NoKE51bWJlci5NQVhfVkFMVUUpKSA9PSA3MTApLCAnTWF0aCcsIHtcbiAgYWNvc2g6IGZ1bmN0aW9uIGFjb3NoKHgpe1xuICAgIHJldHVybiAoeCA9ICt4KSA8IDEgPyBOYU4gOiB4ID4gOTQ5MDYyNjUuNjI0MjUxNTZcbiAgICAgID8gTWF0aC5sb2coeCkgKyBNYXRoLkxOMlxuICAgICAgOiBsb2cxcCh4IC0gMSArIHNxcnQoeCAtIDEpICogc3FydCh4ICsgMSkpO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuZnVuY3Rpb24gYXNpbmgoeCl7XG4gIHJldHVybiAhaXNGaW5pdGUoeCA9ICt4KSB8fCB4ID09IDAgPyB4IDogeCA8IDAgPyAtYXNpbmgoLXgpIDogTWF0aC5sb2coeCArIE1hdGguc3FydCh4ICogeCArIDEpKTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge2FzaW5oOiBhc2luaH0pOyIsIi8vIDIwLjIuMi43IE1hdGguYXRhbmgoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGF0YW5oOiBmdW5jdGlvbiBhdGFuaCh4KXtcbiAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiBNYXRoLmxvZygoMSArIHgpIC8gKDEgLSB4KSkgLyAyO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuOSBNYXRoLmNicnQoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgc2lnbiAgICA9IHJlcXVpcmUoJy4vJC5tYXRoLXNpZ24nKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBjYnJ0OiBmdW5jdGlvbiBjYnJ0KHgpe1xuICAgIHJldHVybiBzaWduKHggPSAreCkgKiBNYXRoLnBvdyhNYXRoLmFicyh4KSwgMSAvIDMpO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMTEgTWF0aC5jbHozMih4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgY2x6MzI6IGZ1bmN0aW9uIGNsejMyKHgpe1xuICAgIHJldHVybiAoeCA+Pj49IDApID8gMzEgLSBNYXRoLmZsb29yKE1hdGgubG9nKHggKyAwLjUpICogTWF0aC5MT0cyRSkgOiAzMjtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjEyIE1hdGguY29zaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBleHAgICAgID0gTWF0aC5leHA7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtcbiAgY29zaDogZnVuY3Rpb24gY29zaCh4KXtcbiAgICByZXR1cm4gKGV4cCh4ID0gK3gpICsgZXhwKC14KSkgLyAyO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMTQgTWF0aC5leHBtMSh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtleHBtMTogcmVxdWlyZSgnLi8kLm1hdGgtZXhwbTEnKX0pOyIsIi8vIDIwLjIuMi4xNiBNYXRoLmZyb3VuZCh4KVxudmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHNpZ24gICAgICA9IHJlcXVpcmUoJy4vJC5tYXRoLXNpZ24nKVxuICAsIHBvdyAgICAgICA9IE1hdGgucG93XG4gICwgRVBTSUxPTiAgID0gcG93KDIsIC01MilcbiAgLCBFUFNJTE9OMzIgPSBwb3coMiwgLTIzKVxuICAsIE1BWDMyICAgICA9IHBvdygyLCAxMjcpICogKDIgLSBFUFNJTE9OMzIpXG4gICwgTUlOMzIgICAgID0gcG93KDIsIC0xMjYpO1xuXG52YXIgcm91bmRUaWVzVG9FdmVuID0gZnVuY3Rpb24obil7XG4gIHJldHVybiBuICsgMSAvIEVQU0lMT04gLSAxIC8gRVBTSUxPTjtcbn07XG5cblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBmcm91bmQ6IGZ1bmN0aW9uIGZyb3VuZCh4KXtcbiAgICB2YXIgJGFicyAgPSBNYXRoLmFicyh4KVxuICAgICAgLCAkc2lnbiA9IHNpZ24oeClcbiAgICAgICwgYSwgcmVzdWx0O1xuICAgIGlmKCRhYnMgPCBNSU4zMilyZXR1cm4gJHNpZ24gKiByb3VuZFRpZXNUb0V2ZW4oJGFicyAvIE1JTjMyIC8gRVBTSUxPTjMyKSAqIE1JTjMyICogRVBTSUxPTjMyO1xuICAgIGEgPSAoMSArIEVQU0lMT04zMiAvIEVQU0lMT04pICogJGFicztcbiAgICByZXN1bHQgPSBhIC0gKGEgLSAkYWJzKTtcbiAgICBpZihyZXN1bHQgPiBNQVgzMiB8fCByZXN1bHQgIT0gcmVzdWx0KXJldHVybiAkc2lnbiAqIEluZmluaXR5O1xuICAgIHJldHVybiAkc2lnbiAqIHJlc3VsdDtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjE3IE1hdGguaHlwb3QoW3ZhbHVlMVssIHZhbHVlMlssIOKApiBdXV0pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGFicyAgICAgPSBNYXRoLmFicztcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBoeXBvdDogZnVuY3Rpb24gaHlwb3QodmFsdWUxLCB2YWx1ZTIpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHN1bSAgID0gMFxuICAgICAgLCBpICAgICA9IDBcbiAgICAgICwgJCQgICAgPSBhcmd1bWVudHNcbiAgICAgICwgJCRsZW4gPSAkJC5sZW5ndGhcbiAgICAgICwgbGFyZyAgPSAwXG4gICAgICAsIGFyZywgZGl2O1xuICAgIHdoaWxlKGkgPCAkJGxlbil7XG4gICAgICBhcmcgPSBhYnMoJCRbaSsrXSk7XG4gICAgICBpZihsYXJnIDwgYXJnKXtcbiAgICAgICAgZGl2ICA9IGxhcmcgLyBhcmc7XG4gICAgICAgIHN1bSAgPSBzdW0gKiBkaXYgKiBkaXYgKyAxO1xuICAgICAgICBsYXJnID0gYXJnO1xuICAgICAgfSBlbHNlIGlmKGFyZyA+IDApe1xuICAgICAgICBkaXYgID0gYXJnIC8gbGFyZztcbiAgICAgICAgc3VtICs9IGRpdiAqIGRpdjtcbiAgICAgIH0gZWxzZSBzdW0gKz0gYXJnO1xuICAgIH1cbiAgICByZXR1cm4gbGFyZyA9PT0gSW5maW5pdHkgPyBJbmZpbml0eSA6IGxhcmcgKiBNYXRoLnNxcnQoc3VtKTtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjE4IE1hdGguaW11bCh4LCB5KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCAkaW11bCAgID0gTWF0aC5pbXVsO1xuXG4vLyBzb21lIFdlYktpdCB2ZXJzaW9ucyBmYWlscyB3aXRoIGJpZyBudW1iZXJzLCBzb21lIGhhcyB3cm9uZyBhcml0eVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gJGltdWwoMHhmZmZmZmZmZiwgNSkgIT0gLTUgfHwgJGltdWwubGVuZ3RoICE9IDI7XG59KSwgJ01hdGgnLCB7XG4gIGltdWw6IGZ1bmN0aW9uIGltdWwoeCwgeSl7XG4gICAgdmFyIFVJTlQxNiA9IDB4ZmZmZlxuICAgICAgLCB4biA9ICt4XG4gICAgICAsIHluID0gK3lcbiAgICAgICwgeGwgPSBVSU5UMTYgJiB4blxuICAgICAgLCB5bCA9IFVJTlQxNiAmIHluO1xuICAgIHJldHVybiAwIHwgeGwgKiB5bCArICgoVUlOVDE2ICYgeG4gPj4+IDE2KSAqIHlsICsgeGwgKiAoVUlOVDE2ICYgeW4gPj4+IDE2KSA8PCAxNiA+Pj4gMCk7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4yMSBNYXRoLmxvZzEwKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICBsb2cxMDogZnVuY3Rpb24gbG9nMTAoeCl7XG4gICAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5MTjEwO1xuICB9XG59KTsiLCIvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTWF0aCcsIHtsb2cxcDogcmVxdWlyZSgnLi8kLm1hdGgtbG9nMXAnKX0pOyIsIi8vIDIwLjIuMi4yMiBNYXRoLmxvZzIoeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7XG4gIGxvZzI6IGZ1bmN0aW9uIGxvZzIoeCl7XG4gICAgcmV0dXJuIE1hdGgubG9nKHgpIC8gTWF0aC5MTjI7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4yOCBNYXRoLnNpZ24oeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ01hdGgnLCB7c2lnbjogcmVxdWlyZSgnLi8kLm1hdGgtc2lnbicpfSk7IiwiLy8gMjAuMi4yLjMwIE1hdGguc2luaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBleHBtMSAgID0gcmVxdWlyZSgnLi8kLm1hdGgtZXhwbTEnKVxuICAsIGV4cCAgICAgPSBNYXRoLmV4cDtcblxuLy8gVjggbmVhciBDaHJvbWl1bSAzOCBoYXMgYSBwcm9ibGVtIHdpdGggdmVyeSBzbWFsbCBudW1iZXJzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vJC5mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiAhTWF0aC5zaW5oKC0yZS0xNykgIT0gLTJlLTE3O1xufSksICdNYXRoJywge1xuICBzaW5oOiBmdW5jdGlvbiBzaW5oKHgpe1xuICAgIHJldHVybiBNYXRoLmFicyh4ID0gK3gpIDwgMVxuICAgICAgPyAoZXhwbTEoeCkgLSBleHBtMSgteCkpIC8gMlxuICAgICAgOiAoZXhwKHggLSAxKSAtIGV4cCgteCAtIDEpKSAqIChNYXRoLkUgLyAyKTtcbiAgfVxufSk7IiwiLy8gMjAuMi4yLjMzIE1hdGgudGFuaCh4KVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBleHBtMSAgID0gcmVxdWlyZSgnLi8kLm1hdGgtZXhwbTEnKVxuICAsIGV4cCAgICAgPSBNYXRoLmV4cDtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICB0YW5oOiBmdW5jdGlvbiB0YW5oKHgpe1xuICAgIHZhciBhID0gZXhwbTEoeCA9ICt4KVxuICAgICAgLCBiID0gZXhwbTEoLXgpO1xuICAgIHJldHVybiBhID09IEluZmluaXR5ID8gMSA6IGIgPT0gSW5maW5pdHkgPyAtMSA6IChhIC0gYikgLyAoZXhwKHgpICsgZXhwKC14KSk7XG4gIH1cbn0pOyIsIi8vIDIwLjIuMi4zNCBNYXRoLnRydW5jKHgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdNYXRoJywge1xuICB0cnVuYzogZnVuY3Rpb24gdHJ1bmMoaXQpe1xuICAgIHJldHVybiAoaXQgPiAwID8gTWF0aC5mbG9vciA6IE1hdGguY2VpbCkoaXQpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgaGFzICAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCBjb2YgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxuICAsIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi8kLnRvLXByaW1pdGl2ZScpXG4gICwgZmFpbHMgICAgICAgPSByZXF1aXJlKCcuLyQuZmFpbHMnKVxuICAsICR0cmltICAgICAgID0gcmVxdWlyZSgnLi8kLnN0cmluZy10cmltJykudHJpbVxuICAsIE5VTUJFUiAgICAgID0gJ051bWJlcidcbiAgLCAkTnVtYmVyICAgICA9IGdsb2JhbFtOVU1CRVJdXG4gICwgQmFzZSAgICAgICAgPSAkTnVtYmVyXG4gICwgcHJvdG8gICAgICAgPSAkTnVtYmVyLnByb3RvdHlwZVxuICAvLyBPcGVyYSB+MTIgaGFzIGJyb2tlbiBPYmplY3QjdG9TdHJpbmdcbiAgLCBCUk9LRU5fQ09GICA9IGNvZigkLmNyZWF0ZShwcm90bykpID09IE5VTUJFUlxuICAsIFRSSU0gICAgICAgID0gJ3RyaW0nIGluIFN0cmluZy5wcm90b3R5cGU7XG5cbi8vIDcuMS4zIFRvTnVtYmVyKGFyZ3VtZW50KVxudmFyIHRvTnVtYmVyID0gZnVuY3Rpb24oYXJndW1lbnQpe1xuICB2YXIgaXQgPSB0b1ByaW1pdGl2ZShhcmd1bWVudCwgZmFsc2UpO1xuICBpZih0eXBlb2YgaXQgPT0gJ3N0cmluZycgJiYgaXQubGVuZ3RoID4gMil7XG4gICAgaXQgPSBUUklNID8gaXQudHJpbSgpIDogJHRyaW0oaXQsIDMpO1xuICAgIHZhciBmaXJzdCA9IGl0LmNoYXJDb2RlQXQoMClcbiAgICAgICwgdGhpcmQsIHJhZGl4LCBtYXhDb2RlO1xuICAgIGlmKGZpcnN0ID09PSA0MyB8fCBmaXJzdCA9PT0gNDUpe1xuICAgICAgdGhpcmQgPSBpdC5jaGFyQ29kZUF0KDIpO1xuICAgICAgaWYodGhpcmQgPT09IDg4IHx8IHRoaXJkID09PSAxMjApcmV0dXJuIE5hTjsgLy8gTnVtYmVyKCcrMHgxJykgc2hvdWxkIGJlIE5hTiwgb2xkIFY4IGZpeFxuICAgIH0gZWxzZSBpZihmaXJzdCA9PT0gNDgpe1xuICAgICAgc3dpdGNoKGl0LmNoYXJDb2RlQXQoMSkpe1xuICAgICAgICBjYXNlIDY2IDogY2FzZSA5OCAgOiByYWRpeCA9IDI7IG1heENvZGUgPSA0OTsgYnJlYWs7IC8vIGZhc3QgZXF1YWwgL14wYlswMV0rJC9pXG4gICAgICAgIGNhc2UgNzkgOiBjYXNlIDExMSA6IHJhZGl4ID0gODsgbWF4Q29kZSA9IDU1OyBicmVhazsgLy8gZmFzdCBlcXVhbCAvXjBvWzAtN10rJC9pXG4gICAgICAgIGRlZmF1bHQgOiByZXR1cm4gK2l0O1xuICAgICAgfVxuICAgICAgZm9yKHZhciBkaWdpdHMgPSBpdC5zbGljZSgyKSwgaSA9IDAsIGwgPSBkaWdpdHMubGVuZ3RoLCBjb2RlOyBpIDwgbDsgaSsrKXtcbiAgICAgICAgY29kZSA9IGRpZ2l0cy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAvLyBwYXJzZUludCBwYXJzZXMgYSBzdHJpbmcgdG8gYSBmaXJzdCB1bmF2YWlsYWJsZSBzeW1ib2xcbiAgICAgICAgLy8gYnV0IFRvTnVtYmVyIHNob3VsZCByZXR1cm4gTmFOIGlmIGEgc3RyaW5nIGNvbnRhaW5zIHVuYXZhaWxhYmxlIHN5bWJvbHNcbiAgICAgICAgaWYoY29kZSA8IDQ4IHx8IGNvZGUgPiBtYXhDb2RlKXJldHVybiBOYU47XG4gICAgICB9IHJldHVybiBwYXJzZUludChkaWdpdHMsIHJhZGl4KTtcbiAgICB9XG4gIH0gcmV0dXJuICtpdDtcbn07XG5cbmlmKCEkTnVtYmVyKCcgMG8xJykgfHwgISROdW1iZXIoJzBiMScpIHx8ICROdW1iZXIoJysweDEnKSl7XG4gICROdW1iZXIgPSBmdW5jdGlvbiBOdW1iZXIodmFsdWUpe1xuICAgIHZhciBpdCA9IGFyZ3VtZW50cy5sZW5ndGggPCAxID8gMCA6IHZhbHVlXG4gICAgICAsIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB0aGF0IGluc3RhbmNlb2YgJE51bWJlclxuICAgICAgLy8gY2hlY2sgb24gMS4uY29uc3RydWN0b3IoZm9vKSBjYXNlXG4gICAgICAmJiAoQlJPS0VOX0NPRiA/IGZhaWxzKGZ1bmN0aW9uKCl7IHByb3RvLnZhbHVlT2YuY2FsbCh0aGF0KTsgfSkgOiBjb2YodGhhdCkgIT0gTlVNQkVSKVxuICAgICAgICA/IG5ldyBCYXNlKHRvTnVtYmVyKGl0KSkgOiB0b051bWJlcihpdCk7XG4gIH07XG4gICQuZWFjaC5jYWxsKHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpID8gJC5nZXROYW1lcyhCYXNlKSA6IChcbiAgICAvLyBFUzM6XG4gICAgJ01BWF9WQUxVRSxNSU5fVkFMVUUsTmFOLE5FR0FUSVZFX0lORklOSVRZLFBPU0lUSVZFX0lORklOSVRZLCcgK1xuICAgIC8vIEVTNiAoaW4gY2FzZSwgaWYgbW9kdWxlcyB3aXRoIEVTNiBOdW1iZXIgc3RhdGljcyByZXF1aXJlZCBiZWZvcmUpOlxuICAgICdFUFNJTE9OLGlzRmluaXRlLGlzSW50ZWdlcixpc05hTixpc1NhZmVJbnRlZ2VyLE1BWF9TQUZFX0lOVEVHRVIsJyArXG4gICAgJ01JTl9TQUZFX0lOVEVHRVIscGFyc2VGbG9hdCxwYXJzZUludCxpc0ludGVnZXInXG4gICkuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcbiAgICBpZihoYXMoQmFzZSwga2V5KSAmJiAhaGFzKCROdW1iZXIsIGtleSkpe1xuICAgICAgJC5zZXREZXNjKCROdW1iZXIsIGtleSwgJC5nZXREZXNjKEJhc2UsIGtleSkpO1xuICAgIH1cbiAgfSk7XG4gICROdW1iZXIucHJvdG90eXBlID0gcHJvdG87XG4gIHByb3RvLmNvbnN0cnVjdG9yID0gJE51bWJlcjtcbiAgcmVxdWlyZSgnLi8kLnJlZGVmaW5lJykoZ2xvYmFsLCBOVU1CRVIsICROdW1iZXIpO1xufSIsIi8vIDIwLjEuMi4xIE51bWJlci5FUFNJTE9OXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7RVBTSUxPTjogTWF0aC5wb3coMiwgLTUyKX0pOyIsIi8vIDIwLjEuMi4yIE51bWJlci5pc0Zpbml0ZShudW1iZXIpXG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgX2lzRmluaXRlID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpLmlzRmluaXRlO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNGaW5pdGU6IGZ1bmN0aW9uIGlzRmluaXRlKGl0KXtcbiAgICByZXR1cm4gdHlwZW9mIGl0ID09ICdudW1iZXInICYmIF9pc0Zpbml0ZShpdCk7XG4gIH1cbn0pOyIsIi8vIDIwLjEuMi4zIE51bWJlci5pc0ludGVnZXIobnVtYmVyKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge2lzSW50ZWdlcjogcmVxdWlyZSgnLi8kLmlzLWludGVnZXInKX0pOyIsIi8vIDIwLjEuMi40IE51bWJlci5pc05hTihudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7XG4gIGlzTmFOOiBmdW5jdGlvbiBpc05hTihudW1iZXIpe1xuICAgIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xuICB9XG59KTsiLCIvLyAyMC4xLjIuNSBOdW1iZXIuaXNTYWZlSW50ZWdlcihudW1iZXIpXG52YXIgJGV4cG9ydCAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgaXNJbnRlZ2VyID0gcmVxdWlyZSgnLi8kLmlzLWludGVnZXInKVxuICAsIGFicyAgICAgICA9IE1hdGguYWJzO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtcbiAgaXNTYWZlSW50ZWdlcjogZnVuY3Rpb24gaXNTYWZlSW50ZWdlcihudW1iZXIpe1xuICAgIHJldHVybiBpc0ludGVnZXIobnVtYmVyKSAmJiBhYnMobnVtYmVyKSA8PSAweDFmZmZmZmZmZmZmZmZmO1xuICB9XG59KTsiLCIvLyAyMC4xLjIuNiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUlxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge01BWF9TQUZFX0lOVEVHRVI6IDB4MWZmZmZmZmZmZmZmZmZ9KTsiLCIvLyAyMC4xLjIuMTAgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtNSU5fU0FGRV9JTlRFR0VSOiAtMHgxZmZmZmZmZmZmZmZmZn0pOyIsIi8vIDIwLjEuMi4xMiBOdW1iZXIucGFyc2VGbG9hdChzdHJpbmcpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdOdW1iZXInLCB7cGFyc2VGbG9hdDogcGFyc2VGbG9hdH0pOyIsIi8vIDIwLjEuMi4xMyBOdW1iZXIucGFyc2VJbnQoc3RyaW5nLCByYWRpeClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtwYXJzZUludDogcGFyc2VJbnR9KTsiLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi8kLm9iamVjdC1hc3NpZ24nKX0pOyIsIi8vIDE5LjEuMi41IE9iamVjdC5mcmVlemUoTylcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcblxucmVxdWlyZSgnLi8kLm9iamVjdC1zYXAnKSgnZnJlZXplJywgZnVuY3Rpb24oJGZyZWV6ZSl7XG4gIHJldHVybiBmdW5jdGlvbiBmcmVlemUoaXQpe1xuICAgIHJldHVybiAkZnJlZXplICYmIGlzT2JqZWN0KGl0KSA/ICRmcmVlemUoaXQpIDogaXQ7XG4gIH07XG59KTsiLCIvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKTtcblxucmVxdWlyZSgnLi8kLm9iamVjdC1zYXAnKSgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgZnVuY3Rpb24oJGdldE93blByb3BlcnR5RGVzY3JpcHRvcil7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG5yZXF1aXJlKCcuLyQub2JqZWN0LXNhcCcpKCdnZXRPd25Qcm9wZXJ0eU5hbWVzJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIHJlcXVpcmUoJy4vJC5nZXQtbmFtZXMnKS5nZXQ7XG59KTsiLCIvLyAxOS4xLjIuOSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vJC50by1vYmplY3QnKTtcblxucmVxdWlyZSgnLi8kLm9iamVjdC1zYXAnKSgnZ2V0UHJvdG90eXBlT2YnLCBmdW5jdGlvbigkZ2V0UHJvdG90eXBlT2Ype1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YoaXQpe1xuICAgIHJldHVybiAkZ2V0UHJvdG90eXBlT2YodG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMi4xMSBPYmplY3QuaXNFeHRlbnNpYmxlKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0Jyk7XG5cbnJlcXVpcmUoJy4vJC5vYmplY3Qtc2FwJykoJ2lzRXh0ZW5zaWJsZScsIGZ1bmN0aW9uKCRpc0V4dGVuc2libGUpe1xuICByZXR1cm4gZnVuY3Rpb24gaXNFeHRlbnNpYmxlKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gJGlzRXh0ZW5zaWJsZSA/ICRpc0V4dGVuc2libGUoaXQpIDogdHJ1ZSA6IGZhbHNlO1xuICB9O1xufSk7IiwiLy8gMTkuMS4yLjEyIE9iamVjdC5pc0Zyb3plbihPKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpO1xuXG5yZXF1aXJlKCcuLyQub2JqZWN0LXNhcCcpKCdpc0Zyb3plbicsIGZ1bmN0aW9uKCRpc0Zyb3plbil7XG4gIHJldHVybiBmdW5jdGlvbiBpc0Zyb3plbihpdCl7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGl0KSA/ICRpc0Zyb3plbiA/ICRpc0Zyb3plbihpdCkgOiBmYWxzZSA6IHRydWU7XG4gIH07XG59KTsiLCIvLyAxOS4xLjIuMTMgT2JqZWN0LmlzU2VhbGVkKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0Jyk7XG5cbnJlcXVpcmUoJy4vJC5vYmplY3Qtc2FwJykoJ2lzU2VhbGVkJywgZnVuY3Rpb24oJGlzU2VhbGVkKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlzU2VhbGVkKGl0KXtcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gJGlzU2VhbGVkID8gJGlzU2VhbGVkKGl0KSA6IGZhbHNlIDogdHJ1ZTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMy4xMCBPYmplY3QuaXModmFsdWUxLCB2YWx1ZTIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge2lzOiByZXF1aXJlKCcuLyQuc2FtZS12YWx1ZScpfSk7IiwiLy8gMTkuMS4yLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLyQudG8tb2JqZWN0Jyk7XG5cbnJlcXVpcmUoJy4vJC5vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbigka2V5cyl7XG4gIHJldHVybiBmdW5jdGlvbiBrZXlzKGl0KXtcbiAgICByZXR1cm4gJGtleXModG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMi4xNSBPYmplY3QucHJldmVudEV4dGVuc2lvbnMoTylcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcblxucmVxdWlyZSgnLi8kLm9iamVjdC1zYXAnKSgncHJldmVudEV4dGVuc2lvbnMnLCBmdW5jdGlvbigkcHJldmVudEV4dGVuc2lvbnMpe1xuICByZXR1cm4gZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnMoaXQpe1xuICAgIHJldHVybiAkcHJldmVudEV4dGVuc2lvbnMgJiYgaXNPYmplY3QoaXQpID8gJHByZXZlbnRFeHRlbnNpb25zKGl0KSA6IGl0O1xuICB9O1xufSk7IiwiLy8gMTkuMS4yLjE3IE9iamVjdC5zZWFsKE8pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0Jyk7XG5cbnJlcXVpcmUoJy4vJC5vYmplY3Qtc2FwJykoJ3NlYWwnLCBmdW5jdGlvbigkc2VhbCl7XG4gIHJldHVybiBmdW5jdGlvbiBzZWFsKGl0KXtcbiAgICByZXR1cm4gJHNlYWwgJiYgaXNPYmplY3QoaXQpID8gJHNlYWwoaXQpIDogaXQ7XG4gIH07XG59KTsiLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldH0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgdGVzdCAgICA9IHt9O1xudGVzdFtyZXF1aXJlKCcuLyQud2tzJykoJ3RvU3RyaW5nVGFnJyldID0gJ3onO1xuaWYodGVzdCArICcnICE9ICdbb2JqZWN0IHpdJyl7XG4gIHJlcXVpcmUoJy4vJC5yZWRlZmluZScpKE9iamVjdC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuICdbb2JqZWN0ICcgKyBjbGFzc29mKHRoaXMpICsgJ10nO1xuICB9LCB0cnVlKTtcbn0iLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgTElCUkFSWSAgICA9IHJlcXVpcmUoJy4vJC5saWJyYXJ5JylcbiAgLCBnbG9iYWwgICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY3R4ICAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIGNsYXNzb2YgICAgPSByZXF1aXJlKCcuLyQuY2xhc3NvZicpXG4gICwgJGV4cG9ydCAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGlzT2JqZWN0ICAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBhbk9iamVjdCAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgYUZ1bmN0aW9uICA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJylcbiAgLCBzdHJpY3ROZXcgID0gcmVxdWlyZSgnLi8kLnN0cmljdC1uZXcnKVxuICAsIGZvck9mICAgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcbiAgLCBzZXRQcm90byAgID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpLnNldFxuICAsIHNhbWUgICAgICAgPSByZXF1aXJlKCcuLyQuc2FtZS12YWx1ZScpXG4gICwgU1BFQ0lFUyAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnc3BlY2llcycpXG4gICwgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMtY29uc3RydWN0b3InKVxuICAsIGFzYXAgICAgICAgPSByZXF1aXJlKCcuLyQubWljcm90YXNrJylcbiAgLCBQUk9NSVNFICAgID0gJ1Byb21pc2UnXG4gICwgcHJvY2VzcyAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnXG4gICwgUCAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIFdyYXBwZXI7XG5cbnZhciB0ZXN0UmVzb2x2ZSA9IGZ1bmN0aW9uKHN1Yil7XG4gIHZhciB0ZXN0ID0gbmV3IFAoZnVuY3Rpb24oKXt9KTtcbiAgaWYoc3ViKXRlc3QuY29uc3RydWN0b3IgPSBPYmplY3Q7XG4gIHJldHVybiBQLnJlc29sdmUodGVzdCkgPT09IHRlc3Q7XG59O1xuXG52YXIgVVNFX05BVElWRSA9IGZ1bmN0aW9uKCl7XG4gIHZhciB3b3JrcyA9IGZhbHNlO1xuICBmdW5jdGlvbiBQMih4KXtcbiAgICB2YXIgc2VsZiA9IG5ldyBQKHgpO1xuICAgIHNldFByb3RvKHNlbGYsIFAyLnByb3RvdHlwZSk7XG4gICAgcmV0dXJuIHNlbGY7XG4gIH1cbiAgdHJ5IHtcbiAgICB3b3JrcyA9IFAgJiYgUC5yZXNvbHZlICYmIHRlc3RSZXNvbHZlKCk7XG4gICAgc2V0UHJvdG8oUDIsIFApO1xuICAgIFAyLnByb3RvdHlwZSA9ICQuY3JlYXRlKFAucHJvdG90eXBlLCB7Y29uc3RydWN0b3I6IHt2YWx1ZTogUDJ9fSk7XG4gICAgLy8gYWN0dWFsIEZpcmVmb3ggaGFzIGJyb2tlbiBzdWJjbGFzcyBzdXBwb3J0LCB0ZXN0IHRoYXRcbiAgICBpZighKFAyLnJlc29sdmUoNSkudGhlbihmdW5jdGlvbigpe30pIGluc3RhbmNlb2YgUDIpKXtcbiAgICAgIHdvcmtzID0gZmFsc2U7XG4gICAgfVxuICAgIC8vIGFjdHVhbCBWOCBidWcsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTYyXG4gICAgaWYod29ya3MgJiYgcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJykpe1xuICAgICAgdmFyIHRoZW5hYmxlVGhlbkdvdHRlbiA9IGZhbHNlO1xuICAgICAgUC5yZXNvbHZlKCQuc2V0RGVzYyh7fSwgJ3RoZW4nLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24oKXsgdGhlbmFibGVUaGVuR290dGVuID0gdHJ1ZTsgfVxuICAgICAgfSkpO1xuICAgICAgd29ya3MgPSB0aGVuYWJsZVRoZW5Hb3R0ZW47XG4gICAgfVxuICB9IGNhdGNoKGUpeyB3b3JrcyA9IGZhbHNlOyB9XG4gIHJldHVybiB3b3Jrcztcbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyBsaWJyYXJ5IHdyYXBwZXIgc3BlY2lhbCBjYXNlXG4gIGlmKExJQlJBUlkgJiYgYSA9PT0gUCAmJiBiID09PSBXcmFwcGVyKXJldHVybiB0cnVlO1xuICByZXR1cm4gc2FtZShhLCBiKTtcbn07XG52YXIgZ2V0Q29uc3RydWN0b3IgPSBmdW5jdGlvbihDKXtcbiAgdmFyIFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXTtcbiAgcmV0dXJuIFMgIT0gdW5kZWZpbmVkID8gUyA6IEM7XG59O1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbihpdCl7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIFByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24oQyl7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uKCQkcmVzb2x2ZSwgJCRyZWplY3Qpe1xuICAgIGlmKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSksXG4gIHRoaXMucmVqZWN0ICA9IGFGdW5jdGlvbihyZWplY3QpXG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocmVjb3JkLCBpc1JlamVjdCl7XG4gIGlmKHJlY29yZC5uKXJldHVybjtcbiAgcmVjb3JkLm4gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSByZWNvcmQuYztcbiAgYXNhcChmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHJlY29yZC52XG4gICAgICAsIG9rICAgID0gcmVjb3JkLnMgPT0gMVxuICAgICAgLCBpICAgICA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uKHJlYWN0aW9uKXtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWxcbiAgICAgICAgLCByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZVxuICAgICAgICAsIHJlamVjdCAgPSByZWFjdGlvbi5yZWplY3RcbiAgICAgICAgLCByZXN1bHQsIHRoZW47XG4gICAgICB0cnkge1xuICAgICAgICBpZihoYW5kbGVyKXtcbiAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xuICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIgPT09IHRydWUgPyB2YWx1ZSA6IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSl7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBjaGFpbi5sZW5ndGggPSAwO1xuICAgIHJlY29yZC5uID0gZmFsc2U7XG4gICAgaWYoaXNSZWplY3Qpc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgdmFyIHByb21pc2UgPSByZWNvcmQucFxuICAgICAgICAsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gcmVjb3JkLmEgPSB1bmRlZmluZWQ7XG4gICAgfSwgMSk7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uKHByb21pc2Upe1xuICB2YXIgcmVjb3JkID0gcHJvbWlzZS5fZFxuICAgICwgY2hhaW4gID0gcmVjb3JkLmEgfHwgcmVjb3JkLmNcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlYWN0aW9uO1xuICBpZihyZWNvcmQuaClyZXR1cm4gZmFsc2U7XG4gIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xuICAgIHJlYWN0aW9uID0gY2hhaW5baSsrXTtcbiAgICBpZihyZWFjdGlvbi5mYWlsIHx8ICFpc1VuaGFuZGxlZChyZWFjdGlvbi5wcm9taXNlKSlyZXR1cm4gZmFsc2U7XG4gIH0gcmV0dXJuIHRydWU7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciByZWNvcmQgPSB0aGlzO1xuICBpZihyZWNvcmQuZClyZXR1cm47XG4gIHJlY29yZC5kID0gdHJ1ZTtcbiAgcmVjb3JkID0gcmVjb3JkLnIgfHwgcmVjb3JkOyAvLyB1bndyYXBcbiAgcmVjb3JkLnYgPSB2YWx1ZTtcbiAgcmVjb3JkLnMgPSAyO1xuICByZWNvcmQuYSA9IHJlY29yZC5jLnNsaWNlKCk7XG4gIG5vdGlmeShyZWNvcmQsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHJlY29yZCA9IHRoaXNcbiAgICAsIHRoZW47XG4gIGlmKHJlY29yZC5kKXJldHVybjtcbiAgcmVjb3JkLmQgPSB0cnVlO1xuICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHJlY29yZC5wID09PSB2YWx1ZSl0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xuICAgICAgYXNhcChmdW5jdGlvbigpe1xuICAgICAgICB2YXIgd3JhcHBlciA9IHtyOiByZWNvcmQsIGQ6IGZhbHNlfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZWNvcmQudiA9IHZhbHVlO1xuICAgICAgcmVjb3JkLnMgPSAxO1xuICAgICAgbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe3I6IHJlY29yZCwgZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICBQID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICB2YXIgcmVjb3JkID0gdGhpcy5fZCA9IHtcbiAgICAgIHA6IHN0cmljdE5ldyh0aGlzLCBQLCBQUk9NSVNFKSwgICAgICAgICAvLyA8LSBwcm9taXNlXG4gICAgICBjOiBbXSwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgICBhOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICAgIHM6IDAsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgICAgZDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICAgIHY6IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgaDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGhhbmRsZWQgcmVqZWN0aW9uXG4gICAgICBuOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gICAgfTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCByZWNvcmQsIDEpLCBjdHgoJHJlamVjdCwgcmVjb3JkLCAxKSk7XG4gICAgfSBjYXRjaChlcnIpe1xuICAgICAgJHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcbiAgICB9XG4gIH07XG4gIHJlcXVpcmUoJy4vJC5yZWRlZmluZS1hbGwnKShQLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCl7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsIFApKVxuICAgICAgICAsIHByb21pc2UgID0gcmVhY3Rpb24ucHJvbWlzZVxuICAgICAgICAsIHJlY29yZCAgID0gdGhpcy5fZDtcbiAgICAgIHJlYWN0aW9uLm9rICAgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWNvcmQuYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmKHJlY29yZC5hKXJlY29yZC5hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYocmVjb3JkLnMpbm90aWZ5KHJlY29yZCwgZmFsc2UpO1xuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtQcm9taXNlOiBQfSk7XG5yZXF1aXJlKCcuLyQuc2V0LXRvLXN0cmluZy10YWcnKShQLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vJC5zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vJC5jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZWplY3QgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgdGVzdFJlc29sdmUodHJ1ZSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpe1xuICAgIC8vIGluc3RhbmNlb2YgaW5zdGVhZCBvZiBpbnRlcm5hbCBzbG90IGNoZWNrIGJlY2F1c2Ugd2Ugc2hvdWxkIGZpeCBpdCB3aXRob3V0IHJlcGxhY2VtZW50IG5hdGl2ZSBQcm9taXNlIGNvcmVcbiAgICBpZih4IGluc3RhbmNlb2YgUCAmJiBzYW1lQ29uc3RydWN0b3IoeC5jb25zdHJ1Y3RvciwgdGhpcykpcmV0dXJuIHg7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkodGhpcylcbiAgICAgICwgJCRyZXNvbHZlICA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICAkJHJlc29sdmUoeCk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgUC5hbGwoaXRlcilbJ2NhdGNoJ10oZnVuY3Rpb24oKXt9KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gZ2V0Q29uc3RydWN0b3IodGhpcylcbiAgICAgICwgY2FwYWJpbGl0eSA9IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZXNvbHZlICAgID0gY2FwYWJpbGl0eS5yZXNvbHZlXG4gICAgICAsIHJlamVjdCAgICAgPSBjYXBhYmlsaXR5LnJlamVjdFxuICAgICAgLCB2YWx1ZXMgICAgID0gW107XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgdmFsdWVzLnB1c2gsIHZhbHVlcyk7XG4gICAgICB2YXIgcmVtYWluaW5nID0gdmFsdWVzLmxlbmd0aFxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XG4gICAgICBpZihyZW1haW5pbmcpJC5lYWNoLmNhbGwodmFsdWVzLCBmdW5jdGlvbihwcm9taXNlLCBpbmRleCl7XG4gICAgICAgIHZhciBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgICBpZihhbHJlYWR5Q2FsbGVkKXJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUocmVzdWx0cyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIGVsc2UgcmVzb2x2ZShyZXN1bHRzKTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKXtcbiAgICB2YXIgQyAgICAgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVqZWN0ICAgICA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZihhYnJ1cHQpcmVqZWN0KGFicnVwdC5lcnJvcik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7IiwiLy8gMjYuMS4xIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIF9hcHBseSAgPSBGdW5jdGlvbi5hcHBseTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBhcHBseTogZnVuY3Rpb24gYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3Qpe1xuICAgIHJldHVybiBfYXBwbHkuY2FsbCh0YXJnZXQsIHRoaXNBcmd1bWVudCwgYXJndW1lbnRzTGlzdCk7XG4gIH1cbn0pOyIsIi8vIDI2LjEuMiBSZWZsZWN0LmNvbnN0cnVjdCh0YXJnZXQsIGFyZ3VtZW50c0xpc3QgWywgbmV3VGFyZ2V0XSlcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRleHBvcnQgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJylcbiAgLCBhbk9iamVjdCAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCBpc09iamVjdCAgPSByZXF1aXJlKCcuLyQuaXMtb2JqZWN0JylcbiAgLCBiaW5kICAgICAgPSBGdW5jdGlvbi5iaW5kIHx8IHJlcXVpcmUoJy4vJC5jb3JlJykuRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ7XG5cbi8vIE1TIEVkZ2Ugc3VwcG9ydHMgb25seSAyIGFyZ3VtZW50c1xuLy8gRkYgTmlnaHRseSBzZXRzIHRoaXJkIGFyZ3VtZW50IGFzIGBuZXcudGFyZ2V0YCwgYnV0IGRvZXMgbm90IGNyZWF0ZSBgdGhpc2AgZnJvbSBpdFxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpe1xuICBmdW5jdGlvbiBGKCl7fVxuICByZXR1cm4gIShSZWZsZWN0LmNvbnN0cnVjdChmdW5jdGlvbigpe30sIFtdLCBGKSBpbnN0YW5jZW9mIEYpO1xufSksICdSZWZsZWN0Jywge1xuICBjb25zdHJ1Y3Q6IGZ1bmN0aW9uIGNvbnN0cnVjdChUYXJnZXQsIGFyZ3MgLyosIG5ld1RhcmdldCovKXtcbiAgICBhRnVuY3Rpb24oVGFyZ2V0KTtcbiAgICB2YXIgbmV3VGFyZ2V0ID0gYXJndW1lbnRzLmxlbmd0aCA8IDMgPyBUYXJnZXQgOiBhRnVuY3Rpb24oYXJndW1lbnRzWzJdKTtcbiAgICBpZihUYXJnZXQgPT0gbmV3VGFyZ2V0KXtcbiAgICAgIC8vIHcvbyBhbHRlcmVkIG5ld1RhcmdldCwgb3B0aW1pemF0aW9uIGZvciAwLTQgYXJndW1lbnRzXG4gICAgICBpZihhcmdzICE9IHVuZGVmaW5lZClzd2l0Y2goYW5PYmplY3QoYXJncykubGVuZ3RoKXtcbiAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IFRhcmdldDtcbiAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdKTtcbiAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICAgICAgY2FzZSAzOiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICAgICAgY2FzZSA0OiByZXR1cm4gbmV3IFRhcmdldChhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgICAgIH1cbiAgICAgIC8vIHcvbyBhbHRlcmVkIG5ld1RhcmdldCwgbG90IG9mIGFyZ3VtZW50cyBjYXNlXG4gICAgICB2YXIgJGFyZ3MgPSBbbnVsbF07XG4gICAgICAkYXJncy5wdXNoLmFwcGx5KCRhcmdzLCBhcmdzKTtcbiAgICAgIHJldHVybiBuZXcgKGJpbmQuYXBwbHkoVGFyZ2V0LCAkYXJncykpO1xuICAgIH1cbiAgICAvLyB3aXRoIGFsdGVyZWQgbmV3VGFyZ2V0LCBub3Qgc3VwcG9ydCBidWlsdC1pbiBjb25zdHJ1Y3RvcnNcbiAgICB2YXIgcHJvdG8gICAgPSBuZXdUYXJnZXQucHJvdG90eXBlXG4gICAgICAsIGluc3RhbmNlID0gJC5jcmVhdGUoaXNPYmplY3QocHJvdG8pID8gcHJvdG8gOiBPYmplY3QucHJvdG90eXBlKVxuICAgICAgLCByZXN1bHQgICA9IEZ1bmN0aW9uLmFwcGx5LmNhbGwoVGFyZ2V0LCBpbnN0YW5jZSwgYXJncyk7XG4gICAgcmV0dXJuIGlzT2JqZWN0KHJlc3VsdCkgPyByZXN1bHQgOiBpbnN0YW5jZTtcbiAgfVxufSk7IiwiLy8gMjYuMS4zIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcylcbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGV4cG9ydCAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcblxuLy8gTVMgRWRnZSBoYXMgYnJva2VuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkgLSB0aHJvd2luZyBpbnN0ZWFkIG9mIHJldHVybmluZyBmYWxzZVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpe1xuICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KCQuc2V0RGVzYyh7fSwgMSwge3ZhbHVlOiAxfSksIDEsIHt2YWx1ZTogMn0pO1xufSksICdSZWZsZWN0Jywge1xuICBkZWZpbmVQcm9wZXJ0eTogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcyl7XG4gICAgYW5PYmplY3QodGFyZ2V0KTtcbiAgICB0cnkge1xuICAgICAgJC5zZXREZXNjKHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pOyIsIi8vIDI2LjEuNCBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBnZXREZXNjICA9IHJlcXVpcmUoJy4vJCcpLmdldERlc2NcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBkZWxldGVQcm9wZXJ0eTogZnVuY3Rpb24gZGVsZXRlUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgdmFyIGRlc2MgPSBnZXREZXNjKGFuT2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KTtcbiAgICByZXR1cm4gZGVzYyAmJiAhZGVzYy5jb25maWd1cmFibGUgPyBmYWxzZSA6IGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlLZXldO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyAyNi4xLjUgUmVmbGVjdC5lbnVtZXJhdGUodGFyZ2V0KVxudmFyICRleHBvcnQgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0Jyk7XG52YXIgRW51bWVyYXRlID0gZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gYW5PYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB2YXIga2V5cyA9IHRoaXMuX2sgPSBbXSAgICAgICAvLyBrZXlzXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gaXRlcmF0ZWQpa2V5cy5wdXNoKGtleSk7XG59O1xucmVxdWlyZSgnLi8kLml0ZXItY3JlYXRlJykoRW51bWVyYXRlLCAnT2JqZWN0JywgZnVuY3Rpb24oKXtcbiAgdmFyIHRoYXQgPSB0aGlzXG4gICAgLCBrZXlzID0gdGhhdC5fa1xuICAgICwga2V5O1xuICBkbyB7XG4gICAgaWYodGhhdC5faSA+PSBrZXlzLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICB9IHdoaWxlKCEoKGtleSA9IGtleXNbdGhhdC5faSsrXSkgaW4gdGhhdC5fdCkpO1xuICByZXR1cm4ge3ZhbHVlOiBrZXksIGRvbmU6IGZhbHNlfTtcbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGVudW1lcmF0ZTogZnVuY3Rpb24gZW51bWVyYXRlKHRhcmdldCl7XG4gICAgcmV0dXJuIG5ldyBFbnVtZXJhdGUodGFyZ2V0KTtcbiAgfVxufSk7IiwiLy8gMjYuMS43IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgcHJvcGVydHlLZXkpXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRleHBvcnQgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVmbGVjdCcsIHtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wZXJ0eUtleSl7XG4gICAgcmV0dXJuICQuZ2V0RGVzYyhhbk9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XG4gIH1cbn0pOyIsIi8vIDI2LjEuOCBSZWZsZWN0LmdldFByb3RvdHlwZU9mKHRhcmdldClcbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGdldFByb3RvID0gcmVxdWlyZSgnLi8kJykuZ2V0UHJvdG9cbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBnZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YodGFyZ2V0KXtcbiAgICByZXR1cm4gZ2V0UHJvdG8oYW5PYmplY3QodGFyZ2V0KSk7XG4gIH1cbn0pOyIsIi8vIDI2LjEuNiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BlcnR5S2V5IFssIHJlY2VpdmVyXSlcbnZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpXG4gICwgYW5PYmplY3QgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0Jyk7XG5cbmZ1bmN0aW9uIGdldCh0YXJnZXQsIHByb3BlcnR5S2V5LyosIHJlY2VpdmVyKi8pe1xuICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgMyA/IHRhcmdldCA6IGFyZ3VtZW50c1syXVxuICAgICwgZGVzYywgcHJvdG87XG4gIGlmKGFuT2JqZWN0KHRhcmdldCkgPT09IHJlY2VpdmVyKXJldHVybiB0YXJnZXRbcHJvcGVydHlLZXldO1xuICBpZihkZXNjID0gJC5nZXREZXNjKHRhcmdldCwgcHJvcGVydHlLZXkpKXJldHVybiBoYXMoZGVzYywgJ3ZhbHVlJylcbiAgICA/IGRlc2MudmFsdWVcbiAgICA6IGRlc2MuZ2V0ICE9PSB1bmRlZmluZWRcbiAgICAgID8gZGVzYy5nZXQuY2FsbChyZWNlaXZlcilcbiAgICAgIDogdW5kZWZpbmVkO1xuICBpZihpc09iamVjdChwcm90byA9ICQuZ2V0UHJvdG8odGFyZ2V0KSkpcmV0dXJuIGdldChwcm90bywgcHJvcGVydHlLZXksIHJlY2VpdmVyKTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge2dldDogZ2V0fSk7IiwiLy8gMjYuMS45IFJlZmxlY3QuaGFzKHRhcmdldCwgcHJvcGVydHlLZXkpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBoYXM6IGZ1bmN0aW9uIGhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KXtcbiAgICByZXR1cm4gcHJvcGVydHlLZXkgaW4gdGFyZ2V0O1xuICB9XG59KTsiLCIvLyAyNi4xLjEwIFJlZmxlY3QuaXNFeHRlbnNpYmxlKHRhcmdldClcbnZhciAkZXhwb3J0ICAgICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgYW5PYmplY3QgICAgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsICRpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7XG4gIGlzRXh0ZW5zaWJsZTogZnVuY3Rpb24gaXNFeHRlbnNpYmxlKHRhcmdldCl7XG4gICAgYW5PYmplY3QodGFyZ2V0KTtcbiAgICByZXR1cm4gJGlzRXh0ZW5zaWJsZSA/ICRpc0V4dGVuc2libGUodGFyZ2V0KSA6IHRydWU7XG4gIH1cbn0pOyIsIi8vIDI2LjEuMTEgUmVmbGVjdC5vd25LZXlzKHRhcmdldClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1JlZmxlY3QnLCB7b3duS2V5czogcmVxdWlyZSgnLi8kLm93bi1rZXlzJyl9KTsiLCIvLyAyNi4xLjEyIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KVxudmFyICRleHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIGFuT2JqZWN0ICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5hbi1vYmplY3QnKVxuICAsICRwcmV2ZW50RXh0ZW5zaW9ucyA9IE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucztcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBwcmV2ZW50RXh0ZW5zaW9uczogZnVuY3Rpb24gcHJldmVudEV4dGVuc2lvbnModGFyZ2V0KXtcbiAgICBhbk9iamVjdCh0YXJnZXQpO1xuICAgIHRyeSB7XG4gICAgICBpZigkcHJldmVudEV4dGVuc2lvbnMpJHByZXZlbnRFeHRlbnNpb25zKHRhcmdldCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufSk7IiwiLy8gMjYuMS4xNCBSZWZsZWN0LnNldFByb3RvdHlwZU9mKHRhcmdldCwgcHJvdG8pXG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBzZXRQcm90byA9IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKTtcblxuaWYoc2V0UHJvdG8pJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge1xuICBzZXRQcm90b3R5cGVPZjogZnVuY3Rpb24gc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90byl7XG4gICAgc2V0UHJvdG8uY2hlY2sodGFyZ2V0LCBwcm90byk7XG4gICAgdHJ5IHtcbiAgICAgIHNldFByb3RvLnNldCh0YXJnZXQsIHByb3RvKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2goZSl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59KTsiLCIvLyAyNi4xLjEzIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYgWywgcmVjZWl2ZXJdKVxudmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGhhcyAgICAgICAgPSByZXF1aXJlKCcuLyQuaGFzJylcbiAgLCAkZXhwb3J0ICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJylcbiAgLCBhbk9iamVjdCAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgaXNPYmplY3QgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKTtcblxuZnVuY3Rpb24gc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYvKiwgcmVjZWl2ZXIqLyl7XG4gIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCA0ID8gdGFyZ2V0IDogYXJndW1lbnRzWzNdXG4gICAgLCBvd25EZXNjICA9ICQuZ2V0RGVzYyhhbk9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSlcbiAgICAsIGV4aXN0aW5nRGVzY3JpcHRvciwgcHJvdG87XG4gIGlmKCFvd25EZXNjKXtcbiAgICBpZihpc09iamVjdChwcm90byA9ICQuZ2V0UHJvdG8odGFyZ2V0KSkpe1xuICAgICAgcmV0dXJuIHNldChwcm90bywgcHJvcGVydHlLZXksIFYsIHJlY2VpdmVyKTtcbiAgICB9XG4gICAgb3duRGVzYyA9IGNyZWF0ZURlc2MoMCk7XG4gIH1cbiAgaWYoaGFzKG93bkRlc2MsICd2YWx1ZScpKXtcbiAgICBpZihvd25EZXNjLndyaXRhYmxlID09PSBmYWxzZSB8fCAhaXNPYmplY3QocmVjZWl2ZXIpKXJldHVybiBmYWxzZTtcbiAgICBleGlzdGluZ0Rlc2NyaXB0b3IgPSAkLmdldERlc2MocmVjZWl2ZXIsIHByb3BlcnR5S2V5KSB8fCBjcmVhdGVEZXNjKDApO1xuICAgIGV4aXN0aW5nRGVzY3JpcHRvci52YWx1ZSA9IFY7XG4gICAgJC5zZXREZXNjKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSwgZXhpc3RpbmdEZXNjcmlwdG9yKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gb3duRGVzYy5zZXQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogKG93bkRlc2Muc2V0LmNhbGwocmVjZWl2ZXIsIFYpLCB0cnVlKTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LlMsICdSZWZsZWN0Jywge3NldDogc2V0fSk7IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBnbG9iYWwgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGlzUmVnRXhwID0gcmVxdWlyZSgnLi8kLmlzLXJlZ2V4cCcpXG4gICwgJGZsYWdzICAgPSByZXF1aXJlKCcuLyQuZmxhZ3MnKVxuICAsICRSZWdFeHAgID0gZ2xvYmFsLlJlZ0V4cFxuICAsIEJhc2UgICAgID0gJFJlZ0V4cFxuICAsIHByb3RvICAgID0gJFJlZ0V4cC5wcm90b3R5cGVcbiAgLCByZTEgICAgICA9IC9hL2dcbiAgLCByZTIgICAgICA9IC9hL2dcbiAgLy8gXCJuZXdcIiBjcmVhdGVzIGEgbmV3IG9iamVjdCwgb2xkIHdlYmtpdCBidWdneSBoZXJlXG4gICwgQ09SUkVDVF9ORVcgPSBuZXcgJFJlZ0V4cChyZTEpICE9PSByZTE7XG5cbmlmKHJlcXVpcmUoJy4vJC5kZXNjcmlwdG9ycycpICYmICghQ09SUkVDVF9ORVcgfHwgcmVxdWlyZSgnLi8kLmZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmUyW3JlcXVpcmUoJy4vJC53a3MnKSgnbWF0Y2gnKV0gPSBmYWxzZTtcbiAgLy8gUmVnRXhwIGNvbnN0cnVjdG9yIGNhbiBhbHRlciBmbGFncyBhbmQgSXNSZWdFeHAgd29ya3MgY29ycmVjdCB3aXRoIEBAbWF0Y2hcbiAgcmV0dXJuICRSZWdFeHAocmUxKSAhPSByZTEgfHwgJFJlZ0V4cChyZTIpID09IHJlMiB8fCAkUmVnRXhwKHJlMSwgJ2knKSAhPSAnL2EvaSc7XG59KSkpe1xuICAkUmVnRXhwID0gZnVuY3Rpb24gUmVnRXhwKHAsIGYpe1xuICAgIHZhciBwaVJFID0gaXNSZWdFeHAocClcbiAgICAgICwgZmlVICA9IGYgPT09IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gISh0aGlzIGluc3RhbmNlb2YgJFJlZ0V4cCkgJiYgcGlSRSAmJiBwLmNvbnN0cnVjdG9yID09PSAkUmVnRXhwICYmIGZpVSA/IHBcbiAgICAgIDogQ09SUkVDVF9ORVdcbiAgICAgICAgPyBuZXcgQmFzZShwaVJFICYmICFmaVUgPyBwLnNvdXJjZSA6IHAsIGYpXG4gICAgICAgIDogQmFzZSgocGlSRSA9IHAgaW5zdGFuY2VvZiAkUmVnRXhwKSA/IHAuc291cmNlIDogcCwgcGlSRSAmJiBmaVUgPyAkZmxhZ3MuY2FsbChwKSA6IGYpO1xuICB9O1xuICAkLmVhY2guY2FsbCgkLmdldE5hbWVzKEJhc2UpLCBmdW5jdGlvbihrZXkpe1xuICAgIGtleSBpbiAkUmVnRXhwIHx8ICQuc2V0RGVzYygkUmVnRXhwLCBrZXksIHtcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIEJhc2Vba2V5XTsgfSxcbiAgICAgIHNldDogZnVuY3Rpb24oaXQpeyBCYXNlW2tleV0gPSBpdDsgfVxuICAgIH0pO1xuICB9KTtcbiAgcHJvdG8uY29uc3RydWN0b3IgPSAkUmVnRXhwO1xuICAkUmVnRXhwLnByb3RvdHlwZSA9IHByb3RvO1xuICByZXF1aXJlKCcuLyQucmVkZWZpbmUnKShnbG9iYWwsICdSZWdFeHAnLCAkUmVnRXhwKTtcbn1cblxucmVxdWlyZSgnLi8kLnNldC1zcGVjaWVzJykoJ1JlZ0V4cCcpOyIsIi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzKClcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5pZihyZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKSAmJiAvLi9nLmZsYWdzICE9ICdnJykkLnNldERlc2MoUmVnRXhwLnByb3RvdHlwZSwgJ2ZsYWdzJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogcmVxdWlyZSgnLi8kLmZsYWdzJylcbn0pOyIsIi8vIEBAbWF0Y2ggbG9naWNcbnJlcXVpcmUoJy4vJC5maXgtcmUtd2tzJykoJ21hdGNoJywgMSwgZnVuY3Rpb24oZGVmaW5lZCwgTUFUQ0gpe1xuICAvLyAyMS4xLjMuMTEgU3RyaW5nLnByb3RvdHlwZS5tYXRjaChyZWdleHApXG4gIHJldHVybiBmdW5jdGlvbiBtYXRjaChyZWdleHApe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyAgPSBkZWZpbmVkKHRoaXMpXG4gICAgICAsIGZuID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtNQVRDSF07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWQgPyBmbi5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbTUFUQ0hdKFN0cmluZyhPKSk7XG4gIH07XG59KTsiLCIvLyBAQHJlcGxhY2UgbG9naWNcbnJlcXVpcmUoJy4vJC5maXgtcmUtd2tzJykoJ3JlcGxhY2UnLCAyLCBmdW5jdGlvbihkZWZpbmVkLCBSRVBMQUNFLCAkcmVwbGFjZSl7XG4gIC8vIDIxLjEuMy4xNCBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSlcbiAgcmV0dXJuIGZ1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPICA9IGRlZmluZWQodGhpcylcbiAgICAgICwgZm4gPSBzZWFyY2hWYWx1ZSA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZWFyY2hWYWx1ZVtSRVBMQUNFXTtcbiAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZFxuICAgICAgPyBmbi5jYWxsKHNlYXJjaFZhbHVlLCBPLCByZXBsYWNlVmFsdWUpXG4gICAgICA6ICRyZXBsYWNlLmNhbGwoU3RyaW5nKE8pLCBzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKTtcbiAgfTtcbn0pOyIsIi8vIEBAc2VhcmNoIGxvZ2ljXG5yZXF1aXJlKCcuLyQuZml4LXJlLXdrcycpKCdzZWFyY2gnLCAxLCBmdW5jdGlvbihkZWZpbmVkLCBTRUFSQ0gpe1xuICAvLyAyMS4xLjMuMTUgU3RyaW5nLnByb3RvdHlwZS5zZWFyY2gocmVnZXhwKVxuICByZXR1cm4gZnVuY3Rpb24gc2VhcmNoKHJlZ2V4cCl7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBPICA9IGRlZmluZWQodGhpcylcbiAgICAgICwgZm4gPSByZWdleHAgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcmVnZXhwW1NFQVJDSF07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWQgPyBmbi5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbU0VBUkNIXShTdHJpbmcoTykpO1xuICB9O1xufSk7IiwiLy8gQEBzcGxpdCBsb2dpY1xucmVxdWlyZSgnLi8kLmZpeC1yZS13a3MnKSgnc3BsaXQnLCAyLCBmdW5jdGlvbihkZWZpbmVkLCBTUExJVCwgJHNwbGl0KXtcbiAgLy8gMjEuMS4zLjE3IFN0cmluZy5wcm90b3R5cGUuc3BsaXQoc2VwYXJhdG9yLCBsaW1pdClcbiAgcmV0dXJuIGZ1bmN0aW9uIHNwbGl0KHNlcGFyYXRvciwgbGltaXQpe1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgTyAgPSBkZWZpbmVkKHRoaXMpXG4gICAgICAsIGZuID0gc2VwYXJhdG9yID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNlcGFyYXRvcltTUExJVF07XG4gICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWRcbiAgICAgID8gZm4uY2FsbChzZXBhcmF0b3IsIE8sIGxpbWl0KVxuICAgICAgOiAkc3BsaXQuY2FsbChTdHJpbmcoTyksIHNlcGFyYXRvciwgbGltaXQpO1xuICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xuXG4vLyAyMy4yIFNldCBPYmplY3RzXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCl7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHRoaXMsIHZhbHVlID0gdmFsdWUgPT09IDAgPyAwIDogdmFsdWUsIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsICRhdCAgICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWF0JykoZmFsc2UpO1xuJGV4cG9ydCgkZXhwb3J0LlAsICdTdHJpbmcnLCB7XG4gIC8vIDIxLjEuMy4zIFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXQocG9zKVxuICBjb2RlUG9pbnRBdDogZnVuY3Rpb24gY29kZVBvaW50QXQocG9zKXtcbiAgICByZXR1cm4gJGF0KHRoaXMsIHBvcyk7XG4gIH1cbn0pOyIsIi8vIDIxLjEuMy42IFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgoc2VhcmNoU3RyaW5nIFssIGVuZFBvc2l0aW9uXSlcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJylcbiAgLCBjb250ZXh0ICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWNvbnRleHQnKVxuICAsIEVORFNfV0lUSCA9ICdlbmRzV2l0aCdcbiAgLCAkZW5kc1dpdGggPSAnJ1tFTkRTX1dJVEhdO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vJC5mYWlscy1pcy1yZWdleHAnKShFTkRTX1dJVEgpLCAnU3RyaW5nJywge1xuICBlbmRzV2l0aDogZnVuY3Rpb24gZW5kc1dpdGgoc2VhcmNoU3RyaW5nIC8qLCBlbmRQb3NpdGlvbiA9IEBsZW5ndGggKi8pe1xuICAgIHZhciB0aGF0ID0gY29udGV4dCh0aGlzLCBzZWFyY2hTdHJpbmcsIEVORFNfV0lUSClcbiAgICAgICwgJCQgICA9IGFyZ3VtZW50c1xuICAgICAgLCBlbmRQb3NpdGlvbiA9ICQkLmxlbmd0aCA+IDEgPyAkJFsxXSA6IHVuZGVmaW5lZFxuICAgICAgLCBsZW4gICAgPSB0b0xlbmd0aCh0aGF0Lmxlbmd0aClcbiAgICAgICwgZW5kICAgID0gZW5kUG9zaXRpb24gPT09IHVuZGVmaW5lZCA/IGxlbiA6IE1hdGgubWluKHRvTGVuZ3RoKGVuZFBvc2l0aW9uKSwgbGVuKVxuICAgICAgLCBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoU3RyaW5nKTtcbiAgICByZXR1cm4gJGVuZHNXaXRoXG4gICAgICA/ICRlbmRzV2l0aC5jYWxsKHRoYXQsIHNlYXJjaCwgZW5kKVxuICAgICAgOiB0aGF0LnNsaWNlKGVuZCAtIHNlYXJjaC5sZW5ndGgsIGVuZCkgPT09IHNlYXJjaDtcbiAgfVxufSk7IiwidmFyICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgdG9JbmRleCAgICAgICAgPSByZXF1aXJlKCcuLyQudG8taW5kZXgnKVxuICAsIGZyb21DaGFyQ29kZSAgID0gU3RyaW5nLmZyb21DaGFyQ29kZVxuICAsICRmcm9tQ29kZVBvaW50ID0gU3RyaW5nLmZyb21Db2RlUG9pbnQ7XG5cbi8vIGxlbmd0aCBzaG91bGQgYmUgMSwgb2xkIEZGIHByb2JsZW1cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCEhJGZyb21Db2RlUG9pbnQgJiYgJGZyb21Db2RlUG9pbnQubGVuZ3RoICE9IDEpLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjIuMiBTdHJpbmcuZnJvbUNvZGVQb2ludCguLi5jb2RlUG9pbnRzKVxuICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbiBmcm9tQ29kZVBvaW50KHgpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgdmFyIHJlcyAgID0gW11cbiAgICAgICwgJCQgICAgPSBhcmd1bWVudHNcbiAgICAgICwgJCRsZW4gPSAkJC5sZW5ndGhcbiAgICAgICwgaSAgICAgPSAwXG4gICAgICAsIGNvZGU7XG4gICAgd2hpbGUoJCRsZW4gPiBpKXtcbiAgICAgIGNvZGUgPSArJCRbaSsrXTtcbiAgICAgIGlmKHRvSW5kZXgoY29kZSwgMHgxMGZmZmYpICE9PSBjb2RlKXRocm93IFJhbmdlRXJyb3IoY29kZSArICcgaXMgbm90IGEgdmFsaWQgY29kZSBwb2ludCcpO1xuICAgICAgcmVzLnB1c2goY29kZSA8IDB4MTAwMDBcbiAgICAgICAgPyBmcm9tQ2hhckNvZGUoY29kZSlcbiAgICAgICAgOiBmcm9tQ2hhckNvZGUoKChjb2RlIC09IDB4MTAwMDApID4+IDEwKSArIDB4ZDgwMCwgY29kZSAlIDB4NDAwICsgMHhkYzAwKVxuICAgICAgKTtcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XG4gIH1cbn0pOyIsIi8vIDIxLjEuMy43IFN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXMoc2VhcmNoU3RyaW5nLCBwb3NpdGlvbiA9IDApXG4ndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCBjb250ZXh0ICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctY29udGV4dCcpXG4gICwgSU5DTFVERVMgPSAnaW5jbHVkZXMnO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vJC5mYWlscy1pcy1yZWdleHAnKShJTkNMVURFUyksICdTdHJpbmcnLCB7XG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XG4gICAgcmV0dXJuICEhfmNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBJTkNMVURFUylcbiAgICAgIC5pbmRleE9mKHNlYXJjaFN0cmluZywgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vJC5zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwidmFyICRleHBvcnQgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuLyQudG8tbGVuZ3RoJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjIuNCBTdHJpbmcucmF3KGNhbGxTaXRlLCAuLi5zdWJzdGl0dXRpb25zKVxuICByYXc6IGZ1bmN0aW9uIHJhdyhjYWxsU2l0ZSl7XG4gICAgdmFyIHRwbCAgID0gdG9JT2JqZWN0KGNhbGxTaXRlLnJhdylcbiAgICAgICwgbGVuICAgPSB0b0xlbmd0aCh0cGwubGVuZ3RoKVxuICAgICAgLCAkJCAgICA9IGFyZ3VtZW50c1xuICAgICAgLCAkJGxlbiA9ICQkLmxlbmd0aFxuICAgICAgLCByZXMgICA9IFtdXG4gICAgICAsIGkgICAgID0gMDtcbiAgICB3aGlsZShsZW4gPiBpKXtcbiAgICAgIHJlcy5wdXNoKFN0cmluZyh0cGxbaSsrXSkpO1xuICAgICAgaWYoaSA8ICQkbGVuKXJlcy5wdXNoKFN0cmluZygkJFtpXSkpO1xuICAgIH0gcmV0dXJuIHJlcy5qb2luKCcnKTtcbiAgfVxufSk7IiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnU3RyaW5nJywge1xuICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXG4gIHJlcGVhdDogcmVxdWlyZSgnLi8kLnN0cmluZy1yZXBlYXQnKVxufSk7IiwiLy8gMjEuMS4zLjE4IFN0cmluZy5wcm90b3R5cGUuc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgWywgcG9zaXRpb24gXSlcbid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHRvTGVuZ3RoICAgID0gcmVxdWlyZSgnLi8kLnRvLWxlbmd0aCcpXG4gICwgY29udGV4dCAgICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLWNvbnRleHQnKVxuICAsIFNUQVJUU19XSVRIID0gJ3N0YXJ0c1dpdGgnXG4gICwgJHN0YXJ0c1dpdGggPSAnJ1tTVEFSVFNfV0lUSF07XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi8kLmZhaWxzLWlzLXJlZ2V4cCcpKFNUQVJUU19XSVRIKSwgJ1N0cmluZycsIHtcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgLyosIHBvc2l0aW9uID0gMCAqLyl7XG4gICAgdmFyIHRoYXQgICA9IGNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBTVEFSVFNfV0lUSClcbiAgICAgICwgJCQgICAgID0gYXJndW1lbnRzXG4gICAgICAsIGluZGV4ICA9IHRvTGVuZ3RoKE1hdGgubWluKCQkLmxlbmd0aCA+IDEgPyAkJFsxXSA6IHVuZGVmaW5lZCwgdGhhdC5sZW5ndGgpKVxuICAgICAgLCBzZWFyY2ggPSBTdHJpbmcoc2VhcmNoU3RyaW5nKTtcbiAgICByZXR1cm4gJHN0YXJ0c1dpdGhcbiAgICAgID8gJHN0YXJ0c1dpdGguY2FsbCh0aGF0LCBzZWFyY2gsIGluZGV4KVxuICAgICAgOiB0aGF0LnNsaWNlKGluZGV4LCBpbmRleCArIHNlYXJjaC5sZW5ndGgpID09PSBzZWFyY2g7XG4gIH1cbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIDIxLjEuMy4yNSBTdHJpbmcucHJvdG90eXBlLnRyaW0oKVxucmVxdWlyZSgnLi8kLnN0cmluZy10cmltJykoJ3RyaW0nLCBmdW5jdGlvbigkdHJpbSl7XG4gIHJldHVybiBmdW5jdGlvbiB0cmltKCl7XG4gICAgcmV0dXJuICR0cmltKHRoaXMsIDMpO1xuICB9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyICQgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmhhcycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKVxuICAsICRmYWlscyAgICAgICAgID0gcmVxdWlyZSgnLi8kLmZhaWxzJylcbiAgLCBzaGFyZWQgICAgICAgICA9IHJlcXVpcmUoJy4vJC5zaGFyZWQnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi8kLnNldC10by1zdHJpbmctdGFnJylcbiAgLCB1aWQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIHdrcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLndrcycpXG4gICwga2V5T2YgICAgICAgICAgPSByZXF1aXJlKCcuLyQua2V5b2YnKVxuICAsICRuYW1lcyAgICAgICAgID0gcmVxdWlyZSgnLi8kLmdldC1uYW1lcycpXG4gICwgZW51bUtleXMgICAgICAgPSByZXF1aXJlKCcuLyQuZW51bS1rZXlzJylcbiAgLCBpc0FycmF5ICAgICAgICA9IHJlcXVpcmUoJy4vJC5pcy1hcnJheScpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuLyQuYW4tb2JqZWN0JylcbiAgLCB0b0lPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vJC50by1pb2JqZWN0JylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJylcbiAgLCBnZXREZXNjICAgICAgICA9ICQuZ2V0RGVzY1xuICAsIHNldERlc2MgICAgICAgID0gJC5zZXREZXNjXG4gICwgX2NyZWF0ZSAgICAgICAgPSAkLmNyZWF0ZVxuICAsIGdldE5hbWVzICAgICAgID0gJG5hbWVzLmdldFxuICAsICRTeW1ib2wgICAgICAgID0gZ2xvYmFsLlN5bWJvbFxuICAsICRKU09OICAgICAgICAgID0gZ2xvYmFsLkpTT05cbiAgLCBfc3RyaW5naWZ5ICAgICA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeVxuICAsIHNldHRlciAgICAgICAgID0gZmFsc2VcbiAgLCBISURERU4gICAgICAgICA9IHdrcygnX2hpZGRlbicpXG4gICwgaXNFbnVtICAgICAgICAgPSAkLmlzRW51bVxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKVxuICAsIEFsbFN5bWJvbHMgICAgID0gc2hhcmVkKCdzeW1ib2xzJylcbiAgLCB1c2VOYXRpdmUgICAgICA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbidcbiAgLCBPYmplY3RQcm90byAgICA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIF9jcmVhdGUoc2V0RGVzYyh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gc2V0RGVzYyh0aGlzLCAnYScsIHt2YWx1ZTogN30pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24oaXQsIGtleSwgRCl7XG4gIHZhciBwcm90b0Rlc2MgPSBnZXREZXNjKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZihwcm90b0Rlc2MpZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIHNldERlc2MoaXQsIGtleSwgRCk7XG4gIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pc2V0RGVzYyhPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IHNldERlc2M7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24odGFnKXtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbC5wcm90b3R5cGUpO1xuICBzeW0uX2sgPSB0YWc7XG4gIERFU0NSSVBUT1JTICYmIHNldHRlciAmJiBzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCl7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkpe1xuICAgIGlmKCFELmVudW1lcmFibGUpe1xuICAgICAgaWYoIWhhcyhpdCwgSElEREVOKSlzZXREZXNjKGl0LCBISURERU4sIGNyZWF0ZURlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0paXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gX2NyZWF0ZShELCB7ZW51bWVyYWJsZTogY3JlYXRlRGVzYygwLCBmYWxzZSl9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBzZXREZXNjKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApe1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSlcbiAgICAsIGkgICAgPSAwXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGtleTtcbiAgd2hpbGUobCA+IGkpJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KXtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkpO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldXG4gICAgPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgdmFyIEQgPSBnZXREZXNjKGl0ID0gdG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ2V0TmFtZXModG9JT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOKXJlc3VsdC5wdXNoKGtleSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ2V0TmFtZXModG9JT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xudmFyICRzdHJpbmdpZnkgPSBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpe1xuICBpZihpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSlyZXR1cm47IC8vIElFOCByZXR1cm5zIHN0cmluZyBvbiB1bmRlZmluZWRcbiAgdmFyIGFyZ3MgPSBbaXRdXG4gICAgLCBpICAgID0gMVxuICAgICwgJCQgICA9IGFyZ3VtZW50c1xuICAgICwgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgd2hpbGUoJCQubGVuZ3RoID4gaSlhcmdzLnB1c2goJCRbaSsrXSk7XG4gIHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgaWYodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpJHJlcGxhY2VyID0gcmVwbGFjZXI7XG4gIGlmKCRyZXBsYWNlciB8fCAhaXNBcnJheShyZXBsYWNlcikpcmVwbGFjZXIgPSBmdW5jdGlvbihrZXksIHZhbHVlKXtcbiAgICBpZigkcmVwbGFjZXIpdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICBpZighaXNTeW1ib2wodmFsdWUpKXJldHVybiB2YWx1ZTtcbiAgfTtcbiAgYXJnc1sxXSA9IHJlcGxhY2VyO1xuICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG59O1xudmFyIGJ1Z2d5SlNPTiA9ICRmYWlscyhmdW5jdGlvbigpe1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7YTogU30pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KTtcblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZighdXNlTmF0aXZlKXtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpe1xuICAgIGlmKGlzU3ltYm9sKHRoaXMpKXRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XG4gICAgcmV0dXJuIHdyYXAodWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKSk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2wucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICBpc1N5bWJvbCA9IGZ1bmN0aW9uKGl0KXtcbiAgICByZXR1cm4gaXQgaW5zdGFuY2VvZiAkU3ltYm9sO1xuICB9O1xuXG4gICQuY3JlYXRlICAgICA9ICRjcmVhdGU7XG4gICQuaXNFbnVtICAgICA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgJC5nZXREZXNjICAgID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJC5zZXREZXNjICAgID0gJGRlZmluZVByb3BlcnR5O1xuICAkLnNldERlc2NzICAgPSAkZGVmaW5lUHJvcGVydGllcztcbiAgJC5nZXROYW1lcyAgID0gJG5hbWVzLmdldCA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICAkLmdldFN5bWJvbHMgPSAkZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmKERFU0NSSVBUT1JTICYmICFyZXF1aXJlKCcuLyQubGlicmFyeScpKXtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxufVxuXG52YXIgc3ltYm9sU3RhdGljcyA9IHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICByZXR1cm4ga2V5T2YoU3ltYm9sUmVnaXN0cnksIGtleSk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufTtcbi8vIDE5LjQuMi4yIFN5bWJvbC5oYXNJbnN0YW5jZVxuLy8gMTkuNC4yLjMgU3ltYm9sLmlzQ29uY2F0U3ByZWFkYWJsZVxuLy8gMTkuNC4yLjQgU3ltYm9sLml0ZXJhdG9yXG4vLyAxOS40LjIuNiBTeW1ib2wubWF0Y2hcbi8vIDE5LjQuMi44IFN5bWJvbC5yZXBsYWNlXG4vLyAxOS40LjIuOSBTeW1ib2wuc2VhcmNoXG4vLyAxOS40LjIuMTAgU3ltYm9sLnNwZWNpZXNcbi8vIDE5LjQuMi4xMSBTeW1ib2wuc3BsaXRcbi8vIDE5LjQuMi4xMiBTeW1ib2wudG9QcmltaXRpdmVcbi8vIDE5LjQuMi4xMyBTeW1ib2wudG9TdHJpbmdUYWdcbi8vIDE5LjQuMi4xNCBTeW1ib2wudW5zY29wYWJsZXNcbiQuZWFjaC5jYWxsKChcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCwnICtcbiAgJ3NwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHN5bSA9IHdrcyhpdCk7XG4gIHN5bWJvbFN0YXRpY3NbaXRdID0gdXNlTmF0aXZlID8gc3ltIDogd3JhcChzeW0pO1xufSk7XG5cbnNldHRlciA9IHRydWU7XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnU3ltYm9sJywgc3ltYm9sU3RhdGljcyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXVzZU5hdGl2ZSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiAkZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIXVzZU5hdGl2ZSB8fCBidWdneUpTT04pLCAnSlNPTicsIHtzdHJpbmdpZnk6ICRzdHJpbmdpZnl9KTtcblxuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhnbG9iYWwuSlNPTiwgJ0pTT04nLCB0cnVlKTsiLCIndXNlIHN0cmljdCc7XG52YXIgJCAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCByZWRlZmluZSAgICAgPSByZXF1aXJlKCcuLyQucmVkZWZpbmUnKVxuICAsIHdlYWsgICAgICAgICA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXdlYWsnKVxuICAsIGlzT2JqZWN0ICAgICA9IHJlcXVpcmUoJy4vJC5pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIGZyb3plblN0b3JlICA9IHdlYWsuZnJvemVuU3RvcmVcbiAgLCBXRUFLICAgICAgICAgPSB3ZWFrLldFQUtcbiAgLCBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGlzT2JqZWN0XG4gICwgdG1wICAgICAgICAgID0ge307XG5cbi8vIDIzLjMgV2Vha01hcCBPYmplY3RzXG52YXIgJFdlYWtNYXAgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdXZWFrTWFwJywgZnVuY3Rpb24oZ2V0KXtcbiAgcmV0dXJuIGZ1bmN0aW9uIFdlYWtNYXAoKXsgcmV0dXJuIGdldCh0aGlzLCBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7IH07XG59LCB7XG4gIC8vIDIzLjMuMy4zIFdlYWtNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSl7XG4gICAgaWYoaXNPYmplY3Qoa2V5KSl7XG4gICAgICBpZighaXNFeHRlbnNpYmxlKGtleSkpcmV0dXJuIGZyb3plblN0b3JlKHRoaXMpLmdldChrZXkpO1xuICAgICAgaWYoaGFzKGtleSwgV0VBSykpcmV0dXJuIGtleVtXRUFLXVt0aGlzLl9pXTtcbiAgICB9XG4gIH0sXG4gIC8vIDIzLjMuMy41IFdlYWtNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKXtcbiAgICByZXR1cm4gd2Vhay5kZWYodGhpcywga2V5LCB2YWx1ZSk7XG4gIH1cbn0sIHdlYWssIHRydWUsIHRydWUpO1xuXG4vLyBJRTExIFdlYWtNYXAgZnJvemVuIGtleXMgZml4XG5pZihuZXcgJFdlYWtNYXAoKS5zZXQoKE9iamVjdC5mcmVlemUgfHwgT2JqZWN0KSh0bXApLCA3KS5nZXQodG1wKSAhPSA3KXtcbiAgJC5lYWNoLmNhbGwoWydkZWxldGUnLCAnaGFzJywgJ2dldCcsICdzZXQnXSwgZnVuY3Rpb24oa2V5KXtcbiAgICB2YXIgcHJvdG8gID0gJFdlYWtNYXAucHJvdG90eXBlXG4gICAgICAsIG1ldGhvZCA9IHByb3RvW2tleV07XG4gICAgcmVkZWZpbmUocHJvdG8sIGtleSwgZnVuY3Rpb24oYSwgYil7XG4gICAgICAvLyBzdG9yZSBmcm96ZW4gb2JqZWN0cyBvbiBsZWFreSBtYXBcbiAgICAgIGlmKGlzT2JqZWN0KGEpICYmICFpc0V4dGVuc2libGUoYSkpe1xuICAgICAgICB2YXIgcmVzdWx0ID0gZnJvemVuU3RvcmUodGhpcylba2V5XShhLCBiKTtcbiAgICAgICAgcmV0dXJuIGtleSA9PSAnc2V0JyA/IHRoaXMgOiByZXN1bHQ7XG4gICAgICAvLyBzdG9yZSBhbGwgdGhlIHJlc3Qgb24gbmF0aXZlIHdlYWttYXBcbiAgICAgIH0gcmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMsIGEsIGIpO1xuICAgIH0pO1xuICB9KTtcbn0iLCIndXNlIHN0cmljdCc7XG52YXIgd2VhayA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXdlYWsnKTtcblxuLy8gMjMuNCBXZWFrU2V0IE9iamVjdHNcbnJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uJykoJ1dlYWtTZXQnLCBmdW5jdGlvbihnZXQpe1xuICByZXR1cm4gZnVuY3Rpb24gV2Vha1NldCgpeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuNC4zLjEgV2Vha1NldC5wcm90b3R5cGUuYWRkKHZhbHVlKVxuICBhZGQ6IGZ1bmN0aW9uIGFkZCh2YWx1ZSl7XG4gICAgcmV0dXJuIHdlYWsuZGVmKHRoaXMsIHZhbHVlLCB0cnVlKTtcbiAgfVxufSwgd2VhaywgZmFsc2UsIHRydWUpOyIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ICAgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCAkaW5jbHVkZXMgPSByZXF1aXJlKCcuLyQuYXJyYXktaW5jbHVkZXMnKSh0cnVlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHtcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvbWVuaWMvQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhlbCAvKiwgZnJvbUluZGV4ID0gMCAqLyl7XG4gICAgcmV0dXJuICRpbmNsdWRlcyh0aGlzLCBlbCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcblxucmVxdWlyZSgnLi8kLmFkZC10by11bnNjb3BhYmxlcycpKCdpbmNsdWRlcycpOyIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdNYXAnLCB7dG9KU09OOiByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi10by1qc29uJykoJ01hcCcpfSk7IiwiLy8gaHR0cDovL2dvby5nbC9Ya0JyakRcbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsICRlbnRyaWVzID0gcmVxdWlyZSgnLi8kLm9iamVjdC10by1hcnJheScpKHRydWUpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgZW50cmllczogZnVuY3Rpb24gZW50cmllcyhpdCl7XG4gICAgcmV0dXJuICRlbnRyaWVzKGl0KTtcbiAgfVxufSk7IiwiLy8gaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vV2ViUmVmbGVjdGlvbi85MzUzNzgxXG52YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgJGV4cG9ydCAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIG93bktleXMgICAgPSByZXF1aXJlKCcuLyQub3duLWtleXMnKVxuICAsIHRvSU9iamVjdCAgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vJC5wcm9wZXJ0eS1kZXNjJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzKG9iamVjdCl7XG4gICAgdmFyIE8gICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICAgLCBzZXREZXNjID0gJC5zZXREZXNjXG4gICAgICAsIGdldERlc2MgPSAkLmdldERlc2NcbiAgICAgICwga2V5cyAgICA9IG93bktleXMoTylcbiAgICAgICwgcmVzdWx0ICA9IHt9XG4gICAgICAsIGkgICAgICAgPSAwXG4gICAgICAsIGtleSwgRDtcbiAgICB3aGlsZShrZXlzLmxlbmd0aCA+IGkpe1xuICAgICAgRCA9IGdldERlc2MoTywga2V5ID0ga2V5c1tpKytdKTtcbiAgICAgIGlmKGtleSBpbiByZXN1bHQpc2V0RGVzYyhyZXN1bHQsIGtleSwgY3JlYXRlRGVzYygwLCBEKSk7XG4gICAgICBlbHNlIHJlc3VsdFtrZXldID0gRDtcbiAgICB9IHJldHVybiByZXN1bHQ7XG4gIH1cbn0pOyIsIi8vIGh0dHA6Ly9nb28uZ2wvWGtCcmpEXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsICR2YWx1ZXMgPSByZXF1aXJlKCcuLyQub2JqZWN0LXRvLWFycmF5JykoZmFsc2UpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtcbiAgdmFsdWVzOiBmdW5jdGlvbiB2YWx1ZXMoaXQpe1xuICAgIHJldHVybiAkdmFsdWVzKGl0KTtcbiAgfVxufSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL2JlbmphbWluZ3IvUmV4RXhwLmVzY2FwZVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCAkcmUgICAgID0gcmVxdWlyZSgnLi8kLnJlcGxhY2VyJykoL1tcXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCAnXFxcXCQmJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnUmVnRXhwJywge2VzY2FwZTogZnVuY3Rpb24gZXNjYXBlKGl0KXsgcmV0dXJuICRyZShpdCk7IH19KTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9EYXZpZEJydWFudC9NYXAtU2V0LnByb3RvdHlwZS50b0pTT05cbnZhciAkZXhwb3J0ICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdTZXQnLCB7dG9KU09OOiByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi10by1qc29uJykoJ1NldCcpfSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gaHR0cHM6Ly9naXRodWIuY29tL21hdGhpYXNieW5lbnMvU3RyaW5nLnByb3RvdHlwZS5hdFxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCAkYXQgICAgID0gcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKHRydWUpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgYXQ6IGZ1bmN0aW9uIGF0KHBvcyl7XG4gICAgcmV0dXJuICRhdCh0aGlzLCBwb3MpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsICRwYWQgICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLXBhZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgcGFkTGVmdDogZnVuY3Rpb24gcGFkTGVmdChtYXhMZW5ndGggLyosIGZpbGxTdHJpbmcgPSAnICcgKi8pe1xuICAgIHJldHVybiAkcGFkKHRoaXMsIG1heExlbmd0aCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIHRydWUpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsICRwYWQgICAgPSByZXF1aXJlKCcuLyQuc3RyaW5nLXBhZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ1N0cmluZycsIHtcbiAgcGFkUmlnaHQ6IGZ1bmN0aW9uIHBhZFJpZ2h0KG1heExlbmd0aCAvKiwgZmlsbFN0cmluZyA9ICcgJyAqLyl7XG4gICAgcmV0dXJuICRwYWQodGhpcywgbWF4TGVuZ3RoLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgZmFsc2UpO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vc2VibWFya2JhZ2UvZWNtYXNjcmlwdC1zdHJpbmctbGVmdC1yaWdodC10cmltXG5yZXF1aXJlKCcuLyQuc3RyaW5nLXRyaW0nKSgndHJpbUxlZnQnLCBmdW5jdGlvbigkdHJpbSl7XG4gIHJldHVybiBmdW5jdGlvbiB0cmltTGVmdCgpe1xuICAgIHJldHVybiAkdHJpbSh0aGlzLCAxKTtcbiAgfTtcbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9zZWJtYXJrYmFnZS9lY21hc2NyaXB0LXN0cmluZy1sZWZ0LXJpZ2h0LXRyaW1cbnJlcXVpcmUoJy4vJC5zdHJpbmctdHJpbScpKCd0cmltUmlnaHQnLCBmdW5jdGlvbigkdHJpbSl7XG4gIHJldHVybiBmdW5jdGlvbiB0cmltUmlnaHQoKXtcbiAgICByZXR1cm4gJHRyaW0odGhpcywgMik7XG4gIH07XG59KTsiLCIvLyBKYXZhU2NyaXB0IDEuNiAvIFN0cmF3bWFuIGFycmF5IHN0YXRpY3Mgc2hpbVxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCAkY3R4ICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXG4gICwgJEFycmF5ICA9IHJlcXVpcmUoJy4vJC5jb3JlJykuQXJyYXkgfHwgQXJyYXlcbiAgLCBzdGF0aWNzID0ge307XG52YXIgc2V0U3RhdGljcyA9IGZ1bmN0aW9uKGtleXMsIGxlbmd0aCl7XG4gICQuZWFjaC5jYWxsKGtleXMuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcbiAgICBpZihsZW5ndGggPT0gdW5kZWZpbmVkICYmIGtleSBpbiAkQXJyYXkpc3RhdGljc1trZXldID0gJEFycmF5W2tleV07XG4gICAgZWxzZSBpZihrZXkgaW4gW10pc3RhdGljc1trZXldID0gJGN0eChGdW5jdGlvbi5jYWxsLCBbXVtrZXldLCBsZW5ndGgpO1xuICB9KTtcbn07XG5zZXRTdGF0aWNzKCdwb3AscmV2ZXJzZSxzaGlmdCxrZXlzLHZhbHVlcyxlbnRyaWVzJywgMSk7XG5zZXRTdGF0aWNzKCdpbmRleE9mLGV2ZXJ5LHNvbWUsZm9yRWFjaCxtYXAsZmlsdGVyLGZpbmQsZmluZEluZGV4LGluY2x1ZGVzJywgMyk7XG5zZXRTdGF0aWNzKCdqb2luLHNsaWNlLGNvbmNhdCxwdXNoLHNwbGljZSx1bnNoaWZ0LHNvcnQsbGFzdEluZGV4T2YsJyArXG4gICAgICAgICAgICdyZWR1Y2UscmVkdWNlUmlnaHQsY29weVdpdGhpbixmaWxsJyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ0FycmF5Jywgc3RhdGljcyk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgICAgICA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKVxuICAsIGhpZGUgICAgICAgID0gcmVxdWlyZSgnLi8kLmhpZGUnKVxuICAsIEl0ZXJhdG9ycyAgID0gcmVxdWlyZSgnLi8kLml0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBOTCAgICAgICAgICA9IGdsb2JhbC5Ob2RlTGlzdFxuICAsIEhUQyAgICAgICAgID0gZ2xvYmFsLkhUTUxDb2xsZWN0aW9uXG4gICwgTkxQcm90byAgICAgPSBOTCAmJiBOTC5wcm90b3R5cGVcbiAgLCBIVENQcm90byAgICA9IEhUQyAmJiBIVEMucHJvdG90eXBlXG4gICwgQXJyYXlWYWx1ZXMgPSBJdGVyYXRvcnMuTm9kZUxpc3QgPSBJdGVyYXRvcnMuSFRNTENvbGxlY3Rpb24gPSBJdGVyYXRvcnMuQXJyYXk7XG5pZihOTFByb3RvICYmICFOTFByb3RvW0lURVJBVE9SXSloaWRlKE5MUHJvdG8sIElURVJBVE9SLCBBcnJheVZhbHVlcyk7XG5pZihIVENQcm90byAmJiAhSFRDUHJvdG9bSVRFUkFUT1JdKWhpZGUoSFRDUHJvdG8sIElURVJBVE9SLCBBcnJheVZhbHVlcyk7IiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuLyQuZXhwb3J0JylcbiAgLCAkdGFzayAgID0gcmVxdWlyZSgnLi8kLnRhc2snKTtcbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5CLCB7XG4gIHNldEltbWVkaWF0ZTogICAkdGFzay5zZXQsXG4gIGNsZWFySW1tZWRpYXRlOiAkdGFzay5jbGVhclxufSk7IiwiLy8gaWU5LSBzZXRUaW1lb3V0ICYgc2V0SW50ZXJ2YWwgYWRkaXRpb25hbCBwYXJhbWV0ZXJzIGZpeFxudmFyIGdsb2JhbCAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCAkZXhwb3J0ICAgID0gcmVxdWlyZSgnLi8kLmV4cG9ydCcpXG4gICwgaW52b2tlICAgICA9IHJlcXVpcmUoJy4vJC5pbnZva2UnKVxuICAsIHBhcnRpYWwgICAgPSByZXF1aXJlKCcuLyQucGFydGlhbCcpXG4gICwgbmF2aWdhdG9yICA9IGdsb2JhbC5uYXZpZ2F0b3JcbiAgLCBNU0lFICAgICAgID0gISFuYXZpZ2F0b3IgJiYgL01TSUUgLlxcLi8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KTsgLy8gPC0gZGlydHkgaWU5LSBjaGVja1xudmFyIHdyYXAgPSBmdW5jdGlvbihzZXQpe1xuICByZXR1cm4gTVNJRSA/IGZ1bmN0aW9uKGZuLCB0aW1lIC8qLCAuLi5hcmdzICovKXtcbiAgICByZXR1cm4gc2V0KGludm9rZShcbiAgICAgIHBhcnRpYWwsXG4gICAgICBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMiksXG4gICAgICB0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pXG4gICAgKSwgdGltZSk7XG4gIH0gOiBzZXQ7XG59O1xuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LkIgKyAkZXhwb3J0LkYgKiBNU0lFLCB7XG4gIHNldFRpbWVvdXQ6ICB3cmFwKGdsb2JhbC5zZXRUaW1lb3V0KSxcbiAgc2V0SW50ZXJ2YWw6IHdyYXAoZ2xvYmFsLnNldEludGVydmFsKVxufSk7IiwicmVxdWlyZSgnLi9tb2R1bGVzL2VzNScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuaXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuZnJlZXplJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5zZWFsJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5wcmV2ZW50LWV4dGVuc2lvbnMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LmlzLWZyb3plbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuaXMtc2VhbGVkJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5pcy1leHRlbnNpYmxlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1wcm90b3R5cGUtb2YnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LmtleXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktbmFtZXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5mdW5jdGlvbi5oYXMtaW5zdGFuY2UnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubnVtYmVyLmNvbnN0cnVjdG9yJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5lcHNpbG9uJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5pcy1maW5pdGUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubnVtYmVyLmlzLWludGVnZXInKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubnVtYmVyLmlzLW5hbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIuaXMtc2FmZS1pbnRlZ2VyJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5tYXgtc2FmZS1pbnRlZ2VyJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5taW4tc2FmZS1pbnRlZ2VyJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm51bWJlci5wYXJzZS1mbG9hdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5udW1iZXIucGFyc2UtaW50Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGguYWNvc2gnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubWF0aC5hc2luaCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXRoLmF0YW5oJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGguY2JydCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXRoLmNsejMyJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGguY29zaCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXRoLmV4cG0xJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGguZnJvdW5kJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGguaHlwb3QnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubWF0aC5pbXVsJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGgubG9nMTAnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubWF0aC5sb2cxcCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXRoLmxvZzInKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubWF0aC5zaWduJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hdGguc2luaCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXRoLnRhbmgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubWF0aC50cnVuYycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5yYXcnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnRyaW0nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5jb2RlLXBvaW50LWF0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5lbmRzLXdpdGgnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmluY2x1ZGVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5yZXBlYXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZyb20nKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkub2YnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuc3BlY2llcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5jb3B5LXdpdGhpbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maWxsJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbmQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmluZC1pbmRleCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWdleHAuY29uc3RydWN0b3InKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVnZXhwLmZsYWdzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZ2V4cC5tYXRjaCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWdleHAucmVwbGFjZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWdleHAuc2VhcmNoJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZ2V4cC5zcGxpdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2Lm1hcCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zZXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYud2Vhay1tYXAnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYud2Vhay1zZXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdC5hcHBseScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0LmNvbnN0cnVjdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlZmluZS1wcm9wZXJ0eScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlbGV0ZS1wcm9wZXJ0eScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0LmVudW1lcmF0ZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0LmdldCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWZsZWN0LmdldC1wcm90b3R5cGUtb2YnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdC5oYXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdC5pcy1leHRlbnNpYmxlJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZmxlY3Qub3duLWtleXMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdC5wcmV2ZW50LWV4dGVuc2lvbnMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdC5zZXQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYucmVmbGVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LmFycmF5LmluY2x1ZGVzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LnN0cmluZy5hdCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcucGFkLWxlZnQnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcuc3RyaW5nLnBhZC1yaWdodCcpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zdHJpbmcudHJpbS1sZWZ0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LnN0cmluZy50cmltLXJpZ2h0Jyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LnJlZ2V4cC5lc2NhcGUnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcnMnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczcub2JqZWN0LnZhbHVlcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5vYmplY3QuZW50cmllcycpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5tYXAudG8tanNvbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5zZXQudG8tanNvbicpO1xucmVxdWlyZSgnLi9tb2R1bGVzL2pzLmFycmF5LnN0YXRpY3MnKTtcbnJlcXVpcmUoJy4vbW9kdWxlcy93ZWIudGltZXJzJyk7XG5yZXF1aXJlKCcuL21vZHVsZXMvd2ViLmltbWVkaWF0ZScpO1xucmVxdWlyZSgnLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9tb2R1bGVzLyQuY29yZScpOyIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiOyhmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge3ZhciBvYnNlcnZhYmxlID0gZnVuY3Rpb24oZWwpIHtcblxuICAvKipcbiAgICogRXh0ZW5kIHRoZSBvcmlnaW5hbCBvYmplY3Qgb3IgY3JlYXRlIGEgbmV3IGVtcHR5IG9uZVxuICAgKiBAdHlwZSB7IE9iamVjdCB9XG4gICAqL1xuXG4gIGVsID0gZWwgfHwge31cblxuICAvKipcbiAgICogUHJpdmF0ZSB2YXJpYWJsZXMgYW5kIG1ldGhvZHNcbiAgICovXG4gIHZhciBjYWxsYmFja3MgPSB7fSxcbiAgICBzbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZSxcbiAgICBvbkVhY2hFdmVudCA9IGZ1bmN0aW9uKGUsIGZuKSB7IGUucmVwbGFjZSgvXFxTKy9nLCBmbikgfSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsIGtleSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICAgIH0pXG4gICAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZCBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGVhY2ggdGltZSBhbiBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqIEBwYXJhbSAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAqIEBwYXJhbSAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgKi9cbiAgZGVmaW5lUHJvcGVydHkoJ29uJywgZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgIGlmICh0eXBlb2YgZm4gIT0gJ2Z1bmN0aW9uJykgIHJldHVybiBlbFxuXG4gICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lLCBwb3MpIHtcbiAgICAgIChjYWxsYmFja3NbbmFtZV0gPSBjYWxsYmFja3NbbmFtZV0gfHwgW10pLnB1c2goZm4pXG4gICAgICBmbi50eXBlZCA9IHBvcyA+IDBcbiAgICB9KVxuXG4gICAgcmV0dXJuIGVsXG4gIH0pXG5cbiAgLyoqXG4gICAqIFJlbW92ZXMgdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGxpc3RlbmVyc1xuICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgKi9cbiAgZGVmaW5lUHJvcGVydHkoJ29mZicsIGZ1bmN0aW9uKGV2ZW50cywgZm4pIHtcbiAgICBpZiAoZXZlbnRzID09ICcqJyAmJiAhZm4pIGNhbGxiYWNrcyA9IHt9XG4gICAgZWxzZSB7XG4gICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjYiA9PSBmbikgYXJyLnNwbGljZShpLS0sIDEpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgZGVsZXRlIGNhbGxiYWNrc1tuYW1lXVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH0pXG5cbiAgLyoqXG4gICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgYXQgbW9zdCBvbmNlXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAqL1xuICBkZWZpbmVQcm9wZXJ0eSgnb25lJywgZnVuY3Rpb24oZXZlbnRzLCBmbikge1xuICAgIGZ1bmN0aW9uIG9uKCkge1xuICAgICAgZWwub2ZmKGV2ZW50cywgb24pXG4gICAgICBmbi5hcHBseShlbCwgYXJndW1lbnRzKVxuICAgIH1cbiAgICByZXR1cm4gZWwub24oZXZlbnRzLCBvbilcbiAgfSlcblxuICAvKipcbiAgICogRXhlY3V0ZSBhbGwgY2FsbGJhY2sgZnVuY3Rpb25zIHRoYXQgbGlzdGVuIHRvIHRoZSBnaXZlbiBzcGFjZSBzZXBhcmF0ZWQgbGlzdCBvZiBgZXZlbnRzYFxuICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGV2ZW50cyAtIGV2ZW50cyBpZHNcbiAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgKi9cbiAgZGVmaW5lUHJvcGVydHkoJ3RyaWdnZXInLCBmdW5jdGlvbihldmVudHMpIHtcblxuICAgIC8vIGdldHRpbmcgdGhlIGFyZ3VtZW50c1xuICAgIC8vIHNraXBwaW5nIHRoZSBmaXJzdCBvbmVcbiAgICB2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgIGZuc1xuXG4gICAgb25FYWNoRXZlbnQoZXZlbnRzLCBmdW5jdGlvbihuYW1lKSB7XG5cbiAgICAgIGZucyA9IHNsaWNlLmNhbGwoY2FsbGJhY2tzW25hbWVdIHx8IFtdLCAwKVxuXG4gICAgICBmb3IgKHZhciBpID0gMCwgZm47IGZuID0gZm5zW2ldOyArK2kpIHtcbiAgICAgICAgaWYgKGZuLmJ1c3kpIHJldHVyblxuICAgICAgICBmbi5idXN5ID0gMVxuICAgICAgICBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrc1snKiddICYmIG5hbWUgIT0gJyonKVxuICAgICAgICBlbC50cmlnZ2VyLmFwcGx5KGVsLCBbJyonLCBuYW1lXS5jb25jYXQoYXJncykpXG5cbiAgICB9KVxuXG4gICAgcmV0dXJuIGVsXG4gIH0pXG5cbiAgcmV0dXJuIGVsXG5cbn1cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgLy8gc3VwcG9ydCBDb21tb25KUywgQU1EICYgYnJvd3NlclxuICBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuICAgIG1vZHVsZS5leHBvcnRzID0gb2JzZXJ2YWJsZVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG4gICAgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gb2JzZXJ2YWJsZSB9KVxuICBlbHNlXG4gICAgd2luZG93Lm9ic2VydmFibGUgPSBvYnNlcnZhYmxlXG5cbn0pKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB1bmRlZmluZWQpOyJdfQ==
