'use strict';

const webpack    = require('webpack'),
      path       = require('path'),
      pathExists = require('path-exists');

const HtmlPlugin              = require('html-webpack-plugin'),
      ExtractTextPlugin       = require('extract-text-webpack-plugin'),
      OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
      CleanPlugin             = require('clean-webpack-plugin'),
      FaviconsPlugin          = require('favicons-webpack-plugin');

const distPath            = path.resolve(__dirname, 'static'),
      baseTemplatePath    = path.resolve(__dirname, 'templates/base.html'),
      customTemplatesPath = path.resolve(__dirname, 'templates/custom');

// pace-progress loader is a fix for https://github.com/HubSpot/pace/issues/328

let config = {
    entry: {
        main: "./_js/main.js"
    },
    output: {
        path: distPath,
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.s[a|c]ss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: "css-loader!sass-loader"
                    }]
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                loader: 'url-loader?limit=10000!img-loader'
            },
            {   test: /\.woff(2)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {   test: /\.(ttf|eot)$/,
                loader: "url-loader?limit=10000!file-loader"
            },
            {   test: /\.svg$/,
                loader: "svg-url-loader!file-loader"
            },
            {
                test: require.resolve("pace-progress"),
                loader: "imports-loader?define=>false"
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            Tether: 'tether'
        }),
        new HtmlPlugin({
            hash: true,
            inject: false,
            filename: baseTemplatePath,
            template: './_base.html',
            alwaysWriteToDisk: true
        }),
        new ExtractTextPlugin('style.css'),
        new OptimizeCssAssetsPlugin({
              cssProcessorOptions: {
                  discardComments: {
                      removeAll: true
                  }
              }
        }),
        new FaviconsPlugin(path.resolve('_img/favicon.png'))
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;