import ModelAbstract from './ModelAbstract.es6'

const MODEL_LIBRARY = {}
const MODEL_INSTANCES = {}

/** @type {Highway} */
var HW = undefined

export default class Chambr {

	/**
	 * 
     * @param HighwayInstance {Highway}
     */
    constructor(HighwayInstance){
        HW = HighwayInstance
        HW.sub('ChambrWorker', function(ChambrEvent){
            let ev      = ChambrEvent.data
            let route   = ChambrEvent.name.split('->')
            let argList = Object.values(ev.argList)
            let isConstructor = route[2] === 'constructor'
            let model   = Chambr.getModel(route[1], isConstructor ? argList : undefined)
            let method  = model ? model[route[2]] : false
            let responseEventName = ChambrEvent.name.replace('ChambrWorker', 'ChambrClient')
            if (method) {
                if (isConstructor) {
                    Chambr.Resolve(responseEventName, ev.requestId, model.modelData, {}, {}, true)
                    return
                }
                let r = method.apply(model, argList)
                try {
                    r.then(o => Chambr.Resolve(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state))
                     .catch(o => Chambr.Reject(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), o.data, o.soft, o.state))
                }
                catch(e){
                    Chambr.Resolve(responseEventName, ev.requestId, model.modelData, Chambr.Export(model), r, true)
                }
            }
        })
    }

    /** @returns {ModelAbstract} */
    static get Model(){
        return ModelAbstract
    }

    /**
     * @param model {ModelAbstract}
     */
    static set Model(model) {
        let api = []
        let tmpModel = model.prototype
        let modelName = extractFunctionName(model)
        MODEL_LIBRARY[modelName] = model

        do {
            Object.getOwnPropertyNames(tmpModel)
                .forEach((prop) => {
                    if (
                        api.findIndex(v => v.name === prop) === -1
                        && prop !== 'constructor'
                        && prop.charAt(0) !== '_'
                    ){
                        let descriptor = Object.getOwnPropertyDescriptor(tmpModel, prop)

                        api.push({
                            name: prop,
                            type: descriptor.get ? 'var' : 'fn',
                            decorators: descriptor.get ? descriptor.get.decorators : descriptor.value.decorators
                        })
                    }
                })

            tmpModel = tmpModel.__proto__

            if (
                tmpModel
                && tmpModel.constructor
                && extractFunctionName(tmpModel.constructor) !== 'ModelAbstract'
                && extractFunctionName(tmpModel.constructor) !== 'Object'
            ) {}
            else {
                tmpModel = false
            }
        } while (tmpModel)

        model.prototype._exposedApi = api

        HW.pub('ChambrClient->Expose', {
            modelName: modelName,
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

function extractFunctionName(fn){
    return fn.toString().match(/function\W+([\w$_]+?)\(/)[1]
}
