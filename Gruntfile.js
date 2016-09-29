module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            files: [
                'assets/js/*.js'
            ],
            options: {
                globals: {
                  jQuery: true
                },
                esversion: 6
            }
        },
        modernizr: {
            dist: {
                "parseFiles": true,
                "customTests": [],
                "devFile": "node_modules/modernizr/src/Modernizr.js",
                "dest": "assets/js/dist/custom-modernizr.min.js",
                files: {
                    src: [
                        'assets/js/html5-check.js',
                    ]
                },
                "uglify": true
            }
        },
        webpack: {
            js: {
                // webpack options
                entry: "./assets/js/main.js",
                output: {
                    path: "assets/js/dist/",
                    filename: "packed.js",
                },
                module: {
                    loaders: [{
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel-loader',
                        query: {
                            presets: ['es2015']
                        }
                    }]
                }
            }
        },
        concat: {
            js: {
                src: [
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
                    'node_modules/bootstrap-select/dist/js/bootstrap-select.js',
                    'node_modules/mustache/mustache.js',
                    'node_modules/js-cookie/src/js.cookie.js',
                    'node_modules/db.js/dist/db.min.js',
                    'node_modules/showdown/dist/showdown.js',
                    'node_modules/bootpag/lib/jquery.bootpag.js',
                    'node_modules/codemirror/lib/codemirror.js',
                    'node_modules/codemirror/mode/xml/xml.js',
                    'node_modules/pnotify/dist/pnotify.js',
                    'node_modules/pnotify/dist/pnotify.buttons.js',
                    'node_modules/pnotify/dist/pnotify.confirm.js',
                    'assets/js/table.js',
                    'assets/js/scripts.js'
                ],
                dest: 'assets/js/dist/vendor.js'
            },
            css: {
                src: [
                    'node_modules/pnotify/dist/pnotify.css',
                    'node_modules/pnotify/dist/pnotify.buttons.css',
                    'node_modules/pnotify/dist/pnotify.brighttheme.css'
                ],
                dest: 'assets/css/dist/vendor.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask( 'default', ['jshint', 'modernizr:dist', 'webpack',
                                    'concat']);

};
