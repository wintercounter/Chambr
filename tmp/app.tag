<app>
	<content if="{ $.Site.ready }">

	</content>
</app>

<script>
	let Site     = this.$.Site()
	let Config   = this.$.Config()
	let User     = this.$.User()
	let Language = this.$.Language()

	Site.on('ready', )
	Site.on('update', () => this.update())
</script>