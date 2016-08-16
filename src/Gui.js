import Observable from 'riot-observable'

// POWA
self.ChambrDebug = self.ChambrDebug

var HW = undefined

// Privates
const _requestId = Symbol()
const _promises  = Symbol()
const _basket    = Symbol()

/**
 * Chambr GUI side.
 *
 * @class
 */
export default class Chambr {

    /**
     * HW Instance getter
     * @returns {Highway}
     */
    get HW(){
        return HW
    }

    /**
     * ShortObject getter
     * @returns {Object}
     */
    get $(){
        return this[_basket]
    }

    /**
     * Constructor.
     *
     * @param {Highway} HighwayInstance
     * @constructor
     */
    constructor(HighwayInstance){

        // Initialize privates
        this[_requestId] = 0
        this[_promises]  = {}
        this[_basket]    = {}

        // Subscribe to incoming Expose events
        HW = HighwayInstance
        HW.sub('ChambrClient->Expose', exposeEvent => {
            self.ChambrDebug && console.log('Incoming Expose: ', exposeEvent)

            // Extract data from event
            // Create ShortObject
            let exposeData = exposeEvent.data
            let model      = this.$[exposeData.modelName] = this.applyApi(exposeData)
            let modelName  = exposeData.modelName

            // Subscribe to every event this model has
            HW.sub(`ChambrClient->${modelName}`, modelEvent => {
                self.ChambrDebug && console.log('GUI Incoming: ', modelEvent)

                // Extract vars
                let modelExportChanged = false
                let d             = modelEvent.data
                let responseState = d.responseState
                let responseId    = d.responseId
                let responseData  = d.responseData || {}
                let modelExport   = responseData.export || {}
                let modelBuffer   = responseData.buffer || []
                let modelOutput   = responseData.output

                // Update data
                // Apply all buffered actions to the data
                modelBuffer.forEach(action => {
                    let act = action[0]
                    let idx = action[1]
                    let val = action[2]

                    switch (act) {
                        case 'action-simple-set':
                            model[idx] = val
                            break;
                        case 'action-simple-delete':
                            delete model[idx]
                            break;
                    }

                    // @TODO implement complex
                })

                // Apply all exported data (getters)
                for (let name in modelExport){

                    // To trigger update when only getter value is changed
                    if (!modelExportChanged && model[name] !== modelExport[name]){
                        modelExportChanged = true
                    }

                    // No has own prop check needed!
                    model[name] = modelExport[name]
                }

                // In case we have a responseState and responseId,
                // we need to resolve the pending promises
                if (responseState && responseId) {
                    let methods = this[_promises][responseId]
                    methods && methods[modelEvent.state].call(null, modelOutput)
                    delete this[_promises][responseId]
                }

                // Trigger an event with the state of the event
                model.trigger(modelEvent.state, modelEvent.data)

                // Trigger event with the state of the response
                responseState && model.trigger(responseState, d)

                // Trigger an `update` event, because data is changed
                (modelExportChanged || modelBuffer.length) && model.trigger('update', d)
            })
        })
    }

    /**
     * Applies exposed API from Worker, creates ShortObject.
     *
     * @param exposeData
     * @returns {Object} ShortObject
     */
    applyApi(exposeData){

        // Create constructor first please
        let d = this.applyApiValue(exposeData.modelName, {
            name: 'constructor',
            type: 'fn'
        })

        // Assign modelData to it
        Object.assign(d, exposeData.modelData)

        // Add API methods as non-enumerable members
        exposeData.modelApi.forEach(apiData => Object.defineProperty(d, apiData.name, {
            enumerable: false,
            configurable: true,
            writable: true,
            value: this.applyApiValue(exposeData.modelName, apiData)
        }))

        // Set to observable
        return Observable(d)
    }

    /**
     * Creates a function for the ShortObject.
     * Function types will trigger the event on Highway to be executed in the Worker.
     *
     * @param {String} name    Name of the member.
     * @param {Object} apiData Details of the member method.
     * @returns {undefined}
     */
    applyApiValue(name, apiData){
        let that   = this
        let method = apiData.name
        let value  = undefined

        // Value become a function which will trigger correct HW event.
        if (apiData.type === 'fn') {
            value = function(...argList){
                // If `this` is observable, than trigger event with the methods name
                this && this.trigger && this.trigger(method)

                // Create promise in return.
                // We're creating a request id,
                // so we will now which promise to resolve
                let p = new Promise((resolve, reject) => {
                    that[_promises][++that[_requestId]] = { resolve, reject }

                    // Trigger HW event
                    HW.pub(`ChambrWorker->${name}->${method}`, {
                        argList: Array.from(argList),
                        requestId: that[_requestId]
                    })
                })

                // If constructor is called, simply return the ShortObject
                return (method === 'constructor') ? that[_basket][name] : p
            }
        }

        // Apply decorator
        // @TODO Implement as Middleware
        for (let decorator in apiData.decorators) {
            if (!apiData.decorators.hasOwnProperty(decorator)) continue;

            let descriptor = apiData.decorators[decorator]
            let old        = value

            switch(decorator){

                // @Default decorator
                case 'default':
                    value = descriptor
                    break;

                // @Peel decorator
                case 'peel':
                    // Fix some Babel transform issues
                    var _typeof = _typeof
                    let peelList = descriptor.list
                    eval(`value = ${descriptor.fn}`)
                    break;

                // @TODO Check if still needed.
                case 'empty':
                    value = function emptyDecorator(){
                        old()
                    }
                    break;

                default: break;
            }
        }

        return value
    }
}