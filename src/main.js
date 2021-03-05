import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueChatScroll from 'vue-chat-scroll';
import router from './router'

import VueMasonry from 'vue-masonry-css'

Vue.config.productionTip = false

Vue.use(VueChatScroll);
Vue.use(VueMasonry);

import { store } from './services/store.js'

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
