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
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', '$window'];
function HeatmapCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                     searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility, $window) {

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
                        selected: 'min_max',
                        options: [
                            {text: "끄기", value: 'off'},
                            {text: "켜기", value: 'on'},
                            {text: "최소/최대", value: 'min_max'}
                        ]
                    }
                }
            },
            color: {
                text: '기본색상',
                controls: {
                    input: {
                        type: 'input',
                        value: '#3333ff' // 입력값 테스트
                    },
                    box: {
                        type: 'colorPicker',
                        value: '#3333ff'
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
                            {text: "오름차순", value: 'ascending'},
                            {text: "내림차순", value: 'descending', isSelected: true} // default 내림차순 선택
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
                            {text: "오름차순", value: 'ascending'},
                            {text: "내림차순", value: 'descending', isSelected: true} // default 내림차순 선택
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
                        selected: 'right',
                        options: [
                            {text: "오른쪽", value: 'right'},
                            {text: "아래", value: 'bottom'},
                            {text: "위", value: 'top'},
                            {text: "왼쪽", value: 'left'}
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

        console.log('Model Changed....111')
        // if data is not loaded
        if (!$scope.data) {
            return;
        }

        // 중복발생 방지 처리, Model change 확인
        $window.clearTimeout(_modelChangeTimer);
        _modelChangeTimer = $window.setTimeout(function () {

            console.log('Model Changed....')
            console.log($scope.chartOpts.general.datalabel.controls.datalabel.selected);
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
        // console.log(data);

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

        console.log('renderChart - heatmap')

        var data = $scope.data;
        var xAxisCategories = [];
        var series = [];
        var yAxisCategories = [];


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

        var legendOpts;

        if ($scope.chartOpts.legend.show.controls.checkbox.value) {

            if ($scope.chartOpts.legend.position.controls.buttons.selected === 'right') {
                legendOpts = {
                    enabled: true,
                    width: 100,
                    align: 'right',
                    layout: 'vertical',
                    y: 25,
                    floating: false,
                    verticalAlign: 'top',
                    height: 400,
                    // align: 'left',
                    x: 70, // = marginLeft - default spacingLeft
                    itemWidth: 100,
                    borderWidth: 1
                }
            }

            if ($scope.chartOpts.legend.position.controls.buttons.selected === 'left') {
                legendOpts = {
                    enabled: true,
                    width: 100,
                    align: 'left',
                    layout: 'vertical',
                    y: 25,
                    floating: false,
                    verticalAlign: 'top',
                    height: 400,
                    // align: 'left',
                    x: 70, // = marginLeft - default spacingLeft
                    itemWidth: 100,
                    borderWidth: 1
                }
            }

            if ($scope.chartOpts.legend.position.controls.buttons.selected === 'top') {
                legendOpts = {

                    // title: {
                    //     text: 'Population density per km²'
                    // },
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'top',
                    y: 0,
                    floating: false,
                    borderWidth: 10,
                    backgroundColor: 'white'


                }
            }

            if ($scope.chartOpts.legend.position.controls.buttons.selected === 'bottom') {
                legendOpts = {

                    // title: {
                    //     text: 'Population density per km²'
                    // },
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    y: 0,
                    floating: false,
                    borderWidth: 10,
                    backgroundColor: 'white'

                }
            }



        } else {
            legendOpts = {
                enabled: false,
            }

        }

        $scope.config = {
            chart: {
                type: 'heatmap',
                // marginTop: 40,
                // marginBottom: 80,
                plotBorderWidth: 1
            },

            title: {
                text: 'Sales per employee per weekday'
            },

            xAxis: {
                categories: xAxisCategories,
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
                maxColor: $scope.chartOpts.general.color.controls.input.value
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
                name: 'Sales per employee',
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
