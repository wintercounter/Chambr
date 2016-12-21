import PDB from 'pouchdb'

const DEFAULTS = {
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
}

const C = {
    CHANGE:   'change',
    COMPLETE: 'complete',
    ERROR:    'error',
    NOW:      'now',

    // Only at replication and sync
    DENIED: 'denied',
    ACTIVE: 'active',
    PAUSED: 'paused'
}

const C_PREFIXED = {
    CHANGE:   'couchdb-change',
    COMPLETE: 'couchdb-complete',
    ERROR:    'couchdb-error',
    NOW:      'couchdb-now',

    // Only at replication and sync
    DENIED: 'couchdb-denied',
    ACTIVE: 'couchdb-active',
    PAUSED: 'couchdb-paused'
}

export default class DB {

    remote;
    local;
    config;
    sync;
    changes;
    host;

    static get EVENT(){
        return C_PREFIXED
    }

    constructor(host, config = {}){
        this.host = host
        this.config = Object.assign(DEFAULTS, config)
        this.validateConfig()
        this.connect()
    }

    connect(){
        if (this.config.local) {
            this.local = new PDB(this.getUrl(), this.config)
        }
        if (this.config.remote) {
            this.remote = new PDB(this.getUrl(true), this.config)
        }
        this.config.sync && this.startSync()
        this.config.watch && this.watch()
    }

    validateConfig(){
        if (!this.config.name) throw new Error('Database name has not been set!')
    }

    getUrl(remote = false){
        return remote
            ? this.config.name
            : this.config.remote + this.config.name
    }

    watch(){
        if(!this.sync && !this.changes) {
            this.changes = this.DB.changes({
                since: C.NOW,
                live: true
            })
                .on(C.CHANGE, (ev) => {
                    //this.trigger(ev)
                })
                .on(C.COMPLETE, (ev) => {
                    //this.trigger(ev)
                })
                .on(C.ERROR, (ev) => {
                    //this.trigger(ev)
                })
        }
    }

    unwatch(){
        if (this.changes){
            this.changes.cancel()
            this.changes = undefined
        }
    }

    startSync(){
        !this.sync
        && (this.sync = this.local.sync(this.remote, {
            live: true,
            retry: true
        })
        // Some change happened in the database
            .on(C.CHANGE, info => {
                this.host.trigger(DB.EVENT.CHANGE)
            }))

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

    stopSync(){
        if (this.sync) {
            this.sync.cancel()
            this.sync = undefined
        }
    }
}