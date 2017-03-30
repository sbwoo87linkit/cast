'use strict';
/**
 *
 */
var moment = require('moment');
/**
 * Controller
 */
ChooseDataCtrl.$inject = ['$scope', '$state', 'errorHandler', 'dataModelAgent', 'searchCond', 'dataModel', 'paramBuilder'];
function ChooseDataCtrl($scope, $state, errorHandler, dataModelAgent, searchCond, dataModel, paramBuilder) {
    /**
    *
    */
    var gotoPivot = function (dataId, data) {
        // set
        dataModel.set(data);
        searchCond.modelId(dataId);

        var params = paramBuilder.serialize(searchCond.get());
        params.jt = (moment().valueOf() + ''); // 신규 job

        // move analysis page
        $state.go('analysis', params);
    };
    /**
    *   grid
    */
    // $scope.currDataName = null;

    $scope.chooseData = function (dataId, row) {
        // 단순히 selected 효과만 부여하는 용도
        row.isSelected = true;

        gotoPivot(dataId, row);
    };
    // $scope.gotoPivot = function ($event, dataId) {
    //     $event.stopPropagation();
    //
    //     gotoPivot(dataId, ...);
    // };
    /**
    *   init
    */
    // cache 데이터를 미리 불러온다.
    $scope.modelList = dataModelAgent.cache.modelList();

    // 데이터 갱신
    dataModelAgent.getList(function(data) {
        for (var i = 0; i < data.length; i++) {
            data[i].columns = _.map(data[i].fields.selected, 'name');
        }
        $scope.modelList = data;
    }, errorHandler.alert);
}

module.exports = ChooseDataCtrl;
