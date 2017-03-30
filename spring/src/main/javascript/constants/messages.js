'use strict';
/**
*
*/
var locale = require('./locale.js');

var messages = {
    ko: require('../../webapp/resources/build/message_ko.json'),
    en: require('../../webapp/resources/build/message_en.json')
};
/**
*
*/
module.exports = messages[locale] || messages.en;
