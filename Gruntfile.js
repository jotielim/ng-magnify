module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsfiles: [
            'src/js/*.js',
            'Gruntfile.js',
            '!*.min.js',
        ],
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                forin: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                undef: true,
                strict: true,
                sub: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    define: true,
                    describe: true,
                    expect: true,
                    it: true,
                    module: true,
                    require: true,
                    requirejs: true
                }
            },
            all: {
                src: '<%= jsfiles %>'
            }
        },
        uglify: {
            options: {
                banner: '/*!\n' +
                        // filesSrc is array, need to figure out to get current filename only
                        ' * <%= grunt.task.current.filesSrc %>\n' +
                        ' * <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        ' */\n',
                report: 'min'
            },
            build: {
                files: [
                    {
                        expand: true,
                        cwd: '',
                        src: ['<%= jsfiles %>', '!Gruntfile.js'], // exclude Gruntfile.js
                        dest: '',
                        ext: '.min.js'
                    }
                ]
            }
        },
        watch: {
            files: '<%= jshint.all.src %>',
            tasks: ['test']
        },
        connect: {
            options: {
                port: 8000,
                // Change this to '*' to access the server from outside.
                hostname: 'localhost'
                // livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    keepalive: true,
                    base: [
                        'examples',
                        'bower_components',
                        'src',
                        'dist'
                    ]
                }
            },
            test: {
                options: {
                    port: 8001,
                    base: [
                        'test/'
                    ]
                }
            },
            dist: {
                options: {
                    base: 'dist/'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['jshint', 'uglify']);
    grunt.registerTask('test', ['jshint']);
    grunt.registerTask('serve', ['connect:livereload']);
};
