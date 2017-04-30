'use strict';
/**
 *
 */
var Highcharts = require('highcharts');
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
/**
 * Controller
 */
ResultCtrl.$inject = ['$scope'];
function ResultCtrl($scope) {

    $scope.chartType = 'heatmap';

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.data_loaded', function(event, data) {
        // TODO: 차트 데이터 수신
    });
    $scope.$on('anomaly.card.changeChart', function (event, type) {
        $scope.chartType = type;
        // TODO: 차트 교체 처리
        if ($scope.card.data.isEnd) {
            setTimeout(switchChart);
        }
    });

    $scope.$on('anomaly.card.resizeChart', function (event, size, elCard) {
        // TODO: 차트 사이즈 변경 처리
        if ($scope.card.data.isEnd) {
            setTimeout(switchChart);
        }
    });

    $scope.$watch('card.data', function () {
        if ($scope.card.data.isEnd) {
            setTimeout(switchChart);
        }
    });

    function switchChart() {
        if ($scope.chartType === 'line') {
            renderLineChart();
        }

        if ($scope.chartType === 'heatmap') {
            renderHeatmapChart();
        }
    }

    function renderLineChart() {
        new Highcharts.Chart('container_' + $scope.$index, {

            credits: {enabled: false},

            title: {
                text: $scope.card.data.fields.key_field[0].name
            },

            // subtitle: {
            //     text: 'Source: thesolarfoundation.com'
            // },

            yAxis: {
                title: {
                    text: 'yAxis'
                }
            },
            legend: {
                // enabled : false,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            plotOptions: {
                series: {
                    pointStart: 0
                }
            },

            exporting: {
                enabled: true
            },

            series: [{
                name: $scope.card.data.fields.key_field[0].values[0],
                data: $scope.card.data.results[0]
            }, {
                name: $scope.card.data.fields.key_field[0].values[1],
                data: $scope.card.data.results[1]
            }, {
                name: $scope.card.data.fields.key_field[0].values[2],
                data: $scope.card.data.results[2]
            }, {
                name: $scope.card.data.fields.key_field[0].values[3],
                data: $scope.card.data.results[3]
            }, {
                name: $scope.card.data.fields.key_field[0].values[4],
                data: $scope.card.data.results[4]
            }, {
                name: $scope.card.data.fields.key_field[0].values[5],
                data: $scope.card.data.results[5]
            }]
        });

    }

    function renderHeatmapChart() {

        var xAxisValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            yAxisValues = [],
            dataValues = [];

        for (var i = 0; i < $scope.card.data.fields.key_field[0].values.length; i++) {
            yAxisValues.push($scope.card.data.fields.key_field[0].values[i]);
        }
        for (var i = 0; i < $scope.card.data.fields.key_field[0].values.length; i++) {
            for (var j = 0; j < $scope.card.data.results[i].length; j++) {
                dataValues.push([j, i, $scope.card.data.results[i][j]]);
            }
        }

        new Highcharts.Chart('container_' + $scope.$index, {
            credits: {enabled: false},
            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
            },


            title: {
                text: $scope.card.data.fields.key_field[0].name
            },

            xAxis: {
                categories: xAxisValues
            },

            yAxis: {
                categories: yAxisValues,
                title: null
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 205
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x]
                        + '</b> xAxis <br><b>'
                        + this.point.value + '</b> value <br><b>'
                        + this.series.yAxis.categories[this.point.y] + '</b> yAxis';
                }
            },

            exporting: {
                enabled: true
            },

            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                data: dataValues,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }]
        });
    }
}

module.exports = ResultCtrl;
