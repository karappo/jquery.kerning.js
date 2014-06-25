module.exports = (grunt)->
  grunt.initConfig
    pkg: grunt.file.readJSON('kerning.jquery.json')
    banner: '/*! <%= pkg.name || pkg.title %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n'

    clean:
      files: 'dist'
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
    qunit:
      files: 'test/**/*.html'
    jshint:
      gruntfile:
        options:
          jshintrc: '.jshintrc'
        src: 'Gruntfile.js'
      src:
        options:
          jshintrc: 'src/.jshintrc'
        src: 'src/**/*.js'
      # test:
      #   options:
      #     jshintrc: 'test/.jshintrc'
      #   src: ['test/**/*.js']
    watch:
      files: ['**/*.coffee','**/*.html']
      tasks: ['coffee']
      options:
        livereload: true
    coffee:
      compile:
        options:
          bare: true
          # sourceMap: true
        files: [
          expand: true
          cwd: 'src/'
          src: ['**/jquery.*.coffee']
          dest: 'dist/'
          rename: (dest, src) -> 
            dest + src.replace('.coffee', '.js')
        ]
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
  grunt.registerTask 'build', ['coffee','jshint','qunit','clean','concat','uglify']
  # grunt.registerTask 'default', ['jshint','clean','concat','uglify']
