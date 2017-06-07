'use strict';
/**
 *
 */
var angular = require('angular');
/**
*
*/
module.exports = angular.module('sherman.controllers.test', [])
    .controller('test.VisualChartCtrl', require('./stats/visualChart.js'))
    .controller('test.VisualChartOptsCtrl', require('./stats/visualChartOpts.js'))
    ;
