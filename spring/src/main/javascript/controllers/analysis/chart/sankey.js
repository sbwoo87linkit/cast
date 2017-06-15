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
            },
            datalabel: {
                text: '데이터 값 표시',
                controls: {
                    datalabel: {
                        type: 'buttonGroup',
                        selected: 'off',
                        options: [
                            {text: "끄기", value: 'off'},
                            {text: "켜기", value: 'on'},
                            {text: "최소/최대", value: 'min_max'}
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
                            {text: "기본값", value: 'default'},
                            {text: "오름차순", value: 'ascending'},
                            {text: "내림차순", value: 'descending', isSelected: true} // default 내림차순 선택
                        ]
                    }
                }
            }
        }
    }

    $scope.fieldOpts = {
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

    $scope.$watch('chartOpts', function (value) {

        // if data is not loaded
        if (!$scope.config) {
            return;
        }

        // 중복발생 방지 처리, Model change 확인
        $window.clearTimeout(_modelChangeTimer);
        _modelChangeTimer = $window.setTimeout(function () {

            renderChart()

        }, 100);
    }, true);

    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {

        var msg = null;

        if (!$scope.fieldOpts.drops.weightField) {
            msg = '가중치 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        $scope.fieldOpts.drops.columnFields.forEach(function (obj) {
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
            field_options: $scope.fieldOpts
        }

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

        var data = {};
        data = $scope.data;
        $scope.config = {};

        $timeout(function () {
            var nodes = [];
            data.nodes = [];
            data.links = [];
            data.results.forEach(function (d) {
                if (nodes.indexOf(d[0]) === -1) {
                    nodes.push(d[0]);
                }

                if (nodes.indexOf(d[1]) === -1) {
                    nodes.push(d[1]);
                }
            });

            // Sankey nodes
            nodes.forEach(function (d, i) {
                data.nodes.push({'node': i, 'name': d})
            })

            // Sankey links
            data.results.forEach(function (d, i) {
                data.links.push({
                    'source': nodes.indexOf(d[0]),
                    'target': nodes.indexOf(d[1]),
                    'value': +d[2]
                });
            });

            $scope.config.options = {
                columnLabelText: $scope.chartOpts.column.label.controls.input.value,
                columnLabelShow: $scope.chartOpts.column.label.controls.checkbox.value,
                dataLabelShow: $scope.chartOpts.general.datalabel.controls.datalabel.selected
            };

            $scope.config.data = {
                nodes: data.nodes,
                links: data.links
            };
        });
    };

    $scope.save = function () {
        if (!$scope.config.data) {
            popupBox.alert('차트데이터가 없습니다.', function clickedOk() {
            });
            return false;
        }

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

module.exports = SankeyCtrl;
