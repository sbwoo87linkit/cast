'use strict';
/**
 *
 */
var Highcharts = require('highcharts');
require('highcharts/modules/heatmap')(Highcharts);
require('highcharts/modules/exporting')(Highcharts);
var HighchartsCustomEvents = require('highcharts-custom-events')(Highcharts);

var _ = require('lodash');
var uuidV1 = require('uuid/v1');


/**
 * Controller
 */
ResultCtrl.$inject = ['$scope', '$timeout', 'util'];
function ResultCtrl($scope, $timeout, util) {


}

module.exports = ResultCtrl;
