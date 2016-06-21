import ModelAbstract from './ModelAbstract'

let lastInstance = undefined

/**
 * 
 */
export default class Chambr {

    MODEL_LIBRARY = {}
    MODEL_INSTANCES = {}
    HW = undefined
    INSTANCE = undefined

    static get Instance(){
        return lastInstance
    }

    /**
     * @param HighwayInstance {Highway}
     */
    constructor(HighwayInstance){
        this.INSTANCE = lastInstance = this
        this.HW = HighwayInstance
        this.HW.sub('ChambrWorker', ChambrEvent => {
            console.log('In-W: ', ChambrEvent)
            let ev      = ChambrEvent.data
            let route   = ChambrEvent.name.split('->')
            let argList = Object.values(ev.argList)
            let isConstructor = route[2] === 'constructor'
            let model   = this.getModel(route[1], isConstructor ? argList : undefined)
            let method  = model ? model[route[2]] : false
            let responseEventName = ChambrEvent.name.replace('ChambrWorker', 'ChambrClient')
            if (method && isConstructor) {
                this.resolve(responseEventName, ev.requestId, {
                    buffer: Array.from(model.buffer),
                    export: this.exports(model)
                })
            }
            else if (method) {
                let r = method.apply(model, argList)
                try {
                    r.then(o => this.resolve(responseEventName, ev.requestId, {
                            buffer: Array.from(model.buffer),
                            export: this.exports(model),
                            output: o
                        }))
                     .catch(o => this.reject(responseEventName, ev.requestId, {
                         buffer: Array.from(model.buffer),
                         export: this.exports(model),
                         output: o
                     }))
                }
                catch(e){
                    this.resolve(responseEventName, ev.requestId, {
                        buffer: Array.from(model.buffer),
                        export: this.exports(model),
                        output: r
                    })
                }
            }
        })
    }

    /** @returns {ModelAbstract} */
    get Model(){
        ModelAbstract.Chambr = this
        return ModelAbstract
    }

    /**
     * @param model {ModelAbstract}
     */
    set Model(model) {
        let api = []
        let tmpModel = model.prototype
        let modelName = extractFunctionName(model)
        this.MODEL_LIBRARY[modelName] = model

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

        this.HW.pub('ChambrClient->Expose', {
            modelData: model.DefaultData,
            modelName: modelName,
            modelApi: api
        })
    }

    getModel(modelName, argList = []){
        let model = this.MODEL_INSTANCES[modelName]
        if (!model) {
            model = this.MODEL_INSTANCES[modelName] = new this.MODEL_LIBRARY[modelName](...argList)
        }
        return model
    }

    resolve(eventName, responseId, responseData, responseState = 'resolve'){
        this.HW.pub(eventName, {
            responseId,
            responseData,
            responseState
        }, 'resolve')
    }

    reject(eventName, responseId, responseData, responseState = 'reject') {
        this.HW.pub(eventName, {
            responseId,
            responseData,
            responseState
        }, 'reject')
    }

    exports(model){
        let results = {}
        model._exposedApi.forEach(apiData => {
            apiData.type === 'var' && (results[apiData.name] = model[apiData.name])
        })
        return results
    }
}

function extractFunctionName(fn){
    let match
    fn = fn.toString()
    match = fn.match(/class\W+(.*?)\W+/)
    if (match)
        return match[1]
    else
        return fn.match(/function\W+([\w$_]+?)\(/)[1]
}
