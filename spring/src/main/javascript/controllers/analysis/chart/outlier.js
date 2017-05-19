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

OutlierCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragularService', '$rootScope', 'advAgent'];
function OutlierCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragularService, $rootScope, advAgent) {

    /**
     * TODO DELETE TEST FUNCTION
     */
    $scope.outlier_top.push({"name": "DATE", "type": "TEXT", "option": null, "filters": []});

    /**
     * Event
     */

    $scope.$on('analysis.execute', function () {
        // $scope.request('adv-histogram');
        // $scope.request('adv-scatter');
        // $scope.request('adv-summary');
        // $scope.request('adv-outlier');


        async.parallel([
            function(callback) {
                // getEventSid(searchParams, callback);
                $scope.request('adv-histogram', callback);
            },
            // function(callback) {
            //     // NOTE: 시간 필드가 없으면 요청하지 말아야하나, total_count를 얻기 위해 요청
            //     getTimelineSid(searchParams, callback);
            // },
            // function(callback) {
            //     getStatsSid(searchParams, callback);
            // },
            // function(callback) {
            //     getFiguresSid(searchParams, callback);
            // }
        ], function(error) {
            if (error) {
                // abortAll(null);
                // $rootScope.$broadcast('search.result.error', error);
            }

            console.log('END......')
        });


    })

    $scope.reload = function (item, service) {
        popupLayerStore.get(item).closeEl();
        $scope.request(service)
    }

    /**
     *
     * Function
     */

    // Cancel에 필요한 sid
    $scope.requestSids = [];

    $scope.request = function (service) {
        var data = {
            q: "*",
            datamodel_id: $scope.analysis.datamodel_id,
            target_field: $scope.outlier_top[0]
        }

        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d) {
                // console.log(service, d)
                transformData(service, d);
            });
        });
    }

    function transformData(service, d) {


        // histogram
        if (service === 'adv-histogram') {
            // 히스토그램

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

    // drop 체크하여 실행버튼 Toggle
    $scope.$watch('outlier_top', function (newValue, oldValue) {
        if ($scope.outlier_top.length > 0) {
            $scope.analysis.isReadyToExecute = true;
        } else {
            $scope.analysis.isReadyToExecute = false;
        }
    }, true);

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


    /**
     * Get histogram data out of xy data
     * @param   {Array} data  Array of tuples [x, y]
     * @param   {Number} step Resolution for the histogram
     * @returns {Array}       Histogram data
     */
    function histogram(data, step) {
        var histo = {},
            x,
            i,
            arr = [];

        // Group down
        for (i = 0; i < data.length; i++) {
            x = Math.floor(data[i][0] / step) * step;
            if (!histo[x]) {
                histo[x] = 0;
            }
            histo[x]++;
        }

        // Make the histo group into an array
        for (x in histo) {
            if (histo.hasOwnProperty((x))) {
                arr.push([parseFloat(x), histo[x]]);
            }
        }

        // Finally, sort the array
        arr.sort(function (a, b) {
            return a[0] - b[0];
        });

        return arr;
    }


}

module.exports = OutlierCtrl;
