'use strict';
/**
 *
 */
/**
 * Controller
 */
MainCtrl.$inject = ['$scope', '$stateParams', 'anomalyAgent', 'searchCond', 'paramBuilder'];
function MainCtrl($scope, $stateParams, anomalyAgent, searchCond, paramBuilder) {
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

    $scope.selOptions = [
        {type: '분석 유형 선택', icon: '', isSelected: true, description:'description' },
        {type:'Line plot', icon:'Line plot', description:'description'},
        {type:'Scatter plot', icon:'Scatter plot', description:'description'},
        {type:'Motion', icon:'Motion', description:'description'},
        {type:'Histogram', icon:'Histogram', description:'description'},
        {type:'Bar chart', icon:'Bar chart', description:'description'},
        {type:'Pie chart', icon:'Pie chart', description:'description'},
        {type:'Shanky', icon:'Shanky', description:'description'},
        {type:'Heatmap', icon:'Heatmap', description:'description'},
        {type:'Outlier', icon:'Outlier', description:'description'},
    ];

    $scope.selModel = {};
    $scope.$watch('selModel.type', function (type) {
        console.log('(selectbox) watch:', type);
    });

    $scope.changeOption = function (model) {
        console.log('(selectbox) change:', model.type);
    };



}

module.exports = MainCtrl;
