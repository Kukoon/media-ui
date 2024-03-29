import { config } from "../../config.js"

var sockets = {}

var streamRoomPromise = {
}
function connect(room) {
	var ws = new WebSocket(config.wsURL + '/stream/' + room);
	ws.onmessage = function (ev) {
		const data = JSON.parse(ev.data);
		switch (data.type) {
			case 'username':
				var r = streamRoomPromise[room];
				if (r) {
					r(data.body['error'])
				} else {
					console.log("ws: unhandle username", data.body)
				}
				break;
			default:
				var handler = sockets[room].on[data.type];
				if (handler) {
					Object.values(handler).map((el) => el(data.body));
				} else {
					console.log("ws: no", data.type, "handler for", data.body);
				}
		}
	}
	ws.onclose = function () {
		setTimeout(function () {
			connect(room);
		}, 1000);
	}
	ws.onerror = function () {
		ws.close();
	}
	return ws
}
function join(room) {
	var s = sockets[room];
	if (!s) {
		var ws = connect(room);
		sockets[room] = {
			ws: ws,
			on: {},
		};
	}
}

async function setUsername(room, name) {
	const s = sockets[room];
	if (s) {
		s.ws.send(JSON.stringify({
			'type': 'username',
			'body': {
				'set': name,
			}
		}));
		var p = await new Promise((resolve) =>
			streamRoomPromise[room] = resolve
		)
		delete (streamRoomPromise[room])
		return p;
	} else {
		console.log("ws: setUsername - not connected to", room)
	}
	return "not connected";
}

export const websocket = {
	join: join,
	joinHandler(room, type, id, handler) {
		join(room)
		let ex = sockets[room].on[type];
		if (!ex) {
			ex = {};
		}
		ex[id] = handler;
		sockets[room].on[type] = ex;
	},
	leaveHandler(room, type, id) {
		delete sockets[room].on[type][id];
	},
	leave(room) {
		const s = sockets[room];
		if (s) {
			s.ws.close();
			delete sockets[room]
		} else {
			console.log("ws: leave - not connected to", room)
		}
	},
	sendChat(room, body) {
		const s = sockets[room];
		if (s) {
			s.ws.send(JSON.stringify({
				'type': 'chat',
				'body': {
					'data': body,
				}
			}));
		} else {
			console.log("ws: send - not connected to", room)
		}
	},
	setUsername: setUsername,
	renderText(text) {
		var urlRegex = /(https?:\/\/[^\s]+)/g;
		var boldRegex = /\*\*(.*?)\*\*/gm;
		var italicRegex = /\*(.*?)\*/gm;
		text = text.replace(boldRegex, '<strong>$1</strong>')
		text = text.replace(italicRegex, '<i>$1</i>')
		return text.replace(urlRegex, function (url) {
			return '<a href="' + url + '" target="_blank">' + url + '</a>';
		})
	},
}