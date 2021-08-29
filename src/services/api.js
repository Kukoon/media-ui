import axios from 'axios';

import { config } from "../../config.js";
import { store } from "./store.js";

function getSearchParams(params) {
	var ret = [];
	Object.keys(params).forEach((key) =>{
		const value = params[key]
		if (Array.isArray(value)){
			value.forEach((el) => {
				ret.push([key,el])
			})
		} else {
			ret.push([key,value])
		}
	})
	return new URLSearchParams(ret)
}

function delay(resp) {
	return new Promise(resolve => setTimeout(() => resolve(resp), 300));
}


export const api = {
	Login(username, password) {
		var url = new URL(config.apiURL + "/auth/login");
		return axios.post(url, {username: username, password: password})
	},
	Channels: {
		My(){
			return axios.get(new URL(config.apiURL + "/my/channels"))
		},
		Get(channelID){
			return axios.get(new URL(config.apiURL + "/channel/"+channelID))
		},
		Add(channel){
			return axios.post(new URL(config.apiURL + "/channel/"), channel)
		},
		Save(channelID, channel){
			return axios.put(new URL(config.apiURL + "/channel/"+channelID), channel)
		},
		Delete(channelID){
			return axios.delete(new URL(config.apiURL + "/channel/"+channelID))
		},
		Restreams: {
			List(channelID){
				return axios.get(new URL(config.apiURL + "/channel/"+channelID+"/restreams"))
			},
			Add(channelID, data){
				return axios.post(new URL(config.apiURL + "/channel/"+channelID+"/restream"), data)
			},
			Delete(channelID, id){
				return axios.delete(new URL(config.apiURL + "/channel/"+channelID+"/restream/"+id)).then(delay)
			},
		},
	},
	Streams: {
		List(params) {
			params = Object.assign({}, params);
			if (!params["lang"]) {
				params["lang"] = store.getters.language
			}
			const query = getSearchParams(params)
			var url = new URL(config.apiURL + "/streams?"+query.toString());
			return axios.get(url)
		},
		Get(id) {
			var url = new URL(config.apiURL + "/stream/" + id + "?lang=" + store.getters.language)
			return axios.get(url)
		},
	},
	Recordings: {
		List(params) {
			params = Object.assign({}, params);
			if (!params["lang"]) {
				params["lang"] = store.getters.language
			}
			const query = getSearchParams(params)
			var url = new URL(config.apiURL + "/recordings?"+query.toString());
			return axios.get(url)
		},
		ListSuggestion(video) {
			var params = {}
			if (video && video["event"]) {
				params["event"] = video.event.id
			}
			return this.List(params)
		},
		Get(id) {
			var url = new URL(config.apiURL + "/recording/" + id + "?lang=" + store.getters.language)
			return axios.get(url)
		},
	},
	Tags: {
		List(params) {
			params = Object.assign({}, params);
			if (!params["lang"]) {
				params["lang"] = store.getters.language
			}
			const query = getSearchParams(params)
			var url = new URL(config.apiURL + "/tags?"+query.toString());
			return axios.get(url)
		},
	},
	Speakers: {
		List() {
			var url = new URL(config.apiURL + "/speakers");
			return axios.get(url)
		},
	},
	Events: {
		List() {
			var url = new URL(config.apiURL + "/events");
			return axios.get(url)
		},
	},
}
