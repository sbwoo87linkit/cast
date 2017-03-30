'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */
ContainerCtrl.$inject = ['$scope', '$timeout'];
function ContainerCtrl($scope, $timeout) {
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
    $scope.openOptionsDlg = function() {
        _cardId = uuidV1();

        $scope.$root.$broadcast('anomaly.popup.edit.setForm', 'create');
        $scope.$root.$broadcast('dialog.open.anomaly.popup.edit');
    };

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.add', function(event, adeOptions) {
        addCard(adeOptions);
    });
    $scope.$on('anomaly.card.copy', function(event, card) {
        copyCard(card);
    });

    /**
     * functions
     */
    function addCard(options) {
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

        $timeout(function() {
            $scope.$broadcast('anomaly.card.run.' + card.id);
        });
    }

    function copyCard(card) {
        $scope.cards.push(card);
    }
}

module.exports = ContainerCtrl;
