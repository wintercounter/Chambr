import Chambr from './Worker'
import Observable from 'riot-observable'
import { ACTION_SIMPLE_DEL, ACTION_SIMPLE_SET, ACTION_COMPLEX} from './Storage'

// Privates
const _actionBuffer    = Symbol()
const _bufferTimeout   = Symbol()
const _initBuffer      = Symbol()
const _broadcast       = Symbol()
const _broadcastUpdate = Symbol()

export default class ModelAbstract {
    
    data = undefined

    constructor(data = []){
        this.data = data
        Observable(this)
        this[_initBuffer]()
        this.on('*', (name, data) => {
            let onTriggers = this._onTriggerEventHandlers ? this._onTriggerEventHandlers[name] : false
            let promises = []
            onTriggers && onTriggers.forEach(method => {
                let p = this[method].call(this, name, data)
                p && p.then && promises.push(p)
            })

            if (promises.length) {
                Promise.all(promises).then(() => this[_broadcast](name, data))
            }
            else {
                this[_broadcast](name, data)
            }
        })
    }

    [_broadcast](name, data = undefined){
        Chambr.Resolve(`ChambrClient->${this.constructor.name}->Event`, -1, data, name)
    }

    [_initBuffer](){
        this.buffer = new Set()
        if (this.data !== undefined && this.data.on) {
            this.data.on(`${ACTION_SIMPLE_DEL} ${ACTION_SIMPLE_SET} ${ACTION_COMPLEX}`, (...args) => {
                clearTimeout(this[_bufferTimeout])
                this.buffer.add(args)
                this[_bufferTimeout] = setTimeout(() => this.buffer.clear(), 0)
            })
        }
    }

    [_broadcastUpdate](){

    }

}