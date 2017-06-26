
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

ScatterplotCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', '$window'];
function ScatterplotCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
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
                    first: {
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
        xAxis: {
            label: {
                text: '레이블',
                controls: {
                    first: {
                        type: 'input',
                        value: 'x Axis label' // 입력값 테스트
                    },
                    second: {
                        type: 'checkbox',
                        text: '표시',
                        value: true // checkbox 선택
                    }
                }
            },
            labelRotation: {
                text: '레이블 회전',
                controls: {
                    first: {
                        type: 'buttonGroup',
                        selected: '0',
                        options: [
                            {text: "-90", value: '-90'},
                            {text: "-45", value: '-45'},
                            {text: "0", value: '0'},
                            {text: "45", value: '45'},
                            {text: "90", value: '90'}
                        ]
                    }
                }
            }
        },
        yAxis: {
            label: {
                text: '레이블',
                controls: {
                    first: {
                        type: 'input',
                        value: 'y Axis label'
                    },
                    second: {
                        type: 'checkbox',
                        text: '표시',
                        value: false
                    }
                }
            },
            tickInterval: {
                text: '간격',
                controls: {
                    first: {
                        type: 'input',
                        value: '5'
                    }
                }
            },
            min: {
                text: '최소',
                controls: {
                    first: {
                        type: 'input',
                        value: '0'
                    }
                }
            },
            max: {
                text: '최대',
                controls: {
                    first: {
                        type: 'input',
                        value: '20'
                    }
                }
            },
        },
        legend: {
            show: {
                text: '범례',
                controls: {
                    first: {
                        type: 'checkbox',
                        text: '표시',
                        value: true
                    }
                }
            },
            position: {
                text: '범례 위치',
                controls: {
                    first: {
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
        fields: {
            group: {
                title: '그룹',
                key: 'group',
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
            },
            time: {
                title: '시간',
                key: 'time',
                rows: {
                    sort: {
                        title: '정렬',
                        controls: {
                            first: {
                                type: 'dropdown',
                                selected: {}, // Dropdown 선택
                                options: [
                                    {text: "기본값", value: 'default'},
                                    {text: "오름차순", value: 'asc'},
                                    {text: "내림차순", value: 'desc', isSelected: true} // default 내림차순 선택
                                ]
                            }

                        }
                    },
                    rangeExt: {
                        title: '범위만들기',
                        controls: {
                            first: {
                                type: 'buttonGroupExt',
                                selected: 'userDefined',
                                options: [
                                    // {text: '자동계산', value: 'auto'},
                                    {text: '사용자지정', value: 'userDefined'},
                                    {text: '만들지않음', value: 'none'},
                                ],
                                extCondition: 'userDefined',
                                extOptions: [
                                    {text: '범위크기', key: 'rangeSize', value: '10'},
                                    {text: '범위시작', key: 'rangeStart', value: '0'},
                                    {text: '범위끝', key: 'rangeEnd', value: '100'},
                                ]
                            }
                        }
                    },
                    maxBarCount: {
                        title: '최대 막대수',
                        controls: {
                            first: {
                                type: 'input',
                                value: '10'
                            }
                        }
                    }
                }
            },
            yAxis: {
                title: 'Y축',
                key: 'yAxis',
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
            }
        },

        drops: {
            yAxis: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            time: _.find($scope.fieldList, function (x) { return x.type === 'TIMESTAMP' }),
            group: {"name": "Event Object의 개수", "type": "TEXT", "option": null}
        }

    };

    var _modelChangeTimer = null;

    $scope.$watch('chartOpts', function (value) {

        // data not loaded
        if (!$scope.isReady) {
            return;
        }

        // 중복발생 방지 처리, Model change 확인
        $window.clearTimeout(_modelChangeTimer);
        _modelChangeTimer = $window.setTimeout(function () {

            $timeout(function () {
                renderChart()
                // $scope.config.legend.verticalAlign = 'bottom'
            })

        }, 100);
    }, true);

    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {

        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: [],
            field_options: $scope.fieldOpts
        }

        utility.closeAllLayers();

        var service = 'adv-scatter';
        $scope.adv.isWaiting = true;

        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d) {
                $scope.adv.isWaiting = false;
                $scope.data = d.data;
                $scope.isReady = true;
                renderChart();
            }, function (err) {
            });
        });
    })

    $scope.config = {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
            reflow: true
        },

        series: [],

        xAxis: {
            type: 'datetime',
            title: {
                text: null
            },
            labels: {
                format: '{value:%H:%M:%S}',
            }
        },
        title: {
            text: null
        },
        legend: {
            enabled : false
        },
        yAxis: {
            title: {
                text: null
            },
            gridLineWidth: 1
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
        exporting: {
            enabled: false
        }
    }


    var renderChart = function () {

        var series = [];
        for (var i =1; i < $scope.data.fields.length; i++) {
            series.push({name: $scope.data.fields[i].name, data: []})
            $scope.data.results.forEach(function (d) {
                series[i-1].data.push([utility.strToDate(d[0]), d[i]])
            })
        }
        // series data
        $scope.config.series = series;

        // y축
        $scope.config.yAxis.title.text =
            $scope.chartOpts.yAxis.label.controls.second.value ? $scope.chartOpts.yAxis.label.controls.first.value : '';
        $scope.config.yAxis.tickInterval = $scope.chartOpts.yAxis.tickInterval.controls.first.value;
        $scope.config.yAxis.min = $scope.chartOpts.yAxis.min.controls.first.value;
        $scope.config.yAxis.max = $scope.chartOpts.yAxis.max.controls.first.value;

        // x축
        $scope.config.xAxis.title.text =
            $scope.chartOpts.xAxis.label.controls.second.value ? $scope.chartOpts.xAxis.label.controls.first.value : '';

        $scope.config.xAxis.labels.rotation =
            parseInt($scope.chartOpts.xAxis.labelRotation.controls.first.selected);


        var legendOpts;
        var showLegend = $scope.chartOpts.legend.show.controls.first.value;
        var legendPosition = $scope.chartOpts.legend.position.controls.first.selected;
        if (legendPosition === 'right') {
            legendOpts = {
                borderColor: '#C98657',
                borderWidth: 1,
                enabled: showLegend,
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'middle',
                y: 2,
                x: 12,
                // symbolHeight: height - 80,
                symbolWidth: 10
            }
        }

        if (legendPosition === 'left') {
            legendOpts = {
                enabled: showLegend,
                align: 'left',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'middle',
                y: 2,
                x: 12,
                symbolPadding: 20,
                // symbolHeight: height - 80,
                symbolWidth: 10
            }
        }

        if (legendPosition === 'top') {
            legendOpts = {
                enabled: showLegend,
                align: 'center',
                layout: 'horizontal',
                margin: 0,
                verticalAlign: 'top',
                y: 2,
                x: 12,
                symbolHeight: 10,
                // symbolWidth: width - 260
            }
        }

        if (legendPosition === 'bottom') {
            legendOpts = {
                enabled: showLegend,
                align: 'center',
                layout: 'horizontal',
                margin: 0,
                verticalAlign: 'bottom',
                y: 2,
                x: 12,
                symbolHeight: 10,
                // symbolWidth: width - 260
            }
        }

        // 범례
        $scope.config.legend = legendOpts;


    };

}

module.exports = ScatterplotCtrl;
