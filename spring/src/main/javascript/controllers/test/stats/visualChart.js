'use strict';
/**
 *
 */
/**
 *
 */
VisualChartCtrl.$inject = ['$scope', 'MESSAGE'];
function VisualChartCtrl($scope, MESSAGE) {
    $scope.selModel = {};
    $scope.selOptions = [
        { text: MESSAGE['chart.type.line'], value: 'spline' },
        { text: MESSAGE['chart.type.area'], value: 'area' },
        { text: MESSAGE['chart.type.column'], value: 'column' },
        { text: MESSAGE['chart.type.bar'], value: 'bar' },
        { text: MESSAGE['chart.type.pie'], value: 'pie' }
    ];

    // 차트 유형 변경
    $scope.changeOption = function(chartType) {
        if (chartType) {
        // if (hasChart() && chartType) {
            $scope.chartType = chartType;
            $scope.$root.$broadcast('search.visual.type_change', $scope.chartType);
            // renderChart(true);
        }
    };
}

module.exports = VisualChartCtrl;
