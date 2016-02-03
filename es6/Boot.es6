import 'babel-polyfill'
import './_Debug.es6'
import riot from 'riot'
import './Gateway/Client.es6'
import './Chambr/Client.es6'
import './Tags/App.es6'
import './Tags/Notes.es6'

ci('Site engine started.')

GW.sub('Worker->ready', () => {
    ci('Main App is trying to mount.')
    riot.mount('app')
})