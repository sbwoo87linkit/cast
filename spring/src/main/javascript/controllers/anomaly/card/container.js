'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */
ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'anomaly', 'popupLayerStore', 'util'];
function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, anomaly, popupLayerStore, util) {


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
        var card = {
            id: _cardId,
            chartType: null,//'heatmap',
            valueIndex: null,
            rowIndex: null,
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
            data: {},
            cfg: {}
        };

        $scope.cards.push(card);

        $timeout(function () {
            $scope.$broadcast('anomaly.card.run.' + card.id);
        });
    }

    function copyCard(card) {
        $scope.cards.push(card);
    }

    var closeLayer = function (index) {
        var layer = popupLayerStore.get('anomaly.layer.cardmenu_' + index);

        if (layer) {
            popupLayerStore.get('anomaly.layer.cardmenu_' + index).closeEl();
        }
    };

    // 카드 복사
    $scope.copyCard = function (index, card) {
        var cardList = $scope.cards;
        card = _.cloneDeep(card);
        var titleKey = 'adeOptions.title';

        // 카드 복사시 아이디 부여
        card.id = uuidV1();

        card.adeOptions.title = util.getCopyTitle(cardList, titleKey, card.adeOptions.title);

        cardList.push(card);

        closeLayer(index);
    };


}

module.exports = ContainerCtrl;
