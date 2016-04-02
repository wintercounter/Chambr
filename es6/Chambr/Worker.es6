const MODEL_LIBRARY = {}
const MODEL_INSTANCES = {}

let HW = self.HW

export default class Chambr {

    static get Model(){}

    static set Model(model) {
        MODEL_LIBRARY[model.name] = model

        let API = []
        Object.getOwnPropertyNames(model.prototype)
            .forEach((prop) =>
                prop !== 'constructor'
                && prop.charAt(0) !== '_'
                && API.push(prop) && console.warn(prop, typeof model.prototype[prop], Object.getOwnPropertyDescriptor(model.prototype, prop))
            )

        HW.pub('Chambr->Expose', {
            modelName: model.name,
            modelApi: API
        })
    }

    static getModel(modelName){
        let model = MODEL_INSTANCES[modelName]
        if (!model) {
            model = MODEL_INSTANCES[modelName] = new MODEL_LIBRARY[modelName]()
        }
        return model
    }

    static Resolve(eventName, responseId, modelData, responseData, responseSoft, responseState){
        HW.pub(eventName, {
            responseId,
            responseData,
            responseSoft,
            responseState,
            modelData
        }, 'resolve')
    }

    static Reject(eventName, responseId, modelData, responseData, responseSoft, responseState) {
        HW.pub(eventName, {
            responseId,
            responseData,
            responseSoft,
            responseState,
            modelData
        }, 'reject')
    }
}

HW.sub('Chambr', function(ChambrEvent){
    console.log(ChambrEvent)
    let ev     = ChambrEvent.data
    let route  = ChambrEvent.name.split('->')
    let model  = Chambr.getModel(route[1])
    let method = model ? model[route[2]] : false
    if (method) {
        var r = method.apply(model, Object.values(ev.argList))
        try {
            r.then(o => Chambr.Resolve(ChambrEvent.name, ev.requestId, model.modelData, o.data, o.soft, o.state))
            .catch(o => Chambr.Reject (ChambrEvent.name, ev.requestId, model.modelData, o.data, o.soft, o.state))
        }
        catch(e){
            Chambr.Resolve(ChambrEvent.name, ev.requestId, model, r, true)
        }
    }
})