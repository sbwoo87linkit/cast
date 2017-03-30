'use strict';
/**
 *
 */
/**
 * Controller
 */
MainCtrl.$inject = ['$scope', '$stateParams', 'anomalyAgent', 'searchCond', 'paramBuilder'];
function MainCtrl($scope, $stateParams, anomalyAgent, searchCond, paramBuilder) {
    /**
    *   init
    */
    searchCond.set(paramBuilder.parse($stateParams), true);

    // 다른 페이지 이동 시
    $scope.$on('$destroy', function () {
        searchCond.clean();
        anomalyAgent.cancelAllRequest();
    });
}

module.exports = MainCtrl;
