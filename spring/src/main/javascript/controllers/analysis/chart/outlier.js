'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */

OutlierCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragularService', '$rootScope'];
function OutlierCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragularService, $rootScope) {

    console.log('outlier')

    $scope.$on('analysis.outlier.data_loaded', function (event, data) {
        console.log('event received', data);

        // 히스토그램
        $scope.histogram = {
            options: {
                chart: {
                    type: 'column'
                },
                series: [{
                    // data: [10, 15, 12, 8, 7],
                    data:  [[140,3],[150,47],[160,146],[170,62],[180,2]],
                }],
                title: {
                    text: 'Hello'
                },
                func: function (chart) {
                    $scope.$evalAsync(function () {
                        chart.reflow();
                        //The below is an event that will trigger all instances of charts to reflow
                        //$scope.$broadcast('highchartsng.reflow');
                    });
                },
            }
        }

        // 기술통계
        $scope.techstatic = [
            {outlier:'레코드수', techStatics: 9817, recordCounts: 9617},
            {outlier:'MIN', techStatics: 28.00, recordCounts: 50},
            {outlier:'1st(25%) 사분위수', techStatics: 88.00, recordCounts: 2150},
            {outlier:'중간값50%)', techStatics: 104.00, recordCounts: 1261},
            {outlier:'평균', techStatics: 2584, recordCounts: null},
            {outlier:'3rd(75%) 사분위수', techStatics: 107.00, recordCounts: 1371},
            {outlier:'MAX', techStatics: 65535.00, recordCounts: 386},
            {outlier:'NA의수', techStatics: null, recordCounts: null}
        ]

        $scope.techstaticKeys = [
            { map: 'outlier', title: 'OUTLIER' },
            { map: 'techStatics', title: '기술통계량' },
            { map: 'recordCounts', title: '해댱되는 레코드수' }
        ];

        // 시계열분포

        $scope.timeseries = {
            options: {
                chart: {
                    type: 'bar'
                },
                series: [{
                    data: [55, 15, 12, 8, 7]
                }],
                title: {
                    text: 'Hello'
                },
                func: function (chart) {
                    $scope.$evalAsync(function () {
                        chart.reflow();
                        //The below is an event that will trigger all instances of charts to reflow
                        //$scope.$broadcast('highchartsng.reflow');
                    });
                },
            }
        }


        // 이상치(outlier)

        $scope.outlier = [
            {TA:'레코드수', techStatics: 33219, recordCounts: 33219},
            {TA:'MIN', techStatics: 2.00, recordCounts: 77},
            {TA:'1st(25%) 사분위수', techStatics: 13.00, recordCounts: 17710},
            {TA:'중간값50%)', techStatics: 15.00, recordCounts: 27929},
            {TA:'평균', techStatics: 91.56, recordCounts: null},
            {TA:'3rd(75%) 사분위수', techStatics: 17.00, recordCounts: 76487},
            {TA:'MAX', techStatics: 65535.00, recordCounts: 386},
            {TA:'NA의수', techStatics: 47, recordCounts: 47}
        ]

        $scope.outlierKeys = [
            { map: 'TA', title: 'TA' },
            { map: 'techStatics', title: '기술통계량' },
            { map: 'recordCounts', title: '해댱되는 레코드수' }
        ];



    })

    /**
     * Outlier - histogram
     */

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

    // chart data binding

    var closeLayer = function (index) {
        var layer = popupLayerStore.get('anomaly.layer.cardmenu_' + index);

        if (layer) {
            popupLayerStore.get('anomaly.layer.cardmenu_' + index).closeEl();
        }
    };

    $scope.export = function (item) {
        console.log(item)
        // var chart  = $scope.outlierHistogramChart.options.getChartObj();
        // chart.exportChart({
        //     type: 'image/png'
        // });

        popupLayerStore.get(item).closeEl();

    }

    $scope.reload = function (item) {
        console.log('reload... ', item)
        popupLayerStore.get(item).closeEl();

        // $scope.outlierHistogramChart = {
        //     options: null
        // }
        //
        // $timeout(function () {
        //     $scope.outlierHistogramChart = {
        //         options: outLierOptions
        //     }
        //
        // }, 500)





    }

    /**
     * 기술통계량
     */

    /**
     *  이상치
     */


}

module.exports = OutlierCtrl;
