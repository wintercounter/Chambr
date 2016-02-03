(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
    function Client() {
        _classCallCheck(this, Client);

        console.log(1);
    }

    _createClass(Client, [{
        key: "on",
        value: function on() {}
    }]);

    return Client;
}();

exports.default = Client;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Client = function () {
    function Client(worker) {
        _classCallCheck(this, Client);

        this.Worker = undefined;
        this.Events = {};
        this._worker = undefined;

        Instance = this;
        this._worker = worker;
        this.start(worker);
    }

    _createClass(Client, [{
        key: 'on',
        value: function on(name, callback) {
            this.Events[name] = this.Events[name] || [];
            this.Events[name].push(callback);
            return this;
        }
    }, {
        key: 'start',
        value: function start() {
            this.Worker = new Worker(this._worker);
            this.bind();
        }
    }, {
        key: 'whisper',
        value: function whisper(name, data) {
            var _this = this;

            this.Events[name] && this.Events[name].forEach(function (fn) {
                fn.call(_this, data);
            });
            return this;
        }

        // MessageEvent

    }, {
        key: 'bind',
        value: function bind() {
            var _this2 = this;

            this.Worker.addEventListener('message', function (ev) {
                return _this2.whisper(ev.data.name, ev.data.data);
            }, true);
        }
    }], [{
        key: 'getInstance',
        value: function getInstance() {
            return Instance;
        }
    }]);

    return Client;
}();

exports.default = Client;

var Instance = undefined;

},{}],3:[function(require,module,exports){
'use strict';

var _Client = require('./Gateway/Client.es6');

var _Client2 = _interopRequireDefault(_Client);

var _riot = require('riot');

var _riot2 = _interopRequireDefault(_riot);

require('./Tags.es6');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _Client2.default('dist/worker.js').on('ready', function () {
    _riot2.default.mount('my-app');
});

},{"./Gateway/Client.es6":2,"./Tags.es6":4,"riot":5}],4:[function(require,module,exports){
'use strict';

var _riot = require('riot');

var _riot2 = _interopRequireDefault(_riot);

var _Client = require('./Chambr/Client.es6');

var _Client2 = _interopRequireDefault(_Client);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_riot2.default.tag('my-app', '<yield></yield>');

_riot2.default.tag('notes', '\n<note each="{ Notes }">\n    { body }\n</note>\n', function () {
    var Notes = this.Notes = new _Client2.default('notes');
    Notes.on('notes_updated', this.update.bind(this));
});

},{"./Chambr/Client.es6":1,"riot":5}],5:[function(require,module,exports){
/* Riot v2.3.12, @license MIT, (c) 2015 Muut Inc. + contributors */

;(function(window, undefined) {
  'use strict';
var riot = { version: 'v2.3.12', settings: {} },
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
  T_UNDEF  = 'undefined',
  T_FUNCTION = 'function',
  // special native tags that cannot be treated like the others
  SPECIAL_TAGS_REGEX = /^(?:opt(ion|group)|tbody|col|t[rhd])$/,
  RESERVED_WORDS_BLACKLIST = ['_item', '_id', '_parent', 'update', 'root', 'mount', 'unmount', 'mixin', 'isMounted', 'isLoop', 'tags', 'parent', 'opts', 'trigger', 'on', 'off', 'one'],

  // version# for IE 8-11, 0 for others
  IE_VERSION = (window && window.document || {}).documentMode | 0
/* istanbul ignore next */
riot.observable = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {}

  /**
   * Private variables and methods
   */

  var callbacks = {},
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
    if (events == '*') callbacks = {}
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
    var arglen = arguments.length - 1,
      args = new Array(arglen)
    for (var i = 0; i < arglen; i++) {
      args[i] = arguments[i + 1]
    }

    onEachEvent(events, function(name) {

      var fns = (callbacks[name] || []).slice(0)

      for (var i = 0, fn; fn = fns[i]; ++i) {
        if (fn.busy) return
        fn.busy = 1

        try {
          fn.apply(el, fn.typed ? [name].concat(args) : args)
        } catch (e) { el.trigger('error', e) }
        if (fns[i] !== fn) { i-- }
        fn.busy = 0
      }

      if (callbacks.all && name != 'all')
        el.trigger.apply(el, ['all', name].concat(args))

    })

    return el
  })

  return el

}
/* istanbul ignore next */
;(function(riot) { if (!window) return;

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
  win = window,
  doc = document,
  loc = win.history.location || win.location, // see html5-history-api
  prot = Router.prototype, // to minify more
  clickEvent = doc && doc.ontouchstart ? 'touchstart' : 'click',
  started = false,
  central = riot.observable(),
  routeFound = false,
  debouncedEmit,
  base, current, parser, secondParser, emitStack = [], emitStackLevel = 0

/**
 * Default parser. You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @returns {array} array
 */
function DEFAULT_PARSER(path) {
  return path.split(/[/?#]/)
}

/**
 * Default parser (second). You can replace it via router.parser method.
 * @param {string} path - current path (normalized)
 * @param {string} filter - filter string (normalized)
 * @returns {array} array
 */
function DEFAULT_SECOND_PARSER(path, filter) {
  var re = new RegExp('^' + filter[REPLACE](/\*/g, '([^/?#]+?)')[REPLACE](/\.\./, '.*') + '$'),
    args = path.match(re)

  if (args) return args.slice(1)
}

/**
 * Simple/cheap debounce implementation
 * @param   {function} fn - callback
 * @param   {number} delay - delay in seconds
 * @returns {function} debounced function
 */
function debounce(fn, delay) {
  var t
  return function () {
    clearTimeout(t)
    t = setTimeout(fn, delay)
  }
}

/**
 * Set the window listeners to trigger the routes
 * @param {boolean} autoExec - see route.start
 */
function start(autoExec) {
  debouncedEmit = debounce(emit, 1)
  win[ADD_EVENT_LISTENER](POPSTATE, debouncedEmit)
  win[ADD_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
  doc[ADD_EVENT_LISTENER](clickEvent, click)
  if (autoExec) emit(true)
}

/**
 * Router class
 */
function Router() {
  this.$ = []
  riot.observable(this) // make it observable
  central.on('stop', this.s.bind(this))
  central.on('emit', this.e.bind(this))
}

function normalize(path) {
  return path[REPLACE](/^\/|\/$/, '')
}

function isString(str) {
  return typeof str == 'string'
}

/**
 * Get the part after domain name
 * @param {string} href - fullpath
 * @returns {string} path from root
 */
function getPathFromRoot(href) {
  return (href || loc.href)[REPLACE](RE_ORIGIN, '')
}

/**
 * Get the part after base
 * @param {string} href - fullpath
 * @returns {string} path from base
 */
function getPathFromBase(href) {
  return base[0] == '#'
    ? (href || loc.href).split(base)[1] || ''
    : getPathFromRoot(href)[REPLACE](base, '')
}

function emit(force) {
  // the stack is needed for redirections
  var isRoot = emitStackLevel == 0
  if (MAX_EMIT_STACK_LEVEL <= emitStackLevel) return

  emitStackLevel++
  emitStack.push(function() {
    var path = getPathFromBase()
    if (force || path != current) {
      central[TRIGGER]('emit', path)
      current = path
    }
  })
  if (isRoot) {
    while (emitStack.length) {
      emitStack[0]()
      emitStack.shift()
    }
    emitStackLevel = 0
  }
}

function click(e) {
  if (
    e.which != 1 // not left click
    || e.metaKey || e.ctrlKey || e.shiftKey // or meta keys
    || e.defaultPrevented // or default prevented
  ) return

  var el = e.target
  while (el && el.nodeName != 'A') el = el.parentNode
  if (
    !el || el.nodeName != 'A' // not A tag
    || el[HAS_ATTRIBUTE]('download') // has download attr
    || !el[HAS_ATTRIBUTE]('href') // has no href attr
    || el.target && el.target != '_self' // another window or frame
    || el.href.indexOf(loc.href.match(RE_ORIGIN)[0]) == -1 // cross origin
  ) return

  if (el.href != loc.href) {
    if (
      el.href.split('#')[0] == loc.href.split('#')[0] // internal jump
      || base != '#' && getPathFromRoot(el.href).indexOf(base) !== 0 // outside of base
      || !go(getPathFromBase(el.href), el.title || doc.title) // route not found
    ) return
  }

  e.preventDefault()
}

/**
 * Go to the path
 * @param {string} path - destination path
 * @param {string} title - page title
 * @returns {boolean} - route not found flag
 */
function go(path, title) {
  title = title || doc.title
  // browsers ignores the second parameter `title`
  history.pushState(null, title, base + normalize(path))
  // so we need to set it manually
  doc.title = title
  routeFound = false
  emit()
  return routeFound
}

/**
 * Go to path or set action
 * a single string:                go there
 * two strings:                    go there with setting a title
 * a single function:              set an action on the default route
 * a string/RegExp and a function: set an action on the route
 * @param {(string|function)} first - path / action / filter
 * @param {(string|RegExp|function)} second - title / action
 */
prot.m = function(first, second) {
  if (isString(first) && (!second || isString(second))) go(first, second)
  else if (second) this.r(first, second)
  else this.r('@', first)
}

/**
 * Stop routing
 */
prot.s = function() {
  this.off('*')
  this.$ = []
}

/**
 * Emit
 * @param {string} path - path
 */
prot.e = function(path) {
  this.$.concat('@').some(function(filter) {
    var args = (filter == '@' ? parser : secondParser)(normalize(path), normalize(filter))
    if (typeof args != 'undefined') {
      this[TRIGGER].apply(null, [filter].concat(args))
      return routeFound = true // exit from loop
    }
  }, this)
}

/**
 * Register route
 * @param {string} filter - filter for matching to url
 * @param {function} action - action to register
 */
prot.r = function(filter, action) {
  if (filter != '@') {
    filter = '/' + normalize(filter)
    this.$.push(filter)
  }
  this.on(filter, action)
}

var mainRouter = new Router()
var route = mainRouter.m.bind(mainRouter)

/**
 * Create a sub router
 * @returns {function} the method of a new Router object
 */
route.create = function() {
  var newSubRouter = new Router()
  // stop only this sub-router
  newSubRouter.m.stop = newSubRouter.s.bind(newSubRouter)
  // return sub-router's main method
  return newSubRouter.m.bind(newSubRouter)
}

/**
 * Set the base of url
 * @param {(str|RegExp)} arg - a new base or '#' or '#!'
 */
route.base = function(arg) {
  base = arg || '#'
  current = getPathFromBase() // recalculate current path
}

/** Exec routing right now **/
route.exec = function() {
  emit(true)
}

/**
 * Replace the default router to yours
 * @param {function} fn - your parser function
 * @param {function} fn2 - your secondParser function
 */
route.parser = function(fn, fn2) {
  if (!fn && !fn2) {
    // reset parser for testing...
    parser = DEFAULT_PARSER
    secondParser = DEFAULT_SECOND_PARSER
  }
  if (fn) parser = fn
  if (fn2) secondParser = fn2
}

/**
 * Helper function to get url query as an object
 * @returns {object} parsed query
 */
route.query = function() {
  var q = {}
  loc.href[REPLACE](/[?&](.+?)=([^&]*)/g, function(_, k, v) { q[k] = v })
  return q
}

/** Stop routing **/
route.stop = function () {
  if (started) {
    win[REMOVE_EVENT_LISTENER](POPSTATE, debouncedEmit)
    win[REMOVE_EVENT_LISTENER](HASHCHANGE, debouncedEmit)
    doc[REMOVE_EVENT_LISTENER](clickEvent, click)
    central[TRIGGER]('stop')
    started = false
  }
}

/**
 * Start routing
 * @param {boolean} autoExec - automatically exec after starting if true
 */
route.start = function (autoExec) {
  if (!started) {
    if (document.readyState == 'complete') start(autoExec)
    // the timeout is needed to solve
    // a weird safari bug https://github.com/riot/route/issues/33
    else win[ADD_EVENT_LISTENER]('load', function() {
      setTimeout(function() { start(autoExec) }, 1)
    })
    started = true
  }
}

/** Prepare the router **/
route.base()
route.parser()

riot.route = route
})(riot)
/* istanbul ignore next */

/**
 * The riot template engine
 * @version v2.3.19
 */

/**
 * @module brackets
 *
 * `brackets         ` Returns a string or regex based on its parameter
 * `brackets.settings` Mirrors the `riot.settings` object (use brackets.set in new code)
 * `brackets.set     ` Change the current riot brackets
 */

var brackets = (function (UNDEF) {

  var
    REGLOB  = 'g',

    MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,
    STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'/g,

    S_QBSRC = STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?(\/)[gim]*/.source,

    DEFAULT = '{ }',

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBSRC, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBSRC, REGLOB),
      '{': RegExp('([{}])|'   + S_QBSRC, REGLOB)
    }

  var
    cachedBrackets = UNDEF,
    _regex,
    _pairs = []

  function _loopback(re) { return re }

  function _rewrite(re, bp) {
    if (!bp) bp = _pairs
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create(pair) {
    var
      cvt,
      arr = pair.split(' ')

    if (pair === DEFAULT) {
      arr[2] = arr[0]
      arr[3] = arr[1]
      cvt = _loopback
    }
    else {
      if (arr.length !== 2 || /[\x00-\x1F<>a-zA-Z0-9'",;\\]/.test(pair)) {
        throw new Error('Unsupported brackets "' + pair + '"')
      }
      arr = arr.concat(pair.replace(/(?=[[\]()*+?.^$|])/g, '\\').split(' '))
      cvt = _rewrite
    }
    arr[4] = cvt(arr[1].length > 1 ? /{[\S\s]*?}/ : /{[^}]*}/, arr)
    arr[5] = cvt(/\\({|})/g, arr)
    arr[6] = cvt(/(\\?)({)/g, arr)
    arr[7] = RegExp('(\\\\?)(?:([[({])|(' + arr[3] + '))|' + S_QBSRC, REGLOB)
    arr[8] = pair
    return arr
  }

  function _reset(pair) {
    if (!pair) pair = DEFAULT

    if (pair !== _pairs[8]) {
      _pairs = _create(pair)
      _regex = pair === DEFAULT ? _loopback : _rewrite
      _pairs[9] = _regex(/^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/)
      _pairs[10] = _regex(/(^|[^\\]){=[\S\s]*?}/)
      _brackets._rawOffset = _pairs[0].length
    }
    cachedBrackets = pair
  }

  function _brackets(reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _pairs[reOrIdx]
  }

  _brackets.split = function split(str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) _bp = _pairs

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6]

    isexpr = start = re.lastIndex = 0

    while (match = re.exec(str)) {

      pos = match.index

      if (isexpr) {

        if (match[2]) {
          re.lastIndex = skipBraces(match[2], re.lastIndex)
          continue
        }

        if (!match[3])
          continue
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos))
        start = re.lastIndex
        re = _bp[6 + (isexpr ^= 1)]
        re.lastIndex = start
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start))
    }

    return parts

    function unescapeStr(str) {
      if (tmpl || isexpr)
        parts.push(str && str.replace(_bp[5], '$1'))
      else
        parts.push(str)
    }

    function skipBraces(ch, pos) {
      var
        match,
        recch = FINDBRACES[ch],
        level = 1
      recch.lastIndex = pos

      while (match = recch.exec(str)) {
        if (match[1] &&
          !(match[1] === ch ? ++level : --level)) break
      }
      return match ? recch.lastIndex : str.length
    }
  }

  _brackets.hasExpr = function hasExpr(str) {
    return _brackets(4).test(str)
  }

  _brackets.loopKeys = function loopKeys(expr) {
    var m = expr.match(_brackets(9))
    return m ?
      { key: m[1], pos: m[2], val: _pairs[0] + m[3].trim() + _pairs[1] } : { val: expr.trim() }
  }

  _brackets.array = function array(pair) {
    return _create(pair || cachedBrackets)
  }

  var _settings
  function _setSettings(o) {
    var b
    o = o || {}
    b = o.brackets
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    })
    _settings = o
    _reset(b)
  }
  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  })

  /* istanbul ignore next: in the node version riot is not in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {}
  _brackets.set = _reset

  _brackets.R_STRINGS = STRINGS
  _brackets.R_MLCOMMS = MLCOMMS
  _brackets.S_QBLOCKS = S_QBSRC

  return _brackets

})()

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

var tmpl = (function () {

  var _cache = {}

  function _tmpl(str, data) {
    if (!str) return str

    return (_cache[str] || (_cache[str] = _create(str))).call(data, _logErr)
  }

  _tmpl.isRaw = function (expr) {
    return expr[brackets._rawOffset] === "="
  }

  _tmpl.haveRaw = function (src) {
    return brackets(10).test(src)
  }

  _tmpl.hasExpr = brackets.hasExpr

  _tmpl.loopKeys = brackets.loopKeys

  _tmpl.errorHandler = null

  function _logErr(err, ctx) {

    if (_tmpl.errorHandler) {

      err.riotData = {
        tagName: ctx && ctx.root && ctx.root.tagName,
        _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
      }
      _tmpl.errorHandler(err)
    }
  }

  function _create(str) {

    var expr = _getTmpl(str)
    if (expr.slice(0, 11) !== 'try{return ') expr = 'return ' + expr

    return new Function('E', expr + ';')
  }

  var
    RE_QBLOCK = RegExp(brackets.S_QBLOCKS, 'g'),
    RE_QBMARK = /\x01(\d+)~/g

  function _getTmpl(str) {
    var
      qstr = [],
      expr,
      parts = brackets.split(str.replace(/\u2057/g, '"'), 1)

    if (parts.length > 2 || parts[0]) {
      var i, j, list = []

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i]

        if (expr && (expr = i & 1 ?

              _parseExpr(expr, 1, qstr) :

              '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) list[j++] = expr

      }

      expr = j < 2 ? list[0] :
             '[' + list.join(',') + '].join("")'
    }
    else {

      expr = _parseExpr(parts[1], 0, qstr)
    }

    if (qstr[0])
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      })

    return expr
  }

  var
    CS_IDENT = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\x01(\d+)~):/,
    RE_BRACE = /,|([[{(])|$/g

  function _parseExpr(expr, asText, qstr) {

    if (expr[0] === "=") expr = expr.slice(1)

    expr = expr
          .replace(RE_QBLOCK, function (s, div) {
            return s.length > 2 && !div ? '\x01' + (qstr.push(s) - 1) + '~' : s
          })
          .replace(/\s+/g, ' ').trim()
          .replace(/\ ?([[\({},?\.:])\ ?/g, '$1')

    if (expr) {
      var
        list = [],
        cnt = 0,
        match

      while (expr &&
            (match = expr.match(CS_IDENT)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g

        expr = RegExp.rightContext
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1]

        while (jsb = (match = re.exec(expr))[1]) skipBraces(jsb, re)

        jsb  = expr.slice(0, match.index)
        expr = RegExp.rightContext

        list[cnt++] = _wrapExpr(jsb, 1, key)
      }

      expr = !cnt ? _wrapExpr(expr, asText) :
          cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0]
    }
    return expr

    function skipBraces(jsb, re) {
      var
        match,
        lv = 1,
        ir = jsb === '(' ? /[()]/g : jsb === '[' ? /[[\]]/g : /[{}]/g

      ir.lastIndex = re.lastIndex
      while (match = ir.exec(expr)) {
        if (match[0] === jsb) ++lv
        else if (!--lv) break
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex
    }
  }

  // istanbul ignore next: not both
  var JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').'
  var JS_VARNAME = /[,{][$\w]+:|(^ *|[^$\w\.])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g

  function _wrapExpr(expr, asText, key) {
    var tb

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar
          if (pos) tb = (s = s[pos]) === '.' || s === '(' || s === '['
        }
        else if (pos)
          tb = !/^(?=(\.[$\w]+))\1(?:[^.[(]|$)/.test(s.slice(pos))
      }
      return match
    })

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}'
    }

    if (key) {

      expr = (tb ?
          'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""'
    }
    else if (asText) {

      expr = 'function(v){' + (tb ?
          expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)'
    }

    return expr
  }

  // istanbul ignore next: compatibility fix for beta versions
  _tmpl.parse = function (s) { return s }

  return _tmpl

})()

  tmpl.version = brackets.version = 'v2.3.19'


/*
  lib/browser/tag/mkdom.js

  Includes hacks needed for the Internet Explorer version 9 and bellow

*/
// http://kangax.github.io/compat-table/es5/#ie8
// http://codeplanet.io/dropping-ie8/

var mkdom = (function (checkIE) {

  var rootEls = {
      'tr': 'tbody',
      'th': 'tr',
      'td': 'tr',
      'tbody': 'table',
      'col': 'colgroup'
    },
    GENERIC = 'div'

  checkIE = checkIE && checkIE < 10

  // creates any dom element in a div, table, or colgroup container
  function _mkdom(html) {

    var match = html && html.match(/^\s*<([-\w]+)/),
      tagName = match && match[1].toLowerCase(),
      rootTag = rootEls[tagName] || GENERIC,
      el = mkEl(rootTag)

    el.stub = true

    /* istanbul ignore next */
    if (checkIE && tagName && (match = tagName.match(SPECIAL_TAGS_REGEX)))
      ie9elem(el, html, tagName, !!match[1])
    else
      el.innerHTML = html

    return el
  }

  // creates tr, th, td, option, optgroup element for IE8-9
  /* istanbul ignore next */
  function ie9elem(el, html, tagName, select) {

    var div = mkEl(GENERIC),
      tag = select ? 'select>' : 'table>',
      child

    div.innerHTML = '<' + tag + html + '</' + tag

    child = $(tagName, div)
    if (child)
      el.appendChild(child)

  }
  // end ie9elem()

  return _mkdom

})(IE_VERSION)

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
  var item = {}
  item[expr.key] = key
  if (expr.pos) item[expr.pos] = val
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {

  var i = tags.length,
    j = items.length

  while (i > j) {
    var t = tags[--i]
    tags.splice(i, 1)
    t.unmount()
  }
}

/**
 * Move the nested custom tags in non custom loop tags
 * @param   { Object } child - non custom loop tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(child, i) {
  Object.keys(child.tags).forEach(function(tagName) {
    var tag = child.tags[tagName]
    if (isArray(tag))
      each(tag, function (t) {
        moveChildTag(t, tagName, i)
      })
    else
      moveChildTag(tag, tagName, i)
  })
}

/**
 * Adds the elements for a virtual tag
 * @param { Tag } tag - the tag whose root's children will be inserted or appended
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function addVirtual(tag, src, target) {
  var el = tag._root
  tag._virts = []
  while (el) {
    var sib = el.nextSibling
    if (target)
      src.insertBefore(el, target._root)
    else
      src.appendChild(el)

    tag._virts.push(el) // hold for unmounting
    el = sib
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
  var el = tag._root
  for (var i = 0; i < len; i++) {
    var sib = el.nextSibling
    src.insertBefore(el, target._root)
    el = sib
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
  remAttr(dom, 'each')

  var mustReorder = typeof getAttr(dom, 'no-reorder') !== T_STRING || remAttr(dom, 'no-reorder'),
    tagName = getTagName(dom),
    impl = __tagImpl[tagName] || { tmpl: dom.outerHTML },
    useRoot = SPECIAL_TAGS_REGEX.test(tagName),
    root = dom.parentNode,
    ref = document.createTextNode(''),
    child = getTag(dom),
    isOption = /option/gi.test(tagName), // the option tags must be treated differently
    tags = [],
    oldItems = [],
    hasKeys,
    isVirtual = dom.tagName == 'VIRTUAL'

  // parse the each expression
  expr = tmpl.loopKeys(expr)

  // insert a marked where the loop tags will be injected
  root.insertBefore(ref, dom)

  // clean template code
  parent.one('before-mount', function () {

    // remove the original DOM node
    dom.parentNode.removeChild(dom)
    if (root.stub) root = parent.root

  }).on('update', function () {
    // get the new items collection
    var items = tmpl(expr.val, parent),
      // create a fragment to hold the new DOM nodes to inject in the parent tag
      frag = document.createDocumentFragment()



    // object loop. any changes cause full redraw
    if (!isArray(items)) {
      hasKeys = items || false
      items = hasKeys ?
        Object.keys(items).map(function (key) {
          return mkitem(expr, key, items[key])
        }) : []
    }

    // loop all the new items
    items.forEach(function(item, i) {
      // reorder only if the items are objects
      var _mustReorder = mustReorder && item instanceof Object,
        oldPos = oldItems.indexOf(item),
        pos = ~oldPos && _mustReorder ? oldPos : i,
        // does a tag exist in this position?
        tag = tags[pos]

      item = !hasKeys && expr.key ? mkitem(expr, item, i) : item

      // new tag
      if (
        !_mustReorder && !tag // with no-reorder we just update the old tags
        ||
        _mustReorder && !~oldPos || !tag // by default we always try to reorder the DOM elements
      ) {

        tag = new Tag(impl, {
          parent: parent,
          isLoop: true,
          hasImpl: !!__tagImpl[tagName],
          root: useRoot ? root : dom.cloneNode(),
          item: item
        }, dom.innerHTML)

        tag.mount()
        if (isVirtual) tag._root = tag.root.firstChild // save reference for further moves or inserts
        // this tag must be appended
        if (i == tags.length) {
          if (isVirtual)
            addVirtual(tag, frag)
          else frag.appendChild(tag.root)
        }
        // this tag must be insert
        else {
          if (isVirtual)
            addVirtual(tag, root, tags[i])
          else root.insertBefore(tag.root, tags[i].root)
          oldItems.splice(i, 0, item)
        }

        tags.splice(i, 0, tag)
        pos = i // handled here so no move
      } else tag.update(item)

      // reorder the tag if it's not located in its previous position
      if (pos !== i && _mustReorder) {
        // update the DOM
        if (isVirtual)
          moveVirtual(tag, root, tags[i], dom.childNodes.length)
        else root.insertBefore(tag.root, tags[i].root)
        // update the position attribute if it exists
        if (expr.pos)
          tag[expr.pos] = i
        // move the old tag instance
        tags.splice(i, 0, tags.splice(pos, 1)[0])
        // move the old item
        oldItems.splice(i, 0, oldItems.splice(pos, 1)[0])
        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child) moveNestedTags(tag, i)
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag._item = item
      // cache the real parent tag internally
      defineProperty(tag, '_parent', parent)

    }, true) // allow null values

    // remove the redundant tags
    unmountRedundant(items, tags)

    // insert the new nodes
    if (isOption) root.appendChild(frag)
    else root.insertBefore(frag, ref)

    // set the 'tags' property of the parent tag
    // if child is 'undefined' it means that we don't need to set this property
    // for example:
    // we don't need store the `myTag.tags['div']` property if we are looping a div tag
    // but we need to track the `myTag.tags['child']` property looping a custom child node named `child`
    if (child) parent.tags[tagName] = tags

    // clone the items array
    oldItems = items.slice()

  })

}


function parseNamedElements(root, tag, childTags, forceParsingNamed) {

  walk(root, function(dom) {
    if (dom.nodeType == 1) {
      dom.isLoop = dom.isLoop || (dom.parentNode && dom.parentNode.isLoop || getAttr(dom, 'each')) ? 1 : 0

      // custom child tag
      if (childTags) {
        var child = getTag(dom)

        if (child && !dom.isLoop)
          childTags.push(initChildTag(child, {root: dom, parent: tag}, dom.innerHTML, tag))
      }

      if (!dom.isLoop || forceParsingNamed)
        setNamed(dom, tag, [])
    }

  })

}

function parseExpressions(root, tag, expressions) {

  function addExpr(dom, val, extra) {
    if (tmpl.hasExpr(val)) {
      var expr = { dom: dom, expr: val }
      expressions.push(extend(expr, extra))
    }
  }

  walk(root, function(dom) {
    var type = dom.nodeType

    // text node
    if (type == 3 && dom.parentNode.tagName != 'STYLE') addExpr(dom, dom.nodeValue)
    if (type != 1) return

    /* element */

    // loop
    var attr = getAttr(dom, 'each')

    if (attr) { _each(dom, tag, attr); return false }

    // attribute expressions
    each(dom.attributes, function(attr) {
      var name = attr.name,
        bool = name.split('__')[1]

      addExpr(dom, attr.value, { attr: bool || name, bool: bool })
      if (bool) { remAttr(dom, name); return false }

    })

    // skip custom tags
    if (getTag(dom)) return false

  })

}
function Tag(impl, conf, innerHTML) {

  var self = riot.observable(this),
    opts = inherit(conf.opts) || {},
    dom = mkdom(impl.tmpl),
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
    propsInSyncWithParent = []

  if (fn && root._tag) root._tag.unmount(true)

  // not yet mounted
  this.isMounted = false
  root.isLoop = isLoop

  // keep a reference to the tag just created
  // so we will be able to mount this tag multiple times
  root._tag = this

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(this, '_riot_id', ++__uid) // base 1 allows test !t._riot_id

  extend(this, { parent: parent, root: root, opts: opts, tags: {} }, item)

  // grab attributes
  each(root.attributes, function(el) {
    var val = el.value
    // remember attributes with expressions only
    if (tmpl.hasExpr(val)) attr[el.name] = val
  })

  if (dom.innerHTML && !/^(select|optgroup|table|tbody|tr|col(?:group)?)$/.test(tagName))
    // replace all the yield tags with the tag inner html
    dom.innerHTML = replaceYield(dom.innerHTML, innerHTML)

  // options
  function updateOpts() {
    var ctx = hasImpl && isLoop ? self : parent || self

    // update opts from current DOM attributes
    each(root.attributes, function(el) {
      opts[toCamel(el.name)] = tmpl(el.value, ctx)
    })
    // recover those with expressions
    each(Object.keys(attr), function(name) {
      opts[toCamel(name)] = tmpl(attr[name], ctx)
    })
  }

  function normalizeData(data) {
    for (var key in item) {
      if (typeof self[key] !== T_UNDEF && isWritable(self, key))
        self[key] = data[key]
    }
  }

  function inheritFromParent () {
    if (!self.parent || !isLoop) return
    each(Object.keys(self.parent), function(k) {
      // some properties must be always in sync with the parent tag
      var mustSync = !contains(RESERVED_WORDS_BLACKLIST, k) && contains(propsInSyncWithParent, k)
      if (typeof self[k] === T_UNDEF || mustSync) {
        // track the property to keep in sync
        // so we can keep it updated
        if (!mustSync) propsInSyncWithParent.push(k)
        self[k] = self.parent[k]
      }
    })
  }

  defineProperty(this, 'update', function(data) {

    // make sure the data passed will not override
    // the component core methods
    data = cleanUpData(data)
    // inherit properties from the parent
    inheritFromParent()
    // normalize the tag properties in case an item object was initially passed
    if (data && typeof item === T_OBJECT) {
      normalizeData(data)
      item = data
    }
    extend(self, data)
    updateOpts()
    self.trigger('update', data)
    update(expressions, self)
    // the updated event will be triggered
    // once the DOM will be ready and all the reflow are completed
    // this is useful if you want to get the "real" root properties
    // 4 ex: root.offsetWidth ...
    rAF(function() { self.trigger('updated') })
    return this
  })

  defineProperty(this, 'mixin', function() {
    each(arguments, function(mix) {
      var instance

      mix = typeof mix === T_STRING ? riot.mixin(mix) : mix

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix()
        // save the prototype to loop it afterwards
        mix = mix.prototype
      } else instance = mix

      // loop the keys in the function prototype or the all object keys
      each(Object.getOwnPropertyNames(mix), function(key) {
        // bind methods to self
        if (key != 'init')
          self[key] = isFunction(instance[key]) ?
                        instance[key].bind(self) :
                        instance[key]
      })

      // init method will be called automatically
      if (instance.init) instance.init.bind(self)()
    })
    return this
  })

  defineProperty(this, 'mount', function() {

    updateOpts()

    // initialiation
    if (fn) fn.call(self, opts)

    // parse layout after init. fn may calculate args for nested custom tags
    parseExpressions(dom, self, expressions)

    // mount the child tags
    toggle(true)

    // update the root adding custom attributes coming from the compiler
    // it fixes also #1087
    if (impl.attrs || hasImpl) {
      walkAttributes(impl.attrs, function (k, v) { setAttr(root, k, v) })
      parseExpressions(self.root, self, expressions)
    }

    if (!self.parent || isLoop) self.update(item)

    // internal use only, fixes #403
    self.trigger('before-mount')

    if (isLoop && !hasImpl) {
      // update the root attribute for the looped elements
      self.root = root = dom.firstChild

    } else {
      while (dom.firstChild) root.appendChild(dom.firstChild)
      if (root.stub) self.root = root = parent.root
    }

    // parse the named dom nodes in the looped child
    // adding them to the parent as well
    if (isLoop)
      parseNamedElements(self.root, self.parent, null, true)

    // if it's not a child tag we can trigger its mount event
    if (!self.parent || self.parent.isMounted) {
      self.isMounted = true
      self.trigger('mount')
    }
    // otherwise we need to wait that the parent event gets triggered
    else self.parent.one('mount', function() {
      // avoid to trigger the `mount` event for the tags
      // not visible included in an if statement
      if (!isInStub(self.root)) {
        self.parent.isMounted = self.isMounted = true
        self.trigger('mount')
      }
    })
  })


  defineProperty(this, 'unmount', function(keepRootTag) {
    var el = root,
      p = el.parentNode,
      ptag

    self.trigger('before-unmount')

    // remove this tag instance from the global virtualDom variable
    __virtualDom.splice(__virtualDom.indexOf(self), 1)

    if (this._virts) {
      each(this._virts, function(v) {
        v.parentNode.removeChild(v)
      })
    }

    if (p) {

      if (parent) {
        ptag = getImmediateCustomParentTag(parent)
        // remove this tag from the parent tags object
        // if there are multiple nested tags with same name..
        // remove this element form the array
        if (isArray(ptag.tags[tagName]))
          each(ptag.tags[tagName], function(tag, i) {
            if (tag._riot_id == self._riot_id)
              ptag.tags[tagName].splice(i, 1)
          })
        else
          // otherwise just delete the tag instance
          ptag.tags[tagName] = undefined
      }

      else
        while (el.firstChild) el.removeChild(el.firstChild)

      if (!keepRootTag)
        p.removeChild(el)
      else
        // the riot-tag attribute isn't needed anymore, remove it
        remAttr(p, 'riot-tag')
    }


    self.trigger('unmount')
    toggle()
    self.off('*')
    self.isMounted = false
    // somehow ie8 does not like `delete root._tag`
    root._tag = null

  })

  function toggle(isMount) {

    // mount/unmount children
    each(childTags, function(child) { child[isMount ? 'mount' : 'unmount']() })

    // listen/unlisten parent (events flow one way from parent to children)
    if (parent) {
      var evt = isMount ? 'on' : 'off'

      // the loop tags will be always in sync with the parent automatically
      if (isLoop)
        parent[evt]('unmount', self.unmount)
      else
        parent[evt]('update', self.update)[evt]('unmount', self.unmount)
    }
  }

  // named elements available for fn
  parseNamedElements(dom, this, childTags)

}
/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {

  dom[name] = function(e) {

    var ptag = tag._parent,
      item = tag._item,
      el

    if (!item)
      while (ptag && !item) {
        item = ptag._item
        ptag = ptag._parent
      }

    // cross browser event fix
    e = e || window.event

    // override the event properties
    if (isWritable(e, 'currentTarget')) e.currentTarget = dom
    if (isWritable(e, 'target')) e.target = e.srcElement
    if (isWritable(e, 'which')) e.which = e.charCode || e.keyCode

    e.item = item

    // prevent default behaviour (by default)
    if (handler.call(tag, e) !== true && !/radio|check/.test(dom.type)) {
      if (e.preventDefault) e.preventDefault()
      e.returnValue = false
    }

    if (!e.preventUpdate) {
      el = item ? getImmediateCustomParentTag(ptag) : tag
      el.update()
    }

  }

}


