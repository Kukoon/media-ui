import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

import { store } from './store/store.js'

new Vue({
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
