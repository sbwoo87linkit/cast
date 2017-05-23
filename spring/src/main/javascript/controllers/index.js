/**
 *
 */
'use strict';

var angular = require('angular');

require('./analysis');
require('./anomaly');
require('./test');
/**
 *
 */
module.exports = angular.module('sherman.controllers', [
    'sherman.controllers.analysis',
    'sherman.controllers.anomaly',
    'sherman.controllers.test'
]);
