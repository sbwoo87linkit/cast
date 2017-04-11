'use strict';
/**
 *
 */
/**
 *
 */
module.exports = {
    title: '',

    keyFields: [],
    valFields: [],
    model: 'SPC',

    min: 0,
    max: 100,
    includeNewKey: true,
    missingValue: 'do_not_process',

    comTimeRange: {
        start: null,
        end: null
    },
    refTimeRange: {
        start: '-4w',
        end: 'now'
    },
    timeUnit: '1h',
    isMatchTimezone: true,
    dateClassification: 'sameday'
};
