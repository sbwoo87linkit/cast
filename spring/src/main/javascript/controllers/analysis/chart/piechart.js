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

PiechartCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', '$window'];
function PiechartCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                      searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility, $window) {


    /**
     *
     * scope variable
     */

    $scope.tabs = ['일반', '크기', '범례'];

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

        size: {
            size: {
                text: '최소 크기',
                controls: {
                    input: {
                        type: 'input',
                        value: '12.0'
                    },
                    label: {
                        type: 'label',
                        value: '%'
                    }
                }
            },
            info: {
                text: '?',
                controls: {
                    label: {
                        type: 'label',
                        value: '조각이 10개이상일 경우 적용합니다.'
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
        fields: {
            size: {
                title: '사이즈',
                key: 'size',
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
            group: {
                title: '그룹',
                key: 'group',
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
                    // range: {
                    //     title: '범위만들기',
                    //     controls: {
                    //         first: {
                    //             type: 'buttonGroup',
                    //             selected: 'userDefined',
                    //             options: [
                    //                 {text: '자동계산', value: 'auto'},
                    //                 {text: '사용자지정', value: 'userDefined'},
                    //                 {text: '만들지않음', value: 'none'},
                    //             ],
                    //         }
                    //
                    //     }
                    // },
                    rangeExt: {
                        title: '범위만들기',
                        controls: {
                            first: {
                                type: 'buttonGroupExt',
                                selected: 'userDefined',
                                options: [
                                    {text: '자동계산', value: 'auto'},
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
                    }

                },
                // controls: [
                //     {
                //         range: {
                //             type: 'buttonGroupExt',
                //             selected: 'userDefined',
                //             options: [
                //                 {text: '자동계산', value: 'auto'},
                //                 {text: '사용자지정', value: 'userDefined'},
                //                 {text: '만들지않음', value: 'none'},
                //             ],
                //             extOptions: [
                //                 [],
                //                 [
                //                     {text: '범위크기', key: 'rangeSize', value: ''},
                //                     {text: '범위시작', key: 'rangeStart', value: ''},
                //                     {text: '범위끝', key: 'rangeEnd', value: ''},
                //                 ],
                //                 []
                //
                //             ]
                //
                //         }
                //     },
                // ],
            },
        },

        drops: {
            size: {"name": "Event Object의 개수", "type": "TEXT", "option": null},
            group: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null}
        },

    }


    /*
     $scope.fieldOpts = {
     opts: {
     group: {
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
     size: {
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
     sizeField: {"name": "Event Object의 개수", "type": "TEXT", "option": null},
     // TODO: delete. 이하 테스트 Data
     // xAxisField: _.find($scope.fieldList, function (x) {
     //     return x.type === 'TIMESTAMP'
     // }),
     groupField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
     }
     }

     $scope.myfieldopts = {
     fields: {
     size: {
     title: '사이즈',
     key:'size',
     rows: {
     summaryMethod: {
     title: 'Summary 방식',
     controls: {
     dropdown: {
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
     group: {
     title: '그룹',
     key:'group',
     rows: {
     sort: {
     title: '정렬',
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
     },
     range: {
     title: '범위만들기',
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
     // controls: [
     //     {
     //         range: {
     //             type: 'buttonGroupExt',
     //             selected: 'userDefined',
     //             options: [
     //                 {text: '자동계산', value: 'auto'},
     //                 {text: '사용자지정', value: 'userDefined'},
     //                 {text: '만들지않음', value: 'none'},
     //             ],
     //             extOptions: [
     //                 [],
     //                 [
     //                     {text: '범위크기', key: 'rangeSize', value: ''},
     //                     {text: '범위시작', key: 'rangeStart', value: ''},
     //                     {text: '범위끝', key: 'rangeEnd', value: ''},
     //                 ],
     //                 []
     //
     //             ]
     //
     //         }
     //     },
     // ],
     },
     },

     drops: {},
     // opts: {
     //     group: {
     //         sort: {
     //             list: [
     //                 {text: '기본값', value: 'default', isSelected: true},
     //                 {text: '오름차순', value: 'ascending'},
     //                 {text: '내림차순', value: 'descending'}
     //             ],
     //             selected: {}
     //         },
     //         range: {
     //             selected: 'notUse',
     //             userDefined: {
     //                 size: 10,
     //                 start: 0,
     //                 end: 10
     //             }
     //         },
     //         maxCount: 100
     //     },
     //     size: {
     //         summaryMethod: {
     //             list: [
     //                 {text: '합계', value: 'sum', isSelected: true},
     //                 {text: '개수', value: 'count'},
     //                 {text: '평균', value: 'average'},
     //                 {text: '쵀대', value: 'max'},
     //                 {text: '최소', value: 'min'},
     //                 {text: '표준편차', value: 'standardDeviation'},
     //                 {text: '중간값', value: 'mean'},
     //                 {text: '개별 값 나열', value: 'iterate'}
     //             ],
     //             selected: {}
     //         }
     //     }
     //
     // },
     // drops: {
     //     sizeField: {"name": "Event Object의 개수", "type": "TEXT", "option": null},
     //     // TODO: delete. 이하 테스트 Data
     //     // xAxisField: _.find($scope.fieldList, function (x) {
     //     //     return x.type === 'TIMESTAMP'
     //     // }),
     //     groupField: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
     // }
     }
     */

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

        if (!$scope.fieldOpts.drops.size) {
            msg = '사이즈 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.group) {
            msg = '그룹 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: [],
            field_options: $scope.fieldOpts,
            // test: $scope.myfieldopts
        }


        // 차트 Initialize
        $scope.config = null;

        utility.closeAllLayers();

        var service = 'adv-pie';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d) {
                $scope.adv.isWaiting = false;
                // console.log(d);
                $scope.data = d.data.results;
                renderChart();
            }, function (err) {
            });
        });
    })
    /*
     "fields": [
     { "type": "LONG", "name": "ID" },
     { "type": "REAL", "name": "sum(HR)" }
     ],
     "isEnd": true,
     "results": [
     [ 6, 23737.0 ],
     [ 8, 448.0 ],
     [ 2, 9.0 ],
     [ 4, 647.0 ]
     ],*/


    var renderChart = function () {

        var data = $scope.data;

        var sum = 0;
        data.forEach(function (d) {
            d[0] = d[0].toString();
            sum = sum + d[1];
        });

        // console.log('sum', sum, $scope.chartOpts.size.size.controls.input.value, sum * $scope.chartOpts.size.size.controls.input.value / 100)

        // 10개이상일대 필터링
        if (data.length >= 10) {
            var limit = sum * $scope.chartOpts.size.size.controls.input.value / 100;
            data = _.filter(data, function(d) {
                console.log(d, d[1], limit);
                return d[1] > limit;
            });
        }

        // 범례 차트옵션
        var legendOpts;
        var showLegend = $scope.chartOpts.legend.show.controls.checkbox.value;
        var legendPosition = $scope.chartOpts.legend.position.controls.buttons.selected;
        if (legendPosition === 'right') {
            legendOpts = {
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


        $scope.config = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },

            credits: {
                enabled: false
            },

            title: {
                text: ''
            },


            series: [{
                type: 'pie',
                dataLabels: {},
                name: 'Brands',
                colorByPoint: true,
                data: data
            }],

            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true
                    },
                    showInLegend: true
                }
            },

            legend: legendOpts,

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

    };


}

module.exports = PiechartCtrl;
