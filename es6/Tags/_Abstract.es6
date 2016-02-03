import riot from '../Riot.es6'
import { Custom as D } from '../Defaults/Riot.es6'

export default class Abstract {

    constructor(){
        this.register()
    }

    get options(){
        return [
            this._getTagName(),
            this.template.replace(/(\r\n|\n|\r|\t)/gm,""),
            this.context
        ]
    }

    get settings(){
        return D
    }

    get context(){
        var m = Abstract.settings.AutoMixins
        return m
            ? function () { m.forEach( (v) => { this.mixin(v) } ) }
            : function () { }
    }

    // [name, html, css, attrs, fn]
    // Only name important
    register(){
        riot.tag.apply(null, this.options)
    }

    _getTagName(){
        let str = this.constructor.name
        return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    }
}
