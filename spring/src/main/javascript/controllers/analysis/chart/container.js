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

ContainerCtrl.$inject = ['$scope', '$timeout', '$stateParams', 'ADE_PARAMS', 'searchCond', 'popupLayerStore', 'dataModel', 'dragulaService'];
function ContainerCtrl($scope, $timeout, $stateParams, ADE_PARAMS, searchCond, popupLayerStore, dataModel, dragulaService) {





    //
    //
    // $scope.dragoverCallback = function(index, external, type, callback) {
    //     $scope.logListEvent('dragged over', index, external, type);
    //     // Invoke callback to origin for container types.
    //     if (type == 'container' && !external) {
    //         console.log('Container being dragged contains ' + callback() + ' items');
    //     }
    //     return index < 10; // Disallow dropping in the third row.
    // };
    //
    // $scope.dropCallback = function(index, item, external, type) {
    //     $scope.logListEvent('dropped at', index, external, type);
    //     // Return false here to cancel drop. Return true if you insert the item yourself.
    //     return item;
    // };
    //
    // $scope.logEvent = function(message) {
    //     console.log(message);
    // };
    //
    // $scope.logListEvent = function(action, index, external, type) {
    //     var message = external ? 'External ' : '';
    //     message += type + ' element was ' + action + ' position ' + index;
    //     console.log(message);
    // };
    //
    // // Initialize model
    // $scope.model = [[], []];
    // var id = 10;
    // angular.forEach(['all', 'move', 'copy', 'link', 'copyLink', 'copyMove'], function(effect, i) {
    //     var container = {items: [], effectAllowed: effect};
    //     for (var k = 0; k < 7; ++k) {
    //         container.items.push({label: effect + ' ' + id++, effectAllowed: effect});
    //     }
    //     $scope.model[i % $scope.model.length].push(container);
    // });
    // console.log($scope.model)
    //
    // $scope.$watch('model', function(model) {
    //     $scope.modelAsJson = angular.toJson(model, true);
    // }, true);


















    $scope.model = [generateList(1), generateList(2)];

    $scope.onDrop = function(srcList, srcIndex, targetList, targetIndex) {
        // Copy the item from source to target.
        targetList.splice(targetIndex, 0, srcList[srcIndex]);
        // Remove the item from the source, possibly correcting the index first.
        // We must do this immediately, otherwise ng-repeat complains about duplicates.
        if (srcList == targetList && targetIndex <= srcIndex) srcIndex++;
        srcList.splice(srcIndex, 1);
        // By returning true from dnd-drop we signalize we already inserted the item.
        return true;
    };

    function generateList(id) {
        return ['A', 'B', 'C'].map(function(letter) {
            // angular-drag-and-drop-lists usually serializes the objects to drag, thus we
            // can not transfer functions on the objects. However, as this fiddle uses dnd-callback
            // to move the objects directly without serialization, we can use a function reference
            // on the item here.
            return {
                labelFunc: function(index) {
                    return "Item " + id + letter + " at index " + index;
                }
            };
        });
    }






















    /**
     * 데이터 로드
     */

    var model = dataModel.get();
    $scope.fieldList = model.fields.selected;


    /**
     *  Scope 변수
     */

    $scope.analysis = {};

    $scope.chartGroups = [
        { name:'시계열', items : [
            {type:'Line plot', icon:'line', description:'Line plot description'},
            {type:'Scatter plot', icon:'plot', description:'Scatter plot description'},
            {type:'Motion', icon:'motion', description:'Motion description'}
        ]},
        { name:'분포', items : [
            {type:'Histogram', icon:'histogram', description:'Histogram description'},
            {type:'Bar chart', icon:'bar', description:'Bar chart description'},
            {type:'Pie chart', icon:'pie', description:'Pie chartdescription'}
        ]},
        { name:'관계형', items : [
            {type:'Shanky', icon:'shanky', description:'Shanky description'},
            {type:'Heatmap', icon:'heatmap', description:'Heatmap description'},
        ]},
        { name:'이상치', items : [
            {type:'Outlier', icon:'outlier', description:'Outlier description'},
        ]}
    ];

    // 선택한 차트유형
    $scope.analysis.chart = {type:'차트 유형 선택', icon:'none', description:'select chart'};

    // TODO 차트 유형 변경에 따른 레이아웃/컨트롤러 설정
    $scope.templates = [
        {name: 'template1.html', url: 'template1.html'},
        {name: 'template2.html', url: 'template2.html'}
    ];
    $scope.template = $scope.templates[0];

    /**
     *
     * Function
     */

    $scope.changeChart = function (chart) {
        $scope.analysis.chart = chart;
    }

    var hideTimer;
    $scope.showDescription = function (chart) {
        // 분석유형선택 팝업 차트유형 마우스오버된 차트
        $timeout.cancel(hideTimer);
        $scope.analysis.tempChart = chart;
    }

    $scope.hideDescription = function () {
        hideTimer = $timeout(function () {
            $scope.analysis.tempChart = null;
        }, 500)
    }

}

module.exports = ContainerCtrl;
