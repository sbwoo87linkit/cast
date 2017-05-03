'use strict';
/**
 *
 */
var _ = require('lodash');
var uuidV1 = require('uuid/v1');
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
    var card;
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

                var cfg;

                if (card.chartType === null) {
                    if ((data.fields.keys.length === 0 && data.fields.values.length === 1)) {
                        card.chartType = 'line';
                    } else {
                        card.chartType = 'heatmap';
                    }
                } else {
                    if (card.chartType === 'line') {
                        cfg = transformToLineData(data);
                    } else  {
                        cfg = transformToHeatmapData(data, false);
                    }
                }


                card.data = data;

                card.cfg = cfg;

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

    function transformToHeatmapData2(data, isRowScale) {

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

        var uclIndexes = [], lclIndexes = [], varianceIndexes = [], lineChartData = [];
        _.forEach(data.fields.values, function (d, i) {
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
                    heatmap.scoreData[index] = {x: x, y: y, value: value, color: getPointColor(value, max)}
                }
            }
        }
        return heatmap;

    }

    function transformToLineData(data, isRowScale) {
        var cfg = {
            options: {
                chart: {
                    type: 'line',
                    marginTop: 0,
                    marginBottom: 0,
                    width: WIDTH,
                    height: HEIGHT
                },
                legend: ''
            },
            series: [{
                name: 'Installation',
                data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
            }, {
                name: 'Manufacturing',
                data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
            }, {
                name: 'Sales & Distribution',
                data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
            }, {
                name: 'Project Development',
                data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
            }, {
                name: 'Other',
                data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
            }],
            title: ' ',
            // xAxis: {categories: ['1/10', '1/11']},
            // yAxis: {categories: ['TV', 'RADIO']}
        };

        return cfg;
    }

    function transformToHeatmapData(data, isRowScale) {

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

        var uclIndexes = [], lclIndexes = [], varianceIndexes = [], lineChartData = [];
        _.forEach(data.fields.values, function (d, i) {
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
                    heatmap.scoreData[index] = {x: x, y: y, value: value, color: getPointColor(value, max)}
                }
            }
        }
        // return heatmap;

        var data = [];
        if (isRowScale) {
            data = [[0, 0, 1], [0, 1, 0], [1, 0, 3], [1, 1, 3]];
        } else {
            //TODO color 표기로 변경
            data = [[0, 0, 1], [0, 1, 0], [1, 0, 3], [1, 1, 1]];
        }

        var rowIndex = -1;

        var cfg = {
            options: {
                chart: {
                    type: 'heatmap',
                    marginTop: 0,
                    marginBottom: 0,
                    width: WIDTH,
                    height: HEIGHT
                },
                colorAxis: {
                    min: 0,
                    minColor: '#FFFFFF',
                    maxColor: Highcharts.getOptions().colors[0]
                },

                legend: '',
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
                }
            },
            series: [{
                data: data,
                dataLabels: {
                    enabled: true,
                    color: '#000000'
                }
            },],
            title: ' ',
            xAxis: {categories: ['1/10', '1/11']},
            yAxis: {categories: ['TV', 'RADIO']}
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
            return (x.length == 1) ? '0' + x : x;
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
    };

    // 요청 취소
    $scope.cancelAde = function () {
        abortJob();
    };

    /**
     * 이벤트
     */
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
        $scope.cards[$scope.$index].cfg = transformToHeatmapData(card.data, isScaleMode);
    };

    //
    // $scope.splitClick = function () {
    //
    //     var card = _.cloneDeep($scope.card);
    //     console.log('splitClick', card.data.fields.values.length);
    //     _.times(card.data.fields.values.length, function (i) {
    //
    //         var card = _.cloneDeep($scope.card);
    //         card.data.valueIndex = i;
    //         card.data.chartType = 'line';
    //         // from container Ctrl
    //         $scope.splitCard($scope.$index, card);
    //     })
    // }
    //




    // 카드 분리
    $scope.splitCard = function (rowIndex) {

        var card = _.cloneDeep($scope.card);
        _.times(card.data.fields.values.length, function (i) {

            var card = _.cloneDeep($scope.card);
            console.log('popup splitClick', i)
            card.valueIndex = i;
            card.rowIndex = rowIndex;
            // to container Ctrl (parent - parent CTRL)

            // $scope.splitCard($scope.$index, card);

            var cardList = $scope.cards;
            // var card = _.cloneDeep($scope.card);
            var titleKey = 'adeOptions.title';

            // 카드 분리시 아이디 부여
            card.id = uuidV1();

            // Target 차트는 항상 라인차트임
            card.chartType = 'line';
            card.cfg = transformToLineData(card.data, card.rowIndex, card.valueIndex );


            card.adeOptions.title = util.getCopyTitle(cardList, titleKey, card.adeOptions.title);

            cardList.push(card);
            // $timeout(function () {
            //     console.log('broadcast......')
            //     $scope.$broadcast('anomaly.card.data_loaded', card.data);
            // })



        })
    }

    $(document, '.popup-hide').on("click", function(){
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












}



module.exports = CardCtrl;
