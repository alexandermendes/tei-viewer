module.exports = function(grunt) {

    grunt.initConfig({
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        },
        jshint: {
            files: ['Gruntfile.js', 'dist/assets/js/*.js'],
            options: {
                globals: {
                  jQuery: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-gh-pages');

};
