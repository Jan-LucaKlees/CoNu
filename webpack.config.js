const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const base = {
	entry: './src/App.jsx',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			}
		]
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.scss']
	},
	output: {
		path: __dirname + '/docs',
		publicPath: '/',
		filename: 'bundle.js'
	}
};

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
		return merge( base, {
			module: {
				rules: [
					{
						test: /\.(sa|sc|c)ss$/,
						use: [ 'style-loader', 'css-loader', 'sass-loader' ]
					}
				]
			},
			plugins: [
				new webpack.HotModuleReplacementPlugin(),
			],
			devServer: {
				contentBase: './docs',
				hot: true
			}
		});
	} else if (argv.mode === 'production') {
		return merge( base, {
			module: {
				rules: [
					{
						test: /\.(sa|sc|c)ss$/,
						use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
					}
				]
			},
			plugins: [
				new MiniCssExtractPlugin({
					filename: 'bundle.css'
				})
			],
		});
	} else {
		return base;
	}
};
