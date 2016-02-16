import Abstract from './_Abstract.es6'
import moment from 'moment'

new class Notes extends Abstract {

    get template(){ return `
<input onblur="{ blur }" placeholder="Add new">
<article class="note" each="{ name, v in $.Notes }" no-reorder>
    <header>
        <select-color selected="{ v.doc.color || 'red' }" data-id="{ v.id }"></select-color>
        <span class="date">{ moment.unix(v.doc.added).format("HH:mm MM/DD") }</span>
        <span class="close" onclick="{ delete }" data-id="{ v.id }">&times;</span>
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

async function context(){
    await $.Notes.load(this)
    this.isLoading = false
    this.moment = moment

    this.blur = ev => {
        let v = ev.target.value.trim()
        ev.target.value = ''
        v && $.Notes.add(v)
    }
    this.delete = ev => $.Notes.delete(ev.target.dataset.id)
    this.setColor = (id, v) => $.Notes.setColor(id, v)

    $.Notes.on('state::add state::delete', () => this.isLoading = true)
    $.Notes.on('state::change', () => this.isLoading = false)

    return new Promise(resolve => resolve())
}