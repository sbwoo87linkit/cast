'use strict';
/**
*
*/
var angular = require('angular');
/**
*
*/
module.exports = angular.module('sherman.factories', [])
    // TODO: factory 명명 규칙 필요
    .factory('util', require('./util.js'))

    // prop instances
    .factory('searchCond', require('./searchCond.js'))
    .factory('pivotProps', require('./pivotProps.js'))
    .factory('anomaly', require('./anomaly.js'))
    .factory('Report', require('./report.js'))
    .factory('dataModel', require('./dataModel.js'))
    ;
