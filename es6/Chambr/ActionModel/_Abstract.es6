const BASKET = {}

export default class Abstract {

    set data(o){
        this._data = o
    }

    get data(){
        return this._data || {}
    }

    constructor(){
        let name = this._name = this.constructor.name
        BASKET[name] = this

        ci(`ActionModel: '${name}' started.`)
    }

    resolve(name = false, silent = false){
        return new Promise(resolve => {
            resolve(this.data)
            name && this.state(name, silent)
        })
    }

    reject(msg, name = 'error', silent = false){
        return new Promise((resolve, reject) => {
            reject(msg)
            name && this.state(name, silent)
        })
    }

    state(name, silent = false){
        name = silent ? `::${name}` : name
        self.GW.pub(`$->${this._name}::${name}`)
    }

}

self.GW.register('$', function(ev){
    let route = ev.name.split('->')
    let model = BASKET[route[1]]
    let fn    = model ? model[route[2]] : false
    if (fn) {
        fn.apply(model, Object.values(ev.data.argList)).then(e => {
            self.GW.pub(`${ev.name}::done`, e)
        })
    }
})