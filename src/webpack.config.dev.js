const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.config.common.js');

module.exports = merge(baseConfig, {
	devtool: 'inline-source-map',
	mode: 'development',
	output: {
		filename: '[name].[contenthash].js',
	}
});