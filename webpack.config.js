'use strict';

const webpack    = require('webpack'),
      path       = require('path');

const CleanPlugin    = require('clean-webpack-plugin'),
      FaviconsPlugin = require('favicons-webpack-plugin');

const distPath = path.resolve(__dirname, './dist');

let config = {
    entry: "./src/main.js",
    output: {
        path: distPath,
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
            {   test: /\.woff(2)?$/,
                loader: "url-loader?limit=10000&mimetype=application/font-woff"
            },
            {   test: /\.(ttf|eot|svg)$/,
                use: [
                    "url-loader?limit=10000", 
                    "file-loader"
                ]
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
            modernizr$: path.resolve(__dirname, ".modernizrrc"),
            vue$: "vue/dist/vue.esm.js",
            style: path.resolve(__dirname, './src/assets/style')
        }
    },
    plugins: [
        new CleanPlugin([
            distPath
        ]),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery',
            Tether: 'tether'
        })
    ]
};

if (process.env.NODE_ENV === 'production') {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;