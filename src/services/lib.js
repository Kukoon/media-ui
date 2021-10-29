function dateString(date) {
	let d = new Date(date);
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
	return d.toISOString().slice(0,16);
}

export const models = {
	Stream: {
		FromRequest(data) {
			return {
				listen_at: dateString(data.listen_at),
				start_at: dateString(data.start_at),
				end_at: dateString(data.end_at),
				chat: data.chat,
				running: data.running,
				common_name: data.common_name,
				poster: data.poster,
				preview: data.preview,
				event_id: data.event ? data.event.id : null,
				tags: data.tags ? data.tags.map((el)=> el.id) : [],
				speakers: data.speakers ? data.speakers.map((el)=> el.id) : [],
			}
		},
		ToRequest(data) {
			return {
				listen_at: new Date(data.listen_at),
				start_at: new Date(data.start_at),
				end_at: new Date(data.end_at),
				chat: data.chat,
				running: data.running,
				common_name: data.common_name,
				poster: data.poster,
				preview: data.preview,
				event_id: data.event ? data.event.id : data.event_id ? data.event_id : null,
				tags: data.tags ? data.tags.map((el)=> el.id ? el.id : el) : [],
				speakers: data.speakers ? data.speakers.map((el)=> el.id ? el.id : el) : [],
			}
		},
	},
	Recording: {
		FromRequest(data) {
			return {
				created_at: dateString(data.created_at),
				duration: data.duration,
				public: data.public,
				listed: data.listed,
				common_name: data.common_name,
				poster: data.poster,
				preview: data.preview,
				event_id: data.event ? data.event.id : null,
				tags: data.tags ? data.tags.map((el)=> el.id) : [],
				speakers: data.speakers ? data.speakers.map((el)=> el.id) : [],
			}
		},
		ToRequest(data) {
			return {
				created_at: new Date(data.created_at),
				duration: parseInt(data.duration),
				public: data.public,
				listed: data.listed,
				common_name: data.common_name,
				poster: data.poster,
				preview: data.preview,
				event_id: data.event ? data.event.id : data.event_id ? data.event_id : null,
				tags: data.tags ? data.tags.map((el)=> el.id ? el.id : el) : [],
				speakers: data.speakers ? data.speakers.map((el)=> el.id ? el.id : el) : [],
			}
		},
	},
}

export function	uuidToArrayElement(id, a) {
	const i = parseInt(id.replace(/-/g, ""), 16);
	return a[i % a.length];
}
