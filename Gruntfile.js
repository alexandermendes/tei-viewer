module.exports = function(grunt) {

    grunt.initConfig({

        jshint: {
            files: [
                'assets/js/**/*.js'
            ],
            options: {
                boss: true,
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
                "dest": "assets/dist/js/custom-modernizr.min.js",
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
                entry: "./assets/js/main.js",
                output: {
                    path: "./assets/dist/js",
                    filename: "packed.js",
                },
                module: {
                    loaders: [
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: 'babel-loader',
                            query: {
                                presets: ['es2015'],
                                plugins: ['transform-runtime']
                            }
                        }
                    ]
                }
            },
        },

        concat: {
            js: {
                src: [
                    'node_modules/tether/dist/js/tether.js',
                    'node_modules/jquery/dist/jquery.js',
                    'node_modules/bootstrap/dist/js/bootstrap.js',
                    'node_modules/mustache/mustache.js',
                    'node_modules/js-cookie/src/js.cookie.js',
                    'node_modules/db.js/dist/db.min.js',
                    'node_modules/bootpag/lib/jquery.bootpag.js',
                    'node_modules/codemirror/lib/codemirror.js',
                    'node_modules/codemirror/mode/xml/xml.js',
                    'node_modules/pnotify/dist/pnotify.js',
                    'node_modules/pnotify/dist/pnotify.buttons.js',
                    'node_modules/pnotify/dist/pnotify.confirm.js',
                    'node_modules/urijs/src/URI.js',
                    'node_modules/dropzone/dist/dropzone.js'
                ],
                dest: 'assets/dist/js/vendor.js',
                nonull: true
            },
            css: {
                src: [
                    'node_modules/bootstrap/dist/css/bootstrap.css',
                    'node_modules/font-awesome/css/font-awesome.css',
                    'node_modules/pnotify/dist/pnotify.css',
                    'node_modules/pnotify/dist/pnotify.buttons.css',
                    'node_modules/pnotify/dist/pnotify.brighttheme.css',
                    'node_modules/codemirror/lib/codemirror.css',
                    'node_modules/dropzone/dist/dropzone.css',
                    'node_modules/animate.css/animate.css'
                ],
                dest: 'assets/dist/css/vendor.css',
                nonull: true
            }
        },

        copy: {
            fontawesome: {
                expand: true,
                dot: true,
                cwd: 'node_modules/font-awesome',
                src: ['fonts/*.*'],
                dest: 'assets/dist'
            }
        },

        watch: {
            options: {
                livereload: true
            },
            js: {
                files: ['assets/js/**/*.js'],
                tasks: ['webpack', 'modernizr']
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-modernizr');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('dev', ['modernizr:dist', 'webpack', 'concat', 'copy',
                               'watch']);
    grunt.registerTask('build', ['modernizr:dist', 'webpack', 'concat',
                                 'copy']);
    grunt.registerTask('test', ['jshint'])

};
