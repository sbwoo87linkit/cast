'use strict';
/**
*
*/
var MESSAGE = require('../messages.js');
/**
*
*/
module.exports = {
    CHART_TYPES: {
        'heatmap': MESSAGE['chart.type.heatmap'],
        'line': MESSAGE['chart.type.line']
    },
    FUNCS: {
        'ETC': {
            'count': MESSAGE['agg_func.count']
        },
        'NUMBER': {
            'sum': MESSAGE['agg_func.sum'],
            'avg': MESSAGE['agg_func.average'],
            'count': MESSAGE['agg_func.count']
        }
    },
    MODELS: {
        'SPC': 'SPC',
        'NoStd': 'NoStd',
        'Std': 'Std',
        'multidim': MESSAGE['anomaly.model.multidim']
    },
    MISSINGS: {
        // TODO: value가 명확히 정해지지 않음. API 문서 갱신시 수정 필요
        'do_not_process': MESSAGE['anomaly.opt.do_not_process'],
        '0': '0',
        'NULL': 'NULL',
        'custom_value': MESSAGE['anomaly.opt.custom_value']
    },
    UNITS: {
        '1m': '1 ' + MESSAGE['minutes'],
        '10m': '10 ' + MESSAGE['minutes'],
        '1h': '1 ' + MESSAGE['hours']
    },
    DATE_CLASSIFICATION: {
        'sameday': MESSAGE['anomaly.opt.sameday'],
        'weekday': MESSAGE['anomaly.opt.weekday'],
        'weekend': MESSAGE['anomaly.opt.weekend']
    }
};
