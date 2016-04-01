import { BASKET } from './BASKET.es6'
import Interface from './Interface.es6'
import riot from '../Riot.es6'

const DATA_STATES = [
    'done',
    'change'
]

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
                //console.warn(BASKET, data.name, parsed, ev)
                if (DATA_STATES.indexOf(parsed.state)+1 && typeof ev.data === 'object') {
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
        let d = this.data.data || {}
        this.data.api.forEach((method) => {
            Object.defineProperty(d, method, {
                enumerable: false,
                configurable: false,
                writable: false,
                value: this.__METHOD(this.data.name, method)
            })
        })
        Object.defineProperty(d, 'scope', {
            enumerable: false,
            configurable: true,
            writable: true,
            value: undefined
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
                scope && scope.trigger(`state::${method}`)
            }

            return new Promise(function(resolve){
                // TODO once!!!!
                self.GW.sub(`$->${name}->${method}::done`, function(v){
                    let scope = BASKET[name].scope
                    resolve(v)
                    scope && setTimeout(scope.update)
                })
                self.GW.pub(`$->${name}->${method}`, {
                    argList: ag1
                })
            })
        }
    }

}