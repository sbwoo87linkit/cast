'use strict';
/**
 *
 */
/**
 * Controller
 */
MainCtrl.$inject = ['$scope', '$stateParams', 'anomalyAgent', 'advAgent', 'searchCond', 'paramBuilder', '$timeout'];
function MainCtrl($scope, $stateParams, anomalyAgent, advAgent, searchCond, paramBuilder, $timeout) {
    /**
     * Scope variable
     */

    $scope.analysis = {};


    /**
     *   init
     */
    searchCond.set(paramBuilder.parse($stateParams), true);

    // 다른 페이지 이동 시
    $scope.$on('$destroy', function () {
        searchCond.clean();
        anomalyAgent.cancelAllRequest();
    });

    $scope.toggleExecute = function () {
        $scope.$broadcast('analysis.execute')
    }
}

module.exports = MainCtrl;
