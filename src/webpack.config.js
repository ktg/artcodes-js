const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
	entry: './artcodes.ts',
	devtool: 'inline-source-map',
	mode: 'development',
	//mode: 'production',
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader'
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
		extensions: ['.ts', '.js']
	},
	output: {
		path: path.resolve(__dirname, '../server/static'),
		filename: 'artcodes.[contenthash].js',
		library: 'artcodes',
		libraryTarget: 'window',
	}
};