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


    /**
     *
     *  Highcharts-ng Test
     */

    var opts = {
        chart: {
            type: 'heatmap',
            marginTop: 0,
            marginBottom: 0
        },
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },

        legend: ''
    };

    $scope.i = 0;



    $scope.items = [];
    // $scope.items.push(item);
    // $scope.items.push(item);


    $scope.removeItem = function (index) {
        $scope.items.splice(index, 1);
    }

    var i = 0;

    $scope.addItem = function () {
        i++;
        var item = {
            n: 'name_' + i,
            cfg: {
                options: opts,
                series: [{
                    data: [[0, 0, 1], [0, 1, 0 + i], [1, 0, 3], [1, 1, 1]],
                    dataLabels: {
                        enabled: true,
                        color: '#000000'
                    }
                },],
                title: ' ',
                xAxis: {categories: ['1/10', '1/11']},
                yAxis: {categories: ['TV', 'RADIO']}
            }
        };

        console.log(i);
        $scope.items.push(item);
    }


    /**
     *
     * test - end
     */










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

    $scope.$on('$viewContentLoaded',
        function () {
            // vm.highChartConfig.getChartObj().reflow();
            console.log('content loaded....')
        }
    );


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

        console.log(options)
        // return;

        var card2 = {
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


        i++;
        var card = {
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

            // cfg: {
            //     options: {
            //         chart: {
            //             type: 'heatmap',
            //             marginTop: 0,
            //             marginBottom: 0
            //         },
            //         colorAxis: {
            //             min: 0,
            //             minColor: '#FFFFFF',
            //             maxColor: Highcharts.getOptions().colors[0]
            //         },
            //
            //         legend: ''
            //     },
            //     series: [{
            //         data: [[0, 0, 1], [0, 1, 0], [1, 0, 3], [1, 1, 1]],
            //         dataLabels: {
            //             enabled: true,
            //             color: '#000000'
            //         }
            //     },],
            //     title: ' ',
            //     xAxis: {categories: ['1/10', '1/11']},
            //     yAxis: {categories: ['TV', 'RADIO']}
            // }
        };



        $scope.cards.push(card);

        $timeout(function () {
            $scope.$broadcast('anomaly.card.run.' + card.id);
        }, 10);
    }

    function copyCard(card) {
        $scope.cards.push(card);
    }

    // function splitCard(card) {
    //
    // };

    var closeLayer = function (index) {
        var layer = popupLayerStore.get('anomaly.layer.cardmenu_' + index);

        if (layer) {
            popupLayerStore.get('anomaly.layer.cardmenu_' + index).closeEl();
        }
    };

    // 카드 복사
    $scope.copyCard = function (index, card) {
        console.log(card)
        var cardList = $scope.cards;
        card = _.cloneDeep(card);
        var titleKey = 'adeOptions.title';

        // 카드 복사시 아이디 부여
        card.id = uuidV1();

        card.adeOptions.title = util.getCopyTitle(cardList, titleKey, card.adeOptions.title);

        cardList.push(card);
        // $timeout(function () {
        //     $scope.$broadcast('anomaly.card.data_loaded', card.data);
        // })

        closeLayer(index);
    };


    // 카드 분리
    $scope.splitCard = function (index, card) {
        var cardList = $scope.cards;
        // var card = _.cloneDeep($scope.card);
        var titleKey = 'adeOptions.title';

        // 카드 복사시 아이디 부여
        card.id = uuidV1();

        card.adeOptions.title = util.getCopyTitle(cardList, titleKey, card.adeOptions.title);

        cardList.push(card);
        $timeout(function () {
            console.log('broadcast......')
            $scope.$broadcast('anomaly.card.data_loaded', card.data);
        })
    };

}

module.exports = ContainerCtrl;
