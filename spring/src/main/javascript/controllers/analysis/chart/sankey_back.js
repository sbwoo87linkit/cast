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

SankeyCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility', 'CHART', '$window'];
function SankeyCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                    searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility, CHART, $window) {


    $scope.config = {};

    $scope.adv.fieldOptions = {

        // NOTE : groups(tab title)와 tabs(탭내용의 요소수와 순서는 일치해야 한다.
        groups: ['일반', '컬럼'],
        tabs: [
            {
                rows: [
                    {
                        label: '드릴다운',
                        controls: [
                            {
                                type: 'buttonGroup',
                                selected: 'yes',
                                options: [
                                    {text: "예", value: 'yes'},
                                    {text: "아니오", value: 'no'}
                                ]
                            }
                        ]
                    },
                    {
                        label: '데이터 값 표시',
                        controls: [
                            {
                                type: 'buttonGroup',
                                selected: 'off',
                                options: [
                                    {text: "끄기", value: 'off'},
                                    {text: "켜기", value: 'on'},
                                    {text: "최소/최대", value: 'min_max'}
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                rows: [
                    {
                        label: '레이블',
                        controls: [
                            {
                                type: 'input',
                                value: 'my test column label' // 테스트용 초기 입력값
                            },
                            {
                                type: 'checkbox',
                                text: '표시',
                                value: true // checkbox defalut 선택됨
                            }
                        ]
                    },
                    {
                        label: '정렬',
                        controls: [
                            {
                                type: 'dropdown',
                                selected: {}, // Dropdown 선택값이 여기에 저장됨
                                options: [
                                    {text: "기본값", value: 'default'},
                                    {text: "오름차순", value: 'ascending'},
                                    {text: "내림차순", value: 'descending', isSelected: true} // default 내림차순 선택
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        opts: {
            weight: {
                summaryMethod: {
                    list: [
                        {text: '합계', value: 'sum', isSelected: true},
                        {text: '개수', value: 'count'},
                        {text: '평균', value: 'average'},
                        {text: '최대', value: 'max'},
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
            weightField: {"name": "Event Object의 개수", "type": "TEXT", "option": null},
            // TODO : Test data
            columnFields: [
                {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
                {"name": "PTIME", "type": "TEXT", "option": null}
            ]
            // TODO: 양끝 Blank 필드
            // columnFields : [
            //     {},
            //     {}
            // ]

            // TODO: Time type을 Default로 설정하는 방법
            // xAxisField : _.find($scope.fieldList, function (x) {
            //     return x.type === 'TIMESTAMP'
            // }),
        }
    }

    var _modelChangeTimer = null;
    $scope.$watch('adv', function (value) {

        // Model change 확인

        // 중복발생 처리
        $window.clearTimeout(_modelChangeTimer);
        _modelChangeTimer = $window.setTimeout(function () {
            // 2번째탭(컬럼) 2번째줄(정렬) 1번째컨트롤(Dropdown)의 value확인 : 컬럼탭 > 정렬 설정확인
            console.log($scope.adv.fieldOptions.tabs[1].rows[1].controls[0].selected.value)

            //todo ... 차트업데이트

        }, 100);
    }, true);

    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {

        var msg = null;

        if (!$scope.adv.fieldOptions.drops.weightField) {
            msg = '가중치 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        $scope.adv.fieldOptions.drops.columnFields.forEach(function (obj) {
            if (!obj.hasOwnProperty("name")) {
                msg = '컬럼(x축) 입력값이 비어 있습니다.  Field를 Drag & drop 하세요';
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
            field_options: $scope.adv.fieldOptions
        }

        utility.closeAllLayers();
        // console.log(data);

        var service = 'adv-sankey';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d1) {
                $scope.adv.isWaiting = false;

                $scope.isReady = true;
                $scope.adv.isWaiting = false;
                $timeout(function () {
                    var nodes = [];
                    d1.data.nodes = [];
                    d1.data.links = [];
                    d1.data.results.forEach(function (d) {
                        if (nodes.indexOf(d[0]) === -1) {
                            nodes.push(d[0]);
                        }

                        if (nodes.indexOf(d[1]) === -1) {
                            nodes.push(d[1]);
                        }
                    });

                    // Sankey nodes
                    nodes.forEach(function (d, i) {
                        d1.data.nodes.push({'node': i, 'name': d})
                    })

                    // Sankey links
                    d1.data.results.forEach(function (d, i) {
                        d1.data.links.push({
                            'source': nodes.indexOf(d[0]),
                            'target': nodes.indexOf(d[1]),
                            'value': +d[2]
                        });
                    });

                    $scope.data = _.cloneDeep(d1.data);

                    // renderChart(service, d1);
                    renderChart()

                });

            }, function (err) {
                console.log(err)
            });
        });
    })

    var renderChart = function (d) {
        $scope.config.options = {
            columnLabelText: $scope.adv.chartOpts.opts.xAxis.labels.text,
            columnLabelShow: $scope.adv.chartOpts.opts.xAxis.labels.show,
            dataLabelShow: $scope.adv.chartOpts.opts.normal.showValue
        };

        $scope.config.data = {
            nodes: $scope.data.nodes,
            links: $scope.data.links
        };
    };

    $scope.save = function () {
        if (!$scope.config.data) {
            popupBox.alert('차트데이터가 없습니다.', function clickedOk() {
                return false;
            });
        } else {

            // NOTE : http://techslides.com/save-svg-as-an-image 참조
            var html = d3.select("svg")
                .attr("version", 1.1)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;

            var encoded = btoa(unescape(encodeURIComponent(html)));
            var imgsrc = 'data:image/svg+xml;base64,' + encoded;
            var img = '<img src="' + imgsrc + '">';
            d3.select("#svgdataurl").html(img);

            var canvas = document.createElement('canvas'),
                context = canvas.getContext("2d");
            canvas.width = parseInt(d3.select("svg").style('width'));
            canvas.height = parseInt(d3.select("svg").style('height'));
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);

            var image = new Image;
            image.src = imgsrc;
            image.onload = function () {
                context.drawImage(image, 0, 0);
                var canvasdata = canvas.toDataURL("image/png");
                var pngimg = '<img src="' + canvasdata + '">';
                d3.select("#pngdataurl").html(pngimg);

                var a = document.createElement("a");
                a.download = "chart.png";
                a.href = canvasdata;
                a.click();
            };
        }
    }

    // /**
    //  * Scope variable
    //  */
    //
    // // chart option
    // $scope.config = {};
    //
    // // 가종치 field
    // $scope.adv.weightField = {"name": "Event Object의 개수", "type": "TEXT", "option": null};
    //
    // // // yAxis drop field
    // // $scope.adv.weightField = {"name": "Event Object의 개수", "type": "TEXT", "option": null};
    //
    // $scope.adv.chartData = [
    //     {"name": "FTS_RAW_DATA", "type": "TEXT", "option": null},
    //     {"name": "PTIME", "type": "TEXT", "option": null},
    // ]
    //
    //
    // // time drop field
    // // $scope.adv.timeField = _.find($scope.fieldList, function (x) { return x.type === 'TIMESTAMP' });
    //
    // // weightField 팝업레이어 옵션
    // $scope.weightField = {}
    //
    // $scope.weightField.summaryMethods = [
    //     {text: '합계', value: 'sum', isSelected: true},
    //     {text: '개수', value: 'count'},
    //     {text: '평균', value: 'average'},
    //     {text: '최대', value: 'max'},
    //     {text: '최소', value: 'min'},
    //     {text: '표준편차', value: 'standardDeviation'},
    //     {text: '중간값', value: 'mean'},
    //     {text: '개별 값 나열', value: 'iterate'}
    // ];
    //
    // $scope.weightField.summaryMethodSelected = $scope.weightField.summaryMethods[0];
    //
    // $scope.saveWeightFieldOption = function (field, $index, summaryMethod, fill, userDefinedValue) {
    //     popupLayerStore.get('adv.weightField.setting').closeEl();
    // }
    //
    // $scope.addXAxis = function () {
    //     if (CHART.COLUMN_MAX_COUNT === $scope.adv.chartData.length) {
    //         popupBox.alert('더이상 컬럼을 추가할 수 없습니다.', function clickedOk() {
    //         });
    //         return false;
    //     }
    //     $scope.adv.chartData.splice($scope.adv.chartData.length-1, 0, {});
    // }
    //
    // $scope.deleteXAxisField = function ($index) {
    //     $scope.adv.chartData.splice($index, 1);
    // }
    //
    // $scope.removeXAxisField = function ($index) {
    //     $scope.adv.chartData[$index] = {};
    // }
    //
    // $scope.save = function () {
    //     if (!$scope.config.data) {
    //         popupBox.alert('차트데이터가 없습니다.', function clickedOk() {
    //             return false;
    //         });
    //     } else {
    //
    //         // NOTE : http://techslides.com/save-svg-as-an-image 참조
    //         var html = d3.select("svg")
    //             .attr("version", 1.1)
    //             .attr("xmlns", "http://www.w3.org/2000/svg")
    //             .node().parentNode.innerHTML;
    //
    //         var encoded = btoa(unescape(encodeURIComponent(html)));
    //         var imgsrc = 'data:image/svg+xml;base64,'+ encoded;
    //         var img = '<img src="'+imgsrc+'">';
    //         d3.select("#svgdataurl").html(img);
    //
    //         var canvas = document.createElement('canvas'),
    //             context = canvas.getContext("2d");
    //         canvas.width = parseInt(d3.select("svg").style('width'));
    //         canvas.height = parseInt(d3.select("svg").style('height'));
    //         context.fillStyle = "white";
    //         context.fillRect(0, 0, canvas.width, canvas.height);
    //
    //         var image = new Image;
    //         image.src = imgsrc;
    //         image.onload = function() {
    //             context.drawImage(image, 0, 0);
    //             var canvasdata = canvas.toDataURL("image/png");
    //             var pngimg = '<img src="'+canvasdata+'">';
    //             d3.select("#pngdataurl").html(pngimg);
    //
    //             var a = document.createElement("a");
    //             a.download = "chart.png";
    //             a.href = canvasdata;
    //             a.click();
    //         };
    //     }
    // }
    //
    // /**
    //  *  Drop 필드 제어
    //  */
    //
    // $scope.onDropXAxisField = function ($event, $data, $index) {
    //     $scope.adv.chartData[$index] = _.cloneDeep($data);
    // };
    //
    // $scope.clearXAxisField = function ($index) {
    //     $scope.adv.chartData[$index].axis = null;
    //     popupLayerStore.get('adv.axisField.setting_' + $index).closeEl();
    // }
    //
    // $scope.onDropWeightField = function ($event, $data) {
    //     $scope.adv.weightField = _.cloneDeep($data);
    // };
    //
    // $scope.clearWeightField = function () {
    //     $scope.adv.weightField = null;
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
    //
    //
    // /**
    //  * Data fetch and render chart
    //  */
    //
    // $scope.$on('adv.execute', function () {
    //     var msg = null;
    //
    //     $scope.adv.chartData.forEach(function (obj) {
    //         if(!obj.hasOwnProperty("name")){
    //             msg = 'x축 입력값이 비어 있습니다.  Field를 Drag & drop 하세요';
    //         }
    //     })
    //
    //     if (msg) {
    //         popupBox.alert(msg, function clickedOk() {
    //         });
    //         return false;
    //     }
    //
    //     if (!$scope.adv.weightField) {
    //         msg = '가중치 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
    //         popupBox.alert(msg, function clickedOk() {
    //         });
    //         return false;
    //     }
    //
    //     var data = {
    //         q: "*",
    //         datamodel_id: $scope.adv.datamodel_id,
    //         // TODO: 모델에 따라 변경 필요
    //         target_field: $scope.adv.chartData,
    //         weight_field: [ $scope.adv.weightField ],
    //         summary_method: $scope.weightField.summaryMethodSelected
    //     }
    //
    //     var service = 'adv-sankey';
    //     $scope.adv.isWaiting = true;
    //     advAgent.getId(service, data).then(function (d) {
    //         advAgent.getData(service, d.data.sid).then(function (d1) {
    //
    //             $scope.isReady = true;
    //             $scope.adv.isWaiting = false;
    //             $timeout(function () {
    //                 var nodes = [];
    //                 d1.data.nodes = [];
    //                 d1.data.links = [];
    //                 d1.data.results.forEach(function (d) {
    //                     if (nodes.indexOf(d[0]) === -1) {
    //                         nodes.push(d[0]);
    //                     }
    //
    //                     if (nodes.indexOf(d[1]) === -1) {
    //                         nodes.push(d[1]);
    //                     }
    //                 });
    //
    //                 // Sankey nodes
    //                 nodes.forEach(function (d, i) {
    //                     d1.data.nodes.push({'node': i, 'name': d})
    //                 })
    //
    //                 // Sankey links
    //                 d1.data.results.forEach(function (d, i) {
    //                     d1.data.links.push({
    //                         'source': nodes.indexOf(d[0]),
    //                         'target': nodes.indexOf(d[1]),
    //                         'value': +d[2]
    //                     });
    //                 });
    //
    //                 $scope.data = _.cloneDeep(d1.data);
    //
    //                 // renderChart(service, d1);
    //                 renderChart()
    //             })
    //         }, function (err) {
    //         });
    //     });
    // })
    //
    //
    // $scope.$watch('adv.chartOpts', function (options) {
    //     if ($scope.data) {
    //         renderChart();
    //     }
    // }, true);
    //
    // var renderChart = function (service, d, rowIndex) {
    //
    //     $scope.config.options = {
    //         columnLabelText: $scope.adv.chartOpts.opts.xAxis.labels.text,
    //         columnLabelShow: $scope.adv.chartOpts.opts.xAxis.labels.show,
    //         dataLabelShow: $scope.adv.chartOpts.opts.normal.showValue
    //     };
    //
    //     $scope.config.data = {
    //         nodes: $scope.data.nodes,
    //         links: $scope.data.links
    //     };
    // };


}

module.exports = SankeyCtrl;