/**
 * Insert a DOM node replacing another one (used by if- attribute)
 * @param   { Object } root - parent node
 * @param   { Object } node - node replaced
 * @param   { Object } before - node added
 */
function insertTo(root, node, before) {
  if (root) {
    root.insertBefore(before, node)
    root.removeChild(node)
  }
}

/**
 * Update the expressions in a Tag instance
 * @param   { Array } expressions - expression that must be re evaluated
 * @param   { Tag } tag - tag instance
 */
function update(expressions, tag) {

  each(expressions, function(expr, i) {

    var dom = expr.dom,
      attrName = expr.attr,
      value = tmpl(expr.expr, tag),
      parent = expr.dom.parentNode

    if (expr.bool)
      value = value ? attrName : false
    else if (value == null)
      value = ''

    // leave out riot- prefixes from strings inside textarea
    // fix #815: any value -> string
    if (parent && parent.tagName == 'TEXTAREA') {
      value = ('' + value).replace(/riot-/g, '')
      // change textarea's value
      parent.value = value
    }

    // no change
    if (expr.value === value) return
    expr.value = value

    // text node
    if (!attrName) {
      dom.nodeValue = '' + value    // #815 related
      return
    }

    // remove original attribute
    remAttr(dom, attrName)
    // event handler
    if (isFunction(value)) {
      setEventHandler(attrName, value, dom, tag)

    // if- conditional
    } else if (attrName == 'if') {
      var stub = expr.stub,
        add = function() { insertTo(stub.parentNode, stub, dom) },
        remove = function() { insertTo(dom.parentNode, dom, stub) }

      // add to DOM
      if (value) {
        if (stub) {
          add()
          dom.inStub = false
          // avoid to trigger the mount event if the tags is not visible yet
          // maybe we can optimize this avoiding to mount the tag at all
          if (!isInStub(dom)) {
            walk(dom, function(el) {
              if (el._tag && !el._tag.isMounted) el._tag.isMounted = !!el._tag.trigger('mount')
            })
          }
        }
      // remove from DOM
      } else {
        stub = expr.stub = stub || document.createTextNode('')
        // if the parentNode is defined we can easily replace the tag
        if (dom.parentNode)
          remove()
        // otherwise we need to wait the updated event
        else (tag.parent || tag).one('updated', remove)

        dom.inStub = true
      }
    // show / hide
    } else if (/^(show|hide)$/.test(attrName)) {
      if (attrName == 'hide') value = !value
      dom.style.display = value ? '' : 'none'

    // field value
    } else if (attrName == 'value') {
      dom.value = value

    // <img src="{ expr }">
    } else if (startsWith(attrName, RIOT_PREFIX) && attrName != RIOT_TAG) {
      if (value)
        setAttr(dom, attrName.slice(RIOT_PREFIX.length), value)

    } else {
      if (expr.bool) {
        dom[attrName] = value
        if (!value) return
      }

      if (value && value != 0 && typeof value !== T_OBJECT)
        setAttr(dom, attrName, value)

    }

  })

}
/**
 * Loops an array
 * @param   { Array } els - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(els, fn) {
  for (var i = 0, len = (els || []).length, el; i < len; i++) {
    el = els[i]
    // return false -> remove current item during loop
    if (el != null && fn(el, i) === false) i--
  }
  return els
}

/**
 * Detect if the argument passed is a function
 * @param   { * } v - whatever you want to pass to this function
 * @returns { Boolean } -
 */
function isFunction(v) {
  return typeof v === T_FUNCTION || false   // avoid IE problems
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name)
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } string - input string
 * @returns { String } my-string -> myString
 */
function toCamel(string) {
  return string.replace(/-(\w)/g, function(_, c) {
    return c.toUpperCase()
  })
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  dom.setAttribute(name, val)
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __tagImpl[getAttr(dom, RIOT_TAG) || dom.tagName.toLowerCase()]
}
/**
 * Add a child tag to its parent into the `tags` object
 * @param   { Object } tag - child tag instance
 * @param   { String } tagName - key where the new tag will be stored
 * @param   { Object } parent - tag instance where the new child tag will be included
 */
function addChildTag(tag, tagName, parent) {
  var cachedTag = parent.tags[tagName]

  // if there are multiple children tags having the same name
  if (cachedTag) {
    // if the parent tags property is not yet an array
    // create it adding the first cached tag
    if (!isArray(cachedTag))
      // don't add the same tag twice
      if (cachedTag !== tag)
        parent.tags[tagName] = [cachedTag]
    // add the new nested tag to the array
    if (!contains(parent.tags[tagName], tag))
      parent.tags[tagName].push(tag)
  } else {
    parent.tags[tagName] = tag
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
    tags
  // no parent no move
  if (!parent) return

  tags = parent.tags[tagName]

  if (isArray(tags))
    tags.splice(newPos, 0, tags.splice(tags.indexOf(tag), 1)[0])
  else addChildTag(tag, tagName, parent)
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
    ptag = getImmediateCustomParentTag(parent)
  // fix for the parent attribute in the looped elements
  tag.parent = ptag
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag._parent = parent

  // add this tag to the custom parent tag
  addChildTag(tag, tagName, ptag)
  // and also to the real parent tag
  if (ptag !== parent)
    addChildTag(tag, tagName, parent)
  // empty the child node once we got its template
  // to avoid that its children get compiled multiple times
  opts.root.innerHTML = ''

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag
  while (!getTag(ptag.root)) {
    if (!ptag.parent) break
    ptag = ptag.parent
  }
  return ptag
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
  }, options))
  return el
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom) {
  var child = getTag(dom),
    namedTag = getAttr(dom, 'name'),
    tagName = namedTag && !tmpl.hasExpr(namedTag) ?
                namedTag :
              child ? child.name : dom.tagName.toLowerCase()

  return tagName
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
  var obj, args = arguments
  for (var i = 1; i < args.length; ++i) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          src[key] = obj[key]
      }
    }
  }
  return src
}

/**
 * Check whether an array contains an item
 * @param   { Array } arr - target array
 * @param   { * } item - item to test
 * @returns { Boolean } Does 'arr' contain 'item'?
 */
function contains(arr, item) {
  return ~arr.indexOf(item)
}

/**
 * Check whether an object is a kind of array
 * @param   { * } a - anything
 * @returns {Boolean} is 'a' an array?
 */
function isArray(a) { return Array.isArray(a) || a instanceof Array }

/**
 * Detect whether a property of an object could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } is this property writable?
 */
function isWritable(obj, key) {
  var props = Object.getOwnPropertyDescriptor(obj, key)
  return typeof obj[key] === T_UNDEF || props && props.writable
}


/**
 * With this function we avoid that the internal Tag methods get overridden
 * @param   { Object } data - options we want to use to extend the tag instance
 * @returns { Object } clean object without containing the riot internal reserved words
 */
