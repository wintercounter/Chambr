import Observable from 'riot-observable'

const BASKET = {}

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
            name = name.toLowerCase().charAt(0).toUpperCase() + name.slice(1)
            this[`_on${name}`] && this[`_on${name}`].call(this, name, data)
        })
    }

    resolve(data = undefined, soft = false, state = 'resolve'){
        return Promise.resolve({data, soft, state})
    }

    reject(data = undefined, soft = true, state = 'reject'){
        return Promise.reject({data, soft, state})
    }

}