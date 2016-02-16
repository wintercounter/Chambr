import Observable from 'riot-observable'
import { registerHelper, handlerHelper, buildRoute } from './Utils.Shared.es6'
import * as C from './_Constants.Shared.es6'

const Handlers = {}
const DEBUG_EVENTS = true

export default class Abstract {

    constructor(){
        Observable(this)
        self.GW = this
    }

    register(name, handler){
        registerHelper(name, handler, Handlers)
    }

    parse(input){
        let segments = input.split(C.EVENT_DELIMITER)
        let last = segments[segments.length - 1]
        let silent = !last.split('::::')[1]
        let state = last.split('::::')[1] || last.split('::')[1] || false

        state && (segments[segments.length - 1] = last.split('::')[0])

        return {segments, state, silent}
    }

    build(...arg){
        return buildRoute(...arg)
    }

    sub(name, handler){
        name = this.build(name)
        this.on(name, handler)
    }

    pub(name, data, skipPost){
        name = this.build(name)
        if (!skipPost && !self.document.querySelector) {
            self.postMessage({name, data})
        }
        else if(!skipPost){
            this.Worker.postMessage({name, data})
        }
        this.trigger(name, data)
    }

    handle(ev){
        ci(`Event: ${ev.name}`)
        this.pub(ev.name, ev.data, true)
        handlerHelper(Handlers, ev)
    }
}