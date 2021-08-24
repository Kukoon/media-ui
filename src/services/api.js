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
	ListStreams(params) {
		params = Object.assign({}, params);
		if (!params["lang"]) {
			params["lang"] = store.getters.language
		}
		const query = getSearchParams(params)
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
		params = Object.assign({}, params);
		if (!params["lang"]) {
			params["lang"] = store.getters.language
		}
		const query = getSearchParams(params)
		var url = new URL(config.apiURL + "/recordings?"+query.toString());
		return axios.get(url)
	},
	GetRecording(id) {
		var url = new URL(config.apiURL + "/recording/" + id + "?lang=" + store.getters.language)
		return axios.get(url)
	},
	ListTags(params) {
		params = Object.assign({}, params);
		if (!params["lang"]) {
			params["lang"] = store.getters.language
		}
		const query = getSearchParams(params)
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
	Login(username, password) {
		var url = new URL(config.apiURL + "/auth/login");
		return axios.post(url, {username: username, password: password})
	},
	ListMyChannels(){
		return axios.get(new URL(config.apiURL + "/my/channels"))
	},
	GetChannel(channelID){
		return axios.get(new URL(config.apiURL + "/channel/"+channelID))
	},
	SaveChannel(channelID, channel){
		return axios.put(new URL(config.apiURL + "/channel/"+channelID), channel)
	},
	ListRestreams(channelID){
		return axios.get(new URL(config.apiURL + "/channel/"+channelID+"/restreams"))
	},
	RestreamAdd(channelID, data){
		return axios.post(new URL(config.apiURL + "/channel/"+channelID+"/restream"), data)
	},
	RestreamDelete(channelID, id){
		return axios.delete(new URL(config.apiURL + "/channel/"+channelID+"/restream/"+id)).then(delay)
	},
}
