const webpack = require('webpack');
const path = require('path');
const globalConfig = require('./src/config.js');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const babelLoaderConfig = {
  presets: ['latest', 'stage-0', 'react'],
  plugins: [['import', {libraryName: 'antd', style: true}]],
  cacheDirectory: true,
};

const lessLoaderVars = {
  sidebarCollapsible: globalConfig.sidebar.collapsible,
};

const vendorLibs = ['react', 'react-router',
  'redux', 'react-redux', 'redux-logger', 'redux-thunk', 'redux-promise',
  'superagent',
];

module.exports = {
  devtool: 'cheap-module-source-map',

  entry: [
    'babel-polyfill',
    './src/index.js',
  ],

  output: {
    path: __dirname + '/dist',
    filename: 'bundle.min.js',
    // publicPath: 'http://mycdn.com/', 
  },

  resolve: {
    modulesDirectories: ['node_modules', './src'],
    extensions: ['', '.js', '.jsx'],
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel-loader?' + JSON.stringify(babelLoaderConfig), 'strip-loader?strip[]=logger.info,strip[]=logger.debug,strip[]=console.log,strip[]=console.debug'],
        exclude: /node_modules/,
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css'),
        //loader: 'style!css',
      }, {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style', 'css!' + `less?{"sourceMap":true,"modifyVars":${JSON.stringify(lessLoaderVars)}}`),
        //loader: 'style!css!' + `less?{"sourceMap":true,"modifyVars":${JSON.stringify(lessLoaderVars)}}`,
      }, {
        test: /\.(png|jpg|svg)$/,
        loader: 'url?limit=25000',
      },
    ],
  },

  // https://chrisbateman.github.io/webpack-visualizer/
  // http://stackoverflow.com/questions/34239731/how-to-minimize-the-size-of-webpacks-bundle
  // https://webpack.github.io/docs/code-splitting.html
  // http://survivejs.com/webpack/building-with-webpack/splitting-bundles/

  plugins: [
    
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      minimize: true,
      compress: {warnings: false},
      output: {comments: false},
    }),

    new HtmlWebpackPlugin({
      template: 'index.html.template',
      title: globalConfig.name,
      favIcon: globalConfig.favicon,
      hash: true, 
      minify: {removeComments: true, collapseWhitespace: true},
    }),


    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.min.js',
      minChunks: (module) => {
        var resource = module.resource;
        if (!resource)
          return false;
        for (var libName of vendorLibs) {
          if (resource.indexOf(path.resolve(__dirname, 'node_modules', libName)) >= 0)
            return true;
        }
        return false;
      },
    }),

    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin(),

    new ExtractTextPlugin('bundle.min.css', {allChunks: false}),
    
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0,
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'production' ? 'false' : 'true')),
    }),
  ],
};
