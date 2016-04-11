const MODEL_LIBRARY = {}
const MODEL_INSTANCES = {}

let HW = self.HW

export default class Chambr {

    static get Model(){}

    static set Model(model) {
        MODEL_LIBRARY[model.name] = model

        let api = []
        Object.getOwnPropertyNames(model.prototype)
            .forEach((prop) => {
                if (prop !== 'constructor' && prop.charAt(0) !== '_'){
                    let descriptor = Object.getOwnPropertyDescriptor(model.prototype, prop)

                    api.push({
                        name: prop,
                        type: descriptor.get ? 'var' : 'fn',
                        decorators: descriptor.get ? descriptor.get.decorators : descriptor.value.decorators
                    })
                }
            })

        model.prototype._exposedApi = api

        HW.pub('Chambr->Expose', {
            modelName: model.name,
            modelApi: api
        })
    }

    static getModel(modelName, argList = []){
        let model = MODEL_INSTANCES[modelName]
        if (!model) {
            model = MODEL_INSTANCES[modelName] = new MODEL_LIBRARY[modelName](...argList)
        }
        return model
    }

    static Resolve(eventName, responseId, modelData, modelExport, responseData, responseSoft, responseState = 'resolve'){
        HW.pub(eventName, {
            responseId,
            responseData,
            responseSoft,
            responseState,
            modelData,
            modelExport
        }, 'resolve')
    }

    static Reject(eventName, responseId, modelData, modelExport, responseData, responseSoft, responseState = 'reject') {
        HW.pub(eventName, {
            responseId,
            responseData,
            responseSoft,
            responseState,
            modelData,
            modelExport
        }, 'reject')
    }

    static Export(model){
        let results = {}
        model._exposedApi.forEach(apiData => {
            apiData.type === 'var' && (results[apiData.name] = model[apiData.name])
        })
        return results
    }
}

HW.sub('Chambr', function(ChambrEvent){
    let ev      = ChambrEvent.data
    let route   = ChambrEvent.name.split('->')
    let argList = Object.values(ev.argList)
    let isConstructor = route[2] === 'constructor'
    let model   = Chambr.getModel(route[1], isConstructor ? argList : undefined)
    let method  = model ? model[route[2]] : false
    if (method) {
        if (isConstructor) {
            Chambr.Resolve(ChambrEvent.name, ev.requestId, model.modelData, {}, {}, true)
            return
        }
        let r = method.apply(model, argList)
        try {
            r.then(o => Chambr.Resolve(ChambrEvent.name, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state))
            .catch(o => Chambr.Reject (ChambrEvent.name, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state))
        }
        catch(e){
            Chambr.Resolve(ChambrEvent.name, ev.requestId, model.modelData, Chambr.Export(model), r, true)
        }
    }
})