import './Mixins.es6'
import BASKET from './BASKET.es6'

new class Client {
    Data = {
        Hurka: 'Nem kolbasz'
    };

    constructor(){
        GW.on('Worker->$->Expose', (data) => {
            ci('$ Incoming expose', data)
            BASKET[data.name] = this.applyAPI(data.name, data.api)
        })
    }

    applyAPI(name, api){
        if (this._hasProto) return
        this._hasProto = true
        api.forEach((method) => {
            Object.defineProperty(this.Data, method, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: this.__METHOD(name, method)
            })
        })
        return this.Data
    }

    __METHOD(name, method){
        return function(){
            cl('promizal')
            let that = this
            return new Promise(function(resolve){
                cl('feliratkal', `Worker->$->${name}->${method}`)
                resolve(that)
                GW.one(`Worker->$->${name}->${method}`, function(){
                    console.log('kallbekkal', arguments)
                    resolve(arguments)
                })
            })
        }
    }

}