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

LineplotCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility'];
function LineplotCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                      searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility) {


    /**
     * Scope variable
     */

    // Event Object의 개수 행을 추가
    $scope.adv.chartData = [{axis: {"name": "Event Object의 개수", "type": "TEXT", "option": null}}]

    // group drop field
    $scope.adv.groupField = {"name": "DATE", "type": "TEXT", "option": null};

    // time drop field
    $scope.adv.timeField = _.find($scope.fieldList, function (x) { return x.type === 'TIMESTAMP' });

    // yAxisField 팝업레이어 옵션
    $scope.yAxisField = {}

    $scope.yAxisField.summaryMethods = [
        { text: '합계', value: 'sum', isSelected: true },
        { text: '개수', value: 'count' },
        { text: '평균', value: 'average' },
        { text: '쵀대', value: 'max' },
        { text: '최소', value: 'min' },
        { text: '표준편차', value: 'standardDeviation' },
        { text: '중간값', value: 'mean' },
        { text: '개별 값 나열', value: 'iterate' }
    ];

    $scope.yAxisField.summaryMethodSelected = {};

    $scope.yAxisField.fills = [
        { text: '채우지않음', value: 'not_fill', isSelected: true },
        { text: '앞-뒤 평균', value: 'average' },
        { text: '앞의 값', value: 'front_value' },
        { text: '뒤의 값', value: 'rear_value' },
        { text: '0', value: 'zero' },
        { text: '사용자지정', value: 'userDefined' },
    ];

    $scope.yAxisField.fillSelected = {};

    $scope.saveYAxisFieldOption = function (field, $index, summaryMethod, fill, userDefinedValue) {
        field.summaryMethod = summaryMethod.value;

        if (fill.value === 'userDefined') {
            if (userDefinedValue) {
                popupLayerStore.get('adv.axisField.setting_'+$index).closeEl();
                field.fill = userDefinedValue;
            } else {
                popupBox.alert('사용자정의 데이터를 입력하세요.', function clickedOk() {})
            }
        } else {
            popupLayerStore.get('adv.axisField.setting_'+$index).closeEl();
            field.fill = fill.value;
        }
    }

    // timeField 팝업레이어 옵션

    $scope.timeField = {}

    $scope.timeField.summaryTimes = [
        { text: '10초', value: '10sec', isSelected: true },
        { text: '1분', value: '1min' },
        { text: '5분', value: '5min' },
        { text: '사용자정의', value: 'userDefined' },
    ];

    $scope.timeField.summaryTimeSelected = {};

    $scope.saveTimeFieldOption = function (model, userDefinedValue) {
        if (model.value === 'userDefined') {
            if (userDefinedValue) {
                popupLayerStore.get('adv.timeField.setting').closeEl();
                $scope.adv.fieldOption.timeField.summaryTime = userDefinedValue;
            } else {
                popupBox.alert('사용자정의 데이터를 입력하세요.', function clickedOk() {})
            }
        } else {
            popupLayerStore.get('adv.timeField.setting').closeEl();
            $scope.adv.fieldOption.timeField.summaryTime = model.value;
        }
    }

    /**
     *  Drop 필드 제어
     */

    $scope.onDropAxisField = function ($event, $data, $index) {

        console.log($event, $data, $index)
        $scope.adv.chartData[$index].axis = _.cloneDeep($data);
        // TODO : drop 후 popup layer open
        // popupLayerStore.get('adv.axisField.setting_' + $index).openEl();
        // console.log(popupLayerStore.get('adv.axisField.setting_' + $index));
        // popupLayerStore.get('adv.axisField.setting_' + $index).openEl();


        var key = 'adv.axisField.setting_' + $index;
        var layer = popupLayerStore.get(key);
        console.log(layer)
        if (!layer) {
            return;
        }
        layer.placeEl(layer.$target).openEl();



    };

    $scope.clearAxisField = function ($index) {
        $scope.adv.chartData[$index].axis = null;
        // TODO : drop 후 popup layer open
        popupLayerStore.get('adv.axisField.setting_' + $index).closeEl();
    }

    $scope.onDropGroupField = function ($event, $data) {
        $scope.adv.groupField = _.cloneDeep($data);
    };

    $scope.clearGroupField = function () {
        $scope.adv.groupField = null;
    }

    $scope.onDropTimeField = function ($event, $data) {
        if ($data.type != 'TIMESTAMP') {
            popupBox.alert('타입 Type Field만 적용 가능합니다.', function clickedOk() {
            });
            return false;
        } else {
            $scope.adv.timeField = _.cloneDeep($data);
        }

        var key = 'adv.timeField.setting';
        var layer = popupLayerStore.get(key);
        if (!layer) {
            return;
        }
        var $target = angular.element($event.target);
        layer.placeEl($target, 'top-right').openEl();
    };

    $scope.clearTimeField = function () {
        $scope.adv.timeField = null;
        popupLayerStore.get('adv.timeField.setting').closeEl();
    }

    /**
     * 행 추가 삭제 리사이즈 제어
     */

    $scope.addRow = function () {

        // TODO : TEST PURPOSE ONLY -
        $scope.adv.chartData.push({axis: {"name": "Location", "type": "TEXT", "option": null}});
        // TODO : UNCOMMENT FOR SERVICE
        // $scope.adv.chartData.push({});

        _.forEach($scope.adv.chartData, function (row, index) {
            var container = $('#container_' + index);
            if (row.config) {
                var chart = row.config.getChartObj();
                $timeout(function () {
                    chart.setSize(chart.containerWidth, container.height(), true);
                })
            }
        })
    }

    $scope.removeRow = function ($index) {
        $scope.adv.chartData.splice($index, 1);
    }

    window.onresize = function () {
        resizeAll();
    };

    function resizeAll() {
        $('.chart').each(function () {
            $(this).highcharts().setSize(
                $(this).parent().width(),
                $(this).parent().height(),
                false
            );
        });
        _.forEach($scope.adv.chartData, function (row, index) {
            var container = $('#container_' + index);
            if (row.config) {
                var chart = row.config.getChartObj();
                $timeout(function () {
                    chart.setSize(container.width(), container.height(), true);
                })
            }
        })
    }

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

        _.forEach($scope.adv.chartData, function (row, i) {
            if (!row.axis) {
                msg = 'y축의 ' + (i + 1) + '번째 입력값이 비어 있습니다. Field를 Drag & drop 하세요';
            }
        })

        if (msg) {
            popupBox.alert(msg, function clickedOk() {
            });
            return false;
        }

        var service = 'adv-lineplot-dev';
        $scope.adv.isWaiting = true;
        async.forEachOf($scope.adv.chartData, function (item, index, callback) {
            $scope.request(service, index, callback);
        }, function (err) {
            // 모든 Row Request가 완료
            $scope.adv.isWaiting = false;
        })
    })

    $scope.request = function (service, rowIndex, callback) {
        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: $scope.adv.groupField // TODO: 모델에 따라 변경 필요
        }

        advAgent.getId(service, data).then(function (d) {
            advAgent.getData(service, d.data.sid).then(function (d1) {
                renderChart(service, d1, rowIndex);
                if (callback) {
                    callback(null, {id: d.data.sid, service: service})
                }
            }, function () {
            });
        });
    }

    var renderChart = function (service, d, rowIndex) {

        var data = d.data.results;
        _.forEach(data, function (item) {
            item[0] = utility.strToDate(item[0])
        });

        var height = $('#container_' + rowIndex).height()

        // 차트를 생성후 overwrite 하면 chart object를 찾을수 없음. Chart 생성후에는 Series data와 만 갱신
        if ($scope.adv.chartData[rowIndex].config === undefined) {
            $scope.adv.chartData[rowIndex].config = {
                chart: {
                    type: 'line',
                    reflow: true,
                    height: height
                },
                series: [{data : data}],
                xAxis: {
                    type: 'datetime',
                    labels: {
                        format: '{value:%m/%d}',
                        // format: '{value:%H:%M:%S}',
                    }
                },
                title: {
                    text: null
                },
                legend: {
                    enabled: false
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
        } else {
            $scope.adv.chartData[rowIndex].config.series = [{data: data}];
            // $scope.adv.chartData[rowIndex].config.height = height;
            var chart = $scope.adv.chartData[rowIndex].config.getChartObj();
            $timeout(function () {
                chart.setSize(chart.containerWidth, height, true);
                chart.hasUserSize = null;
            })
        }
    };

}

module.exports = LineplotCtrl;
