'use strict';
/**
 *
 */
var angular = require('angular');
/**
 *
 */
module.exports = angular.module('sherman.constants', [])
    .constant('LOCALE', require('./locale.js'))
    .constant('MESSAGE', require('./messages.js'))
    // TODO: 추후 파일 구조 개선
    .constant('OPTIONS', require('./options'))
    .constant('OPTIONS.ANOMALY', require('./options/anomaly.js'))
    .constant('DEFAULT', require('./default.js'))
    .constant('CONFIG', require('./config.js'))
    .constant('CHART', require('./chart.js'))
    .constant('FORMAT', {
        DATE: 'YYYY/MM/DD',
        TIME: 'HH:mm:ss',
        DATETIME: 'YYYY/MM/DD HH:mm:ss',
        UNPARSED: 'YYYYMMDDHHmmss'
    })
    .constant('FNAME', {
        _expand: '000',
        _no: 'NO'
    })
    .constant('REGEXP', {
        UNPARSED: /^(\d{14})$/,
        // special keyword (ex) '-15m')
        TIME_KEYWORD: /^(\+|-)?(\d+)([smhdwMQy]+)$|^(now)$/
    })
    .constant('ALIGN', {
        LEFT: 'left',
        RIGHT: 'right'
    })
    ;
