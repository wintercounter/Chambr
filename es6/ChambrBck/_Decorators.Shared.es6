export function ExposeAPI(cls){
    let API = []
    Object.getOwnPropertyNames(cls.prototype)
        .forEach((prop) =>
            prop !== 'constructor'
            && prop.charAt(0) !== '_'
            && API.push(prop)
        )

    GW.pub('$->Expose', {
        name: cls.name,
        api: API
    })

    /*Object.defineProperty(cls.prototype, 'API', {
        enumerable: true,
        configurable: false,
        writable: false,
        value: API
    })
    return cls*/
}