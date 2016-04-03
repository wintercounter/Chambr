import riot from '../Riot.es6'
import Abstract from './_Abstract.es6'

const ENTER_KEY = 13
const ESC_KEY = 27

new class TodoApp extends Abstract {

	get template(){ return `
<header class="header">
	<h1>todos</h1>
	<input class="new-todo" placeholder="What needs to be done?" onkeydown="{ keyup }" autofocus>
</header>
<section class="main">
	<input if="{ $.Todo.total }" class="toggle-all" type="checkbox" onchange="{ all }">
	<label if="{ $.Todo.total }" for="toggle-all">Mark all as complete</label>
	<ul class="todo-list">
		<li each="{ k, v in $.Todo }" if="{ parent.status == 'all' || v.doc.status == parent.status }" riot-tag="todo-item" class="view { v.doc.status }" id="{ v.id }" text="{ v.doc.text }" status="{ v.doc.status }" no-reorder></li>
	</ul>
</section>
<footer if="{ $.Todo.total }" class="footer">
	<span class="todo-count"><strong>{ uncompleted }</strong> item left</span>
	<ul class="filters">
		<li>
			<a class="{ selected: status == 'all' }" href="#/status/all">All</a>
		</li>
		<li>
			<a class="{ selected: status == 'uncompleted' }" href="#/status/uncompleted">Active</a>
		</li>
		<li>
			<a class="{ selected: status == 'completed' }" href="#/status/completed">Completed</a>
		</li>
	</ul>
	<button if="{ $.Todo.total != $.Todo.uncompleted }" class="clear-completed" onclick="{ clear }">Clear completed</button>
</footer>
`}

	get context(){
		return context
	}
}

function context(){
	this.status = 'all'

	this.$.Todo.load()

	this.$.Todo.on('updated', () => {
		this.update()
	})

	this.keyup = ev => {
		if (ev.keyCode === ENTER_KEY) {
			let v = ev.target.value.trim()
			ev.target.value = ''
			v && this.$.Todo.add(v)
		}
		else if (ev.keyCode === ESC_KEY) {
			ev.target.value = ''
			ev.target.blur()
		}
		return true
	}

	this.delete = ev => this.$.Todo.delete(ev.target.dataset.id)
	this.clear  = ev => this.$.Todo.clear()
	this.all    = ev => this.$.Todo.all(!ev.target.checked ? 'uncompleted' : 'completed')

	riot.route('status/*', status => {
		this.status = status
		this.update()
	})

	riot.route.exec()
}

