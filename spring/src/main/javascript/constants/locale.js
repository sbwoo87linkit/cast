'use strict';
/**
*
*/
var angular = require('angular');
var $ = angular.element;

var locale = $('html').attr('lang').split('_')[0];
/**
*
*/
module.exports = locale;
