var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
var del = require('del');
var connect = require('gulp-connect');
var open = require('gulp-open');
var runSequence = require('run-sequence');

var tsProject = ts.createProject('tsconfig.json', {
  noExternalResolve: false
});

gulp.task('build-lib', () => {
  // Include definition files
  var tsResult = tsProject.src()
    .pipe(ts(tsProject));

  return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
    tsResult.dts.pipe(gulp.dest('.')),
    tsResult.js.pipe(gulp.dest('.'))
  ]);
});

gulp.task('reload', () => {
  return gulp
    .src(['lib/**', 'example/**'])
    .pipe(connect.reload());
});

gulp.task('watch', () => {
  gulp.watch('src/**/*.ts', ['build-lib', 'reload']);
  gulp.watch(['src/**/*.html', 'src/**/*.css'], ['reload']);
});

gulp.task('clean', () => {
  return del(['lib']);
});

gulp.task('connect', () => {
  connect.server({
    livereload: true
  });

  return gulp.src('./example2/index.html')
    .pipe(open({
      uri: 'http://localhost:8080/example2'
    }));
});

gulp.task('build', done => {
  runSequence(
    'clean',
    'build-lib',
    done)
});

gulp.task('default', () => {
  runSequence(
    'build',
    ['connect', 'watch']);
  });
