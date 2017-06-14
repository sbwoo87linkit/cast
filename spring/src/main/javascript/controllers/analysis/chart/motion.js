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
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility'];
function MotionCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                    searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility) {

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
            range: [1, 80] // [min, max]
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
    var chart = new MotionChart('#chart1', options);

    chart.duration(10000); // 10 sec

    /**
     *   button group
     */
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


    /**
     * Scope variable
     */

    $scope.adv.fieldOptions = {
        opts : {

        },
        drops : {
            sizeField : {"name":"Event Object의 개수","type":"TEXT","option":null},
            // TODO: delete. 이하 테스트 Data
            timeField : _.find($scope.fieldList, function (x) {
                return x.type === 'TIMESTAMP'
            }),
            xAxisField : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            yAxisField : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            groupField : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
        }
    }

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

        if (!$scope.adv.fieldOptions.drops.groupField) {
            msg = '그룹 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.adv.fieldOptions.drops.sizeField) {
            msg = '사이즈 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
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

        if (!$scope.adv.fieldOptions.drops.timeField) {
            msg = '시간 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
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

        utility.closeAllLayers();

        var service = 'adv-motion';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d1) {
                // console.log(d1);
                $scope.adv.isWaiting = false;
                renderChart(service, d1);
            }, function (err) {
            });
        });

    })

    var renderChart = function (service, d, rowIndex) {

        $('.motion-slider').remove();

        var data = d.data.results;

        var parseDate = d3.time.format('%Y').parse;
        // var parseDate = d3.time.format('%Y%m%d%H%M%S').parse;
        var data = [];
        d.data.results.forEach(function (item, i) {
            // var arr = [];
            var obj = {};
            d.data.fields.forEach(function (field, j) {
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

        chart
            .data(data)
            .draw();
    };

}

module.exports = MotionCtrl;
