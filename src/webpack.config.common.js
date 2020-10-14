const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	entry: {
		artcodes: './artcodes.ts',
		main: './artcode_ui.ts'
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.html$/,
				use: 'raw-loader'
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin({cleanStaleWebpackAssets: true}),
		new HtmlWebpackPlugin({
			template: '!!html-loader!index.html',
			scriptLoading: 'defer',
			inject: true
		}),
		new CopyPlugin({
				patterns: [
					{from: 'static'}]
			}
		)
	],
	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},
	output: {
		path: path.resolve('../build'),
		library: 'artcodes',
		libraryTarget: 'window',
	}
};