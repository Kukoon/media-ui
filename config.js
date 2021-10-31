export const config = {
	"apiURL": `${location.protocol}//${location.host}/api/v1`,
	"wsURL": `ws${location.protocol == 'https:' ? 's' : ''}://${location.host}/ws/v1`,
	"defaultChannel": "fireshonks",
	"defaultChannelID": "6ce5b6af-77d8-4a54-a429-20615bb37ea9",
	"sponsorLogos": [],
	"home": {
		"recordings": []
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
