module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON('kerning.jquery.json')
    banner: '/*! <%= pkg.name || pkg.title %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'

    coffee:
      main_files:
        options:
          bare: true
          sourceMap: true
        files: [
          expand: true # これないとcompileされない
          cwd: 'src/'
          src: ['**/*.coffee']
          dest: 'src/'
          rename: (dest, src) ->
            dest + src.replace('.coffee', '.js')
        ]
      test_files:
        options:
          bare: true
          sourceMap: true
        files: [
          expand: true # これないとcompileされない
          cwd: 'test/'
          src: ['*.coffee']
          dest: 'test/'
          rename: (dest, src) ->
            dest + src.replace('.coffee', '.js')
        ]
    qunit:
      files: 'test/**/*.html'
    concat:
      options:
        banner: '<%= banner %>'
        stripBanners: true
      dist:
        src: 'src/jquery.kerning.js'
        dest: 'dist/jquery.kerning.js'
    uglify:
      options:
        banner: '<%= banner %>'
      dist:
        src: '<%= concat.dist.dest %>'
        dest: 'dist/jquery.kerning.min.js'
    clean:
      files: 'dist'
    watch:
      files: ['**/*.coffee','**/*.html']
      tasks: ['coffee','clean','concat','uglify']
      options:
        livereload: true
    connect:
      site: {}
      # site:
      #   options:
      #     port: 3000
      #     keepalive: true
      #     hostname: 'localhost'

  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-qunit'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-connect'

  grunt.registerTask 'default', ['connect','watch']
  grunt.registerTask 'build', ['coffee','qunit','clean','concat','uglify']
  # grunt.registerTask 'default', ['jshint','clean','concat','uglify']
