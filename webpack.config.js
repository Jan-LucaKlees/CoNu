const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');


const base = {
	entry: './src/CoNu.jsx',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			'title': 'CoNu - Connect the Numbers!',
			'template': 'src/index.html',
			'xhtml': true,
			'base': '/',
		})
  ],
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
				new webpack.DefinePlugin({
					HOSTNAME: JSON.stringify("localhost:8080"),
					DEV_SERVER: argv['$0'].includes('webpack-dev-server')
				})
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
					filename: 'bundle.[contenthash].css'
				}),
				new webpack.DefinePlugin({
					HOSTNAME: JSON.stringify("conu.app"),
					DEV_SERVER: argv['$0'].includes('webpack-dev-server')
				})
			],
			output: {
				filename: 'bundle.[contenthash].js'
			}
		});
	} else {
		return base;
	}
};
