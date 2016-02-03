import * as ENV from './Defaults/System.es6'

try {
    self.window = self.window || {}
    self.document = self.document || {documentElement: {style: {}}, location: {}}
} catch(e){}

let IS_WORKER = self.document && self.document.querySelector ? '' : ' W'

self.cl = function(...args){
    ENV.DEBUG && console.log(IS_WORKER, ...args)
}

self.cw = function(...args){
    ENV.DEBUG && console.warn(IS_WORKER, ...args)
}

self.ce = function(...args){
    ENV.DEBUG && console.error(IS_WORKER, ...args)
}

self.ci = function(...args){
    ENV.DEBUG && console.info(IS_WORKER, ...args)
}

self.ct = function(...args){
    ENV.DEBUG && console.trace(IS_WORKER, ...args)
}

self.cci = 1
self.cc = function(num){
    self.cci = num || self.cci
    ENV.DEBUG && console.trace(self.cci++)
}