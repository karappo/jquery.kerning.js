module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON 'package.json'
    watch:
      files: ['**/*.coffee']
      tasks: ['coffee','uglify','clean']
    coffee:
      compile:
        files: [
          expand: true
          cwd: 'script/_src/'
          src: ['**/*.coffee']
          dest: 'script/'
          ext: '.exp.js'
        ]
    uglify:
      compress_target:
        options:
          sourceMap: (fileName) ->
            fileName.replace /\.js$/, '.js.map'
        files: [
          expand: true
          cwd: 'script/'
          src: ['**/*.exp.js']
          dest: 'script/'
          ext: '.js'
        ]
    clean:
      src:['**/*.exp.js']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.registerTask 'default', ['watch']
  return
