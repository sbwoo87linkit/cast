'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */
ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragulaService'];
function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragulaService) {


    dragulaService.options($scope, 'fifth-bag', {
        copy: true
    });


    /**
     * 데이터 로드
     */

    var model = dataModel.get();
    $scope.fieldList = model.fields.selected;


    /**
     *  Scope 변수
     */

    $scope.analysis = {};

    $scope.chartGroups = [
        { name:'시계열', items : [
            {type:'Line plot', icon:'line', description:'Line plot description'},
            {type:'Scatter plot', icon:'plot', description:'Scatter plot description'},
            {type:'Motion', icon:'motion', description:'Motion description'}
        ]},
        { name:'분포', items : [
            {type:'Histogram', icon:'histogram', description:'Histogram description'},
            {type:'Bar chart', icon:'bar', description:'Bar chart description'},
            {type:'Pie chart', icon:'pie', description:'Pie chartdescription'}
        ]},
        { name:'관계형', items : [
            {type:'Shanky', icon:'shanky', description:'Shanky description'},
            {type:'Heatmap', icon:'heatmap', description:'Heatmap description'},
        ]},
        { name:'이상치', items : [
            {type:'Outlier', icon:'outlier', description:'Outlier description'},
        ]}
    ];

    // 선택한 차트유형
    $scope.analysis.chart = {type:'차트 유형 선택', icon:'none', description:'select chart'};

    // TODO 차트 유형 변경에 따른 레이아웃/컨트롤러 설정
    $scope.templates = [
        {name: 'template1.html', url: 'template1.html'},
        {name: 'template2.html', url: 'template2.html'}
    ];
    $scope.template = $scope.templates[0];

    /**
     *
     * Function
     */

    $scope.changeChart = function (chart) {
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

}

module.exports = ContainerCtrl;
