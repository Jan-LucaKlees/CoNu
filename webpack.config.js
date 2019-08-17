const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');


// Base config, mostly rules
const baseConfig = {
	entry: './src/CoNu.jsx',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.(png|svg|jpg|gif|ico)$/,
				use: [ 'file-loader' ]
			},
			{
				test: /(browserconfig\.xml|site\.webmanifest)$/,
				use: [ 'file-loader' ]
			},
		]
	},
	plugins: [
  ],
	resolve: {
		extensions: ['*', '.js', '.jsx', '.scss']
	},
	output: {
		filename: 'bundle.js'
	}
};

// Basic HtmlWebpackPlugin Configuration
const HtmlWebpackPluginBase = {
	'title': 'CoNu - Connect the Numbers!',
	'template': 'src/index.html',
	'xhtml': true
};

// Configuration for conu.app
const officialWebsiteConfig ={
	plugins: [
		new HtmlWebpackPlugin( merge( HtmlWebpackPluginBase, {
			'base': '/',
		}) ),
  ],
	output: {
		path: __dirname + '/public',
		publicPath: '/',
	}
};

// Configuration for GitHub pages
const githubPagesConfig = {
	plugins: [
		new HtmlWebpackPlugin( merge( HtmlWebpackPluginBase, {
			'base': '/conu/',
		}) ),
  ],
	output: {
		path: __dirname + '/docs',
		publicPath: '/conu/',
	}
}

module.exports = (env = {}, argv) => {
	const flavoredBase = env.BUILD_FOR_GITHUB_PAGES ?
		merge( baseConfig, githubPagesConfig ) : merge( baseConfig, officialWebsiteConfig );

	if (argv.mode === 'development') {
		return merge( flavoredBase, {
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
					HOSTNAME: JSON.stringify( env.BUILD_FOR_GITHUB_PAGES ? "localhost:8081" : "localhost:8080" ),
					DEV_SERVER: argv['$0'].includes('webpack-dev-server')
				})
			],
			devServer: {
				contentBase: env.BUILD_FOR_GITHUB_PAGES ? './docs' : './public',
				hot: true
			}
		});
	} else if (argv.mode === 'production') {
		return merge( flavoredBase, {
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
					HOSTNAME: JSON.stringify( env.PREVIEW ? "localhost:5000" : "conu.app" ),
					DEV_SERVER: argv['$0'].includes('webpack-dev-server')
				})
			],
			output: {
				filename: 'bundle.[contenthash].js'
			}
		});
	} else {
		return flavoredBase;
	}
};
