import axios from 'axios';

import { config } from "../../config.js";
import { store } from "./store.js";

export const api = {
	ListStreams(params) {
		params = (typeof params !== 'undefined') ? params : {};
		if (!params["lang"]) {
			params["lang"] = store.getters.language
		}
		const query = new URLSearchParams(params)
		var url = new URL(config.apiURL + "/streams?"+query.toString());
		return axios.get(url)
	},
	GetStream(id) {
		var url = new URL(config.apiURL + "/stream/" + id + "?lang=" + store.getters.language)
		return axios.get(url)
	},
	ListRecordingsSuggestion(video) {
		var params = {}
		if (video && video["event"]) {
			params["event"] = video.event.id
		}
		return this.ListRecordings(params)
        },
	ListRecordings(params) {
		params = (typeof params !== 'undefined') ? params : {};
		if (!params["lang"]) {
			params["lang"] = store.getters.language
		}
		const query = new URLSearchParams(params)
		var url = new URL(config.apiURL + "/recordings?"+query.toString());
		return axios.get(url)
	},
	GetRecording(id) {
		var url = new URL(config.apiURL + "/recording/" + id + "?lang=" + store.getters.language)
		return axios.get(url)
	},
	ListTags(params) {
		params = (typeof params !== 'undefined') ? params : {};
		if (!params["lang"]) {
			params["lang"] = store.getters.language
		}
		const query = new URLSearchParams(params)
		var url = new URL(config.apiURL + "/tags?"+query.toString());
		return axios.get(url)
	},
	ListSpeakers() {
		var url = new URL(config.apiURL + "/speakers");
		return axios.get(url)
	},
	ListEvents() {
		var url = new URL(config.apiURL + "/events");
		return axios.get(url)
	},
}
