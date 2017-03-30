'use strict';
/**
*
*/
var MESSAGE = require('../messages.js');
/**
*
*/
module.exports = {
    TIME_UNIT: [
        { text: MESSAGE['years'], value: '1y' },
        { text: MESSAGE['months'], value: '1m' },
        { text: MESSAGE['days'], value: '1d' },
        { text: MESSAGE['hours'], value: '1H' },
        { text: MESSAGE['minutes'], value: '1M' },
        { text: MESSAGE['seconds'], value: '1S' }
    ],
    ORDER: [
        { text: MESSAGE['sort.default'], value: '', isSelected: true },
        { text: MESSAGE['sort.ascending'], value: 'asc' },
        { text: MESSAGE['sort.descending'], value: 'desc' }
    ],
    VALUE_TEXT: [
        { text: MESSAGE['agg_func.first_value'], value: 'first' },
        { text: MESSAGE['agg_func.last_value'], value: 'last' },
        { text: MESSAGE['agg_func.count'], value: 'count' }
        // { text: MESSAGE['agg_func.distinct_values'], value: 'values' }
        // { text: MESSAGE['agg_func.distinct_count'], value: 'number' }
    ],
    VALUE_TIMESTAMP: [
        // NOTE: angora#134 에 따라 일시적으로 기능 해제
        // { text: MESSAGE['time_range.term'], value: 'range' },
        { text: MESSAGE['time_range.start'], value: 'start' }, // (func: min)
        { text: MESSAGE['time_range.end'], value: 'end' } // (func: max)
    ],
    VALUE_NUMBER: [
        { text: MESSAGE['agg_func.sum'], value: 'sum' },
        { text: MESSAGE['agg_func.count'], value: 'count' },
        { text: MESSAGE['agg_func.average'], value: 'avg' },
        { text: MESSAGE['agg_func.max'], value: 'max' },
        { text: MESSAGE['agg_func.min'], value: 'min' },
        { text: MESSAGE['agg_func.std_dev'], value: 'stddev' },
        { text: MESSAGE['agg_func.median'], value: 'mean' },
        // { text: '개별 값 나열', value: 'values' }
    ],
    OPER_TIMESTAMP: [
        { text: '=', value: '=' },
        { text: '!=', value: '<>' },
        { text: '<=', value: '<=' },
        { text: '<', value: '<' },
        { text: '>=', value: '>=' },
        { text: '>', value: '>' },
        { text: 'NULL', value: 'isNull' },
        { text: 'NOT NULL', value: 'isNotNull' }
    ],
    OPER_TEXT: [
        { text: '=', value: '=' },
        { text: '!=', value: '!=' },
        { text: 'LIKE', value: 'contains' },
        { text: 'NOT LIKE', value: 'doesNotContain' },
        { text: MESSAGE['pivot.like_first'], value: 'startsWith' },
        { text: MESSAGE['pivot.like_last'], value: 'endsWith' },
        { text: 'IS NULL', value: 'isNull' },
        { text: 'IS NOT NULL', value: 'isNotNull' }
    ],
    OPER_NUMBER: [
        { text: '=', value: '=' },
        { text: '!=', value: '<>' },
        { text: '<=', value: '<=' },
        { text: '<', value: '<' },
        { text: '>=', value: '>=' },
        { text: '>', value: '>' },
        { text: 'IS NULL', value: 'isNull' },
        { text: 'IS NOT NULL', value: 'isNotNull' }
    ],
    OPER_NUMBER_BETWEEN: [
        { text: '<=', value: '<=' },
        { text: '<', value: '<' }
    ],

    FIELD_TYPE: [
        { text: 'TEXT', value: 'TEXT' },
        { text: 'NUMBER', value: 'NUMBER' },
        { text: 'INTEGER', value: 'INTEGER' },
        { text: 'TIMESTAMP', value: 'TIMESTAMP' }
    ]
};
