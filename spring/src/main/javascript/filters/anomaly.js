'use strict';
/**
 *
 */
/**
*
*/
// NOTE: 구조체가 변경되면 수정되어야 한다.
anomalyKey.$inject = ['MESSAGE'];
function anomalyKey(MESSAGE) {
    return function(obj) {
        if (obj.label) {
            return obj.label;
        }
        else if (!obj.field) {
            return MESSAGE['anomaly.opt.not_selected'];
        }
        return obj.field.name;
    };
}

anomalyValue.$inject = ['$filter', 'LOCALE', 'MESSAGE'];
function anomalyValue($filter, LOCALE, MESSAGE) {
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
        var field = obj.field;
        if (!field) {
            return MESSAGE['anomaly.opt.not_selected'];
        }
        var strFunc = func2text(obj.func);

        // TODO: 메세지로 변환 필요
        return {
            ko: (field.name + '의 ' + strFunc),
            en: (strFunc + ' of ' + field.name)
        }[LOCALE];
    };
}

anomalyModel.$inject = ['OPTIONS.ANOMALY'];
function anomalyModel(OPTIONS) {
    return function(key) {
        return OPTIONS.MODELS[key];
    };
}

anomalyMissing.$inject = ['OPTIONS.ANOMALY'];
function anomalyMissing(OPTIONS) {
    return function(key) {
        return OPTIONS.MISSINGS[key];
    };
}

anomalyUnit.$inject = ['OPTIONS.ANOMALY'];
function anomalyUnit(OPTIONS) {
    return function(key) {
        return OPTIONS.UNITS[key];
    };
}

anomalyClassifyDate.$inject = ['OPTIONS.ANOMALY'];
function anomalyClassifyDate(OPTIONS) {
    return function(key) {
        return OPTIONS.DATE_CLASSIFICATION[key];
    };
}
/**
*   exports
*/
module.exports = {
    anomalyKey: anomalyKey,
    anomalyValue: anomalyValue,
    anomalyModel: anomalyModel,
    anomalyMissing: anomalyMissing,
    anomalyUnit: anomalyUnit,
    anomalyClassifyDate: anomalyClassifyDate
};
