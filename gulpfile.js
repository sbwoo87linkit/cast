'use strict';
/**
*
*/
var pkg = require('./package.json');
var config = require('./node/config.json');
require('./node/global');

var gulp = require('gulp');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var gutil = require('gulp-util');
var props = require('gulp-props');
var banner = require('gulp-banner');
var del = require('del');
var path = require('path');
var exec = require('child_process').exec;
var moment = require('moment');

/**
 * Require Library (npm module)
 */
var LIB_LIST = [
    'ag-grid',
    'angular',
    'angular-cookies',
    'angular-resource',
    'angular-route',
    'angular-ui-router',
    'async',
    'd3',
    // 'highcharts',
    // 'highcharts/modules/heatmap',
    // 'highcharts/modules/exporting',
    // 'highcharts-custom-events',
    'is_js',
    'jquery',
    'jquery-ui',
    'lodash',
    'moment',
    'moment/locale/ko',
    'uuid/v1'
];
/**
 * File Path
 */
var STATIC_PATH = path.join(global.CLIENT_PATH, 'resources');
var VIEWS_PATH = path.join(global.CLIENT_PATH, 'WEB-INF/views');

var JS_PATH = 'spring/src/main/javascript';
var BUILD_PATH = path.join(STATIC_PATH, 'build');
var BUILD_ALL_PATH = path.join(STATIC_PATH, 'build/*');
var BUILD_JS_ALL_PATH = path.join(STATIC_PATH, 'build/*.js');

var INDEX_PATH = path.join(JS_PATH, 'index.js');
var WEBAPP_JS_ALL_PATH = path.join(JS_PATH, '**/*.js');

var VIEW_EJS_ALL_PATH = path.join(VIEWS_PATH, '**/*.jsp');
var DIRECTIVE_HTML_ALL_PATH = path.join(STATIC_PATH, 'common/directives/**/*.html');

var MESSAGE_PATH = 'spring/src/main/resources/message';
var SYSTEM_PROP_PATH = 'spring/src/main/resources-dev/property/system.properties';

/**
 * 서버 제시작 제외 항목(폴더 및 파일)
 */
var SERVER_IGNORE_PATH = [
    'spring/',
    'node_modules/',
    'gulpfile.js',
];

var handleError = function(error) {
    gutil.log(gutil.colors.red('Error: ' + error));
    this.emit('end');
};

// git commit hash 구하기
var _gitHash = '';
function getGitHash(callback) {
    if (_gitHash) {
        callback(_gitHash);
        return;
    }

    exec('git describe --tag', function (err, stdout) {
    // git.short(function (str) {
        _gitHash = stdout.trim();
        callback(_gitHash);
    });
}

/**
*   spring properties 파일 json 변환
*/
gulp.task('props', function () {
    gulp.src(path.join(MESSAGE_PATH, '*.properties'))
        .pipe(props({ namespace: '', space: 2 }))
        .pipe(gulp.dest(BUILD_PATH));

    gulp.src(SYSTEM_PROP_PATH)
        .pipe(props({ namespace: '', space: 2 }))
        .pipe(gulp.dest(BUILD_PATH));
});

/**
 * 브라우저 자동 새로고침 기능 - node
 */
gulp.task('browser-sync-node', ['server', 'dev3'], function() {
    browserSync.init(null, {
        proxy: 'http://localhost:' + config.was.port, // port: 3030
        browser: ['google chrome' /*, 'firefox'*/ ],
        files: [BUILD_ALL_PATH, VIEW_EJS_ALL_PATH, DIRECTIVE_HTML_ALL_PATH],
        // reloadDelay: 2000 // 2sec
        port: config.was.sync_port, // port: 3000
        // logPrefix: 'Sherman',
        // logConnections: true,
        // logLevel: 'debug' // debug, info, silent
    });
});

/**
 * 브라우저 자동 새로고침 기능 - spring: jrebel 사용시 사용가능
 */
