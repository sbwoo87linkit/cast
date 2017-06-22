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
    //adv.fieldOptions.drops.columnFields

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

        var data = $scope.data;

        data.results = [
            ["2014", "AL", 99],
            ["2015", "AL", 102],
            ["2014", "NL", 85],
            ["2015", "NL", 108],
            ["AL", "LAA", 106],
            ["AL", "SFA", 95],
            ["NL", "SFN", 94],
            ["NL", "ATL", 99],
            ["NL", "CIN", 95]
        ];


        var order = $scope.chartOpts.column.sort.controls.dropdown.selected.value;
        if (order) {
            // console.log('sorting...', order)
            data.results = _.orderBy(data.results, [0], order);
            data.results = _.orderBy(data.results, [1], order);
        }

        // var arr = data.results;
        //
        // data.results = [];
        //
        // arr.forEach(function (d) {
        //     console.log(d);
        // })
        //
        // return;


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

        html2canvas($('#imagesave'),
            {
                // background :'#FFFFFF',
                onrendered: function (canvas) {

                    var context = canvas.getContext("2d");
                    var a = document.createElement('a');
                    // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
                    a.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                    a.download = 'chart.png';
                    a.click();
                }
            });

        // // NOTE : http://techslides.com/save-svg-as-an-image 참조
        // var html = d3.select("svg")
        //     .attr("version", 1.1)
        //     .attr("xmlns", "http://www.w3.org/2000/svg")
        //     .node().parentNode.innerHTML;
        //
        // html = html.substring(0, html.lastIndexOf('<div'));
        // // console.log('html', html);
        //
        // var encoded = btoa(unescape(encodeURIComponent(html)));
        // var imgsrc = 'data:image/svg+xml;base64,' + encoded;
        // var img = '<img src="' + imgsrc + '">';
        // d3.select("#svgdataurl").html(img);
        //
        // var canvas = document.createElement('canvas'),
        //     context = canvas.getContext("2d");
        // canvas.width = parseInt(d3.select("svg").style('width'));
        // canvas.height = parseInt(d3.select("svg").style('height'));
        // context.fillStyle = "white";
        // context.fillRect(0, 0, canvas.width, canvas.height);
        //
        // var image = new Image;
        // image.src = imgsrc;
        // image.onload = function () {
        //     context.drawImage(image, 0, 0);
        //     var canvasdata = canvas.toDataURL("image/png");
        //     var pngimg = '<img src="' + canvasdata + '">';
        //     d3.select("#pngdataurl").html(pngimg);
        //
        //     var a = document.createElement("a");
        //     a.download = "chart.png";
        //     a.href = canvasdata;
        //
        //     a.click();
        // };
    }
}

module.exports = SankeyCtrl;
