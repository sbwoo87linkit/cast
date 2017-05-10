'use strict';
/**
 *
 */
var _ = require('lodash');
var uuidV1 = require('uuid/v1');

var Highcharts = require('highcharts');
/**
 * Controller
 */
CardCtrl.$inject = ['$scope', '$timeout', '$element', 'anomalyAgent', 'searchCond', 'dataModel', 'OPTIONS.ANOMALY', 'popupLayerStore', 'util'];
function CardCtrl($scope, $timeout, $element, anomalyAgent, searchCond, dataModel, anomalyOpts, popupLayerStore, util) {
    /**
     * scope
     */
    $scope.chartTypes = anomalyOpts.CHART_TYPES;
    $scope.errorMsg = '';

    /**
     * variables
     */
    var card,
        anomalyObj = null,
        HIGHLIGHT_WIDTH = 5,
        HEIGHT = $('.anomalyBlank').height() - 70,
        WIDTH = $('.anomalyBlank').width() - 20;

    /**
     * 차트 부분
     */
    $scope.changeChartType = function (type) {
        // to result ctrl
        $scope.$broadcast('anomaly.card.changeChart', type);
    };

    $scope.$watch('card.isMaxSize', function (isMaxSize) {
        if (isMaxSize === undefined) {
            return;
        }

        // to result ctrl
        $timeout(function () {
            var el = $element;
            var size = {
                width: el.outerWidth(),
                height: el.outerHeight()
            };
            $scope.$broadcast('anomaly.card.resizeChart', size, el);
        });
    });

    /**
     * function
     */
    var runJob = function () {
        var params = _.cloneDeep($scope.card);

        params.query = searchCond.query();
        params.datamodel_id = dataModel.id();

        anomalyObj = anomalyAgent.anomaly(params);

        card = $scope.card;

        card.state.running = true;
        card.state.success = false;
        card.state.error = false;

        anomalyObj
            .success(function (data) {

                card.data = data;

                card.state.current = data.status.current;
                card.state.total = data.status.total;

                var isEnd = data.isEnd;
                if (isEnd) {
                    card.state.running = false;
                    card.state.success = true;
                    card.state.error = false;
                    card.state.current = 0;
                    card.state.total = 1;

                    $scope.$broadcast('anomaly.card.data_loaded', data);

                    var cfg;
                    if (card.chartType === null) {
                        if ((data.fields.keys.length === 0 && data.fields.values.length === 1)) {
                            card.chartType = 'line';
                        } else {
                            card.chartType = 'heatmap';
                        }
                    }

                    if (card.chartType === 'line') {
                        cfg = transformToChartData(card);
                    } else {
                        // 최초실행시 row scale : false
                        cfg = transformToChartData(card, false);
                    }
                    card.cfg = cfg;
                }
            })
            .error(function (error) {
                $scope.errorMsg = error.message;

                card.state.running = false;
                card.state.success = false;
                card.state.error = true;
                card.state.current = 0;
                card.state.total = 1;
            })
            .fetch();
    };

    var abortJob = function () {
        var card = $scope.card;

        card.state.running = false;
        card.state.success = false;
        card.state.error = true;
        card.state.current = 0;
        card.state.total = 1;

        anomalyObj.abort(function () {
            // 요청 취소 성공시 동작...
        }, function (error) {
            $scope.errorMsg = error.message;
        });
    };

    var closeLayer = function (index) {
        var layer = popupLayerStore.get('anomaly.layer.cardmenu_' + index);

        if (layer) {
            popupLayerStore.get('anomaly.layer.cardmenu_' + index).closeEl();
        }
    };

    function transformToChartData(card, isRowScale) {

        var data = card.data,
            valueIndex;

        if (card.rowIndex === null) {
            valueIndex = 0;
        } else {
            valueIndex = card.valueIndex;
        }

        var delimiter = ', ';
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

        _.forEach(data.results, function (result) {
            heatmap.xAxisData.push(result[timeFieldIndex]);
        });
        heatmap.xAxisData = _.uniq(heatmap.xAxisData);

        heatmap.yAxisData = yAxisLabels;

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

        if (card.chartType === 'heatmap') {
            // Datetime 포맷 UTC 변경
            heatmap.xAxisData = _.map(heatmap.xAxisData, function (d) {
                return strToDate(d);
            });

            if (isRowScale) {
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
                        heatmap.scoreData[index] = {x: x, y: y, value: value, color: getPointColor(value, max)};
                    }
                }
            } else {
                // 테이블 전체의 최대값 구하기
                var max = 0;
                for (var i=0; i < heatmap.scoreData.length; i ++) {
                    if (heatmap.scoreData[i][2] > max) {
                        max = heatmap.scoreData[i][2];
                    }
                }
                for (var y = 0; y < heatmap.yAxisData.length; y++) {
                    for (var x = 0; x < heatmap.xAxisData.length; x++) {
                        var index = (x * heatmap.yAxisData.length) + y;
                        var value = heatmap.scoreData[index][2];
                        heatmap.scoreData[index] = {x: x, y: y, value: value, color: getPointColor(value, max)};
                    }
                }
            }
            // console.log(heatmap)
            return configHeatmapChart(heatmap);

        } else {

            // Line chart
            var lineChartData = {};
            lineChartData.series = [];
            lineChartData.categories = [];

            lineChartData.series.push({name: data.fields.ucl[valueIndex], color:Highcharts.getOptions().colors[0], data: []});
            lineChartData.series.push({name: data.fields.lcl[valueIndex], color:Highcharts.getOptions().colors[1], data: []});
            lineChartData.series.push({name: data.fields.variance[valueIndex], color:Highcharts.getOptions().colors[2], data: []});

            var uclIndex = _.findIndex(data.fields.all, {name: data.fields.ucl[valueIndex]});
            var lclIndex = _.findIndex(data.fields.all, {name: data.fields.lcl[valueIndex]});
            var varianceIndex = _.findIndex(data.fields.all, {name: data.fields.variance[valueIndex]});

            if (data.fields.keys.length > 0) {

                _.forEach(heatmap.yAxisData, function (label) {
                    if (label === card.rowCategory) {
                        _.forEach(heatmap.xAxisData, function (time) {
                            var temp = label.split(delimiter),
                                condition = {},
                                item,
                                ucl,
                                lcl,
                                variance;

                            condition[timeFieldIndex] = time;
                            _.forEach(keyIndexes, function (index, i) {
                                condition[index] = temp[i];
                            });

                            item = _.find(data.results, condition);
                            if (item) {
                                ucl = item[uclIndex];
                                lcl = item[lclIndex];
                                variance = item[varianceIndex];
                            } else {
                                ucl = null;
                                lcl = null;
                                variance = null;
                            }
                            lineChartData.series[0].data.push(ucl);
                            lineChartData.series[1].data.push(lcl);
                            lineChartData.series[2].data.push(variance);
                        });
                    }
                });
                // Datetime 포맷 UTC 변경
                heatmap.xAxisData = _.map(heatmap.xAxisData, function (d) {
                    return strToDate(d);
                });
            } else {
                var timeFieldName = data.fields.time_fields[0];//
                // results 데이터를 차트데이터로 변환
                _.forEach(data.results, function (r) {
                    var index = _.findIndex(data.fields.all, {name: timeFieldName});
                    lineChartData.categories.push(strToDate(r[index]));
                    _.forEach(lineChartData.series, function (s) {
                        index = _.findIndex(data.fields.all, {name: s.name});
                        s.data.push(r[index]);
                    });
                });
            }
            lineChartData.categories = heatmap.xAxisData;
            return configLineChart(lineChartData);
        }
    }

    function configLineChart(lineChartData) {
        var cfg = {
            options: {
            },
            chart: {
                type: 'line',
                marginTop: 0,
                marginBottom: 0,
                width: WIDTH,
                height: HEIGHT
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
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
                }
            },
            legend: {
                enabled: false,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            // legend: ''
            exporting: {
                enabled: false
            },
            series: lineChartData.series,
            title: ' ',
            xAxis: {
                categories: lineChartData.categories,
                type: 'datetime',
                labels: {
                    format: '{value:%m/%d %M:%S}',
                }

            },
            yAxis: {
                enabled: false,
                title: {
                    text: null
                }
            },

            // yAxis: {categories: ['TV', 'RADIO']}
        };

        return cfg;
    }

    function configHeatmapChart(heatmap) {

        var rowIndex = -1;
        var chart = null;

        var cfg = {
            // options: {
            // },
            chart: {
                type: 'heatmap',
                marginTop: 0,
                marginBottom: 0,
                width: WIDTH,
                height: HEIGHT,
                colorAxis: {
                    min: 0,
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0] //'#96C3F0'
                },
            },

            exporting: {
                enabled: false
            },
            tooltip: {
                enabled: true,
                useHTML: true,
                backgroundColor: 'white',
                formatter: function () {
                    return [
                        '<b>시간: </b>' + Highcharts.dateFormat('%m/%d %M:%S', this.series.xAxis.categories[this.point.x]),
                        '<b>키: </b>' + this.series.yAxis.categories[this.point.y],
                        '<b>score: </b>' + this.point.value
                    ].join('<br>');
                },
                hideDelay: 0
            },

            credits: {enabled: false},
            legend: {
                enabled: false,
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
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

                                $scope.rowCategory = chart.yAxis[0].categories[rowIndex];
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

                                //var chart = this.series.chart;
                                $scope.rowCategory = chart.yAxis[0].categories[rowIndex];
                                $scope.rowIndex = rowIndex;
                                $scope.$apply();
                                showPopup('popup', event);
                            },

                            mouseOver: function () {
                                chart = this.series.chart;
                                rowIndex = this.y;
                                resetHighlight(chart);
                                for (var i = 0; i < chart.xAxis[0].categories.length; i++) {
                                    var index = this.y + i * chart.yAxis[0].categories.length;
                                    chart.series[0].data[index].update({borderWidth: HIGHLIGHT_WIDTH}, false);
                                }
                                chart.redraw();
                            },

                            mouseOut: function () {
                                chart = this.series.chart;
                                resetHighlight(chart);
                            }
                        }
                    }
                }
            },

            title: null,



            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },


            // colorAxis: {
            //     min: 0,
            //     minColor: '#FFFFFF',
            //     // maxColor: Highcharts.getOptions().colors[0] //96C3F0
            //     maxColor: '#96C3F0'
            //
            // },


            series: [{
                name: 'score',
                borderWidth: 1,
                borderColor: Highcharts.getOptions().colors[0],
                data: heatmap.scoreData,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            }],
            xAxis: {
                categories: heatmap.xAxisData,
                title: 'Datetime',
                type: 'datetime',
                labels: {
                    format: '{value:%m/%d %M:%S}',
                }
            },
            yAxis: {
                categories: heatmap.yAxisData,
                title: null,
                labels: {
                    style: {
                        color: 'black'
                    }
                }
            }

        };

        return cfg;

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
            return (x.length === 1) ? '0' + x : x;
        };

        var r = Math.ceil(parseInt(color1.substring(0, 2), 16) * ratio + parseInt(color2.substring(0, 2), 16) * (1 - ratio));
        var g = Math.ceil(parseInt(color1.substring(2, 4), 16) * ratio + parseInt(color2.substring(2, 4), 16) * (1 - ratio));
        var b = Math.ceil(parseInt(color1.substring(4, 6), 16) * ratio + parseInt(color2.substring(4, 6), 16) * (1 - ratio));

        return '#' + hex(r) + hex(g) + hex(b);
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

    /**
     * 버튼 이벤트
     */
    // 설정 변경
    $scope.changeOptions = function (index) {
        var card = $scope.card;
        $scope.$root.$broadcast('anomaly.popup.edit.setForm', 'update', card.id, card.adeOptions);
        $scope.$root.$broadcast('dialog.open.anomaly.popup.edit');

        if (index) {
            closeLayer(index);
        }
    };

    // 다시 실행
    $scope.restartJob = function (index) {
        runJob();
        closeLayer(index);
    };

    // 카드 삭제
    $scope.removeCard = function (index) {
        $scope.cards.splice(index, 1);

        closeLayer(index);

        resizeAll();
    };

    // 요청 취소
    $scope.cancelAde = function () {
        abortJob();
    };

    /**
     * 이벤트
     */

    function resizeAll() {
        $('.chart').each(function() {
            $(this).highcharts().setSize(
                $(this).parent().width(),
                $('.anomalyBlank').height() - 70,
                false
            );
        });
    }

    window.onresize = function() {
        resizeAll();
    };

    $scope.$on('anomaly.card.update.' + $scope.card.id, function (event, adeOptions) {
        // update options
        _.assign($scope.card.adeOptions, adeOptions);
    });
    $scope.$on('anomaly.card.run.' + $scope.card.id, function () {
        runJob();
    });
    $scope.$on('anomaly.card.abort.all', function () {
        abortJob();
    });
    $scope.$on('anomaly.card.resizeChart', function (event, size, elCard) {
        // 차트 사이즈 변경 처리
        try {
            $('#chart_' + $scope.$index).highcharts().setSize(
                size.width - 22,
                size.height - 70,
                false
            );
        } catch (err) {
            // do noting
        }
    });

    // Row Scaled 히트맵 컬러
    $scope.changeHeatmapScaleMode = function (isScaleMode) {
        $scope.cards[$scope.$index].cfg = transformToChartData($scope.card, isScaleMode);
    };

    // 카드 분리
    $scope.splitCard = function (rowIndex, rowCategory) {

        var card = _.cloneDeep($scope.card);
        _.times(card.data.fields.values.length, function (i) {

            var card = _.cloneDeep($scope.card);
            card.valueIndex = i;
            card.rowIndex = rowIndex;
            card.rowCategory = rowCategory;
            var cardList = $scope.cards;
            var titleKey = 'adeOptions.title';

            // 카드 분리시 아이디 부여
            card.id = uuidV1();

            // Target 차트는 항상 라인차트임
            card.chartType = 'line';

            // rowIndex와 valueIndex 기준 차트데이터 변환
            card.cfg = transformToChartData(card);
            card.adeOptions.title = util.getCopyTitle(cardList, titleKey, card.adeOptions.title);
            cardList.push(card);
        });
    };

    /**
     * 팝업 제어
     */

    // 문서 또는 popup-hide 클래스 엘리먼트 클릭시 팝업 닫기
    $(document, '.popup-hide').on('click', function () {
        hidePopup();
    });

    function showPopup(id, e) {
        hidePopup();
        var el = $('#' + id + $scope.$index);
        el.css('display', 'block');
        el.css('left', e.clientX + 'px');
        el.css('top', e.clientY + 'px');
    }

    function hidePopup() {
        $('.popup').css('display', 'none');
    }
}

module.exports = CardCtrl;
