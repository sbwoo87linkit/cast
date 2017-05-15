'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
/**
 * Controller
 */

/*


 ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragulaService'];
 function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragulaService) {


 */

ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragularService', '$rootScope'];
function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragularService, $rootScope) {


    /**
     * 데이터 로드
     */

    var model = dataModel.get();
    $scope.fieldList = model.fields.selected;

    $scope.outlier_top = [];


    /**
     * Drag & Drop setup
     */

    var containerLeft = document.querySelector('#containerLeft'),
        containerRight = document.querySelector('#containerRight');

    function accepts(el, target, source) {
        if (source === containerLeft || source === target) {

            // limit 1
            console.log(target)
            if ($scope.outlier_top.length < 1) {
                // console.log('aaaa')
                return true;
            }
        } else {
            console.log('bbbb')
        }

    }

    dragularService([containerLeft], {
        containersModel: [$scope.fieldList],
        copy: true,
        //move only from left to right
        accepts: accepts
    });

    dragularService([containerRight], {
        containersModel: [$scope.outlier_top],
        removeOnSpill: true,
        //move only from left to right
        accepts: accepts,
        moves: function (el, source, handle, sibling) {
            // return handle.classList.contains('dragula-handle');
            console.log('moves')
        },
    });


    /**
     *  Scope 변수
     */

    $scope.analysis = {};

    $scope.chartGroups = [
        {
            name: '시계열', items: [
            {type: 'Line plot', icon: 'line', description: 'Line plot description'},
            {type: 'Scatter plot', icon: 'plot', description: 'Scatter plot description'},
            {type: 'Motion', icon: 'motion', description: 'Motion description'}
        ]
        },
        {
            name: '분포', items: [
            {type: 'Histogram', icon: 'histogram', description: 'Histogram description'},
            {type: 'Bar chart', icon: 'bar', description: 'Bar chart description'},
            {type: 'Pie chart', icon: 'pie', description: 'Pie chartdescription'}
        ]
        },
        {
            name: '관계형', items: [
            {type: 'Shanky', icon: 'shanky', description: 'Shanky description'},
            {type: 'Heatmap', icon: 'heatmap', description: 'Heatmap description'}
        ]
        },
        {
            name: '이상치', items: [
            {type: 'Outlier', icon: 'outlier', description: 'Outlier description'},
            {type: '차트유형선택', icon: 'none', description: 'none'}
        ]
        }
    ];


    // 선택한 차트유형
    $scope.analysis.chart = {type: '차트 유형 선택', icon: 'none', description: 'select chart'};


    // TODO test init
    $scope.analysis.chart = $scope.chartGroups[3].items[0];

    // /**
    //  *
    //  * Function
    //  */
    //
    $scope.changeChart = function (chart) {
        console.log('changeChart', $scope.$id, chart)
        $scope.analysis.chart = chart;
    }

    var hideTimer;
    $scope.showDescription = function (chart) {
        console.log('showDescription')
        // 분석유형선택 팝업 차트유형 마우스오버된 차트
        $timeout.cancel(hideTimer);
        $scope.analysis.tempChart = chart;
    }

    $scope.hideDescription = function () {
        hideTimer = $timeout(function () {
            $scope.analysis.tempChart = null;
        }, 500)
    }

    $scope.clickItem = function (item) {
        // console.log(item)
    }


}

module.exports = ContainerCtrl;
