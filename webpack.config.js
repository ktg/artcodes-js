const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = [(env) => {
	return {
		entry: './src/test.ts',
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
				template: '!!html-loader!src/test.html',
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
			filename: 'artcodes.test.[contenthash].js',
			path: path.resolve('./build'),
		}
	}
},
	(env) => {
		return {
			entry: './src/artcodes.ts',
			devtool: env === 'dev' ? 'inline-source-map' : false,
			mode: env === 'dev' ? 'development' : 'production',
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						use: 'ts-loader',
						exclude: /node_modules/,
					}
				]
			},
			plugins: [],
			resolve: {
				extensions: ['.ts', '.tsx', '.js']
			},
			output: {
				filename: 'artcodes.js',
				path: path.resolve('./dist'),
			}
		}
	},
];