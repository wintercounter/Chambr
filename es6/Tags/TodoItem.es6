import riot from '../Riot.es6'
import Abstract from './_Abstract.es6'

const ENTER_KEY = 13
const ESC_KEY = 27

new class TodoItem extends Abstract {

	get template(){ return `
<input class="toggle" type="checkbox" onchange="{ $.Todo.toggle }"  __checked="{ opts.status == 'completed' }">
<label if="{ !editing }" ondblclick="{ dblclick }">{ opts.text }</label>
<button class="destroy" onclick="{ $.Todo.delete }"></button>
<input if="{ editing }" name="input" class="edit" value="{ opts.text }" onblur="{ blur }" onkeyup="{ keyup }">
`}

	get context(){
		return context
	}
}

function context(opts){
	let Todo = this.$.Todo
	this.editing = false

	this.dblclick = ev => {
		this.editing = true
		this.root.classList.add('editing')
		this.update()
		this.input && this.input.focus()
	}

	this.keyup = ev => {
		let key = ev.keyCode
		let el  = ev.target

		if (key === ENTER_KEY || key === ESC_KEY) {
			switch (key) {
				default:
					this.editing = false
					this.root.classList.remove('editing')
				case ENTER_KEY:
					Todo.set(opts.id, 'text', el.value.trim())
					break
				case ESC_KEY:
					el.blur()
					el.value = opts.text
					break
			}
		}
	}

	this.blur = ev => {
		!v && Todo.delete(opts.id)
		 v && Todo.set(opts.id, 'text', ev.target.value.trim())
		this.editing = false
	}
}

