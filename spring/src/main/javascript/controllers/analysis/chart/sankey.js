'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
var Highcharts = require('highcharts');
var async = require('async');

var html2canvas = require('html2canvas');
var canvg = require('canvg-fixed');

/**
 * Controller
 */

SankeyCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', 'CHART', '$window', 'DEFAULT'];
function SankeyCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                    searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility, CHART, $window, DEFAULT) {

    var columnLabelHeight = 50;

    var weight = {
        title: '가중치',
        key: 'weight',
        rows: {
            summaryMethod: {
                title: 'Summary 방식',
                controls: {
                    first: {
                        type: 'dropdown',
                        selected: {}, // Dropdown 선택
                        options: [
                            {text: '합계', value: 'sum'},
                            {text: '개수', value: 'count'},
                            {text: '평균', value: 'average', isSelected: true},
                            {text: '쵀대', value: 'max'},
                            {text: '최소', value: 'min'},
                            {text: '표준편차', value: 'standardDeviation'},
                            {text: '중간값', value: 'mean'},
                            {text: '개별 값 나열', value: 'iterate'}
                        ]
                    }

                }
            }
        }
    };

    var xAxis = {
        title: 'Y축',
        key: 'xAxis',
        rows: {
            summaryMethod: {
                title: 'Summary 방식',
                controls: {
                    first: {
                        type: 'dropdown',
                        selected: {}, // Dropdown 선택
                        options: [
                            {text: '합계', value: 'sum'},
                            {text: '개수', value: 'count'},
                            {text: '평균', value: 'average', isSelected: true},
                            {text: '쵀대', value: 'max'},
                            {text: '최소', value: 'min'},
                            {text: '표준편차', value: 'standardDeviation'},
                            {text: '중간값', value: 'mean'},
                            {text: '개별 값 나열', value: 'iterate'}
                        ]
                    }

                }
            },
            fillEmpty: {
                title: '빠진값 채우기',
                controls: {
                    first: {
                        type: 'dropdownExt',
                        selected: {},
                        options: [
                            {text: '채우지않음', value: 'not_fill', isSelected: true},
                            {text: '앞-뒤 평균', value: 'average'},
                            {text: '앞의 값', value: 'front_value'},
                            {text: '뒤의 값', value: 'rear_value'},
                            {text: '0', value: 'zero'},
                            {text: '사용자지정', value: 'userDefined'},
                        ],
                        extCondition: 'userDefined',
                        extValue: 'UNDEFINED'
                    }

                }
            }
        }
    };

    $scope.tabs = ['일반', '컬럼'];

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
            }
        },
        column: {
            label: {
                text: '레이블',
                controls: {
                    input: {
                        type: 'input',
                        value: 'column label' // 입력값 테스트
                    },
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
            sort: {
                text: '정렬',
                controls: {
                    dropdown: {
                        type: 'dropdown',
                        selected: {}, // Dropdown 선택
                        options: [
                            {text: "기본값", value: null},
                            {text: "오름차순", value: 'asc'},
                            {text: "내림차순", value: 'desc', isSelected: true} // default 내림차순 선택
                        ]
                    }
                }
            }
        }
    };

    $scope.fieldOpts = {
        weightArr: [
            {
                option: weight,
                // drop: {}
                drop: {"name": "Event Object의 개수", "type": "TEXT", "option": null}
            }
        ],
        xAxisArr: [
            {
                option: xAxis,
                drop: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null}

            },
            {
                option: xAxis,
                // drop: {}
                drop: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null}

            }
        ]
    };


    /*
     $scope.fieldOpts = {
     fields: {
     weightArr: [
     {
     weight: weight,
     // drop: {}
     drop: { weight : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null} }
     }
     ],
     xAxisArr: [
     {
     xAxis: {
     title: 'Y축',
     key: 'xAxis',
     rows: {
     summaryMethod: {
     title: 'Summary 방식',
     controls: {
     first: {
     type: 'dropdown',
     selected: {}, // Dropdown 선택
     options: [
     {text: '합계', value: 'sum'},
     {text: '개수', value: 'count'},
     {text: '평균', value: 'average', isSelected: true},
     {text: '쵀대', value: 'max'},
     {text: '최소', value: 'min'},
     {text: '표준편차', value: 'standardDeviation'},
     {text: '중간값', value: 'mean'},
     {text: '개별 값 나열', value: 'iterate'}
     ]
     }

     }
     },
     fillEmpty: {
     title: '빠진값 채우기',
     controls: {
     first: {
     type: 'dropdownExt',
     selected: {},
     options: [
     {text: '채우지않음', value: 'not_fill', isSelected: true},
     {text: '앞-뒤 평균', value: 'average'},
     {text: '앞의 값', value: 'front_value'},
     {text: '뒤의 값', value: 'rear_value'},
     {text: '0', value: 'zero'},
     {text: '사용자지정', value: 'userDefined'},
     ],
     extCondition: 'userDefined',
     extValue: 'UNDEFINED'
     }

     }
     }
     }
     },
     drop: { xAxis : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null} }

     },
     {
     xAxis: xAxis,
     // drop: {}
     drop: { xAxis : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null} }

     }
     ]
     }
     };
     */


    $scope.addField = function (columns) {
        console.log(columns);
        if (CHART.COLUMN_MAX_COUNT === columns.length) {
            popupBox.alert('더이상 컬럼을 추가할 수 없습니다.', function clickedOk() {
            });
            return false;
        }
        columns.splice(columns.length - 1, 0, {
            option: xAxis,
            field: null
            // field: { xAxis : {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null} }

        });
    };

    var _modelChangeTimer = null;

    $scope.$watch('chartOpts', function (value) {

        // if data is not loaded
        if (!$scope.options) {
            return;
        }

        // 중복발생 방지 처리, Model change 확인
        $window.clearTimeout(_modelChangeTimer);
        _modelChangeTimer = $window.setTimeout(function () {

            console.log('charOpts...')
            renderChart()

        }, 100);
    }, true);

    $($window).on('resize', onRsize);

    $scope.$on('$destroy', function () {
        $($window).off('resize', onRsize);
    });

    function onRsize() {

        $timeout(function () {

            if (!$scope.options) {
                return;
            }

            if ($scope.chartOpts.column.label.controls.checkbox.value) {
                $scope.options.height = $('#chart').height() - columnLabelHeight;
            } else {
                $scope.options.height = $('#chart').height();
            }
            $scope.options.width = $('#chart').width();

            console.log('update...', $scope.options.height)

        }, 100)

    }

    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {

        var msg = null;

        // console.log(data.field_options.fields.xAxisArr[0].xAxis.rows.fillEmpty.controls.first.selected);
        console.log($scope.fieldOpts.weightArr.length);
        // console.log($scope.fieldOpts.fields.xAxisArr);
        //
        $scope.fieldOpts.weightArr.forEach(function (field, i) {
            if (!field.drop) {
                msg = '가중치 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            }
        })

        if (msg) {
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }


        $scope.fieldOpts.xAxisArr.forEach(function (field, i) {
            if (!field.drop) {
                msg = 'x축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            }
        })

        if (msg) {
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }


        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: [],
            field_options: $scope.fieldOpts
        };

        utility.closeAllLayers();

        var service = 'adv-sankey';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d) {

                $scope.adv.isWaiting = false;

                $scope.data = d.data;

                renderChart();

            }, function (err) {
                $scope.adv.isWaiting = false;
                console.log(err)
            });
        });
    })

    var renderChart = function () {

        var data = $scope.data;

        var order = $scope.chartOpts.column.sort.controls.dropdown.selected.value;
        if (order) {
            // console.log('sorting...', order)
            data.results = _.orderBy(data.results, [0], order);
            data.results = _.orderBy(data.results, [1], order);
        }

        $scope.chart = {
            "cols": [
                {label: 'from', type: 'string'},
                {label: 'to', type: 'string'},
                {label: 'height', type: 'number'}
            ],
            "rows": data.results
        };

        var width = $('#chart').width();
        var height = $('#chart').height();
        if ($scope.chartOpts.column.label.controls.checkbox.value) {
            height = height - columnLabelHeight;
        }

        $timeout(function () {
            $scope.options = {
                sankey: {
                    iterations: 0,
                },
                width: width,
                height: height
            };

        }, 100)


    };

    $scope.exportSankey = function () {

        if (!$scope.options) {
            popupBox.alert('차트데이터가 없습니다.', function clickedOk() {
            });
            return false;
        }

        html2canvas($('#imagesave'), {
            background: '#FFFFFF',
            onrendered: function (canvas) {

                var a = document.createElement('a');
                a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                a.download = 'chart.png';
                a.click();
            }
        });
    }
}

module.exports = SankeyCtrl;
