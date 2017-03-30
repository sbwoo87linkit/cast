'use strict';
/**
 *
 */
/**
 * Controller
 */
ResultCtrl.$inject = ['$scope'];
function ResultCtrl($scope) {
    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.changeChart', function(type) {
        // TODO: 차트 교체 처리
    });
    $scope.$on('anomaly.card.resizeChart', function() {
        // TODO: 차트 사이즈 변경 처리
    });
}

module.exports = ResultCtrl;
