'use strict';

const webpack = require('webpack'),
      path    = require('path');

let config = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: "/dist/",
        filename: "build.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.s[a|c]ss$/,
                use: [
                    "css-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    "url-loader?limit=10000",
                    "img-loader"
                ]
            },
            {
                test: /\.xsl$/,
                use: 'raw-loader'
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: require.resolve("pace-progress"),
                loader: "imports-loader?define=>false"
            },
            {
                test: /\.modernizrrc?$/,
                use: [
                    "modernizr-loader",
                    "json-loader"
                ]
            }
        ]
    },
    resolve: {
        alias: {
            modernizr$: path.resolve(__dirname, '.modernizrrc'),
            vue$: 'vue/dist/vue.esm.js'
        }
    }
};

if (process.env.NODE_ENV === 'production') {
    module.exports.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ]
}

module.exports = config;