gulp.task('browser-sync-spring', ['dev3'], function() {
    browserSync.init(null, {
        proxy: 'http://localhost:' + config.spring.port, // port: 8080
        browser: ['google chrome' /*, 'firefox'*/ ],
        files: [BUILD_ALL_PATH, VIEW_EJS_ALL_PATH, DIRECTIVE_HTML_ALL_PATH],
        // reloadDelay: 2000 // 2sec
        port: config.spring.sync_port, // port: 3002
        // logPrefix: 'Sherman',
        // logConnections: true,
        // logLevel: 'debug' // debug, info, silent
    });
});

/**
 *  서버를 자동 실행 및 변경 파일 감지하여 자동 재시작
 */
gulp.task('server', function() {
    nodemon({
            script: 'node/www', // WAS/API both
            ext: 'js json', // js|json|html 변경 파일 설정
            env: {
                'NODE_ENV': 'development'
            },
            ignore: SERVER_IGNORE_PATH
        })
        .on('start', [], function() {
            console.log('start!');
        })
        .on('restart', function() {
            console.log('restarted!');
        });
});

/**
 * node module 통합 minified
 */
gulp.task('vendor', function() {
    getGitHash(function (gitHash) {
        var b = browserify({
            require: LIB_LIST,
            debug: true
        });
        b.bundle()
            .on('error', handleError)
            .pipe(source('sherman.vendor.min.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(banner('/*! <%= pkg.name %> ' + gitHash + ' ' + moment().format('YYYY-MM-DD') + ' */\n', {
                pkg: pkg
            }))
            .pipe(gulp.dest(BUILD_PATH));
    });
});

/**
 * 메인 페이지 minified
 */
gulp.task('index', function() {
    getGitHash(function (gitHash) {
        var b = browserify({
            entries: [INDEX_PATH],
            debug: true
        });
        b.external(LIB_LIST);
        b.bundle()
            .on('error', handleError)
            .pipe(source('sherman.index.min.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(banner('/*! <%= pkg.name %> ' + gitHash + ' ' + moment().format('YYYY-MM-DD') + ' */\n', {
                pkg: pkg
            }))
            .pipe(gulp.dest(BUILD_PATH));
    });
});

/**
 * 메인 페이지 not minified
 */
gulp.task('index-dev', function() {
    var b = browserify({
        entries: [INDEX_PATH],
        debug: true
    });
    b.external(LIB_LIST);
    b.bundle()
        .on('error', handleError)
        .pipe(source('sherman.index.min.js'))
        .pipe(gulp.dest(BUILD_PATH));
});

/**
 * min 파일에 대한 map 파일 생성
 */
gulp.task('source-maps', function() {
    gulp.src(BUILD_JS_ALL_PATH)
        .on('error', handleError)
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(BUILD_PATH));
});

/**
 * build 폴더의 모든 파일을 삭제
 */
gulp.task('clean', function() {
    return del([BUILD_ALL_PATH]);
});

/**
 * 클라이언트 빌드
 */
gulp.task('build', ['clean'], function () {
    gulp.start(['props', 'vendor', 'index']);
});

/**
 * 자동 개발 모드
 */
// node
gulp.task('dev', ['browser-sync-node']);

// spring
gulp.task('dev2', ['browser-sync-spring']);

/**
 * 자동 개발 모드 2 (not browser-sync, only index)
 */
gulp.task('dev3', ['index-dev'], function() {
    gulp.start('source-maps');

    // 로그분석기 페이지 기능 개발
    gulp.watch([WEBAPP_JS_ALL_PATH])
        .on('change', function(event) {
            console.log('File Status: ' + event.type);
            console.log('Change File:  ' + event.path);
            gulp.start('index-dev');
        })
        .on('error', handleError);
});

/**
 * 수동 개발 모드
 */
gulp.task('default', ['dev3']);
