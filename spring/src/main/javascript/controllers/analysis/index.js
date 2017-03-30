'use strict';
/**
 *
 */
var angular = require('angular');
/**
*
*/
module.exports = angular.module('sherman.controllers.analysis', [])
    .controller('analysis.ChooseDataCtrl', require('./chooseData.js'))

    .controller('analysis.MainCtrl', require('./main.js'))
    .controller('analysis.TopInfoCtrl', require('./info.js'))
    ;
