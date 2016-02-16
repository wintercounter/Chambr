import riot from '../Riot.es6'

riot.tag('app', '<yield></yield>', function(){
    this.on('mount', function(){
        riot.route.start()
        ci('Main App mount OK.')
    })
})