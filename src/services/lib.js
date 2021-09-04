export const models = {
	Stream: {
		ToRequest(stream) {
			return {
				start_at: stream.start_at,
				listen_at: stream.listen_at,
				chat: stream.chat,
				running: stream.running,
				common_name: stream.common_name,
				poster: stream.poster,
				preview: stream.preview,
				event_id: stream.event ? stream.event.id : null,
				tags: stream.tags ? stream.tags.map((el)=> el.id) : [],
				speakers: stream.speakers ? stream.speakers.map((el)=> el.id) : [],
			}
		},
	},
}

export function	uuidToArrayElement(id, a) {
	const i = parseInt(id.replace(/-/g, ""), 16);
	return a[i % a.length];
}
