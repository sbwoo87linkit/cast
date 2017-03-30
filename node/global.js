'use strict';
/**
 * Module dependencies
 */
var path = require('path');
/**
 * set global variables
 */
var config = global.config = require('./config.json');

var ROOT_PATH = global.ROOT_PATH = path.join(__dirname, '..');
var SPRING_PATH = path.join(ROOT_PATH, 'spring/src/main/webapp');
var CLIENT_PATH = global.CLIENT_PATH = SPRING_PATH;
var WAS_PATH = global.WAS_PATH = path.join(ROOT_PATH, 'node');
// var API_PATH = global.API_PATH = path.join(ROOT_PATH, config.api.path);
var TMP_PATH = global.TMP_PATH = path.join(ROOT_PATH, 'tmp');
/**
*   exports
*/
module.exports = {
    config: config,
    ROOT_PATH: ROOT_PATH,
    CLIENT_PATH: CLIENT_PATH,
    WAS_PATH: WAS_PATH,
    // API_PATH: API_PATH,
    TMP_PATH: TMP_PATH
};
