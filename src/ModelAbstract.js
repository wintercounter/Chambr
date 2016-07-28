import Observable from 'riot-observable'
import { ACTION_SIMPLE_DEL, ACTION_SIMPLE_SET, ACTION_COMPLEX} from './Storage'

// Privates
export const _buffer   = Symbol()
const _bufferTimeout   = Symbol()
const _initBuffer      = Symbol()
const _broadcast       = Symbol()

/**
 * Abstract class for Models
 */
export default class ModelAbstract {

    /**
     * The model data itself.
     * @type {*}
     */
    data = undefined

    /**
     *
     * @param {*} data Default model data
     * @constructor
     */
    constructor(data = []){

        // Make it observable
        Observable(this)

        // Save
        this.data = data

        // Initialize action buffer
        this[_initBuffer]()

        // Subscribe to every model event
        this.on('*', (name, data) => {

            // Handle @Trigger decorator
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

    /**
     * Triggers/broadcasts events to GUI
     *
     * @param name
     * @param data
     * @private
     */
    [_broadcast](name, data = undefined){
        let Chambr = this.constructor.__proto__
        while (Chambr.name !== 'ModelAbstract') {
            Chambr = Chambr.__proto__
        }
        Chambr = Chambr.Chambr
        Chambr.resolve(`ChambrClient->${this.constructor.name}->Event`, -1, data, name)
    }

    /**
     * Initializes action buffer
     * We will collect different actions
     * to not execute them one-by-one.
     *
     * @private
     */
    [_initBuffer](){
        let buffer = this[_buffer] = new Set()
        if (this.data !== undefined && this.data.on) {
            this.data.on(`${ACTION_SIMPLE_DEL} ${ACTION_SIMPLE_SET} ${ACTION_COMPLEX}`, (...args) => {
                clearTimeout(this[_bufferTimeout])
                buffer.add(args)
                this[_bufferTimeout] = setTimeout(buffer.clear, 0)
            })
        }
    }
}