import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueChatScroll from 'vue-chat-scroll';
import VuePlyr from 'vue-plyr'

// patch until https://github.com/redxtech/vue-plyr/issues/308 is closed
// import 'vue-plyr/dist/vue-plyr.css'
import 'plyr/dist/plyr.css'

import router from './router'

Vue.config.productionTip = false

Vue.use(VuePlyr);
Vue.use(VueChatScroll);

import { store } from './store/store.js'

new Vue({
	router,
	store,
	vuetify,
	render: h => h(App)
}).$mount('#app')
