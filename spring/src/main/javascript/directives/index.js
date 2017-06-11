'use strict';
/**
*
*/
var angular = require('angular');
/**
*
*/
module.exports = angular.module('sherman.directives', [])
    .directive('irisAlert', require('./popup_box').irisAlert)
    .directive('irisConfirm', require('./popup_box').irisConfirm)

    .directive('popupLayer', require('./popupLayer.js').popupLayer)
    .directive('popupLayerArea', require('./popupLayer.js').popupLayerArea)
    .service('popupLayerStore', require('./popupLayer.js').popupLayerStore)

    .directive('datetimePicker', require('./datetime.js'))
    .directive('timePicker', require('./timepicker.js'))

    .directive('fieldList', require('./pivot/fieldList.js'))

    .directive('chartSankey', require('./chart/sankey.js'))
    ;
