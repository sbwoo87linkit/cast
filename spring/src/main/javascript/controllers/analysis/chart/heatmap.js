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
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', '$window', 'DEFAULT'];
function HeatmapCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                     searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility, $window, DEFAULT) {


    /**
     *
     * scope variable
     */

    $scope.tabs = ['일반', 'X축', 'Y축', '범례'];

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
            datalabel: {
                text: '데이터 값 표시',
                controls: {
                    datalabel: {
                        type: 'buttonGroup',
                        selected: 'on',
                        options: [
                            {text: "끄기", value: 'off'},
                            {text: "켜기", value: 'on'},
                            {text: "최소/최대", value: 'min_max'}
                        ]
                    }
                }
            },
            // color: {
            //     text: '기본색상',
            //     controls: {
            //         input: {
            //             type: 'input',
            //             value: '#3333ff' // 입력값 테스트
            //         },
            //         box: {
            //             type: 'colorPicker',
            //             value: '#3333ff'
            //         }
            //     }
            // }

            color: {
                text: '기본색상',
                controls: {
                    dropdown: {
                        type: 'colorDropdown',
                        selected: {}, // Dropdown 선택
                        options: [
                            {text: "#8CBECE", value: '#8CBECE', isSelected: true},
                            {text: "#FF0000", value: '#FF0000'},
                            {text: "#00FF00", value: '#00FF00'},
                            {text: "#0000FF", value: '#0000FF'},
                            {text: "#FF1493", value: '#FF1493'},
                            {text: "#00BFFF", value: '#00BFFF'},
                            {text: "#556B2F", value: '#556B2F'},
                            {text: "#6495ED", value: '#6495ED'},
                            {text: "#DC143C", value: 'DC143C'},
                            {text: "#556B2F", value: '556B2F'},
                            {text: "#483D8B", value: '483D8B'},
                            //#
                        ]
                    }
                }
            }


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
            labelRotation: {
                text: '레이블 회전',
                controls: {
                    buttons: {
                        type: 'buttonGroup',
                        selected: '-90',
                        options: [
                            {text: "-90", value: '-90'},
                            {text: "-45", value: '-45'},
                            {text: "0", value: '0'},
                            {text: "45", value: '45'},
                            {text: "90", value: '90'}
                        ]
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
                            {text: "기본값", value: 'default'},
                            {text: "오름차순", value: 'asc'},
                            {text: "내림차순", value: 'desc', isSelected: true} // default 내림차순 선택
                        ]
                    }
                }
            }
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
                        value: false // checkbox 선택
                    }
                }
            },
            labelRotation: {
                text: '레이블 회전',
                controls: {
                    buttons: {
                        type: 'buttonGroup',
                        selected: '-90',
                        options: [
                            {text: "-90", value: '-90'},
                            {text: "-45", value: '-45'},
                            {text: "0", value: '0'},
                            {text: "45", value: '45'},
                            {text: "90", value: '90'}
                        ]
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
                            {text: "기본값", value: 'default'},
                            {text: "오름차순", value: 'asc', isSelected: true},
                            {text: "내림차순", value: 'desc'} // default 내림차순 선택
                        ]
                    }
                }
            }
        },
        legend: {
            show: {
                text: '범례',
                controls: {
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
            position: {
                text: '범례 위치',
                controls: {
                    buttons: {
                        type: 'buttonGroup',
                        selected: 'top',
                        options: [
                            {text: "왼쪽", value: 'left'},
                            {text: "위", value: 'top'},
                            {text: "아래", value: 'bottom'},
                            {text: "오른쪽", value: 'right'}
                        ]
                    }
                }
            }
        }

    }

    $scope.fieldOpts = {
        opts: {
            xAxis: {
                sort: {
                    list: [
                        {text: '기본값', value: 'default', isSelected: true},
                        {text: '오름차순', value: 'ascending'},
                        {text: '내림차순', value: 'descending'}
                    ],
                    selected: {}
                },
                range: {
                    selected: 'notUse',
                    userDefined: {
                        size: 10,
                        start: 0,
                        end: 10
                    }
                },
                maxCount: 100
            },
            yAxis: {
                sort: {
                    list: [
                        {text: '기본값', value: 'default', isSelected: true},
                        {text: '오름차순', value: 'ascending'},
                        {text: '내림차순', value: 'descending'}
                    ],
                    selected: {}
                },
                range: {
                    selected: 'notUse',
                    userDefined: {
                        size: 10,
                        start: 0,
                        end: 10
                    }
                },
                maxCount: 100
            },
            value: {
                summaryMethod: {
                    list: [
                        {text: '합계', value: 'sum', isSelected: true},
                        {text: '개수', value: 'count'},
                        {text: '평균', value: 'average'},
                        {text: '쵀대', value: 'max'},
                        {text: '최소', value: 'min'},
                        {text: '표준편차', value: 'standardDeviation'},
                        {text: '중간값', value: 'mean'},
                        {text: '개별 값 나열', value: 'iterate'}
                    ],
                    selected: {}
                }
            }

        },
        drops: {
            valueField: {"name": "Event Object의 개수", "type": "TEXT", "option": null},
            // TODO: delete. 이하 테스트 Data
            xAxisField: _.find($scope.fieldList, function (x) {
                return x.type === 'TIMESTAMP'
            }),
            yAxisField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
        }
    }

    var _modelChangeTimer = null;

    $scope.$watch('chartOpts', function (value) {

        // data not loaded
        if (!$scope.data) {
            return;
        }

        // 중복발생 방지 처리, Model change 확인
        $window.clearTimeout(_modelChangeTimer);
        _modelChangeTimer = $window.setTimeout(function () {

            $timeout(function () {
                renderChart()
            })

        }, 100);
    }, true);

    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {

        var msg = null;

        if (!$scope.fieldOpts.drops.valueField) {
            msg = '값 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
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

        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: [],
            field_options: $scope.fieldOpts
        }

        utility.closeAllLayers();

        // IMPORTANT : 다시 호출할때는 highchart-ng directive를 destroy 해야 함. template ng-if가 false가 되어 derective가 destroy 됨.
        // 참조 : https://github.com/pablojim/highcharts-ng/issues/334

        // 차트 Initialize
        $scope.config = null;

        var service = 'adv-heatmap';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d) {
                $scope.adv.isWaiting = false;
                $scope.data = d.data;
                renderChart();
            }, function (err) {
            });
        });
    })

    var renderChart = function (d) {

        // console.log($('highchart'));
        // $('highchart').empty();
        // $('highchart').remove();
        //
        // // return;
        // $scope.config = undefined;
        // $scope.config = null;
        // $scope.config = {};


        var data = _.cloneDeep($scope.data);
        var xAxisCategories = [];
        var series = [];
        var yAxisCategories = [];


        // y축 정렬 차트옵션
        var ySort = $scope.chartOpts.yAxis.sort.controls.dropdown.selected.value;
        if (ySort === 'asc' || ySort === 'desc') {

            var shiftItem = data.fields.shift();
            data.fields = _.orderBy(data.fields, 'name', ySort);
            data.fields.unshift(shiftItem);
            data.yOrders = [];
            _.forEach(data.fields, function (d, i) {
                var index = _.findIndex($scope.data.fields, function (field) {
                    return field.name === d.name
                })
                data.yOrders.push(index);
            })
            $scope.data.results.forEach(function (d, i) {
                d.forEach(function (t, j) {
                    data.results[i][j] = $scope.data.results[i][data.yOrders[j]]
                })
            })
        }

        // x축 정렬 차트옵션
        var xSort = $scope.chartOpts.xAxis.sort.controls.dropdown.selected.value;
        if (xSort === 'asc' || xSort === 'desc') {
            data.results = _.orderBy(data.results, 0, xSort);
        }

        for (var i = 1; i < data.fields.length; i++) {
            yAxisCategories.push(data.fields[i].name)
        }

        data.results.forEach(function (row, i) {
            row.forEach(function (item, j) {
                if (j === 0) {
                    xAxisCategories.push(item);
                } else {
                    series.push([i, j - 1, item])
                }
            })
        })

        var arr = [];
        series.forEach(function (d) {
            arr.push(d[2])
        })
        var min = Math.min.apply(null, arr),
            max = Math.max.apply(null, arr);
        var showDataLabel;
        if ($scope.chartOpts.general.datalabel.controls.datalabel.selected === 'on') {
            showDataLabel = true;
        }
        if ($scope.chartOpts.general.datalabel.controls.datalabel.selected === 'off') {
            showDataLabel = false;
        }
        var dataLabel_min_max = false;
        if ($scope.chartOpts.general.datalabel.controls.datalabel.selected === 'min_max') {
            showDataLabel = true;
            dataLabel_min_max = true;
        }

        var height = $('#chart-container').height()
        var width = $('#chart-container').width()
        // console.log(height)

        // $scope.config.legend.symbolHeight = height - 80


        // console.log($scope.chartOpts.legend.show.controls.checkbox.value)

        // 범례 차트옵션
        var legendOpts;
        var isShowLegend = $scope.chartOpts.legend.show.controls.checkbox.value;
        if ($scope.chartOpts.legend.position.controls.buttons.selected === 'right') {
            legendOpts = {
                enabled: isShowLegend,
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 2,
                x: 12,
                symbolHeight: height - 80,
                symbolWidth: 10
            }
        }

        if ($scope.chartOpts.legend.position.controls.buttons.selected === 'left') {
            legendOpts = {
                enabled: isShowLegend,
                align: 'left',
                layout: 'vertical',
                margin: 0,
                // verticalAlign: 'top',
                y: 2,
                x: 12,
                symbolPadding: 20,
                symbolHeight: height - 80,
                symbolWidth: 10
            }
        }

        if ($scope.chartOpts.legend.position.controls.buttons.selected === 'top') {
            legendOpts = {
                enabled: isShowLegend,
                align: 'center',
                layout: 'horizontal',
                margin: 0,
                verticalAlign: 'top',
                y: 2,
                x: 12,
                symbolHeight: 10,
                symbolWidth: width - 260
            }
        }

        if ($scope.chartOpts.legend.position.controls.buttons.selected === 'bottom') {
            legendOpts = {
                enabled: isShowLegend,
                align: 'center',
                layout: 'horizontal',
                margin: 0,
                verticalAlign: 'bottom',
                y: 2,
                x: 12,
                symbolHeight: 10,
                symbolWidth: width - 260
            }
        }

        // 차트 구성/랜더링
        $scope.config = {
            chart: {
                type: 'heatmap',
                // marginTop: 40,
                // marginBottom: 80,
                plotBorderWidth: 1
            },

            credits: {
                enabled: false
            },

            title: {
                text: ''
            },

            xAxis: {
                categories: xAxisCategories,
                title: {
                    text: $scope.chartOpts.xAxis.label.controls.checkbox.value ? $scope.chartOpts.xAxis.label.controls.input.value : '',
                },
                labels: {
                    rotation: parseInt($scope.chartOpts.xAxis.labelRotation.controls.buttons.selected),
                }
            },

            yAxis: {
                categories: yAxisCategories,
                title: {
                    text: $scope.chartOpts.yAxis.label.controls.checkbox.value ? $scope.chartOpts.yAxis.label.controls.input.value : '',
                },
                labels: {
                    rotation: parseInt($scope.chartOpts.yAxis.labelRotation.controls.buttons.selected),
                }
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: $scope.chartOpts.general.color.controls.dropdown.selected.value
            },

            legend: legendOpts,

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
                name: 'none',
                borderWidth: 1,
                data: series,
                dataLabels: {
                    // enabled: false,
                    enabled: showDataLabel,
                    color: '#000000'
                }
            }],
            plotOptions: {
                series: {
                    dataLabels: {
                        formatter: function () {
                            if (dataLabel_min_max) {
                                if ((this.point.value == min) || (this.point.value == max)) {
                                    return this.point.value;
                                }
                            } else {
                                return this.point.value;
                            }
                        }
                    }
                }
            }
        }
    };
}

module.exports = HeatmapCtrl;
