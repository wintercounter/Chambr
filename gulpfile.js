var gulp = require('gulp');
var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var rimraf = require('rimraf');
var source = require('vinyl-source-stream');
var _ = require('lodash');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var config = {
  entryFile: './es6/Boot.es6',
  outputDir: './dist/',
  outputFile: 'boot.js'
};

var config2 = {
  entryFile: './es6/Worker.es6',
  outputDir: './dist/',
  outputFile: 'worker.js'
};

// clean the output directory
gulp.task('clean', function(cb){
    rimraf(config.outputDir, cb);
});

var bundler;
function getBundler(c) {
  bundler = watchify(browserify(c.entryFile, _.extend({ debug: true }, watchify.args)));
  return bundler;
};

function bundle(c) {
  return getBundler(c)
    .transform(babelify, {
        presets: ["es2015"],
        plugins: [
          "transform-class-properties",
          "syntax-decorators",
          "transform-decorators-legacy",
          "syntax-async-functions",
          "transform-regenerator"
        ]
    })
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(c.outputFile))
    .pipe(gulp.dest(c.outputDir))
    .pipe(reload({ stream: true }));
}

gulp.task('build-persistent', function() {
  return bundle(config);
});

gulp.task('build-persistent2', function() {
  return bundle(config2);
});

gulp.task('build', ['build-persistent2', 'build-persistent'], function() {
  process.exit(0);
});

gulp.task('watch', ['build-persistent'], function() {

  browserSync({
    server: {
      baseDir: './'
    }
  });

  getBundler().on('update', function() {
    gulp.start('build-persistent')
  });
});

// WEB SERVER
gulp.task('serve', function () {
  browserSync({
    server: {
      baseDir: './'
    }
  });
});
