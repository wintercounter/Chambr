import Observable from 'riot-observable'

const BASKET = {}

export default class Abstract {

    set data(o){
        this._data = o
    }

    get data(){
        return this._data || {}
    }

    constructor(){
        Observable(this)
        let name = this._name = this.constructor.name
        BASKET[name] = this

        ci(`ActionModel: '${name}' started.`)
    }

    resolve(name = false, silent = false, data = undefined){
        return new Promise(resolve => {
            resolve(data === undefined ? this.data : data)
            name && this.state(name, silent, this.data)
        })
    }

    reject(msg, name = 'error', silent = false){
        return new Promise((resolve, reject) => {
            ce(msg)
            reject(msg)
            name && this.state(name, silent)
        })
    }

    async state(name, silent = false, data = undefined){
        name = silent ? `::${name}` : name
        if (!data && this.load) {
            await this.load()
            data = this.data
        }
        self.GW.pub(`$->${this._name}::${name}`, data)
    }

}

self.GW.register('$', function(ev){
    let route = ev.name.split('->')
    let model = BASKET[route[1]]
    let fn    = model ? model[route[2]] : false
    if (fn) {
        var res = fn.apply(model, Object.values(ev.data.argList))
        try {
            res.then(e => {
                self.GW.pub(`${ev.name}::done`, e)
            })
        }
        catch(e){
            self.GW.pub(`${ev.name}::done`, res)
        }
    }
})