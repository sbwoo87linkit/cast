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
    $scope.result = {};
    $scope.result.heatmapScaleMode = 'map';

    /**
     * variables
     */
    var anomalyObj = null;

    /**
     * 차트 부분
     */
    $scope.changeChartType = function(type) {
        // to result ctrl
        $scope.$broadcast('anomaly.card.changeChart', type);
    };

    $scope.$watch('card.isMaxSize', function(isMaxSize) {
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
    var runJob = function() {
        var params = _.cloneDeep($scope.card);

        params.query = searchCond.query();
        params.datamodel_id = dataModel.id();

        anomalyObj = anomalyAgent.anomaly(params);

        var card = $scope.card;

        card.state.running = true;
        card.state.success = false;
        card.state.error = false;

        anomalyObj
            .success(function(data) {
                card.data = data;
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
            .error(function(error) {
                $scope.errorMsg = error.message;

                card.state.running = false;
                card.state.success = false;
                card.state.error = true;
                card.state.current = 0;
                card.state.total = 1;
            })
            .fetch();
    };

    var abortJob = function() {
        var card = $scope.card;

        card.state.running = false;
        card.state.success = false;
        card.state.error = true;
        card.state.current = 0;
        card.state.total = 1;

        anomalyObj.abort(function(){
            // 요청 취소 성공시 동작...
        }, function(error) {
            $scope.errorMsg = error.message;
        });
    };

    var closeLayer = function(index) {
        var layer = popupLayerStore.get('anomaly.layer.cardmenu_' + index);

        if (layer) {
            popupLayerStore.get('anomaly.layer.cardmenu_' + index).closeEl();
        }
    };

    /**
     * 버튼 이벤트
     */
    // 설정 변경
    $scope.changeOptions = function(index) {
        var card = $scope.card;
        $scope.$root.$broadcast('anomaly.popup.edit.setForm', 'update', card.id, card.adeOptions);
        $scope.$root.$broadcast('dialog.open.anomaly.popup.edit');

        if (index) {
            closeLayer(index);
        }
    };


    // 다시 실행
    $scope.restartJob = function(index) {
        runJob();
        closeLayer(index);
    };

    // 카드 삭제
    $scope.removeCard = function(index) {
        $scope.cards.splice(index, 1);

        closeLayer(index);
    };

    // 요청 취소
    $scope.cancelAde = function() {
        abortJob();
    };

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.update.' + $scope.card.id, function(event, adeOptions) {
        // update options
        _.assign($scope.card.adeOptions, adeOptions);
    });
    $scope.$on('anomaly.card.run.' + $scope.card.id, function() {
        runJob();
    });
    $scope.$on('anomaly.card.abort.all', function() {
        abortJob();
    });
}

module.exports = CardCtrl;
