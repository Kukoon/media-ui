import * as XMPP from "strophe.js";
import "strophejs-plugin-muc";

import { config } from "../../config.js"

const randomNickname = config.chat.anonym.names
const username = randomNickname[Math.floor(Math.random() * randomNickname.length)];

const connection = new XMPP.Strophe.Connection(config.chat.bosh);
connection.rawInput = function (data) { console.log('RECV: ' + data); };
connection.rawOutput = function (data) { console.log('SEND: ' + data); };


connection.connect(username+"@"+config.chat.server, config.chat.anonym.password, onConnect);

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
		const roomID = room + "@" + config.chat.conference;
		connection.muc.init(connection);
		connection.muc.join(roomID, chat.name, onMessage);
		connection.muc.setStatus(roomID, chat.name + '@' + config.chat.server, 'subscribed', 'chat');
		console.log("connected to", roomID);
	},
	leave(room) {
		if (!isOnline) { return }
		console.log(room)
	},
	send(room, body) {
		if (!isOnline) { return }
		const roomID = room + "@" + config.chat.conference;
		var msg = XMPP.$msg({to: roomID, type: 'groupchat'})
			.c('body', null, body);
		connection.send(msg.tree());
	},
        getResourceFromJid: XMPP.Strophe.getResourceFromJid,
}

