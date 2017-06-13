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

HeatmapCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility'];
function HeatmapCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                     searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility) {

    /**
     *
     * scope variable
     */

    // Field 팝업레이어 옵션
    // $scope.adv.fieldOptions.xAxis = {
    //     sort : {
    //         list : [
    //             {text: '기본값', value: 'default', isSelected: true},
    //             {text: '오름차순', value: 'ascending'},
    //             {text: '내림차순', value: 'descending'}
    //         ],
    //         selected : {}
    //     },
    //     range : {
    //         selected: 'notUse',
    //         userDefined : {
    //             size: 10,
    //             start: 0,
    //             end: 10
    //         }
    //     },
    //     maxCount : 100
    // }

    $scope.adv.fieldOptions = {
        opts : {
            xAxis : {
                sort : {
                    list : [
                        {text: '기본값', value: 'default', isSelected: true},
                        {text: '오름차순', value: 'ascending'},
                        {text: '내림차순', value: 'descending'}
                    ],
                    selected : {}
                },
                range : {
                    selected: 'notUse',
                    userDefined : {
                        size: 10,
                        start: 0,
                        end: 10
                    }
                },
                maxCount : 100
            },
            yAxis : {
                sort : {
                    list : [
                        {text: '기본값', value: 'default', isSelected: true},
                        {text: '오름차순', value: 'ascending'},
                        {text: '내림차순', value: 'descending'}
                    ],
                    selected : {}
                },
                range : {
                    selected: 'notUse',
                    userDefined : {
                        size: 10,
                        start: 0,
                        end: 10
                    }
                },
                maxCount : 100
            },
            value : {
                summaryMethod : {
                    list : [
                        { text: '합계', value: 'sum', isSelected: true },
                        { text: '개수', value: 'count' },
                        { text: '평균', value: 'average' },
                        { text: '쵀대', value: 'max' },
                        { text: '최소', value: 'min' },
                        { text: '표준편차', value: 'standardDeviation' },
                        { text: '중간값', value: 'mean' },
                        { text: '개별 값 나열', value: 'iterate' }
                    ],
                    selected : {}
                }
            }

        },
        drops : {
            xAxisField : _.find($scope.fieldList, function (x) {
                return x.type === 'TIMESTAMP'
            }),
            yAxisField : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            valueField : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null}
        }
    }

    // console.log($scope.adv.fieldOptions.opts.xAxis)
    $scope.$watch('adv', function (value) {

        // $scope.adv.showDataLabel = true;

        // console.log('$scope.adv.showDataLabel', $scope.adv.showDataLabel)

        if ($scope.adv.chartOpts.opts.normal.showValue === 'all') {
            $scope.adv.showDataLabel = true;
        } else {
            $scope.adv.showDataLabel = false;
        }
        if (!$scope.config) {
            return;
        }

        $scope.config.series[0].dataLabels.enabled = $scope.adv.showDataLabel

    }, true);

    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {

        var msg = null;

        console.log($scope.adv);

        if (!$scope.adv.fieldOptions.drops.valueField) {
            msg = '값 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.adv.fieldOptions.drops.yAxisField) {
            msg = 'y축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.adv.fieldOptions.drops.xAxisField) {
            msg = 'x축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: [],
            field_options : $scope.adv.fieldOptions
        }

        console.log(data);

        var service = 'adv-heatmap';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d1) {
                $scope.adv.isWaiting = false;
                renderChart(d1.data);
            }, function (err) {
            });
        });
    })

    var renderChart = function (d) {

        var xAxisCategories = [];
        var series = [];

        var yAxisCategories = [];
        for (var i = 1; i < d.fields.length; i++) {
            yAxisCategories.push(d.fields[i].name)
        }

        d.results.forEach(function (row, i) {
            row.forEach(function (item, j) {
                if (j === 0) {
                    xAxisCategories.push(item);
                } else {
                    series.push([i, j - 1, item])
                }
            })
        })

        $scope.config = {
            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
            },

            title: {
                text: 'Sales per employee per weekday'
            },

            xAxis: {
                categories: xAxisCategories
            },

            yAxis: {
                categories: yAxisCategories,
                title: null
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
                enabled: false,
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                        this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                }
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                data: series,
                dataLabels: {
                    // enabled: false,
                    enabled: $scope.adv.showDataLabel,
                    color: '#000000'
                }
            }]
        }


    };

}

module.exports = HeatmapCtrl;
