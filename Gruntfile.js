module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // javascript syntax checking
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'src/**/*.js'
      ]
    },

    browserify: {
      dist: {
        files: {
          'dist/dungeon.js': ['src/index.js'],
        }
      }
    }
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');

  // tasks
  grunt.registerTask('build', ['jshint:all', 'browserify:dist']);
};
