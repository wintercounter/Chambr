import { BASKET } from './BASKET.es6'
import riot from '../Riot.es6'

new class Client {
    data;

    constructor(){
        let client = this
        self.GW.on('$->Expose', data => {
            ci('$ Incoming expose', data)
            this.data = data
            let BS = BASKET[data.name] = this.applyAPI()

            self.GW.register(`$->${data.name}`, function(ev){
                ev = ev || {}
                let parsed = self.GW.parse(ev.name)
                parsed.state && BS.trigger('state', parsed)
                if (parsed.state === 'done' && ev.data) {
                    for (let k in BS) {
                        if (BS.hasOwnProperty(k)) delete BS[k]
                    }
                    Object.assign(BS, ev.data)
                }
                BS.scope
                && parsed.state
                && !parsed.silent
                && BS.scope.update()
            })
        })
    }

    applyAPI(){
        if (this._hasProto) return
        this._hasProto = true
        let d = this.data.data || {}
        this.data.api.forEach((method) => {
            Object.defineProperty(d, method, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: this.__METHOD(this.data.name, method)
            })
        })
        riot.observable(d)
        return d
    }

    __METHOD(name, method){
        let _that = this
        return function(){
            let that = this
            let ag1 = arguments

            if (typeof ag1[0] === 'object' && ag1[0].mixin) {
                let scope = BASKET[name].scope = ag1[0]
                ag1 = [].slice.call(ag1, 1)
            }

            return new Promise(function(resolve){
                // TODO once!!!!
                self.GW.sub(`$->${name}->${method}::done`, function(){
                    let ag2 = arguments
                    let scope = BASKET[name].scope
                    resolve(that, ag2)
                    setTimeout(function(){
                        scope && scope.update()
                    })
                })
                self.GW.pub(`$->${name}->${method}`, {
                    argList: ag1
                })
            })
        }
    }

}