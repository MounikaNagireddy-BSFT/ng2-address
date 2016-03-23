var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var del = require('del');
var connect = require('gulp-connect');
var open = require('gulp-open');
var runSequence = require('run-sequence');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('compile-scripts', () => {
  // Include definition files
  var tsResult = gulp.src(['src/app/**/*.ts'])
    .pipe(ts(tsProject));

  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
    tsResult.dts.pipe(gulp.dest('dist/definitions')),
    tsResult.js.pipe(gulp.dest('dist/js'))
  ]);
});

// Copies the styles and templates to the distribution folder
gulp.task('copy-files', () => {
  return gulp
    .src(['src/**/*.html', 'src/**/*.css'])
    .pipe(gulp.dest('dist'));
});

gulp.task('reload', () => {
  return gulp
    .src(['dist/**'])
    .pipe(connect.reload());
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.ts', ['compile-scripts', 'reload']);
  gulp.watch(['src/**/*.html', 'src/**/*.css'], ['copy-files', 'reload']);
});

gulp.task('clean', () => {
  return del(['dist']);
});

gulp.task('connect', () => {
  connect.server({
    livereload: true
  });

  return gulp.src(__filename)
    .pipe(open({
      uri: 'http://localhost:8080/dist'
    }));
});

gulp.task('build', done => {
  runSequence(
    'clean',
    ['compile-scripts', 'copy-files'],
  done)
});

gulp.task('default', () => {
  runSequence(
    'build',
    ['connect', 'watch']);
  });
