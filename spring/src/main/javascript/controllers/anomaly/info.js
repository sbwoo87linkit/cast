'use strict';
/**
 *
 */
/**
 * Controller
 */
TopInfoCtrl.$inject = ['$scope', '$state', 'dataModel', 'searchCond'];

function TopInfoCtrl($scope, $state,  dataModel, searchCond) {
    /**
     *   variables
     */
    // NOTE: dataName은 IRIS Table naem을 의미하였지만, Model name으로 변경
    $scope.dataName = dataModel.name();
    $scope.query = searchCond.query();
    /**
     *   버튼 동작
     */
    $scope.backToChoose = function() {
        dataModel.clean();

        $state.go('anomaly_choose_data');
    };
    /**
     *   events
     */
}

module.exports = TopInfoCtrl;
