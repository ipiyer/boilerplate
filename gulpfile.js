'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  gutil = require('gulp-util'),
  plugins = gulpLoadPlugins(),

  compass = require("gulp-compass"),
  paths = {
    js: ['./*.js', '!node_modules/**', '!public/js/**',
      'config/**/*.js', 'apps/{controllers,middleware,model,routes}/**/*.js',
      'lib/**', 'utils/**/*.js'
    ],
    staticJS: ['public/js/*.js'],
    unitTest: ['test/unit/**/*.js'],
    templates: ['apps/views/**/*.hbs'],
    cssDir: ['public/css'],
    css: ['public/css/*.css'],
    webComponents: ['public/elements/*.html'],
    sass: ["public/css/sass/*.scss"],
    sass_includes: ["public/css/sass_includes",
      "public/bower_components/bootstrap/scss",
      "public/bower_components/bootstrap/scss/mixins",
      "public/bower_components/font-awesome/scss"
    ]
  },
  config = require("./config/config"),
  path = require("path");

var defaultTasks = ['clean', 'serve', 'watch', 'compass'];

gulp.task('compass', function() {
  gulp.src(paths.sass)
    .pipe(compass({
      css: 'public/css',
      sass: 'public/css/sass',
      image: 'public/img',
      import_path: paths.sass_includes,
      generated_images_path: 'public/img'
    }))
    .once('error', function(err) {
      console.log(err);
    })
    .pipe(plugins.livereload());
});

gulp.task('hbs', function() {
  gulp.src(paths.templates)
    .pipe(plugins.livereload());
});

gulp.task('staticJS', function() {
  gulp.src(paths.staticJS)
    .pipe(plugins.livereload());
});

gulp.task('env:development', function() {
  process.env.NODE_ENV = 'development';
});

gulp.task('debug', function() {
  gulp.src(["server.js"])
    .pipe(plugins.nodeInspector({
      debugBrk: true,
      debugPort: 5858,
      webHost: 'localhost',
      webPort: 1337,
      nodejs: ["--harmony"],
      saveLiveEdit: false,
      preload: false,
      inject: true,
      hidden: [],
      stackTraceLimit: 50,
      sslKey: '',
      sslCert: ''
    }));
});


gulp.task('pre-test', function() {
  return gulp.src(paths.js)
    // Covering files
    .pipe(plugins.istanbul())
    // Force `require` to return covered files
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('unit-test', function() {
  return gulp.src(paths.unitTest, {
      read: false
    })
    .pipe(plugins.mocha({
      reporter: 'Spec',
      bail: true,
      timeout: 1000
    }))
    .once('error', function(err) {
      console.log(err);
    })
    .once('end', function() {
      process.exit();
    });
});

gulp.task('server', function() {
  plugins.nodemon({
    script: 'server.js',
    legacyWatch: true,
    watch: paths.js,
    env: {
      'NODE_ENV': 'development',
      'PORT': 9000
    },
    ignore: ['node_modules/'],
    nodeArgs: ['--debug', '--es_staging', '--harmony']
  });
});

gulp.task('dev-server', ['debug', 'server', 'watch', 'compass']);


gulp.task('watch', function() {
  plugins.livereload.listen({
    interval: 500
  });

  gulp.watch(paths.staticJS, {
    usePolling: true
  }, ['staticJS']);

  gulp.watch(paths.sass, {
    usePolling: true
  }, ['compass']);

  gulp.watch(paths.templates, {
    usePolling: true
  }, ['hbs']);
});
