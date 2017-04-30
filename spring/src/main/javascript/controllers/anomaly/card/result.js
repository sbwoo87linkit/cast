'use strict';
/**
 *
 */
var Highcharts = require('highcharts');
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
var HighchartsCustomEvents = require('highcharts-custom-events')(Highcharts);
/**
 * Controller
 */
ResultCtrl.$inject = ['$rootScope', '$scope', '$timeout', '$compile'];
function ResultCtrl($rootScope, $scope, $timeout, $compile) {

    /**
     * constant
     */
    var CONTAINER_HEIGHT = 326,
        HIGHLIGHT_WIDTH = 5;

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.data_loaded', function (event, data) {
        // 차트 데이터 수신

        // console.log(data);
        console.log($scope.cards)

        // $scope.cards[$scope.$index].data.rowIndex = null;
        // $timeout(renderChart(), 1000);
        $timeout(
             renderChart(data)
        )
    });

    $scope.$on('anomaly.card.changeChart', function (event, type) {
        // TODO: 차트 교체 처리
    });

    $scope.$on('anomaly.card.resizeChart', function (event, size, elCard) {
        // 차트 사이즈 변경 처리

        // try {
        //     var container = $('#container_' + $scope.$index);
        //     var chart = container.highcharts();
        //     chart.reflow();
        // } catch (err) {
        //     // do noting
        // }

    });

    $scope.$on('anomaly.card.changeHeatmapScaleMode', function (event, isScaleMode) {
        $timeout(renderChart);
    });

    /**
     * new popup menu
     */

    $(document, '.btn_hide').on("click", function(event){
        hidePopup();
    });

    function showPopup(id, e) {
        hidePopup();
        var el = $('#'+id+$scope.$index);
        el.css('display', 'block');
        el.css('left', e.clientX + 'px');
        el.css('top', e.clientY + 'px');
    }

    function hidePopup() {
        $('.popup').css('display', 'none');
    }

    /**
     * 차트 기능
     */


    /*

     $scope.splitAddCard = function (data, adeOptions) {
     var _cardId = uuidV1();
     data.fields.keys = [];
     var card = {
     //index: $scope.cards.length,
     id: _cardId,
     chartType: 'line',
     isMaxSize: false,
     state: {
     running: false,
     success: true,
     error: false,
     current: 0,
     total: 1
     },
     adeOptions: adeOptions,
     data: data
     };
     $scope.cards.push(card);
     $scope.$broadcast('anomaly.card.data_loaded', card.data);
     }



     */

    $scope.splitCard = function (rowIndex) {
        var card = $scope.cards[$scope.$index];
        // var oldLength = $scope.cards;
        _.times(card.data.fields.values.length, function(i) {
            card.data.rowIndex = rowIndex;
            card.data.valueIndex = i;
            //$scope.cards.push(card);
            //renderChart();
            $scope.splitAddCard(card.data, card.adeOptions);
        });
    }

    function renderChart() {

        var data = transformHeatmapData($scope.card.data, $scope.scaleModeModel.value);
        // console.log('heatmap chart', data)
        console.log($scope.app)
        renderHeatmapChart('container_'+$scope.$index, data)


        // $timeout(function () {
        //     var data = $scope.cards[$scope.$index].data;
        //
        //     if (data.rowIndex !== null) {
        //         // 카드분리 & 라인차트
        //         // values fields count 후 loop하여 라인차트 랜더링
        //         data = transformLineData($scope.card.data);
        //         renderLineChart('container_'+$scope.$index, data);
        //     } else if (data.fields.keys.length === 0 && data.fields.values.length === 1) {
        //         // 서버 데이터 수신 && 라인차트
        //         // data = transformLine($scope.card.data);
        //         data = transformLineData($scope.card.data);
        //         renderLineChart('container_'+$scope.$index, data);
        //     } else {
        //         // 서버데이터 수신 && 히트맵 차트
        //         $scope.app.chartType = 'heatmap';
        //         data = transformHeatmapData($scope.card.data, $scope.scaleModeModel.value);
        //         // console.log('heatmap chart', data)
        //         renderHeatmapChart('container_'+$scope.$index, data)
        //     }
        // })
    }

    function transformHeatmapData(data, isScaleMode) {

        console.log(data);

        var delimiter = ', ',
            timeFieldName = data.fields.time_fields[0],
            scoreFieldName = data.fields.score[0];

        var timeFieldIndex = _.findIndex(data.fields.all, {name: data.fields.time_fields[0]});

        var scoreFieldIndex = _.findIndex(data.fields.all, {name: data.fields.score[0]});

        var keyIndexes = [];
        _.forEach(data.fields.keys, function (key) {
            keyIndexes.push(_.findIndex(data.fields.all, {name: key}));
        });
        keyIndexes = keyIndexes.reverse();

        var keys = [];
        _.forEach(keyIndexes, function (index) {
            var arr = [];
            _.forEach(data.results, function (result) {
                arr.push(result[index]);
            });
            keys.push(_.uniq(arr));
        });

        var yAxisLabels = [];
        _.forEach(keys, function (item, i) {
            if (i === 0) {
                _.forEach(item, function (item2) {
                    yAxisLabels.push(item2);
                });
            } else {
                var arr = [];
                _.forEach(yAxisLabels, function (item2) {
                    _.forEach(item, function (item3) {
                        arr.push(item2 + delimiter + item3);
                    });
                });
                yAxisLabels = arr;
            }
        });

        // heatmap 데이터 구조
        var heatmap = {};
        heatmap.xAxisData = [];
        heatmap.yAxisData = [];
        heatmap.scoreData = [];

        var uclIndexes=[], lclIndexes=[], varianceIndexes=[], lineChartData=[];
        _.forEach(data.fields.values, function(d, i){
            lineChartData.push([]);
            uclIndexes.push(_.findIndex(data.fields.all, {name: data.fields.ucl[i]}))
            lclIndexes.push(_.findIndex(data.fields.all, {name: data.fields.lcl[i]}))
            varianceIndexes.push(_.findIndex(data.fields.all, {name: data.fields.variance[i]}))
        })


        _.forEach(data.results, function (result) {
            heatmap.xAxisData.push(result[timeFieldIndex]);
        });
        heatmap.xAxisData = _.uniq(heatmap.xAxisData);

        heatmap.yAxisData = yAxisLabels;
        /*
         "results": [
         ["20100101000000", "holloke01", 1,  1, 0,   0,   0,   0,   1,   1,   1,   1,   null, null,  null],
         ["20100101000000", "adamssp01", 1,  1, 0,   0,   0,   0,   0,   0,   1,   1,   1,    "N1_L","N1_L"],
         ["20100101000000", "cldrivi01", 5,  5, 7,   7,   3,   3,   4.5, 4.5, 3.5, 3.5, 0.14, null,  null],
         ["20100102000000", "holloke01", 1,  1, null,null,null,null,null,null,null,null,2,   "F1",   "F1"],
         ["20100102000000", "adamssp01", 11, 11,10.1,10.1,3.3, 3.3, 5.5, 5.5, 4.5, 4.5, 3.22, "S1_U","S1_U"],
         ["20100102000000", "cldrivi01", 5,  5, 5.1, 5.1, 4.2, 4.2, 3.5, 3.5, 4,   4,   1.37, null,  null],
         ["20100103000000", "holloke01", 3,  3, 3.3, 3.3, 0.5, 0.5, 2,   2,   2.1, 2.1, 0.45, null,  null],
         ["20100103000000", "adamssp01", 9,  9, 10.5,10.5,1.1, 1.1, 6,   6,   5.3, 5.3, 2.56, null,  null],
         ["20100103000000", "cldrivi01", 3,  3, 5.1, 5.1, 2.4, 2.4, 3.2, 3.2, 4.4, 4.4, 0.74, null,  null]
         ]

         */

        _.forEach(heatmap.xAxisData, function (time, i) {
            _.forEach(heatmap.yAxisData, function (label, j) {
                var temp = label.split(delimiter),
                    condition = {},
                    item,
                    value;

                condition[timeFieldIndex] = time;

                _.forEach(keyIndexes, function (index, i) {
                    condition[index] = temp[i];
                });

                item = _.find(data.results, condition);
                if (item) {
                    value = item[scoreFieldIndex];
                } else {
                    value = null;
                }
                heatmap.scoreData.push([i, j, value]);
            });

        });


        // Datetime 포맷 UTC 변경
        heatmap.xAxisData = _.map(heatmap.xAxisData, function (d) {
            return strToDate(d);
        })

        if (isScaleMode) {
            for (var y = 0; y < heatmap.yAxisData.length; y++) {

                // 행의 최대값 구하기
                var arr = [];
                for (var x = 0; x < heatmap.xAxisData.length; x++) {
                    var index = (x * heatmap.yAxisData.length) + y;
                    arr.push(heatmap.scoreData[index][2]);
                }
                var max = Math.max.apply(Math, arr);

                // Row Scaled(Row independent) Color 적용
                for (var x = 0; x < heatmap.xAxisData.length; x++) {
                    var index = (x * heatmap.yAxisData.length) + y;
                    var value = heatmap.scoreData[index][2];
                    heatmap.scoreData[index] = {x: x, y: y, value: value, color: getPointColor(value, max)}
                }
            }
        }
        return heatmap;

    }

    function transformLineData(data, isScaleMode) {

        // console.log(data);

        var delimiter = ', ',
            timeFieldName = data.fields.time_fields[0],
            scoreFieldName = data.fields.score[0];

        var timeFieldIndex = _.findIndex(data.fields.all, {name: data.fields.time_fields[0]});

        var scoreFieldIndex = _.findIndex(data.fields.all, {name: data.fields.score[0]});

        var keyIndexes = [];
        _.forEach(data.fields.keys, function (key) {
            keyIndexes.push(_.findIndex(data.fields.all, {name: key}));
        });
        keyIndexes = keyIndexes.reverse();

        var keys = [];
        _.forEach(keyIndexes, function (index) {
            var arr = [];
            _.forEach(data.results, function (result) {
                arr.push(result[index]);
            });
            keys.push(_.uniq(arr));
        });

        var yAxisLabels = [];
        _.forEach(keys, function (item, i) {
            if (i === 0) {
                _.forEach(item, function (item2) {
                    yAxisLabels.push(item2);
                });
            } else {
                var arr = [];
                _.forEach(yAxisLabels, function (item2) {
                    _.forEach(item, function (item3) {
                        arr.push(item2 + delimiter + item3);
                    });
                });
                yAxisLabels = arr;
            }
        });

        // heatmap 데이터 구조
        var heatmap = {};
        heatmap.xAxisData = [];
        heatmap.yAxisData = [];
        heatmap.scoreData = [];

        var uclIndexes=[], lclIndexes=[], varianceIndexes=[], lineChartData=[];
        _.forEach(data.fields.values, function(d, i){
            lineChartData.push([]);
            uclIndexes.push(_.findIndex(data.fields.all, {name: data.fields.ucl[i]}))
            lclIndexes.push(_.findIndex(data.fields.all, {name: data.fields.lcl[i]}))
            varianceIndexes.push(_.findIndex(data.fields.all, {name: data.fields.variance[i]}))
        })


        _.forEach(data.results, function (result) {
            heatmap.xAxisData.push(result[timeFieldIndex]);
        });
        heatmap.xAxisData = _.uniq(heatmap.xAxisData);

        heatmap.yAxisData = yAxisLabels;
        /*
         "results": [
         ["20100101000000", "holloke01", 1,  1, 0,   0,   0,   0,   1,   1,   1,   1,   null, null,  null],
         ["20100101000000", "adamssp01", 1,  1, 0,   0,   0,   0,   0,   0,   1,   1,   1,    "N1_L","N1_L"],
         ["20100101000000", "cldrivi01", 5,  5, 7,   7,   3,   3,   4.5, 4.5, 3.5, 3.5, 0.14, null,  null],
         ["20100102000000", "holloke01", 1,  1, null,null,null,null,null,null,null,null,2,   "F1",   "F1"],
         ["20100102000000", "adamssp01", 11, 11,10.1,10.1,3.3, 3.3, 5.5, 5.5, 4.5, 4.5, 3.22, "S1_U","S1_U"],
         ["20100102000000", "cldrivi01", 5,  5, 5.1, 5.1, 4.2, 4.2, 3.5, 3.5, 4,   4,   1.37, null,  null],
         ["20100103000000", "holloke01", 3,  3, 3.3, 3.3, 0.5, 0.5, 2,   2,   2.1, 2.1, 0.45, null,  null],
         ["20100103000000", "adamssp01", 9,  9, 10.5,10.5,1.1, 1.1, 6,   6,   5.3, 5.3, 2.56, null,  null],
         ["20100103000000", "cldrivi01", 3,  3, 5.1, 5.1, 2.4, 2.4, 3.2, 3.2, 4.4, 4.4, 0.74, null,  null]
         ]

         */

        _.forEach(heatmap.xAxisData, function (time, i) {
            _.forEach(heatmap.yAxisData, function (label, j) {
                var temp = label.split(delimiter),
                    condition = {},
                    item,
                    value;

                condition[timeFieldIndex] = time;

                _.forEach(keyIndexes, function (index, i) {
                    condition[index] = temp[i];
                });

                item = _.find(data.results, condition);
                if (item) {
                    value = item[scoreFieldIndex];
                } else {
                    value = null;
                }
                heatmap.scoreData.push([i, j, value]);
            });

        });


        // Datetime 포맷 UTC 변경
        heatmap.xAxisData = _.map(heatmap.xAxisData, function (d) {
            return strToDate(d);
        })

        if (isScaleMode) {
            for (var y = 0; y < heatmap.yAxisData.length; y++) {

                // 행의 최대값 구하기
                var arr = [];
                for (var x = 0; x < heatmap.xAxisData.length; x++) {
                    var index = (x * heatmap.yAxisData.length) + y;
                    arr.push(heatmap.scoreData[index][2]);
                }
                var max = Math.max.apply(Math, arr);

                // Row Scaled(Row independent) Color 적용
                for (var x = 0; x < heatmap.xAxisData.length; x++) {
                    var index = (x * heatmap.yAxisData.length) + y;
                    var value = heatmap.scoreData[index][2];
                    heatmap.scoreData[index] = {x: x, y: y, value: value, color: getPointColor(value, max)}
                }
            }
        }
        // return heatmap;

         // for line chart data
         // filed name 정의
         var timeFieldName = data.fields.time_fields[0],
         uclFieldName = data.fields.ucl[0],
         lclFieldName = data.fields.lcl[0],
         varianceFieldName = data.fields.variance[0];

         // 차트 데이터 구조
         var lineChartData = {};
         lineChartData.categories = [];
         lineChartData.series = [];
         lineChartData.series.push({name: uclFieldName, data: []});
         lineChartData.series.push({name: lclFieldName, data: []});
         lineChartData.series.push({name: varianceFieldName, data: []});

         // results 데이터를 차트데이터로 변환
         _.forEach(data.results, function (r) {
         var index = _.findIndex(data.fields.all, {name: timeFieldName})
         lineChartData.categories.push(strToDate(r[index]));
         _.forEach(lineChartData.series, function (s) {
         index = _.findIndex(data.fields.all, {name: s.name})
         s.data.push(r[index]);
         });
         })
         return lineChartData;
    }

    function renderHeatmapChart(id, data) {

        // mouseover selected row y
        var rowIndex;

        Highcharts.chart(id, {

            credits: {enabled: false},

            chart: {
                type: 'heatmap',
                height: CONTAINER_HEIGHT,
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

                                $scope.rowIndex = rowIndex;
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

                                $scope.rowIndex = rowIndex;
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

    function getPointColor(value, max) {

        if (value === null || isNaN(parseFloat(value))) {
            return '#f7f7f7';
            // value = 0;
        }
        if (max === null || isNaN(parseFloat(max))) {
            max = 0;
        }
        var color1 = '96C3F0';
        var color2 = 'FFFFFF';
        var ratio = value / max;
        if (isNaN(parseFloat(ratio))) {
            ratio = 0;
        }
        var hex = function (x) {
            x = x.toString(16);
            return (x.length == 1) ? '0' + x : x;
        };

        var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
        var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
        var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

        return '#' + hex(r) + hex(g) + hex(b);
    }

    function renderLineChart(id, data) {

        Highcharts.chart(id, {

            credits: {enabled: false},
            chart: {
                type: 'line',
                height: CONTAINER_HEIGHT,
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

    function transformLine(data) {

        // filed name 정의
        var timeFieldName = data.fields.time_fields[0],
            uclFieldName = data.fields.ucl[0],
            lclFieldName = data.fields.lcl[0],
            varianceFieldName = data.fields.variance[0];

        // 차트 데이터 구조
        var lineChartData = {};
        lineChartData.categories = [];
        lineChartData.series = [];
        lineChartData.series.push({name: uclFieldName, data: []});
        lineChartData.series.push({name: lclFieldName, data: []});
        lineChartData.series.push({name: varianceFieldName, data: []});

        // results 데이터를 차트데이터로 변환
        _.forEach(data.results, function (r) {
            var index = _.findIndex(data.fields.all, {name: timeFieldName})
            lineChartData.categories.push(strToDate(r[index]));
            _.forEach(lineChartData.series, function (s) {
                index = _.findIndex(data.fields.all, {name: s.name})
                s.data.push(r[index]);
            });
        })
        return lineChartData;
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

    function resetHighlight(chart) {
        for (var i = 0; i < chart.series[0].data.length; i++) {
            chart.series[0].data[i].update({borderWidth: 1}, false);
        }
        chart.redraw();
    }

    function getChartType(data) {

        var chartType = '';
        if (data.chartType==='line' || data.fields.keys.length === 0 && data.fields.values.length === 1) {
            chartType = 'line';
        } else {
            chartType = 'heatmap';
        }
        return chartType;
    }

    function transformHeatmapData(data, isScaleMode) {

        var delimiter = ', ',
            timeFieldName = data.fields.time_fields[0],
            scoreFieldName = data.fields.score[0];

        var timeFieldIndex = _.findIndex(data.fields.all, {name: data.fields.time_fields[0]});

        var scoreFieldIndex = _.findIndex(data.fields.all, {name: data.fields.score[0]});

        var keyIndexes = [];
        _.forEach(data.fields.keys, function (key) {
            keyIndexes.push(_.findIndex(data.fields.all, {name: key}));
        });
        keyIndexes = keyIndexes.reverse();

        var keys = [];
        _.forEach(keyIndexes, function (index) {
            var arr = [];
            _.forEach(data.results, function (result) {
                arr.push(result[index]);
            });
            keys.push(_.uniq(arr));
        });

        var yAxisLabels = [];
        _.forEach(keys, function (item, i) {
            if (i === 0) {
                _.forEach(item, function (item2) {
                    yAxisLabels.push(item2);
                });
            } else {
                var arr = [];
                _.forEach(yAxisLabels, function (item2) {
                    _.forEach(item, function (item3) {
                        arr.push(item2 + delimiter + item3);
                    });
                });
                yAxisLabels = arr;
            }
        });

        // heatmap 데이터 구조
        var heatmap = {};
        heatmap.xAxisData = [];
        heatmap.yAxisData = [];
        heatmap.scoreData = [];

        var uclIndexes=[], lclIndexes=[], varianceIndexes=[], lineChartData=[];
        _.forEach(data.fields.values, function(d, i){
            lineChartData.push([]);
            uclIndexes.push(_.findIndex(data.fields.all, {name: data.fields.ucl[i]}))
            lclIndexes.push(_.findIndex(data.fields.all, {name: data.fields.lcl[i]}))
            varianceIndexes.push(_.findIndex(data.fields.all, {name: data.fields.variance[i]}))
        })


        _.forEach(data.results, function (result) {
            heatmap.xAxisData.push(result[timeFieldIndex]);
        });
        heatmap.xAxisData = _.uniq(heatmap.xAxisData);

        heatmap.yAxisData = yAxisLabels;
        /*
         "results": [
         ["20100101000000", "holloke01", 1,  1, 0,   0,   0,   0,   1,   1,   1,   1,   null, null,  null],
         ["20100101000000", "adamssp01", 1,  1, 0,   0,   0,   0,   0,   0,   1,   1,   1,    "N1_L","N1_L"],
         ["20100101000000", "cldrivi01", 5,  5, 7,   7,   3,   3,   4.5, 4.5, 3.5, 3.5, 0.14, null,  null],
         ["20100102000000", "holloke01", 1,  1, null,null,null,null,null,null,null,null,2,   "F1",   "F1"],
         ["20100102000000", "adamssp01", 11, 11,10.1,10.1,3.3, 3.3, 5.5, 5.5, 4.5, 4.5, 3.22, "S1_U","S1_U"],
         ["20100102000000", "cldrivi01", 5,  5, 5.1, 5.1, 4.2, 4.2, 3.5, 3.5, 4,   4,   1.37, null,  null],
         ["20100103000000", "holloke01", 3,  3, 3.3, 3.3, 0.5, 0.5, 2,   2,   2.1, 2.1, 0.45, null,  null],
         ["20100103000000", "adamssp01", 9,  9, 10.5,10.5,1.1, 1.1, 6,   6,   5.3, 5.3, 2.56, null,  null],
         ["20100103000000", "cldrivi01", 3,  3, 5.1, 5.1, 2.4, 2.4, 3.2, 3.2, 4.4, 4.4, 0.74, null,  null]
         ]

         */

        _.forEach(heatmap.xAxisData, function (time, i) {
            _.forEach(heatmap.yAxisData, function (label, j) {
                var temp = label.split(delimiter),
                    condition = {},
                    item,
                    value;

                condition[timeFieldIndex] = time;

                _.forEach(keyIndexes, function (index, i) {
                    condition[index] = temp[i];
                });

                item = _.find(data.results, condition);
                if (item) {
                    value = item[scoreFieldIndex];
                } else {
                    value = null;
                }
                heatmap.scoreData.push([i, j, value]);
            });

        });


        // Datetime 포맷 UTC 변경
        heatmap.xAxisData = _.map(heatmap.xAxisData, function (d) {
            return strToDate(d);
        })

        if (isScaleMode) {
            for (var y = 0; y < heatmap.yAxisData.length; y++) {

                // 행의 최대값 구하기
                var arr = [];
                for (var x = 0; x < heatmap.xAxisData.length; x++) {
                    var index = (x * heatmap.yAxisData.length) + y;
                    arr.push(heatmap.scoreData[index][2]);
                }
                var max = Math.max.apply(Math, arr);

                // Row Scaled(Row independent) Color 적용
                for (var x = 0; x < heatmap.xAxisData.length; x++) {
                    var index = (x * heatmap.yAxisData.length) + y;
                    var value = heatmap.scoreData[index][2];
                    heatmap.scoreData[index] = {x: x, y: y, value: value, color: getPointColor(value, max)}
                }
            }
        }
        return heatmap;
    }

}

module.exports = ResultCtrl;
