'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */

ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', '$filter', 'utility', 'CHART', 'popupBox'];
function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS,
                       searchCond, popupLayerStore, dataModel, $rootScope, $filter, utility, CHART, popupBox) {

    /**
     *  Scope 변수
     */

    $scope.adv = {
        // fieldOptions : {}
    };

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
            {type: 'Sankey', icon: 'sankey', description: 'Sankey description'},
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
    $scope.adv.chart = {type: '차트 유형 선택', icon: 'none', description: 'select chart'};
    // TODO test chart type init

    // lineplot
    $scope.adv.chart = $scope.chartGroups[0].items[0];

    // sankey
    $scope.adv.chart = $scope.chartGroups[2].items[0];

    // motion
    $scope.adv.chart = $scope.chartGroups[0].items[2];

    // heatmap
    $scope.adv.chart = $scope.chartGroups[2].items[1];

    // 각 필드 옵션을 저장
    $scope.adv.fieldOption = {};
    $scope.adv.fieldOption.timeField = {};



    /**
     * 데이터 로드
     */

    var model = dataModel.get();
    $scope.adv.datamodel_id = model.id;
    $scope.fieldList = model.fields.selected;

    $scope.adv.fieldCount = {"name":"Event Object의 개수","type":"TEXT","option":null};

    // TODO filer setup for test purpose only
    // $scope.fieldList[0].filters = [{key:'=', value: '1000'}];
    // $scope.fieldList[1].filters = [{key:'>', value: '555'}, {key:'!=', value: '99000'}];

    $scope.hasFilters = function(field) {
        return field.filters && field.filters.length > 0 ? true : false;
    }

    $scope.outlier_top = [];



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
        $scope.adv.isReayToExecute = false;
        $scope.adv.chart = chart;
    }

    var hideTimer;
    $scope.showDescription = function (chart) {
        // 분석유형선택 팝업 차트유형 마우스오버된 차트
        $timeout.cancel(hideTimer);
        $scope.adv.tempChart = chart;
    }

    $scope.hideDescription = function () {
        hideTimer = $timeout(function () {
            $scope.adv.tempChart = null;
        }, 500)
    }

    /**
     * Filter selection
     */


    $scope.models = {"=":"=" ,">":">", ">=": ">=", "<=": "<=", "!=": "!="};
    $scope.formData = {model: '>'};

    $scope.selectField = function (field) {
        $scope.adv.tempFilters = angular.copy(field.filters);
        if (!$scope.adv.tempFilters || $scope.adv.tempFilters.length === 0) {
            $scope.adv.tempFilters = [];
            $scope.adv.tempFilters.push({key : '=', value: '' });
        }
    }

    $scope.addTempFilter = function (inputFilter) {
        $scope.adv.tempFilters.push({key : '=', value: '' });
    }

    $scope.deleteTempFilter = function (index, tempFilter) {
        if ($scope.adv.tempFilters.length === 1) {
            tempFilter.value = '';
            return;
        }
        $scope.adv.tempFilters.splice(index, 1);
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

    $scope.adv.filter = {}

    $scope.deleteFilter = function (index, filters) {
        filters.splice(index, 1);
    }



    $scope.closePopup = function () {
        utility.closeAllLayers();
    }

    $scope.preventDrop = function ($event) {
        $event.preventDefault();
    }

    $scope.onDropField = function ($event, $data, fieldOpts, field, position, type) {

        //console.log($event, $data, field, position, type)

        if ( type && $data.type != type) {
            popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
            });
            return false;
        }
        fieldOpts.drops[field] = _.cloneDeep($data);

        if (position) {
            utility.openPopupLayer('adv.' + field + '.setting', position, angular.element($event.target));
        }
    };

    // for sankey chart
    $scope.onDropColumnsField = function ($event, $data, fieldOpts, columns, $index) {
        columns[$index] = _.cloneDeep($data);
    }

    $scope.openPopup = function ($event, layer, position) {
        $event.preventDefault();
        utility.openPopupLayer(layer, position, angular.element($event.target));
    };

    // $scope.clearField = function ($event, field) {
    //     // $event.preventDefault();
    //     $event.stopPropagation();
    //     $scope.fieldOpts.drops[field] = null;
    //     utility.closeAllLayers();
    // };

    $scope.clearField = function ($event, fieldOpts, field, index) {
        // $event.preventDefault();
        $event.stopPropagation();
        if (Number.isInteger(index)) {
            // sankey
            fieldOpts.drops[field][index] = {};
        } else {
            fieldOpts.drops[field] = null;
        }
        utility.closeAllLayers();
    };

    // for sankey. delete fields
    $scope.deleteField = function (columns, $index) {
        columns.splice($index, 1);
    }

    $scope.addField = function (columns) {
        if (CHART.COLUMN_MAX_COUNT === columns.length) {
            popupBox.alert('더이상 컬럼을 추가할 수 없습니다.', function clickedOk() {
            });
            return false;
        }
        columns.splice(columns.length-1, 0, {});
    }


    // sankey column remove(비우기)

    //

    window.onresize = function () {
        utility.closeAllLayers();
    };





}

module.exports = ContainerCtrl;
