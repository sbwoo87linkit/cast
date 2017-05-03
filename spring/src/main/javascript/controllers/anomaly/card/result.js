'use strict';
/**
 *
 */
var Highcharts = require('highcharts');
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
var HighchartsCustomEvents = require('highcharts-custom-events')(Highcharts);

var _ = require('lodash');
var uuidV1 = require('uuid/v1');


/**
 * Controller
 */
ResultCtrl.$inject = ['$scope', '$timeout', 'util'];
function ResultCtrl($scope, $timeout, util) {



    function renderLineChart(id, data) {

        Highcharts.chart(id, {

            credits: {enabled: false},
            chart: {
                type: 'line',
                // height: CONTAINER_HEIGHT,
                marginTop: 0,
                events: {
                    load: function () {
                    }
                }
            },

            title: {
                text: null
            },

            subtitle: {
                text: null
            },

            xAxis: {
                categories: data.categories,
                type: 'datetime',
                labels: {
                    // format: '{value:%Y.%m.%d %H:%M:%S}',
                    format: '{value:%m/%d %M:%S}',
                }
            },

            yAxis: {
                enabled: false,
                title: {
                    text: null
                }
            },

            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },

            tooltip: {
                enabled: true,
                useHTML: true,
                backgroundColor: 'white',
                formatter: function () {
                    return '<b>시간: </b>' + Highcharts.dateFormat('%m/%d %M:%S', this.x) + '<br>'
                        + '<b>시리즈: </b>' + this.series.name + '<br>'
                        + '<b>값: </b>' + this.y;
                },
                hideDelay: 0
            },

            legend: {
                enabled: false,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },

            exporting: {
                enabled: false
            },

            series: data.series

        });

    }



    function renderHeatmapChart(id, data) {

        var rowIndex;

        Highcharts.chart(id, {

            credits: {enabled: false},

            chart: {
                type: 'heatmap',
                marginTop: 0
            },

            plotOptions: {
                series: {
                    states: {
                        hover: {
                            enabled: false
                        }
                    },
                    dataLabels: {
                        enabled: false,
                        events: {
                            contextmenu: function (event) {
                                // 기본 정의 이벤트의 동작을 막아준다.
                                event.preventDefault();

                                $scope.card.data.rowIndex = rowIndex;
                                $scope.$apply();
                                showPopup('popup', event);
                            }
                        }
                    },
                    point: {
                        events: {
                            contextmenu: function (event) {
                                // 기본 정의 이벤트의 동작을 막아준다.
                                event.preventDefault();

                                $scope.card.data.rowIndex = rowIndex;
                                $scope.$apply();
                                showPopup('popup', event);
                            },

                            mouseOver: function () {
                                var chart = this.series.chart;
                                rowIndex = this.y;
                                resetHighlight(chart);
                                for (var i = 0; i < chart.xAxis[0].categories.length; i++) {
                                    var index = this.y + i * chart.yAxis[0].categories.length;
                                    chart.series[0].data[index].update({borderWidth: HIGHLIGHT_WIDTH}, false);
                                }
                                chart.redraw();
                            },

                            mouseOut: function () {
                                var chart = this.series.chart;
                                resetHighlight(chart);
                            }
                        }
                    }
                }
            },


            title: {
                text: null
            },

            xAxis: {
                categories: data.xAxisData,
                title: 'Datetime',
                type: 'datetime',
                labels: {
                    // format: '{value:%Y.%m.%d %H:%M:%S}',
                    format: '{value:%m/%d %M:%S}',
                }
            },

            yAxis: {
                categories: data.yAxisData,
                title: null,
                labels: {
                    style: {
                        color: 'black'
                    }
                }
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
                enabled: true,
                useHTML: true,
                backgroundColor: 'white',
                formatter: function () {
                    return '<b>시간: </b>' + Highcharts.dateFormat('%m/%d %M:%S', this.series.xAxis.categories[this.point.x]) + '<br>'
                        + '<b>키: </b>' + this.series.yAxis.categories[this.point.y] + '<br>'
                        + '<b>score: </b>' + this.point.value;
                },
                hideDelay: 0
            },


            series: [{
                name: 'score',
                borderWidth: 1,
                data: data.scoreData,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }],

            exporting: {
                enabled: false
            }


        });
    }




}

module.exports = ResultCtrl;
