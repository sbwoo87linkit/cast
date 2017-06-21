'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
var Highcharts = require('highcharts');
var async = require('async');

// var angular = require('angular');
// var d3 = require('d3');
// var webchart = require('webchart');


/**
 * Controller
 */

MotionCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', '$window'];
function MotionCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                    searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility, $window) {

    $scope.tabs = ['일반', 'X축', 'Y축', '원'];

    $scope.chartOpts = {

        general: {
            drilldown: {
                text: '드릴다운',
                controls: {
                    drilldown: {
                        type: 'buttonGroup',
                        selected: 'yes',
                        options: [
                            {text: "예", value: 'yes'},
                            {text: "아니오", value: 'no'}
                        ]
                    }
                }
            },
            keyValue: {
                text: '키 값',
                controls: {
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
        },
        xAxis: {
            label: {
                text: '레이블',
                controls: {
                    input: {
                        type: 'input',
                        value: 'x Axis label' // 입력값 테스트
                    },
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
            margin: {
                text: '간격',
                controls: {
                    input: {
                        type: 'input',
                        value: '10'
                    }
                }
            },
            min: {
                text: '최소',
                controls: {
                    input: {
                        type: 'input',
                        value: '10'
                    }
                }
            },
            max: {
                text: '최대',
                controls: {
                    input: {
                        type: 'input',
                        value: '1200'
                    }
                }
            },
            // sort: {
            //     text: '정렬',
            //     controls: {
            //         dropdown: {
            //             type: 'dropdown',
            //             selected: {}, // Dropdown 선택
            //             options: [
            //                 {text: "기본값", value: 'default'},
            //                 {text: "오름차순", value: 'ascending'},
            //                 {text: "내림차순", value: 'descending', isSelected: true} // default 내림차순 선택
            //             ]
            //         }
            //     }
            // }
        },
        yAxis: {
            label: {
                text: '레이블',
                controls: {
                    input: {
                        type: 'input',
                        value: 'y Axis label' // 입력값 테스트
                    },
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
            margin: {
                text: '간격',
                controls: {
                    input: {
                        type: 'input',
                        value: '10'
                    }
                }
            },
            min: {
                text: '최소',
                controls: {
                    input: {
                        type: 'input',
                        value: '10'
                    }
                }
            },
            max: {
                text: '최대',
                controls: {
                    input: {
                        type: 'input',
                        value: '1200'
                    }
                }
            }
        },
        circle: {
            min: {
                text: '최소 크기',
                controls: {
                    input: {
                        type: 'input',
                        value: '1'
                    }
                }
            },
            max: {
                text: '최대 크기',
                controls: {
                    input: {
                        type: 'input',
                        value: '50'
                    }
                }
            },
        }

    }

    $scope.fieldOpts = {
        opts: {},
        drops: {
            sizeField: {"name": "Event Object의 개수", "type": "TEXT", "option": null},
            // TODO: delete. 이하 테스트 Data
            timeField: _.find($scope.fieldList, function (x) {
                return x.type === 'TIMESTAMP'
            }),
            xAxisField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            yAxisField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            groupField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
        }

    }

    var _modelChangeTimer = null;

    $scope.$watch('chartOpts', function (value) {

        console.log('Model Changed....111')
        // if data is not loaded
        if (!$scope.data) {
            return;
        }

        // 중복발생 방지 처리, Model change 확인
        $window.clearTimeout(_modelChangeTimer);
        _modelChangeTimer = $window.setTimeout(function () {

            console.log('Model Changed....')
            renderChart()

        }, 100);
    }, true);

    /**
     *   button group
     */

    var chart;

    $scope.currState = 'stop';
    $scope.isState = function (state) {
        return $scope.currState === state;
    };

    $scope.play = function () {
        $scope.currState = 'play';
        chart.play();
    };
    $scope.pause = function () {
        $scope.currState = 'pause';
        chart.pause();
    };
    $scope.resume = function () {
        $scope.currState = 'resume';
        chart.resume();
    };
    $scope.stop = function () {
        $scope.currState = 'stop';
        chart.stop();
    };

    window.onresize = function () {
        resizeAll();
    };

    function resizeAll() {
        $('.chart').each(function () {
            $(this).highcharts().setSize(
                $(this).parent().width(),
                $(this).parent().height(),
                false
            );
        });
        _.forEach($scope.adv.chartData, function (row, index) {
            var container = $('#container_' + index);
            if (row.config) {
                var chart = row.config.getChartObj();
                $timeout(function () {
                    chart.setSize(container.width(), container.height(), true);
                })
            }
        })
    }

    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {
        var msg = null;

        if (!$scope.fieldOpts.drops.groupField) {
            msg = '그룹 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.sizeField) {
            msg = '사이즈 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.yAxisField) {
            msg = 'y축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.xAxisField) {
            msg = 'x축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.timeField) {
            msg = '시간 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }


        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: [],
            field_options: $scope.fieldOpts
        }

        utility.closeAllLayers();

        var service = 'adv-motion';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d) {
                // console.log(d1);
                $scope.adv.isWaiting = false;
                $scope.data = d.data;
                renderChart(service, d);
            }, function (err) {
            });
        });

    })

    var renderChart = function (service, d, rowIndex) {

        console.log($scope.chartOpts.circle.max.controls.input.value)

        // $('.motion-slider').remove();
        $('#chart1').empty();

        var MotionChart = MobigenWebChart.chart.MotionChart;

        var options = {
            width: 600,
            height: 400,
            xAxis: {
                map: 'AB',
                label: 'AB',
                grid: true
            },
            yAxis: {
                map: 'H',
                label: 'H',
                grid: true
            },
            radius: {
                map: 'HR',
                range: [
                    $scope.chartOpts.circle.min.controls.input.value,
                    $scope.chartOpts.circle.max.controls.input.value
                ] // [min, max]
            },
            series: {
                map: 'PTIME'
            },
            key: 'PLAYERID',
            slider: {
                tickFormat: '%Y'
                // tickFormat: '%Y%m%d%H%M%S'
            },
            lostData: {
                type: 'blur'
            }
        };
        chart = new MotionChart('#chart1', options);

        chart.duration(10000); // 10 sec


        // var data = d.data.results;
        var data = $scope.data.results;

        var parseDate = d3.time.format('%Y').parse;
        // var parseDate = d3.time.format('%Y%m%d%H%M%S').parse;
        var data = [];
        $scope.data.results.forEach(function (item, i) {
            // var arr = [];
            var obj = {};
            $scope.data.fields.forEach(function (field, j) {
                // data.push({})
                // arr.push()
                if (field.type === 'TIMESTAMP') {
                    // obj[field.name] = parseDate(utility.strToDate(item[j]));
                    obj[field.name] = parseDate(item[j].substring(0, 4));
                } else {
                    obj[field.name] = item[j];
                }
            })
            data.push(obj)
        })

        data = [
            {"PTIME": "1974", "AB": 367, "H": 211, "PLAYERID": "Sanches", "HR": 10},
            {"PTIME": "1975", "AB": 267, "H": 123, "PLAYERID": "Ruis", "HR": 20},
            {"PTIME": "1976", "AB": 1367, "H": 1112, "PLAYERID": "Piazza", "HR": 98},
            {"PTIME": "1977", "AB": 467, "H": 216, "PLAYERID": "Sanches", "HR": 15},
            {"PTIME": "1978", "AB": 667, "H": 323, "PLAYERID": "Ruis", "HR": 40},
            {"PTIME": "1979", "AB": 267, "H": 112, "PLAYERID": "Piazza", "HR": 9},
            {"PTIME": "1980", "AB": 867, "H": 412, "PLAYERID": "Sanches", "HR": 30},
            {"PTIME": "1981", "AB": 578, "H": 358, "PLAYERID": "Ruis", "HR": 60},
            {"PTIME": "1982", "AB": 1157, "H": 1002, "PLAYERID": "Piazza", "HR": 140}
        ]

        data.forEach(function (d) {
            d.AB = +d.AB;
            d.H = +d.H;
            d.HR = +d.HR;
            d.PTIME = parseDate(d.PTIME);
        });

        // chart
        //     .data(data)
        //     .draw();

        console.log('draw....   ')

        chart.data(data)
            .xDomain([
                $scope.chartOpts.xAxis.min.controls.input.value,
                $scope.chartOpts.xAxis.max.controls.input.value])
            .yDomain([
                $scope.chartOpts.yAxis.min.controls.input.value,
                $scope.chartOpts.yAxis.max.controls.input.value])
            .draw();
    };

}

module.exports = MotionCtrl;
