'use strict';
/**
 *
 */
/**
 * Controller
 */
MainCtrl.$inject = ['$scope', '$stateParams', 'anomalyAgent', 'advAgent', 'searchCond', 'paramBuilder', '$timeout', 'popupBox'];
function MainCtrl($scope, $stateParams, anomalyAgent, advAgent, searchCond, paramBuilder, $timeout, popupBox) {
    /**
     * Scope variable
     */

    $scope.adv = {
        fieldOptions : {}
    };

    // $scope.adv.isReadyToExecute = false;

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
        // console.log('$scope.adv.isReadyToExecute', $scope.adv.isReadyToExecute);

        $scope.$broadcast('adv.execute')
    }
}

module.exports = MainCtrl;
