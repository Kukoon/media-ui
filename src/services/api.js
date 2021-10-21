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
		GetStream(channelID) {
			var url = new URL(config.apiURL + "/channel/" + channelID + "/stream?lang=" + store.getters.language)
			return axios.get(url)
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
		ListChannelMy(channelID, params){
			params = Object.assign({}, params);
			if (!params["lang"]) {
				params["lang"] = store.getters.language
			}
			const query = getSearchParams(params)
			return axios.get(new URL(config.apiURL + "/channel/"+channelID+"/streams?"+query.toString()))
		},
		Get(streamID){
			return axios.get(new URL(config.apiURL + "/stream/"+streamID))
		},
		Add(channelID, stream){
			return axios.post(new URL(config.apiURL + "/channel/"+channelID+"/stream"), stream)
		},
		Save(streamID, stream){
			return axios.put(new URL(config.apiURL + "/stream/"+streamID), stream)
		},
		Delete(streamID){
			return axios.delete(new URL(config.apiURL + "/stream/"+streamID))
		},
		Export(streamID){
			return axios.post(new URL(config.apiURL + "/stream/"+streamID+"/to-recording"))
		},
		Langs: {
			List(streamID, params){
				params = Object.assign({}, params);
				const query = getSearchParams(params)
				return axios.get(new URL(config.apiURL + "/stream/"+streamID+"/langs?"+query.toString()))
			},
			Add(streamID, lang){
				return axios.post(new URL(config.apiURL + "/stream/"+streamID+"/lang"), lang)
			},
			Save(streamLangID, lang){
				return axios.put(new URL(config.apiURL + "/stream-lang/"+streamLangID), lang)
			},
			Delete(streamLangID){
				return axios.delete(new URL(config.apiURL + "/stream-lang/"+streamLangID))
			},
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
		ListChannelMy(channelID, params){
			params = Object.assign({}, params);
			if (!params["lang"]) {
				params["lang"] = store.getters.language
			}
			const query = getSearchParams(params)
			return axios.get(new URL(config.apiURL + "/channel/"+channelID+"/recordings?"+query.toString()))
		},
		Get(id, params) {
			params = Object.assign({}, params);
			if (!params["lang"]) {
				params["lang"] = store.getters.language
			}
			const query = getSearchParams(params)
			var url = new URL(config.apiURL + "/recording/" + id + "?" + query.toString())
			return axios.get(url)
		},
		Add(recordingID, recording){
			return axios.post(new URL(config.apiURL + "/channel/"+recordingID+"/recording"), recording)
		},
		Save(recordingID, recording){
			return axios.put(new URL(config.apiURL + "/recording/"+recordingID), recording)
		},
		Delete(recordingID){
			return axios.delete(new URL(config.apiURL + "/recording/"+recordingID))
		},
		Langs: {
			List(recordingID, params){
				params = Object.assign({}, params);
				const query = getSearchParams(params)
				return axios.get(new URL(config.apiURL + "/recording/"+recordingID+"/langs?"+query.toString()))
			},
			Add(recordingID, lang){
				return axios.post(new URL(config.apiURL + "/recording/"+recordingID+"/lang"), lang)
			},
			Save(recordingLangID, lang){
				return axios.put(new URL(config.apiURL + "/recording-lang/"+recordingLangID), lang)
			},
			Delete(recordingLangID){
				return axios.delete(new URL(config.apiURL + "/recording-lang/"+recordingLangID))
			},
		},
		Formats: {
			Add(recordingID, format){
				return axios.post(new URL(config.apiURL + "/recording/"+recordingID+"/format"), format)
			},
			Save(recordingFormatID, format){
				return axios.put(new URL(config.apiURL + "/recording-format/"+recordingFormatID), format)
			},
			Delete(recordingFormatID){
				return axios.delete(new URL(config.apiURL + "/recording-format/"+recordingFormatID))
			},
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
		ListChannelMy(channelID) {
			return axios.get(new URL(config.apiURL + "/channel/"+channelID+"/speakers"))
		},
		Add(channelID, speaker) {
			return axios.post(new URL(config.apiURL + "/channel/"+channelID+"/speaker"), speaker)
		},
		Save(speakerID, speaker) {
			return axios.put(new URL(config.apiURL + "/speaker/"+speakerID), speaker)
		},
		Delete(speakerID) {
			return axios.delete(new URL(config.apiURL + "/speaker/"+speakerID))
		},
	},
	Events: {
		List() {
			var url = new URL(config.apiURL + "/events");
			return axios.get(url)
		},
		ListChannelMy(channelID) {
			return axios.get(new URL(config.apiURL + "/channel/"+channelID+"/events"))
		},
		Add(channelID, eventData) {
			return axios.post(new URL(config.apiURL + "/channel/"+channelID+"/event"), eventData)
		},
		Save(eventID, eventData) {
			return axios.put(new URL(config.apiURL + "/event/"+eventID), eventData)
		},
		Delete(eventID) {
			return axios.delete(new URL(config.apiURL + "/event/"+eventID))
		},
	},
}
