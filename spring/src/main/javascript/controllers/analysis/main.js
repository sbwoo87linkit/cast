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

        // $scope.isWaiting = true;
        //
        // $timeout(function () {
        //     $scope.isWaiting = false;
        //     var data = {
        //         status : 'completed'
        //     }
        //     $scope.$broadcast('analysis.outlier.data_loaded', data);
        // }, 100)

        $scope.$broadcast('analysis.execute')

        // advAgent.test();
        //
        // advAgent.adv.test();








        // switch($scope.analysis.chart.type) {
        //     case 'Outlier':
        //         console.log('Outlier')
        //
        //         advAgent.getId().then(function(d) {
        //             $scope.data = d;
        //             console.log(d)
        //             advAgent.getData(d.data.sid).then(function(d) {
        //                 $scope.data = d;
        //                 console.log(d)
        //             });
        //         });
        //
        //         break;
        //     case 'Line plot':
        //         console.log('Line plot')
        //         break;
        //     default:
        //         console.log('none - analysis.MainCtrl')
        // }


    }
}

module.exports = MainCtrl;
