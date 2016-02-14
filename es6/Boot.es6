import 'babel-polyfill'
import './_Debug.es6'
import riot from './Riot.es6'
import './Gateway/Client.es6'
import './Chambr/Client.es6'
import './Tags/All.es6'

ci('Site engine started.')

GW.sub('Worker->Ready', () => {
    ci('Main App is trying to mount.')
    riot.mount('app')
})