import 'babel-polyfill'
import './_Debug.es6'
import './HWInit.es6'
import Chambr from './Chambr/Client.es6'
import riot from './Riot.es6'
import './Tags/All.es6'

ci('Site engine started.')

/**
 * Wait for worker to be ready
 */
self.HW.sub('Worker->Ready', () => {

    /**
     * Mount main app when everything is ready
     */
    ci('Main App is trying to mount.')
    riot.mount('app')
})