'use strict';
/**
 *
 */
/**
 * Controller
 */
TimeRefCtrl.$inject = ['$scope', 'popupLayerStore'];
function TimeRefCtrl($scope, popupLayerStore) {
    /**
     *   variables
     */
    var time = $scope.formData.refTimeRange;
    $scope.startDate = time.start;
    $scope.endDate = time.end;
    /**
     *
     */
    $scope.changeDatetime = function(start, end) {
        $scope.startDate = start;
        $scope.endDate = end;

        // set props
        $scope.formData.refTimeRange.start = start;
        $scope.formData.refTimeRange.end = end;

        // close layer
        popupLayerStore.get('anomaly.opt.ref_period').closeEl();
    };
    /**
     *   events
     */
    $scope.$on('anomaly.opt.ref_period.set_time', function(e, timeRange) {
        $scope.startDate = timeRange.start;
        $scope.endDate = timeRange.end;
    });
}

module.exports = TimeRefCtrl;
