var gulp = require('gulp');
var ts = require('gulp-typescript');
var merge = require('merge2');
//var typescript = require('typescript');

//Compile the TypeScript project to JavaScript, and create the definition file.
var tsProjects = [ts.createProject('Xannathor/tsconfig.json')];
gulp.task('build-Thrimbletrimmer', function () {
    var output = [];
    tsProjects.forEach(function (tsp) {
        //tsp.typescript = typescript;
        var tsResult = tsp.src().pipe(ts(tsp));
        output.push(tsResult.js.pipe(gulp.dest('./')));
        output.push(tsResult.dts.pipe(gulp.dest('./typings')));
    });
    return merge(output);
});

//For moving the new definition files from "./typings/bin" to "./typings"
var del = require('del');
var vinylPaths = require('vinyl-paths');
gulp.task('build-clean', function () {
    // the base option sets the relative root for the set of files,
    // preserving the folder structure
    gulp.src('typings/bin/**')
        .pipe(vinylPaths(del))
        .pipe(gulp.dest('typings'));
});

//Build the node_module package.
gulp.task('build-Thrimbletrimmer-package', function() {
    //Package Thrimbletrimmer/Xannathor Server as a node module.
    gulp.src('./package.json').pipe(gulp.dest('./bin/Thrimbletrimmer')); 
    gulp.src('./README.md').pipe(gulp.dest('./bin/Thrimbletrimmer')); 
    gulp.src('./LICENSE').pipe(gulp.dest('./bin/Thrimbletrimmer')); 
    //Copy the Typings to the bin.
    gulp.src('./typings/Thrimbletrimmer/**').pipe(gulp.dest('./bin/typings/Thrimbletrimmer')); 
    //Package the Thrimbletrimmer front-end into the node module.
    gulp.src('./EditorPage/**').pipe(gulp.dest('./bin/Thrimbletrimmer/EditorPage'));
});

//Minify the entire output.
var uglify = require('gulp-uglify');
gulp.task('minify-Thrimbletrimmer-UI', function () {
    return gulp.src('EditorPage/scripts/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('EditorPage/scripts/min'));
});

gulp.task('minify', function () {
    return gulp.src('bin/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('bin/'));
});

var runSequence = require('run-sequence');
gulp.task('build', function () {
    runSequence('minify-Thrimbletrimmer-UI', 'build-Thrimbletrimmer', 'build-clean', 'build-Thrimbletrimmer-package');
});