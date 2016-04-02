import Abstract from './_Abstract.es6'
import moment from 'moment'

new class Notes extends Abstract {

    get template(){ return `
<input onblur="{ blur }" placeholder="Add new">
<article class="note" each="{ name, v in $.Notes }">
    <header>
        <select-color selected="{ v.doc.color || 'red' }" doc="{ v.id }"></select-color>
        <span class="date">{ moment.unix(v.doc.added).format("HH:mm MM/DD") }</span>
        <span class="close" onclick="{ delete }">&times;</span>
    </header>

    <div class="content">
        <p>{ v.doc.title }</p>
    </div>
</article>
<span if="{ isLoading }" class="loading">Loading...</span>
    `}

    get context(){
        return context
    }
}

function context() {

    this.$.Notes.load().then(() => {
        this.update()
    })

    this.$.Notes.on('updated', () => {
        console.log('yah', this.$.Notes)
        this.update()
    })

    this.isLoading = false
    this.moment = moment

    this.blur = ev => {
        let v = ev.target.value.trim()
        ev.target.value = ''
        v && this.$.Notes.add(v)
    }

    this.delete = ev => this.$.Notes.delete(ev.item.v.id)
    this.setColor = (id, v) => this.$.Notes.setColor(id, v)

    this.$.Notes.on('state::add state::delete', () => this.isLoading = true)
    this.$.Notes.on('state::change', () => this.isLoading = false)

    //return Promise.resolve()
}