'use strict';
/**
 *
 */
/**
 * Controller
 */
ResultCtrl.$inject = ['$scope'];
function ResultCtrl($scope) {

    console.log($scope)
    $scope.chartType = 'heatmap';

    /**
     * 이벤트
     */
    $scope.$on('anomaly.card.changeChart', function(event, type) {
        $scope.chartType = type;
        // console.log("ResultCtrl - ChartType : ", type);
        // TODO: 차트 교체 처리
        setTimeout(switchChart);
        // switchChart();
    });
    $scope.$on('anomaly.card.resizeChart', function() {
        // TODO: 차트 사이즈 변경 처리
        setTimeout(switchChart);
        // switchChart();
    });

    $scope.$watch('card.data', function() {
        if ($scope.card.data.isEnd) {
            setTimeout(switchChart);
            // switchChart();
        }
    });

    function switchChart() {
        if ($scope.chartType === 'line') renderLineChart();
        if ($scope.chartType === 'heatmap') renderHeatmapChart();
    }

    function renderLineChart() {
        console.log("Render Chart .... ", $scope.chartType );

        // var width= $("#container").width() ;

        new Highcharts.Chart('container', {
            // chart: {width: width - 10, height: 330},
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]
        });

    }

    function renderHeatmapChart() {

        new Highcharts.Chart('container', {

            chart: {
                type: 'heatmap',
                marginTop: 40,
                marginBottom: 80,
                plotBorderWidth: 1
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

            colorAxis: {
                min: 0,
                minColor: '#FFFFFF',
                maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
                align: 'right',
                layout: 'vertical',
                margin: 0,
                verticalAlign: 'top',
                y: 25,
                symbolHeight: 205
            },

            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                        this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
                }
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

        });
    }
}

module.exports = ResultCtrl;
