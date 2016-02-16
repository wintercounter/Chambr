import riot from '../Riot.es6'

const Colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "orange"
]

riot.tag('select-color', `
    <span each="{ color in Colors }" if="{ color === parent.opts.selected || parent.isOpen}" class="{ color }" onclick="{ click }"></span>
`, async function(){
    this.Colors = Colors
    this.isOpen = false

    this.click = ev => {
        this.isOpen && this.parent.setColor(this.root.dataset.id, ev.target.className)
        this.isOpen = !this.isOpen
        this.update()
    }
})


// @default: The color to show.