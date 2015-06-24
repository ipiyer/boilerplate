'use strict';

var gulp = require('gulp'),
  gulpLoadPlugins = require('gulp-load-plugins'),
  through = require('through'),
  gutil = require('gulp-util'),
  plugins = gulpLoadPlugins(),
  compass = require("gulp-compass"),
  paths = {
    js: ['*.js', 'test/**/*.js', '!node_modules/**', 'app/{controllers,models,routes}.js', 'lib/**', 'utils/**/*.js'],
    templates: ['app/views/**/*.hbs'],
    css: ['public/css/*.css'],
    sass: ['public/css/sass/*.scss'],
  };

var defaultTasks = ['clean', 'jshint', 'sass', 'serve', 'watch', 'compass'];


gulp.task('compass', function() {
  gulp.src(paths.sass)
    .pipe(compass({
      css: 'public/css',
      sass: 'public/css/sass',
      image: 'public/img',
      import_path: ["public/components/bootstrap-sass/assets/stylesheets/bootstrap", "public/css/sass_includes"],
      generated_images_path: 'public/img'
    }))
});


gulp.task('env:development', function() {
  process.env.NODE_ENV = 'development';
});

gulp.task('jshint', function() {
  return gulp.src(paths.js)
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'))
    .pipe(count('jshint', 'files lint free'));
});

gulp.task('csslint', function() {
  return gulp.src(paths.css)
    .pipe(plugins.csslint('.csslintrc'))
    .pipe(plugins.csslint.reporter())
    .pipe(count('csslint', 'files lint free'));
});

gulp.task('server', ['env:development'], function() {
  plugins.nodemon({
    script: 'server.js',
    ext: "*.js",
    watch: ['lib', ".", "apps/{controllers,models,routes}"],
    env: {
      'NODE_ENV': 'development',
      'PORT': 9000
    },
    ignore: ['node_modules/'],
    nodeArgs: ['--debug', '--es_staging']
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.js, ['jshint']).on('change', plugins.livereload.changed);
  gulp.watch(paths.template).on('change', plugins.livereload.changed);
  gulp.watch(paths.css, ['csslint']).on('change', plugins.livereload.changed);
  gulp.watch(paths.sass, ['sass']).on('change', plugins.livereload.changed);
  plugins.livereload.listen({
    interval: 500
  });
});

function count(taskName, message) {
  var fileCount = 0;

  function countFiles(file) {
    fileCount++; // jshint ignore:line
  }

  function endStream() {
    gutil.log(gutil.colors.cyan(taskName + ': ') + fileCount + ' ' + message || 'files processed.');
    this.emit('end'); // jshint ignore:line
  }
  return through(countFiles, endStream);
}

gulp.task('development', defaultTasks);