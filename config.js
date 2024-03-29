export const config = {
	"apiURL": `${location.protocol}//${location.host}/api/v1`,
	"wsURL": `ws${location.protocol == 'https:' ? 's' : ''}://${location.host}/ws/v1`,
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
