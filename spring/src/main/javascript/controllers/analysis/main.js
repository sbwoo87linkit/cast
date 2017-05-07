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

    // 결과를 기다리는 중 로딩아이콘
    // $scope.isWaiting = true;


    $scope.toggleExectute = function () {
        // debugger
        $scope.isWaiting = !$scope.isWaiting;
        // console.log('execute', $scope.isWaiting)
    }
}

module.exports = MainCtrl;
