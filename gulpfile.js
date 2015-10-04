var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
//var typescript = require('typescript');
 
var tsProjects = [ts.createProject('Xannathor/tsconfig.json')];
gulp.task('build-Xannathor', function () {
    var output = [];
    tsProjects.forEach(function (tsp) {
        //tsp.typescript = typescript;
        var tsResult = tsp.src().pipe(ts(tsp));
        output.push(tsResult.js.pipe(gulp.dest('./')));
        output.push(tsResult.dts.pipe(gulp.dest('./typings/')));
    });
    return merge(output);
});

gulp.task('build-tests', function () {
    var proj = ts.createProject('tests/tsconfig.json');
    return proj.src().pipe(ts(proj)).js.pipe(gulp.dest('.'));
});


var del = require('del');
var vinylPaths = require('vinyl-paths');
gulp.task('build-clean', function () {
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src('typings/bin/**')
        .pipe(vinylPaths(del))
        .pipe(gulp.dest('typings'));
});

var uglify = require('gulp-uglify');
gulp.task('minify', function () {
    return gulp.src('bin/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('bin/'));
});

var runSequence = require('run-sequence');
gulp.task('build', function () {
    runSequence('build-Xannathor', 'build-tests', 'build-clean', 'minify');
});