import Chambr from './Worker'
import Observable from 'riot-observable'
import { ACTION_SIMPLE, ACTION_COMPLEX} from './Storage'

const _actionBuffer = Symbol()

export default class ModelAbstract {

    set modelData(o){
        this._data = o
    }

    get modelData(){
        return this._data
    }

    constructor(){
        Observable(this)
        this[_actionBuffer] = new Set()
        this.modelData = this.constructor.DefaultData
        (this.modelData !== undefined) && this.modelData.on(`${ACTION_SIMPLE} ${ACTION_COMPLEX}`, ...args => {

        })
        this.on('*', (name, data) => {
            let onTriggers = this._onTriggerEventHandlers ? this._onTriggerEventHandlers[name] : false
            let promises = []
            onTriggers && onTriggers.forEach(method => {
                let p = this[method].call(this, name, data)
                p.then && promises.push(p)
            })

            if (promises.length) {
                Promise.all(promises).then(() => this.broadcast(name, data, false))
            }
            else {
                this.broadcast(name, data)
            }
        })
    }

    // TODO to private
    broadcast(name, data = undefined, soft = true){
        Chambr.Resolve(`ChambrClient->${this.constructor.name}->Event`, -1, this.modelData, Chambr.Export(this), data, soft, name)
    }

    resolve(data = undefined, soft = false, state = 'resolve'){
        return Promise.resolve({data, soft, state})
    }

    reject(data = undefined, soft = true, state = 'reject'){
        return Promise.reject({data, soft, state})
    }

}