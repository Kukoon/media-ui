import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		drawer: null
	},
	actions: {
		// toggleDrawer action receives context object and commits 'toggleDrawer' mutation
		toggleDrawer(context, payload) {
			context.commit('toggleDrawer', payload)
		}
	},
	mutations: {
		// toggleDrawer switches the value of 'drawer' if payload is unequal
		toggleDrawer: (state, payload) => {
			if (state.drawer !== payload) {
				state.drawer = !state.drawer
			}
		}
	},
	getters: {
		// showDrawer exposes the state of 'drawer' value to other components
		showDrawer: state => {
			return state.drawer
		}
	}
});