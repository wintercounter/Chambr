import Abstract from './_Abstract.es6'

new class Notes extends Abstract {

    get template(){ return `
<input onblur="{ blur }" placeholder="Add new">
<article class="note" each="{ name, v in $.Notes }">
    <header>
        <select-color selected="{ 'red' }"></select-color>
        <span class="date">Sept 12, 2013</span>
        <span class="close">&times;</span>
    </header>

    <div class="content">
        <p>{ v.doc.title }</p>
    </div><!-- .content -->
</article>
    `}

    get context(){
        return context
    }
}

async function context(opts){
    await $.Notes.load(this)

    this.blur = async function(ev){
        let v = ev.target.value.trim()
        ev.target.value = ''
        if (v) $.Notes.add(v)
    }

    $.Notes.on('state', function(){
        console.error('state', arguments, $.Notes)
    })

    //await Notes.add("De lehet hogy kolbasz")

    //let y = await this.$.Notes.doOtherSideStuff()

    //cw(y, this)

    return new Promise(resolve => resolve())
}