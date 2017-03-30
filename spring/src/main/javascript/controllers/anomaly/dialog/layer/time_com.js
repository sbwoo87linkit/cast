'use strict';
/**
 *
 */
/**
 * Controller
 */
TimeComCtrl.$inject = ['$scope', 'popupLayerStore'];
function TimeComCtrl($scope, popupLayerStore) {
    /**
     *   variables
     */
    var time = $scope.formData.comTimeRange;
    $scope.startDate = time.start;
    $scope.endDate = time.end;
    /**
     *
     */
    $scope.changeDatetime = function(start, end) {
        $scope.startDate = start;
        $scope.endDate = end;

        // set props
        $scope.formData.comTimeRange.start = start;
        $scope.formData.comTimeRange.end = end;

        // close layer
        popupLayerStore.get('anomaly.opt.com_period').closeEl();
    };
    /**
     *   events
     */
    $scope.$on('anomaly.opt.com_period.set_time', function(e, timeRange) {
        $scope.startDate = timeRange.start;
        $scope.endDate = timeRange.end;
    });
}

module.exports = TimeComCtrl;
