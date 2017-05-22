'use strict';
/**
 *
 */
var angular = require('angular');
/**
*
*/
module.exports = angular.module('sherman.services', [])
    .service('errorHandler', require('./errorHandler.js'))

    .service('popupBox', require('./popup_box.js'))

    .service('commonAgent', require('./agent/common.js'))
    .service('searchAgent', require('./agent/search.js'))
    .service('anomalyAgent', require('./agent/anomaly.js'))
    .service('advAgent', require('./agent/adv.js'))
    .service('reportAgent', require('./agent/report.js'))
    .service('dataModelAgent', require('./agent/data-model.js'))

    .service('queryParser', require('./queryParser.js'))
    .service('queryBuilder', require('./queryBuilder.js'))
    .service('paramBuilder', require('./paramBuilder.js'))
    ;
