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
	<input if="{ total }" class="toggle-all" type="checkbox" onchange="{ all }">
	<label if="{ total }" for="toggle-all">Mark all as complete</label>
	<ul class="todo-list">
		<li each="{ k, v in $.Todo }" if="{ parent.status == 'all' || v.doc.status == parent.status }" riot-tag="todo-item" class="view { v.doc.status }" id="{ v.id }" text="{ v.doc.text }" status="{ v.doc.status }" no-reorder></li>
	</ul>
</section>
<footer if="{ total }" class="footer">
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
	<button if="{ total != uncompleted }" class="clear-completed" onclick="{ clear }">Clear completed</button>
</footer>
`}

	get context(){
		return context
	}
}

async function context(){
	await $.Todo.load(this)
	this.status = 'all'

	this.keyup = ev => {
		if (ev.keyCode === ENTER_KEY) {
			let v = ev.target.value.trim()
			ev.target.value = ''
			v && $.Todo.add(v)
		}
		else if (ev.keyCode === ESC_KEY) {
			ev.target.value = ''
			ev.target.blur()
		}
		return true
	}
	this.delete = ev => $.Todo.delete(ev.target.dataset.id)
	this.clear  = ev => $.Todo.clear()
	this.all    = ev => $.Todo.all(!ev.target.checked ? 'uncompleted' : 'completed')

	$.Todo.on('state', async function(ev){
		if (ev.state === 'change') {
			this.count()
		}
	}.bind(this))

	this.count = async function() {
		this.uncompleted = await $.Todo.countUncompleted()
		this.total = await $.Todo.total()
		this.update()
	}.bind(this)
	this.count()

	riot.route('status/*', status => {
		this.status = status
		this.update()
	})

	riot.route.exec()

	return new Promise(resolve => resolve())
}

