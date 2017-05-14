'use strict';
/**
 *
 */
/**
 * Controller
 */
MainCtrl.$inject = ['$scope', '$stateParams', 'anomalyAgent', 'searchCond', 'paramBuilder', '$timeout'];
function MainCtrl($scope, $stateParams, anomalyAgent, searchCond, paramBuilder, $timeout) {
    /**
     *   init
     */
    searchCond.set(paramBuilder.parse($stateParams), true);

    // 다른 페이지 이동 시
    $scope.$on('$destroy', function () {
        searchCond.clean();
        anomalyAgent.cancelAllRequest();
    });


    $scope.toggleExectute = function () {

        $scope.isWaiting = true;

        $timeout(function () {
            $scope.isWaiting = false;
            var data = {
                status : 'completed'
            }
            $scope.$broadcast('analysis.outlier.data_loaded', data);
        }, 500)

    }
}

module.exports = MainCtrl;
