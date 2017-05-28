'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
var Highcharts = require('highcharts');
var async = require('async');

/**
 * Controller
 */

OutlierCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'advAgent', 'popupBox'];
function OutlierCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, $rootScope, advAgent, popupBox) {

    /**
     * Event
     */

    $scope.onDrop = function ($event, $data) {
        $scope.adv.targetField = _.cloneDeep($data);
    };

    $scope.clearTargetField = function () {
        $scope.adv.targetField = null;
    }

    $scope.$on('adv.execute', function () {

        if (!$scope.adv.targetField) {
            var msg = '대상 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
                // something...
            });
            return false;
        }

        $scope.adv.isWaiting = true;
        async.parallel([
            function(callback) {
                $scope.request('adv-histogram', callback);
            },
            function(callback) {
                $scope.request('adv-scatter', callback);
            },
            function(callback) {
                $scope.request('adv-summary', callback);
            },
            function(callback) {
                $scope.request('adv-outlier', callback);
            },
        ], function(error, result) {
            $scope.adv.isWaiting = false;
            if (!error) {
                // success. clear requests
                result = [];
            } else {
                // error. cancel requests and clear requests
                advAgent.cancelAllRequests(result);
                result = [];
            }
        });

    })

    $scope.reload = function (item, service) {
        popupLayerStore.get(item).closeEl();
        $scope.request(service, null)
    }

    /**
     *
     * Function
     */

    $scope.request = function (service, callback) {
        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: $scope.adv.targetField
        }

        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d1) {
                renderChart(service, d1);
                if(callback) {
                    callback(null, {id: d.data.sid, service: service})
                }
            });
        });
    }

    function renderChart(service, d) {

        // 히스토그램
        if (service === 'adv-histogram') {

            var data = d.data.results;
            _.forEach(data, function (item) {
                item[0] = strToDate(item[0])
            });

            $scope.histogram = {
                options: {
                    chart: {
                        type: 'column'
                    },
                    series: [{
                        pointPadding: 0,
                        groupPadding: 0,
                        pointPlacement: 'between',
                        data: data,
                    }],
                    title: {
                        text: null
                    },
                    legend: {
                        enabled: false
                    },
                    yAxis: {
                        title: {
                            text: null
                        },
                        gridLineWidth: 1
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            // format: '{value:%m/%d %H:%M:%S}',
                            format: '{value:%H:%M:%S}',
                        }
                    },
                    tooltip: {
                        enabled: true,
                        useHTML: true,
                        backgroundColor: 'white',
                        formatter: function () {
                            return [
                                '<b>시간: </b>' + Highcharts.dateFormat('%m/%d %M:%S', this.x),
                                '<b>시리즈: </b>' + this.series.name,
                                '<b>값: </b>' + this.y
                            ].join('<br>');
                        },
                        hideDelay: 0
                    },
                    exporting: {
                        enabled: false
                    }

                }
            }

        }

        // time series
        if (service === 'adv-scatter') {

            var data = d.data.results;
            _.forEach(data, function (item) {
                item[0] = strToDate(item[0])
            });

            $scope.timeseries = {
                options: {
                    chart: {
                        type: 'scatter'
                    },
                    series: [{
                        data: data,
                        marker: {
                            radius: 3.5
                        }
                    }],
                    title: {
                        text: null
                    },
                    legend: {
                        enabled: false
                    },
                    yAxis: {
                        title: {
                            text: null
                        }
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            // format: '{value:%m/%d %H:%M:%S}',
                            format: '{value:%H:%M:%S}',
                        }
                    },
                    tooltip: {
                        enabled: true,
                        useHTML: true,
                        backgroundColor: 'white',
                        formatter: function () {
                            return [
                                '<b>시간: </b>' + Highcharts.dateFormat('%m/%d %M:%S', this.x),
                                '<b>시리즈: </b>' + this.series.name,
                                '<b>값: </b>' + this.y
                            ].join('<br>');
                        },
                        hideDelay: 0
                    },
                    exporting: {
                        enabled: false
                    }
                }

            }
        }

        // 기술통계
        if (service === 'adv-summary') {

            $scope.techstatic = [
                {
                    name: '레코드수',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'TOTAL'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'TOTAL'})]
                },
                {
                    name: 'MIN',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'MIN'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'MIN_COUNT'})]
                },
                {
                    name: '1st(25%) 사분위수',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'Q1'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'Q1_COUNT'})]
                },
                {
                    name: '중간값50%)',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'MEDIAN'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'MEDIAN_COUNT'})]
                },
                {
                    name: '평균',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'AVERAGE'})],
                    recordCounts: ''
                },
                {
                    name: '3rd(75%) 사분위수',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'Q3'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'Q3_COUNT'})]
                },
                {
                    name: 'MAX',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'MAX'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'MAX_COUNT'})]
                },
                {
                    name: 'NA의수',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'NA'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'NA'})]
                }
            ]

            $scope.techstaticKeys = [
                {map: 'name', title: 'OUTLIER'},
                {map: 'techStatics', title: '기술통계량'},
                {map: 'recordCounts', title: '해댱되는 레코드수'}
            ];

            $scope.techstatic_csv = {};
        }

        // Outlier
        if (service === 'adv-outlier') {


            $scope.outlier = [
                {
                    name: '레코드수',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'TOTAL'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'TOTAL'})]
                },
                {
                    name: 'MIN',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'MIN'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'MIN_COUNT'})]
                },
                {
                    name: '1st(25%) 사분위수',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'Q1'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'Q1_COUNT'})]
                },
                {
                    name: '중간값50%)',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'MEDIAN'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'MEDIAN_COUNT'})]
                },
                {
                    name: '평균',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'AVERAGE'})],
                    recordCounts: ''
                },
                {
                    name: '3rd(75%) 사분위수',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'Q3'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'Q3_COUNT'})]
                },
                {
                    name: 'MAX',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'MAX'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'MAX_COUNT'})]
                },
                {
                    name: 'NA의수',
                    techStatics: d.data.results[_.findIndex(d.data.fields, {name: 'NA'})],
                    recordCounts: d.data.results[_.findIndex(d.data.fields, {name: 'NA'})]
                }
            ]

            $scope.outlierKeys = [
                {map: 'name', title: 'TA'},
                {map: 'techStatics', title: '기술통계량'},
                {map: 'recordCounts', title: '해댱되는 레코드수'}
            ];


            $scope.outlier_csv = {};

        }
    }

    $scope.export = function (item) {

        // Table CSV 저장은 mu-grid 내장 export 기능 이용
        popupLayerStore.get(item).closeEl();

        if (item === 'histogram') {
            var chart = $scope.histogram.options.getChartObj();
            chart.exportChart({
                type: 'image/png'
            });
        }

        if (item === 'timeseries') {
            var chart = $scope.timeseries.options.getChartObj();
            chart.exportChart({
                type: 'image/png'
            });
        }
    }

    function strToDate(dateString) {
        var year = dateString.substr(0, 4);
        var month = Number(dateString.substr(4, 2)) - 1;
        var day = dateString.substr(6, 2);
        var hour = dateString.substr(8, 2);
        var min = dateString.substr(10, 2);
        var sec = dateString.substr(12, 2);
        return Date.UTC(year, month, day, hour, min, sec);
    }

}

module.exports = OutlierCtrl;
