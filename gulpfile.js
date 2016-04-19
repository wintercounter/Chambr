var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var _ = require('lodash');

var config = {
  client: {
    standalone: 'ChambrClient',
    entryFile: './src/Client.es6',
    outputDir: './',
    outputFile: 'Client.js'
  },
  worker: {
    standalone: 'ChambrWorker',
    entryFile: './src/Worker.es6',
    outputDir: './',
    outputFile: 'Worker.js'
  },
  test: {
    client: {
      entryFile: './test/Test.Client.es6',
      outputDir: './test/',
      outputFile: 'Test.Client.js'
    },
    worker: {
      entryFile: './test/Test.Worker.es6',
      outputDir: './test/',
      outputFile: 'Test.Worker.js'
    }
  }
}

function bundle(c) {
  return browserify(c.entryFile, {
      debug: true,
      standalone: c.standalone
    })
    .transform(babelify, {
        presets: ["es2015"],
        plugins: [
          "transform-class-properties",
          "syntax-decorators",
          "transform-decorators-legacy",
          "syntax-async-functions",
          "transform-regenerator",
          "transform-function-bind"
        ]
    })
    .bundle()
    .on('error', function(err) { console.log('Error: ' + err.message); })
    .pipe(source(c.outputFile))
    .pipe(gulp.dest(c.outputDir));
}

gulp.task('build-client', function() {
  return bundle(config.client);
});

gulp.task('build-worker', function() {
  return bundle(config.worker);
});

gulp.task('build-test-client', function() {
  return bundle(config.test.client);
});

gulp.task('build-test-worker', function() {
  return bundle(config.test.worker);
});

gulp.task('build', ['build-client', 'build-worker']);
gulp.task('build-test', ['build-test-client', 'build-test-worker']);
gulp.task('build-all', ['build', 'build-test']);