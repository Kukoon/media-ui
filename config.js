export const config = {
	"apiURL": `${location.protocol}//${location.host}/api/v1`,
	"wsURL": `ws${location.protocol == 'https:' ? 's' : ''}://${location.host}/ws/v1`,
	"ingressURL": {
		"rtmp": "rtmp://ingress.media.kukoon.de/stream{ID}",
		"ws": "wss://edge01.media.kukoon.de/stream/ws/stream/{ID}?direction=send&transport=tcp",
	},
	"sourceURLs": [
		{
			"file": "wss://edge01.media.kukoon.de/stream/ws/stream/{ID}?transport=tcp",
			"type": "webrtc",
			"label": "Realtime (WebRTC-TCP)",
			"default": true,
			"id": 1
		},
		{
			"file": "https://edge01.media.kukoon.de/stream/stream/{ID}/playlist.m3u8",
			"type": "hls",
			"label": "Live (Stabil - HLS)",
			"id": 2
		},
		/*
		{
			"file": "wss://edge01.media.kukoon.de/stream/ws/stream/{ID}",
			"type": "webrtc",
			"label": "WebRTC",
			"id": 3
		},
		/*
		{
			"file": "https://edge01.media.kukoon.de/stream/stream/{ID}/manifest_ll.mpd",
			"type": "dash",
			"lowLatency": true,
			"label": "DASH-LL",
			"id": 2
		},
		{
			"file": "https://edge01.media.kukoon.de/stream/stream/{ID}/playlist.m3u8",
			"type": "hls",
			"label": "HLS",
			"id": 1
		},
		{
			"file": "https://edge01.media.kukoon.de/stream/stream/{ID}/manifest.mpd",
			"type": "dash",
			"label": "DASH",
			"id": 4
		}
       		*/
        ],
	"defaultChannel": "kukoon",
	"defaultChannelID": "df1555f5-7046-4f7a-adcc-195b73949723",
	"sponsorLogos": [
		"/footer/BVS_NEUSTARTKULTUR_Programm_Rapport_RGB_1.png",
		"/footer/BVS_NEUSTARTKULTUR_Programm_Rapport_RGB_2.png"
	],
	"home": {
		"recordings": [
			{
				"title": "Buchvorstellungen",
				"params": [
					{ "tag": "0bca0cf4-a9b9-46d7-821f-18c59c08fc1d" },
					// Interviews: {"tag": "1aa3f441-4461-42da-a858-63abf5ee254c"}
				],
			},
			{
				"title": "Grand Piano Festival 2021",
				"params": {
					"event": "4abb3a05-60a3-4be5-a6aa-323b9755e0b5",
				},
			},
		]
	},
	"defaultLang": "de",
	"colors": {
		"calendar": [
			'red darken-1', 'pink darken-1', 'purple darken-1',
			'deep-purple darken-1', 'indigo darken-1', 'blue darken-1',
			'light-blue darken-1', 'cyan darken-1', 'teal darken-1',
			'green darken-1', 'light-green darken-1', 'lime darken-1',
			'yellow darken-2', 'amber darken-1', 'orange darken-1',
			'deep-orange darken-1', 'brown darken-1', 'blue-grey darken-1',
			'grey darken-1'
		]
	}
}
