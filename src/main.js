import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueChatScroll from 'vue-chat-scroll';
import router from './router'

Vue.config.productionTip = false

Vue.use(VueChatScroll);

import { store } from './services/store.js'

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
