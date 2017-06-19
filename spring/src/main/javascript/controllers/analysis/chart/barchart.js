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

BarchartCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', '$window'];
function BarchartCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                      searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility, $window) {

    /**
     * Scope variable
     */

    $scope.tabs = ['일반', 'X축', 'Y축', '범례'];
    /*

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

     */

    $scope.chartOpts = {

        general: {
            stackmode: {
                text: '스택모드',
                controls: {
                    first: {
                        type: 'buttonGroup',
                        selected: null,
                        options: [
                            {text: "끄기", value: null},
                            {text: "스택형", value: 'normal'},
                            {text: "풀스택형", value: 'percent'}
                        ]
                    }
                }
            },
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
            }
        },
        yAxis: {
            label: {
                text: '레이블',
                controls: {
                    input: {
                        type: 'input',
                        value: 'y Axis label'
                    },
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: false
                    }
                }
            },
            gap: {
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
                        value: '10'
                    }
                }
            },
            max: {
                text: '최대',
                controls: {
                    first: {
                        type: 'input',
                        value: '200'
                    }
                }
            },
        },
        legend: {
            show: {
                text: '범례',
                controls: {
                    checkbox: {
                        type: 'checkbox',
                        text: '표시',
                        value: true
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
            group: {
                title: '그룹AAA',
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
            xAxis: {
                title: 'X축',
                key: 'xAxis',
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
                            input: {
                                type: 'input',
                                value: '10'
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
            yAxis: {"name": "Event Object의 개수", "type": "TEXT", "option": null},
            xAxis: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
            group: {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null}
        },

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


    //
    // // group drop field
    // $scope.adv.groupField = {"name": "DATE", "type": "TEXT", "option": null};
    //
    // // yAxis drop field
    // $scope.adv.yAxisField = {"name":"Event Object의 개수","type":"TEXT","option":null};
    //
    // // time drop field
    // $scope.adv.timeField = _.find($scope.fieldList, function (x) { return x.type === 'TIMESTAMP' });
    //
    // // yAxisField 팝업레이어 옵션
    // $scope.yAxisField = {}
    //
    // $scope.yAxisField.summaryMethods = [
    //     { text: '합계', value: 'sum', isSelected: true },
    //     { text: '개수', value: 'count' },
    //     { text: '평균', value: 'average' },
    //     { text: '쵀대', value: 'max' },
    //     { text: '최소', value: 'min' },
    //     { text: '표준편차', value: 'standardDeviation' },
    //     { text: '중간값', value: 'mean' },
    //     { text: '개별 값 나열', value: 'iterate' }
    // ];
    //
    // $scope.yAxisField.summaryMethodSelected = {};
    //
    // $scope.yAxisField.fills = [
    //     { text: '채우지않음', value: 'not_fill', isSelected: true },
    //     { text: '앞-뒤 평균', value: 'average' },
    //     { text: '앞의 값', value: 'front_value' },
    //     { text: '뒤의 값', value: 'rear_value' },
    //     { text: '0', value: 'zero' },
    //     { text: '사용자지정', value: 'userDefined' },
    // ];
    //
    // $scope.yAxisField.fillSelected = {};
    //
    // $scope.saveYAxisFieldOption = function (field, $index, summaryMethod, fill, userDefinedValue) {
    //     return;
    //     field.summaryMethod = summaryMethod.value;
    //
    //     if (fill.value === 'userDefined') {
    //         if (userDefinedValue) {
    //             popupLayerStore.get('adv.axisField.setting_'+$index).closeEl();
    //             field.fill = userDefinedValue;
    //         } else {
    //             popupBox.alert('사용자정의 데이터를 입력하세요.', function clickedOk() {})
    //         }
    //     } else {
    //         popupLayerStore.get('adv.axisField.setting_'+$index).closeEl();
    //         field.fill = fill.value;
    //     }
    // }
    //
    // // timeField 팝업레이어 옵션
    //
    // $scope.timeField = {}
    //
    // $scope.timeField.summaryTimes = [
    //     { text: '10초', value: '10sec', isSelected: true },
    //     { text: '1분', value: '1min' },
    //     { text: '5분', value: '5min' },
    //     { text: '사용자정의', value: 'userDefined' },
    // ];
    //
    // $scope.timeField.summaryTimeSelected = {};
    //
    // $scope.saveTimeFieldOption = function (model, userDefinedValue) {
    //
    //     $scope.summaryTimeErrMsg = null;
    //     if (model.value === 'userDefined' && !userDefinedValue) {
    //         $scope.summaryTimeErrMsg = '데이터를 입력하세요.';
    //         return;
    //     }
    //
    //     // // Number 테스트
    //     // if ( isNaN(userDefinedValue) || !angular.isNumber(+userDefinedValue)) {
    //     //     $scope.summaryTimeErrMsg = '숫자를 입력하세요.';
    //     //     return;
    //     // }
    //
    //     popupLayerStore.get('adv.timeField.setting').closeEl();
    // }
    //
    // /**
    //  *  Drop 필드 제어
    //  */
    //
    // $scope.onDropYAxisField = function ($event, $data) {
    //     // if ($data.name === 'Event Object의 개수') {
    //     //     popupBox.alert('여기에는 Event Object의 개수는 적용할 수 없습니다.', function clickedOk() {
    //     //         return false;
    //     //     });
    //     // } else {
    //     //     $scope.adv.yAxisField = _.cloneDeep($data);
    //     //     // TODO : drop 후 popup layer open
    //     //     // popupLayerStore.get('adv.axisField.setting_' + $index).openEl();
    //     // }
    //     $scope.adv.yAxisField = _.cloneDeep($data);
    // };
    //
    // $scope.clearAxisField = function ($index) {
    //     $scope.adv.chartData[$index].axis = null;
    //     // TODO : drop 후 popup layer open
    //     popupLayerStore.get('adv.axisField.setting_' + $index).closeEl();
    // }
    //
    // $scope.onDropGroupField = function ($event, $data) {
    //     $scope.adv.groupField = _.cloneDeep($data);
    // };
    //
    // $scope.clearGroupField = function () {
    //     $scope.adv.groupField = null;
    // }
    //
    // $scope.onDropTimeField = function ($event, $data) {
    //     if ($data.type != 'TIMESTAMP') {
    //         popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
    //             return false;
    //         });
    //     } else {
    //         $scope.adv.timeField = _.cloneDeep($data);
    //     }
    // };
    //
    // $scope.clearTimeField = function () {
    //     $scope.adv.timeField = null;
    //     popupLayerStore.get('adv.timeField.setting').closeEl();
    // }


    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {

        var msg = null;

        if (!$scope.fieldOpts.drops.group) {
            msg = '그룹 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }


        if (!$scope.fieldOpts.drops.xAxis) {
            msg = 'x축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.fieldOpts.drops.yAxis) {
            msg = 'y축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
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

        // 차트 Initialize
        $scope.config = null;

        utility.closeAllLayers();


        var service = 'adv-bar';
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

    var renderChart = function () {

        var data = $scope.data;

        // var dataLabels;
        // dataLabels = {
        //     enabled: true,
        //     color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
        // }

        // var arr = [];
        // series.forEach(function (d) {
        //     arr.push(d[2])
        // })
        // var min = Math.min.apply(null, arr),
        //     max = Math.max.apply(null, arr);
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

        console.log($scope.data)

        var xCategories = [];
        var series = [];
        $scope.data.fields.forEach(function (d,i) {
            if (i > 0) {
                series.push({ name: d.name, data: []});
            }
        })

        $scope.data.results.forEach(function (arr, i) {

            arr.forEach(function (d, j) {
              if (j === 0 ) {
                  xCategories.push(d)
              } else {
                  series[j-1].data.push(d);
              }
            })
        })

        console.log(xCategories, series);

        $scope.config = {
            chart: {
                type: 'column'
            },

            // series: [{
            //     name: 'SANCHES',
            //     data: [5, 3, 4, 7]
            // }, {
            //     name: 'PIAZA',
            //     data: [2, 2, 3, 2]
            // }, {
            //     name: 'RUIS',
            //     data: [3, 4, 4, 2]
            // }],

            series: series,

            title: {
                text: null
            },
            // legend: {
            //     enabled: false
            // },
            legend: legendOpts,
            yAxis: {
                title: {
                    text: $scope.chartOpts.yAxis.label.controls.checkbox.value ? $scope.chartOpts.yAxis.label.controls.input.value : '',
                },
                gridLineWidth: 1,

            },
            xAxis: {
                title: {
                    text: $scope.chartOpts.xAxis.label.controls.checkbox.value ? $scope.chartOpts.xAxis.label.controls.input.value : '',
                },
                type: 'datetime',
                labels: {
                    // format: '{value:%m/%d %H:%M:%S}',
                    rotation: parseInt($scope.chartOpts.xAxis.labelRotation.controls.buttons.selected),
                    format: '{value:%H:%M:%S}',
                },
                // categories: ['2011', '2012', '2013', '2014']
                categories: xCategories
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
                column: {
                    // stacking: 'percent', // normal or percent
                    stacking: $scope.chartOpts.general.stackmode.controls.first.selected, // null, normal or percent

                    // dataLabels: dataLabels
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        formatter: function () {
                            // if (dataLabel_min_max) {
                            //     if ((this.point.value == min) || (this.point.value == max)) {
                            //         return this.point.value;
                            //     }
                            // } else {
                            //     return this.point.value;
                            // }
                            // return this.y;


                            if ($scope.chartOpts.general.datalabel.controls.datalabel.selected === 'on') {
                                return this.y;
                            }
                            if ($scope.chartOpts.general.datalabel.controls.datalabel.selected === 'off') {
                                return null;
                            }
                            // var dataLabel_min_max = false;
                            if ($scope.chartOpts.general.datalabel.controls.datalabel.selected === 'min_max') {
                                console.log(data)
                                // showDataLabel = true;

                                // dataLabel_min_max = true;
                            }


                        }
                    }

                }
            },
            exporting: {
                enabled: false
            }
        }

    };


}

module.exports = BarchartCtrl;