function cleanUpData(data) {
  if (!(data instanceof Tag) && !(data && typeof data.trigger == T_FUNCTION)) return data

  var o = {}
  for (var key in data) {
    if (!contains(RESERVED_WORDS_BLACKLIST, key))
      o[key] = data[key]
  }
  return o
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 */
function walk(dom, fn) {
  if (dom) {
    // stop the recursion
    if (fn(dom) === false) return
    else {
      dom = dom.firstChild

      while (dom) {
        walk(dom, fn)
        dom = dom.nextSibling
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
    re = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g

  while (m = re.exec(html)) {
    fn(m[1].toLowerCase(), m[2] || m[3] || m[4])
  }
}

/**
 * Check whether a DOM node is in stub mode, useful for the riot 'if' directive
 * @param   { Object }  dom - DOM node we want to parse
 * @returns { Boolean } -
 */
function isInStub(dom) {
  while (dom) {
    if (dom.inStub) return true
    dom = dom.parentNode
  }
  return false
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @returns { Object } DOM node just created
 */
function mkEl(name) {
  return document.createElement(name)
}

/**
 * Create a generic DOM node, and fill it with innerHTML
 * @param   { String } name - name of the DOM node we want to create
 * @param   { String } innerHTML - innerHTML of the new DOM
 * @returns { Object } DOM node just created
 */
function mkElWithInnerHTML(name, innerHTML) {
  var el = mkEl(name)
  el.innerHTML = innerHTML || ''
  return el
}

/**
 * Replace the yield tag from any tag template with the innerHTML of the
 * original tag in the page
 * @param   { String } tmpl - tag implementation template
 * @param   { String } innerHTML - original content of the tag in the DOM
 * @returns { String } tag template updated without the yield tag
 */
function replaceYield(tmpl, innerHTML) {
  var tmplElement = mkElWithInnerHTML('div', tmpl)
  // if ($('yield[from]'.tmplElement)) { // this issues test errors
  if (tmplElement.querySelector && tmplElement.querySelector('yield[from]')) { // code coverage path not taken (?)
    // yield to(s) must be direct children from innerHTML(root), all other tags are ignored
    each(mkElWithInnerHTML('div', innerHTML).childNodes, function(toYield) {
      if (toYield.nodeType == 1 && toYield.tagName == 'YIELD' && toYield.getAttribute('to')) {
        // replace all yield[from]
        each($$('yield[from="'+toYield.getAttribute('to')+'"]', tmplElement), function(fromYield) {
          fromYield.outerHTML = toYield.innerHTML
        })
      }
    })
    return tmplElement.innerHTML
  } else
    // just replace yield in tmpl with the innerHTML
    return tmpl.replace(/<yield\s*(?:\/>|>\s*<\/yield\s*>)/gi, innerHTML || '')
}

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return (ctx || document).querySelectorAll(selector)
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Simple object prototypal inheritance
 * @param   { Object } parent - parent object
 * @returns { Object } child instance
 */
function inherit(parent) {
  function Child() {}
  Child.prototype = parent
  return new Child()
}

/**
 * Get the name property needed to identify a DOM node in riot
 * @param   { Object } dom - DOM node we need to parse
 * @returns { String | undefined } give us back a string to identify this dom node
 */
function getNamedKey(dom) {
  return getAttr(dom, 'id') || getAttr(dom, 'name')
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
    // add the node detected to a tag instance using the named property
    add = function(value) {
      // avoid to override the tag properties already set
      if (contains(keys, key)) return
      // check whether this value is an array
      var isArr = isArray(value)
      // if the key was never set
      if (!value)
        // set it once on the tag instance
        parent[key] = dom
      // if it was an array and not yet set
      else if (!isArr || isArr && !contains(value, dom)) {
        // add the dom node into the array
        if (isArr)
          value.push(dom)
        else
          parent[key] = [value, dom]
      }
    }

  // skip the elements with no named properties
  if (!key) return

  // check whether this key has been already evaluated
  if (tmpl.hasExpr(key))
    // wait the first updated event only once
    parent.one('updated', function() {
      key = getNamedKey(dom)
      add(parent[key])
    })
  else
    add(parent[key])

}

/**
 * Faster String startsWith alternative
 * @param   { String } src - source string
 * @param   { String } str - test string
 * @returns { Boolean } -
 */
function startsWith(src, str) {
  return src.slice(0, str.length) === str
}

/**
 * Function needed to inject in runtime the custom tags css
 */
var injectStyle = (function() {

  if (!window) return // skip injection on the server

  // create the style node
  var styleNode = mkEl('style'),
    placeholder = $('style[type=riot]')

  setAttr(styleNode, 'type', 'text/css')

  // inject the new node into the DOM -- in head
  if (placeholder) {
    placeholder.parentNode.replaceChild(styleNode, placeholder)
    placeholder = null
  }
  else document.getElementsByTagName('head')[0].appendChild(styleNode)

  /**
   * This is the function exported that will be used to update the style tag just created
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   * @param   { String } css [description]
   */
  return styleNode.styleSheet ?
    function (css) { styleNode.styleSheet.cssText += css } :
    function (css) { styleNode.innerHTML += css }

})()

/**
 * requestAnimationFrame polyfill
 */
var rAF = (function(w) {
  return  w.requestAnimationFrame       ||
          w.webkitRequestAnimationFrame ||
          w.mozRequestAnimationFrame    ||
          function(cb) { setTimeout(cb, 1000 / 60) }
})(window || {})

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
    innerHTML = root._innerHTML = root._innerHTML || root.innerHTML

  // clear the inner html
  root.innerHTML = ''

  if (tag && root) tag = new Tag(tag, { root: root, opts: opts }, innerHTML)

  if (tag && tag.mount) {
    tag.mount()
    // add this tag to the virtualDom variable
    if (!contains(__virtualDom, tag)) __virtualDom.push(tag)
  }

  return tag
}
/**
 * Riot public api
 */

// share methods for other riot parts, e.g. compiler
riot.util = { brackets: brackets, tmpl: tmpl }

/**
 * Create a mixin that could be globally shared across all the tags
 */
riot.mixin = (function() {
  var mixins = {}

  /**
   * Create/Return a mixin by its name
   * @param   { String } name - mixin name
   * @param   { Object } mixin - mixin logic
   * @returns { Object } the mixin logic
   */
  return function(name, mixin) {
    if (!mixin) return mixins[name]
    mixins[name] = mixin
  }

})()

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   html - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
riot.tag = function(name, html, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs
    if (/^[\w\-]+\s?=/.test(css)) {
      attrs = css
      css = ''
    } else attrs = ''
  }
  if (css) {
    if (isFunction(css)) fn = css
    else if (injectStyle) injectStyle(css)
  }
  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

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
riot.tag2 = function(name, html, css, attrs, fn, bpair) {
  if (css && injectStyle) injectStyle(css)
  //if (bpair) riot.settings.brackets = bpair
  __tagImpl[name] = { name: name, tmpl: html, attrs: attrs, fn: fn }
  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { String } selector - tag DOM selector
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
riot.mount = function(selector, tagName, opts) {

  var els,
    allTags,
    tags = []

  // helper functions

  function addRiotTags(arr) {
    var list = ''
    each(arr, function (e) {
      list += ', *[' + RIOT_TAG + '="' + e.trim() + '"]'
    })
    return list
  }

  function selectAllTags() {
    var keys = Object.keys(__tagImpl)
    return keys + addRiotTags(keys)
  }

  function pushTags(root) {
    var last

    if (root.tagName) {
      if (tagName && (!(last = getAttr(root, RIOT_TAG)) || last != tagName))
        setAttr(root, RIOT_TAG, tagName)

      var tag = mountTo(root, tagName || root.getAttribute(RIOT_TAG) || root.tagName.toLowerCase(), opts)

      if (tag) tags.push(tag)
    } else if (root.length)
      each(root, pushTags)   // assume nodeList

  }

  // ----- mount code -----

  if (typeof tagName === T_OBJECT) {
    opts = tagName
    tagName = 0
  }

  // crawl the DOM to find the tag
  if (typeof selector === T_STRING) {
    if (selector === '*')
      // select all the tags registered
      // and also the tags found with the riot-tag attribute set
      selector = allTags = selectAllTags()
    else
      // or just the ones named like the selector
      selector += addRiotTags(selector.split(','))

    // make sure to pass always a selector
    // to the querySelectorAll function
    els = selector ? $$(selector) : []
  }
  else
    // probably you have passed already a tag or a NodeList
    els = selector

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectAllTags()
    // if the root els it's just a single tag
    if (els.tagName)
      els = $$(tagName, els)
    else {
      // select all the children for all the different root elements
      var nodeList = []
      each(els, function (_el) {
        nodeList.push($$(tagName, _el))
      })
      els = nodeList
    }
    // get rid of the tagName
    tagName = 0
  }

  if (els.tagName)
    pushTags(els)
  else
    each(els, pushTags)

  return tags
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
riot.update = function() {
  return each(__virtualDom, function(tag) {
    tag.update()
  })
}

/**
 * Export the Tag constructor
 */
riot.Tag = Tag
  // support CommonJS, AMD & browser
  /* istanbul ignore next */
  if (typeof exports === T_OBJECT)
    module.exports = riot
  else if (typeof define === T_FUNCTION && typeof define.amd !== T_UNDEF)
    define(function() { return (window.riot = riot) })
  else
    window.riot = riot

})(typeof window != 'undefined' ? window : void 0);

},{}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJlczZcXENoYW1iclxcQ2xpZW50LmVzNiIsImVzNlxcR2F0ZXdheVxcQ2xpZW50LmVzNiIsImVzNlxcU2l0ZS5lczYiLCJlczZcXFRhZ3MuZXM2Iiwibm9kZV9tb2R1bGVzL3Jpb3QvcmlvdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7SUNBcUIsTUFBTTtBQUN2QixhQURpQixNQUFNLEdBQ1Y7OEJBREksTUFBTTs7QUFFbkIsZUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtLQUNqQjs7aUJBSGdCLE1BQU07OzZCQUtuQixFQUFFOzs7V0FMVyxNQUFNOzs7a0JBQU4sTUFBTTs7Ozs7Ozs7Ozs7OztJQ0FOLE1BQU07QUFPdkIsYUFQaUIsTUFBTSxDQU9YLE1BQU0sRUFBQzs4QkFQRixNQUFNOzthQUV2QixNQUFNLEdBQUcsU0FBUzthQUNsQixNQUFNLEdBQUcsRUFBRTthQUVYLE9BQU8sR0FBRyxTQUFTOztBQUdmLGdCQUFRLEdBQUcsSUFBSSxDQUFBO0FBQ2YsWUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUE7QUFDckIsWUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQTtLQUNyQjs7aUJBWGdCLE1BQU07OzJCQWlCcEIsSUFBSSxFQUFFLFFBQVEsRUFBQztBQUNkLGdCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0FBQzNDLGdCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUNoQyxtQkFBTyxJQUFJLENBQUE7U0FDZDs7O2dDQUVNO0FBQ0gsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO0FBQ3RDLGdCQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7U0FDZDs7O2dDQUVPLElBQUksRUFBRSxJQUFJLEVBQUM7OztBQUNmLGdCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsRUFBRSxFQUFLO0FBQ25ELGtCQUFFLENBQUMsSUFBSSxRQUFPLElBQUksQ0FBQyxDQUFBO2FBQ3RCLENBQUMsQ0FBQTtBQUNGLG1CQUFPLElBQUksQ0FBQTtTQUNkOzs7Ozs7K0JBR0s7OztBQUNGLGdCQUFJLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxVQUFDLEVBQUU7dUJBQUssT0FBSyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFBQSxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQ2xHOzs7c0NBekJtQjtBQUNoQixtQkFBTyxRQUFRLENBQUE7U0FDbEI7OztXQWZnQixNQUFNOzs7a0JBQU4sTUFBTTs7QUF5QzNCLElBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNyQ3hCLHFCQUFZLGdCQUFnQixDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxZQUFNO0FBQzVDLG1CQUFLLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQTtDQUN2QixDQUFDLENBQUE7Ozs7Ozs7Ozs7Ozs7OztBQ0hGLGVBQUssR0FBRyxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFBOztBQUVyQyxlQUFLLEdBQUcsQ0FBQyxPQUFPLHdEQUliLFlBQVU7QUFDVCxRQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLHFCQUFXLE9BQU8sQ0FBQyxDQUFBO0FBQzVDLFNBQUssQ0FBQyxFQUFFLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7Q0FDcEQsQ0FBQyxDQUFBOzs7QUNaRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENsaWVudCB7XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKDEpXHJcbiAgICB9XHJcblxyXG4gICAgb24oKXt9XHJcbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xyXG5cclxuICAgIFdvcmtlciA9IHVuZGVmaW5lZDtcclxuICAgIEV2ZW50cyA9IHt9O1xyXG5cclxuICAgIF93b3JrZXIgPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgY29uc3RydWN0b3Iod29ya2VyKXtcclxuICAgICAgICBJbnN0YW5jZSA9IHRoaXNcclxuICAgICAgICB0aGlzLl93b3JrZXIgPSB3b3JrZXJcclxuICAgICAgICB0aGlzLnN0YXJ0KHdvcmtlcilcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0SW5zdGFuY2UoKXtcclxuICAgICAgICByZXR1cm4gSW5zdGFuY2VcclxuICAgIH1cclxuXHJcbiAgICBvbihuYW1lLCBjYWxsYmFjayl7XHJcbiAgICAgICAgdGhpcy5FdmVudHNbbmFtZV0gPSB0aGlzLkV2ZW50c1tuYW1lXSB8fCBbXVxyXG4gICAgICAgIHRoaXMuRXZlbnRzW25hbWVdLnB1c2goY2FsbGJhY2spXHJcbiAgICAgICAgcmV0dXJuIHRoaXNcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpe1xyXG4gICAgICAgIHRoaXMuV29ya2VyID0gbmV3IFdvcmtlcih0aGlzLl93b3JrZXIpXHJcbiAgICAgICAgdGhpcy5iaW5kKClcclxuICAgIH1cclxuXHJcbiAgICB3aGlzcGVyKG5hbWUsIGRhdGEpe1xyXG4gICAgICAgIHRoaXMuRXZlbnRzW25hbWVdICYmIHRoaXMuRXZlbnRzW25hbWVdLmZvckVhY2goKGZuKSA9PiB7XHJcbiAgICAgICAgICAgIGZuLmNhbGwodGhpcywgZGF0YSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiB0aGlzXHJcbiAgICB9XHJcblxyXG4gICAgLy8gTWVzc2FnZUV2ZW50XHJcbiAgICBiaW5kKCl7XHJcbiAgICAgICAgdGhpcy5Xb3JrZXIuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldikgPT4gdGhpcy53aGlzcGVyKGV2LmRhdGEubmFtZSwgZXYuZGF0YS5kYXRhKSwgdHJ1ZSlcclxuICAgIH1cclxufVxyXG5cclxubGV0IEluc3RhbmNlID0gdW5kZWZpbmVkIiwiaW1wb3J0IEdhdGV3YXkgZnJvbSAnLi9HYXRld2F5L0NsaWVudC5lczYnXHJcbmltcG9ydCByaW90IGZyb20gJ3Jpb3QnXHJcbmltcG9ydCAnLi9UYWdzLmVzNidcclxuXHJcbm5ldyBHYXRld2F5KCdkaXN0L3dvcmtlci5qcycpLm9uKCdyZWFkeScsICgpID0+IHtcclxuICAgIHJpb3QubW91bnQoJ215LWFwcCcpXHJcbn0pIiwiaW1wb3J0IHJpb3QgZnJvbSAncmlvdCdcclxuaW1wb3J0IENoYW1iciBmcm9tICcuL0NoYW1ici9DbGllbnQuZXM2J1xyXG5cclxucmlvdC50YWcoJ215LWFwcCcsICc8eWllbGQ+PC95aWVsZD4nKVxyXG5cclxucmlvdC50YWcoJ25vdGVzJywgYFxyXG48bm90ZSBlYWNoPVwieyBOb3RlcyB9XCI+XHJcbiAgICB7IGJvZHkgfVxyXG48L25vdGU+XHJcbmAsIGZ1bmN0aW9uKCl7XHJcbiAgICB2YXIgTm90ZXMgPSB0aGlzLk5vdGVzID0gbmV3IENoYW1icignbm90ZXMnKVxyXG4gICAgTm90ZXMub24oJ25vdGVzX3VwZGF0ZWQnLCB0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKVxyXG59KSIsIi8qIFJpb3QgdjIuMy4xMiwgQGxpY2Vuc2UgTUlULCAoYykgMjAxNSBNdXV0IEluYy4gKyBjb250cmlidXRvcnMgKi9cblxuOyhmdW5jdGlvbih3aW5kb3csIHVuZGVmaW5lZCkge1xuICAndXNlIHN0cmljdCc7XG52YXIgcmlvdCA9IHsgdmVyc2lvbjogJ3YyLjMuMTInLCBzZXR0aW5nczoge30gfSxcbiAgLy8gYmUgYXdhcmUsIGludGVybmFsIHVzYWdlXG4gIC8vIEFUVEVOVElPTjogcHJlZml4IHRoZSBnbG9iYWwgZHluYW1pYyB2YXJpYWJsZXMgd2l0aCBgX19gXG5cbiAgLy8gY291bnRlciB0byBnaXZlIGEgdW5pcXVlIGlkIHRvIGFsbCB0aGUgVGFnIGluc3RhbmNlc1xuICBfX3VpZCA9IDAsXG4gIC8vIHRhZ3MgaW5zdGFuY2VzIGNhY2hlXG4gIF9fdmlydHVhbERvbSA9IFtdLFxuICAvLyB0YWdzIGltcGxlbWVudGF0aW9uIGNhY2hlXG4gIF9fdGFnSW1wbCA9IHt9LFxuXG4gIC8qKlxuICAgKiBDb25zdFxuICAgKi9cbiAgLy8gcmlvdCBzcGVjaWZpYyBwcmVmaXhlc1xuICBSSU9UX1BSRUZJWCA9ICdyaW90LScsXG4gIFJJT1RfVEFHID0gUklPVF9QUkVGSVggKyAndGFnJyxcblxuICAvLyBmb3IgdHlwZW9mID09ICcnIGNvbXBhcmlzb25zXG4gIFRfU1RSSU5HID0gJ3N0cmluZycsXG4gIFRfT0JKRUNUID0gJ29iamVjdCcsXG4gIFRfVU5ERUYgID0gJ3VuZGVmaW5lZCcsXG4gIFRfRlVOQ1RJT04gPSAnZnVuY3Rpb24nLFxuICAvLyBzcGVjaWFsIG5hdGl2ZSB0YWdzIHRoYXQgY2Fubm90IGJlIHRyZWF0ZWQgbGlrZSB0aGUgb3RoZXJzXG4gIFNQRUNJQUxfVEFHU19SRUdFWCA9IC9eKD86b3B0KGlvbnxncm91cCl8dGJvZHl8Y29sfHRbcmhkXSkkLyxcbiAgUkVTRVJWRURfV09SRFNfQkxBQ0tMSVNUID0gWydfaXRlbScsICdfaWQnLCAnX3BhcmVudCcsICd1cGRhdGUnLCAncm9vdCcsICdtb3VudCcsICd1bm1vdW50JywgJ21peGluJywgJ2lzTW91bnRlZCcsICdpc0xvb3AnLCAndGFncycsICdwYXJlbnQnLCAnb3B0cycsICd0cmlnZ2VyJywgJ29uJywgJ29mZicsICdvbmUnXSxcblxuICAvLyB2ZXJzaW9uIyBmb3IgSUUgOC0xMSwgMCBmb3Igb3RoZXJzXG4gIElFX1ZFUlNJT04gPSAod2luZG93ICYmIHdpbmRvdy5kb2N1bWVudCB8fCB7fSkuZG9jdW1lbnRNb2RlIHwgMFxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbnJpb3Qub2JzZXJ2YWJsZSA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgLyoqXG4gICAqIEV4dGVuZCB0aGUgb3JpZ2luYWwgb2JqZWN0IG9yIGNyZWF0ZSBhIG5ldyBlbXB0eSBvbmVcbiAgICogQHR5cGUgeyBPYmplY3QgfVxuICAgKi9cblxuICBlbCA9IGVsIHx8IHt9XG5cbiAgLyoqXG4gICAqIFByaXZhdGUgdmFyaWFibGVzIGFuZCBtZXRob2RzXG4gICAqL1xuXG4gIHZhciBjYWxsYmFja3MgPSB7fSxcbiAgICBvbkVhY2hFdmVudCA9IGZ1bmN0aW9uKGUsIGZuKSB7IGUucmVwbGFjZSgvXFxTKy9nLCBmbikgfSxcbiAgICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWwsIGtleSwge1xuICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2VcbiAgICAgIH0pXG4gICAgfVxuXG4gIC8qKlxuICAgKiBMaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgIGFuZCBleGVjdXRlIHRoZSBgY2FsbGJhY2tgIGVhY2ggdGltZSBhbiBldmVudCBpcyB0cmlnZ2VyZWQuXG4gICAqIEBwYXJhbSAgeyBTdHJpbmcgfSBldmVudHMgLSBldmVudHMgaWRzXG4gICAqIEBwYXJhbSAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAgICogQHJldHVybnMgeyBPYmplY3QgfSBlbFxuICAgKi9cblxuICBkZWZpbmVQcm9wZXJ0eSgnb24nLCBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgaWYgKHR5cGVvZiBmbiAhPSAnZnVuY3Rpb24nKSAgcmV0dXJuIGVsXG5cbiAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUsIHBvcykge1xuICAgICAgKGNhbGxiYWNrc1tuYW1lXSA9IGNhbGxiYWNrc1tuYW1lXSB8fCBbXSkucHVzaChmbilcbiAgICAgIGZuLnR5cGVkID0gcG9zID4gMFxuICAgIH0pXG5cbiAgICByZXR1cm4gZWxcbiAgfSlcblxuICAvKipcbiAgICogUmVtb3ZlcyB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgbGlzdGVuZXJzXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAqL1xuXG4gIGRlZmluZVByb3BlcnR5KCdvZmYnLCBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgaWYgKGV2ZW50cyA9PSAnKicpIGNhbGxiYWNrcyA9IHt9XG4gICAgZWxzZSB7XG4gICAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgdmFyIGFyciA9IGNhbGxiYWNrc1tuYW1lXVxuICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBjYjsgY2IgPSBhcnIgJiYgYXJyW2ldOyArK2kpIHtcbiAgICAgICAgICAgIGlmIChjYiA9PSBmbikgYXJyLnNwbGljZShpLS0sIDEpXG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgZGVsZXRlIGNhbGxiYWNrc1tuYW1lXVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIGVsXG4gIH0pXG5cbiAgLyoqXG4gICAqIExpc3RlbiB0byB0aGUgZ2l2ZW4gc3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgYGV2ZW50c2AgYW5kIGV4ZWN1dGUgdGhlIGBjYWxsYmFja2AgYXQgbW9zdCBvbmNlXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgKiBAcGFyYW0gICB7IEZ1bmN0aW9uIH0gZm4gLSBjYWxsYmFjayBmdW5jdGlvblxuICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAqL1xuXG4gIGRlZmluZVByb3BlcnR5KCdvbmUnLCBmdW5jdGlvbihldmVudHMsIGZuKSB7XG4gICAgZnVuY3Rpb24gb24oKSB7XG4gICAgICBlbC5vZmYoZXZlbnRzLCBvbilcbiAgICAgIGZuLmFwcGx5KGVsLCBhcmd1bWVudHMpXG4gICAgfVxuICAgIHJldHVybiBlbC5vbihldmVudHMsIG9uKVxuICB9KVxuXG4gIC8qKlxuICAgKiBFeGVjdXRlIGFsbCBjYWxsYmFjayBmdW5jdGlvbnMgdGhhdCBsaXN0ZW4gdG8gdGhlIGdpdmVuIHNwYWNlIHNlcGFyYXRlZCBsaXN0IG9mIGBldmVudHNgXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gZXZlbnRzIC0gZXZlbnRzIGlkc1xuICAgKiBAcmV0dXJucyB7IE9iamVjdCB9IGVsXG4gICAqL1xuXG4gIGRlZmluZVByb3BlcnR5KCd0cmlnZ2VyJywgZnVuY3Rpb24oZXZlbnRzKSB7XG5cbiAgICAvLyBnZXR0aW5nIHRoZSBhcmd1bWVudHNcbiAgICAvLyBza2lwcGluZyB0aGUgZmlyc3Qgb25lXG4gICAgdmFyIGFyZ2xlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxLFxuICAgICAgYXJncyA9IG5ldyBBcnJheShhcmdsZW4pXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmdsZW47IGkrKykge1xuICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpICsgMV1cbiAgICB9XG5cbiAgICBvbkVhY2hFdmVudChldmVudHMsIGZ1bmN0aW9uKG5hbWUpIHtcblxuICAgICAgdmFyIGZucyA9IChjYWxsYmFja3NbbmFtZV0gfHwgW10pLnNsaWNlKDApXG5cbiAgICAgIGZvciAodmFyIGkgPSAwLCBmbjsgZm4gPSBmbnNbaV07ICsraSkge1xuICAgICAgICBpZiAoZm4uYnVzeSkgcmV0dXJuXG4gICAgICAgIGZuLmJ1c3kgPSAxXG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmbi5hcHBseShlbCwgZm4udHlwZWQgPyBbbmFtZV0uY29uY2F0KGFyZ3MpIDogYXJncylcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBlbC50cmlnZ2VyKCdlcnJvcicsIGUpIH1cbiAgICAgICAgaWYgKGZuc1tpXSAhPT0gZm4pIHsgaS0tIH1cbiAgICAgICAgZm4uYnVzeSA9IDBcbiAgICAgIH1cblxuICAgICAgaWYgKGNhbGxiYWNrcy5hbGwgJiYgbmFtZSAhPSAnYWxsJylcbiAgICAgICAgZWwudHJpZ2dlci5hcHBseShlbCwgWydhbGwnLCBuYW1lXS5jb25jYXQoYXJncykpXG5cbiAgICB9KVxuXG4gICAgcmV0dXJuIGVsXG4gIH0pXG5cbiAgcmV0dXJuIGVsXG5cbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG47KGZ1bmN0aW9uKHJpb3QpIHsgaWYgKCF3aW5kb3cpIHJldHVybjtcblxuLyoqXG4gKiBTaW1wbGUgY2xpZW50LXNpZGUgcm91dGVyXG4gKiBAbW9kdWxlIHJpb3Qtcm91dGVcbiAqL1xuXG5cbnZhciBSRV9PUklHSU4gPSAvXi4rP1xcLytbXlxcL10rLyxcbiAgRVZFTlRfTElTVEVORVIgPSAnRXZlbnRMaXN0ZW5lcicsXG4gIFJFTU9WRV9FVkVOVF9MSVNURU5FUiA9ICdyZW1vdmUnICsgRVZFTlRfTElTVEVORVIsXG4gIEFERF9FVkVOVF9MSVNURU5FUiA9ICdhZGQnICsgRVZFTlRfTElTVEVORVIsXG4gIEhBU19BVFRSSUJVVEUgPSAnaGFzQXR0cmlidXRlJyxcbiAgUkVQTEFDRSA9ICdyZXBsYWNlJyxcbiAgUE9QU1RBVEUgPSAncG9wc3RhdGUnLFxuICBIQVNIQ0hBTkdFID0gJ2hhc2hjaGFuZ2UnLFxuICBUUklHR0VSID0gJ3RyaWdnZXInLFxuICBNQVhfRU1JVF9TVEFDS19MRVZFTCA9IDMsXG4gIHdpbiA9IHdpbmRvdyxcbiAgZG9jID0gZG9jdW1lbnQsXG4gIGxvYyA9IHdpbi5oaXN0b3J5LmxvY2F0aW9uIHx8IHdpbi5sb2NhdGlvbiwgLy8gc2VlIGh0bWw1LWhpc3RvcnktYXBpXG4gIHByb3QgPSBSb3V0ZXIucHJvdG90eXBlLCAvLyB0byBtaW5pZnkgbW9yZVxuICBjbGlja0V2ZW50ID0gZG9jICYmIGRvYy5vbnRvdWNoc3RhcnQgPyAndG91Y2hzdGFydCcgOiAnY2xpY2snLFxuICBzdGFydGVkID0gZmFsc2UsXG4gIGNlbnRyYWwgPSByaW90Lm9ic2VydmFibGUoKSxcbiAgcm91dGVGb3VuZCA9IGZhbHNlLFxuICBkZWJvdW5jZWRFbWl0LFxuICBiYXNlLCBjdXJyZW50LCBwYXJzZXIsIHNlY29uZFBhcnNlciwgZW1pdFN0YWNrID0gW10sIGVtaXRTdGFja0xldmVsID0gMFxuXG4vKipcbiAqIERlZmF1bHQgcGFyc2VyLiBZb3UgY2FuIHJlcGxhY2UgaXQgdmlhIHJvdXRlci5wYXJzZXIgbWV0aG9kLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBjdXJyZW50IHBhdGggKG5vcm1hbGl6ZWQpXG4gKiBAcmV0dXJucyB7YXJyYXl9IGFycmF5XG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfUEFSU0VSKHBhdGgpIHtcbiAgcmV0dXJuIHBhdGguc3BsaXQoL1svPyNdLylcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHBhcnNlciAoc2Vjb25kKS4gWW91IGNhbiByZXBsYWNlIGl0IHZpYSByb3V0ZXIucGFyc2VyIG1ldGhvZC5cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gY3VycmVudCBwYXRoIChub3JtYWxpemVkKVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbHRlciAtIGZpbHRlciBzdHJpbmcgKG5vcm1hbGl6ZWQpXG4gKiBAcmV0dXJucyB7YXJyYXl9IGFycmF5XG4gKi9cbmZ1bmN0aW9uIERFRkFVTFRfU0VDT05EX1BBUlNFUihwYXRoLCBmaWx0ZXIpIHtcbiAgdmFyIHJlID0gbmV3IFJlZ0V4cCgnXicgKyBmaWx0ZXJbUkVQTEFDRV0oL1xcKi9nLCAnKFteLz8jXSs/KScpW1JFUExBQ0VdKC9cXC5cXC4vLCAnLionKSArICckJyksXG4gICAgYXJncyA9IHBhdGgubWF0Y2gocmUpXG5cbiAgaWYgKGFyZ3MpIHJldHVybiBhcmdzLnNsaWNlKDEpXG59XG5cbi8qKlxuICogU2ltcGxlL2NoZWFwIGRlYm91bmNlIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gICB7ZnVuY3Rpb259IGZuIC0gY2FsbGJhY2tcbiAqIEBwYXJhbSAgIHtudW1iZXJ9IGRlbGF5IC0gZGVsYXkgaW4gc2Vjb25kc1xuICogQHJldHVybnMge2Z1bmN0aW9ufSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZm4sIGRlbGF5KSB7XG4gIHZhciB0XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHQpXG4gICAgdCA9IHNldFRpbWVvdXQoZm4sIGRlbGF5KVxuICB9XG59XG5cbi8qKlxuICogU2V0IHRoZSB3aW5kb3cgbGlzdGVuZXJzIHRvIHRyaWdnZXIgdGhlIHJvdXRlc1xuICogQHBhcmFtIHtib29sZWFufSBhdXRvRXhlYyAtIHNlZSByb3V0ZS5zdGFydFxuICovXG5mdW5jdGlvbiBzdGFydChhdXRvRXhlYykge1xuICBkZWJvdW5jZWRFbWl0ID0gZGVib3VuY2UoZW1pdCwgMSlcbiAgd2luW0FERF9FVkVOVF9MSVNURU5FUl0oUE9QU1RBVEUsIGRlYm91bmNlZEVtaXQpXG4gIHdpbltBRERfRVZFTlRfTElTVEVORVJdKEhBU0hDSEFOR0UsIGRlYm91bmNlZEVtaXQpXG4gIGRvY1tBRERfRVZFTlRfTElTVEVORVJdKGNsaWNrRXZlbnQsIGNsaWNrKVxuICBpZiAoYXV0b0V4ZWMpIGVtaXQodHJ1ZSlcbn1cblxuLyoqXG4gKiBSb3V0ZXIgY2xhc3NcbiAqL1xuZnVuY3Rpb24gUm91dGVyKCkge1xuICB0aGlzLiQgPSBbXVxuICByaW90Lm9ic2VydmFibGUodGhpcykgLy8gbWFrZSBpdCBvYnNlcnZhYmxlXG4gIGNlbnRyYWwub24oJ3N0b3AnLCB0aGlzLnMuYmluZCh0aGlzKSlcbiAgY2VudHJhbC5vbignZW1pdCcsIHRoaXMuZS5iaW5kKHRoaXMpKVxufVxuXG5mdW5jdGlvbiBub3JtYWxpemUocGF0aCkge1xuICByZXR1cm4gcGF0aFtSRVBMQUNFXSgvXlxcL3xcXC8kLywgJycpXG59XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKHN0cikge1xuICByZXR1cm4gdHlwZW9mIHN0ciA9PSAnc3RyaW5nJ1xufVxuXG4vKipcbiAqIEdldCB0aGUgcGFydCBhZnRlciBkb21haW4gbmFtZVxuICogQHBhcmFtIHtzdHJpbmd9IGhyZWYgLSBmdWxscGF0aFxuICogQHJldHVybnMge3N0cmluZ30gcGF0aCBmcm9tIHJvb3RcbiAqL1xuZnVuY3Rpb24gZ2V0UGF0aEZyb21Sb290KGhyZWYpIHtcbiAgcmV0dXJuIChocmVmIHx8IGxvYy5ocmVmKVtSRVBMQUNFXShSRV9PUklHSU4sICcnKVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGFydCBhZnRlciBiYXNlXG4gKiBAcGFyYW0ge3N0cmluZ30gaHJlZiAtIGZ1bGxwYXRoXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBwYXRoIGZyb20gYmFzZVxuICovXG5mdW5jdGlvbiBnZXRQYXRoRnJvbUJhc2UoaHJlZikge1xuICByZXR1cm4gYmFzZVswXSA9PSAnIydcbiAgICA/IChocmVmIHx8IGxvYy5ocmVmKS5zcGxpdChiYXNlKVsxXSB8fCAnJ1xuICAgIDogZ2V0UGF0aEZyb21Sb290KGhyZWYpW1JFUExBQ0VdKGJhc2UsICcnKVxufVxuXG5mdW5jdGlvbiBlbWl0KGZvcmNlKSB7XG4gIC8vIHRoZSBzdGFjayBpcyBuZWVkZWQgZm9yIHJlZGlyZWN0aW9uc1xuICB2YXIgaXNSb290ID0gZW1pdFN0YWNrTGV2ZWwgPT0gMFxuICBpZiAoTUFYX0VNSVRfU1RBQ0tfTEVWRUwgPD0gZW1pdFN0YWNrTGV2ZWwpIHJldHVyblxuXG4gIGVtaXRTdGFja0xldmVsKytcbiAgZW1pdFN0YWNrLnB1c2goZnVuY3Rpb24oKSB7XG4gICAgdmFyIHBhdGggPSBnZXRQYXRoRnJvbUJhc2UoKVxuICAgIGlmIChmb3JjZSB8fCBwYXRoICE9IGN1cnJlbnQpIHtcbiAgICAgIGNlbnRyYWxbVFJJR0dFUl0oJ2VtaXQnLCBwYXRoKVxuICAgICAgY3VycmVudCA9IHBhdGhcbiAgICB9XG4gIH0pXG4gIGlmIChpc1Jvb3QpIHtcbiAgICB3aGlsZSAoZW1pdFN0YWNrLmxlbmd0aCkge1xuICAgICAgZW1pdFN0YWNrWzBdKClcbiAgICAgIGVtaXRTdGFjay5zaGlmdCgpXG4gICAgfVxuICAgIGVtaXRTdGFja0xldmVsID0gMFxuICB9XG59XG5cbmZ1bmN0aW9uIGNsaWNrKGUpIHtcbiAgaWYgKFxuICAgIGUud2hpY2ggIT0gMSAvLyBub3QgbGVmdCBjbGlja1xuICAgIHx8IGUubWV0YUtleSB8fCBlLmN0cmxLZXkgfHwgZS5zaGlmdEtleSAvLyBvciBtZXRhIGtleXNcbiAgICB8fCBlLmRlZmF1bHRQcmV2ZW50ZWQgLy8gb3IgZGVmYXVsdCBwcmV2ZW50ZWRcbiAgKSByZXR1cm5cblxuICB2YXIgZWwgPSBlLnRhcmdldFxuICB3aGlsZSAoZWwgJiYgZWwubm9kZU5hbWUgIT0gJ0EnKSBlbCA9IGVsLnBhcmVudE5vZGVcbiAgaWYgKFxuICAgICFlbCB8fCBlbC5ub2RlTmFtZSAhPSAnQScgLy8gbm90IEEgdGFnXG4gICAgfHwgZWxbSEFTX0FUVFJJQlVURV0oJ2Rvd25sb2FkJykgLy8gaGFzIGRvd25sb2FkIGF0dHJcbiAgICB8fCAhZWxbSEFTX0FUVFJJQlVURV0oJ2hyZWYnKSAvLyBoYXMgbm8gaHJlZiBhdHRyXG4gICAgfHwgZWwudGFyZ2V0ICYmIGVsLnRhcmdldCAhPSAnX3NlbGYnIC8vIGFub3RoZXIgd2luZG93IG9yIGZyYW1lXG4gICAgfHwgZWwuaHJlZi5pbmRleE9mKGxvYy5ocmVmLm1hdGNoKFJFX09SSUdJTilbMF0pID09IC0xIC8vIGNyb3NzIG9yaWdpblxuICApIHJldHVyblxuXG4gIGlmIChlbC5ocmVmICE9IGxvYy5ocmVmKSB7XG4gICAgaWYgKFxuICAgICAgZWwuaHJlZi5zcGxpdCgnIycpWzBdID09IGxvYy5ocmVmLnNwbGl0KCcjJylbMF0gLy8gaW50ZXJuYWwganVtcFxuICAgICAgfHwgYmFzZSAhPSAnIycgJiYgZ2V0UGF0aEZyb21Sb290KGVsLmhyZWYpLmluZGV4T2YoYmFzZSkgIT09IDAgLy8gb3V0c2lkZSBvZiBiYXNlXG4gICAgICB8fCAhZ28oZ2V0UGF0aEZyb21CYXNlKGVsLmhyZWYpLCBlbC50aXRsZSB8fCBkb2MudGl0bGUpIC8vIHJvdXRlIG5vdCBmb3VuZFxuICAgICkgcmV0dXJuXG4gIH1cblxuICBlLnByZXZlbnREZWZhdWx0KClcbn1cblxuLyoqXG4gKiBHbyB0byB0aGUgcGF0aFxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBkZXN0aW5hdGlvbiBwYXRoXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGUgLSBwYWdlIHRpdGxlXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gLSByb3V0ZSBub3QgZm91bmQgZmxhZ1xuICovXG5mdW5jdGlvbiBnbyhwYXRoLCB0aXRsZSkge1xuICB0aXRsZSA9IHRpdGxlIHx8IGRvYy50aXRsZVxuICAvLyBicm93c2VycyBpZ25vcmVzIHRoZSBzZWNvbmQgcGFyYW1ldGVyIGB0aXRsZWBcbiAgaGlzdG9yeS5wdXNoU3RhdGUobnVsbCwgdGl0bGUsIGJhc2UgKyBub3JtYWxpemUocGF0aCkpXG4gIC8vIHNvIHdlIG5lZWQgdG8gc2V0IGl0IG1hbnVhbGx5XG4gIGRvYy50aXRsZSA9IHRpdGxlXG4gIHJvdXRlRm91bmQgPSBmYWxzZVxuICBlbWl0KClcbiAgcmV0dXJuIHJvdXRlRm91bmRcbn1cblxuLyoqXG4gKiBHbyB0byBwYXRoIG9yIHNldCBhY3Rpb25cbiAqIGEgc2luZ2xlIHN0cmluZzogICAgICAgICAgICAgICAgZ28gdGhlcmVcbiAqIHR3byBzdHJpbmdzOiAgICAgICAgICAgICAgICAgICAgZ28gdGhlcmUgd2l0aCBzZXR0aW5nIGEgdGl0bGVcbiAqIGEgc2luZ2xlIGZ1bmN0aW9uOiAgICAgICAgICAgICAgc2V0IGFuIGFjdGlvbiBvbiB0aGUgZGVmYXVsdCByb3V0ZVxuICogYSBzdHJpbmcvUmVnRXhwIGFuZCBhIGZ1bmN0aW9uOiBzZXQgYW4gYWN0aW9uIG9uIHRoZSByb3V0ZVxuICogQHBhcmFtIHsoc3RyaW5nfGZ1bmN0aW9uKX0gZmlyc3QgLSBwYXRoIC8gYWN0aW9uIC8gZmlsdGVyXG4gKiBAcGFyYW0geyhzdHJpbmd8UmVnRXhwfGZ1bmN0aW9uKX0gc2Vjb25kIC0gdGl0bGUgLyBhY3Rpb25cbiAqL1xucHJvdC5tID0gZnVuY3Rpb24oZmlyc3QsIHNlY29uZCkge1xuICBpZiAoaXNTdHJpbmcoZmlyc3QpICYmICghc2Vjb25kIHx8IGlzU3RyaW5nKHNlY29uZCkpKSBnbyhmaXJzdCwgc2Vjb25kKVxuICBlbHNlIGlmIChzZWNvbmQpIHRoaXMucihmaXJzdCwgc2Vjb25kKVxuICBlbHNlIHRoaXMucignQCcsIGZpcnN0KVxufVxuXG4vKipcbiAqIFN0b3Agcm91dGluZ1xuICovXG5wcm90LnMgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5vZmYoJyonKVxuICB0aGlzLiQgPSBbXVxufVxuXG4vKipcbiAqIEVtaXRcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0gcGF0aFxuICovXG5wcm90LmUgPSBmdW5jdGlvbihwYXRoKSB7XG4gIHRoaXMuJC5jb25jYXQoJ0AnKS5zb21lKGZ1bmN0aW9uKGZpbHRlcikge1xuICAgIHZhciBhcmdzID0gKGZpbHRlciA9PSAnQCcgPyBwYXJzZXIgOiBzZWNvbmRQYXJzZXIpKG5vcm1hbGl6ZShwYXRoKSwgbm9ybWFsaXplKGZpbHRlcikpXG4gICAgaWYgKHR5cGVvZiBhcmdzICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICB0aGlzW1RSSUdHRVJdLmFwcGx5KG51bGwsIFtmaWx0ZXJdLmNvbmNhdChhcmdzKSlcbiAgICAgIHJldHVybiByb3V0ZUZvdW5kID0gdHJ1ZSAvLyBleGl0IGZyb20gbG9vcFxuICAgIH1cbiAgfSwgdGhpcylcbn1cblxuLyoqXG4gKiBSZWdpc3RlciByb3V0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGZpbHRlciAtIGZpbHRlciBmb3IgbWF0Y2hpbmcgdG8gdXJsXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBhY3Rpb24gLSBhY3Rpb24gdG8gcmVnaXN0ZXJcbiAqL1xucHJvdC5yID0gZnVuY3Rpb24oZmlsdGVyLCBhY3Rpb24pIHtcbiAgaWYgKGZpbHRlciAhPSAnQCcpIHtcbiAgICBmaWx0ZXIgPSAnLycgKyBub3JtYWxpemUoZmlsdGVyKVxuICAgIHRoaXMuJC5wdXNoKGZpbHRlcilcbiAgfVxuICB0aGlzLm9uKGZpbHRlciwgYWN0aW9uKVxufVxuXG52YXIgbWFpblJvdXRlciA9IG5ldyBSb3V0ZXIoKVxudmFyIHJvdXRlID0gbWFpblJvdXRlci5tLmJpbmQobWFpblJvdXRlcilcblxuLyoqXG4gKiBDcmVhdGUgYSBzdWIgcm91dGVyXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259IHRoZSBtZXRob2Qgb2YgYSBuZXcgUm91dGVyIG9iamVjdFxuICovXG5yb3V0ZS5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgdmFyIG5ld1N1YlJvdXRlciA9IG5ldyBSb3V0ZXIoKVxuICAvLyBzdG9wIG9ubHkgdGhpcyBzdWItcm91dGVyXG4gIG5ld1N1YlJvdXRlci5tLnN0b3AgPSBuZXdTdWJSb3V0ZXIucy5iaW5kKG5ld1N1YlJvdXRlcilcbiAgLy8gcmV0dXJuIHN1Yi1yb3V0ZXIncyBtYWluIG1ldGhvZFxuICByZXR1cm4gbmV3U3ViUm91dGVyLm0uYmluZChuZXdTdWJSb3V0ZXIpXG59XG5cbi8qKlxuICogU2V0IHRoZSBiYXNlIG9mIHVybFxuICogQHBhcmFtIHsoc3RyfFJlZ0V4cCl9IGFyZyAtIGEgbmV3IGJhc2Ugb3IgJyMnIG9yICcjISdcbiAqL1xucm91dGUuYmFzZSA9IGZ1bmN0aW9uKGFyZykge1xuICBiYXNlID0gYXJnIHx8ICcjJ1xuICBjdXJyZW50ID0gZ2V0UGF0aEZyb21CYXNlKCkgLy8gcmVjYWxjdWxhdGUgY3VycmVudCBwYXRoXG59XG5cbi8qKiBFeGVjIHJvdXRpbmcgcmlnaHQgbm93ICoqL1xucm91dGUuZXhlYyA9IGZ1bmN0aW9uKCkge1xuICBlbWl0KHRydWUpXG59XG5cbi8qKlxuICogUmVwbGFjZSB0aGUgZGVmYXVsdCByb3V0ZXIgdG8geW91cnNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuIC0geW91ciBwYXJzZXIgZnVuY3Rpb25cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZuMiAtIHlvdXIgc2Vjb25kUGFyc2VyIGZ1bmN0aW9uXG4gKi9cbnJvdXRlLnBhcnNlciA9IGZ1bmN0aW9uKGZuLCBmbjIpIHtcbiAgaWYgKCFmbiAmJiAhZm4yKSB7XG4gICAgLy8gcmVzZXQgcGFyc2VyIGZvciB0ZXN0aW5nLi4uXG4gICAgcGFyc2VyID0gREVGQVVMVF9QQVJTRVJcbiAgICBzZWNvbmRQYXJzZXIgPSBERUZBVUxUX1NFQ09ORF9QQVJTRVJcbiAgfVxuICBpZiAoZm4pIHBhcnNlciA9IGZuXG4gIGlmIChmbjIpIHNlY29uZFBhcnNlciA9IGZuMlxufVxuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byBnZXQgdXJsIHF1ZXJ5IGFzIGFuIG9iamVjdFxuICogQHJldHVybnMge29iamVjdH0gcGFyc2VkIHF1ZXJ5XG4gKi9cbnJvdXRlLnF1ZXJ5ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBxID0ge31cbiAgbG9jLmhyZWZbUkVQTEFDRV0oL1s/Jl0oLis/KT0oW14mXSopL2csIGZ1bmN0aW9uKF8sIGssIHYpIHsgcVtrXSA9IHYgfSlcbiAgcmV0dXJuIHFcbn1cblxuLyoqIFN0b3Agcm91dGluZyAqKi9cbnJvdXRlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChzdGFydGVkKSB7XG4gICAgd2luW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0oUE9QU1RBVEUsIGRlYm91bmNlZEVtaXQpXG4gICAgd2luW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0oSEFTSENIQU5HRSwgZGVib3VuY2VkRW1pdClcbiAgICBkb2NbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXShjbGlja0V2ZW50LCBjbGljaylcbiAgICBjZW50cmFsW1RSSUdHRVJdKCdzdG9wJylcbiAgICBzdGFydGVkID0gZmFsc2VcbiAgfVxufVxuXG4vKipcbiAqIFN0YXJ0IHJvdXRpbmdcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gYXV0b0V4ZWMgLSBhdXRvbWF0aWNhbGx5IGV4ZWMgYWZ0ZXIgc3RhcnRpbmcgaWYgdHJ1ZVxuICovXG5yb3V0ZS5zdGFydCA9IGZ1bmN0aW9uIChhdXRvRXhlYykge1xuICBpZiAoIXN0YXJ0ZWQpIHtcbiAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnKSBzdGFydChhdXRvRXhlYylcbiAgICAvLyB0aGUgdGltZW91dCBpcyBuZWVkZWQgdG8gc29sdmVcbiAgICAvLyBhIHdlaXJkIHNhZmFyaSBidWcgaHR0cHM6Ly9naXRodWIuY29tL3Jpb3Qvcm91dGUvaXNzdWVzLzMzXG4gICAgZWxzZSB3aW5bQUREX0VWRU5UX0xJU1RFTkVSXSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgc3RhcnQoYXV0b0V4ZWMpIH0sIDEpXG4gICAgfSlcbiAgICBzdGFydGVkID0gdHJ1ZVxuICB9XG59XG5cbi8qKiBQcmVwYXJlIHRoZSByb3V0ZXIgKiovXG5yb3V0ZS5iYXNlKClcbnJvdXRlLnBhcnNlcigpXG5cbnJpb3Qucm91dGUgPSByb3V0ZVxufSkocmlvdClcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG5cbi8qKlxuICogVGhlIHJpb3QgdGVtcGxhdGUgZW5naW5lXG4gKiBAdmVyc2lvbiB2Mi4zLjE5XG4gKi9cblxuLyoqXG4gKiBAbW9kdWxlIGJyYWNrZXRzXG4gKlxuICogYGJyYWNrZXRzICAgICAgICAgYCBSZXR1cm5zIGEgc3RyaW5nIG9yIHJlZ2V4IGJhc2VkIG9uIGl0cyBwYXJhbWV0ZXJcbiAqIGBicmFja2V0cy5zZXR0aW5nc2AgTWlycm9ycyB0aGUgYHJpb3Quc2V0dGluZ3NgIG9iamVjdCAodXNlIGJyYWNrZXRzLnNldCBpbiBuZXcgY29kZSlcbiAqIGBicmFja2V0cy5zZXQgICAgIGAgQ2hhbmdlIHRoZSBjdXJyZW50IHJpb3QgYnJhY2tldHNcbiAqL1xuXG52YXIgYnJhY2tldHMgPSAoZnVuY3Rpb24gKFVOREVGKSB7XG5cbiAgdmFyXG4gICAgUkVHTE9CICA9ICdnJyxcblxuICAgIE1MQ09NTVMgPSAvXFwvXFwqW14qXSpcXCorKD86W14qXFwvXVteKl0qXFwqKykqXFwvL2csXG4gICAgU1RSSU5HUyA9IC9cIlteXCJcXFxcXSooPzpcXFxcW1xcU1xcc11bXlwiXFxcXF0qKSpcInwnW14nXFxcXF0qKD86XFxcXFtcXFNcXHNdW14nXFxcXF0qKSonL2csXG5cbiAgICBTX1FCU1JDID0gU1RSSU5HUy5zb3VyY2UgKyAnfCcgK1xuICAgICAgLyg/OlxcYnJldHVyblxccyt8KD86WyRcXHdcXClcXF1dfFxcK1xcK3wtLSlcXHMqKFxcLykoPyFbKlxcL10pKS8uc291cmNlICsgJ3wnICtcbiAgICAgIC9cXC8oPz1bXipcXC9dKVteW1xcL1xcXFxdKig/Oig/OlxcWyg/OlxcXFwufFteXFxdXFxcXF0qKSpcXF18XFxcXC4pW15bXFwvXFxcXF0qKSo/KFxcLylbZ2ltXSovLnNvdXJjZSxcblxuICAgIERFRkFVTFQgPSAneyB9JyxcblxuICAgIEZJTkRCUkFDRVMgPSB7XG4gICAgICAnKCc6IFJlZ0V4cCgnKFsoKV0pfCcgICArIFNfUUJTUkMsIFJFR0xPQiksXG4gICAgICAnWyc6IFJlZ0V4cCgnKFtbXFxcXF1dKXwnICsgU19RQlNSQywgUkVHTE9CKSxcbiAgICAgICd7JzogUmVnRXhwKCcoW3t9XSl8JyAgICsgU19RQlNSQywgUkVHTE9CKVxuICAgIH1cblxuICB2YXJcbiAgICBjYWNoZWRCcmFja2V0cyA9IFVOREVGLFxuICAgIF9yZWdleCxcbiAgICBfcGFpcnMgPSBbXVxuXG4gIGZ1bmN0aW9uIF9sb29wYmFjayhyZSkgeyByZXR1cm4gcmUgfVxuXG4gIGZ1bmN0aW9uIF9yZXdyaXRlKHJlLCBicCkge1xuICAgIGlmICghYnApIGJwID0gX3BhaXJzXG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoXG4gICAgICByZS5zb3VyY2UucmVwbGFjZSgvey9nLCBicFsyXSkucmVwbGFjZSgvfS9nLCBicFszXSksIHJlLmdsb2JhbCA/IFJFR0xPQiA6ICcnXG4gICAgKVxuICB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZShwYWlyKSB7XG4gICAgdmFyXG4gICAgICBjdnQsXG4gICAgICBhcnIgPSBwYWlyLnNwbGl0KCcgJylcblxuICAgIGlmIChwYWlyID09PSBERUZBVUxUKSB7XG4gICAgICBhcnJbMl0gPSBhcnJbMF1cbiAgICAgIGFyclszXSA9IGFyclsxXVxuICAgICAgY3Z0ID0gX2xvb3BiYWNrXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgaWYgKGFyci5sZW5ndGggIT09IDIgfHwgL1tcXHgwMC1cXHgxRjw+YS16QS1aMC05J1wiLDtcXFxcXS8udGVzdChwYWlyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGJyYWNrZXRzIFwiJyArIHBhaXIgKyAnXCInKVxuICAgICAgfVxuICAgICAgYXJyID0gYXJyLmNvbmNhdChwYWlyLnJlcGxhY2UoLyg/PVtbXFxdKCkqKz8uXiR8XSkvZywgJ1xcXFwnKS5zcGxpdCgnICcpKVxuICAgICAgY3Z0ID0gX3Jld3JpdGVcbiAgICB9XG4gICAgYXJyWzRdID0gY3Z0KGFyclsxXS5sZW5ndGggPiAxID8gL3tbXFxTXFxzXSo/fS8gOiAve1tefV0qfS8sIGFycilcbiAgICBhcnJbNV0gPSBjdnQoL1xcXFwoe3x9KS9nLCBhcnIpXG4gICAgYXJyWzZdID0gY3Z0KC8oXFxcXD8pKHspL2csIGFycilcbiAgICBhcnJbN10gPSBSZWdFeHAoJyhcXFxcXFxcXD8pKD86KFtbKHtdKXwoJyArIGFyclszXSArICcpKXwnICsgU19RQlNSQywgUkVHTE9CKVxuICAgIGFycls4XSA9IHBhaXJcbiAgICByZXR1cm4gYXJyXG4gIH1cblxuICBmdW5jdGlvbiBfcmVzZXQocGFpcikge1xuICAgIGlmICghcGFpcikgcGFpciA9IERFRkFVTFRcblxuICAgIGlmIChwYWlyICE9PSBfcGFpcnNbOF0pIHtcbiAgICAgIF9wYWlycyA9IF9jcmVhdGUocGFpcilcbiAgICAgIF9yZWdleCA9IHBhaXIgPT09IERFRkFVTFQgPyBfbG9vcGJhY2sgOiBfcmV3cml0ZVxuICAgICAgX3BhaXJzWzldID0gX3JlZ2V4KC9eXFxzKntcXF4/XFxzKihbJFxcd10rKSg/OlxccyosXFxzKihcXFMrKSk/XFxzK2luXFxzKyhcXFMuKilcXHMqfS8pXG4gICAgICBfcGFpcnNbMTBdID0gX3JlZ2V4KC8oXnxbXlxcXFxdKXs9W1xcU1xcc10qP30vKVxuICAgICAgX2JyYWNrZXRzLl9yYXdPZmZzZXQgPSBfcGFpcnNbMF0ubGVuZ3RoXG4gICAgfVxuICAgIGNhY2hlZEJyYWNrZXRzID0gcGFpclxuICB9XG5cbiAgZnVuY3Rpb24gX2JyYWNrZXRzKHJlT3JJZHgpIHtcbiAgICByZXR1cm4gcmVPcklkeCBpbnN0YW5jZW9mIFJlZ0V4cCA/IF9yZWdleChyZU9ySWR4KSA6IF9wYWlyc1tyZU9ySWR4XVxuICB9XG5cbiAgX2JyYWNrZXRzLnNwbGl0ID0gZnVuY3Rpb24gc3BsaXQoc3RyLCB0bXBsLCBfYnApIHtcbiAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogX2JwIGlzIGZvciB0aGUgY29tcGlsZXJcbiAgICBpZiAoIV9icCkgX2JwID0gX3BhaXJzXG5cbiAgICB2YXJcbiAgICAgIHBhcnRzID0gW10sXG4gICAgICBtYXRjaCxcbiAgICAgIGlzZXhwcixcbiAgICAgIHN0YXJ0LFxuICAgICAgcG9zLFxuICAgICAgcmUgPSBfYnBbNl1cblxuICAgIGlzZXhwciA9IHN0YXJ0ID0gcmUubGFzdEluZGV4ID0gMFxuXG4gICAgd2hpbGUgKG1hdGNoID0gcmUuZXhlYyhzdHIpKSB7XG5cbiAgICAgIHBvcyA9IG1hdGNoLmluZGV4XG5cbiAgICAgIGlmIChpc2V4cHIpIHtcblxuICAgICAgICBpZiAobWF0Y2hbMl0pIHtcbiAgICAgICAgICByZS5sYXN0SW5kZXggPSBza2lwQnJhY2VzKG1hdGNoWzJdLCByZS5sYXN0SW5kZXgpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghbWF0Y2hbM10pXG4gICAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgaWYgKCFtYXRjaFsxXSkge1xuICAgICAgICB1bmVzY2FwZVN0cihzdHIuc2xpY2Uoc3RhcnQsIHBvcykpXG4gICAgICAgIHN0YXJ0ID0gcmUubGFzdEluZGV4XG4gICAgICAgIHJlID0gX2JwWzYgKyAoaXNleHByIF49IDEpXVxuICAgICAgICByZS5sYXN0SW5kZXggPSBzdGFydFxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdHIgJiYgc3RhcnQgPCBzdHIubGVuZ3RoKSB7XG4gICAgICB1bmVzY2FwZVN0cihzdHIuc2xpY2Uoc3RhcnQpKVxuICAgIH1cblxuICAgIHJldHVybiBwYXJ0c1xuXG4gICAgZnVuY3Rpb24gdW5lc2NhcGVTdHIoc3RyKSB7XG4gICAgICBpZiAodG1wbCB8fCBpc2V4cHIpXG4gICAgICAgIHBhcnRzLnB1c2goc3RyICYmIHN0ci5yZXBsYWNlKF9icFs1XSwgJyQxJykpXG4gICAgICBlbHNlXG4gICAgICAgIHBhcnRzLnB1c2goc3RyKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNraXBCcmFjZXMoY2gsIHBvcykge1xuICAgICAgdmFyXG4gICAgICAgIG1hdGNoLFxuICAgICAgICByZWNjaCA9IEZJTkRCUkFDRVNbY2hdLFxuICAgICAgICBsZXZlbCA9IDFcbiAgICAgIHJlY2NoLmxhc3RJbmRleCA9IHBvc1xuXG4gICAgICB3aGlsZSAobWF0Y2ggPSByZWNjaC5leGVjKHN0cikpIHtcbiAgICAgICAgaWYgKG1hdGNoWzFdICYmXG4gICAgICAgICAgIShtYXRjaFsxXSA9PT0gY2ggPyArK2xldmVsIDogLS1sZXZlbCkpIGJyZWFrXG4gICAgICB9XG4gICAgICByZXR1cm4gbWF0Y2ggPyByZWNjaC5sYXN0SW5kZXggOiBzdHIubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgX2JyYWNrZXRzLmhhc0V4cHIgPSBmdW5jdGlvbiBoYXNFeHByKHN0cikge1xuICAgIHJldHVybiBfYnJhY2tldHMoNCkudGVzdChzdHIpXG4gIH1cblxuICBfYnJhY2tldHMubG9vcEtleXMgPSBmdW5jdGlvbiBsb29wS2V5cyhleHByKSB7XG4gICAgdmFyIG0gPSBleHByLm1hdGNoKF9icmFja2V0cyg5KSlcbiAgICByZXR1cm4gbSA/XG4gICAgICB7IGtleTogbVsxXSwgcG9zOiBtWzJdLCB2YWw6IF9wYWlyc1swXSArIG1bM10udHJpbSgpICsgX3BhaXJzWzFdIH0gOiB7IHZhbDogZXhwci50cmltKCkgfVxuICB9XG5cbiAgX2JyYWNrZXRzLmFycmF5ID0gZnVuY3Rpb24gYXJyYXkocGFpcikge1xuICAgIHJldHVybiBfY3JlYXRlKHBhaXIgfHwgY2FjaGVkQnJhY2tldHMpXG4gIH1cblxuICB2YXIgX3NldHRpbmdzXG4gIGZ1bmN0aW9uIF9zZXRTZXR0aW5ncyhvKSB7XG4gICAgdmFyIGJcbiAgICBvID0gbyB8fCB7fVxuICAgIGIgPSBvLmJyYWNrZXRzXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sICdicmFja2V0cycsIHtcbiAgICAgIHNldDogX3Jlc2V0LFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBjYWNoZWRCcmFja2V0cyB9LFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuICAgIH0pXG4gICAgX3NldHRpbmdzID0gb1xuICAgIF9yZXNldChiKVxuICB9XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShfYnJhY2tldHMsICdzZXR0aW5ncycsIHtcbiAgICBzZXQ6IF9zZXRTZXR0aW5ncyxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9zZXR0aW5ncyB9XG4gIH0pXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IGluIHRoZSBub2RlIHZlcnNpb24gcmlvdCBpcyBub3QgaW4gdGhlIHNjb3BlICovXG4gIF9icmFja2V0cy5zZXR0aW5ncyA9IHR5cGVvZiByaW90ICE9PSAndW5kZWZpbmVkJyAmJiByaW90LnNldHRpbmdzIHx8IHt9XG4gIF9icmFja2V0cy5zZXQgPSBfcmVzZXRcblxuICBfYnJhY2tldHMuUl9TVFJJTkdTID0gU1RSSU5HU1xuICBfYnJhY2tldHMuUl9NTENPTU1TID0gTUxDT01NU1xuICBfYnJhY2tldHMuU19RQkxPQ0tTID0gU19RQlNSQ1xuXG4gIHJldHVybiBfYnJhY2tldHNcblxufSkoKVxuXG4vKipcbiAqIEBtb2R1bGUgdG1wbFxuICpcbiAqIHRtcGwgICAgICAgICAgLSBSb290IGZ1bmN0aW9uLCByZXR1cm5zIHRoZSB0ZW1wbGF0ZSB2YWx1ZSwgcmVuZGVyIHdpdGggZGF0YVxuICogdG1wbC5oYXNFeHByICAtIFRlc3QgdGhlIGV4aXN0ZW5jZSBvZiBhIGV4cHJlc3Npb24gaW5zaWRlIGEgc3RyaW5nXG4gKiB0bXBsLmxvb3BLZXlzIC0gR2V0IHRoZSBrZXlzIGZvciBhbiAnZWFjaCcgbG9vcCAodXNlZCBieSBgX2VhY2hgKVxuICovXG5cbnZhciB0bXBsID0gKGZ1bmN0aW9uICgpIHtcblxuICB2YXIgX2NhY2hlID0ge31cblxuICBmdW5jdGlvbiBfdG1wbChzdHIsIGRhdGEpIHtcbiAgICBpZiAoIXN0cikgcmV0dXJuIHN0clxuXG4gICAgcmV0dXJuIChfY2FjaGVbc3RyXSB8fCAoX2NhY2hlW3N0cl0gPSBfY3JlYXRlKHN0cikpKS5jYWxsKGRhdGEsIF9sb2dFcnIpXG4gIH1cblxuICBfdG1wbC5pc1JhdyA9IGZ1bmN0aW9uIChleHByKSB7XG4gICAgcmV0dXJuIGV4cHJbYnJhY2tldHMuX3Jhd09mZnNldF0gPT09IFwiPVwiXG4gIH1cblxuICBfdG1wbC5oYXZlUmF3ID0gZnVuY3Rpb24gKHNyYykge1xuICAgIHJldHVybiBicmFja2V0cygxMCkudGVzdChzcmMpXG4gIH1cblxuICBfdG1wbC5oYXNFeHByID0gYnJhY2tldHMuaGFzRXhwclxuXG4gIF90bXBsLmxvb3BLZXlzID0gYnJhY2tldHMubG9vcEtleXNcblxuICBfdG1wbC5lcnJvckhhbmRsZXIgPSBudWxsXG5cbiAgZnVuY3Rpb24gX2xvZ0VycihlcnIsIGN0eCkge1xuXG4gICAgaWYgKF90bXBsLmVycm9ySGFuZGxlcikge1xuXG4gICAgICBlcnIucmlvdERhdGEgPSB7XG4gICAgICAgIHRhZ05hbWU6IGN0eCAmJiBjdHgucm9vdCAmJiBjdHgucm9vdC50YWdOYW1lLFxuICAgICAgICBfcmlvdF9pZDogY3R4ICYmIGN0eC5fcmlvdF9pZCAgLy9lc2xpbnQtZGlzYWJsZS1saW5lIGNhbWVsY2FzZVxuICAgICAgfVxuICAgICAgX3RtcGwuZXJyb3JIYW5kbGVyKGVycilcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfY3JlYXRlKHN0cikge1xuXG4gICAgdmFyIGV4cHIgPSBfZ2V0VG1wbChzdHIpXG4gICAgaWYgKGV4cHIuc2xpY2UoMCwgMTEpICE9PSAndHJ5e3JldHVybiAnKSBleHByID0gJ3JldHVybiAnICsgZXhwclxuXG4gICAgcmV0dXJuIG5ldyBGdW5jdGlvbignRScsIGV4cHIgKyAnOycpXG4gIH1cblxuICB2YXJcbiAgICBSRV9RQkxPQ0sgPSBSZWdFeHAoYnJhY2tldHMuU19RQkxPQ0tTLCAnZycpLFxuICAgIFJFX1FCTUFSSyA9IC9cXHgwMShcXGQrKX4vZ1xuXG4gIGZ1bmN0aW9uIF9nZXRUbXBsKHN0cikge1xuICAgIHZhclxuICAgICAgcXN0ciA9IFtdLFxuICAgICAgZXhwcixcbiAgICAgIHBhcnRzID0gYnJhY2tldHMuc3BsaXQoc3RyLnJlcGxhY2UoL1xcdTIwNTcvZywgJ1wiJyksIDEpXG5cbiAgICBpZiAocGFydHMubGVuZ3RoID4gMiB8fCBwYXJ0c1swXSkge1xuICAgICAgdmFyIGksIGosIGxpc3QgPSBbXVxuXG4gICAgICBmb3IgKGkgPSBqID0gMDsgaSA8IHBhcnRzLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgICAgZXhwciA9IHBhcnRzW2ldXG5cbiAgICAgICAgaWYgKGV4cHIgJiYgKGV4cHIgPSBpICYgMSA/XG5cbiAgICAgICAgICAgICAgX3BhcnNlRXhwcihleHByLCAxLCBxc3RyKSA6XG5cbiAgICAgICAgICAgICAgJ1wiJyArIGV4cHJcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXC9nLCAnXFxcXFxcXFwnKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHJcXG4/fFxcbi9nLCAnXFxcXG4nKVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykgK1xuICAgICAgICAgICAgICAnXCInXG5cbiAgICAgICAgICApKSBsaXN0W2orK10gPSBleHByXG5cbiAgICAgIH1cblxuICAgICAgZXhwciA9IGogPCAyID8gbGlzdFswXSA6XG4gICAgICAgICAgICAgJ1snICsgbGlzdC5qb2luKCcsJykgKyAnXS5qb2luKFwiXCIpJ1xuICAgIH1cbiAgICBlbHNlIHtcblxuICAgICAgZXhwciA9IF9wYXJzZUV4cHIocGFydHNbMV0sIDAsIHFzdHIpXG4gICAgfVxuXG4gICAgaWYgKHFzdHJbMF0pXG4gICAgICBleHByID0gZXhwci5yZXBsYWNlKFJFX1FCTUFSSywgZnVuY3Rpb24gKF8sIHBvcykge1xuICAgICAgICByZXR1cm4gcXN0cltwb3NdXG4gICAgICAgICAgLnJlcGxhY2UoL1xcci9nLCAnXFxcXHInKVxuICAgICAgICAgIC5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJylcbiAgICAgIH0pXG5cbiAgICByZXR1cm4gZXhwclxuICB9XG5cbiAgdmFyXG4gICAgQ1NfSURFTlQgPSAvXig/OigtP1tfQS1aYS16XFx4QTAtXFx4RkZdWy1cXHdcXHhBMC1cXHhGRl0qKXxcXHgwMShcXGQrKX4pOi8sXG4gICAgUkVfQlJBQ0UgPSAvLHwoW1t7KF0pfCQvZ1xuXG4gIGZ1bmN0aW9uIF9wYXJzZUV4cHIoZXhwciwgYXNUZXh0LCBxc3RyKSB7XG5cbiAgICBpZiAoZXhwclswXSA9PT0gXCI9XCIpIGV4cHIgPSBleHByLnNsaWNlKDEpXG5cbiAgICBleHByID0gZXhwclxuICAgICAgICAgIC5yZXBsYWNlKFJFX1FCTE9DSywgZnVuY3Rpb24gKHMsIGRpdikge1xuICAgICAgICAgICAgcmV0dXJuIHMubGVuZ3RoID4gMiAmJiAhZGl2ID8gJ1xceDAxJyArIChxc3RyLnB1c2gocykgLSAxKSArICd+JyA6IHNcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpXG4gICAgICAgICAgLnJlcGxhY2UoL1xcID8oW1tcXCh7fSw/XFwuOl0pXFwgPy9nLCAnJDEnKVxuXG4gICAgaWYgKGV4cHIpIHtcbiAgICAgIHZhclxuICAgICAgICBsaXN0ID0gW10sXG4gICAgICAgIGNudCA9IDAsXG4gICAgICAgIG1hdGNoXG5cbiAgICAgIHdoaWxlIChleHByICYmXG4gICAgICAgICAgICAobWF0Y2ggPSBleHByLm1hdGNoKENTX0lERU5UKSkgJiZcbiAgICAgICAgICAgICFtYXRjaC5pbmRleFxuICAgICAgICApIHtcbiAgICAgICAgdmFyXG4gICAgICAgICAga2V5LFxuICAgICAgICAgIGpzYixcbiAgICAgICAgICByZSA9IC8sfChbW3soXSl8JC9nXG5cbiAgICAgICAgZXhwciA9IFJlZ0V4cC5yaWdodENvbnRleHRcbiAgICAgICAga2V5ICA9IG1hdGNoWzJdID8gcXN0clttYXRjaFsyXV0uc2xpY2UoMSwgLTEpLnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJykgOiBtYXRjaFsxXVxuXG4gICAgICAgIHdoaWxlIChqc2IgPSAobWF0Y2ggPSByZS5leGVjKGV4cHIpKVsxXSkgc2tpcEJyYWNlcyhqc2IsIHJlKVxuXG4gICAgICAgIGpzYiAgPSBleHByLnNsaWNlKDAsIG1hdGNoLmluZGV4KVxuICAgICAgICBleHByID0gUmVnRXhwLnJpZ2h0Q29udGV4dFxuXG4gICAgICAgIGxpc3RbY250KytdID0gX3dyYXBFeHByKGpzYiwgMSwga2V5KVxuICAgICAgfVxuXG4gICAgICBleHByID0gIWNudCA/IF93cmFwRXhwcihleHByLCBhc1RleHQpIDpcbiAgICAgICAgICBjbnQgPiAxID8gJ1snICsgbGlzdC5qb2luKCcsJykgKyAnXS5qb2luKFwiIFwiKS50cmltKCknIDogbGlzdFswXVxuICAgIH1cbiAgICByZXR1cm4gZXhwclxuXG4gICAgZnVuY3Rpb24gc2tpcEJyYWNlcyhqc2IsIHJlKSB7XG4gICAgICB2YXJcbiAgICAgICAgbWF0Y2gsXG4gICAgICAgIGx2ID0gMSxcbiAgICAgICAgaXIgPSBqc2IgPT09ICcoJyA/IC9bKCldL2cgOiBqc2IgPT09ICdbJyA/IC9bW1xcXV0vZyA6IC9be31dL2dcblxuICAgICAgaXIubGFzdEluZGV4ID0gcmUubGFzdEluZGV4XG4gICAgICB3aGlsZSAobWF0Y2ggPSBpci5leGVjKGV4cHIpKSB7XG4gICAgICAgIGlmIChtYXRjaFswXSA9PT0ganNiKSArK2x2XG4gICAgICAgIGVsc2UgaWYgKCEtLWx2KSBicmVha1xuICAgICAgfVxuICAgICAgcmUubGFzdEluZGV4ID0gbHYgPyBleHByLmxlbmd0aCA6IGlyLmxhc3RJbmRleFxuICAgIH1cbiAgfVxuXG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBub3QgYm90aFxuICB2YXIgSlNfQ09OVEVYVCA9ICdcImluIHRoaXM/dGhpczonICsgKHR5cGVvZiB3aW5kb3cgIT09ICdvYmplY3QnID8gJ2dsb2JhbCcgOiAnd2luZG93JykgKyAnKS4nXG4gIHZhciBKU19WQVJOQU1FID0gL1sse11bJFxcd10rOnwoXiAqfFteJFxcd1xcLl0pKD8hKD86dHlwZW9mfHRydWV8ZmFsc2V8bnVsbHx1bmRlZmluZWR8aW58aW5zdGFuY2VvZnxpcyg/OkZpbml0ZXxOYU4pfHZvaWR8TmFOfG5ld3xEYXRlfFJlZ0V4cHxNYXRoKSg/IVskXFx3XSkpKFskX0EtWmEtel1bJFxcd10qKS9nXG5cbiAgZnVuY3Rpb24gX3dyYXBFeHByKGV4cHIsIGFzVGV4dCwga2V5KSB7XG4gICAgdmFyIHRiXG5cbiAgICBleHByID0gZXhwci5yZXBsYWNlKEpTX1ZBUk5BTUUsIGZ1bmN0aW9uIChtYXRjaCwgcCwgbXZhciwgcG9zLCBzKSB7XG4gICAgICBpZiAobXZhcikge1xuICAgICAgICBwb3MgPSB0YiA/IDAgOiBwb3MgKyBtYXRjaC5sZW5ndGhcblxuICAgICAgICBpZiAobXZhciAhPT0gJ3RoaXMnICYmIG12YXIgIT09ICdnbG9iYWwnICYmIG12YXIgIT09ICd3aW5kb3cnKSB7XG4gICAgICAgICAgbWF0Y2ggPSBwICsgJyhcIicgKyBtdmFyICsgSlNfQ09OVEVYVCArIG12YXJcbiAgICAgICAgICBpZiAocG9zKSB0YiA9IChzID0gc1twb3NdKSA9PT0gJy4nIHx8IHMgPT09ICcoJyB8fCBzID09PSAnWydcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChwb3MpXG4gICAgICAgICAgdGIgPSAhL14oPz0oXFwuWyRcXHddKykpXFwxKD86W14uWyhdfCQpLy50ZXN0KHMuc2xpY2UocG9zKSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBtYXRjaFxuICAgIH0pXG5cbiAgICBpZiAodGIpIHtcbiAgICAgIGV4cHIgPSAndHJ5e3JldHVybiAnICsgZXhwciArICd9Y2F0Y2goZSl7RShlLHRoaXMpfSdcbiAgICB9XG5cbiAgICBpZiAoa2V5KSB7XG5cbiAgICAgIGV4cHIgPSAodGIgP1xuICAgICAgICAgICdmdW5jdGlvbigpeycgKyBleHByICsgJ30uY2FsbCh0aGlzKScgOiAnKCcgKyBleHByICsgJyknXG4gICAgICAgICkgKyAnP1wiJyArIGtleSArICdcIjpcIlwiJ1xuICAgIH1cbiAgICBlbHNlIGlmIChhc1RleHQpIHtcblxuICAgICAgZXhwciA9ICdmdW5jdGlvbih2KXsnICsgKHRiID9cbiAgICAgICAgICBleHByLnJlcGxhY2UoJ3JldHVybiAnLCAndj0nKSA6ICd2PSgnICsgZXhwciArICcpJ1xuICAgICAgICApICsgJztyZXR1cm4gdnx8dj09PTA/djpcIlwifS5jYWxsKHRoaXMpJ1xuICAgIH1cblxuICAgIHJldHVybiBleHByXG4gIH1cblxuICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogY29tcGF0aWJpbGl0eSBmaXggZm9yIGJldGEgdmVyc2lvbnNcbiAgX3RtcGwucGFyc2UgPSBmdW5jdGlvbiAocykgeyByZXR1cm4gcyB9XG5cbiAgcmV0dXJuIF90bXBsXG5cbn0pKClcblxuICB0bXBsLnZlcnNpb24gPSBicmFja2V0cy52ZXJzaW9uID0gJ3YyLjMuMTknXG5cblxuLypcbiAgbGliL2Jyb3dzZXIvdGFnL21rZG9tLmpzXG5cbiAgSW5jbHVkZXMgaGFja3MgbmVlZGVkIGZvciB0aGUgSW50ZXJuZXQgRXhwbG9yZXIgdmVyc2lvbiA5IGFuZCBiZWxsb3dcblxuKi9cbi8vIGh0dHA6Ly9rYW5nYXguZ2l0aHViLmlvL2NvbXBhdC10YWJsZS9lczUvI2llOFxuLy8gaHR0cDovL2NvZGVwbGFuZXQuaW8vZHJvcHBpbmctaWU4L1xuXG52YXIgbWtkb20gPSAoZnVuY3Rpb24gKGNoZWNrSUUpIHtcblxuICB2YXIgcm9vdEVscyA9IHtcbiAgICAgICd0cic6ICd0Ym9keScsXG4gICAgICAndGgnOiAndHInLFxuICAgICAgJ3RkJzogJ3RyJyxcbiAgICAgICd0Ym9keSc6ICd0YWJsZScsXG4gICAgICAnY29sJzogJ2NvbGdyb3VwJ1xuICAgIH0sXG4gICAgR0VORVJJQyA9ICdkaXYnXG5cbiAgY2hlY2tJRSA9IGNoZWNrSUUgJiYgY2hlY2tJRSA8IDEwXG5cbiAgLy8gY3JlYXRlcyBhbnkgZG9tIGVsZW1lbnQgaW4gYSBkaXYsIHRhYmxlLCBvciBjb2xncm91cCBjb250YWluZXJcbiAgZnVuY3Rpb24gX21rZG9tKGh0bWwpIHtcblxuICAgIHZhciBtYXRjaCA9IGh0bWwgJiYgaHRtbC5tYXRjaCgvXlxccyo8KFstXFx3XSspLyksXG4gICAgICB0YWdOYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV0udG9Mb3dlckNhc2UoKSxcbiAgICAgIHJvb3RUYWcgPSByb290RWxzW3RhZ05hbWVdIHx8IEdFTkVSSUMsXG4gICAgICBlbCA9IG1rRWwocm9vdFRhZylcblxuICAgIGVsLnN0dWIgPSB0cnVlXG5cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgIGlmIChjaGVja0lFICYmIHRhZ05hbWUgJiYgKG1hdGNoID0gdGFnTmFtZS5tYXRjaChTUEVDSUFMX1RBR1NfUkVHRVgpKSlcbiAgICAgIGllOWVsZW0oZWwsIGh0bWwsIHRhZ05hbWUsICEhbWF0Y2hbMV0pXG4gICAgZWxzZVxuICAgICAgZWwuaW5uZXJIVE1MID0gaHRtbFxuXG4gICAgcmV0dXJuIGVsXG4gIH1cblxuICAvLyBjcmVhdGVzIHRyLCB0aCwgdGQsIG9wdGlvbiwgb3B0Z3JvdXAgZWxlbWVudCBmb3IgSUU4LTlcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgZnVuY3Rpb24gaWU5ZWxlbShlbCwgaHRtbCwgdGFnTmFtZSwgc2VsZWN0KSB7XG5cbiAgICB2YXIgZGl2ID0gbWtFbChHRU5FUklDKSxcbiAgICAgIHRhZyA9IHNlbGVjdCA/ICdzZWxlY3Q+JyA6ICd0YWJsZT4nLFxuICAgICAgY2hpbGRcblxuICAgIGRpdi5pbm5lckhUTUwgPSAnPCcgKyB0YWcgKyBodG1sICsgJzwvJyArIHRhZ1xuXG4gICAgY2hpbGQgPSAkKHRhZ05hbWUsIGRpdilcbiAgICBpZiAoY2hpbGQpXG4gICAgICBlbC5hcHBlbmRDaGlsZChjaGlsZClcblxuICB9XG4gIC8vIGVuZCBpZTllbGVtKClcblxuICByZXR1cm4gX21rZG9tXG5cbn0pKElFX1ZFUlNJT04pXG5cbi8qKlxuICogQ29udmVydCB0aGUgaXRlbSBsb29wZWQgaW50byBhbiBvYmplY3QgdXNlZCB0byBleHRlbmQgdGhlIGNoaWxkIHRhZyBwcm9wZXJ0aWVzXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGV4cHIgLSBvYmplY3QgY29udGFpbmluZyB0aGUga2V5cyB1c2VkIHRvIGV4dGVuZCB0aGUgY2hpbGRyZW4gdGFnc1xuICogQHBhcmFtICAgeyAqIH0ga2V5IC0gdmFsdWUgdG8gYXNzaWduIHRvIHRoZSBuZXcgb2JqZWN0IHJldHVybmVkXG4gKiBAcGFyYW0gICB7ICogfSB2YWwgLSB2YWx1ZSBjb250YWluaW5nIHRoZSBwb3NpdGlvbiBvZiB0aGUgaXRlbSBpbiB0aGUgYXJyYXlcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gLSBuZXcgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIHZhbHVlcyBvZiB0aGUgb3JpZ2luYWwgaXRlbVxuICpcbiAqIFRoZSB2YXJpYWJsZXMgJ2tleScgYW5kICd2YWwnIGFyZSBhcmJpdHJhcnkuXG4gKiBUaGV5IGRlcGVuZCBvbiB0aGUgY29sbGVjdGlvbiB0eXBlIGxvb3BlZCAoQXJyYXksIE9iamVjdClcbiAqIGFuZCBvbiB0aGUgZXhwcmVzc2lvbiB1c2VkIG9uIHRoZSBlYWNoIHRhZ1xuICpcbiAqL1xuZnVuY3Rpb24gbWtpdGVtKGV4cHIsIGtleSwgdmFsKSB7XG4gIHZhciBpdGVtID0ge31cbiAgaXRlbVtleHByLmtleV0gPSBrZXlcbiAgaWYgKGV4cHIucG9zKSBpdGVtW2V4cHIucG9zXSA9IHZhbFxuICByZXR1cm4gaXRlbVxufVxuXG4vKipcbiAqIFVubW91bnQgdGhlIHJlZHVuZGFudCB0YWdzXG4gKiBAcGFyYW0gICB7IEFycmF5IH0gaXRlbXMgLSBhcnJheSBjb250YWluaW5nIHRoZSBjdXJyZW50IGl0ZW1zIHRvIGxvb3BcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSB0YWdzIC0gYXJyYXkgY29udGFpbmluZyBhbGwgdGhlIGNoaWxkcmVuIHRhZ3NcbiAqL1xuZnVuY3Rpb24gdW5tb3VudFJlZHVuZGFudChpdGVtcywgdGFncykge1xuXG4gIHZhciBpID0gdGFncy5sZW5ndGgsXG4gICAgaiA9IGl0ZW1zLmxlbmd0aFxuXG4gIHdoaWxlIChpID4gaikge1xuICAgIHZhciB0ID0gdGFnc1stLWldXG4gICAgdGFncy5zcGxpY2UoaSwgMSlcbiAgICB0LnVubW91bnQoKVxuICB9XG59XG5cbi8qKlxuICogTW92ZSB0aGUgbmVzdGVkIGN1c3RvbSB0YWdzIGluIG5vbiBjdXN0b20gbG9vcCB0YWdzXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGNoaWxkIC0gbm9uIGN1c3RvbSBsb29wIHRhZ1xuICogQHBhcmFtICAgeyBOdW1iZXIgfSBpIC0gY3VycmVudCBwb3NpdGlvbiBvZiB0aGUgbG9vcCB0YWdcbiAqL1xuZnVuY3Rpb24gbW92ZU5lc3RlZFRhZ3MoY2hpbGQsIGkpIHtcbiAgT2JqZWN0LmtleXMoY2hpbGQudGFncykuZm9yRWFjaChmdW5jdGlvbih0YWdOYW1lKSB7XG4gICAgdmFyIHRhZyA9IGNoaWxkLnRhZ3NbdGFnTmFtZV1cbiAgICBpZiAoaXNBcnJheSh0YWcpKVxuICAgICAgZWFjaCh0YWcsIGZ1bmN0aW9uICh0KSB7XG4gICAgICAgIG1vdmVDaGlsZFRhZyh0LCB0YWdOYW1lLCBpKVxuICAgICAgfSlcbiAgICBlbHNlXG4gICAgICBtb3ZlQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBpKVxuICB9KVxufVxuXG4vKipcbiAqIEFkZHMgdGhlIGVsZW1lbnRzIGZvciBhIHZpcnR1YWwgdGFnXG4gKiBAcGFyYW0geyBUYWcgfSB0YWcgLSB0aGUgdGFnIHdob3NlIHJvb3QncyBjaGlsZHJlbiB3aWxsIGJlIGluc2VydGVkIG9yIGFwcGVuZGVkXG4gKiBAcGFyYW0geyBOb2RlIH0gc3JjIC0gdGhlIG5vZGUgdGhhdCB3aWxsIGRvIHRoZSBpbnNlcnRpbmcgb3IgYXBwZW5kaW5nXG4gKiBAcGFyYW0geyBUYWcgfSB0YXJnZXQgLSBvbmx5IGlmIGluc2VydGluZywgaW5zZXJ0IGJlZm9yZSB0aGlzIHRhZydzIGZpcnN0IGNoaWxkXG4gKi9cbmZ1bmN0aW9uIGFkZFZpcnR1YWwodGFnLCBzcmMsIHRhcmdldCkge1xuICB2YXIgZWwgPSB0YWcuX3Jvb3RcbiAgdGFnLl92aXJ0cyA9IFtdXG4gIHdoaWxlIChlbCkge1xuICAgIHZhciBzaWIgPSBlbC5uZXh0U2libGluZ1xuICAgIGlmICh0YXJnZXQpXG4gICAgICBzcmMuaW5zZXJ0QmVmb3JlKGVsLCB0YXJnZXQuX3Jvb3QpXG4gICAgZWxzZVxuICAgICAgc3JjLmFwcGVuZENoaWxkKGVsKVxuXG4gICAgdGFnLl92aXJ0cy5wdXNoKGVsKSAvLyBob2xkIGZvciB1bm1vdW50aW5nXG4gICAgZWwgPSBzaWJcbiAgfVxufVxuXG4vKipcbiAqIE1vdmUgdmlydHVhbCB0YWcgYW5kIGFsbCBjaGlsZCBub2Rlc1xuICogQHBhcmFtIHsgVGFnIH0gdGFnIC0gZmlyc3QgY2hpbGQgcmVmZXJlbmNlIHVzZWQgdG8gc3RhcnQgbW92ZVxuICogQHBhcmFtIHsgTm9kZSB9IHNyYyAgLSB0aGUgbm9kZSB0aGF0IHdpbGwgZG8gdGhlIGluc2VydGluZ1xuICogQHBhcmFtIHsgVGFnIH0gdGFyZ2V0IC0gaW5zZXJ0IGJlZm9yZSB0aGlzIHRhZydzIGZpcnN0IGNoaWxkXG4gKiBAcGFyYW0geyBOdW1iZXIgfSBsZW4gLSBob3cgbWFueSBjaGlsZCBub2RlcyB0byBtb3ZlXG4gKi9cbmZ1bmN0aW9uIG1vdmVWaXJ0dWFsKHRhZywgc3JjLCB0YXJnZXQsIGxlbikge1xuICB2YXIgZWwgPSB0YWcuX3Jvb3RcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBzaWIgPSBlbC5uZXh0U2libGluZ1xuICAgIHNyYy5pbnNlcnRCZWZvcmUoZWwsIHRhcmdldC5fcm9vdClcbiAgICBlbCA9IHNpYlxuICB9XG59XG5cblxuLyoqXG4gKiBNYW5hZ2UgdGFncyBoYXZpbmcgdGhlICdlYWNoJ1xuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIGxvb3BcbiAqIEBwYXJhbSAgIHsgVGFnIH0gcGFyZW50IC0gcGFyZW50IHRhZyBpbnN0YW5jZSB3aGVyZSB0aGUgZG9tIG5vZGUgaXMgY29udGFpbmVkXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IGV4cHIgLSBzdHJpbmcgY29udGFpbmVkIGluIHRoZSAnZWFjaCcgYXR0cmlidXRlXG4gKi9cbmZ1bmN0aW9uIF9lYWNoKGRvbSwgcGFyZW50LCBleHByKSB7XG5cbiAgLy8gcmVtb3ZlIHRoZSBlYWNoIHByb3BlcnR5IGZyb20gdGhlIG9yaWdpbmFsIHRhZ1xuICByZW1BdHRyKGRvbSwgJ2VhY2gnKVxuXG4gIHZhciBtdXN0UmVvcmRlciA9IHR5cGVvZiBnZXRBdHRyKGRvbSwgJ25vLXJlb3JkZXInKSAhPT0gVF9TVFJJTkcgfHwgcmVtQXR0cihkb20sICduby1yZW9yZGVyJyksXG4gICAgdGFnTmFtZSA9IGdldFRhZ05hbWUoZG9tKSxcbiAgICBpbXBsID0gX190YWdJbXBsW3RhZ05hbWVdIHx8IHsgdG1wbDogZG9tLm91dGVySFRNTCB9LFxuICAgIHVzZVJvb3QgPSBTUEVDSUFMX1RBR1NfUkVHRVgudGVzdCh0YWdOYW1lKSxcbiAgICByb290ID0gZG9tLnBhcmVudE5vZGUsXG4gICAgcmVmID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpLFxuICAgIGNoaWxkID0gZ2V0VGFnKGRvbSksXG4gICAgaXNPcHRpb24gPSAvb3B0aW9uL2dpLnRlc3QodGFnTmFtZSksIC8vIHRoZSBvcHRpb24gdGFncyBtdXN0IGJlIHRyZWF0ZWQgZGlmZmVyZW50bHlcbiAgICB0YWdzID0gW10sXG4gICAgb2xkSXRlbXMgPSBbXSxcbiAgICBoYXNLZXlzLFxuICAgIGlzVmlydHVhbCA9IGRvbS50YWdOYW1lID09ICdWSVJUVUFMJ1xuXG4gIC8vIHBhcnNlIHRoZSBlYWNoIGV4cHJlc3Npb25cbiAgZXhwciA9IHRtcGwubG9vcEtleXMoZXhwcilcblxuICAvLyBpbnNlcnQgYSBtYXJrZWQgd2hlcmUgdGhlIGxvb3AgdGFncyB3aWxsIGJlIGluamVjdGVkXG4gIHJvb3QuaW5zZXJ0QmVmb3JlKHJlZiwgZG9tKVxuXG4gIC8vIGNsZWFuIHRlbXBsYXRlIGNvZGVcbiAgcGFyZW50Lm9uZSgnYmVmb3JlLW1vdW50JywgZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gcmVtb3ZlIHRoZSBvcmlnaW5hbCBET00gbm9kZVxuICAgIGRvbS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvbSlcbiAgICBpZiAocm9vdC5zdHViKSByb290ID0gcGFyZW50LnJvb3RcblxuICB9KS5vbigndXBkYXRlJywgZnVuY3Rpb24gKCkge1xuICAgIC8vIGdldCB0aGUgbmV3IGl0ZW1zIGNvbGxlY3Rpb25cbiAgICB2YXIgaXRlbXMgPSB0bXBsKGV4cHIudmFsLCBwYXJlbnQpLFxuICAgICAgLy8gY3JlYXRlIGEgZnJhZ21lbnQgdG8gaG9sZCB0aGUgbmV3IERPTSBub2RlcyB0byBpbmplY3QgaW4gdGhlIHBhcmVudCB0YWdcbiAgICAgIGZyYWcgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KClcblxuXG5cbiAgICAvLyBvYmplY3QgbG9vcC4gYW55IGNoYW5nZXMgY2F1c2UgZnVsbCByZWRyYXdcbiAgICBpZiAoIWlzQXJyYXkoaXRlbXMpKSB7XG4gICAgICBoYXNLZXlzID0gaXRlbXMgfHwgZmFsc2VcbiAgICAgIGl0ZW1zID0gaGFzS2V5cyA/XG4gICAgICAgIE9iamVjdC5rZXlzKGl0ZW1zKS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIHJldHVybiBta2l0ZW0oZXhwciwga2V5LCBpdGVtc1trZXldKVxuICAgICAgICB9KSA6IFtdXG4gICAgfVxuXG4gICAgLy8gbG9vcCBhbGwgdGhlIG5ldyBpdGVtc1xuICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSkge1xuICAgICAgLy8gcmVvcmRlciBvbmx5IGlmIHRoZSBpdGVtcyBhcmUgb2JqZWN0c1xuICAgICAgdmFyIF9tdXN0UmVvcmRlciA9IG11c3RSZW9yZGVyICYmIGl0ZW0gaW5zdGFuY2VvZiBPYmplY3QsXG4gICAgICAgIG9sZFBvcyA9IG9sZEl0ZW1zLmluZGV4T2YoaXRlbSksXG4gICAgICAgIHBvcyA9IH5vbGRQb3MgJiYgX211c3RSZW9yZGVyID8gb2xkUG9zIDogaSxcbiAgICAgICAgLy8gZG9lcyBhIHRhZyBleGlzdCBpbiB0aGlzIHBvc2l0aW9uP1xuICAgICAgICB0YWcgPSB0YWdzW3Bvc11cblxuICAgICAgaXRlbSA9ICFoYXNLZXlzICYmIGV4cHIua2V5ID8gbWtpdGVtKGV4cHIsIGl0ZW0sIGkpIDogaXRlbVxuXG4gICAgICAvLyBuZXcgdGFnXG4gICAgICBpZiAoXG4gICAgICAgICFfbXVzdFJlb3JkZXIgJiYgIXRhZyAvLyB3aXRoIG5vLXJlb3JkZXIgd2UganVzdCB1cGRhdGUgdGhlIG9sZCB0YWdzXG4gICAgICAgIHx8XG4gICAgICAgIF9tdXN0UmVvcmRlciAmJiAhfm9sZFBvcyB8fCAhdGFnIC8vIGJ5IGRlZmF1bHQgd2UgYWx3YXlzIHRyeSB0byByZW9yZGVyIHRoZSBET00gZWxlbWVudHNcbiAgICAgICkge1xuXG4gICAgICAgIHRhZyA9IG5ldyBUYWcoaW1wbCwge1xuICAgICAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgICAgIGlzTG9vcDogdHJ1ZSxcbiAgICAgICAgICBoYXNJbXBsOiAhIV9fdGFnSW1wbFt0YWdOYW1lXSxcbiAgICAgICAgICByb290OiB1c2VSb290ID8gcm9vdCA6IGRvbS5jbG9uZU5vZGUoKSxcbiAgICAgICAgICBpdGVtOiBpdGVtXG4gICAgICAgIH0sIGRvbS5pbm5lckhUTUwpXG5cbiAgICAgICAgdGFnLm1vdW50KClcbiAgICAgICAgaWYgKGlzVmlydHVhbCkgdGFnLl9yb290ID0gdGFnLnJvb3QuZmlyc3RDaGlsZCAvLyBzYXZlIHJlZmVyZW5jZSBmb3IgZnVydGhlciBtb3ZlcyBvciBpbnNlcnRzXG4gICAgICAgIC8vIHRoaXMgdGFnIG11c3QgYmUgYXBwZW5kZWRcbiAgICAgICAgaWYgKGkgPT0gdGFncy5sZW5ndGgpIHtcbiAgICAgICAgICBpZiAoaXNWaXJ0dWFsKVxuICAgICAgICAgICAgYWRkVmlydHVhbCh0YWcsIGZyYWcpXG4gICAgICAgICAgZWxzZSBmcmFnLmFwcGVuZENoaWxkKHRhZy5yb290KVxuICAgICAgICB9XG4gICAgICAgIC8vIHRoaXMgdGFnIG11c3QgYmUgaW5zZXJ0XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGlmIChpc1ZpcnR1YWwpXG4gICAgICAgICAgICBhZGRWaXJ0dWFsKHRhZywgcm9vdCwgdGFnc1tpXSlcbiAgICAgICAgICBlbHNlIHJvb3QuaW5zZXJ0QmVmb3JlKHRhZy5yb290LCB0YWdzW2ldLnJvb3QpXG4gICAgICAgICAgb2xkSXRlbXMuc3BsaWNlKGksIDAsIGl0ZW0pXG4gICAgICAgIH1cblxuICAgICAgICB0YWdzLnNwbGljZShpLCAwLCB0YWcpXG4gICAgICAgIHBvcyA9IGkgLy8gaGFuZGxlZCBoZXJlIHNvIG5vIG1vdmVcbiAgICAgIH0gZWxzZSB0YWcudXBkYXRlKGl0ZW0pXG5cbiAgICAgIC8vIHJlb3JkZXIgdGhlIHRhZyBpZiBpdCdzIG5vdCBsb2NhdGVkIGluIGl0cyBwcmV2aW91cyBwb3NpdGlvblxuICAgICAgaWYgKHBvcyAhPT0gaSAmJiBfbXVzdFJlb3JkZXIpIHtcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBET01cbiAgICAgICAgaWYgKGlzVmlydHVhbClcbiAgICAgICAgICBtb3ZlVmlydHVhbCh0YWcsIHJvb3QsIHRhZ3NbaV0sIGRvbS5jaGlsZE5vZGVzLmxlbmd0aClcbiAgICAgICAgZWxzZSByb290Lmluc2VydEJlZm9yZSh0YWcucm9vdCwgdGFnc1tpXS5yb290KVxuICAgICAgICAvLyB1cGRhdGUgdGhlIHBvc2l0aW9uIGF0dHJpYnV0ZSBpZiBpdCBleGlzdHNcbiAgICAgICAgaWYgKGV4cHIucG9zKVxuICAgICAgICAgIHRhZ1tleHByLnBvc10gPSBpXG4gICAgICAgIC8vIG1vdmUgdGhlIG9sZCB0YWcgaW5zdGFuY2VcbiAgICAgICAgdGFncy5zcGxpY2UoaSwgMCwgdGFncy5zcGxpY2UocG9zLCAxKVswXSlcbiAgICAgICAgLy8gbW92ZSB0aGUgb2xkIGl0ZW1cbiAgICAgICAgb2xkSXRlbXMuc3BsaWNlKGksIDAsIG9sZEl0ZW1zLnNwbGljZShwb3MsIDEpWzBdKVxuICAgICAgICAvLyBpZiB0aGUgbG9vcCB0YWdzIGFyZSBub3QgY3VzdG9tXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gbW92ZSBhbGwgdGhlaXIgY3VzdG9tIHRhZ3MgaW50byB0aGUgcmlnaHQgcG9zaXRpb25cbiAgICAgICAgaWYgKCFjaGlsZCkgbW92ZU5lc3RlZFRhZ3ModGFnLCBpKVxuICAgICAgfVxuXG4gICAgICAvLyBjYWNoZSB0aGUgb3JpZ2luYWwgaXRlbSB0byB1c2UgaXQgaW4gdGhlIGV2ZW50cyBib3VuZCB0byB0aGlzIG5vZGVcbiAgICAgIC8vIGFuZCBpdHMgY2hpbGRyZW5cbiAgICAgIHRhZy5faXRlbSA9IGl0ZW1cbiAgICAgIC8vIGNhY2hlIHRoZSByZWFsIHBhcmVudCB0YWcgaW50ZXJuYWxseVxuICAgICAgZGVmaW5lUHJvcGVydHkodGFnLCAnX3BhcmVudCcsIHBhcmVudClcblxuICAgIH0sIHRydWUpIC8vIGFsbG93IG51bGwgdmFsdWVzXG5cbiAgICAvLyByZW1vdmUgdGhlIHJlZHVuZGFudCB0YWdzXG4gICAgdW5tb3VudFJlZHVuZGFudChpdGVtcywgdGFncylcblxuICAgIC8vIGluc2VydCB0aGUgbmV3IG5vZGVzXG4gICAgaWYgKGlzT3B0aW9uKSByb290LmFwcGVuZENoaWxkKGZyYWcpXG4gICAgZWxzZSByb290Lmluc2VydEJlZm9yZShmcmFnLCByZWYpXG5cbiAgICAvLyBzZXQgdGhlICd0YWdzJyBwcm9wZXJ0eSBvZiB0aGUgcGFyZW50IHRhZ1xuICAgIC8vIGlmIGNoaWxkIGlzICd1bmRlZmluZWQnIGl0IG1lYW5zIHRoYXQgd2UgZG9uJ3QgbmVlZCB0byBzZXQgdGhpcyBwcm9wZXJ0eVxuICAgIC8vIGZvciBleGFtcGxlOlxuICAgIC8vIHdlIGRvbid0IG5lZWQgc3RvcmUgdGhlIGBteVRhZy50YWdzWydkaXYnXWAgcHJvcGVydHkgaWYgd2UgYXJlIGxvb3BpbmcgYSBkaXYgdGFnXG4gICAgLy8gYnV0IHdlIG5lZWQgdG8gdHJhY2sgdGhlIGBteVRhZy50YWdzWydjaGlsZCddYCBwcm9wZXJ0eSBsb29waW5nIGEgY3VzdG9tIGNoaWxkIG5vZGUgbmFtZWQgYGNoaWxkYFxuICAgIGlmIChjaGlsZCkgcGFyZW50LnRhZ3NbdGFnTmFtZV0gPSB0YWdzXG5cbiAgICAvLyBjbG9uZSB0aGUgaXRlbXMgYXJyYXlcbiAgICBvbGRJdGVtcyA9IGl0ZW1zLnNsaWNlKClcblxuICB9KVxuXG59XG5cblxuZnVuY3Rpb24gcGFyc2VOYW1lZEVsZW1lbnRzKHJvb3QsIHRhZywgY2hpbGRUYWdzLCBmb3JjZVBhcnNpbmdOYW1lZCkge1xuXG4gIHdhbGsocm9vdCwgZnVuY3Rpb24oZG9tKSB7XG4gICAgaWYgKGRvbS5ub2RlVHlwZSA9PSAxKSB7XG4gICAgICBkb20uaXNMb29wID0gZG9tLmlzTG9vcCB8fCAoZG9tLnBhcmVudE5vZGUgJiYgZG9tLnBhcmVudE5vZGUuaXNMb29wIHx8IGdldEF0dHIoZG9tLCAnZWFjaCcpKSA/IDEgOiAwXG5cbiAgICAgIC8vIGN1c3RvbSBjaGlsZCB0YWdcbiAgICAgIGlmIChjaGlsZFRhZ3MpIHtcbiAgICAgICAgdmFyIGNoaWxkID0gZ2V0VGFnKGRvbSlcblxuICAgICAgICBpZiAoY2hpbGQgJiYgIWRvbS5pc0xvb3ApXG4gICAgICAgICAgY2hpbGRUYWdzLnB1c2goaW5pdENoaWxkVGFnKGNoaWxkLCB7cm9vdDogZG9tLCBwYXJlbnQ6IHRhZ30sIGRvbS5pbm5lckhUTUwsIHRhZykpXG4gICAgICB9XG5cbiAgICAgIGlmICghZG9tLmlzTG9vcCB8fCBmb3JjZVBhcnNpbmdOYW1lZClcbiAgICAgICAgc2V0TmFtZWQoZG9tLCB0YWcsIFtdKVxuICAgIH1cblxuICB9KVxuXG59XG5cbmZ1bmN0aW9uIHBhcnNlRXhwcmVzc2lvbnMocm9vdCwgdGFnLCBleHByZXNzaW9ucykge1xuXG4gIGZ1bmN0aW9uIGFkZEV4cHIoZG9tLCB2YWwsIGV4dHJhKSB7XG4gICAgaWYgKHRtcGwuaGFzRXhwcih2YWwpKSB7XG4gICAgICB2YXIgZXhwciA9IHsgZG9tOiBkb20sIGV4cHI6IHZhbCB9XG4gICAgICBleHByZXNzaW9ucy5wdXNoKGV4dGVuZChleHByLCBleHRyYSkpXG4gICAgfVxuICB9XG5cbiAgd2Fsayhyb290LCBmdW5jdGlvbihkb20pIHtcbiAgICB2YXIgdHlwZSA9IGRvbS5ub2RlVHlwZVxuXG4gICAgLy8gdGV4dCBub2RlXG4gICAgaWYgKHR5cGUgPT0gMyAmJiBkb20ucGFyZW50Tm9kZS50YWdOYW1lICE9ICdTVFlMRScpIGFkZEV4cHIoZG9tLCBkb20ubm9kZVZhbHVlKVxuICAgIGlmICh0eXBlICE9IDEpIHJldHVyblxuXG4gICAgLyogZWxlbWVudCAqL1xuXG4gICAgLy8gbG9vcFxuICAgIHZhciBhdHRyID0gZ2V0QXR0cihkb20sICdlYWNoJylcblxuICAgIGlmIChhdHRyKSB7IF9lYWNoKGRvbSwgdGFnLCBhdHRyKTsgcmV0dXJuIGZhbHNlIH1cblxuICAgIC8vIGF0dHJpYnV0ZSBleHByZXNzaW9uc1xuICAgIGVhY2goZG9tLmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGF0dHIpIHtcbiAgICAgIHZhciBuYW1lID0gYXR0ci5uYW1lLFxuICAgICAgICBib29sID0gbmFtZS5zcGxpdCgnX18nKVsxXVxuXG4gICAgICBhZGRFeHByKGRvbSwgYXR0ci52YWx1ZSwgeyBhdHRyOiBib29sIHx8IG5hbWUsIGJvb2w6IGJvb2wgfSlcbiAgICAgIGlmIChib29sKSB7IHJlbUF0dHIoZG9tLCBuYW1lKTsgcmV0dXJuIGZhbHNlIH1cblxuICAgIH0pXG5cbiAgICAvLyBza2lwIGN1c3RvbSB0YWdzXG4gICAgaWYgKGdldFRhZyhkb20pKSByZXR1cm4gZmFsc2VcblxuICB9KVxuXG59XG5mdW5jdGlvbiBUYWcoaW1wbCwgY29uZiwgaW5uZXJIVE1MKSB7XG5cbiAgdmFyIHNlbGYgPSByaW90Lm9ic2VydmFibGUodGhpcyksXG4gICAgb3B0cyA9IGluaGVyaXQoY29uZi5vcHRzKSB8fCB7fSxcbiAgICBkb20gPSBta2RvbShpbXBsLnRtcGwpLFxuICAgIHBhcmVudCA9IGNvbmYucGFyZW50LFxuICAgIGlzTG9vcCA9IGNvbmYuaXNMb29wLFxuICAgIGhhc0ltcGwgPSBjb25mLmhhc0ltcGwsXG4gICAgaXRlbSA9IGNsZWFuVXBEYXRhKGNvbmYuaXRlbSksXG4gICAgZXhwcmVzc2lvbnMgPSBbXSxcbiAgICBjaGlsZFRhZ3MgPSBbXSxcbiAgICByb290ID0gY29uZi5yb290LFxuICAgIGZuID0gaW1wbC5mbixcbiAgICB0YWdOYW1lID0gcm9vdC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgYXR0ciA9IHt9LFxuICAgIHByb3BzSW5TeW5jV2l0aFBhcmVudCA9IFtdXG5cbiAgaWYgKGZuICYmIHJvb3QuX3RhZykgcm9vdC5fdGFnLnVubW91bnQodHJ1ZSlcblxuICAvLyBub3QgeWV0IG1vdW50ZWRcbiAgdGhpcy5pc01vdW50ZWQgPSBmYWxzZVxuICByb290LmlzTG9vcCA9IGlzTG9vcFxuXG4gIC8vIGtlZXAgYSByZWZlcmVuY2UgdG8gdGhlIHRhZyBqdXN0IGNyZWF0ZWRcbiAgLy8gc28gd2Ugd2lsbCBiZSBhYmxlIHRvIG1vdW50IHRoaXMgdGFnIG11bHRpcGxlIHRpbWVzXG4gIHJvb3QuX3RhZyA9IHRoaXNcblxuICAvLyBjcmVhdGUgYSB1bmlxdWUgaWQgdG8gdGhpcyB0YWdcbiAgLy8gaXQgY291bGQgYmUgaGFuZHkgdG8gdXNlIGl0IGFsc28gdG8gaW1wcm92ZSB0aGUgdmlydHVhbCBkb20gcmVuZGVyaW5nIHNwZWVkXG4gIGRlZmluZVByb3BlcnR5KHRoaXMsICdfcmlvdF9pZCcsICsrX191aWQpIC8vIGJhc2UgMSBhbGxvd3MgdGVzdCAhdC5fcmlvdF9pZFxuXG4gIGV4dGVuZCh0aGlzLCB7IHBhcmVudDogcGFyZW50LCByb290OiByb290LCBvcHRzOiBvcHRzLCB0YWdzOiB7fSB9LCBpdGVtKVxuXG4gIC8vIGdyYWIgYXR0cmlidXRlc1xuICBlYWNoKHJvb3QuYXR0cmlidXRlcywgZnVuY3Rpb24oZWwpIHtcbiAgICB2YXIgdmFsID0gZWwudmFsdWVcbiAgICAvLyByZW1lbWJlciBhdHRyaWJ1dGVzIHdpdGggZXhwcmVzc2lvbnMgb25seVxuICAgIGlmICh0bXBsLmhhc0V4cHIodmFsKSkgYXR0cltlbC5uYW1lXSA9IHZhbFxuICB9KVxuXG4gIGlmIChkb20uaW5uZXJIVE1MICYmICEvXihzZWxlY3R8b3B0Z3JvdXB8dGFibGV8dGJvZHl8dHJ8Y29sKD86Z3JvdXApPykkLy50ZXN0KHRhZ05hbWUpKVxuICAgIC8vIHJlcGxhY2UgYWxsIHRoZSB5aWVsZCB0YWdzIHdpdGggdGhlIHRhZyBpbm5lciBodG1sXG4gICAgZG9tLmlubmVySFRNTCA9IHJlcGxhY2VZaWVsZChkb20uaW5uZXJIVE1MLCBpbm5lckhUTUwpXG5cbiAgLy8gb3B0aW9uc1xuICBmdW5jdGlvbiB1cGRhdGVPcHRzKCkge1xuICAgIHZhciBjdHggPSBoYXNJbXBsICYmIGlzTG9vcCA/IHNlbGYgOiBwYXJlbnQgfHwgc2VsZlxuXG4gICAgLy8gdXBkYXRlIG9wdHMgZnJvbSBjdXJyZW50IERPTSBhdHRyaWJ1dGVzXG4gICAgZWFjaChyb290LmF0dHJpYnV0ZXMsIGZ1bmN0aW9uKGVsKSB7XG4gICAgICBvcHRzW3RvQ2FtZWwoZWwubmFtZSldID0gdG1wbChlbC52YWx1ZSwgY3R4KVxuICAgIH0pXG4gICAgLy8gcmVjb3ZlciB0aG9zZSB3aXRoIGV4cHJlc3Npb25zXG4gICAgZWFjaChPYmplY3Qua2V5cyhhdHRyKSwgZnVuY3Rpb24obmFtZSkge1xuICAgICAgb3B0c1t0b0NhbWVsKG5hbWUpXSA9IHRtcGwoYXR0cltuYW1lXSwgY3R4KVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVEYXRhKGRhdGEpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gaXRlbSkge1xuICAgICAgaWYgKHR5cGVvZiBzZWxmW2tleV0gIT09IFRfVU5ERUYgJiYgaXNXcml0YWJsZShzZWxmLCBrZXkpKVxuICAgICAgICBzZWxmW2tleV0gPSBkYXRhW2tleV1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpbmhlcml0RnJvbVBhcmVudCAoKSB7XG4gICAgaWYgKCFzZWxmLnBhcmVudCB8fCAhaXNMb29wKSByZXR1cm5cbiAgICBlYWNoKE9iamVjdC5rZXlzKHNlbGYucGFyZW50KSwgZnVuY3Rpb24oaykge1xuICAgICAgLy8gc29tZSBwcm9wZXJ0aWVzIG11c3QgYmUgYWx3YXlzIGluIHN5bmMgd2l0aCB0aGUgcGFyZW50IHRhZ1xuICAgICAgdmFyIG11c3RTeW5jID0gIWNvbnRhaW5zKFJFU0VSVkVEX1dPUkRTX0JMQUNLTElTVCwgaykgJiYgY29udGFpbnMocHJvcHNJblN5bmNXaXRoUGFyZW50LCBrKVxuICAgICAgaWYgKHR5cGVvZiBzZWxmW2tdID09PSBUX1VOREVGIHx8IG11c3RTeW5jKSB7XG4gICAgICAgIC8vIHRyYWNrIHRoZSBwcm9wZXJ0eSB0byBrZWVwIGluIHN5bmNcbiAgICAgICAgLy8gc28gd2UgY2FuIGtlZXAgaXQgdXBkYXRlZFxuICAgICAgICBpZiAoIW11c3RTeW5jKSBwcm9wc0luU3luY1dpdGhQYXJlbnQucHVzaChrKVxuICAgICAgICBzZWxmW2tdID0gc2VsZi5wYXJlbnRba11cbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ3VwZGF0ZScsIGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgIC8vIG1ha2Ugc3VyZSB0aGUgZGF0YSBwYXNzZWQgd2lsbCBub3Qgb3ZlcnJpZGVcbiAgICAvLyB0aGUgY29tcG9uZW50IGNvcmUgbWV0aG9kc1xuICAgIGRhdGEgPSBjbGVhblVwRGF0YShkYXRhKVxuICAgIC8vIGluaGVyaXQgcHJvcGVydGllcyBmcm9tIHRoZSBwYXJlbnRcbiAgICBpbmhlcml0RnJvbVBhcmVudCgpXG4gICAgLy8gbm9ybWFsaXplIHRoZSB0YWcgcHJvcGVydGllcyBpbiBjYXNlIGFuIGl0ZW0gb2JqZWN0IHdhcyBpbml0aWFsbHkgcGFzc2VkXG4gICAgaWYgKGRhdGEgJiYgdHlwZW9mIGl0ZW0gPT09IFRfT0JKRUNUKSB7XG4gICAgICBub3JtYWxpemVEYXRhKGRhdGEpXG4gICAgICBpdGVtID0gZGF0YVxuICAgIH1cbiAgICBleHRlbmQoc2VsZiwgZGF0YSlcbiAgICB1cGRhdGVPcHRzKClcbiAgICBzZWxmLnRyaWdnZXIoJ3VwZGF0ZScsIGRhdGEpXG4gICAgdXBkYXRlKGV4cHJlc3Npb25zLCBzZWxmKVxuICAgIC8vIHRoZSB1cGRhdGVkIGV2ZW50IHdpbGwgYmUgdHJpZ2dlcmVkXG4gICAgLy8gb25jZSB0aGUgRE9NIHdpbGwgYmUgcmVhZHkgYW5kIGFsbCB0aGUgcmVmbG93IGFyZSBjb21wbGV0ZWRcbiAgICAvLyB0aGlzIGlzIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byBnZXQgdGhlIFwicmVhbFwiIHJvb3QgcHJvcGVydGllc1xuICAgIC8vIDQgZXg6IHJvb3Qub2Zmc2V0V2lkdGggLi4uXG4gICAgckFGKGZ1bmN0aW9uKCkgeyBzZWxmLnRyaWdnZXIoJ3VwZGF0ZWQnKSB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0pXG5cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ21peGluJywgZnVuY3Rpb24oKSB7XG4gICAgZWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKG1peCkge1xuICAgICAgdmFyIGluc3RhbmNlXG5cbiAgICAgIG1peCA9IHR5cGVvZiBtaXggPT09IFRfU1RSSU5HID8gcmlvdC5taXhpbihtaXgpIDogbWl4XG5cbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBtaXhpbiBpcyBhIGZ1bmN0aW9uXG4gICAgICBpZiAoaXNGdW5jdGlvbihtaXgpKSB7XG4gICAgICAgIC8vIGNyZWF0ZSB0aGUgbmV3IG1peGluIGluc3RhbmNlXG4gICAgICAgIGluc3RhbmNlID0gbmV3IG1peCgpXG4gICAgICAgIC8vIHNhdmUgdGhlIHByb3RvdHlwZSB0byBsb29wIGl0IGFmdGVyd2FyZHNcbiAgICAgICAgbWl4ID0gbWl4LnByb3RvdHlwZVxuICAgICAgfSBlbHNlIGluc3RhbmNlID0gbWl4XG5cbiAgICAgIC8vIGxvb3AgdGhlIGtleXMgaW4gdGhlIGZ1bmN0aW9uIHByb3RvdHlwZSBvciB0aGUgYWxsIG9iamVjdCBrZXlzXG4gICAgICBlYWNoKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG1peCksIGZ1bmN0aW9uKGtleSkge1xuICAgICAgICAvLyBiaW5kIG1ldGhvZHMgdG8gc2VsZlxuICAgICAgICBpZiAoa2V5ICE9ICdpbml0JylcbiAgICAgICAgICBzZWxmW2tleV0gPSBpc0Z1bmN0aW9uKGluc3RhbmNlW2tleV0pID9cbiAgICAgICAgICAgICAgICAgICAgICAgIGluc3RhbmNlW2tleV0uYmluZChzZWxmKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVtrZXldXG4gICAgICB9KVxuXG4gICAgICAvLyBpbml0IG1ldGhvZCB3aWxsIGJlIGNhbGxlZCBhdXRvbWF0aWNhbGx5XG4gICAgICBpZiAoaW5zdGFuY2UuaW5pdCkgaW5zdGFuY2UuaW5pdC5iaW5kKHNlbGYpKClcbiAgICB9KVxuICAgIHJldHVybiB0aGlzXG4gIH0pXG5cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ21vdW50JywgZnVuY3Rpb24oKSB7XG5cbiAgICB1cGRhdGVPcHRzKClcblxuICAgIC8vIGluaXRpYWxpYXRpb25cbiAgICBpZiAoZm4pIGZuLmNhbGwoc2VsZiwgb3B0cylcblxuICAgIC8vIHBhcnNlIGxheW91dCBhZnRlciBpbml0LiBmbiBtYXkgY2FsY3VsYXRlIGFyZ3MgZm9yIG5lc3RlZCBjdXN0b20gdGFnc1xuICAgIHBhcnNlRXhwcmVzc2lvbnMoZG9tLCBzZWxmLCBleHByZXNzaW9ucylcblxuICAgIC8vIG1vdW50IHRoZSBjaGlsZCB0YWdzXG4gICAgdG9nZ2xlKHRydWUpXG5cbiAgICAvLyB1cGRhdGUgdGhlIHJvb3QgYWRkaW5nIGN1c3RvbSBhdHRyaWJ1dGVzIGNvbWluZyBmcm9tIHRoZSBjb21waWxlclxuICAgIC8vIGl0IGZpeGVzIGFsc28gIzEwODdcbiAgICBpZiAoaW1wbC5hdHRycyB8fCBoYXNJbXBsKSB7XG4gICAgICB3YWxrQXR0cmlidXRlcyhpbXBsLmF0dHJzLCBmdW5jdGlvbiAoaywgdikgeyBzZXRBdHRyKHJvb3QsIGssIHYpIH0pXG4gICAgICBwYXJzZUV4cHJlc3Npb25zKHNlbGYucm9vdCwgc2VsZiwgZXhwcmVzc2lvbnMpXG4gICAgfVxuXG4gICAgaWYgKCFzZWxmLnBhcmVudCB8fCBpc0xvb3ApIHNlbGYudXBkYXRlKGl0ZW0pXG5cbiAgICAvLyBpbnRlcm5hbCB1c2Ugb25seSwgZml4ZXMgIzQwM1xuICAgIHNlbGYudHJpZ2dlcignYmVmb3JlLW1vdW50JylcblxuICAgIGlmIChpc0xvb3AgJiYgIWhhc0ltcGwpIHtcbiAgICAgIC8vIHVwZGF0ZSB0aGUgcm9vdCBhdHRyaWJ1dGUgZm9yIHRoZSBsb29wZWQgZWxlbWVudHNcbiAgICAgIHNlbGYucm9vdCA9IHJvb3QgPSBkb20uZmlyc3RDaGlsZFxuXG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlIChkb20uZmlyc3RDaGlsZCkgcm9vdC5hcHBlbmRDaGlsZChkb20uZmlyc3RDaGlsZClcbiAgICAgIGlmIChyb290LnN0dWIpIHNlbGYucm9vdCA9IHJvb3QgPSBwYXJlbnQucm9vdFxuICAgIH1cblxuICAgIC8vIHBhcnNlIHRoZSBuYW1lZCBkb20gbm9kZXMgaW4gdGhlIGxvb3BlZCBjaGlsZFxuICAgIC8vIGFkZGluZyB0aGVtIHRvIHRoZSBwYXJlbnQgYXMgd2VsbFxuICAgIGlmIChpc0xvb3ApXG4gICAgICBwYXJzZU5hbWVkRWxlbWVudHMoc2VsZi5yb290LCBzZWxmLnBhcmVudCwgbnVsbCwgdHJ1ZSlcblxuICAgIC8vIGlmIGl0J3Mgbm90IGEgY2hpbGQgdGFnIHdlIGNhbiB0cmlnZ2VyIGl0cyBtb3VudCBldmVudFxuICAgIGlmICghc2VsZi5wYXJlbnQgfHwgc2VsZi5wYXJlbnQuaXNNb3VudGVkKSB7XG4gICAgICBzZWxmLmlzTW91bnRlZCA9IHRydWVcbiAgICAgIHNlbGYudHJpZ2dlcignbW91bnQnKVxuICAgIH1cbiAgICAvLyBvdGhlcndpc2Ugd2UgbmVlZCB0byB3YWl0IHRoYXQgdGhlIHBhcmVudCBldmVudCBnZXRzIHRyaWdnZXJlZFxuICAgIGVsc2Ugc2VsZi5wYXJlbnQub25lKCdtb3VudCcsIGZ1bmN0aW9uKCkge1xuICAgICAgLy8gYXZvaWQgdG8gdHJpZ2dlciB0aGUgYG1vdW50YCBldmVudCBmb3IgdGhlIHRhZ3NcbiAgICAgIC8vIG5vdCB2aXNpYmxlIGluY2x1ZGVkIGluIGFuIGlmIHN0YXRlbWVudFxuICAgICAgaWYgKCFpc0luU3R1YihzZWxmLnJvb3QpKSB7XG4gICAgICAgIHNlbGYucGFyZW50LmlzTW91bnRlZCA9IHNlbGYuaXNNb3VudGVkID0gdHJ1ZVxuICAgICAgICBzZWxmLnRyaWdnZXIoJ21vdW50JylcbiAgICAgIH1cbiAgICB9KVxuICB9KVxuXG5cbiAgZGVmaW5lUHJvcGVydHkodGhpcywgJ3VubW91bnQnLCBmdW5jdGlvbihrZWVwUm9vdFRhZykge1xuICAgIHZhciBlbCA9IHJvb3QsXG4gICAgICBwID0gZWwucGFyZW50Tm9kZSxcbiAgICAgIHB0YWdcblxuICAgIHNlbGYudHJpZ2dlcignYmVmb3JlLXVubW91bnQnKVxuXG4gICAgLy8gcmVtb3ZlIHRoaXMgdGFnIGluc3RhbmNlIGZyb20gdGhlIGdsb2JhbCB2aXJ0dWFsRG9tIHZhcmlhYmxlXG4gICAgX192aXJ0dWFsRG9tLnNwbGljZShfX3ZpcnR1YWxEb20uaW5kZXhPZihzZWxmKSwgMSlcblxuICAgIGlmICh0aGlzLl92aXJ0cykge1xuICAgICAgZWFjaCh0aGlzLl92aXJ0cywgZnVuY3Rpb24odikge1xuICAgICAgICB2LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodilcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKHApIHtcblxuICAgICAgaWYgKHBhcmVudCkge1xuICAgICAgICBwdGFnID0gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHBhcmVudClcbiAgICAgICAgLy8gcmVtb3ZlIHRoaXMgdGFnIGZyb20gdGhlIHBhcmVudCB0YWdzIG9iamVjdFxuICAgICAgICAvLyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgbmVzdGVkIHRhZ3Mgd2l0aCBzYW1lIG5hbWUuLlxuICAgICAgICAvLyByZW1vdmUgdGhpcyBlbGVtZW50IGZvcm0gdGhlIGFycmF5XG4gICAgICAgIGlmIChpc0FycmF5KHB0YWcudGFnc1t0YWdOYW1lXSkpXG4gICAgICAgICAgZWFjaChwdGFnLnRhZ3NbdGFnTmFtZV0sIGZ1bmN0aW9uKHRhZywgaSkge1xuICAgICAgICAgICAgaWYgKHRhZy5fcmlvdF9pZCA9PSBzZWxmLl9yaW90X2lkKVxuICAgICAgICAgICAgICBwdGFnLnRhZ3NbdGFnTmFtZV0uc3BsaWNlKGksIDEpXG4gICAgICAgICAgfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIC8vIG90aGVyd2lzZSBqdXN0IGRlbGV0ZSB0aGUgdGFnIGluc3RhbmNlXG4gICAgICAgICAgcHRhZy50YWdzW3RhZ05hbWVdID0gdW5kZWZpbmVkXG4gICAgICB9XG5cbiAgICAgIGVsc2VcbiAgICAgICAgd2hpbGUgKGVsLmZpcnN0Q2hpbGQpIGVsLnJlbW92ZUNoaWxkKGVsLmZpcnN0Q2hpbGQpXG5cbiAgICAgIGlmICgha2VlcFJvb3RUYWcpXG4gICAgICAgIHAucmVtb3ZlQ2hpbGQoZWwpXG4gICAgICBlbHNlXG4gICAgICAgIC8vIHRoZSByaW90LXRhZyBhdHRyaWJ1dGUgaXNuJ3QgbmVlZGVkIGFueW1vcmUsIHJlbW92ZSBpdFxuICAgICAgICByZW1BdHRyKHAsICdyaW90LXRhZycpXG4gICAgfVxuXG5cbiAgICBzZWxmLnRyaWdnZXIoJ3VubW91bnQnKVxuICAgIHRvZ2dsZSgpXG4gICAgc2VsZi5vZmYoJyonKVxuICAgIHNlbGYuaXNNb3VudGVkID0gZmFsc2VcbiAgICAvLyBzb21laG93IGllOCBkb2VzIG5vdCBsaWtlIGBkZWxldGUgcm9vdC5fdGFnYFxuICAgIHJvb3QuX3RhZyA9IG51bGxcblxuICB9KVxuXG4gIGZ1bmN0aW9uIHRvZ2dsZShpc01vdW50KSB7XG5cbiAgICAvLyBtb3VudC91bm1vdW50IGNoaWxkcmVuXG4gICAgZWFjaChjaGlsZFRhZ3MsIGZ1bmN0aW9uKGNoaWxkKSB7IGNoaWxkW2lzTW91bnQgPyAnbW91bnQnIDogJ3VubW91bnQnXSgpIH0pXG5cbiAgICAvLyBsaXN0ZW4vdW5saXN0ZW4gcGFyZW50IChldmVudHMgZmxvdyBvbmUgd2F5IGZyb20gcGFyZW50IHRvIGNoaWxkcmVuKVxuICAgIGlmIChwYXJlbnQpIHtcbiAgICAgIHZhciBldnQgPSBpc01vdW50ID8gJ29uJyA6ICdvZmYnXG5cbiAgICAgIC8vIHRoZSBsb29wIHRhZ3Mgd2lsbCBiZSBhbHdheXMgaW4gc3luYyB3aXRoIHRoZSBwYXJlbnQgYXV0b21hdGljYWxseVxuICAgICAgaWYgKGlzTG9vcClcbiAgICAgICAgcGFyZW50W2V2dF0oJ3VubW91bnQnLCBzZWxmLnVubW91bnQpXG4gICAgICBlbHNlXG4gICAgICAgIHBhcmVudFtldnRdKCd1cGRhdGUnLCBzZWxmLnVwZGF0ZSlbZXZ0XSgndW5tb3VudCcsIHNlbGYudW5tb3VudClcbiAgICB9XG4gIH1cblxuICAvLyBuYW1lZCBlbGVtZW50cyBhdmFpbGFibGUgZm9yIGZuXG4gIHBhcnNlTmFtZWRFbGVtZW50cyhkb20sIHRoaXMsIGNoaWxkVGFncylcblxufVxuLyoqXG4gKiBBdHRhY2ggYW4gZXZlbnQgdG8gYSBET00gbm9kZVxuICogQHBhcmFtIHsgU3RyaW5nIH0gbmFtZSAtIGV2ZW50IG5hbWVcbiAqIEBwYXJhbSB7IEZ1bmN0aW9uIH0gaGFuZGxlciAtIGV2ZW50IGNhbGxiYWNrXG4gKiBAcGFyYW0geyBPYmplY3QgfSBkb20gLSBkb20gbm9kZVxuICogQHBhcmFtIHsgVGFnIH0gdGFnIC0gdGFnIGluc3RhbmNlXG4gKi9cbmZ1bmN0aW9uIHNldEV2ZW50SGFuZGxlcihuYW1lLCBoYW5kbGVyLCBkb20sIHRhZykge1xuXG4gIGRvbVtuYW1lXSA9IGZ1bmN0aW9uKGUpIHtcblxuICAgIHZhciBwdGFnID0gdGFnLl9wYXJlbnQsXG4gICAgICBpdGVtID0gdGFnLl9pdGVtLFxuICAgICAgZWxcblxuICAgIGlmICghaXRlbSlcbiAgICAgIHdoaWxlIChwdGFnICYmICFpdGVtKSB7XG4gICAgICAgIGl0ZW0gPSBwdGFnLl9pdGVtXG4gICAgICAgIHB0YWcgPSBwdGFnLl9wYXJlbnRcbiAgICAgIH1cblxuICAgIC8vIGNyb3NzIGJyb3dzZXIgZXZlbnQgZml4XG4gICAgZSA9IGUgfHwgd2luZG93LmV2ZW50XG5cbiAgICAvLyBvdmVycmlkZSB0aGUgZXZlbnQgcHJvcGVydGllc1xuICAgIGlmIChpc1dyaXRhYmxlKGUsICdjdXJyZW50VGFyZ2V0JykpIGUuY3VycmVudFRhcmdldCA9IGRvbVxuICAgIGlmIChpc1dyaXRhYmxlKGUsICd0YXJnZXQnKSkgZS50YXJnZXQgPSBlLnNyY0VsZW1lbnRcbiAgICBpZiAoaXNXcml0YWJsZShlLCAnd2hpY2gnKSkgZS53aGljaCA9IGUuY2hhckNvZGUgfHwgZS5rZXlDb2RlXG5cbiAgICBlLml0ZW0gPSBpdGVtXG5cbiAgICAvLyBwcmV2ZW50IGRlZmF1bHQgYmVoYXZpb3VyIChieSBkZWZhdWx0KVxuICAgIGlmIChoYW5kbGVyLmNhbGwodGFnLCBlKSAhPT0gdHJ1ZSAmJiAhL3JhZGlvfGNoZWNrLy50ZXN0KGRvbS50eXBlKSkge1xuICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlXG4gICAgfVxuXG4gICAgaWYgKCFlLnByZXZlbnRVcGRhdGUpIHtcbiAgICAgIGVsID0gaXRlbSA/IGdldEltbWVkaWF0ZUN1c3RvbVBhcmVudFRhZyhwdGFnKSA6IHRhZ1xuICAgICAgZWwudXBkYXRlKClcbiAgICB9XG5cbiAgfVxuXG59XG5cblxuLyoqXG4gKiBJbnNlcnQgYSBET00gbm9kZSByZXBsYWNpbmcgYW5vdGhlciBvbmUgKHVzZWQgYnkgaWYtIGF0dHJpYnV0ZSlcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gcm9vdCAtIHBhcmVudCBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IG5vZGUgLSBub2RlIHJlcGxhY2VkXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGJlZm9yZSAtIG5vZGUgYWRkZWRcbiAqL1xuZnVuY3Rpb24gaW5zZXJ0VG8ocm9vdCwgbm9kZSwgYmVmb3JlKSB7XG4gIGlmIChyb290KSB7XG4gICAgcm9vdC5pbnNlcnRCZWZvcmUoYmVmb3JlLCBub2RlKVxuICAgIHJvb3QucmVtb3ZlQ2hpbGQobm9kZSlcbiAgfVxufVxuXG4vKipcbiAqIFVwZGF0ZSB0aGUgZXhwcmVzc2lvbnMgaW4gYSBUYWcgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSBleHByZXNzaW9ucyAtIGV4cHJlc3Npb24gdGhhdCBtdXN0IGJlIHJlIGV2YWx1YXRlZFxuICogQHBhcmFtICAgeyBUYWcgfSB0YWcgLSB0YWcgaW5zdGFuY2VcbiAqL1xuZnVuY3Rpb24gdXBkYXRlKGV4cHJlc3Npb25zLCB0YWcpIHtcblxuICBlYWNoKGV4cHJlc3Npb25zLCBmdW5jdGlvbihleHByLCBpKSB7XG5cbiAgICB2YXIgZG9tID0gZXhwci5kb20sXG4gICAgICBhdHRyTmFtZSA9IGV4cHIuYXR0cixcbiAgICAgIHZhbHVlID0gdG1wbChleHByLmV4cHIsIHRhZyksXG4gICAgICBwYXJlbnQgPSBleHByLmRvbS5wYXJlbnROb2RlXG5cbiAgICBpZiAoZXhwci5ib29sKVxuICAgICAgdmFsdWUgPSB2YWx1ZSA/IGF0dHJOYW1lIDogZmFsc2VcbiAgICBlbHNlIGlmICh2YWx1ZSA9PSBudWxsKVxuICAgICAgdmFsdWUgPSAnJ1xuXG4gICAgLy8gbGVhdmUgb3V0IHJpb3QtIHByZWZpeGVzIGZyb20gc3RyaW5ncyBpbnNpZGUgdGV4dGFyZWFcbiAgICAvLyBmaXggIzgxNTogYW55IHZhbHVlIC0+IHN0cmluZ1xuICAgIGlmIChwYXJlbnQgJiYgcGFyZW50LnRhZ05hbWUgPT0gJ1RFWFRBUkVBJykge1xuICAgICAgdmFsdWUgPSAoJycgKyB2YWx1ZSkucmVwbGFjZSgvcmlvdC0vZywgJycpXG4gICAgICAvLyBjaGFuZ2UgdGV4dGFyZWEncyB2YWx1ZVxuICAgICAgcGFyZW50LnZhbHVlID0gdmFsdWVcbiAgICB9XG5cbiAgICAvLyBubyBjaGFuZ2VcbiAgICBpZiAoZXhwci52YWx1ZSA9PT0gdmFsdWUpIHJldHVyblxuICAgIGV4cHIudmFsdWUgPSB2YWx1ZVxuXG4gICAgLy8gdGV4dCBub2RlXG4gICAgaWYgKCFhdHRyTmFtZSkge1xuICAgICAgZG9tLm5vZGVWYWx1ZSA9ICcnICsgdmFsdWUgICAgLy8gIzgxNSByZWxhdGVkXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICAvLyByZW1vdmUgb3JpZ2luYWwgYXR0cmlidXRlXG4gICAgcmVtQXR0cihkb20sIGF0dHJOYW1lKVxuICAgIC8vIGV2ZW50IGhhbmRsZXJcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHNldEV2ZW50SGFuZGxlcihhdHRyTmFtZSwgdmFsdWUsIGRvbSwgdGFnKVxuXG4gICAgLy8gaWYtIGNvbmRpdGlvbmFsXG4gICAgfSBlbHNlIGlmIChhdHRyTmFtZSA9PSAnaWYnKSB7XG4gICAgICB2YXIgc3R1YiA9IGV4cHIuc3R1YixcbiAgICAgICAgYWRkID0gZnVuY3Rpb24oKSB7IGluc2VydFRvKHN0dWIucGFyZW50Tm9kZSwgc3R1YiwgZG9tKSB9LFxuICAgICAgICByZW1vdmUgPSBmdW5jdGlvbigpIHsgaW5zZXJ0VG8oZG9tLnBhcmVudE5vZGUsIGRvbSwgc3R1YikgfVxuXG4gICAgICAvLyBhZGQgdG8gRE9NXG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHN0dWIpIHtcbiAgICAgICAgICBhZGQoKVxuICAgICAgICAgIGRvbS5pblN0dWIgPSBmYWxzZVxuICAgICAgICAgIC8vIGF2b2lkIHRvIHRyaWdnZXIgdGhlIG1vdW50IGV2ZW50IGlmIHRoZSB0YWdzIGlzIG5vdCB2aXNpYmxlIHlldFxuICAgICAgICAgIC8vIG1heWJlIHdlIGNhbiBvcHRpbWl6ZSB0aGlzIGF2b2lkaW5nIHRvIG1vdW50IHRoZSB0YWcgYXQgYWxsXG4gICAgICAgICAgaWYgKCFpc0luU3R1Yihkb20pKSB7XG4gICAgICAgICAgICB3YWxrKGRvbSwgZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgICAgICAgaWYgKGVsLl90YWcgJiYgIWVsLl90YWcuaXNNb3VudGVkKSBlbC5fdGFnLmlzTW91bnRlZCA9ICEhZWwuX3RhZy50cmlnZ2VyKCdtb3VudCcpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgLy8gcmVtb3ZlIGZyb20gRE9NXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHViID0gZXhwci5zdHViID0gc3R1YiB8fCBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJylcbiAgICAgICAgLy8gaWYgdGhlIHBhcmVudE5vZGUgaXMgZGVmaW5lZCB3ZSBjYW4gZWFzaWx5IHJlcGxhY2UgdGhlIHRhZ1xuICAgICAgICBpZiAoZG9tLnBhcmVudE5vZGUpXG4gICAgICAgICAgcmVtb3ZlKClcbiAgICAgICAgLy8gb3RoZXJ3aXNlIHdlIG5lZWQgdG8gd2FpdCB0aGUgdXBkYXRlZCBldmVudFxuICAgICAgICBlbHNlICh0YWcucGFyZW50IHx8IHRhZykub25lKCd1cGRhdGVkJywgcmVtb3ZlKVxuXG4gICAgICAgIGRvbS5pblN0dWIgPSB0cnVlXG4gICAgICB9XG4gICAgLy8gc2hvdyAvIGhpZGVcbiAgICB9IGVsc2UgaWYgKC9eKHNob3d8aGlkZSkkLy50ZXN0KGF0dHJOYW1lKSkge1xuICAgICAgaWYgKGF0dHJOYW1lID09ICdoaWRlJykgdmFsdWUgPSAhdmFsdWVcbiAgICAgIGRvbS5zdHlsZS5kaXNwbGF5ID0gdmFsdWUgPyAnJyA6ICdub25lJ1xuXG4gICAgLy8gZmllbGQgdmFsdWVcbiAgICB9IGVsc2UgaWYgKGF0dHJOYW1lID09ICd2YWx1ZScpIHtcbiAgICAgIGRvbS52YWx1ZSA9IHZhbHVlXG5cbiAgICAvLyA8aW1nIHNyYz1cInsgZXhwciB9XCI+XG4gICAgfSBlbHNlIGlmIChzdGFydHNXaXRoKGF0dHJOYW1lLCBSSU9UX1BSRUZJWCkgJiYgYXR0ck5hbWUgIT0gUklPVF9UQUcpIHtcbiAgICAgIGlmICh2YWx1ZSlcbiAgICAgICAgc2V0QXR0cihkb20sIGF0dHJOYW1lLnNsaWNlKFJJT1RfUFJFRklYLmxlbmd0aCksIHZhbHVlKVxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChleHByLmJvb2wpIHtcbiAgICAgICAgZG9tW2F0dHJOYW1lXSA9IHZhbHVlXG4gICAgICAgIGlmICghdmFsdWUpIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAodmFsdWUgJiYgdmFsdWUgIT0gMCAmJiB0eXBlb2YgdmFsdWUgIT09IFRfT0JKRUNUKVxuICAgICAgICBzZXRBdHRyKGRvbSwgYXR0ck5hbWUsIHZhbHVlKVxuXG4gICAgfVxuXG4gIH0pXG5cbn1cbi8qKlxuICogTG9vcHMgYW4gYXJyYXlcbiAqIEBwYXJhbSAgIHsgQXJyYXkgfSBlbHMgLSBjb2xsZWN0aW9uIG9mIGl0ZW1zXG4gKiBAcGFyYW0gICB7RnVuY3Rpb259IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEByZXR1cm5zIHsgQXJyYXkgfSB0aGUgYXJyYXkgbG9vcGVkXG4gKi9cbmZ1bmN0aW9uIGVhY2goZWxzLCBmbikge1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gKGVscyB8fCBbXSkubGVuZ3RoLCBlbDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZWwgPSBlbHNbaV1cbiAgICAvLyByZXR1cm4gZmFsc2UgLT4gcmVtb3ZlIGN1cnJlbnQgaXRlbSBkdXJpbmcgbG9vcFxuICAgIGlmIChlbCAhPSBudWxsICYmIGZuKGVsLCBpKSA9PT0gZmFsc2UpIGktLVxuICB9XG4gIHJldHVybiBlbHNcbn1cblxuLyoqXG4gKiBEZXRlY3QgaWYgdGhlIGFyZ3VtZW50IHBhc3NlZCBpcyBhIGZ1bmN0aW9uXG4gKiBAcGFyYW0gICB7ICogfSB2IC0gd2hhdGV2ZXIgeW91IHdhbnQgdG8gcGFzcyB0byB0aGlzIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSAtXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odikge1xuICByZXR1cm4gdHlwZW9mIHYgPT09IFRfRlVOQ1RJT04gfHwgZmFsc2UgICAvLyBhdm9pZCBJRSBwcm9ibGVtc1xufVxuXG4vKipcbiAqIFJlbW92ZSBhbnkgRE9NIGF0dHJpYnV0ZSBmcm9tIGEgbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHVwZGF0ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byByZW1vdmVcbiAqL1xuZnVuY3Rpb24gcmVtQXR0cihkb20sIG5hbWUpIHtcbiAgZG9tLnJlbW92ZUF0dHJpYnV0ZShuYW1lKVxufVxuXG4vKipcbiAqIENvbnZlcnQgYSBzdHJpbmcgY29udGFpbmluZyBkYXNoZXMgdG8gY2FtZWwgY2FzZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzdHJpbmcgLSBpbnB1dCBzdHJpbmdcbiAqIEByZXR1cm5zIHsgU3RyaW5nIH0gbXktc3RyaW5nIC0+IG15U3RyaW5nXG4gKi9cbmZ1bmN0aW9uIHRvQ2FtZWwoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSgvLShcXHcpL2csIGZ1bmN0aW9uKF8sIGMpIHtcbiAgICByZXR1cm4gYy50b1VwcGVyQ2FzZSgpXG4gIH0pXG59XG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZSBvZiBhbnkgRE9NIGF0dHJpYnV0ZSBvbiBhIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2Ugd2FudCB0byBwYXJzZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgYXR0cmlidXRlIHdlIHdhbnQgdG8gZ2V0XG4gKiBAcmV0dXJucyB7IFN0cmluZyB8IHVuZGVmaW5lZCB9IG5hbWUgb2YgdGhlIG5vZGUgYXR0cmlidXRlIHdoZXRoZXIgaXQgZXhpc3RzXG4gKi9cbmZ1bmN0aW9uIGdldEF0dHIoZG9tLCBuYW1lKSB7XG4gIHJldHVybiBkb20uZ2V0QXR0cmlidXRlKG5hbWUpXG59XG5cbi8qKlxuICogU2V0IGFueSBET00gYXR0cmlidXRlXG4gKiBAcGFyYW0geyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSB3YW50IHRvIHVwZGF0ZVxuICogQHBhcmFtIHsgU3RyaW5nIH0gbmFtZSAtIG5hbWUgb2YgdGhlIHByb3BlcnR5IHdlIHdhbnQgdG8gc2V0XG4gKiBAcGFyYW0geyBTdHJpbmcgfSB2YWwgLSB2YWx1ZSBvZiB0aGUgcHJvcGVydHkgd2Ugd2FudCB0byBzZXRcbiAqL1xuZnVuY3Rpb24gc2V0QXR0cihkb20sIG5hbWUsIHZhbCkge1xuICBkb20uc2V0QXR0cmlidXRlKG5hbWUsIHZhbClcbn1cblxuLyoqXG4gKiBEZXRlY3QgdGhlIHRhZyBpbXBsZW1lbnRhdGlvbiBieSBhIERPTSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIG5lZWQgdG8gcGFyc2UgdG8gZ2V0IGl0cyB0YWcgaW1wbGVtZW50YXRpb25cbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gaXQgcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgaW1wbGVtZW50YXRpb24gb2YgYSBjdXN0b20gdGFnICh0ZW1wbGF0ZSBhbmQgYm9vdCBmdW5jdGlvbilcbiAqL1xuZnVuY3Rpb24gZ2V0VGFnKGRvbSkge1xuICByZXR1cm4gZG9tLnRhZ05hbWUgJiYgX190YWdJbXBsW2dldEF0dHIoZG9tLCBSSU9UX1RBRykgfHwgZG9tLnRhZ05hbWUudG9Mb3dlckNhc2UoKV1cbn1cbi8qKlxuICogQWRkIGEgY2hpbGQgdGFnIHRvIGl0cyBwYXJlbnQgaW50byB0aGUgYHRhZ3NgIG9iamVjdFxuICogQHBhcmFtICAgeyBPYmplY3QgfSB0YWcgLSBjaGlsZCB0YWcgaW5zdGFuY2VcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdGFnTmFtZSAtIGtleSB3aGVyZSB0aGUgbmV3IHRhZyB3aWxsIGJlIHN0b3JlZFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBwYXJlbnQgLSB0YWcgaW5zdGFuY2Ugd2hlcmUgdGhlIG5ldyBjaGlsZCB0YWcgd2lsbCBiZSBpbmNsdWRlZFxuICovXG5mdW5jdGlvbiBhZGRDaGlsZFRhZyh0YWcsIHRhZ05hbWUsIHBhcmVudCkge1xuICB2YXIgY2FjaGVkVGFnID0gcGFyZW50LnRhZ3NbdGFnTmFtZV1cblxuICAvLyBpZiB0aGVyZSBhcmUgbXVsdGlwbGUgY2hpbGRyZW4gdGFncyBoYXZpbmcgdGhlIHNhbWUgbmFtZVxuICBpZiAoY2FjaGVkVGFnKSB7XG4gICAgLy8gaWYgdGhlIHBhcmVudCB0YWdzIHByb3BlcnR5IGlzIG5vdCB5ZXQgYW4gYXJyYXlcbiAgICAvLyBjcmVhdGUgaXQgYWRkaW5nIHRoZSBmaXJzdCBjYWNoZWQgdGFnXG4gICAgaWYgKCFpc0FycmF5KGNhY2hlZFRhZykpXG4gICAgICAvLyBkb24ndCBhZGQgdGhlIHNhbWUgdGFnIHR3aWNlXG4gICAgICBpZiAoY2FjaGVkVGFnICE9PSB0YWcpXG4gICAgICAgIHBhcmVudC50YWdzW3RhZ05hbWVdID0gW2NhY2hlZFRhZ11cbiAgICAvLyBhZGQgdGhlIG5ldyBuZXN0ZWQgdGFnIHRvIHRoZSBhcnJheVxuICAgIGlmICghY29udGFpbnMocGFyZW50LnRhZ3NbdGFnTmFtZV0sIHRhZykpXG4gICAgICBwYXJlbnQudGFnc1t0YWdOYW1lXS5wdXNoKHRhZylcbiAgfSBlbHNlIHtcbiAgICBwYXJlbnQudGFnc1t0YWdOYW1lXSA9IHRhZ1xuICB9XG59XG5cbi8qKlxuICogTW92ZSB0aGUgcG9zaXRpb24gb2YgYSBjdXN0b20gdGFnIGluIGl0cyBwYXJlbnQgdGFnXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9IHRhZyAtIGNoaWxkIHRhZyBpbnN0YW5jZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSB0YWdOYW1lIC0ga2V5IHdoZXJlIHRoZSB0YWcgd2FzIHN0b3JlZFxuICogQHBhcmFtICAgeyBOdW1iZXIgfSBuZXdQb3MgLSBpbmRleCB3aGVyZSB0aGUgbmV3IHRhZyB3aWxsIGJlIHN0b3JlZFxuICovXG5mdW5jdGlvbiBtb3ZlQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBuZXdQb3MpIHtcbiAgdmFyIHBhcmVudCA9IHRhZy5wYXJlbnQsXG4gICAgdGFnc1xuICAvLyBubyBwYXJlbnQgbm8gbW92ZVxuICBpZiAoIXBhcmVudCkgcmV0dXJuXG5cbiAgdGFncyA9IHBhcmVudC50YWdzW3RhZ05hbWVdXG5cbiAgaWYgKGlzQXJyYXkodGFncykpXG4gICAgdGFncy5zcGxpY2UobmV3UG9zLCAwLCB0YWdzLnNwbGljZSh0YWdzLmluZGV4T2YodGFnKSwgMSlbMF0pXG4gIGVsc2UgYWRkQ2hpbGRUYWcodGFnLCB0YWdOYW1lLCBwYXJlbnQpXG59XG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IGNoaWxkIHRhZyBpbmNsdWRpbmcgaXQgY29ycmVjdGx5IGludG8gaXRzIHBhcmVudFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBjaGlsZCAtIGNoaWxkIHRhZyBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRzIC0gdGFnIG9wdGlvbnMgY29udGFpbmluZyB0aGUgRE9NIG5vZGUgd2hlcmUgdGhlIHRhZyB3aWxsIGJlIG1vdW50ZWRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gaW5uZXJIVE1MIC0gaW5uZXIgaHRtbCBvZiB0aGUgY2hpbGQgbm9kZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBwYXJlbnQgLSBpbnN0YW5jZSBvZiB0aGUgcGFyZW50IHRhZyBpbmNsdWRpbmcgdGhlIGNoaWxkIGN1c3RvbSB0YWdcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gaW5zdGFuY2Ugb2YgdGhlIG5ldyBjaGlsZCB0YWcganVzdCBjcmVhdGVkXG4gKi9cbmZ1bmN0aW9uIGluaXRDaGlsZFRhZyhjaGlsZCwgb3B0cywgaW5uZXJIVE1MLCBwYXJlbnQpIHtcbiAgdmFyIHRhZyA9IG5ldyBUYWcoY2hpbGQsIG9wdHMsIGlubmVySFRNTCksXG4gICAgdGFnTmFtZSA9IGdldFRhZ05hbWUob3B0cy5yb290KSxcbiAgICBwdGFnID0gZ2V0SW1tZWRpYXRlQ3VzdG9tUGFyZW50VGFnKHBhcmVudClcbiAgLy8gZml4IGZvciB0aGUgcGFyZW50IGF0dHJpYnV0ZSBpbiB0aGUgbG9vcGVkIGVsZW1lbnRzXG4gIHRhZy5wYXJlbnQgPSBwdGFnXG4gIC8vIHN0b3JlIHRoZSByZWFsIHBhcmVudCB0YWdcbiAgLy8gaW4gc29tZSBjYXNlcyB0aGlzIGNvdWxkIGJlIGRpZmZlcmVudCBmcm9tIHRoZSBjdXN0b20gcGFyZW50IHRhZ1xuICAvLyBmb3IgZXhhbXBsZSBpbiBuZXN0ZWQgbG9vcHNcbiAgdGFnLl9wYXJlbnQgPSBwYXJlbnRcblxuICAvLyBhZGQgdGhpcyB0YWcgdG8gdGhlIGN1c3RvbSBwYXJlbnQgdGFnXG4gIGFkZENoaWxkVGFnKHRhZywgdGFnTmFtZSwgcHRhZylcbiAgLy8gYW5kIGFsc28gdG8gdGhlIHJlYWwgcGFyZW50IHRhZ1xuICBpZiAocHRhZyAhPT0gcGFyZW50KVxuICAgIGFkZENoaWxkVGFnKHRhZywgdGFnTmFtZSwgcGFyZW50KVxuICAvLyBlbXB0eSB0aGUgY2hpbGQgbm9kZSBvbmNlIHdlIGdvdCBpdHMgdGVtcGxhdGVcbiAgLy8gdG8gYXZvaWQgdGhhdCBpdHMgY2hpbGRyZW4gZ2V0IGNvbXBpbGVkIG11bHRpcGxlIHRpbWVzXG4gIG9wdHMucm9vdC5pbm5lckhUTUwgPSAnJ1xuXG4gIHJldHVybiB0YWdcbn1cblxuLyoqXG4gKiBMb29wIGJhY2t3YXJkIGFsbCB0aGUgcGFyZW50cyB0cmVlIHRvIGRldGVjdCB0aGUgZmlyc3QgY3VzdG9tIHBhcmVudCB0YWdcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gdGFnIC0gYSBUYWcgaW5zdGFuY2VcbiAqIEByZXR1cm5zIHsgT2JqZWN0IH0gdGhlIGluc3RhbmNlIG9mIHRoZSBmaXJzdCBjdXN0b20gcGFyZW50IHRhZyBmb3VuZFxuICovXG5mdW5jdGlvbiBnZXRJbW1lZGlhdGVDdXN0b21QYXJlbnRUYWcodGFnKSB7XG4gIHZhciBwdGFnID0gdGFnXG4gIHdoaWxlICghZ2V0VGFnKHB0YWcucm9vdCkpIHtcbiAgICBpZiAoIXB0YWcucGFyZW50KSBicmVha1xuICAgIHB0YWcgPSBwdGFnLnBhcmVudFxuICB9XG4gIHJldHVybiBwdGFnXG59XG5cbi8qKlxuICogSGVscGVyIGZ1bmN0aW9uIHRvIHNldCBhbiBpbW11dGFibGUgcHJvcGVydHlcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZWwgLSBvYmplY3Qgd2hlcmUgdGhlIG5ldyBwcm9wZXJ0eSB3aWxsIGJlIHNldFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBrZXkgLSBvYmplY3Qga2V5IHdoZXJlIHRoZSBuZXcgcHJvcGVydHkgd2lsbCBiZSBzdG9yZWRcbiAqIEBwYXJhbSAgIHsgKiB9IHZhbHVlIC0gdmFsdWUgb2YgdGhlIG5ldyBwcm9wZXJ0eVxuKiBAcGFyYW0gICB7IE9iamVjdCB9IG9wdGlvbnMgLSBzZXQgdGhlIHByb3Blcnkgb3ZlcnJpZGluZyB0aGUgZGVmYXVsdCBvcHRpb25zXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IC0gdGhlIGluaXRpYWwgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGVsLCBrZXksIHZhbHVlLCBvcHRpb25zKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbCwga2V5LCBleHRlbmQoe1xuICAgIHZhbHVlOiB2YWx1ZSxcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgY29uZmlndXJhYmxlOiBmYWxzZVxuICB9LCBvcHRpb25zKSlcbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogR2V0IHRoZSB0YWcgbmFtZSBvZiBhbnkgRE9NIG5vZGVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gZG9tIC0gRE9NIG5vZGUgd2Ugd2FudCB0byBwYXJzZVxuICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lIHRvIGlkZW50aWZ5IHRoaXMgZG9tIG5vZGUgaW4gcmlvdFxuICovXG5mdW5jdGlvbiBnZXRUYWdOYW1lKGRvbSkge1xuICB2YXIgY2hpbGQgPSBnZXRUYWcoZG9tKSxcbiAgICBuYW1lZFRhZyA9IGdldEF0dHIoZG9tLCAnbmFtZScpLFxuICAgIHRhZ05hbWUgPSBuYW1lZFRhZyAmJiAhdG1wbC5oYXNFeHByKG5hbWVkVGFnKSA/XG4gICAgICAgICAgICAgICAgbmFtZWRUYWcgOlxuICAgICAgICAgICAgICBjaGlsZCA/IGNoaWxkLm5hbWUgOiBkb20udGFnTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgcmV0dXJuIHRhZ05hbWVcbn1cblxuLyoqXG4gKiBFeHRlbmQgYW55IG9iamVjdCB3aXRoIG90aGVyIHByb3BlcnRpZXNcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gc3JjIC0gc291cmNlIG9iamVjdFxuICogQHJldHVybnMgeyBPYmplY3QgfSB0aGUgcmVzdWx0aW5nIGV4dGVuZGVkIG9iamVjdFxuICpcbiAqIHZhciBvYmogPSB7IGZvbzogJ2JheicgfVxuICogZXh0ZW5kKG9iaiwge2JhcjogJ2JhcicsIGZvbzogJ2Jhcid9KVxuICogY29uc29sZS5sb2cob2JqKSA9PiB7YmFyOiAnYmFyJywgZm9vOiAnYmFyJ31cbiAqXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZChzcmMpIHtcbiAgdmFyIG9iaiwgYXJncyA9IGFyZ3VtZW50c1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3MubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAob2JqID0gYXJnc1tpXSkge1xuICAgICAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgICAgICAvLyBjaGVjayBpZiB0aGlzIHByb3BlcnR5IG9mIHRoZSBzb3VyY2Ugb2JqZWN0IGNvdWxkIGJlIG92ZXJyaWRkZW5cbiAgICAgICAgaWYgKGlzV3JpdGFibGUoc3JjLCBrZXkpKVxuICAgICAgICAgIHNyY1trZXldID0gb2JqW2tleV1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNyY1xufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYW4gYXJyYXkgY29udGFpbnMgYW4gaXRlbVxuICogQHBhcmFtICAgeyBBcnJheSB9IGFyciAtIHRhcmdldCBhcnJheVxuICogQHBhcmFtICAgeyAqIH0gaXRlbSAtIGl0ZW0gdG8gdGVzdFxuICogQHJldHVybnMgeyBCb29sZWFuIH0gRG9lcyAnYXJyJyBjb250YWluICdpdGVtJz9cbiAqL1xuZnVuY3Rpb24gY29udGFpbnMoYXJyLCBpdGVtKSB7XG4gIHJldHVybiB+YXJyLmluZGV4T2YoaXRlbSlcbn1cblxuLyoqXG4gKiBDaGVjayB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIGtpbmQgb2YgYXJyYXlcbiAqIEBwYXJhbSAgIHsgKiB9IGEgLSBhbnl0aGluZ1xuICogQHJldHVybnMge0Jvb2xlYW59IGlzICdhJyBhbiBhcnJheT9cbiAqL1xuZnVuY3Rpb24gaXNBcnJheShhKSB7IHJldHVybiBBcnJheS5pc0FycmF5KGEpIHx8IGEgaW5zdGFuY2VvZiBBcnJheSB9XG5cbi8qKlxuICogRGV0ZWN0IHdoZXRoZXIgYSBwcm9wZXJ0eSBvZiBhbiBvYmplY3QgY291bGQgYmUgb3ZlcnJpZGRlblxuICogQHBhcmFtICAgeyBPYmplY3QgfSAgb2JqIC0gc291cmNlIG9iamVjdFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAga2V5IC0gb2JqZWN0IHByb3BlcnR5XG4gKiBAcmV0dXJucyB7IEJvb2xlYW4gfSBpcyB0aGlzIHByb3BlcnR5IHdyaXRhYmxlP1xuICovXG5mdW5jdGlvbiBpc1dyaXRhYmxlKG9iaiwga2V5KSB7XG4gIHZhciBwcm9wcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBrZXkpXG4gIHJldHVybiB0eXBlb2Ygb2JqW2tleV0gPT09IFRfVU5ERUYgfHwgcHJvcHMgJiYgcHJvcHMud3JpdGFibGVcbn1cblxuXG4vKipcbiAqIFdpdGggdGhpcyBmdW5jdGlvbiB3ZSBhdm9pZCB0aGF0IHRoZSBpbnRlcm5hbCBUYWcgbWV0aG9kcyBnZXQgb3ZlcnJpZGRlblxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkYXRhIC0gb3B0aW9ucyB3ZSB3YW50IHRvIHVzZSB0byBleHRlbmQgdGhlIHRhZyBpbnN0YW5jZVxuICogQHJldHVybnMgeyBPYmplY3QgfSBjbGVhbiBvYmplY3Qgd2l0aG91dCBjb250YWluaW5nIHRoZSByaW90IGludGVybmFsIHJlc2VydmVkIHdvcmRzXG4gKi9cbmZ1bmN0aW9uIGNsZWFuVXBEYXRhKGRhdGEpIHtcbiAgaWYgKCEoZGF0YSBpbnN0YW5jZW9mIFRhZykgJiYgIShkYXRhICYmIHR5cGVvZiBkYXRhLnRyaWdnZXIgPT0gVF9GVU5DVElPTikpIHJldHVybiBkYXRhXG5cbiAgdmFyIG8gPSB7fVxuICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xuICAgIGlmICghY29udGFpbnMoUkVTRVJWRURfV09SRFNfQkxBQ0tMSVNULCBrZXkpKVxuICAgICAgb1trZXldID0gZGF0YVtrZXldXG4gIH1cbiAgcmV0dXJuIG9cbn1cblxuLyoqXG4gKiBXYWxrIGRvd24gcmVjdXJzaXZlbHkgYWxsIHRoZSBjaGlsZHJlbiB0YWdzIHN0YXJ0aW5nIGRvbSBub2RlXG4gKiBAcGFyYW0gICB7IE9iamVjdCB9ICAgZG9tIC0gc3RhcnRpbmcgbm9kZSB3aGVyZSB3ZSB3aWxsIHN0YXJ0IHRoZSByZWN1cnNpb25cbiAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIGNhbGxiYWNrIHRvIHRyYW5zZm9ybSB0aGUgY2hpbGQgbm9kZSBqdXN0IGZvdW5kXG4gKi9cbmZ1bmN0aW9uIHdhbGsoZG9tLCBmbikge1xuICBpZiAoZG9tKSB7XG4gICAgLy8gc3RvcCB0aGUgcmVjdXJzaW9uXG4gICAgaWYgKGZuKGRvbSkgPT09IGZhbHNlKSByZXR1cm5cbiAgICBlbHNlIHtcbiAgICAgIGRvbSA9IGRvbS5maXJzdENoaWxkXG5cbiAgICAgIHdoaWxlIChkb20pIHtcbiAgICAgICAgd2Fsayhkb20sIGZuKVxuICAgICAgICBkb20gPSBkb20ubmV4dFNpYmxpbmdcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBNaW5pbWl6ZSByaXNrOiBvbmx5IHplcm8gb3Igb25lIF9zcGFjZV8gYmV0d2VlbiBhdHRyICYgdmFsdWVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBodG1sIC0gaHRtbCBzdHJpbmcgd2Ugd2FudCB0byBwYXJzZVxuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gY2FsbGJhY2sgZnVuY3Rpb24gdG8gYXBwbHkgb24gYW55IGF0dHJpYnV0ZSBmb3VuZFxuICovXG5mdW5jdGlvbiB3YWxrQXR0cmlidXRlcyhodG1sLCBmbikge1xuICB2YXIgbSxcbiAgICByZSA9IC8oWy1cXHddKykgPz0gPyg/OlwiKFteXCJdKil8JyhbXiddKil8KHtbXn1dKn0pKS9nXG5cbiAgd2hpbGUgKG0gPSByZS5leGVjKGh0bWwpKSB7XG4gICAgZm4obVsxXS50b0xvd2VyQ2FzZSgpLCBtWzJdIHx8IG1bM10gfHwgbVs0XSlcbiAgfVxufVxuXG4vKipcbiAqIENoZWNrIHdoZXRoZXIgYSBET00gbm9kZSBpcyBpbiBzdHViIG1vZGUsIHVzZWZ1bCBmb3IgdGhlIHJpb3QgJ2lmJyBkaXJlY3RpdmVcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gIGRvbSAtIERPTSBub2RlIHdlIHdhbnQgdG8gcGFyc2VcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gaXNJblN0dWIoZG9tKSB7XG4gIHdoaWxlIChkb20pIHtcbiAgICBpZiAoZG9tLmluU3R1YikgcmV0dXJuIHRydWVcbiAgICBkb20gPSBkb20ucGFyZW50Tm9kZVxuICB9XG4gIHJldHVybiBmYWxzZVxufVxuXG4vKipcbiAqIENyZWF0ZSBhIGdlbmVyaWMgRE9NIG5vZGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gbmFtZSAtIG5hbWUgb2YgdGhlIERPTSBub2RlIHdlIHdhbnQgdG8gY3JlYXRlXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IERPTSBub2RlIGp1c3QgY3JlYXRlZFxuICovXG5mdW5jdGlvbiBta0VsKG5hbWUpIHtcbiAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQobmFtZSlcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBnZW5lcmljIERPTSBub2RlLCBhbmQgZmlsbCBpdCB3aXRoIGlubmVySFRNTFxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBuYW1lIC0gbmFtZSBvZiB0aGUgRE9NIG5vZGUgd2Ugd2FudCB0byBjcmVhdGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gaW5uZXJIVE1MIC0gaW5uZXJIVE1MIG9mIHRoZSBuZXcgRE9NXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IERPTSBub2RlIGp1c3QgY3JlYXRlZFxuICovXG5mdW5jdGlvbiBta0VsV2l0aElubmVySFRNTChuYW1lLCBpbm5lckhUTUwpIHtcbiAgdmFyIGVsID0gbWtFbChuYW1lKVxuICBlbC5pbm5lckhUTUwgPSBpbm5lckhUTUwgfHwgJydcbiAgcmV0dXJuIGVsXG59XG5cbi8qKlxuICogUmVwbGFjZSB0aGUgeWllbGQgdGFnIGZyb20gYW55IHRhZyB0ZW1wbGF0ZSB3aXRoIHRoZSBpbm5lckhUTUwgb2YgdGhlXG4gKiBvcmlnaW5hbCB0YWcgaW4gdGhlIHBhZ2VcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdG1wbCAtIHRhZyBpbXBsZW1lbnRhdGlvbiB0ZW1wbGF0ZVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBpbm5lckhUTUwgLSBvcmlnaW5hbCBjb250ZW50IG9mIHRoZSB0YWcgaW4gdGhlIERPTVxuICogQHJldHVybnMgeyBTdHJpbmcgfSB0YWcgdGVtcGxhdGUgdXBkYXRlZCB3aXRob3V0IHRoZSB5aWVsZCB0YWdcbiAqL1xuZnVuY3Rpb24gcmVwbGFjZVlpZWxkKHRtcGwsIGlubmVySFRNTCkge1xuICB2YXIgdG1wbEVsZW1lbnQgPSBta0VsV2l0aElubmVySFRNTCgnZGl2JywgdG1wbClcbiAgLy8gaWYgKCQoJ3lpZWxkW2Zyb21dJy50bXBsRWxlbWVudCkpIHsgLy8gdGhpcyBpc3N1ZXMgdGVzdCBlcnJvcnNcbiAgaWYgKHRtcGxFbGVtZW50LnF1ZXJ5U2VsZWN0b3IgJiYgdG1wbEVsZW1lbnQucXVlcnlTZWxlY3RvcigneWllbGRbZnJvbV0nKSkgeyAvLyBjb2RlIGNvdmVyYWdlIHBhdGggbm90IHRha2VuICg/KVxuICAgIC8vIHlpZWxkIHRvKHMpIG11c3QgYmUgZGlyZWN0IGNoaWxkcmVuIGZyb20gaW5uZXJIVE1MKHJvb3QpLCBhbGwgb3RoZXIgdGFncyBhcmUgaWdub3JlZFxuICAgIGVhY2gobWtFbFdpdGhJbm5lckhUTUwoJ2RpdicsIGlubmVySFRNTCkuY2hpbGROb2RlcywgZnVuY3Rpb24odG9ZaWVsZCkge1xuICAgICAgaWYgKHRvWWllbGQubm9kZVR5cGUgPT0gMSAmJiB0b1lpZWxkLnRhZ05hbWUgPT0gJ1lJRUxEJyAmJiB0b1lpZWxkLmdldEF0dHJpYnV0ZSgndG8nKSkge1xuICAgICAgICAvLyByZXBsYWNlIGFsbCB5aWVsZFtmcm9tXVxuICAgICAgICBlYWNoKCQkKCd5aWVsZFtmcm9tPVwiJyt0b1lpZWxkLmdldEF0dHJpYnV0ZSgndG8nKSsnXCJdJywgdG1wbEVsZW1lbnQpLCBmdW5jdGlvbihmcm9tWWllbGQpIHtcbiAgICAgICAgICBmcm9tWWllbGQub3V0ZXJIVE1MID0gdG9ZaWVsZC5pbm5lckhUTUxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiB0bXBsRWxlbWVudC5pbm5lckhUTUxcbiAgfSBlbHNlXG4gICAgLy8ganVzdCByZXBsYWNlIHlpZWxkIGluIHRtcGwgd2l0aCB0aGUgaW5uZXJIVE1MXG4gICAgcmV0dXJuIHRtcGwucmVwbGFjZSgvPHlpZWxkXFxzKig/OlxcLz58Plxccyo8XFwveWllbGRcXHMqPikvZ2ksIGlubmVySFRNTCB8fCAnJylcbn1cblxuLyoqXG4gKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgbXVsdGlwbGUgbm9kZXMgaW4gdGhlIERPTVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSBzZWxlY3RvciAtIERPTSBzZWxlY3RvclxuICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0cyBvZiBvdXIgc2VhcmNoIHdpbGwgaXMgbG9jYXRlZFxuICogQHJldHVybnMgeyBPYmplY3QgfSBkb20gbm9kZXMgZm91bmRcbiAqL1xuZnVuY3Rpb24gJCQoc2VsZWN0b3IsIGN0eCkge1xuICByZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcilcbn1cblxuLyoqXG4gKiBTaG9ydGVyIGFuZCBmYXN0IHdheSB0byBzZWxlY3QgYSBzaW5nbGUgbm9kZSBpbiB0aGUgRE9NXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNlbGVjdG9yIC0gdW5pcXVlIGRvbSBzZWxlY3RvclxuICogQHBhcmFtICAgeyBPYmplY3QgfSBjdHggLSBET00gbm9kZSB3aGVyZSB0aGUgdGFyZ2V0IG9mIG91ciBzZWFyY2ggd2lsbCBpcyBsb2NhdGVkXG4gKiBAcmV0dXJucyB7IE9iamVjdCB9IGRvbSBub2RlIGZvdW5kXG4gKi9cbmZ1bmN0aW9uICQoc2VsZWN0b3IsIGN0eCkge1xuICByZXR1cm4gKGN0eCB8fCBkb2N1bWVudCkucXVlcnlTZWxlY3RvcihzZWxlY3Rvcilcbn1cblxuLyoqXG4gKiBTaW1wbGUgb2JqZWN0IHByb3RvdHlwYWwgaW5oZXJpdGFuY2VcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gcGFyZW50IC0gcGFyZW50IG9iamVjdFxuICogQHJldHVybnMgeyBPYmplY3QgfSBjaGlsZCBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBpbmhlcml0KHBhcmVudCkge1xuICBmdW5jdGlvbiBDaGlsZCgpIHt9XG4gIENoaWxkLnByb3RvdHlwZSA9IHBhcmVudFxuICByZXR1cm4gbmV3IENoaWxkKClcbn1cblxuLyoqXG4gKiBHZXQgdGhlIG5hbWUgcHJvcGVydHkgbmVlZGVkIHRvIGlkZW50aWZ5IGEgRE9NIG5vZGUgaW4gcmlvdFxuICogQHBhcmFtICAgeyBPYmplY3QgfSBkb20gLSBET00gbm9kZSB3ZSBuZWVkIHRvIHBhcnNlXG4gKiBAcmV0dXJucyB7IFN0cmluZyB8IHVuZGVmaW5lZCB9IGdpdmUgdXMgYmFjayBhIHN0cmluZyB0byBpZGVudGlmeSB0aGlzIGRvbSBub2RlXG4gKi9cbmZ1bmN0aW9uIGdldE5hbWVkS2V5KGRvbSkge1xuICByZXR1cm4gZ2V0QXR0cihkb20sICdpZCcpIHx8IGdldEF0dHIoZG9tLCAnbmFtZScpXG59XG5cbi8qKlxuICogU2V0IHRoZSBuYW1lZCBwcm9wZXJ0aWVzIG9mIGEgdGFnIGVsZW1lbnRcbiAqIEBwYXJhbSB7IE9iamVjdCB9IGRvbSAtIERPTSBub2RlIHdlIG5lZWQgdG8gcGFyc2VcbiAqIEBwYXJhbSB7IE9iamVjdCB9IHBhcmVudCAtIHRhZyBpbnN0YW5jZSB3aGVyZSB0aGUgbmFtZWQgZG9tIGVsZW1lbnQgd2lsbCBiZSBldmVudHVhbGx5IGFkZGVkXG4gKiBAcGFyYW0geyBBcnJheSB9IGtleXMgLSBsaXN0IG9mIGFsbCB0aGUgdGFnIGluc3RhbmNlIHByb3BlcnRpZXNcbiAqL1xuZnVuY3Rpb24gc2V0TmFtZWQoZG9tLCBwYXJlbnQsIGtleXMpIHtcbiAgLy8gZ2V0IHRoZSBrZXkgdmFsdWUgd2Ugd2FudCB0byBhZGQgdG8gdGhlIHRhZyBpbnN0YW5jZVxuICB2YXIga2V5ID0gZ2V0TmFtZWRLZXkoZG9tKSxcbiAgICAvLyBhZGQgdGhlIG5vZGUgZGV0ZWN0ZWQgdG8gYSB0YWcgaW5zdGFuY2UgdXNpbmcgdGhlIG5hbWVkIHByb3BlcnR5XG4gICAgYWRkID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIC8vIGF2b2lkIHRvIG92ZXJyaWRlIHRoZSB0YWcgcHJvcGVydGllcyBhbHJlYWR5IHNldFxuICAgICAgaWYgKGNvbnRhaW5zKGtleXMsIGtleSkpIHJldHVyblxuICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGlzIHZhbHVlIGlzIGFuIGFycmF5XG4gICAgICB2YXIgaXNBcnIgPSBpc0FycmF5KHZhbHVlKVxuICAgICAgLy8gaWYgdGhlIGtleSB3YXMgbmV2ZXIgc2V0XG4gICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAvLyBzZXQgaXQgb25jZSBvbiB0aGUgdGFnIGluc3RhbmNlXG4gICAgICAgIHBhcmVudFtrZXldID0gZG9tXG4gICAgICAvLyBpZiBpdCB3YXMgYW4gYXJyYXkgYW5kIG5vdCB5ZXQgc2V0XG4gICAgICBlbHNlIGlmICghaXNBcnIgfHwgaXNBcnIgJiYgIWNvbnRhaW5zKHZhbHVlLCBkb20pKSB7XG4gICAgICAgIC8vIGFkZCB0aGUgZG9tIG5vZGUgaW50byB0aGUgYXJyYXlcbiAgICAgICAgaWYgKGlzQXJyKVxuICAgICAgICAgIHZhbHVlLnB1c2goZG9tKVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcGFyZW50W2tleV0gPSBbdmFsdWUsIGRvbV1cbiAgICAgIH1cbiAgICB9XG5cbiAgLy8gc2tpcCB0aGUgZWxlbWVudHMgd2l0aCBubyBuYW1lZCBwcm9wZXJ0aWVzXG4gIGlmICgha2V5KSByZXR1cm5cblxuICAvLyBjaGVjayB3aGV0aGVyIHRoaXMga2V5IGhhcyBiZWVuIGFscmVhZHkgZXZhbHVhdGVkXG4gIGlmICh0bXBsLmhhc0V4cHIoa2V5KSlcbiAgICAvLyB3YWl0IHRoZSBmaXJzdCB1cGRhdGVkIGV2ZW50IG9ubHkgb25jZVxuICAgIHBhcmVudC5vbmUoJ3VwZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGtleSA9IGdldE5hbWVkS2V5KGRvbSlcbiAgICAgIGFkZChwYXJlbnRba2V5XSlcbiAgICB9KVxuICBlbHNlXG4gICAgYWRkKHBhcmVudFtrZXldKVxuXG59XG5cbi8qKlxuICogRmFzdGVyIFN0cmluZyBzdGFydHNXaXRoIGFsdGVybmF0aXZlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHNyYyAtIHNvdXJjZSBzdHJpbmdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc3RyIC0gdGVzdCBzdHJpbmdcbiAqIEByZXR1cm5zIHsgQm9vbGVhbiB9IC1cbiAqL1xuZnVuY3Rpb24gc3RhcnRzV2l0aChzcmMsIHN0cikge1xuICByZXR1cm4gc3JjLnNsaWNlKDAsIHN0ci5sZW5ndGgpID09PSBzdHJcbn1cblxuLyoqXG4gKiBGdW5jdGlvbiBuZWVkZWQgdG8gaW5qZWN0IGluIHJ1bnRpbWUgdGhlIGN1c3RvbSB0YWdzIGNzc1xuICovXG52YXIgaW5qZWN0U3R5bGUgPSAoZnVuY3Rpb24oKSB7XG5cbiAgaWYgKCF3aW5kb3cpIHJldHVybiAvLyBza2lwIGluamVjdGlvbiBvbiB0aGUgc2VydmVyXG5cbiAgLy8gY3JlYXRlIHRoZSBzdHlsZSBub2RlXG4gIHZhciBzdHlsZU5vZGUgPSBta0VsKCdzdHlsZScpLFxuICAgIHBsYWNlaG9sZGVyID0gJCgnc3R5bGVbdHlwZT1yaW90XScpXG5cbiAgc2V0QXR0cihzdHlsZU5vZGUsICd0eXBlJywgJ3RleHQvY3NzJylcblxuICAvLyBpbmplY3QgdGhlIG5ldyBub2RlIGludG8gdGhlIERPTSAtLSBpbiBoZWFkXG4gIGlmIChwbGFjZWhvbGRlcikge1xuICAgIHBsYWNlaG9sZGVyLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHN0eWxlTm9kZSwgcGxhY2Vob2xkZXIpXG4gICAgcGxhY2Vob2xkZXIgPSBudWxsXG4gIH1cbiAgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHN0eWxlTm9kZSlcblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgZnVuY3Rpb24gZXhwb3J0ZWQgdGhhdCB3aWxsIGJlIHVzZWQgdG8gdXBkYXRlIHRoZSBzdHlsZSB0YWcganVzdCBjcmVhdGVkXG4gICAqIGlubmVySFRNTCBzZWVtcyBzbG93OiBodHRwOi8vanNwZXJmLmNvbS9yaW90LWluc2VydC1zdHlsZVxuICAgKiBAcGFyYW0gICB7IFN0cmluZyB9IGNzcyBbZGVzY3JpcHRpb25dXG4gICAqL1xuICByZXR1cm4gc3R5bGVOb2RlLnN0eWxlU2hlZXQgP1xuICAgIGZ1bmN0aW9uIChjc3MpIHsgc3R5bGVOb2RlLnN0eWxlU2hlZXQuY3NzVGV4dCArPSBjc3MgfSA6XG4gICAgZnVuY3Rpb24gKGNzcykgeyBzdHlsZU5vZGUuaW5uZXJIVE1MICs9IGNzcyB9XG5cbn0pKClcblxuLyoqXG4gKiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgcG9seWZpbGxcbiAqL1xudmFyIHJBRiA9IChmdW5jdGlvbih3KSB7XG4gIHJldHVybiAgdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgICAgICAgfHxcbiAgICAgICAgICB3LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgIHcubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lICAgIHx8XG4gICAgICAgICAgZnVuY3Rpb24oY2IpIHsgc2V0VGltZW91dChjYiwgMTAwMCAvIDYwKSB9XG59KSh3aW5kb3cgfHwge30pXG5cbi8qKlxuICogTW91bnQgYSB0YWcgY3JlYXRpbmcgbmV3IFRhZyBpbnN0YW5jZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSByb290IC0gZG9tIG5vZGUgd2hlcmUgdGhlIHRhZyB3aWxsIGJlIG1vdW50ZWRcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gdGFnTmFtZSAtIG5hbWUgb2YgdGhlIHJpb3QgdGFnIHdlIHdhbnQgdG8gbW91bnRcbiAqIEBwYXJhbSAgIHsgT2JqZWN0IH0gb3B0cyAtIG9wdGlvbnMgdG8gcGFzcyB0byB0aGUgVGFnIGluc3RhbmNlXG4gKiBAcmV0dXJucyB7IFRhZyB9IGEgbmV3IFRhZyBpbnN0YW5jZVxuICovXG5mdW5jdGlvbiBtb3VudFRvKHJvb3QsIHRhZ05hbWUsIG9wdHMpIHtcbiAgdmFyIHRhZyA9IF9fdGFnSW1wbFt0YWdOYW1lXSxcbiAgICAvLyBjYWNoZSB0aGUgaW5uZXIgSFRNTCB0byBmaXggIzg1NVxuICAgIGlubmVySFRNTCA9IHJvb3QuX2lubmVySFRNTCA9IHJvb3QuX2lubmVySFRNTCB8fCByb290LmlubmVySFRNTFxuXG4gIC8vIGNsZWFyIHRoZSBpbm5lciBodG1sXG4gIHJvb3QuaW5uZXJIVE1MID0gJydcblxuICBpZiAodGFnICYmIHJvb3QpIHRhZyA9IG5ldyBUYWcodGFnLCB7IHJvb3Q6IHJvb3QsIG9wdHM6IG9wdHMgfSwgaW5uZXJIVE1MKVxuXG4gIGlmICh0YWcgJiYgdGFnLm1vdW50KSB7XG4gICAgdGFnLm1vdW50KClcbiAgICAvLyBhZGQgdGhpcyB0YWcgdG8gdGhlIHZpcnR1YWxEb20gdmFyaWFibGVcbiAgICBpZiAoIWNvbnRhaW5zKF9fdmlydHVhbERvbSwgdGFnKSkgX192aXJ0dWFsRG9tLnB1c2godGFnKVxuICB9XG5cbiAgcmV0dXJuIHRhZ1xufVxuLyoqXG4gKiBSaW90IHB1YmxpYyBhcGlcbiAqL1xuXG4vLyBzaGFyZSBtZXRob2RzIGZvciBvdGhlciByaW90IHBhcnRzLCBlLmcuIGNvbXBpbGVyXG5yaW90LnV0aWwgPSB7IGJyYWNrZXRzOiBicmFja2V0cywgdG1wbDogdG1wbCB9XG5cbi8qKlxuICogQ3JlYXRlIGEgbWl4aW4gdGhhdCBjb3VsZCBiZSBnbG9iYWxseSBzaGFyZWQgYWNyb3NzIGFsbCB0aGUgdGFnc1xuICovXG5yaW90Lm1peGluID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgbWl4aW5zID0ge31cblxuICAvKipcbiAgICogQ3JlYXRlL1JldHVybiBhIG1peGluIGJ5IGl0cyBuYW1lXG4gICAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gbmFtZSAtIG1peGluIG5hbWVcbiAgICogQHBhcmFtICAgeyBPYmplY3QgfSBtaXhpbiAtIG1peGluIGxvZ2ljXG4gICAqIEByZXR1cm5zIHsgT2JqZWN0IH0gdGhlIG1peGluIGxvZ2ljXG4gICAqL1xuICByZXR1cm4gZnVuY3Rpb24obmFtZSwgbWl4aW4pIHtcbiAgICBpZiAoIW1peGluKSByZXR1cm4gbWl4aW5zW25hbWVdXG4gICAgbWl4aW5zW25hbWVdID0gbWl4aW5cbiAgfVxuXG59KSgpXG5cbi8qKlxuICogQ3JlYXRlIGEgbmV3IHJpb3QgdGFnIGltcGxlbWVudGF0aW9uXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgbmFtZSAtIG5hbWUvaWQgb2YgdGhlIG5ldyByaW90IHRhZ1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGh0bWwgLSB0YWcgdGVtcGxhdGVcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBjc3MgLSBjdXN0b20gdGFnIGNzc1xuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIGF0dHJzIC0gcm9vdCB0YWcgYXR0cmlidXRlc1xuICogQHBhcmFtICAgeyBGdW5jdGlvbiB9IGZuIC0gdXNlciBmdW5jdGlvblxuICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lL2lkIG9mIHRoZSB0YWcganVzdCBjcmVhdGVkXG4gKi9cbnJpb3QudGFnID0gZnVuY3Rpb24obmFtZSwgaHRtbCwgY3NzLCBhdHRycywgZm4pIHtcbiAgaWYgKGlzRnVuY3Rpb24oYXR0cnMpKSB7XG4gICAgZm4gPSBhdHRyc1xuICAgIGlmICgvXltcXHdcXC1dK1xccz89Ly50ZXN0KGNzcykpIHtcbiAgICAgIGF0dHJzID0gY3NzXG4gICAgICBjc3MgPSAnJ1xuICAgIH0gZWxzZSBhdHRycyA9ICcnXG4gIH1cbiAgaWYgKGNzcykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNzcykpIGZuID0gY3NzXG4gICAgZWxzZSBpZiAoaW5qZWN0U3R5bGUpIGluamVjdFN0eWxlKGNzcylcbiAgfVxuICBfX3RhZ0ltcGxbbmFtZV0gPSB7IG5hbWU6IG5hbWUsIHRtcGw6IGh0bWwsIGF0dHJzOiBhdHRycywgZm46IGZuIH1cbiAgcmV0dXJuIG5hbWVcbn1cblxuLyoqXG4gKiBDcmVhdGUgYSBuZXcgcmlvdCB0YWcgaW1wbGVtZW50YXRpb24gKGZvciB1c2UgYnkgdGhlIGNvbXBpbGVyKVxuICogQHBhcmFtICAgeyBTdHJpbmcgfSAgIG5hbWUgLSBuYW1lL2lkIG9mIHRoZSBuZXcgcmlvdCB0YWdcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBodG1sIC0gdGFnIHRlbXBsYXRlXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9ICAgY3NzIC0gY3VzdG9tIHRhZyBjc3NcbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gICBhdHRycyAtIHJvb3QgdGFnIGF0dHJpYnV0ZXNcbiAqIEBwYXJhbSAgIHsgRnVuY3Rpb24gfSBmbiAtIHVzZXIgZnVuY3Rpb25cbiAqIEBwYXJhbSAgIHsgc3RyaW5nIH0gIFticGFpcl0gLSBicmFja2V0cyB1c2VkIGluIHRoZSBjb21waWxhdGlvblxuICogQHJldHVybnMgeyBTdHJpbmcgfSBuYW1lL2lkIG9mIHRoZSB0YWcganVzdCBjcmVhdGVkXG4gKi9cbnJpb3QudGFnMiA9IGZ1bmN0aW9uKG5hbWUsIGh0bWwsIGNzcywgYXR0cnMsIGZuLCBicGFpcikge1xuICBpZiAoY3NzICYmIGluamVjdFN0eWxlKSBpbmplY3RTdHlsZShjc3MpXG4gIC8vaWYgKGJwYWlyKSByaW90LnNldHRpbmdzLmJyYWNrZXRzID0gYnBhaXJcbiAgX190YWdJbXBsW25hbWVdID0geyBuYW1lOiBuYW1lLCB0bXBsOiBodG1sLCBhdHRyczogYXR0cnMsIGZuOiBmbiB9XG4gIHJldHVybiBuYW1lXG59XG5cbi8qKlxuICogTW91bnQgYSB0YWcgdXNpbmcgYSBzcGVjaWZpYyB0YWcgaW1wbGVtZW50YXRpb25cbiAqIEBwYXJhbSAgIHsgU3RyaW5nIH0gc2VsZWN0b3IgLSB0YWcgRE9NIHNlbGVjdG9yXG4gKiBAcGFyYW0gICB7IFN0cmluZyB9IHRhZ05hbWUgLSB0YWcgaW1wbGVtZW50YXRpb24gbmFtZVxuICogQHBhcmFtICAgeyBPYmplY3QgfSBvcHRzIC0gdGFnIGxvZ2ljXG4gKiBAcmV0dXJucyB7IEFycmF5IH0gbmV3IHRhZ3MgaW5zdGFuY2VzXG4gKi9cbnJpb3QubW91bnQgPSBmdW5jdGlvbihzZWxlY3RvciwgdGFnTmFtZSwgb3B0cykge1xuXG4gIHZhciBlbHMsXG4gICAgYWxsVGFncyxcbiAgICB0YWdzID0gW11cblxuICAvLyBoZWxwZXIgZnVuY3Rpb25zXG5cbiAgZnVuY3Rpb24gYWRkUmlvdFRhZ3MoYXJyKSB7XG4gICAgdmFyIGxpc3QgPSAnJ1xuICAgIGVhY2goYXJyLCBmdW5jdGlvbiAoZSkge1xuICAgICAgbGlzdCArPSAnLCAqWycgKyBSSU9UX1RBRyArICc9XCInICsgZS50cmltKCkgKyAnXCJdJ1xuICAgIH0pXG4gICAgcmV0dXJuIGxpc3RcbiAgfVxuXG4gIGZ1bmN0aW9uIHNlbGVjdEFsbFRhZ3MoKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhfX3RhZ0ltcGwpXG4gICAgcmV0dXJuIGtleXMgKyBhZGRSaW90VGFncyhrZXlzKVxuICB9XG5cbiAgZnVuY3Rpb24gcHVzaFRhZ3Mocm9vdCkge1xuICAgIHZhciBsYXN0XG5cbiAgICBpZiAocm9vdC50YWdOYW1lKSB7XG4gICAgICBpZiAodGFnTmFtZSAmJiAoIShsYXN0ID0gZ2V0QXR0cihyb290LCBSSU9UX1RBRykpIHx8IGxhc3QgIT0gdGFnTmFtZSkpXG4gICAgICAgIHNldEF0dHIocm9vdCwgUklPVF9UQUcsIHRhZ05hbWUpXG5cbiAgICAgIHZhciB0YWcgPSBtb3VudFRvKHJvb3QsIHRhZ05hbWUgfHwgcm9vdC5nZXRBdHRyaWJ1dGUoUklPVF9UQUcpIHx8IHJvb3QudGFnTmFtZS50b0xvd2VyQ2FzZSgpLCBvcHRzKVxuXG4gICAgICBpZiAodGFnKSB0YWdzLnB1c2godGFnKVxuICAgIH0gZWxzZSBpZiAocm9vdC5sZW5ndGgpXG4gICAgICBlYWNoKHJvb3QsIHB1c2hUYWdzKSAgIC8vIGFzc3VtZSBub2RlTGlzdFxuXG4gIH1cblxuICAvLyAtLS0tLSBtb3VudCBjb2RlIC0tLS0tXG5cbiAgaWYgKHR5cGVvZiB0YWdOYW1lID09PSBUX09CSkVDVCkge1xuICAgIG9wdHMgPSB0YWdOYW1lXG4gICAgdGFnTmFtZSA9IDBcbiAgfVxuXG4gIC8vIGNyYXdsIHRoZSBET00gdG8gZmluZCB0aGUgdGFnXG4gIGlmICh0eXBlb2Ygc2VsZWN0b3IgPT09IFRfU1RSSU5HKSB7XG4gICAgaWYgKHNlbGVjdG9yID09PSAnKicpXG4gICAgICAvLyBzZWxlY3QgYWxsIHRoZSB0YWdzIHJlZ2lzdGVyZWRcbiAgICAgIC8vIGFuZCBhbHNvIHRoZSB0YWdzIGZvdW5kIHdpdGggdGhlIHJpb3QtdGFnIGF0dHJpYnV0ZSBzZXRcbiAgICAgIHNlbGVjdG9yID0gYWxsVGFncyA9IHNlbGVjdEFsbFRhZ3MoKVxuICAgIGVsc2VcbiAgICAgIC8vIG9yIGp1c3QgdGhlIG9uZXMgbmFtZWQgbGlrZSB0aGUgc2VsZWN0b3JcbiAgICAgIHNlbGVjdG9yICs9IGFkZFJpb3RUYWdzKHNlbGVjdG9yLnNwbGl0KCcsJykpXG5cbiAgICAvLyBtYWtlIHN1cmUgdG8gcGFzcyBhbHdheXMgYSBzZWxlY3RvclxuICAgIC8vIHRvIHRoZSBxdWVyeVNlbGVjdG9yQWxsIGZ1bmN0aW9uXG4gICAgZWxzID0gc2VsZWN0b3IgPyAkJChzZWxlY3RvcikgOiBbXVxuICB9XG4gIGVsc2VcbiAgICAvLyBwcm9iYWJseSB5b3UgaGF2ZSBwYXNzZWQgYWxyZWFkeSBhIHRhZyBvciBhIE5vZGVMaXN0XG4gICAgZWxzID0gc2VsZWN0b3JcblxuICAvLyBzZWxlY3QgYWxsIHRoZSByZWdpc3RlcmVkIGFuZCBtb3VudCB0aGVtIGluc2lkZSB0aGVpciByb290IGVsZW1lbnRzXG4gIGlmICh0YWdOYW1lID09PSAnKicpIHtcbiAgICAvLyBnZXQgYWxsIGN1c3RvbSB0YWdzXG4gICAgdGFnTmFtZSA9IGFsbFRhZ3MgfHwgc2VsZWN0QWxsVGFncygpXG4gICAgLy8gaWYgdGhlIHJvb3QgZWxzIGl0J3MganVzdCBhIHNpbmdsZSB0YWdcbiAgICBpZiAoZWxzLnRhZ05hbWUpXG4gICAgICBlbHMgPSAkJCh0YWdOYW1lLCBlbHMpXG4gICAgZWxzZSB7XG4gICAgICAvLyBzZWxlY3QgYWxsIHRoZSBjaGlsZHJlbiBmb3IgYWxsIHRoZSBkaWZmZXJlbnQgcm9vdCBlbGVtZW50c1xuICAgICAgdmFyIG5vZGVMaXN0ID0gW11cbiAgICAgIGVhY2goZWxzLCBmdW5jdGlvbiAoX2VsKSB7XG4gICAgICAgIG5vZGVMaXN0LnB1c2goJCQodGFnTmFtZSwgX2VsKSlcbiAgICAgIH0pXG4gICAgICBlbHMgPSBub2RlTGlzdFxuICAgIH1cbiAgICAvLyBnZXQgcmlkIG9mIHRoZSB0YWdOYW1lXG4gICAgdGFnTmFtZSA9IDBcbiAgfVxuXG4gIGlmIChlbHMudGFnTmFtZSlcbiAgICBwdXNoVGFncyhlbHMpXG4gIGVsc2VcbiAgICBlYWNoKGVscywgcHVzaFRhZ3MpXG5cbiAgcmV0dXJuIHRhZ3Ncbn1cblxuLyoqXG4gKiBVcGRhdGUgYWxsIHRoZSB0YWdzIGluc3RhbmNlcyBjcmVhdGVkXG4gKiBAcmV0dXJucyB7IEFycmF5IH0gYWxsIHRoZSB0YWdzIGluc3RhbmNlc1xuICovXG5yaW90LnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZWFjaChfX3ZpcnR1YWxEb20sIGZ1bmN0aW9uKHRhZykge1xuICAgIHRhZy51cGRhdGUoKVxuICB9KVxufVxuXG4vKipcbiAqIEV4cG9ydCB0aGUgVGFnIGNvbnN0cnVjdG9yXG4gKi9cbnJpb3QuVGFnID0gVGFnXG4gIC8vIHN1cHBvcnQgQ29tbW9uSlMsIEFNRCAmIGJyb3dzZXJcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKHR5cGVvZiBleHBvcnRzID09PSBUX09CSkVDVClcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJpb3RcbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gVF9GVU5DVElPTiAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gVF9VTkRFRilcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiAod2luZG93LnJpb3QgPSByaW90KSB9KVxuICBlbHNlXG4gICAgd2luZG93LnJpb3QgPSByaW90XG5cbn0pKHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cgOiB2b2lkIDApO1xuIl19
