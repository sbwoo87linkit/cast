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

LineplotCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'advLineplotAgent', '$log',
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility'];
function LineplotCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advLineplotAgent, $log,
                      searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility) {


    /**
     *
     * yAxisField
     */

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


    /**
     *
     * timeField
     */

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


    // $scope.summaryTimes = {"10sec":"10초" ,"1min":"1분", "5min": "5분", "userDefined": "사용자정의"};
    $scope.models = {"10초":"10초" ,"1분":"1분", "5분": "5분", "사용자정의": "사용자정의"};
    $scope.formData.model = "5분"


    $scope.setDialogOptions = function (_btnShowDlgID) {

        var $btn = $('#' + _btnShowDlgID);
        var btnOffset = $btn.offset();

        $scope.dlgOffset = {};
        $scope.dlgOffset.top = (btnOffset.top + $btn.height() + 10);
        $scope.dlgOffset.left = (btnOffset.left);
        $scope.$root.$broadcast('dialog.open.' + 'dialog');

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
                return false;
            });
        } else {
            $scope.adv.timeField = _.cloneDeep($data);
        }
    };

    $scope.clearTimeField = function () {
        $scope.adv.timeField = null;
        popupLayerStore.get('adv.timeField.setting').closeEl();
    }

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

        $scope.adv.isWaiting = true;
        async.forEachOf($scope.adv.chartData, function (item, index, callback) {
            $scope.request('adv2-lineplot', index, callback);
        }, function (err) {
            $scope.adv.isWaiting = false;
        })
    })

    $scope.request = function (service, rowIndex, callback) {
        var data = {
            q: "*",
            datamodel_id: $scope.adv.datamodel_id,
            target_field: $scope.adv.groupField // TODO: 모델에 따라 변경 필요
        }

        advLineplotAgent.getId(service, data).then(function (d) {
            advLineplotAgent.getData(service, d.data.sid).then(function (d1) {
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

        // 차트를 생성후 overwrite 하면 chart object를 찾을수 없음. Chart 생성후에는 Series Data만 갱신
        if ($scope.adv.chartData[rowIndex].config === undefined) {
            $scope.adv.chartData[rowIndex].config = {
                chart: {
                    type: 'line',
                    reflow: true,
                    height: height
                },
                series: [
                    {
                        data: [[1370131200000, 43934], [1370217600000, 23934], [1370304000000, 53934]]
                    },
                    {
                        data: [[1370131200000, 23934], [1370217600000, 33934], [1370304000000, 13934]]
                    }
                ],
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
            $scope.adv.chartData[rowIndex].config.series = [
                {
                    data: [[1370131200000, 13934], [1370217600000, 23934], [1370304000000, 53934]]
                },
                {
                    data: [[1370131200000, 23934], [1370217600000, 33934], [1370304000000, 13934]]
                }
            ];
            // $scope.adv.chartData[rowIndex].config.height = height;
            var chart = $scope.adv.chartData[rowIndex].config.getChartObj();
            $timeout(function () {
                chart.setSize(chart.containerWidth, height, true);
                chart.hasUserSize = null;
            })
        }
    }

    $scope.adv.groupField = {"name": "DATE", "type": "TEXT", "option": null};
    $scope.adv.timeField = _.find($scope.fieldList, function (x) { return x.type === 'TIMESTAMP' });
    $scope.adv.chartData = [{axis: {"name": "Event Object의 개수", "type": "TEXT", "option": null}}]

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
        // TODO : Test purpose only
        $scope.adv.chartData.splice($index, 1);
    }

    $scope.onDropAxisField = function ($event, $data, $index) {
        $scope.adv.chartData[$index].axis = _.cloneDeep($data);
        // TODO : drop 후 popup layer open
        // popupLayerStore.get('adv.axisField.setting_' + $index).openEl();
    };

    $scope.clearAxisField = function ($index) {
        $scope.adv.chartData[$index].axis = null;
        // TODO : drop 후 popup layer open
        popupLayerStore.get('adv.axisField.setting_' + $index).closeEl();
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
}

module.exports = LineplotCtrl;
