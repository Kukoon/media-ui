import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueChatScroll from 'vue-chat-scroll';
import router from './router'

import VueMasonry from 'vue-masonry-css';

import '@fontsource/fira-sans/index.css';
import "@fontsource/fira-sans/100.css";
import "@fontsource/fira-sans/300.css";
import "@fontsource/fira-sans/400.css";
import "@fontsource/fira-sans/500.css";
import "@fontsource/fira-sans/700.css";
import "@fontsource/fira-sans/900.css";
import '@fontsource/overpass/index.css';
import "@fontsource/overpass/100.css";
import "@fontsource/overpass/300.css";
import "@fontsource/overpass/400.css";
import "@fontsource/overpass/700.css";
import "@fontsource/overpass/900.css";
import '@mdi/font/css/materialdesignicons.min.css';


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
