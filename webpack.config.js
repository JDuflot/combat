const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const dev = process.env.NODE_ENV === "dev";

let config = {
	entry: {
		index: "./scripts/index/main.js",
		combat : "./scripts/combat/combat.js"
	},	
	// watch: dev,
	module: {
			rules: [
					{
						test: /\.css$/i,
						use: [
							{
								loader: MiniCssExtractPlugin.loader
							},
							"css-loader"
						],
					},
					{
						test: /\.(png|jpe?g|gif|gltf|glb|svg|mp4|webm|mp3|ico)$/i,
						use: [
							{
								loader: 'file-loader',
								options: {
									name: 'assets/[name].[ext]'
								}
							},
						],
					},
					{
						test: /\.(?:js|mjs|cjs)$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
							options: {
								targets: "defaults",
								presets: [
									['@babel/preset-env']
								]
							}
						}
					}
			]
	},
	plugins: [
			new HtmlWebpackPlugin({
					template: './index.html',
					filename: "index.html",
					chunks: ["index"]
			}),
			new HtmlWebpackPlugin({
				template: './combat.html',
				filename: "combat.html",
				chunks: ["combat"]
		}),
			new MiniCssExtractPlugin()
	]
};

module.exports = config;