import ModelAbstract from './ModelAbstract'

const MODEL_LIBRARY = {}
const MODEL_INSTANCES = {}

/** @type {Highway} */
var HW = undefined

/**
 * 
 */
export default class Chambr {

    /**
     * @param HighwayInstance {Highway}
     */
    constructor(HighwayInstance){
        HW = HighwayInstance
        HW.sub('ChambrWorker', function(ChambrEvent){
            console.log('In-W: ', ChambrEvent)
            let ev      = ChambrEvent.data
            let route   = ChambrEvent.name.split('->')
            let argList = Object.values(ev.argList)
            let isConstructor = route[2] === 'constructor'
            let model   = Chambr.getModel(route[1], isConstructor ? argList : undefined)
            let method  = model ? model[route[2]] : false
            let responseEventName = ChambrEvent.name.replace('ChambrWorker', 'ChambrClient')
            if (method && isConstructor) {
                Chambr.Resolve(responseEventName, ev.requestId, {
                    buffer: Array.from(model.buffer),
                    export: Chambr.Export(model)
                })
            }
            else if (method) {
                let r = method.apply(model, argList)
                try {
                    r.then(o => Chambr.Resolve(responseEventName, ev.requestId, {
                            buffer: Array.from(model.buffer),
                            export: Chambr.Export(model),
                            output: o
                        }))
                     .catch(o => Chambr.Reject(responseEventName, ev.requestId, {
                         buffer: Array.from(model.buffer),
                         export: Chambr.Export(model),
                         output: o
                     }))
                }
                catch(e){
                    Chambr.Resolve(responseEventName, ev.requestId, {
                        buffer: Array.from(model.buffer),
                        export: Chambr.Export(model),
                        output: r
                    })
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
            modelData: model.DefaultData,
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

    static Resolve(eventName, responseId, responseData, responseState = 'resolve'){
        HW.pub(eventName, {
            responseId,
            responseData,
            responseState
        }, 'resolve')
    }

    static Reject(eventName, responseId, responseData, responseState = 'reject') {
        HW.pub(eventName, {
            responseId,
            responseData,
            responseState
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
