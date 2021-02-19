const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = (env) => {
	console.log(env);
	return {
		entry: {
			artcodes: './src/artcodes.ts',
			main: './src/main.ts'
		},
		devtool: env === 'dev' ? 'inline-source-map' : false,
		mode: env === 'dev' ? 'development' : 'production',
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
				template: '!!html-loader!src/index.html',
				scriptLoading: 'defer',
				inject: true
			}),
			new CopyPlugin({
					patterns: [
						{from: 'src/static'}]
				}
			)
		],
		resolve: {
			extensions: ['.ts', '.tsx', '.js']
		},
		output: {
			filename: '[name].[contenthash].js',
			path: path.resolve('./build'),
			library: 'artcodes',
			libraryTarget: 'window',
		}
	}
};