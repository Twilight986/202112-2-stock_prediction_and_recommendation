const webpack = require('webpack');
const globalConfig = require('./src/config.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');

//  http://stackoverflow.com/questions/33117136/how-to-add-a-query-to-a-webpack-loader-with-multiple-loaders
const babelLoaderConfig = {
  presets: ['latest', 'stage-0', 'react'], 
  plugins: [['import', {libraryName: 'antd', style: true}]],  // https://github.com/ant-design/babel-plugin-import
  cacheDirectory: true,
};

const lessLoaderVars = {
  sidebarCollapsible: globalConfig.sidebar.collapsible,
};

module.exports = {
  devtool: 'eval-source-map',

  entry: [
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    'babel-polyfill', 
    './src/index.js',  
  ],

  output: {  
    path: __dirname + '/dist',
    filename: 'bundle.js',
  },

  resolve: {
    modulesDirectories: ['node_modules', './src'],  
    extensions: ['', '.js', '.jsx'],  
    alias: {
      antdcss: 'antd/dist/antd.min.css',  
    },
  },

  module: {
    loaders: [  
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel-loader?' + JSON.stringify(babelLoaderConfig)], 
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        loader: 'style!css',
      }, {
        test: /\.less$/,
        loader: 'style!css!' + `less?{"sourceMap":true,"modifyVars":${JSON.stringify(lessLoaderVars)}}`,  
      }, {
        test: /\.(png|jpg|svg)$/,
        loader: 'url?limit=25000',  
      },
    ],
  },

  plugins: [
    new webpack.BannerPlugin('This file is created by jxy'),  
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'production' ? 'false' : 'true')),  
    }),
    new HtmlWebpackPlugin({
      template: 'index.html.template',
      title: globalConfig.name,

      favIcon: globalConfig.favicon,
      devMode: true,
    }),
  ],
};
