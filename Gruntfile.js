module.exports = function (grunt) {
  'use strict';

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jsfiles: [
      'src/js/*.js',
      'Gruntfile.js',
      '!*.min.js'
    ],

    watch: {
      js: {
        files: ['src/js/*.js'],
        tasks: ['newer:jshint:all']
      },
      jsTest: {
        files: ['test/unit/*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      styles: {
        files: ['src/css/*.css'],
        tasks: ['autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          'examples/{,*/}*.html',
          'examples/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          'src/css/(,*/}*.css'
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        // Change this to '*' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          keepalive: true,
          base: [
            'examples',
            'bower_components',
            'src'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            'examples',
            'bower_components',
            'src',
            'test/'
          ]
        }
      },
      dist: {
        options: {
          base: 'dist/'
        }
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/{,*/}*.js', 'test/e2e/{,*/}.js']
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 5 version', 'ie >= 8']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/css/',
          src: '{,*/}*.css',
          dest: 'dist/css/'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src/js/',
          src: '{,*/}*.js',
          dest: 'src/js/'
        }]
      }
    },

    cssmin: {
      dist: {
        files: {
          'dist/css/ng-magnify.min.css': ['src/css/ng-magnify.css']
        }
      }
    },

    uglify: {
      dist: {
        files: {
          'dist/js/ng-magnify.min.js': ['src/js/ng-magnify.js']
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
      /*
      custom: {
        configFile: 'karma.conf.js',
        autoWatch: true,
        singleRun: false
      }
      */
    }
  });

  grunt.registerTask('serve', [
    'autoprefixer',
    'connect:livereload',
    'watch'
  ]);

  grunt.registerTask('test', [
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'autoprefixer',
    'cssmin',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
