import riot from 'riot'

riot.tag('app', 'Torma: <yield></yield>', function(){
    this.on(riot.EV.MOUNT, function(){
        ci('Main App mount OK.')
    })
})