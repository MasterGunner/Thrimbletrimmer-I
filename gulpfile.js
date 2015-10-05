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

gulp.task('build-Xannathor-package', function() {
    //Package Xannathor Server as a node module.
    gulp.src('./bin/Xannathor/**').pipe(vinylPaths(del)).pipe(gulp.dest('./bin/node_modules/Xannathor'));
    gulp.src('./package.json').pipe(gulp.dest('./bin/node_modules/Xannathor')); 
    gulp.src('./README.md').pipe(gulp.dest('./bin/node_modules/Xannathor')); 
    //Copy the Typings to the bin.
    gulp.src('./typings/Xannathor/**').pipe(gulp.dest('./bin/typings/Xannathor')); 
    //Package the Thrimbletrimmer front-end into the node module.
    gulp.src('./EditorPage/**').pipe(gulp.dest('./bin/node_modules/Xannathor/EditorPage'));
    //gulp.src('./Resources/**').pipe(gulp.dest('./bin/node_modules/Xannathor/Resources'));
    //gulp.src('./Videos/**').pipe(gulp.dest('./bin/node_modules/Xannathor/Videos'));  
});

//Minify the output.
var uglify = require('gulp-uglify');
gulp.task('minify', function () {
    return gulp.src('bin/**/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('bin/'));
});

var runSequence = require('run-sequence');
gulp.task('build', function () {
    runSequence('build-Xannathor', 'build-clean', 'build-Xannathor-package');
});