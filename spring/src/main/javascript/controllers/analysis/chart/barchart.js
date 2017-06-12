
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
    'searchCond', 'popupLayerStore', 'dataModel', '$rootScope', 'popupBox', '$document', 'utility'];
function BarchartCtrl($scope, $timeout, $stateParams, ADE_PARAMS, advAgent, $log,
                      searchCond, popupLayerStore, dataModel, $rootScope, popupBox, $document, utility) {

    /**
     * Scope variable
     */

    // group drop field
    $scope.adv.groupField = {"name": "DATE", "type": "TEXT", "option": null};

    // yAxis drop field
    $scope.adv.yAxisField = {"name":"Event Object의 개수","type":"TEXT","option":null};

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
        return;
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

        $scope.summaryTimeErrMsg = null;
        if (model.value === 'userDefined' && !userDefinedValue) {
            $scope.summaryTimeErrMsg = '데이터를 입력하세요.';
            return;
        }

        // // Number 테스트
        // if ( isNaN(userDefinedValue) || !angular.isNumber(+userDefinedValue)) {
        //     $scope.summaryTimeErrMsg = '숫자를 입력하세요.';
        //     return;
        // }

        popupLayerStore.get('adv.timeField.setting').closeEl();
    }

    /**
     *  Drop 필드 제어
     */

    $scope.onDropYAxisField = function ($event, $data) {
        // if ($data.name === 'Event Object의 개수') {
        //     popupBox.alert('여기에는 Event Object의 개수는 적용할 수 없습니다.', function clickedOk() {
        //         return false;
        //     });
        // } else {
        //     $scope.adv.yAxisField = _.cloneDeep($data);
        //     // TODO : drop 후 popup layer open
        //     // popupLayerStore.get('adv.axisField.setting_' + $index).openEl();
        // }
        $scope.adv.yAxisField = _.cloneDeep($data);
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
            target_field: $scope.adv.groupField // TODO: 모델에 따라 변경 필요
        }

        var service = 'adv-barchart-dev';
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
        console.log(data);

        $scope.config = {
            chart: {
                type: 'column'
            },
            series: [{
                pointPadding: 0,
                groupPadding: 0,
                pointPlacement: 'between',
                data: data,
            }],
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

module.exports = BarchartCtrl;
