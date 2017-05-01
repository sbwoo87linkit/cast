'use strict';
/**
 *
 */
var Highcharts = require('highcharts');
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);

var _ = require('lodash');
var uuidV1 = require('uuid/v1');


/**
 * Controller
 */
ResultCtrl.$inject = ['$scope', 'util'];
function ResultCtrl($scope, util) {

    /**
     *
     * scope
     */
    $scope.result.chartType = null; //'heatmap' or 'line'
    $scope.result.heatMapcolorMode = 'row' // 'map' or 'row'
    $scope.result.rowIndex = -1;
    $scope.result.valueIndex = -1;

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.data_loaded', function(event, data) {
        // TODO: 차트 데이터 수신
        renderChart(data);
    });
    $scope.$on('anomaly.card.changeChart', function (event, type) {
        // TODO: 차트 교체 처리
    });

    $scope.$on('anomaly.card.resizeChart', function (event, size, elCard) {
        // TODO: 차트 사이즈 변경 처리
        if ($scope.card.data.isEnd) {
            // setTimeout(switchChart);
        }
    });

    // $scope.$watch('card.data', function () {
    //     if ($scope.card.data.isEnd) {
    //         // setTimeout(switchChart);
    //     }
    // });

    /**
     *
     * function
     */


    // 카드 분리
    $scope.splitCard = function(index) {
        _.times(3, function (i) {
            console.log(i);
            var cardList = $scope.cards;
            var card = _.cloneDeep($scope.card);
            var titleKey = 'adeOptions.title';

            // 카드 복사시 아이디 부여
            card.id = uuidV1();

            card.adeOptions.title = util.getCopyTitle(cardList, titleKey, card.adeOptions.title);

            cardList.push(card);

            // closeLayer(index);
        })
    };

    function renderChart(data) {
        transformToHeatmapData(data);
        data.xAsixData = ['1/1', '1/2'];
        data.yAxisData = ['aaa', 'bbb'];
        data.heatmapData = [[0,0,1], [0,1,2], [1,0,3], [1,1,4]];
        if ($scope.result.heatMapcolorMode === 'row') {

        }
        var index = 'container_' + $scope.$index;
        renderHeatmapChart(data, id);
    }

    function transformToHeatmapData(data) {

        return data;
    }

    function renderLineChart() {


    }

    function renderHeatmapChart(data, id) {

    }
}

module.exports = ResultCtrl;
