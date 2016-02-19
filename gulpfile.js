'use strict'

var gulp = require('gulp')
var plugins = require('gulp-load-plugins')()
var runSequence = require('run-sequence')

gulp.task('test', function (cb) {
  return gulp.src('./test/**/*.spec.js', { read: false })
    .pipe(plugins.coverage.instrument({
      pattern: ['index.js'],
      debugDirectory: 'debug'
    }))
    .pipe(plugins.mocha())
    .pipe(plugins.coverage.gather())
    .pipe(plugins.coverage.format())
    .pipe(gulp.dest('reports'))
    .on('error', function (error) {
      console.error(error)
      cb(error)
      this.emit('end')
    })
})

gulp.task('jsdoc', function (cb) {
  gulp.src(['README.md', 'index.js'])
    .pipe(plugins.jsdoc3({opts: {destination: './doc'}}, cb))
})

gulp.task('prepare-publish', function () {
  runSequence('test', 'jsdoc', function (error) {
    if (error) {
      return plugins.util.log(error.message)
    }
  })
})
