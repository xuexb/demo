var gulp = require('gulp');
var rjs = require("gulp-r");
var requirejs = require('requirejs');


gulp.task('default', function() {
    return gulp.run(['requirejs']);
});

gulp.task('requirejs', function() {
    return gulp.src("src/demo1/test.js")
        .pipe(rjs({
            "include": ["b"],
            "paths": {
                'jquery': '../lib/jquery',
            },
            "baseUrl": "src/demo1/",
            "name": "main.js",
            "out": "dist/your-main-app-file.js",
        }))
        .pipe(gulp.dest("dist/demo1"));
});

gulp.task('xxx', function(done) {
    requirejs.optimize({
        "baseUrl": "src/demo1/",
        "include": [
        ],
        "mainConfigFile": "src/demo1/main.js",
        "out": 'dist/demo1/',
        "paths": {
            'jquery': '../lib/jquery',
        },
    }, function() {
        done();
    }, done);
});