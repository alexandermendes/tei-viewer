var webpack = require('webpack');

module.exports = function(grunt) {
    grunt.initConfig({

        modernizr: {
            build: {
                "parseFiles": true,
                "customTests": [],
                "devFile": "./node_modules/modernizr/src/Modernizr.js",
                "dest": "./assets/js/custom-modernizr.js",
                files: {
                    src: [
                        './_js/utils/check-html5.js',
                    ]
                },
                "uglify": true
            }
        },

        webpack: {
            dev: {
                entry: "./_js/main.js",
                output: {
                    path: "./assets/js",
                    filename: "bundle.js",
                },
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: 'babel-loader',
                            query: {
                                presets: ['es2015']
                            }
                        }
                    ]
                }
            },
            build: {
                entry: "./_js/main.js",
                output: {
                    path: "./assets/js",
                    filename: "bundle.js",
                },
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: 'babel-loader',
                            query: {
                                presets: ['es2015']
                            }
                        }
                    ]
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    })
                ]
            }
        },

        concat: {
            js: {
                src: [
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/pace-progress/pace.js',
                    'node_modules/tether/dist/js/tether.js',
                    'node_modules/bootstrap/dist/js/bootstrap.js',
                    'node_modules/db.js/dist/db.min.js',
                    'node_modules/pnotify/dist/pnotify.js',
                    'node_modules/pnotify/dist/pnotify.buttons.js',
                    'node_modules/dropzone/dist/dropzone.js',
                    'node_modules/jszip/dist/jszip.min.js',
                    'node_modules/datatables.net/js/jquery.dataTables.js',
                    'node_modules/datatables.net-buttons/js/dataTables.buttons.js',
                    'node_modules/datatables.net-buttons/js/buttons.html5.js',
                    'node_modules/datatables.net-buttons/js/buttons.colVis.js',
                    'node_modules/datatables.net-select/js/dataTables.select.js',
                    'node_modules/datatables.net-colreorder/js/dataTables.colReorder.js',
                    'node_modules/file-saver/FileSaver.js'
                ],
                dest: 'assets/js/vendor.bundle.js',
                nonull: true
            },
            css: {
                src: [
                    'node_modules/pace-progress/themes/blue/pace-theme-minimal.css',
                    'node_modules/bootstrap/dist/css/bootstrap.css',
                    'node_modules/font-awesome/css/font-awesome.css',
                    'node_modules/pnotify/dist/pnotify.css',
                    'node_modules/pnotify/dist/pnotify.buttons.css',
                    'node_modules/pnotify/dist/pnotify.brighttheme.css',
                    'node_modules/codemirror/lib/codemirror.css',
                    'node_modules/dropzone/dist/dropzone.css',
                    'node_modules/datatables.net-bs/css/dataTables.bootstrap.css',
                    'node_modules/pygments-css/default.css'
                ],
                dest: 'assets/css/vendor.bundle.css',
                nonull: true
            }
        },

        copy: {
            fontawesome: {
                expand: true,
                dot: true,
                cwd: 'node_modules/font-awesome',
                src: ['fonts/*.*'],
                dest: 'assets/'
            }
        },

        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['./_js/*.js', './_js/**/*.js'],
                tasks: ['webpack:dev', 'modernizr']
            }
        },
    });

    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('build', ['modernizr:build', 'webpack:build', 'concat', 'copy']);
    grunt.registerTask('dev', ['build', 'watch']);
};
