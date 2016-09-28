module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['assets/js/*.js'],
            options: {
                globals: {
                  jQuery: true
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
                    'assets/js/table.js',
                    'assets/js/scripts.js',
                ],
                dest: 'assets/js/dist/bundle.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.registerTask( 'default', ['jshint', 'concat']);

};
