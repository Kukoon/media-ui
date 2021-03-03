import * as XMPP from "strophe.js";
import "strophejs-plugin-muc";

const serverName = "media.kukoon.de";
const conferenceServerName = "conference." + serverName;
const randomPW = "fakepw"

const randomNickname = [
	"Affe",
	"Esel",
	"Hase",
	"Katze",
	"Giraffe",
	"Hund",
	"Maus",
	"Wolf",
	"Vogel",

]

const connection = new XMPP.Strophe.Connection(
	"https://media.kukoon.de/http-bind/"
);
connection.rawInput = function (data) { console.log('RECV: ' + data); };
connection.rawOutput = function (data) { console.log('SEND: ' + data); };

const username = randomNickname[Math.floor(Math.random() * randomNickname.length)];

connection.connect(username+"@"+serverName, randomPW, onConnect);

// connection.addHandler(onMessage, null, 'message', null, null,  null);
connection.addHandler(onSubscriptionRequest, null, "presence", "subscribe");
connection.addHandler(onPresence, null, "presence");


let isOnline = false;
function onConnect(status) {
	if (status == XMPP.Strophe.Status.CONNECTING) {
		console.log('XMPP.Strophe is connecting.');
	} else if (status == XMPP.Strophe.Status.CONNFAIL) {
		console.log('XMPP.Strophe failed to connect.');
	} else if (status == XMPP.Strophe.Status.DISCONNECTING) {
		console.log('XMPP.Strophe is disconnecting.');
	} else if (status == XMPP.Strophe.Status.DISCONNECTED) {
		console.log('XMPP.Strophe is disconnected.');
	} else if (status == XMPP.Strophe.Status.CONNECTED) {
		console.log('XMPP.Strophe is connected.');
		connection.send(XMPP.$pres().tree());
		isOnline = true;
	}
}

function onSubscriptionRequest(stanza) {
	if (stanza.getAttribute("type") == "subscribe") {
		var from = stanza.getAttribute('from');
		console.log('onSubscriptionRequest: from=' + from);
		connection.send(XMPP.$pres({
			to: from,
			type: "subscribed"
		}));
	}
	return true;
}

function onPresence(presence) {
	/* disco stuff
	if (connection.disco) {
		connection.disco.info(fullJID)
		connection.disco.addIdentity('client', 'web', 'OSP Webchat', 'en');
	}
	*/
	var presence_type = presence.getAttribute('type'); // unavailable, subscribed, etc...
	var from = presence.getAttribute('from'); // the jabber_id of the contact
	if (!presence_type) presence_type = "online";
	console.log(' >' + from + ' --> ' + presence_type);
	if (presence_type != 'error') {
		if (presence_type === 'unavailable') {
			// Mark contact as offline
		} else {
			var show = presence.show; // this is what gives away, dnd, etc.
			if (show === 'chat' || show === '') {
				// Mark contact as online
			} else {
				// etc...
			}
		}
	}
	return true;
}



export const chat = {
	name: username,
	join(room, onMessage) {
		if (!isOnline) {
			setTimeout(function() {
				chat.join(room, onMessage)
			}, 500)
			return
		}
		const roomID = room + "@" + conferenceServerName;
		connection.muc.init(connection);
		connection.muc.join(roomID, chat.name, onMessage);
		connection.muc.setStatus(roomID, chat.name + '@' + serverName, 'subscribed', 'chat');
		console.log("connected to", roomID);
	},
	leave(room) {
		if (!isOnline) { return }
		console.log(room)
	},
	send(room, body) {
		if (!isOnline) { return }
		const roomID = room + "@" + conferenceServerName;
		var msg = XMPP.$msg({to: roomID, type: 'groupchat'})
			.c('body', null, body);
		connection.send(msg.tree());
	},
        getResourceFromJid: XMPP.Strophe.getResourceFromJid,
}

