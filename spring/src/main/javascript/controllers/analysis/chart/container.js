'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */

/*


 ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragulaService'];
 function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragulaService) {


 */

ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragularService', '$rootScope', '$filter'];
function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragularService, $rootScope, $filter) {


    /**
     * 데이터 로드
     */

    var model = dataModel.get();
    $scope.analysis.datamodel_id = model.id;
    $scope.fieldList = model.fields.selected;

    $scope.fieldList[0].filters = [{key:'=', value: '1000'}];
    $scope.fieldList[1].filters = [{key:'>', value: '555'}, {key:'!=', value: '99000'}];

    $scope.hasFilters = function(field) {
        return field.filters && field.filters.length > 0 ? true : false;
    }


    $scope.outlier_top = [];



    /**
     * Drag & Drop setup
     */

    var containerLeft = document.querySelector('#containerLeft'),
        containerRight = document.querySelector('#containerRight');

    function accepts(el, target, source) {
        if (source === containerLeft || source === target) {
            // limit 1
            if ($scope.outlier_top.length < 1) {
                return true;
            }
        }
    }

    dragularService([containerLeft], {
        containersModel: [$scope.fieldList],
        copy: true,
        //move only from left to right
        accepts: accepts
    });

    dragularService([containerRight], {
        containersModel: [$scope.outlier_top],
        removeOnSpill: true,
        //move only from left to right
        accepts: accepts,
        moves: function (el, source, handle, sibling) {
            // return handle.classList.contains('dragula-handle');
        }
    });


    /**
     *  Scope 변수
     */

    // $scope.analysis = {}; // MainCtrl에서 defien

    $scope.chartGroups = [
        {
            name: '시계열', items: [
            {type: 'Line plot', icon: 'line', description: 'Line plot description'},
            {type: 'Scatter plot', icon: 'plot', description: 'Scatter plot description'},
            {type: 'Motion', icon: 'motion', description: 'Motion description'}
        ]
        },
        {
            name: '분포', items: [
            {type: 'Histogram', icon: 'histogram', description: 'Histogram description'},
            {type: 'Bar chart', icon: 'bar', description: 'Bar chart description'},
            {type: 'Pie chart', icon: 'pie', description: 'Pie chartdescription'}
        ]
        },
        {
            name: '관계형', items: [
            {type: 'Shanky', icon: 'shanky', description: 'Shanky description'},
            {type: 'Heatmap', icon: 'heatmap', description: 'Heatmap description'}
        ]
        },
        {
            name: '이상치', items: [
            {type: 'Outlier', icon: 'outlier', description: 'Outlier description'},
            {type: '차트유형선택', icon: 'none', description: 'none'}
        ]
        }
    ];


    // 선택한 차트유형
    $scope.analysis.chart = {type: '차트 유형 선택', icon: 'none', description: 'select chart'};


    // TODO test init
    $scope.analysis.chart = $scope.chartGroups[3].items[0];

    // /**
    //  *
    //  * Function
    //  */
    //

    $scope.closeAllLayers = function () {
        popupLayerStore.get('analysis.filter.add').closeEl();
        popupLayerStore.get('analysis.filter.edit').closeEl();
    }

    $scope.changeChart = function (chart) {
        $scope.analysis.isReayToExecute = false;
        $scope.analysis.chart = chart;
    }

    var hideTimer;
    $scope.showDescription = function (chart) {
        // 분석유형선택 팝업 차트유형 마우스오버된 차트
        $timeout.cancel(hideTimer);
        $scope.analysis.tempChart = chart;
    }

    $scope.hideDescription = function () {
        hideTimer = $timeout(function () {
            $scope.analysis.tempChart = null;
        }, 500)
    }

    /**
     * Filter selection
     */


    $scope.models = {"=":"=" ,">":">", ">=": ">=", "<=": "<=", "!=": "!="};
    $scope.formData = {model: '>'};


    // $scope.filterOptions = ['=', '>']

    $scope.selectField = function (field) {
        $scope.analysis.tempFilters = angular.copy(field.filters);
        if (!$scope.analysis.tempFilters || $scope.analysis.tempFilters.length === 0) {
            $scope.analysis.tempFilters = [];
            $scope.analysis.tempFilters.push({key : '=', value: '' });
        }
    }

    $scope.addTempFilter = function (inputFilter) {
        $scope.analysis.tempFilters.push({key : '=', value: '' });
    }

    $scope.deleteTempFilter = function (index, tempFilter) {
        if ($scope.analysis.tempFilters.length === 1) {
            tempFilter.value = '';
            return;
        }
        $scope.analysis.tempFilters.splice(index, 1);
    }

    $scope.saveFilter = function (field, tempFilters) {
        $scope.closeAllLayers();
        _.remove(tempFilters, function (filter) {
            return filter.value === null || filter.value === '';
        });
        field.filters = angular.copy(tempFilters);
    }




    /**
     * Filter tab
     */

    $scope.analysis.filter = {}

    $scope.deleteFilter = function (index, filters) {
        filters.splice(index, 1);
    }


}

module.exports = ContainerCtrl;
