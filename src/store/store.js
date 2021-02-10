import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		autoPlay: false,
		darkMode: false,
		drawer: false,
	},
	actions: {
		// toggleDrawer action receives context object and commits 'toggleDrawer' mutation
		toggleDrawer(context, payload) {
			context.commit('toggleDrawer', payload)
		}
	},
	mutations: {
		// autoPlay sets a global autoplay variable for the video player 
		autoPlay: (state, payload) => {
			state.autoPlay = payload
		},
		toggleDarkMode: (state, payload) => {
			state.darkMode = payload
		},
		// toggleDrawer switches the value of 'drawer' if payload is unequal
		toggleDrawer: (state, payload) => {
			if (state.drawer !== payload) {
				state.drawer = !state.drawer
			}
		}
	},
	getters: {
		// autoPlay exposes the state of 'autoPlay' to other components
		autoPlay: state => {
			return state.autoPlay
		},
		// darkMode exposes the state of 'darkMode' to other components
		darkMode: state => {
			return state.darkMode
		},
		// drawer exposes the state of 'drawer' value to other components
		drawer: state => {
			return state.drawer
		}
	}
});