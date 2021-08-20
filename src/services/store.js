import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios';

import { config } from "../../config.js";

Vue.use(Vuex);

export const store = new Vuex.Store({
	strict: true,
	state: {
		autoPlay: false,
		darkMode: false,
		drawer: false,
		user: {},
		language: config.defaultLang,
	},
	actions: {
		getLoginStatus(context) {
			return axios.get(new URL(config.apiURL + "/my/auth/status")).then(resp => context.commit('user', resp.data))
		},
		user(context, payload) {
			context.commit('user', payload)
		},
		// toggleDrawer action receives context object and commits 'toggleDrawer' mutation
		toggleDrawer(context, payload) {
			context.commit('toggleDrawer', payload)
		},
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
		},
		user: (state, payload) => {
			state.user = payload
		},
		language: (state, payload) => {
			state.language = payload
		},
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
		},
		// loggedin exposes the state of 'current login' value to other components
		loggedin: state => {
			return state.user["id"]? true : false
		},
		// user exposes the state of 'current login user' value to other components
		user: state => {
			return state.user
		},
		// platform language
		language: state => {
			return state.language ? state.language : config.defaultLang
		},
	}
});
