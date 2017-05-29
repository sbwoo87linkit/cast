'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */

ChartOptionCtrl.$inject = ['$scope', '$timeout', '$stateParams', '$document',
    'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', '$filter'];
function ChartOptionCtrl($scope, $timeout, $stateParams, $document,
                         ADE_PARAMS, searchCond, popupLayerStore, dataModel, $rootScope, $filter) {

    // /**
    //  * 데이터 로드
    //  */
    //
    // var model = dataModel.get();
    // $scope.adv.datamodel_id = model.id;
    // $scope.fieldList = model.fields.selected;
    //
    // $scope.adv.fieldCount = {"name":"Event Object의 개수","type":"TEXT","option":null};
    //
    //
    // // TODO filer setup for test purpose only
    // // $scope.fieldList[0].filters = [{key:'=', value: '1000'}];
    // // $scope.fieldList[1].filters = [{key:'>', value: '555'}, {key:'!=', value: '99000'}];
    //
    // $scope.hasFilters = function(field) {
    //     return field.filters && field.filters.length > 0 ? true : false;
    // }
    //
    // $scope.outlier_top = [];
    //
    // // /**
    // //  * Drag & Drop setup
    // //  */
    // //
    //
    //
    //
    //
    // /**
    //  *  Scope 변수
    //  */
    //
    // // $scope.adv = {};
    //
    // $scope.chartGroups = [
    //     {
    //         name: '시계열', items: [
    //         {type: 'Line plot', icon: 'line', description: 'Line plot description'},
    //         {type: 'Scatter plot', icon: 'plot', description: 'Scatter plot description'},
    //         {type: 'Motion', icon: 'motion', description: 'Motion description'}
    //     ]
    //     },
    //     {
    //         name: '분포', items: [
    //         {type: 'Histogram', icon: 'histogram', description: 'Histogram description'},
    //         {type: 'Bar chart', icon: 'bar', description: 'Bar chart description'},
    //         {type: 'Pie chart', icon: 'pie', description: 'Pie chartdescription'}
    //     ]
    //     },
    //     {
    //         name: '관계형', items: [
    //         {type: 'Shanky', icon: 'shanky', description: 'Shanky description'},
    //         {type: 'Heatmap', icon: 'heatmap', description: 'Heatmap description'}
    //     ]
    //     },
    //     {
    //         name: '이상치', items: [
    //         {type: 'Outlier', icon: 'outlier', description: 'Outlier description'},
    //         {type: '차트유형선택', icon: 'none', description: 'none'}
    //     ]
    //     }
    // ];
    //
    //
    // // 선택한 차트유형
    // $scope.adv.chart = {type: '차트 유형 선택', icon: 'none', description: 'select chart'};
    // // TODO test chart type init
    // $scope.adv.chart = $scope.chartGroups[0].items[0];
    //
    // // /**
    // //  *
    // //  * Function
    // //  */
    // //
    //
    // $scope.closeAllLayers = function () {
    //     popupLayerStore.get('analysis.filter.add').closeEl();
    //     popupLayerStore.get('analysis.filter.edit').closeEl();
    // }
    //
    // $scope.changeChart = function (chart) {
    //     $scope.adv.isReayToExecute = false;
    //     $scope.adv.chart = chart;
    // }
    //
    // var hideTimer;
    // $scope.showDescription = function (chart) {
    //     // 분석유형선택 팝업 차트유형 마우스오버된 차트
    //     $timeout.cancel(hideTimer);
    //     $scope.adv.tempChart = chart;
    // }
    //
    // $scope.hideDescription = function () {
    //     hideTimer = $timeout(function () {
    //         $scope.adv.tempChart = null;
    //     }, 500)
    // }
    //
    //
    // $scope.isCountFieldDraggable = function (chartType) {
    //     var draggable = false;
    //     if (chartType === 'Line plot') {
    //         draggable = true;
    //     }
    //
    //     return draggable;
    // }
    //
    //
    // /**
    //  * Filter selection
    //  */
    //
    //
    // $scope.models = {"=":"=" ,">":">", ">=": ">=", "<=": "<=", "!=": "!="};
    // $scope.formData = {model: '>'};
    //
    // $scope.selectField = function (field) {
    //     $scope.adv.tempFilters = angular.copy(field.filters);
    //     if (!$scope.adv.tempFilters || $scope.adv.tempFilters.length === 0) {
    //         $scope.adv.tempFilters = [];
    //         $scope.adv.tempFilters.push({key : '=', value: '' });
    //     }
    // }
    //
    // $scope.addTempFilter = function (inputFilter) {
    //     $scope.adv.tempFilters.push({key : '=', value: '' });
    // }
    //
    // $scope.deleteTempFilter = function (index, tempFilter) {
    //     if ($scope.adv.tempFilters.length === 1) {
    //         tempFilter.value = '';
    //         return;
    //     }
    //     $scope.adv.tempFilters.splice(index, 1);
    // }
    //
    // $scope.saveFilter = function (field, tempFilters) {
    //     $scope.closeAllLayers();
    //     _.remove(tempFilters, function (filter) {
    //         return filter.value === null || filter.value === '';
    //     });
    //     field.filters = angular.copy(tempFilters);
    // }
    //
    // /**
    //  * Filter tab
    //  */
    //
    // $scope.adv.filter = {}
    //
    // $scope.deleteFilter = function (index, filters) {
    //     filters.splice(index, 1);
    // }


    /**
     *  member variable
     */
    var _dlgID = 'dlgChartOpts';
    var _btnShowDlgID = 'btnShowChartOpts';
    /**
     *  member function
     */
    var _hasAllValidOpts = function () {
        return _.every($scope.optsValid, function (item) {
            return item === true;
        });
    };
    var _updateOpts = function (optPath, value) {
        if (_hasAllValidOpts()) {
            visualOpts.updateOpt(optPath, value);
        }
    };
    var _docClickListener = function (evt) {
        var $target = angular.element(evt.target);
        var $dlg = $('#' + _dlgID);
        var $btnDlg = $('#' + _btnShowDlgID);

        if (!$target.closest($dlg).length && !$target.closest($btnDlg).length) {
            $scope.closeChartOptsDlg();
            $scope.$apply();
        }
    };
    /**
     *  scope variable
     */
    $scope.adv.chartOpts = {};

    // NOTE: js에서 variable 을 설정하지 않아도 markup에서 자동으로 하위 property 설정됩

    // $scope.adv.chartOpts.opts = {
    //     normal : {},
    //     xAxis : {},
    //     yAxis : {},
    //     legend : {}
    // };

    $scope.optsValid = {
        yAxisTickInterval: true,
        yAxisMin: true,
        yAxisMax: true,
        yAxisMinLessThanMax: true,
        sizeMinSize: true
    };

    $scope.tabs = [
        {res: '일반'},
        {res: 'X축'},
        {res: 'Y축'},
        {res: '범례'},
    ];

    $scope.activeTabSet = 'defaultTab';
    $scope.dlgOffset = {
        left: 20,
        top: 0
    };

    /**
     *  scope fcuntion
     */
    $scope.openChartOptsDlg = function () {
        $scope.closeChartOptsDlg();

        var $btn = $('#' + _btnShowDlgID);
        var btnOffset = $btn.offset();

        $scope.dlgOffset.top = (btnOffset.top + $btn.height() + 10);
        $scope.dlgOffset.left = (btnOffset.left);
        $scope.$root.$broadcast('dialog.open.' + _dlgID);

        $document.bind('click', _docClickListener);
    };

    $scope.closeChartOptsDlg = function () {
        $document.unbind('click', _docClickListener);
        $scope.$root.$broadcast('dialog.close.' + _dlgID);
    };


    /**
     *   events
     */
    $scope.$on('visualOpts.changed', function (evt, opts) {
        $scope.chartOpts = opts;
    });
    // 시각화 차트 타입 변경
    $scope.$on('search.visual.type_change', function (evt, chartType) {
        $scope.chartType = chartType;

        visualOpts.chartType(chartType);
        $scope.chartOpts = visualOpts.getOpts();
        $scope.activeTabSet = (chartType !== 'pie' ? 'defaultTab' : 'PieTab');
    });
    $scope.$on('$destory', function () {
        visualOpts.clean();
    });


}

module.exports = ChartOptionCtrl;
