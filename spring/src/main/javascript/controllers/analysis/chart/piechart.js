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
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility'];
function PiechartCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                      searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility) {


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

        if (!$scope.fieldOpts.drops.sizeField) {
            msg = '사이즈 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.groupField) {
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
            test: $scope.myfieldopts
        }

        // 차트 Initialize
        $scope.config = null;

        var service = 'adv-pie';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d1) {
                $scope.adv.isWaiting = false;
                renderChart(service, d1);
            }, function (err) {
            });
        });
    })

    var renderChart = function (service, d, rowIndex) {

        var data = d.data.results;
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


            // series: [{
            //     pointPadding: 0,
            //     groupPadding: 0,
            //     pointPlacement: 'between',
            //     data: data,
            // }],
            series: [{
                name: 'Brands',
                colorByPoint: true,
                data: data
            }],

            legend: {
                enabled: false
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineWidth: 1
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    // format: '{value:%m/%d %H:%M:%S}',
                    format: '{value:%H:%M:%S}',
                }
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

    };


}

module.exports = PiechartCtrl;
