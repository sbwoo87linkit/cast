'use strict';
/**
*
*/
var angular = require('angular');
/**
*
*/
module.exports = angular.module('sherman.filters', [])
    .filter('errorMsg', require('./errorMsg.js'))

    .filter('autoFixed', require('./number.js').autoFixed)

    .filter('msec2str', require('./datetime.js').msec2str)
    .filter('str2msec', require('./datetime.js').str2msec)
    .filter('all2moment', require('./datetime.js').all2moment)
    .filter('all2unparsed', require('./datetime.js').all2unparsed)
    .filter('fromByTUnit', require('./datetime.js').fromByTUnit)
    .filter('timerange2text', require('./datetime.js').timerange2text)
    .filter('keyword2text', require('./datetime.js').keyword2text)
    .filter('keyrange2text', require('./datetime.js').keyrange2text)
    .filter('allrange2text', require('./datetime.js').allrange2text)

    .filter('convType', require('./convType.js'))

    .filter('func2text', require('./angora.js').func2text)
    .filter('aggText', require('./angora.js').aggText)
    .filter('columnText', require('./angora.js').columnText)

    .filter('partitionRange', require('./iris.js').partitionRange)

    .filter('pivot', require('./pivot.js').pivot)
    .filter('pivotFilter', require('./pivot.js').pivotFilter)
    .filter('pivotCell', require('./pivot.js').pivotCell)

    .filter('anomalyKey', require('./anomaly.js').anomalyKey)
    .filter('anomalyValue', require('./anomaly.js').anomalyValue)
    .filter('anomalyModel', require('./anomaly.js').anomalyModel)
    .filter('anomalyMissing', require('./anomaly.js').anomalyMissing)
    .filter('anomalyUnit', require('./anomaly.js').anomalyUnit)
    .filter('anomalyClassifyDate', require('./anomaly.js').anomalyClassifyDate)
    ;
