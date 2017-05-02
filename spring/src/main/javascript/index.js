'use strict';
/**
 *
 */
var angular = require('angular');

require('angular-route');
require('angular-resource');
require('angular-ui-router');
require('angular-cookies');
require('highcharts-ng');

require('./constants');
require('./directives');
require('./filters');
require('./factories');
require('./services');
require('./controllers');

require('ag-grid').initialiseAgGridWithAngular1(angular);
/**
 *
 */
angular.module('shermanApp', [
        'ngRoute',
        'ngResource',
        'ngCookies',
        'ui.mobius',
        'ui.router',
        'agGrid',
        'highcharts-ng',

        'sherman.constants',
        'sherman.controllers',
        'sherman.directives',
        'sherman.filters',
        'sherman.factories',
        'sherman.services'
    ])
    .controller('MainCtrl', MainCtrl)
    .controller('HeaderCtrl', HeaderCtrl)
    .config(require('./config.js'))
    .run(require('./run.js'));
/**
 * 메인 페이지를 컨트롤 하는 컨트롤러.
 */
MainCtrl.$inject = ['$scope', 'LOCALE', 'FORMAT', 'DEFAULT'];
function MainCtrl($scope, LOCALE, FORMAT, DEFAULT) {
    // $log.log('MainCtrl');

    // 뷰 에서도 상수를 사용하기 위해 추가
    $scope.LOCALE = LOCALE;
    $scope.FORMAT = FORMAT;
    $scope.DEFAULT = DEFAULT;
}
/**
 * route-menu 연동을 위한 컨트롤러.
 */
HeaderCtrl.$inject = ['$scope', '$window'];
function HeaderCtrl($scope, $window) {
    // $log.log('HeaderCtrl');

    $scope.$on('$stateChangeStart', function(evt, toState) {
        $scope.routePaths = [];
        $scope.routePaths.push(toState.name.split('.')[0]);
    });

    // 도움말
    $scope.popupHelpDocument = function() {
        $window.open(
            '/resources/docs/help.html',
            'test',
            'width=1280, height=900, resizable=yes, scrollbars=yes, status=no;'
        );
    };
}
/**
 *   launch angular app
 */
angular.element(document).ready(function() {
    angular.bootstrap(document, ['shermanApp']);
});
