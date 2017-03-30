'use strict';
/**
 *
 */
/**
*
*/
// NOTE: 구조체가 변경되면 수정되어야 한다.
pivot.$inject = [];
function pivot() {
    return function(obj) {
        return obj.label || obj.field.name || (obj + '');
    };
}

pivotFilter.$inject = ['OPTIONS'];
function pivotFilter(OPTIONS) {
    // TODO: 모든 타입에 대해 색인(map)을 만들어야 한다.
    var operMap = {};
    _.forEach(OPTIONS.OPER_TEXT, function (opt) {
        operMap[opt.value] = opt.text;
    });

    return function(obj) {
        // NOTE: filter는 label이 없다.
        var field = obj.field;
        var type = obj.type;

        if (type === 'match') {
            var match = obj.match;
            var operator = match.operator;
            var value = match.value;

            if (!/[<>=]+/.test(operator)) {
                operator = operMap[operator];
            }

            return [field.name, operator, value].join(' ');
        } else if (type === 'between') {
            var between = obj.between;
            var startOper = between.startOper;
            var startVal = between.startValue;
            var endOper = between.endOper;
            var endVal = between.endValue;

            return [startVal, startOper, field.name, endOper, endVal].join(' ');
        }
    };
}

pivotCell.$inject = ['$filter', 'LOCALE', 'MESSAGE'];
function pivotCell($filter, LOCALE, MESSAGE) {
    var func2text = $filter('func2text');

    return function(obj) {
        // ex)
        // {
        //     field: {
        //         name: '*',
        //         type: '*'
        //     },
        //     func: 'count',
        //     label: null
        // }
        var label = obj.label;
        if (label) {
            return label;
        }

        var field = obj.field;
        if (field.name === '*') {
            return MESSAGE['pivot.num_event_object'];
        }

        var strFunc = func2text(obj.func);

        // TODO: 메세지로 변환 필요
        return {
            ko: (field.name + '의 ' + strFunc),
            en: (strFunc + ' of ' + field.name)
        }[LOCALE];
    };
}
/**
*   exports
*/
module.exports = {
    pivot: pivot,
    pivotFilter: pivotFilter,
    pivotCell: pivotCell
};
