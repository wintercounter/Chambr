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
	<input if="{ $.Todo.total }" class="toggle-all" type="checkbox" onchange="{ $.Todo.toggleAll }">
	<label if="{ $.Todo.total }" for="toggle-all">Mark all as complete</label>
	<ul class="todo-list">
		<li each="{ k, v in $.Todo }" if="{ parent.status == 'all' || v.doc.status == parent.status }" riot-tag="todo-item" class="view { v.doc.status }" id="{ v.id }" text="{ v.doc.text }" status="{ v.doc.status }" no-reorder></li>
	</ul>
</section>
<footer if="{ $.Todo.total }" class="footer">
	<span class="todo-count"><strong>{ $.Todo.uncompleted }</strong> item left</span>
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
	<button if="{ $.Todo.total != $.Todo.uncompleted }" class="clear-completed" onclick="{ $.Todo.clear }">Clear completed</button>
</footer>
`}

	get context(){
		return context
	}
}

function context(){
	this.status = 'all'
	let Todo = this.$.Todo

	Todo()

	Todo.on(ev => console.log(ev))

	Todo.load()
	Todo.on('updated', this.update)

	this.keyup = ev => {
		let key = ev.keyCode
		let el  = ev.target

		switch (key) {
			case ENTER_KEY:
				Todo.add(el.value).catch(alert)
				el.value = ''
				break
			case ESC_KEY:
				el.value = ''
				el.blur()
				break
		}
		return true
	}

	riot.route('status/*', status => this.update({ status }))
	riot.route.exec()
}

