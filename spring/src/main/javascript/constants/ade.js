'use strict';
/**
 *
 */
/**
 *
 */
module.exports = {
    title: '',

    // keyFields: [],
    keyFields: [{ field: { name: "FTS_RAW_DATA", type: "TEXT"}}],
    valFields: [{ field: { name: 'HR', type: 'NUMBER' }, func: 'sum' }],
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
