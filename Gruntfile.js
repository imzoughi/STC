module.exports = function (grunt) {
    require('jit-grunt')(grunt);

    grunt.initConfig({

        //Bake external includes into files to create static pages with no server-side compilation time
        bake: {
            build: {
                files: {
                    // files go here, like so:

                    "dist/index.html": "index.html",
                    "dist/home.html": "home.html",

                    // etc ...
                }
            },
        },

        // Validate files with JSHint
        jshint: {
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            },
            all: ['javascript/**/*.js', '!bower_components/*.js', '!javascript/plugins/*.js', 'Gruntfile.js']
        },

        //Compile LESS files to CSS
        less: {
            development: {
                options: {
                    paths: ["less/**/*.less"],
                    optimization: 2,
                    sourceMap: true,
                    dumpLineNumbers: 'comments'
                },
                files: {
                    'dist/stylesheets/main.css': 'less/main.less',
                },
            },
        },

        // Minify JavaScript files with UglifyJS
        uglify: {
            dir: {
                options: {
                    mangle: true,
                    beautify: false,
                },
                files: {
                    'dist/javascript/vendors.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/bootstrap/dist/js/bootstrap.js',
                        'javascript/plugins/modernizr.js',
                        'javascript/plugins/jquery.menu-aim.js',
                        'javascript/plugins/picturefill.min.js',
                        'javascript/plugins/jquery.matchHeight-min.js',
                        'javascript/plugins/slick.min.js',
                        'javascript/plugins/owl.carousel.min.js',
                        
                    ],

                    'dist/javascript/main.js': ['javascript/*.js'],
                },
            },
            dev: {
                options: {
                    mangle: false,
                    beautify: true,
                },
                files: {
                    'dist/javascript/vendors.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/bootstrap/dist/js/bootstrap.js',
                        'javascript/plugins/modernizr.js',
                        'javascript/plugins/jquery.menu-aim.js',
                        'javascript/plugins/picturefill.min.js',
                        'javascript/plugins/jquery.matchHeight-min.js',
                        'javascript/plugins/slick.min.js',
                        'javascript/plugins/owl.carousel.min.js',
                        
                    ],
                    'dist/javascript/main.js': ['javascript/**/*.js'],
                },
            },
        },

        // Copy files and folders
        copy: {
            main: {
                files: [
                    {expand: true, src: ['images/**'], dest: 'dist', filter: 'isFile'},
                    {expand: true, src: ['fonts/**'], dest: 'dist', filter: 'isFile'}
                ],
            },
        },

        // Parse CSS and add vendor-prefixed CSS properties using the Can I Use database. Based on Autoprefixer.
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie', 'ff', 'chrome']
            },
            dist: {
                multiple_files: {
                    src: 'dist/stylesheets/*.css',
                    dest: 'dist/stylesheets/'
                }
            }
        },

        // Run predefined tasks whenever watched file patterns are added, changed or deleted
        watch: {
            styles: {
                files: ['less/**/*.less'], // which files to watch
                tasks: ['less', 'autoprefixer'],
                options: {
                    interrupt: true,
                    atBegin: true,
                },
            },
            js: {
                files: ['javascript/*.js', '!javascript/min.js'], // which files to watch
                tasks: ['jshint', 'uglify:dev'],
                options: {
                    interrupt: true,
                    atBegin: true,
                },
            },
            html: {
                files: ['*.html', 'includes/**/*.html'], // which files to watch
                tasks: ['bake:build'],
                options: {
                    interrupt: true,
                    atBegin: true,
                },
            },
        },

        // Live CSS reload & Browser Syncing
        browserSync: {
            bsFiles: {
                src: [
                    'dist/stylesheets/*.css',
                    'dist/javascript/*.js',
                    'dist/*.html',
                    '*.html',
                    'dist/images/*.jpg',
                    'dist/images/*.png',
                    'dist/images/**/*.svg'
                ]
            },
            options: {
                watchTask: true,
                debugInfo: true,
                server: {
                    baseDir: "./"
                }
            }
        },
        responsive_images: {
            img: {
                options: {
                    sizes: [{
                        name: 'lazy',
                        upscale: false,
                        width: 20,
                        quality: 50
                    }, {
                        name: 'small',
                        upscale: false,
                        // width: 640
                        width: '27.350428%',
                        quality: 85
                    }, {
                        name: 'medium',
                        upscale: false,
                        // width: 1170
                        width: '50%',
                        quality: 85
                    }, {
                        name: "retina",
                        upscale: false,
                        // width: 2340,
                        width: '100%',
                        quality: 80
                    }]
                },
                files: [{
                    expand: true,
                    src: ['*.{jpg,gif,png}'],
                    cwd: 'temp',
                    dest: 'dist/images/'
                }]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-browser-sync');

    grunt.registerTask('deployProd', ['bake:build', 'copy', 'less', 'uglify:dir']);
    grunt.registerTask('default', ['copy', 'less', 'uglify:dev', 'browserSync', 'watch']);
    grunt.registerTask('images', ['responsive_images:img','default']); // For Static img Formats
};
