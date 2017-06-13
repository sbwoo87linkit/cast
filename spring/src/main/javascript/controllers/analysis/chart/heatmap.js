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
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility'];
function HeatmapCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                     searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility) {


    /**
     * Scope variable
     */

    // // group drop field
    // $scope.adv.valueField = {"name": "Event Object의 개수", "type": "TEXT", "option": null};
    //
    // // yAxis drop field
    // $scope.adv.yAxisField = {"name": "DATE", "type": "TEXT", "option": null};



    // // yAxisField 팝업레이어 옵션
    // $scope.valueField = {}
    // $scope.yAxisField = {}
    //
    // $scope.valueField.summaryMethods = [
    //     {text: '합계', value: 'sum', isSelected: true},
    //     {text: '개수', value: 'count'},
    //     {text: '평균', value: 'average'},
    //     {text: '쵀대', value: 'max'},
    //     {text: '최소', value: 'min'},
    //     {text: '표준편차', value: 'standardDeviation'},
    //     {text: '중간값', value: 'mean'},
    //     {text: '개별 값 나열', value: 'iterate'}
    // ];
    //
    // $scope.valueField.summaryMethodSelected = {};
    //
    // $scope.yAxisField.fills = [
    //     {text: '채우지않음', value: 'not_fill', isSelected: true},
    //     {text: '앞-뒤 평균', value: 'average'},
    //     {text: '앞의 값', value: 'front_value'},
    //     {text: '뒤의 값', value: 'rear_value'},
    //     {text: '0', value: 'zero'},
    //     {text: '사용자지정', value: 'userDefined'},
    // ];
    //
    // $scope.yAxisField.fillSelected = {};

    // $scope.saveYAxisFieldOption = function (field, $index, summaryMethod, fill, userDefinedValue) {
    //     field.summaryMethod = summaryMethod.value;
    //
    //     if (fill.value === 'userDefined') {
    //         if (userDefinedValue) {
    //             popupLayerStore.get('adv.axisField.setting_' + $index).closeEl();
    //             field.fill = userDefinedValue;
    //         } else {
    //             popupBox.alert('사용자정의 데이터를 입력하세요.', function clickedOk() {
    //             })
    //         }
    //     } else {
    //         popupLayerStore.get('adv.axisField.setting_' + $index).closeEl();
    //         field.fill = fill.value;
    //     }
    // }




    // // time drop field
    // $scope.adv.timeField = _.find($scope.fieldList, function (x) {
    //     return x.type === 'TIMESTAMP'
    // });

    $scope.saveXAxisFieldOption = function (model) {
        console.log('saveXAxisFieldOption')
        popupLayerStore.get('adv.xAxisField.setting').closeEl();
    }
    //
    // $scope.saveValueFieldOption = function (model, userDefinedValue) {
    //     popupLayerStore.get('adv.valueField.setting').closeEl();
    // }
    //
    // // 저장
    // $scope.save = function () {
    //     if (!$scope.config) {
    //         popupBox.alert('차트데이터가 없습니다.', function clickedOk() {
    //             return false;
    //         });
    //     } else {
    //         var chart = $scope.config.getChartObj();
    //         chart.exportChart({
    //             type: 'image/png'
    //         });
    //     }
    // }





    // Field 팝업레이어 옵션
    $scope.adv.fieldOptions.xAxis = {
        sort : {
            list : [
                {text: '기본값', value: 'default', isSelected: true},
                {text: '오름차순', value: 'ascending'},
                {text: '내림차순', value: 'descending'}
            ],
            selected : {}
        },
        range : {
            selected: 'notUse',
            userDefined : {
                size: 10,
                start: 0,
                end: 10
            }
        },
        maxCount : 100
    }

    $scope.adv.fieldOptions = {
        opts : {
            xAxis : {
                sort : {
                    list : [
                        {text: '기본값', value: 'default', isSelected: true},
                        {text: '오름차순', value: 'ascending'},
                        {text: '내림차순', value: 'descending'}
                    ],
                    selected : {}
                },
                range : {
                    selected: 'notUse',
                    userDefined : {
                        size: 10,
                        start: 0,
                        end: 10
                    }
                },
                maxCount : 100
            },
            yAxis : {
                sort : {
                    list : [
                        {text: '기본값', value: 'default', isSelected: true},
                        {text: '오름차순', value: 'ascending'},
                        {text: '내림차순', value: 'descending'}
                    ],
                    selected : {}
                },
                range : {
                    selected: 'notUse',
                    userDefined : {
                        size: 10,
                        start: 0,
                        end: 10
                    }
                },
                maxCount : 100
            },
            value : {
                sort : {
                    list : [
                        {text: '기본값', value: 'default', isSelected: true},
                        {text: '오름차순', value: 'ascending'},
                        {text: '내림차순', value: 'descending'}
                    ],
                    selected : {}
                },
                range : {
                    selected: 'notUse',
                    userDefined : {
                        size: 10,
                        start: 0,
                        end: 10
                    }
                },
                maxCount : 100
            },

        },
        drops : {
            xAxisField : _.find($scope.fieldList, function (x) {
                return x.type === 'TIMESTAMP'
            })
        }
    }

    console.log($scope.adv.fieldOptions.opts.xAxis)
    $scope.$watch('adv', function (value) {

        // $scope.adv.showDataLabel = true;

        // console.log('$scope.adv.showDataLabel', $scope.adv.showDataLabel)

        if ($scope.adv.chartOpts.opts.normal.showValue === 'all') {
            $scope.adv.showDataLabel = true;
        } else {
            $scope.adv.showDataLabel = false;
        }
        if (!$scope.config) {
            return;
        }

        $scope.config.series[0].dataLabels.enabled = $scope.adv.showDataLabel

    }, true);


    /**
     *  Drop 필드 제어
     */



    $scope.onDropYAxisField = function ($event, $data) {
        if ($data.name === 'Event Object의 개수') {
            popupBox.alert('여기에는 Event Object의 개수는 적용할 수 없습니다.', function clickedOk() {
            });
            return false;
        } else {
            $scope.adv.yAxisField = _.cloneDeep($data);
        }

        var key = 'adv.timeField.setting';
        var layer = popupLayerStore.get(key);
        if (!layer) {
            return;
        }
        var $target = angular.element($event.target);
        layer.placeEl($target, 'top-right').openEl();

    };

    $scope.clearAxisField = function ($index) {
        $scope.adv.chartData[$index].axis = null;
        popupLayerStore.get('adv.axisField.setting_' + $index).closeEl();
    }

    $scope.onDropValueField = function ($event, $data) {
        $scope.adv.valueField = _.cloneDeep($data);
        var key = 'adv.valueField.setting';
        var layer = popupLayerStore.get(key);
        if (!layer) {
            return;
        }
        var $target = angular.element($event.target);
        layer.placeEl($target, 'top-right').openEl();

    };

    $scope.clearValueField = function () {
        $scope.adv.valueField = null;
    }

    // $scope.onDropXAxisField = function ($event, $data) {
    //
    //     if ($data.type != 'TIMESTAMP') {
    //         popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
    //         });
    //         return false;
    //     }
    //
    //     $scope.adv.fieldOptions.drops.xAxisField = _.cloneDeep($data);
    //     utility.openPopupLayer('adv.xAxisField.setting', 'top-right', angular.element($event.target));
    //
    // };

    $scope.onDropField = function ($event, $data, field, position) {

        if ( field  === 'xAxisField' && $data.type != 'TIMESTAMP') {
            popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
            });
            return false;
        }

        $scope.adv.fieldOptions.drops[field] = _.cloneDeep($data);
        utility.openPopupLayer('adv.' + field + '.setting', position, angular.element($event.target));

    };


    $scope.openPopup = function ($event, layer, position) {
        utility.openPopupLayer(layer, position, angular.element($event.target));
    };

    // $scope.clearXAxisField = function ($event) {
    //     // $event.preventDefault();
    //     $event.stopPropagation();
    //     $scope.adv.fieldOptions.drops.xAxisField = null;
    //     utility.closeAllLayers();
    // };

    $scope.clearField = function ($event, field) {
        // $event.preventDefault();
        $event.stopPropagation();
        $scope.adv.fieldOptions.drops[field] = null;
        utility.closeAllLayers();
    };


    /**
     * Data fetch and render chart
     */

    $scope.$on('adv.execute', function () {

        var msg = null;

        if (!$scope.adv.timeField) {
            msg = '타입 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (!$scope.adv.yAxisField) {
            msg = 'y축 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        if (msg) {
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: [$scope.adv.valueField],
            field_options : [$scope.adv.fieldOptions]
        }

        console.log(data);

        var service = 'adv-heatmap';
        $scope.adv.isWaiting = true;
        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d1) {
                $scope.adv.isWaiting = false;
                renderChart(d1.data);
            }, function (err) {
            });
        });
    })

    var renderChart = function (d) {

        var xAxisCategories = [];
        var series = [];

        var yAxisCategories = [];
        for (var i = 1; i < d.fields.length; i++) {
            yAxisCategories.push(d.fields[i].name)
        }

        d.results.forEach(function (row, i) {
            row.forEach(function (item, j) {
                if (j === 0) {
                    xAxisCategories.push(item);
                } else {
                    series.push([i, j - 1, item])
                }
            })
        })

        $scope.config = {
            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
            },

            title: {
                text: 'Sales per employee per weekday'
            },

            xAxis: {
                categories: xAxisCategories
            },

            yAxis: {
                categories: yAxisCategories,
                title: null
            },

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
                enabled: false,
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 280
            },

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
                    enabled: $scope.adv.showDataLabel,
                    color: '#000000'
                }
            }]
        }


    };

}

module.exports = HeatmapCtrl;
