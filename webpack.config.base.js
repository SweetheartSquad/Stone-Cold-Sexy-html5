const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const package = require('./package');

module.exports = {
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader'
			}
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader'
			]
		}, {
			test: /\.(png|jpg|gif|wav|ogg|mp3|fnt|xml|frag|vert)$/,
			use: {
				loader: 'url-loader',
				options: {
					outputPath: 'assets/',
					name: '[name].[ext]',
					limit: 512, // bytes
				}
			}
		}]
	},
	entry: {
		index: './src/index.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'public')
	},
	plugins: [
		new CleanWebpackPlugin(['public']), // cleans dist
		new HtmlWebpackPlugin({ // creates index.html
			title: package.description,
			meta: {
				viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
			},
			minify: true,
			favicon: './src/assets/icon.png'
		})
	]
};
