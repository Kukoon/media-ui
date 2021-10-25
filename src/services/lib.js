export const models = {
	Stream: {
		FromRequest(data) {
			let start_at = new Date(data.start_at);
			start_at.setMinutes(start_at.getMinutes() - start_at.getTimezoneOffset());
			let listen_at = new Date(data.listen_at);
			listen_at.setMinutes(listen_at.getMinutes() - listen_at.getTimezoneOffset());
			return {
				start_at: start_at.toISOString().slice(0,16),
				listen_at: listen_at.toISOString().slice(0,16),
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
				start_at: new Date(data.start_at),
				listen_at: new Date(data.listen_at),
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
			let created_at = new Date(data.created_at);
			created_at.setMinutes(created_at.getMinutes() - created_at.getTimezoneOffset());
			return {
				created_at: created_at.toISOString().slice(0,16),
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
				duration: data.duration,
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
