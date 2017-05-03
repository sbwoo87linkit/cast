'use strict';
/**
 *
 */
var _ = require('lodash');
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */
CardCtrl.$inject = ['$scope', '$timeout', '$element', 'anomalyAgent', 'searchCond', 'dataModel', 'OPTIONS.ANOMALY', 'popupLayerStore', 'util'];
function CardCtrl($scope, $timeout, $element, anomalyAgent, searchCond, dataModel, anomalyOpts, popupLayerStore, util) {
    /**
     * scope
     */
    $scope.chartTypes = anomalyOpts.CHART_TYPES;
    $scope.errorMsg = '';

    /**
     * variables
     */
    var anomalyObj = null,
        HEIGHT = 310,
        WIDTH = 443;


    /**
     * 차트 부분
     */
    $scope.changeChartType = function (type) {
        // to result ctrl
        $scope.$broadcast('anomaly.card.changeChart', type);
    };

    $scope.$watch('card.isMaxSize', function (isMaxSize) {
        if (isMaxSize === undefined) {
            return;
        }

        // to result ctrl
        $timeout(function () {
            var el = $element;
            var size = {
                width: el.outerWidth(),
                height: el.outerHeight()
            };
            $scope.$broadcast('anomaly.card.resizeChart', size, el);
        });
    });

    /**
     * function
     */
    var runJob = function () {
        var params = _.cloneDeep($scope.card);

        params.query = searchCond.query();
        params.datamodel_id = dataModel.id();

        anomalyObj = anomalyAgent.anomaly(params);

        var card = $scope.card;

        card.state.running = true;
        card.state.success = false;
        card.state.error = false;

        anomalyObj
            .success(function (data) {

                // debugger;
                var cfg;

                if ((data.fields.keys.length === 0 && data.fields.values.length === 1)) {
                    // line chart
                    cfg = {
                        options: {
                            chart: {
                                type: 'line',
                                marginTop: 0,
                                marginBottom: 0,
                                width: WIDTH,
                                height: HEIGHT
                            },
                            legend: ''
                        },
                        series: [{
                            name: 'Installation',
                            data: [43934, 52503, 57177, 69658, 97031, 119931, 137133, 154175]
                        }, {
                            name: 'Manufacturing',
                            data: [24916, 24064, 29742, 29851, 32490, 30282, 38121, 40434]
                        }, {
                            name: 'Sales & Distribution',
                            data: [11744, 17722, 16005, 19771, 20185, 24377, 32147, 39387]
                        }, {
                            name: 'Project Development',
                            data: [null, null, 7988, 12169, 15112, 22452, 34400, 34227]
                        }, {
                            name: 'Other',
                            data: [12908, 5948, 8105, 11248, 8989, 11816, 18274, 18111]
                        }],
                        title: ' ',
                        // xAxis: {categories: ['1/10', '1/11']},
                        // yAxis: {categories: ['TV', 'RADIO']}
                    };
                } else {
                    // heatmap chart
                    cfg = {
                        options: {
                            chart: {
                                type: 'heatmap',
                                marginTop: 0,
                                marginBottom: 0,
                                width: WIDTH,
                                height: HEIGHT
                            },
                            colorAxis: {
                                min: 0,
                                minColor: '#FFFFFF',
                                maxColor: Highcharts.getOptions().colors[0]
                            },

                            legend: ''
                        },
                        series: [{
                            data: [[0, 0, 1], [0, 1, 0], [1, 0, 3], [1, 1, 1]],
                            dataLabels: {
                                enabled: true,
                                color: '#000000'
                            }
                        },],
                        title: ' ',
                        xAxis: {categories: ['1/10', '1/11']},
                        yAxis: {categories: ['TV', 'RADIO']}
                    };
                }


                card.data = data;

                card.cfg = cfg;

                card.state.current = data.status.current;
                card.state.total = data.status.total;

                var isEnd = data.isEnd;
                if (isEnd) {
                    card.state.running = false;
                    card.state.success = true;
                    card.state.error = false;
                    card.state.current = 0;
                    card.state.total = 1;

                    $scope.$broadcast('anomaly.card.data_loaded', data);
                }
            })
            .error(function (error) {
                $scope.errorMsg = error.message;

                card.state.running = false;
                card.state.success = false;
                card.state.error = true;
                card.state.current = 0;
                card.state.total = 1;
            })
            .fetch();
    };

    var abortJob = function () {
        var card = $scope.card;

        card.state.running = false;
        card.state.success = false;
        card.state.error = true;
        card.state.current = 0;
        card.state.total = 1;

        anomalyObj.abort(function () {
            // 요청 취소 성공시 동작...
        }, function (error) {
            $scope.errorMsg = error.message;
        });
    };

    var closeLayer = function (index) {
        var layer = popupLayerStore.get('anomaly.layer.cardmenu_' + index);

        if (layer) {
            popupLayerStore.get('anomaly.layer.cardmenu_' + index).closeEl();
        }
    };

    /**
     * 버튼 이벤트
     */
    // 설정 변경
    $scope.changeOptions = function (index) {
        var card = $scope.card;
        $scope.$root.$broadcast('anomaly.popup.edit.setForm', 'update', card.id, card.adeOptions);
        $scope.$root.$broadcast('dialog.open.anomaly.popup.edit');

        if (index) {
            closeLayer(index);
        }
    };


    // 다시 실행
    $scope.restartJob = function (index) {
        runJob();
        closeLayer(index);
    };

    // 카드 삭제
    $scope.removeCard = function (index) {
        console.log(JSON.stringify($scope.cards));
        console.log('removeCard', index)
        $scope.cards.splice(index, 1);
        console.log(JSON.stringify($scope.cards));

        closeLayer(index);
    };

    // 요청 취소
    $scope.cancelAde = function () {
        abortJob();
    };

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.update.' + $scope.card.id, function (event, adeOptions) {
        // update options
        _.assign($scope.card.adeOptions, adeOptions);
    });
    $scope.$on('anomaly.card.run.' + $scope.card.id, function () {
        runJob();
    });
    $scope.$on('anomaly.card.abort.all', function () {
        abortJob();
    });

    $scope.changeHeatmapScaleMode = function (isScaleMode) {
        // to result ctrl 
        $scope.$broadcast('anomaly.card.changeHeatmapScaleMode', isScaleMode)
    };
}

module.exports = CardCtrl;
