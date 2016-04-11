import Chambr from './Worker.es6'
import Observable from 'riot-observable'

export default class Abstract {

    set modelData(o){
        this._data = o
    }

    get modelData(){
        return this._data || {}
    }

    constructor(){
        Observable(this)
        this.on('*', (name, data) => {
            let onTriggers = this._onTriggerEventHandlers[name]
            let promises = []
            onTriggers && onTriggers.forEach(method => {
                let p = this[method].call(this, name, data)
                p.then && promises.push(p)
            })

            if (promises.length) {
                Promise.all(promises).then(() => {
                    this.broadcast(name, data, false)
                })
            }
            else {
                this.broadcast(name, data)
            }
        })
    }

    broadcast(name, data = undefined, soft = true){
        Chambr.Resolve(`Chambr->${this.constructor.name}->Event`, -1, this.modelData, Chambr.Export(this), data, soft, name)
    }

    resolve(data = undefined, soft = false, state = 'resolve'){
        return Promise.resolve({data, soft, state})
    }

    reject(data = undefined, soft = true, state = 'reject'){
        return Promise.reject({data, soft, state})
    }

}