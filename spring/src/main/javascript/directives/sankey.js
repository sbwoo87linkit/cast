'use strict';

var angular = require('angular');
var _ = require('lodash');
var moment = require('moment');
var d3 = require('d3');

// console.log(d3);

/**
 *
 */

ngSankey.$inject = ['$rootScope', '$document'];

var id = 'ng-sankey-' + parseInt(Math.random() * 1000);

function ngSankey($rootScope, $document) {
    controller.$inject = ['$scope', '$timeout'];
    function controller($scope, $timeout) {
        var chart = '';
        $scope.$watch("data", function (data) {
            // console.log('watch.... changed')
            if(!$scope.data || !$scope.data.nodes.length)
                d3.select('#' + id + ' svg').append("text")
                    .attr("class", "nvd3 nv-noData")
                    .attr("transform", "translate(507, 250)")
                    .attr("text-anchor", "middle")
                    .attr("opacity", 1)
                    .text("No Data Available.");
            else
                d3.select('#' + id + ' svg text.nv-noData').attr("opacity", 0);

            if(chart){
                d3.selectAll('#' + id + ' svg g').remove();
            }

            if($scope.options) {
                $scope.options.chart = '#' + id;
                chart = new d3.sankeyChart($scope.data, $scope.options);
            }
        }, false)

        // $scope.$watch('data', function (newVal, oldVal) {
        //     console.log('data...changed.....', newVal, oldVal)
        // }, true);

        function update() {
            if(chart){
                d3.selectAll('#' + id + ' svg g').remove();
            }

            if($scope.options) {
                $scope.options.chart = '#' + id;
                chart = new d3.sankeyChart($scope.data, $scope.options);
            }
        }

        $scope.$watchCollection('data.nodes', function (newVal, oldVal) {
            update();
        });

        $scope.$watchCollection('data.links', function (newVal, oldVal) {
            update();
        });


        $scope.$watch('options', function (newVal, oldVal) {
            update();
        }, true);

    }

    return {

        restrict: 'E',
        // template: '<div id="' + id + '"><canvas></canvas><svg></svg></div>',
        template: '<div id="' + id + '"><svg></svg></div>',
        scope: {
            // config: '=',
            data: '=',
            options: '='
        },
        controller: controller
    };
}

/**
 *
 */
module.exports = ngSankey;




//
//
// 'use strict';
//
// var angular = require('angular');
// var _ = require('lodash');
// var moment = require('moment');
//
// ngShankey.$inject = ['$rootScope', '$document'];
// /**
//  * https://codepen.io/aorian/pen/hDvAe/?editors=1111
//  * @param $rootScope
//  * @param $document
//  * @returns {{restrict: string, scope: {drop: string, bin: string}, link: link}}
//  */
//
// function ngShankey($rootScope, $document) {
//
//
//     function link(scope, element, attr) {
//         // this gives us the native JS object
//         var el = element[0];
//
//         el.draggable = true;
//
//         el.addEventListener(
//             'dragstart',
//             function(e) {
//                 e.dataTransfer.effectAllowed = 'move';
//                 e.dataTransfer.setData('Text', this.id);
//                 this.classList.add('drag');
//                 return false;
//             },
//             false
//         );
//
//         el.addEventListener(
//             'dragend',
//             function(e) {
//                 this.classList.remove('drag');
//                 return false;
//             },
//             false
//         );
//     }
//
//     return {
//         restrict: 'A',
//         link: link
//     };
// }
//
// module.exports = ngShankey;

