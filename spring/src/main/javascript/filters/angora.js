'use strict';
/**
 *  module dependencies
 */
var _ = require('lodash');
/**
*
*/
func2text.$inject = ['MESSAGE'];
function func2text(MESSAGE) {
    // Angora func to text
    var funcMap = {
        count: MESSAGE['agg_func.count'],
        values: MESSAGE['agg_func.distinct_values'],
        // : MESSAGE['agg_func.distinct_count'],
        first: MESSAGE['agg_func.first_value'],
        last: MESSAGE['agg_func.last_value'],
        sum: MESSAGE['agg_func.sum'],
        avg: MESSAGE['agg_func.average'],
        max: MESSAGE['agg_func.max'],
        min: MESSAGE['agg_func.min'],
        stddev: MESSAGE['agg_func.std_dev'],
        // stdevp: MESSAGE['agg_func.variance'],
        mean: MESSAGE['agg_func.median'],

        start: MESSAGE['time_range.start'],
        end: MESSAGE['time_range.end'],

        iqr: MESSAGE['agg_func.iqr']
    };

    return function(name) {
        return (funcMap[name] || name || 'unknown');
    };
}
aggText.$inject = ['$filter', 'LOCALE'];
function aggText($filter, LOCALE) {
    var REG_FUNC_COL = /(\S+)\((\S+)\)/;

    return function (text) {
        // is nil
        if (!text) {
            return text;
        }

        var mg = REG_FUNC_COL.exec(text);
        if (!mg) {
            return text;
        }

        var fnName = mg[1];
        var fieldName = mg[2];

        fnName = $filter('func2text')(fnName);
        if (fieldName === '*') {
            fieldName = 'Event Object';
        }

        return {
            // TODO: 메세지로 변환 필요
            ko: (fieldName + '의 ' + fnName),
            en: (fnName + ' of ' + fieldName)
        }[LOCALE];
    };
}
/**
*
*/
columnText.$inject = ['$filter', 'util'];
function columnText($filter, util) {
    // (case) fieldName: row, valueInCol, function(col), valueInCol_function(fCol)
    return function(text) {
        var parsed = util.parseColumnText(text);
        if (!parsed) {
            return text;
        }

        var isBoth = parsed.isBoth;
        var valueInCol = parsed.valueInCol;
        var funcCol = parsed.funcCol;
        var aggText = '';

        if (funcCol) {
            aggText = $filter('aggText')(funcCol);
        }

        if (isBoth) {
            // ex) CHN:::HR의 합계
            // ex) CHN:::sum of HR
            return valueInCol + ':::' + aggText;
        }
        else {
            // ex) CHN
            // ex) HR의 합계
            return valueInCol || aggText;
        }
    };
}
/**
*   exports
*/
module.exports = {
    func2text: func2text,
    aggText: aggText,
    columnText: columnText
};
