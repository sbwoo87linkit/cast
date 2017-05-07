'use strict';
/**
 *
 */
/**
 * Controller
 */
TopInfoCtrl.$inject = ['$scope', '$state', 'dataModel', 'searchCond', 'popupLayerStore'];
function TopInfoCtrl($scope, $state, dataModel, searchCond, popupLayerStore) {


    /**
     *   variables
     */
    // NOTE: dataName은 IRIS Table naem을 의미하였지만, Model name으로 변경
    $scope.dataName = dataModel.name();
    var time = searchCond.timeRange();
    $scope.startDate = time.start;
    $scope.endDate = time.end;
    $scope.query = searchCond.query();

    // 특수 필드(time, raw) 존재 여부
    $scope.existTime = dataModel.existTimeField();
    // $scope.existRaw = dataModel.canFullTextSrch();

    $scope.isToggleDate = false;
    $scope.isToggleQuery = false;
    /**
     *   버튼 동작
     */
    $scope.backToChoose = function() {
        dataModel.clean();

        $state.go('analysis_choose_data');
    };
    /**
    *   events
    */
    $scope.openedTimeLayer = function () {
        var time = searchCond.timeRange();
        $scope.startDate = time.start;
        $scope.endDate = time.end;

        $scope.isToggleDate = true;
        $scope.isToggleQuery = false;
    };
    $scope.closedTimeLayer = function () {
        $scope.isToggleDate = false;
    };

    $scope.changeDatetime = function(start, end) {
        $scope.startDate = start;
        $scope.endDate = end;

        // set props
        searchCond.timeRange(start, end);

        popupLayerStore.get('analysis.prop.t_range').closeEl();
        $scope.isToggleDate = false;
    };

    $scope.openedQueryLayer = function () {
        $scope.inputQuery = searchCond.query();

        $scope.isToggleQuery = true;
        $scope.isToggleDate = false;
    };
    $scope.closedQueryLayer = function () {
        $scope.isToggleQuery = false;
    };

    $scope.changeQuery = function(query) {
        // set props
        searchCond.query(query);
        $scope.query = searchCond.query();

        popupLayerStore.get('analysis.prop.query').closeEl();
        $scope.isToggleQuery = false;
    };
    /**
    *   functions
    */


}

module.exports = TopInfoCtrl;
