'use strict';
/**
 *
 */
/**
 * Controller
 */
MainCtrl.$inject = ['$scope', '$stateParams', 'anomalyAgent', 'searchCond', 'paramBuilder', 'popupLayerStore', '$timeout'];
function MainCtrl($scope, $stateParams, anomalyAgent, searchCond, paramBuilder, popupLayerStore, $timeout) {
    /**
     *   init
     */
    searchCond.set(paramBuilder.parse($stateParams), true);

    // 다른 페이지 이동 시
    $scope.$on('$destroy', function () {
        searchCond.clean();
        anomalyAgent.cancelAllRequest();
    });

    $scope.fieldList = [
        {"name": "FTS_PARTITION_TIME", "type": "TIMESTAMP"},
        {"name": "ENB_ID", "type": "NUMBER"},
        {"name": "CELLL_ID", "type": "NUMBER"},
        {"name": "IMSI", "type": "NUMBER"},
        {"name": "ATTEMPT_TIME", "type": "TIMESTAMP"},
        {"name": "DISCON_TIME", "type": "TIMESTAMP"},
        {"name": "CQI", "type": "NUMBER"},
        {"name": "TA", "type": "NUMBER"},
        {"name": "RSRP", "type": "NUMBER"},
        {"name": "RSRQ", "type": "NUMBER"},
        {"name": "UE_TX_POWER", "type": "NUMBER"},
        {"name": "CALL_RELEASE_CAUSE", "type": "TEXT"},
        {"name": "PRB", "type": "NUMBER"}
    ]

    $scope.templates = [
        {name: 'template1.html', url: 'template1.html'},
        {name: 'template2.html', url: 'template2.html'}
    ];
    $scope.template = $scope.templates[0];


    /*

     {type:'Line plot', icon:'Line plot'},
     {type:'Scatter plot', icon:'Scatter plot'},
     {type:'Motion', icon:'Motion'},
     {type:'Histogram', icon:'Histogram'},
     {type:'Bar chart', icon:'Bar chart'},
     {type:'Pie chart', icon:'Pie chart'},
     {type:'Shanky', icon:'Shanky'},
     {type:'Heatmap', icon:'Heatmap'},
     {type:'Outlier', icon:'Outlier'},

     */

    // {type: '분석 유형 선택', icon: '', isSelected: true, description:'description' },

    // 시계열 : 라인 플로트 모션
    // 분포 : 히스토 바 파이
    // 관계형 : 샹키 히트맵
    // 이상치 : 아웃터
    $scope.chartGroups = [
        { name:'시계열', items : [
            {type:'Line plot', icon:'Line plot', description:'Line plot description'},
            {type:'Scatter plot', icon:'Scatter plot', description:'Scatter plot description'},
            {type:'Motion', icon:'Motion', description:'Motion description'}
        ]},
        { name:'분포', items : [
            {type:'Histogram', icon:'Histogram', description:'Histogram description'},
            {type:'Bar chart', icon:'Bar chart', description:'Bar chart description'},
            {type:'Pie chart', icon:'Pie chart', description:'Pie chartdescription'}
        ]},
        { name:'관계형', items : [
            {type:'Shanky', icon:'Shanky', description:'Shanky description'},
            {type:'Heatmap', icon:'Heatmap', description:'Heatmap description'},
        ]},
        { name:'이상치', items : [
            {type:'Outlier', icon:'Outlier', description:'Outlier description'},
        ]}
    ];


    $scope.analysis = {};
    // 선택한 차트유형
    $scope.analysis.chart = {type:'차트 유형 선택', icon:'Outlier', description:'description'};
    // $scope.analysis.chart = {};

    $scope.changeChart = function (chart) {
        $scope.analysis.chart = chart;
        popupLayerStore.get('analysis.chart.change').closeEl();
    }

    var showTimer, hideTimer;
    $scope.showDescription = function (chart) {
        // 분석유형선택 팝업 차트유형 마우스오버된 차트
        $timeout.cancel(hideTimer);
        showTimer = $timeout(function () {
            $scope.analysis.tempChart = chart;
        }, 300)
    }

    $scope.hideDescription = function () {
        $timeout.cancel(showTimer);
        hideTimer = $timeout(function () {
            $scope.analysis.tempChart = null;
        }, 300)
    }




    $scope.$watch('selModel.type', function (type) {
        console.log('(selectbox) watch:', type);
    });

    $scope.changeOption = function (model) {
        console.log('(selectbox) change:', model.type);
    };

    $scope.chartType=null;



}

module.exports = MainCtrl;
