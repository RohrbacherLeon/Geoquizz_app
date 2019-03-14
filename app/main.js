import Vue from 'nativescript-vue'
import App from './components/App'
import LoginPage from './components/LoginPage'

// Prints Vue logs when --env.production is *NOT* set while building
Vue.config.silent = (TNS_ENV === 'production')

Vue.registerElement('RadSideDrawer', () => require('nativescript-ui-sidedrawer').RadSideDrawer)

new Vue({
  render: h => h('frame', [h(LoginPage)])
}).$start()
