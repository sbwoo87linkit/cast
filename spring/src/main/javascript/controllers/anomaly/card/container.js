'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */
ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'anomaly'];
function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, anomaly) {
    // var MAX_COL = 3;
    /**
     * scope
     */
    $scope.cards = [];

    /**
     * variables
     */
    var _cardId = null;

    /**
     * 버튼 이벤트
     */
    $scope.openOptionsDlg = function () {
        _cardId = uuidV1();

        $scope.$root.$broadcast('anomaly.popup.edit.setForm', 'create');
        $scope.$root.$broadcast('dialog.open.anomaly.popup.edit');
    };

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.add', function (event, adeOptions) {
        addCard(adeOptions);
    });
    $scope.$on('anomaly.card.copy', function (event, card) {
        copyCard(card);
    });
    /**
     *   init
     */
    var props = anomaly.get();

    if ($stateParams.auto_add === 'true' && props.valFields.length) {
        var timeRange = searchCond.timeRange();
        var formData = _.merge(_.cloneDeep(ADE_PARAMS), props);

        formData.title = 'Untitled 00';
        formData.comTimeRange = {
            start: timeRange.start,
            end: timeRange.end
        };

        addCard(formData);

        anomaly.clean();
    }

    /**
     * functions
     */
    function addCard(options) {
        // console.log(JSON.stringify(options));
        var card = {
            // index: $scope.cards.length,
            id: _cardId,
            chartType: 'heatmap',
            isMaxSize: false,
            state: {
                // 실행 상태로 추가
                running: true,
                success: false,
                error: false,
                current: 0,
                total: 1
            },
            adeOptions: options,
            data: {}
        };
        $scope.cards.push(card);

        $timeout(function () {
            $scope.$broadcast('anomaly.card.run.' + card.id);
        });
    }

    $scope.splitAddCard = function (data) {
        console.log('splitCard................')

        var card = {
            // index: $scope.cards.length,
            id: _cardId,
            chartType: 'heatmap',
            isMaxSize: false,
            state: {
                // 실행 상태로 추가
                running: true,
                success: false,
                error: false,
                current: 0,
                total: 1
            },
            adeOptions: {
                "title": "Untitled 02",
                "keyFields": [{"field": {"name": "FTS_RAW_DATA", "type": "TEXT"}, "$$hashKey": "object:863"}],
                "valFields": [{"field": {"name": "HR", "type": "NUMBER"}, "func": "sum", "$$hashKey": "object:865"}],
                "model": "SPC",
                "min": 0,
                "max": 100,
                "includeNewKey": true,
                "missingValue": "do_not_process",
                "comTimeRange": {"start": "-1w", "end": "now"},
                "refTimeRange": {"start": "-4w", "end": "now"},
                "timeUnit": "1h",
                "isMatchTimezone": true,
                "dateClassification": "sameday"
            },
            data: data
        };
        $scope.cards.push(card);

    }

    function splitCard(data) {
        console.log(JSON.stringify(options));

    }


    function copyCard(card) {
        $scope.cards.push(card);
    }
}

module.exports = ContainerCtrl;
