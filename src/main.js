import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'

Vue.config.productionTip = false

import { store } from './store/store.js'

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
