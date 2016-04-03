import riot from '../Riot.es6'
import Abstract from './_Abstract.es6'

const ENTER_KEY = 13
const ESC_KEY = 27

new class TodoItem extends Abstract {

	get template(){ return `
<input class="toggle" type="checkbox" onchange="{ change }"  __checked="{ opts.status == 'completed' }">
<label if="{ !editing }" ondblclick="{ dblclick }">{ opts.text }</label>
<button class="destroy" onclick="{ delete }"></button>
<input if="{ editing }" name="input" class="edit" value="{ opts.text }" onblur="{ blur }" onkeyup="{ keyup }">
`}

	get context(){
		return context
	}
}

function context(){
	this.editing = false

	this.dblclick = ev => {
		this.editing = true
		this.root.classList.add('editing')
		this.update()
		this.input && this.input.focus()
	}

	this.keyup = ev => {
		if (ev.keyCode === ENTER_KEY || ev.keyCode === ESC_KEY) {
			if (ev.keyCode === ENTER_KEY) {
				this.edit(ev.target.value.trim())
			}
			else if (ev.keyCode === ESC_KEY) {
				ev.target.blur()
				ev.target.value = this.opts.text
			}
			this.editing = false
			this.root.classList.remove('editing')
		}
	}

	this.blur = ev => {
		let v = ev.target.value.trim()

		if (!v) {
			this.delete()
		}
		else {
			this.edit(v)
		}

		this.editing = false
		this.update()
	}

	this.change = ev => {
		let t = ev.target
		let c = t.checked
		this.$.Todo.set(this.opts.id, 'status', c ? 'completed' : 'uncompleted')
	}

	this.edit = text => this.$.Todo.set(this.opts.id, 'text', text)
	this.delete = ev => this.$.Todo.delete(this.opts.id)
}

