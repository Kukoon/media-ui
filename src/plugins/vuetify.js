import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		options: {
			customProperties: true,
		},
		themes: {
			light: {
				primary: {
					base: "#000000",
					lighten1: "#000000",
					lighten2: "#000000",
					lighten3: "#000000",
					darken1: "#000000",
					darken2: "#000000",
					darken3: "#000000"
				},
				accent: {
					base: "#000000",
					lighten1: "#000000",
					lighten2: "#000000",
					lighten3: "#000000",
					darken1: "#000000",
					darken2: "#000000",
					darken3: "#000000"
				},
				neutral: {
					base: "#E0E0E0",
					lighten1: "#e8e8e8",
					lighten2: "#e8e8e8",
					lighten3: "#f7f7f7",
					darken1: "#d8d8d8",
					darken2: "#d1d1d1",
					darken3: "#c9c9c9"
				},
				error: {
					base: "#E25455",
					lighten1: "#e56364",
					lighten2: "#efa2a2",
					lighten3: "#fae0e0",
					darken1: "#9c1a1b",
					darken2: "#5d1010",
					darken3: "#1f0505"
				},
				warning: {
					base: "#ffaa00",
					lighten1: "#ffc249",
					lighten2: "#ffdb92",
					lighten3: "#fff3db",
					darken1: "#b67900",
					darken2: "#6d4900",
					darken3: "#241800"
				},
				success: {
					base: "#47b857",
					lighten1: "#7bcc87",
					lighten2: "#b0e1b7",
					lighten3: "#e5f5e7",
					darken1: "#32843e",
					darken2: "#1e4f25",
					darken3: "#0a1a0c"
				},
				text: {
					base: "#000000",
					lighten1: "#121212",
					lighten2: "#1C1C1C",
					lighten3: "#242424",
					darken1: "#0F0F0F",
					darken2: "#0A0A0A",
					darken3: "#050505"
				}
			},
			dark: {
				primary: {
					base: "#000000",
					lighten1: "#000000",
					lighten2: "#000000",
					lighten3: "#000000",
					darken1: "#000000",
					darken2: "#000000",
					darken3: "#000000"
				},
				accent: {
					base: "#000000",
					lighten1: "#000000",
					lighten2: "#000000",
					lighten3: "#000000",
					darken1: "#000000",
					darken2: "#000000",
					darken3: "#000000"
				},
				neutral: {
					base: "#121212",
					lighten1: "#1C1C1C",
					lighten2: "#242424",
					lighten3: "#292929",
					darken1: "#0F0F0F",
					darken2: "#0A0A0A",
					darken3: "#050505"
				},
				error: {
					base: "#E25455",
					lighten1: "#e56364",
					lighten2: "#efa2a2",
					lighten3: "#fae0e0",
					darken1: "#9c1a1b",
					darken2: "#5d1010",
					darken3: "#1f0505"
				},
				warning: {
					base: "#E68E00",
					lighten1: "#FCB849",
					lighten2: "#ffdb92",
					lighten3: "#fff3db",
					darken1: "#b67900",
					darken2: "#6d4900",
					darken3: "#241800"
				},
				success: {
					base: "#47b857",
					lighten1: "#7bcc87",
					lighten2: "#b0e1b7",
					lighten3: "#e5f5e7",
					darken1: "#32843e",
					darken2: "#1e4f25",
					darken3: "#0a1a0c"
				},
				text: {
					base: "#FFFFFF",
					lighten1: "#E0E0E0",
					lighten2: "#e8e8e8",
					lighten3: "#f7f7f7",
					darken1: "#d8d8d8",
					darken2: "#d1d1d1",
					darken3: "#c9c9c9"
				}
			}
		}
	}
});
