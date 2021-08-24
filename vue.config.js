// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
	// configureWebpack: {
	// 	plugins: [
	// 		new BundleAnalyzerPlugin()
	// 	]
	// },
	transpileDependencies: [
		"vuetify"
	],
	devServer: {
		proxy: {
			'^/api': {
				// target: 'http://localhost:8090',
				target: 'https://v2-dev.media.kukoon.de',
				// target: 'https://media.kukoon.de',
				changeOrigin: true,
			},
			'^/ws': {
				target: 'https://media.kukoon.de',
				ws: true,
				changeOrigin: true,
			},
		},
	},
}
