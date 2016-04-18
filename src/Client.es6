import Observable from 'riot-observable'

var HW = undefined

export default class Chambr {

    _requestId = 0

    _promises = {}

    _basket = {}

    get HW(){
        return HW
    }

    get $(){
        return this._basket
    }

    constructor(HighwayInstance){
        HW = HighwayInstance
        HW.sub('Chambr->Expose', exposeEvent => {
            console.info('Chambr: Incoming expose', exposeEvent)
            let exposeData =  exposeEvent.data
            let model = this.$[exposeData.modelName] = this.applyApi(exposeData)

            HW.sub(`Chambr->${exposeData.modelName}`, modelEvent => {
                let d             = modelEvent.data
                let responseState = d.responseState
                let responseId    = d.responseId
                let responseData  = d.responseData
                let responseSoft  = d.responseSoft
                let modelData     = d.modelData
                let modelExport   = d.modelExport

                if (typeof modelData === 'object') {
                    for (let k in model)
                        if (model.hasOwnProperty(k))
                            delete model[k]

                    Object.assign(model, modelData)
                }

                if (responseState && responseId) {
                    let methods = this._promises[responseId]
                    methods && methods[modelEvent.state].call(null,
                        responseData !== undefined
                            ? responseData
                            : modelData
                    )
                    delete this._promises[responseId]
                }

                for (let name in modelExport){
                    // No has own prop check needed!
                    model[name] = modelExport[name]
                }

                model.trigger(modelEvent.name, modelEvent.data)
                model.trigger(modelEvent.state, modelEvent.data)
                model.trigger(responseSoft ? 'soft' : 'hard', d)
                !responseSoft && model.trigger('updated', d)
                responseState && model.trigger(responseState, d)
            })
        })
    }

    applyApi(exposeData){
        let d = this.applyApiValue(exposeData.modelName, {
            name: 'constructor',
            type: 'fn'
        })
        Object.assign(d, exposeData.modelData)
        exposeData.modelApi.forEach(apiData => Object.defineProperty(d, apiData.name, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: this.applyApiValue(exposeData.modelName, apiData)
        }))
        return Observable(d)
    }

    applyApiValue(name, apiData){
        let that = this
        let method = apiData.name
        let value = undefined

        if (apiData.type === 'fn') {
            value = function(...argList){
                this && this.trigger && this.trigger(method)
                let p = new Promise((resolve, reject) => {
                    that._promises[++that._requestId] = { resolve, reject }
                    HW.pub(`Chambr->${name}->${method}`, {
                        argList: [].slice.call(argList, 0),
                        requestId: that._requestId
                    })
                })
                return (method === 'constructor') ? that._basket[name] : p
            }
        }

        for (let decorator in apiData.decorators) {
            if (!apiData.decorators.hasOwnProperty(decorator)) continue;
            let descriptor = apiData.decorators[decorator]
            switch(decorator){
                case 'default':
                    value = descriptor
                    break;
                case 'peel':
                    let old = value
                    let peelList = descriptor.list
                    eval(`value = ${descriptor.fn}`)
                    break;
                default: break;
            }
        }

        return value
    }
}