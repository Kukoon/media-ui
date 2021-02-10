import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		autoPlay: false,
		drawer: null,
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
		// drawer exposes the state of 'drawer' value to other components
		drawer: state => {
			return state.drawer
		}
	}
});