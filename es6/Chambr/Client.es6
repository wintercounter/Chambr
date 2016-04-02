// import Interface from './Interface.es6'
import Observable from 'riot-observable'

const HW = self.HW

let instance = new class Chambr {

    _requestId = 0

    _promises = {}

    _basket = {}

    get basket(){
        return this._basket
    }

    constructor(){
        HW.sub('Chambr->Expose', exposeEvent => {
            ci('Chambr: Incoming expose', exposeEvent)
            let exposeData =  exposeEvent.data
            let model = this.basket[exposeData.modelName] = this.applyApi(exposeData)

            HW.sub(`Chambr->${exposeData.modelName}`, modelEvent => {
                let d             = modelEvent.data
                let responseState = d.responseState
                let responseId    = d.responseId
                let responseData  = d.responseData
                let responseSoft  = d.responseSoft
                let modelData     = d.modelData

                if (typeof modelData === 'object') {
                    for (let k in model)
                        if (model.hasOwnProperty(k))
                            delete model[k]

                    Object.assign(model, modelData)
                }

                if (responseState && responseId) {
                    let methods = this._promises[responseId]
                    methods && methods[responseState].call(null,
                        responseData !== undefined
                            ? responseData
                            : modelData
                    )
                }

                model.trigger(modelEvent.name, modelEvent.data)
                model.trigger(modelEvent.state, modelEvent.data)
                model.trigger(responseSoft ? 'soft' : 'hard', d)
                !responseSoft && model.trigger('updated', d)
                model.trigger(responseState, d)
                modelEvent.data.responseState && model.trigger(modelEvent.data.responseState, modelEvent.data)
            })
        })
    }

    applyApi(exposeData){
        let d = exposeData.modelData || function(...argList){
            // TODO: Initialize with args
        }
        exposeData.modelApi.forEach(method => Object.defineProperty(d, method, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: this.applyApiMethod(exposeData.modelName, method)
        }))
        return Observable(d)
    }

    applyApiMethod(name, method){
        let that = this
        return function(...argList){
            this.trigger(method)
            return new Promise((resolve, reject) => {
                that._promises[++that._requestId] = { resolve, reject }
                HW.pub(`Chambr->${name}->${method}`, {
                    argList: [].slice.call(argList, 0),
                    requestId: that._requestId
                })
            })
        }
    }
}

export default instance.basket