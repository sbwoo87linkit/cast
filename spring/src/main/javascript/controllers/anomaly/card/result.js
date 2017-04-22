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
ResultCtrl.$inject = ['$scope', '$timeout', '$compile'];
function ResultCtrl($scope, $timeout, $compile) {

    /**
     * constant
     */
    var CONTAINER_HEIGHT = 326;
    var MARGIN_LEFT = 80;
    var X_LABEL_HEIGHT = 80;


    $scope.addCard = function () {
        console.log('============= add card =================');
    }

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.data_loaded', function (event, data) {
        // TODO: 차트 데이터 수신
        // console.log('data_loaded');
        $timeout(renderChart);
    });

    $scope.$on('anomaly.card.changeChart', function (event, type) {
        // TODO: 차트 교체 처리
    });

    $scope.$on('anomaly.card.resizeChart', function (event, size, elCard) {
        // TODO: 차트 사이즈 변경 처리

        // 최초 data_loaded 보다 size 이벤트가 먼저 발생하여 데이터가 없는 경우 차트랜더링 않음.
        if (!$scope.card.data.isEnd) {
            return
        }
        $timeout(renderChart);
    });

    $scope.$on('anomaly.card.changeHeatmapScaleMode', function (event, isScaleMode) {
        // TODO: 히트맵 scale mode 변경 처리
        $timeout(renderChart);
    });

    /**
     * 차트 기능
     */

    function renderChart() {
        var data;
        var chartType = getChartType($scope.card.data);
        $scope.app.chartType = chartType;
        //$scope.chartType = chartType;
        if (chartType === 'line') {
            processLineData($scope.card.data);
            renderLineChart();
        }

        if (chartType === 'heatmap') {
            // if ($scope.scaleModeModel.value === true) {
            //     // Scaled heatmap
            //     data = transformScaleHeatmapData($scope.card.data, true);
            //     // 차트 컨텐이너 초기화
            //     $('#container_' + $scope.$index).empty();
            //     for (var i = 0; i <= data.yAxisData.length; i++) {
            //         var chartId = 'heatmap_' + $scope.$index + '_' + i;
            //         if (i === data.yAxisData.length) {
            //             // x축 레이블 차트
            //             $('#container_' + $scope.$index).append('<div class="heatmap-chart" id="' + chartId + '">heatmap</div>');
            //         } else {
            //             // 데이터 차트
            //             $('#container_' + $scope.$index).prepend('<div class="heatmap-chart row" id="' + chartId + '">heatmap</div>');
            //         }
            //         renderScaleHeatmapChart(data, i, chartId);
            //     }
            // } else {
            //     // non-scaled heatmap
            //     data = transformPlainHeatmapData($scope.card.data, false);
            //     renderPlainHeatmapChart(data)
            // }

            console.log('$scope.scaleModeModel.value', $scope.scaleModeModel.value);

            data = transformPlainHeatmapData($scope.card.data, $scope.scaleModeModel.value);
            renderPlainHeatmapChart(data)

        }
    }

    function renderScaleHeatmapChart(data, index, chartId) {

        if (index !== data.yAxisData.length) {
            // Data 행 차트

            Highcharts.chart(chartId, {

                credits: {enabled: false},

                chart: {
                    type: 'heatmap',
                    height: (CONTAINER_HEIGHT - X_LABEL_HEIGHT) / data.yAxisData.length,
                    marginTop: 0,
                    marginBottom: 0,
                    marginRight: 0,
                    marginLeft: MARGIN_LEFT,
                    // plotBorderWidth: 1,
                    cursor: 'pointer'
                },

                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            events: {
                                contextmenu: function () {
                                    showContextMenu();
                                }
                            }
                        },
                        point: {
                            events: {
                                contextmenu: function () {
                                    showContextMenu();
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
                    title: 'xAxis title',
                    labels: {
                        enabled: false
                    }
                },

                yAxis: {
                    categories: [data.yAxisData[index]],
                    title: null,
                    labels: {
                        style: {
                            color: 'balck'		// label 을 아예 삭제하면 공간을 차지하지 않게 되어 다른 heatmap 과 줄이 안맞으므로 색상만 투명하게 처리함
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
                    enabled: true,		// tooltip 이 나오지 않게 함
                    useHTML: true,
                    backgroundColor: 'white',
                    formatter: function () {
                        return '<b>x: </b>' + this.series.xAxis.categories[this.point.x] + '<br>'
                            + '<b>y: </b>' + this.series.yAxis.categories[this.point.y] + '<br>'
                            + '<b>v: </b>' + this.point.value;
                    },
                    hideDelay: 0,

                },

                // tooltip: {
                //     hideDelay: 0,
                //     backgroundColor: "rgba(255,255,255,0)",
                //     borderWidth: 0,
                //     shadow: false,
                //     useHTML: true,
                //     formatter: function () {
                //         return '<div class="MyChartTooltip">test<br /> test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br /> test<br />  test<br />  test<br />  test<br />  test<br />    </div>';
                //     }
                // },
                //
                series: [{
                    name: 'Sales per employee',
                    borderWidth: 1,
                    // data: [[0, 0, 1], [1, 0, 2], [2, 0, 3]],
                    data: data.heatmapData[index],
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    }
                }],

                exporting: {
                    enabled: false
                }

            });

        } else {
            // x축 레이블 행 차트
            Highcharts.chart(chartId, {

                credits: {enabled: false},

                chart: {
                    type: 'heatmap',
                    height: 30,
                    marginBottom: 30,
                    marginTop: 0,
                    marginRight: 0,
                    marginLeft: MARGIN_LEFT,
                    // plotBorderWidth: 1,
                    // cursor: 'pointer'
                },

                title: {
                    text: null
                },

                xAxis: {
                    categories: data.xAxisData,
                    title: 'xAxis title',
                    labels: {
                        enabled: true
                    }
                },

                yAxis: {
                    categories: ['no-data'],
                    title: null,
                    labels: {
                        style: {
                            color: 'transparent'		// label 을 아예 삭제하면 공간을 차지하지 않게 되어 다른 heatmap 과 줄이 안맞으므로 색상만 투명하게 처리함
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
                },

                tooltip: {
                    enabled: false,		// tooltip 이 나오지 않게 함
                },

                series: [{
                    name: '',
                    borderWidth: 1,
                    data: data.heatmapData[index],
                    dataLabels: {
                        enabled: false,
                    }
                }],

                exporting: {
                    enabled: false
                }

            });
        }
    }

    function renderPlainHeatmapChart(data) {
        Highcharts.chart('container_' + $scope.$index, {


            credits: {enabled: false},

            chart: {
                type: 'heatmap',
                // height: (CONTAINER_HEIGHT - X_LABEL_HEIGHT) / data.yAxisData.length,
                marginTop: 0,
                marginBottom: X_LABEL_HEIGHT,
                marginRight: 1,
                marginLeft: MARGIN_LEFT,
                plotBorderWidth: 1,
                cursor: 'pointer',
                events: {
                    load: function () {
                        // console.log(this.series[0]);
                    }
                }
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        events: {
                            contextmenu: function () {
                                console.log('dataLabels contextMenu', this.y)
                            },
                            click: function (e) {
                                e.preventDefault();
                                console.log('dataLabels click', this)
                            }
                        }
                    },
                    point: {
                        events: {
                            contextmenu: function () {
                                console.log('point contextMenu', this.y)
                            },
                            click: function () {
                                console.log('point click', this.y)
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
                labels: {
                    enabled: true
                }
            },

            yAxis: {
                categories: data.yAxisData,
                title: null,
                labels: {
                    style: {
                        color: 'balck'		// label 을 아예 삭제하면 공간을 차지하지 않게 되어 다른 heatmap 과 줄이 안맞으므로 색상만 투명하게 처리함
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
                enabled: true,		// tooltip 이 나오지 않게 함
                useHTML: true,
                backgroundColor: 'white',
                formatter: function () {
                    return '<b>x: </b>' + this.series.xAxis.categories[this.point.x] + '<br>'
                        + '<b>y: </b>' + this.series.yAxis.categories[this.point.y] + '<br>'
                        + '<b>v: </b>' + this.point.value;
                },
                hideDelay: 0,

            },

            // tooltip: {
            //     hideDelay: 0,
            //     backgroundColor: "rgba(255,255,255,0)",
            //     borderWidth: 0,
            //     shadow: false,
            //     useHTML: true,
            //     formatter: function () {
            //         return '<div class="MyChartTooltip">test<br /> test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br /> test<br />  test<br />  test<br />  test<br />  test<br />    </div>';
            //     }
            // },
            //
            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                // data: [[0, 0, 1], [1, 0, 2], [2, 0, 3]],
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

    function transformPlainHeatmapData(data, isScaleMode) {

        // 아래는 테스트 데이터 입니다.
        data = {
            "status": {
                "current": 1,
                "total": 1
            },
            "fields": {
                "time_fields": ["FTS_PARTITION_TIME"],
                "keys": ["PLAYERID", "LGID"],  // --->  사용자 선택하는 Key가 1개 또는 여러개 들어오게 됩니다.
                "values": ["avg(HR)"],
                "ucl": ["ucl_avg(HR)"],
                "lcl": ["lcl_avg(HR)"],
                "variance": ["variance_avg(HR)"],
                "center": ["center_avg(HR)"],
                "score": ["score"],
                "code": ["code_avg(HR)"],
                "all": [
                    {
                        "name": "FTS_PARTITION_TIME",
                        "type": "text"
                    },
                    {
                        "name": "PLAYERID",
                        "type": "text"
                    },
                    {
                        "name": "LGID",
                        "type": "text"
                    },
                    {
                        "name": "avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "ucl_avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "lcl_avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "center_avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "variance_avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "score",
                        "type": "number"
                    },
                    {
                        "name": "code_avg(HR)",
                        "type": "number"
                    }
                ]
            },
            "results": [
                ["20100101000000", "NL", "holloke01", 1, 0, 0, 1, 1, null, null],
                ["20100101000000", "AL", "adamssp01", 1, 0, 0, 0, 1, 1, "N1_L"],
                ["20100101000000", "NL", "cldrivi01", 5, 7, 3, 4.5, 3.5, 0.14, null],

                ["20100102000000", "AL", "holloke01", 1, null, null, null, null, 2, "F1"],
                ["20100102000000", "AL", "adamssp01", 11, 10.1, 3.3, 5.5, 4.5, 3.22, "S1_U"],
                ["20100102000000", "NL", "cldrivi01", 5, 5.1, 4.2, 3.5, 4, 1.37, null],

                ["20100103000000", "NL", "holloke01", 3, 3.3, 0.5, 2, 2.1, 0.45, null],
                ["20100103000000", "AL", "adamssp01", 9, 10.5, 1.1, 6, 5.3, 2.56, null],
                ["20100103000000", "AL", "cldrivi01", 3, 5.1, 2.4, 3.2, 4.4, 0.74, null]
            ]
        }

        var scoreFieldIndex = _.findIndex(data.fields.all, {name: 'score'});
        // var keyCount = data.fields.keys.length;
        var keys = [];
        for (var i = data.fields.keys.length - 1; i >= 0; i--) {
            // console.log((i + 1), data.fields.keys[i])
        }

        // 데이터 구조
        var heatmap = {};
        heatmap.xAxisData = [];
        heatmap.yAxisData = [];
        heatmap.scoreData = [];
        var arrDateTimes = [];

        var arrKey1 = [];
        var arrKey2 = [];

        for (var i = 0; i < data.results.length; i++) {
            if (arrDateTimes.indexOf(data.results[i][0]) === -1) {
                arrDateTimes.push(data.results[i][0]);
            }
            if (arrKey1.indexOf(data.results[i][1]) === -1) {
                arrKey1.push(data.results[i][1]);
            }

            if (arrKey2.indexOf(data.results[i][2]) === -1) {
                arrKey2.push(data.results[i][2]);
            }
        }

        // 값 할당
        var arr = [];
        var d, k1, k2, s;  // datetime, key1, key2, score
        for (var i = 0; i < arrDateTimes.length; i++) {
            // x축 Datetime 기준으로 Array of array 구성
            arr.push([]);
            // x축 (Datatime) 추가
            heatmap.xAxisData.push(arrDateTimes[i]);
            for (var j = 0; j < arrKey2.length; j++) {
                for (var k = 0; k < arrKey1.length; k++) {

                    // y축 (keys) 추가
                    if (heatmap.yAxisData.indexOf(arrKey2[j] + ',' + arrKey1[k]) === -1) {
                        heatmap.yAxisData.push(arrKey2[j] + ',' + arrKey1[k]);
                    }
                    for (var l = 0; l < data.results.length; l++) {
                        d = data.results[l][0];
                        k1 = data.results[l][1];
                        k2 = data.results[l][2];

                        // console.log(d, arrDateTimes[i], k1, arrKey1[k], k2, arrKey2[j]);
                        if (d === arrDateTimes[i] && k1 === arrKey1[k] && k2 === arrKey2[j]) {
                            s = (data.results[l][scoreFieldIndex]);
                            // console.log('+++++++++++++ matched ', s);
                            break;
                        } else {
                            s = null;
                        }
                    }
                    arr[i].push([arrDateTimes[i], arrKey2[j], arrKey1[k], s]);
                }
            }
        }

        // console.log(JSON.stringify(data.results));
        // console.log(arrDateTimes, arrKey1, arrKey2);
        // console.log(JSON.stringify(arr));

        // heatmap matrix로 변환
        // heatmap.scoreData

        for (var x = 0; x < arr.length; x++) {
            for (var y = 0; y < arr[x].length; y++) {
                heatmap.scoreData.push([x, y, arr[x][y][3]])
            }
        }

        if ($scope.scaleModeModel.value) {
            for (var y = 0; y < heatmap.yAxisData.length; y++) {

                // 행의 최대값 구하기
                var arr = [];
                // var max = 0;
                for (var x = 0; x < heatmap.xAxisData.length; x++) {
                    // console.log(y, ':', heatmap.scoreData[y][0], heatmap.scoreData[y][1], heatmap.scoreData[y][2]);
                    var index = (x * heatmap.yAxisData.length) + y;
                    console.log(index, heatmap);
                    console.log(index, heatmap.scoreData);
                    console.log(index, heatmap.scoreData[index]);
                    console.log(index, heatmap.scoreData[index][2]);
                    arr.push(heatmap.scoreData[index][2]);
                }
                var max = Math.max.apply(Math, arr);
                // console.log(arr, max);

                // Row Scaled(Row independent) Color 적용
                for (var x = 0; x < heatmap.xAxisData.length; x++) {
                    // console.log(y, ':', heatmap.scoreData[y][0], heatmap.scoreData[y][1], heatmap.scoreData[y][2]);
                    var index = (x * heatmap.yAxisData.length) + y;
                    // console.log(index, heatmap.scoreData[index][2]);
                    var value = heatmap.scoreData[index][2];
                    heatmap.scoreData[index] = {x: x, y: y, value: value, color: getPointColor(value, max)}
                    // arr.push(heatmap.scoreData[index][2]);
                }


            }
            // console.log(JSON.stringify(heatmap));
        }
        // console.log(JSON.stringify(heatmap));

        // heatmap.scoreData = [];



        return heatmap;
    }

    function getPointColor(value, max) {

        // console.log(value, max);
        if (value === null || isNaN(parseFloat(value))) {
            return '#f7f7f7';
            // value = 0;
        }
        if (max === null || isNaN(parseFloat(max))) {
            max = 0;
        }
        var color1 = '96C3F0';
        var color2 = 'FFFFFF';
        // var ratio = 0.5;
        var ratio = value / max;
        if (isNaN(parseFloat(ratio))) {
            ratio = 0;
        }
        // console.log(value, max, ratio);
        var hex = function (x) {
            x = x.toString(16);
            return (x.length == 1) ? '0' + x : x;
        };

        var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
        var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
        var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

        var middle = '#' + hex(r) + hex(g) + hex(b);
        // console.log('middle:', middle);
        return middle;
    }

    function transformHeatmapData_temp(data, isScaleMode) {

        // console.log(data);
        // return;
        data = {
            "status": {
                "current": 1,
                "total": 1
            },
            "fields": {
                "time_fields": ["FTS_PARTITION_TIME"],
                "keys": ["PLAYERID", "LGID"],
                "values": ["avg(HR)"],
                "ucl": ["ucl_avg(HR)"],
                "lcl": ["lcl_avg(HR)"],
                "variance": ["variance_avg(HR)"],
                "center": ["center_avg(HR)"],
                "score": ["score"],
                "code": ["code_avg(HR)"],
                "all": [
                    {
                        "name": "FTS_PARTITION_TIME",
                        "type": "text"
                    },
                    {
                        "name": "PLAYERID",
                        "type": "text"
                    },
                    {
                        "name": "LGID",
                        "type": "text"
                    },
                    {
                        "name": "avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "ucl_avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "lcl_avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "center_avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "variance_avg(HR)",
                        "type": "number"
                    },
                    {
                        "name": "score",
                        "type": "number"
                    },
                    {
                        "name": "code_avg(HR)",
                        "type": "number"
                    }
                ]
            },
            "results": [
                ["20100101000000", "NL", "holloke01", 1, 0, 0, 1, 1, null, null],
                ["20100101000000", "AL", "adamssp01", 1, 0, 0, 0, 1, 1, "N1_L"],
                ["20100101000000", "NL", "cldrivi01", 5, 7, 3, 4.5, 3.5, 0.14, null],

                ["20100102000000", "AL", "holloke01", 1, null, null, null, null, 2, "F1"],
                ["20100102000000", "AL", "adamssp01", 11, 10.1, 3.3, 5.5, 4.5, 3.22, "S1_U"],
                ["20100102000000", "NL", "cldrivi01", 5, 5.1, 4.2, 3.5, 4, 1.37, null],

                ["20100103000000", "NL", "holloke01", 3, 3.3, 0.5, 2, 2.1, 0.45, null],
                ["20100103000000", "AL", "adamssp01", 9, 10.5, 1.1, 6, 5.3, 2.56, null],
                ["20100103000000", "AL", "cldrivi01", 3, 5.1, 2.4, 3.2, 4.4, 0.74, null]
            ]
        }


        var scoreFieldIndex = _.findIndex(data.fields.all, {name: 'score'});
        // var keyCount = data.fields.keys.length;
        var keys = [];
        for (var i = data.fields.keys.length - 1; i >= 0; i--) {
            // console.log((i + 1), data.fields.keys[i])
        }

        // 데이터 구조
        var arrDateTimes = [];
        var arrKey1 = [];
        var arrKey2 = [];

        for (var i = 0; i < data.results.length; i++) {
            if (arrDateTimes.indexOf(data.results[i][0]) === -1) {
                arrDateTimes.push(data.results[i][0]);
            }
            // if (arrKey1.indexOf(data.results[i][1] + ', ' + data.results[i][1]) === -1) {
            //     temp.yAxisData.push(data.results[i][2] + ', ' + data.results[i][1]);
            // }
            if (arrKey1.indexOf(data.results[i][1]) === -1) {
                arrKey1.push(data.results[i][1]);
            }

            if (arrKey2.indexOf(data.results[i][2]) === -1) {
                arrKey2.push(data.results[i][2]);
            }
        }

        // 값 할당
        var arr = [];
        var d, k1, k2, s;  // datetime, key1, key2, score
        for (var i = 0; i < arrDateTimes.length; i++) {
            // arr.push([]);
            for (var j = 0; j < arrKey2.length; j++) {
                for (var k = 0; k < arrKey1.length; k++) {

                    for (var l = 0; l < data.results.length; l++) {
                        d = data.results[l][0];
                        // console.log('d: ', d)
                        k1 = data.results[l][1];
                        k2 = data.results[l][2];

                        // console.log(d, arrDateTimes[i], k1, arrKey1[k], k2, arrKey2[j]);


                        if (d === arrDateTimes[i] && k1 === arrKey1[k] && k2 === arrKey2[j]) {
                            s = (data.results[l][scoreFieldIndex]);
                            // console.log('+++++++++++++ matched ', s);
                            break;
                        } else {
                            // console.log('---');
                            s = null;
                        }

                    }
                    arr.push([arrDateTimes[i], arrKey2[j], arrKey1[k], s]);
                }
            }
        }

        // console.log(JSON.stringify(data.results));
        // console.log(arrDateTimes, arrKey1, arrKey2);
        // console.log(JSON.stringify(arr));

        //
        // // Array of Object로 변환
        // var arr = [];
        // for (var i = 0; i < data.results.length; i++) {
        //     arr.push({datetime: data.results[i][0], score: data.results[i][scoreFieldIndex]});
        // }
        // // console.log(JSON.stringify(arr))

        // var scoreFieldPosition;
        var temp = {};
        temp.xAxisData = [];
        temp.yAxisData = [];
        temp.valueData = [];
        for (var i = 0; i < data.results.length; i++) {
            if (temp.xAxisData.indexOf(data.results[i][0]) === -1) {
                temp.xAxisData.push(data.results[i][0]);
            }
            if (temp.yAxisData.indexOf(data.results[i][2] + ', ' + data.results[i][1]) === -1) {
                temp.yAxisData.push(data.results[i][2] + ', ' + data.results[i][1]);
            }
        }
        // 검증
        // console.log(JSON.stringify(temp));
        for (var i = 0; i < data.results.length; i++) {
            // console.log(JSON.stringify(data.results[i]))
            for (var j = 0; j < data.results[i].length; j++) {
                // console.log(JSON.stringify(data.results[i]))
                console.log()
            }
        }
        /*
         datetime	20100101000000	20100102000000	20100103000000
         holloke01, NL	null	null	0.45
         holloke01, AL	null	2	    null
         adamssp01, NL	null	null	null
         adamssp01, AL	1	    3.22	2.56
         cldrivi01, NL	0.14	1.37	null
         cldrivi01, AL	null	null	0.74

         */

        var d = {};
        d.xAxisData = ['20100101000000', '20100102000000', '20100103000000'];
        d.yAxisData = ['holloke01, NL', 'holloke01, AL', 'adamssp01, NL', 'adamssp01, AL', 'cldrivi01, NL', 'cldrivi01, AL'];
        // d.valueData = [[0, 1, 2, 3], [null, 3.22, 2.56, 10]];
        // d.valueData = [[0, 1, 2, 3]];
        d.valueData = [[null, null, null, 1, 0.14, null], [null, 2, null, 3.22, 1.37, null], [0.45, null, null, 2.56, null, 0.74]];
        d.heatmapData = [];
        if (isScaleMode) {
            for (var y = 0; y <= d.yAxisData.length; y++) {
                d.heatmapData.push([]);
                for (var x = 0; x < d.xAxisData.length; x++) {
                    if (y === d.yAxisData.length) {
                        d.heatmapData[y].push([x, 0, null])
                    } else {
                        d.heatmapData[y].push([x, 0, d.valueData[x][y]])
                    }
                }
            }
        } else {
            for (var y = 0; y < d.yAxisData.length; y++) {
                // d.heatmapData.push([]);
                for (var x = 0; x < d.xAxisData.length; x++) {
                    // console.log(x,y);
                    d.heatmapData.push([x, y, d.valueData[x][y]]);
                }
            }
        }
        // console.log(JSON.stringify(d));
        return d;
    }

    function transformScaleHeatmapData(data, isScaleMode) {

        var keyCount = data.fields.keys.length;

        var scoreFieldPosition;

        var scoreFieldIndex = _.findIndex(data.fields.all, {name: 'score'});

        for (var i = 0; i < data.results.length; i++) {
        }

        var d = {};
        // d.xAxisData = ['20100101000000', '20100102000001', '20100103000002',  '20100103000003'];
        // d.yAxisData = ['holloke01', 'adamssp01', 'cldrivi01', 'aaa'];
        // d.valueData = [[0, 1, 2, 3], [null, 3.22, 2.56, 10], [0.14, 11.36, 0.74, 1000000], [0.14, 1.36, 0.74, 100000]];

        d.xAxisData = ['20100101000000', '20100102000001', '20100102000002'];
        d.yAxisData = ['aaa', 'bbb', 'ccc', 'ddd'];
        // d.valueData = [[0, 1, 2, 3], [null, 3.22, 2.56, 10]];
        // d.valueData = [[0, 1, 2, 3]];
        d.valueData = [[1, 2, 3, 4], [5, 6, 700000, 8], [9, 10, 11, 12]];
        d.heatmapData = [];
        if (isScaleMode) {
            for (var y = 0; y <= d.yAxisData.length; y++) {
                d.heatmapData.push([]);
                for (var x = 0; x < d.xAxisData.length; x++) {
                    if (y === d.yAxisData.length) {
                        d.heatmapData[y].push([x, 0, null])
                    } else {
                        d.heatmapData[y].push([x, 0, d.valueData[x][y]])
                    }
                }
            }
        } else {
            for (var y = 0; y < d.yAxisData.length; y++) {
                // d.heatmapData.push([]);
                for (var x = 0; x < d.xAxisData.length; x++) {
                    // console.log(x,y);
                    d.heatmapData.push([x, y, d.valueData[x][y]]);
                }
            }
        }
        console.log(JSON.stringify(d));
        return d;
    }

    function renderLineChart() {

        Highcharts.chart('container_' + $scope.$index, {

            credits: {enabled: false},

            title: {
                text: null
            },

            subtitle: {
                text: null
            },

            xAxis: {
                categories: $scope.lineData.categories,
                type: 'datetime',
                labels: {
                    // format: '{value:%Y.%m.%d %H:%M:%S}',
                    format: '{value:%m/%d %M:%S}',
                }
            },

            yAxis: {
                title: {
                    text: 'Value'
                }
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

            series: $scope.lineData.series

        });

    }

    function renderHeatmapChart2(chartId, data, isLast, height, index, max) {

        // console.log('index:', index);
        // console.log(data.valueData[index]);

        for (var i = 0; i < 10; i++) {
            console.log(Highcharts.getOptions().colors[i])
        }

        var heatmapData = [];
        for (var i = 0; i < data.xAxisData.length; i++) {
            if (!isLast) {
                // console.log('index', index, 'i', i, data.valueData[index], data.valueData[index][i])
                console.log('index', index, 'i', i, data.valueData[index])
                heatmapData.push([i, 0, data.valueData[index][i]])
            } else {
                heatmapData.push([i, 0, '0']) // x축 Heatmap,
            }
            // console.log([0,0,10]);
        }

        // console.log(JSON.stringify(heatmapData));
        height = 30;

        var marginBottom = 0, yAxisLabelColor, tooltipEnabled, dataLabelEnabled;
        if (isLast) {
            dataLabelEnabled = false;
            tooltipEnabled = false;
            marginBottom = 50;
            height = 30;
            yAxisLabelColor = 'transparent';
        } else {
            dataLabelEnabled = true;
            tooltipEnabled = true;
            marginBottom = 0;
            yAxisLabelColor = 'black';
        }


        Highcharts.chart(chartId, {

            credits: {enabled: false},

            chart: {
                type: 'heatmap',
                height: height,
                marginTop: 0,
                marginBottom: marginBottom,
                marginRight: 0,
                marginLeft: 80,
                plotBorderWidth: 1,
                cursor: 'pointer'
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        events: {
                            contextmenu: function () {
                                showContextMenu();
                            }
                        }
                    },
                    point: {
                        events: {
                            contextmenu: function () {
                                showContextMenu();
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
                title: 'xAxis title',
                labels: {
                    enabled: isLast
                }
            },

            yAxis: {
                categories: [data.yAxisData[index]],
                title: null,
                labels: {
                    style: {
                        color: yAxisLabelColor		// label 을 아예 삭제하면 공간을 차지하지 않게 되어 다른 heatmap 과 줄이 안맞으므로 색상만 투명하게 처리함
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
                enabled: tooltipEnabled,		// tooltip 이 나오지 않게 함
                useHTML: true,
                backgroundColor: 'white',
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                        this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                },
                hideDelay: 0,

            },

            // tooltip: {
            //     hideDelay: 0,
            //     backgroundColor: "rgba(255,255,255,0)",
            //     borderWidth: 0,
            //     shadow: false,
            //     useHTML: true,
            //     formatter: function () {
            //         return '<div class="MyChartTooltip">test<br /> test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br />  test<br /> test<br />  test<br />  test<br />  test<br />  test<br />    </div>';
            //     }
            // },
            //
            series: [{
                name: 'Sales per employee',
                borderWidth: 1,
                // data: [[0, 0, 1], [1, 0, 2], [2, 0, 3]],
                data: heatmapData,
                dataLabels: {
                    enabled: dataLabelEnabled,
                    color: '#000000'
                }
            }],

            exporting: {
                enabled: false
            }

        });
    }

    function showContextMenu(e) {
        //TODO : call mu-popup
        console.log('context menu');
    }

    function renderHeatmapChart3() {

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

        new Highcharts.Chart('container' + $scope.$index, {
            credits: {enabled: false},
            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
            },


            // title: {
            //     text: $scope.card.data.fields.key_field[0].name
            // },

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

    function renderPlainHeatmapChart2() {
        Highcharts.chart('container_' + $scope.$index, {

            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
            },
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        events: {
                            dblclick: function () {
                                console.log('dbclick on datalabel');
                            },
                            click: function () {
                                console.log('click on datalabel');
                            },
                            contextmenu: function () {
                                console.log('context menu on datalabel');
                            }
                        }
                    },
                    events: {
                        dblclick: function () {
                            console.log('dbclick on serie');
                        },
                        click: function () {
                            console.log('click on serie');
                        },
                        contextmenu: function () {
                            console.log('context menu on serie');
                        }
                    },
                    point: {
                        events: {
                            dblclick: function () {
                                console.log('dbclick on serie point');
                            },
                            click: function () {
                                console.log('click on serie point');
                            },
                            contextmenu: function () {
                                console.log('context menu on serie point');
                            }
                        }
                    }
                }
            },

            title: {
                text: 'Sales per employee per weekday'
            },

            xAxis: {
                categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura']
            },

            yAxis: {
                categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
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
                symbolHeight: 280
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                        this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                }
            },

            series: [{
                event: {
                    click: function () {
                        console.log('click')
                    }
                },
                name: 'Sales per employee',
                borderWidth: 1,
                data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }]

        });
    }

    function getChartType(data) {

        var chartType = ''
        if (data.fields.keys.length === 0 && data.fields.values.length === 1) {
            chartType = 'line';
        } else {
            chartType = 'heatmap';
        }
        // console.log('chartType:', chartType);
        return chartType;
    }

    function processHeatmapData2(data) {

        console.log('data', data);
        var keyCount = data.fields.keys.length;
        console.log('keyCount', keyCount);

        var scoreFieldPosition;
        console.log(data.fields.all);

        var scoreFieldIndex = _.findIndex(data.fields.all, {name: 'score'});
        console.log('scoreFieldIndex', scoreFieldIndex);

        for (var i = 0; i < data.results.length; i++) {
            // console.log(data.results[i][scoreFieldIndex]);
        }

        var d = {};
        d.xAxisData = ['20100101000000', '20100102000000', '20100103000000', '20100103000000'];
        d.yAxisData = ['holloke01', 'adamssp01', 'cldrivi01', 'aaa'];
        d.valueData = [[null, 2, 0.45, 10], [1, 3.22, 2.56, 10], [0.14, 11.36, 0.74, 1000000], [0.14, 1.36, 0.74, 100000]];

        return d;
    }

    function processLineData(data) {

        // line - 2: UCL, 3: LCL, 5: variance
        data.results = data.results.sort(Comparator);

        // ------------------
        // transform data...
        // ------------------
        $scope.lineData = {};
        $scope.lineData.series = [];
        $scope.lineData.categories = [];
        var uclName = data.fields.ucl[0], //'ucl_avg(HR)';
            lclName = data.fields.ucl[0], // 'lcl_avg(HR)';
            varianceName = data.fields.variance[0];// 'variance_avg(HR)';

        $scope.lineData.series.push({name: uclName, data: []});
        $scope.lineData.series.push({name: lclName, data: []});
        $scope.lineData.series.push({name: varianceName, data: []});


        for (var i = 0; i < data.results.length; i++) {
            // console.log(data.results[i])
            $scope.lineData.series[0].data.push(data.results[i][2]); // ucl
            $scope.lineData.series[1].data.push(data.results[i][3]); // lcl
            $scope.lineData.series[2].data.push(data.results[i][5]); // variance
            // var date =
            // $scope.lineData.categories.push(stringToDateFormat(data.results[i][0], "yyyy-mm-dd hh:mm:ss")); // x축 categories
            $scope.lineData.categories.push(strToDate(data.results[i][0]));
        }
    }

    function Comparator(a, b) {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
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

    // Heatmap Stacking 으로 하위 heatmap에 가려지는 tooltip을 보이게 함
    $('body').on('mouseenter', '.highcharts-container', function () {
        var container = $(this);
        $('.highcharts-container').not($(this)).css('position', 'static');
    });

    $('body').on('mouseleave', '.highcharts-container', function () {
        $('.highcharts-container').css('position', 'relative');
    });

}

module.exports = ResultCtrl;
