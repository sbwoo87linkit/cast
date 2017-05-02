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





    var opts = {
        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80
        },
        colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
        },

        legend: ''
    };

    $scope.items = [
        {n: 'Smith', cfg: {
            options: opts,
            series: [{ data: [[0,0,1], [0,1,5], [1,0,3], [1,1,1]] }],
            title: ' ',
            xAxis: { categories: ['1/10', '1/11']},
            yAxis: { categories: ['TV', 'RADIO']}
        }
        },
        {n: 'Smith', cfg: {
            options: opts,
            series: [{ data: [[0,0,1], [0,1,5], [1,0,3], [1,1,1]] }],
            title: ' ',
            xAxis: { categories: ['1/10', '1/11']},
            yAxis: { categories: ['TV', 'RADIO']}
        }
        }





    ];




    $scope.chartConfig = {
        options: {
            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80
            },
            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            }
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                    this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
            }
        },

        title: {
            text: 'Sales per employee per weekday'
        },

        xAxis: {
            categories: ['Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas', 'Maria', 'Leon', 'Anna', 'Tim', 'Laura']
        },

        yAxis: {
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            title: null
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },

        series: [{
            name: 'Sales per employee',
            borderWidth: 1,
            data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48], [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52], [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16], [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115], [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120], [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96], [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30], [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84], [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]],
            dataLabels: {
                enabled: true,
                color: '#000000'
            }
        }]
    }











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

    // function splitCard(card) {
    //
    // };

    var closeLayer = function(index) {
        var layer = popupLayerStore.get('anomaly.layer.cardmenu_' + index);

        if (layer) {
            popupLayerStore.get('anomaly.layer.cardmenu_' + index).closeEl();
        }
    };

    // 카드 복사
    $scope.copyCard = function(index, card) {
        console.log(card)
        var cardList = $scope.cards;
        card = _.cloneDeep(card);
        var titleKey = 'adeOptions.title';

        // 카드 복사시 아이디 부여
        card.id = uuidV1();

        card.adeOptions.title = util.getCopyTitle(cardList, titleKey, card.adeOptions.title);

        cardList.push(card);
        $timeout(function () {
            $scope.$broadcast('anomaly.card.data_loaded', card.data);
        })

        closeLayer(index);
    };


    // 카드 분리
    $scope.splitCard = function(index, card) {
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
