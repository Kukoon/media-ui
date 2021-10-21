export const models = {
	Stream: {
		ToRequest(data) {
			return {
				start_at: data.start_at,
				listen_at: data.listen_at,
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
	},
	Recording: {
		ToRequest(data) {
			return {
				created_at: data.created_at,
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
	},
}

export function	uuidToArrayElement(id, a) {
	const i = parseInt(id.replace(/-/g, ""), 16);
	return a[i % a.length];
}
