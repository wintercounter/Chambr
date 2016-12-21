'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _pouchdb = require('pouchdb');

var _pouchdb2 = _interopRequireDefault(_pouchdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULTS = {
    // Customize db
    name: '', // Will be overwritten
    remote: 'http://localhost:5984/',

    // Local options
    auto_compaction: false,
    adapter: undefined, // auto

    //Ajax options
    ajax: {
        timeout: 10000,
        cache: false,
        headers: undefined,
        withCredentials: false
    },

    // Auth
    /*auth: {
     username: undefined,
     password: undefined
     },*/

    // Custom
    sync: false,
    watch: true,
    local: true
};

var C = {
    CHANGE: 'change',
    COMPLETE: 'complete',
    ERROR: 'error',
    NOW: 'now',

    // Only at replication and sync
    DENIED: 'denied',
    ACTIVE: 'active',
    PAUSED: 'paused'
};

var C_PREFIXED = {
    CHANGE: 'couchdb-change',
    COMPLETE: 'couchdb-complete',
    ERROR: 'couchdb-error',
    NOW: 'couchdb-now',

    // Only at replication and sync
    DENIED: 'couchdb-denied',
    ACTIVE: 'couchdb-active',
    PAUSED: 'couchdb-paused'
};

var DB = function () {
    _createClass(DB, null, [{
        key: 'EVENT',
        get: function get() {
            return C_PREFIXED;
        }
    }]);

    function DB(host) {
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, DB);

        this.host = host;
        this.config = _extends(DEFAULTS, config);
        this.validateConfig();
        this.connect();
    }

    _createClass(DB, [{
        key: 'connect',
        value: function connect() {
            if (this.config.local) {
                this.local = new _pouchdb2.default(this.getUrl(), this.config);
            }
            if (this.config.remote) {
                this.remote = new _pouchdb2.default(this.getUrl(true), this.config);
            }
            this.config.sync && this.startSync();
            this.config.watch && this.watch();
        }
    }, {
        key: 'validateConfig',
        value: function validateConfig() {
            if (!this.config.name) throw new Error('Database name has not been set!');
        }
    }, {
        key: 'getUrl',
        value: function getUrl() {
            var remote = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

            return remote ? this.config.name : this.config.remote + this.config.name;
        }
    }, {
        key: 'watch',
        value: function watch() {
            if (!this.sync && !this.changes) {
                this.changes = this.DB.changes({
                    since: C.NOW,
                    live: true
                }).on(C.CHANGE, function (ev) {
                    //this.trigger(ev)
                }).on(C.COMPLETE, function (ev) {
                    //this.trigger(ev)
                }).on(C.ERROR, function (ev) {
                    //this.trigger(ev)
                });
            }
        }
    }, {
        key: 'unwatch',
        value: function unwatch() {
            if (this.changes) {
                this.changes.cancel();
                this.changes = undefined;
            }
        }
    }, {
        key: 'startSync',
        value: function startSync() {
            var _this = this;

            !this.sync && (this.sync = this.local.sync(this.remote, {
                live: true,
                retry: true
            })
            // Some change happened in the database
            .on(C.CHANGE, function (info) {
                _this.host.trigger(DB.EVENT.CHANGE);
            }));

            /*.on(C.PAUSED, function () {
             // replication paused (e.g. user went offline)
             //ce(arguments)
             })
             .on(C.ACTIVE, function () {
             // replicate resumed (e.g. user went back online)
             //ce(arguments)
             })
             .on(C.DENIED, function (info) {
             // a document failed to replicate, e.g. due to permissions
             ce(arguments)
             })
             .on(C.COMPLETE, function (info) {
             // handle complete
             //ce(arguments)
             })
             .on(C.ERROR, function (err) {
             // handle error
             console.log('errored', arguments)
             })
             .on('abort', function(){
             console.log('aborted')
             }))*/
        }
    }, {
        key: 'stopSync',
        value: function stopSync() {
            if (this.sync) {
                this.sync.cancel();
                this.sync = undefined;
            }
        }
    }]);

    return DB;
}();

exports.default = DB;