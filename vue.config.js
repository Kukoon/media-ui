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
				target: 'https://media.ccchb.de',
				changeOrigin: true,
			},
			'^/ws': {
				target: 'wss://media.ccchb.de',
				ws: true,
				changeOrigin: true,
			},
		},
	},
}
