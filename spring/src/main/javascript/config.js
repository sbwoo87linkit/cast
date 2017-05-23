'use strict';
/**
 *
 */
/**
 *   configure app
 */
Config.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider'];
function Config($httpProvider, $stateProvider, $urlRouterProvider) {
    $httpProvider.defaults.cache = false;
    // initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    // disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    /**
     *
     */
    $urlRouterProvider.otherwise(function ($injector, $location) {
        var path = $location.path();

        // 아래 주소를 제외한 주소는 search로 가도록 함.
        var pathMap = {
            '/pivot': true,
            '/analysis': true,
            '/anomaly': true,
            '/report': true,
            '/alert': true,
            '/datamodel': true
        };
        if (!pathMap[path]) {
            path = '/analysis_choose_data';
        }

        var state = $injector.get('$state');
        state.go(path.slice(1), $location.search());
        // NOTE: return string에 params을 달아서 보내는 방식으로 할 때는
        // 초기화할 때 digest 무한 에러난 후 정상 작동함.
        return path;
    });

    // NOTE: querystring은 paramBuilder service 기준으로 설정
    $stateProvider
        // 분석
        .state('analysis_choose_data', {
            url: '/analysis_choose_data',
            templateUrl: '/views/analysis/choose_data.html'
        })
        .state('analysis', {
            url: '/analysis?q&d&t.start&t.end&display',
            templateUrl: '/views/analysis/index.html'
        })
        // 이상 탐지
        .state('anomaly_choose_data', {
            url: '/anomaly_choose_data',
            templateUrl: '/views/anomaly/choose_data.html'
        })
        .state('anomaly', {
            url: '/anomaly?q&d&t.start&t.end&auto_add&display',
            templateUrl: '/views/anomaly/index.html'
        })
        // 테스트
        .state('test', {
            url: '/test',
            templateUrl: '/views/test/index.html'
        })
        ;
}
/**
 *   exports
 */
module.exports = Config;
