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

ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragularService', '$rootScope'];
function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragularService, $rootScope) {


    /**
     * 데이터 로드
     */

    var model = dataModel.get();
    $scope.fieldList = model.fields.selected;

    $scope.outlier_top = [];


    /**
     * Drag & Drop setup
     */

    var containerLeft = document.querySelector('#containerLeft'),
        containerRight = document.querySelector('#containerRight');

    function accepts(el, target, source) {
        if (source === containerLeft || source === target) {

            // limit 1
            console.log(target)
            if ($scope.outlier_top.length < 1) {
                // console.log('aaaa')
                return true;
            }
        } else {
            console.log('bbbb')
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
            console.log('moves')
        },
    });


    /**
     *  Scope 변수
     */

    $scope.analysis = {};

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
    //
    // // TODO 차트 유형 변경에 따른 레이아웃/컨트롤러 설정
    // $scope.templates = [
    //     {name: 'template1.html', url: 'template1.html'},
    //     {name: 'template2.html', url: 'template2.html'}
    // ];
    // $scope.template = $scope.templates[0];
    //
    // /**
    //  *
    //  * Function
    //  */
    //
    $scope.changeChart = function (chart) {
        console.log('changeChart', $scope.$id, chart)
        $scope.analysis.chart = chart;
    }

    var hideTimer;
    $scope.showDescription = function (chart) {
        console.log('showDescription')
        // 분석유형선택 팝업 차트유형 마우스오버된 차트
        $timeout.cancel(hideTimer);
        $scope.analysis.tempChart = chart;
    }

    $scope.hideDescription = function () {
        hideTimer = $timeout(function () {
            $scope.analysis.tempChart = null;
        }, 500)
    }
    //
    // /**
    //  * Outlier - histogram
    //  */
    //
    // var outLierOptions = {
    //     chart: {
    //         type: 'bar'
    //     },
    //     series: [{
    //         data: [10, 15, 12, 8, 7]
    //     }],
    //     title: {
    //         text: 'Hello'
    //     },
    //     func: function (chart) {
    //         $scope.$evalAsync(function () {
    //             chart.reflow();
    //             //The below is an event that will trigger all instances of charts to reflow
    //             //$scope.$broadcast('highchartsng.reflow');
    //         });
    //     },
    // };
    //
    // // chart data binding
    // $scope.outlierHistogramChart = {
    //     options: outLierOptions
    // }
    //
    // var closeLayer = function (index) {
    //     var layer = popupLayerStore.get('anomaly.layer.cardmenu_' + index);
    //
    //     if (layer) {
    //         popupLayerStore.get('anomaly.layer.cardmenu_' + index).closeEl();
    //     }
    // };
    //
    // $scope.saveHistogramChart = function () {
    //     // console.log($scope.outlierHistogramChart.options.getChartObj())
    //     var chart  = $scope.outlierHistogramChart.options.getChartObj();
    //     chart.exportChart({
    //         // type: 'application/pdf'
    //         type: 'image/png'
    //     });
    //
    //     popupLayerStore.get('outlier.histogram').closeEl();
    //
    // }
    //
    // $scope.restartJob = function () {
    //
    //     popupLayerStore.get('outlier.histogram').closeEl();
    //
    //     // $scope.outlierHistogramChart = {
    //     //     options: null
    //     // }
    //     //
    //     // $timeout(function () {
    //     //     $scope.outlierHistogramChart = {
    //     //         options: outLierOptions
    //     //     }
    //     //
    //     // }, 500)
    //
    //
    //
    //
    //
    //
    // }
    //
    // /**
    //  * 기술통계량
    //  */
    //
    // $scope.techStatic = [
    //     {outlier:'레코드수', techStatics: 9817, recordCounts: 9617},
    //     {outlier:'MIN', techStatics: 28.00, recordCounts: 50},
    //     {outlier:'1st(25%) 사분위수', techStatics: 88.00, recordCounts: 2150},
    //     {outlier:'중간값50%)', techStatics: 104.00, recordCounts: 1261},
    //     {outlier:'평균', techStatics: 2584, recordCounts: null},
    //     {outlier:'3rd(75%) 사분위수', techStatics: 107.00, recordCounts: 1371},
    //     {outlier:'MAX', techStatics: 65535.00, recordCounts: 386},
    //     {outlier:'NA의수', techStatics: null, recordCounts: null}
    // ]
    //
    // $scope.techStaticKeys = [
    //     { map: 'outlier', title: 'OUTLIER' },
    //     { map: 'techStatics', title: '기술통계량' },
    //     { map: 'recordCounts', title: '해댱되는 레코드수' }
    // ];
    //
    //
    // $scope.data = [
    //     { no: 0, firstName: 'Pierre', lastName: 'Dupont', age: 55, email: 'PierreDupont@whatever.com', balance: 1161.783 },
    //     { no: 1, firstName: 'Pol', lastName: 'Delcourt', age: 22, email: 'PolDelcourt@whatever.com', balance: 486.463 },
    //     { no: 2, firstName: 'Pol', lastName: 'Delcourt', age: 86, email: 'PolDelcourt@whatever.com', balance: 284.3417 },
    //     { no: 3, firstName: 'Robert', lastName: 'Delcourt', age: 79, email: 'RobertDelcourt@whatever.com', balance: 2651.324 },
    //     { no: 4, firstName: 'Jacques', lastName: 'Germain', age: 56, email: 'JacquesGermain@whatever.com', balance: 1276.765 }
    // ];
    //
    // // $scope.dataKeys = ['no', 'firstName', 'lastName', 'age', 'email', 'balance'];
    // $scope.dataKeys = [
    //     { map: 'no', title: 'No' },
    //     { map: 'firstName', title: 'First name' },
    //     { map: 'lastName', title: 'Last name' },
    //     { map: 'age', title: 'Age' },
    //     { map: 'email', title: 'Email' },
    //     { map: 'balance', title: 'Balance' }
    // ];
    //
    // /**
    //  *  이상치
    //  */
    //
    // $scope.outlier = [
    //     {TA:'레코드수', techStatics: 33219, recordCounts: 33219},
    //     {TA:'MIN', techStatics: 2.00, recordCounts: 77},
    //     {TA:'1st(25%) 사분위수', techStatics: 13.00, recordCounts: 17710},
    //     {TA:'중간값50%)', techStatics: 15.00, recordCounts: 27929},
    //     {TA:'평균', techStatics: 91.56, recordCounts: null},
    //     {TA:'3rd(75%) 사분위수', techStatics: 17.00, recordCounts: 76487},
    //     {TA:'MAX', techStatics: 65535.00, recordCounts: 386},
    //     {TA:'NA의수', techStatics: 47, recordCounts: 47}
    // ]
    //
    // $scope.outlierKeys = [
    //     { map: 'TA', title: 'TA' },
    //     { map: 'techStatics', title: '기술통계량' },
    //     { map: 'recordCounts', title: '해댱되는 레코드수' }
    // ];

}

module.exports = ContainerCtrl;
