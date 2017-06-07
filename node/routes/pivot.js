'use strict';
/**
 *   constant
 */
var DATA_PATH = '../data/pivot';
var DELAY_MS = (1000 * 0.1);
/**
 *   modules
 */
var path = require('path');

var express = require('express');
var router = express.Router();
var _ = require('lodash');
var uuidV1 = require('uuid/v1');
/**
 *   data
 */
// var grid = require(path.join(DATA_PATH, 'grid.json'));
var data = require(path.join(DATA_PATH, 'data.json')).data;
/**
 *   variables
 */
var MAX_SPLIT_NUM = 5;
var sessions = {};

var CSV_FILE_PATH = __dirname + '/../data/pivot/download/pivot.csv';
var JSON_FILE_PATH = __dirname + '/../data/pivot/download/pivot.json';

// 임시 테이블 데이터
// router.get('/grid', function(req, res) {
//     res.send(grid);
// });

// sid 요청
router.post('/iris-pivot/jobs', function(req, res) {
    var reqBody = req.body;
    if (!reqBody.cells || reqBody.cells.length === 0) {
        res.statusCode = 400;
        res.send({
            'type': 'Invalid parameter',
            'message': 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        param: reqBody,
        index: 1 // 1~MAX
    };

    res.send({
        sid: sid
    });
});

// 결과 요청
router.get('/iris-pivot/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var index = sessions[sid].index;
    var param = sessions[sid].param;
    var isEnd = (index === MAX_SPLIT_NUM);
    var resData = {};
    var getOnce = (param.getOnce) ? param.getOnce : false;
    var noDelay = (param.noDelay) ? param.noDelay : false;

    if (!getOnce && !isEnd) {
        resData = {
            'status': {
                'current': index,
                'total': MAX_SPLIT_NUM
            },
            'total_count': (Math.floor((Math.random() * 10000) + 1)),
            'isEnd': false
        };
        sessions[sid].index = (index + 1);
    } else {
        resData = {
            'status': {
                'current': index,
                'total': (getOnce ? 1 : MAX_SPLIT_NUM)
            },
            'total_count': (Math.floor((Math.random() * 10000) + 1)),
            'fields': getFields(param),
            'results': getResult(param),
            'isEnd': true
        };
    }

    var delay = ((noDelay) ? 0 : DELAY_MS);
    setTimeout(function() {
        res.send(resData);
    }, delay);
});

router.get('/iris-pivot/jobs/:sid/download', function(req, res) {
    var sid = req.params.sid;
    var session = sessions[sid];

    if (!session) {
        return res.sendStatus(404);
    }

    var type = req.query.type;
    var fileName = [req.query.file_name, '.', type].join('');

    var filePath = '';

    if (type === 'csv') {
        filePath = CSV_FILE_PATH;
    } else {
        filePath = JSON_FILE_PATH;
    }

    return res.download(filePath, fileName);
});
// 검색결과 export
router.get('/iris-pivot/jobs/:sid/export', function(req, res) {
    var sid = req.params.sid;
    var session = sessions[sid];

    if (!session) {
        return res.status(500).send({
            message: 'export failed'
        });
    }

    setTimeout(function() {
        return res.send({
            message: 'ok'
        });
    }, DELAY_MS);
});
// 요청 중지
router.delete('/iris-pivot/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({
        'message': 'OK'
    });
});
/**
 *   functions
 */
function getFields(param) {
    var fields = [];

    var rows = param.rows;
    var cols = param.cols;
    var cells = param.cells;

    if (rows && rows.length > 0) {
        _.forEach(rows, function(value) {
            fields.push({
                name: ((!_.isEmpty(value.as)) ? value.as : value.field),
                type: _.result(_.find(fields.data, 'name', value.field), 'type')
            });
        });
    }

    if (cols && cols.length > 0) {
        _.forEach(cols, function(value) {
            var fieldName = _.toUpper(value);
            var colsValue = getFieldValues(fieldName);

            _.forEach(colsValue, function(value) {
                fields.push({
                    name: (value + '_' + cells[0].func + '(' + cells[0].field + ')'),
                    type: 'NUMBER'
                });
            });
        });
    } else {
        fields.push({
            // name: cells[0].field + '의' + cells[0].func,
            name: (cells[0].func + '(' + cells[0].field + ')'),
            type: 'NUMBER'
        });
    }

    return fields;
}

function getResult(param) {
    var result = [];
    var allRowValues = [];

    var rows = param.rows;
    var cols = param.cols;

    if (rows && rows.length === 0) {
        rows = null;
    }
    if (cols && cols.length === 0) {
        cols = null;
    }

    _.forEach(data, function(value, index) {
        var field = '';
        var item = [];
        var isExist = false;

        _.forEach(rows, function(row) {
            field = _.toUpper(row.field);
            var value = data[index][field];
            isExist = (_.indexOf(allRowValues, value) > -1);
            if (!isExist) {
                item.push(value);
            }
            allRowValues.push(value);
        });

        if (!isExist) {
            if (cols) {
                _.forEach(cols, function(value) {
                    field = _.toUpper(value);
                    var colsValue = getFieldValues(field);
                    _.forEach(colsValue, function() {
                        item.push(Math.floor((Math.random() * 1000) + 1));
                    });
                });
            } else {
                item.push(Math.floor((Math.random() * 1000) + 1));
            }
            result.push(item);
        }
    });

    // range
    var firstRow = _.head(rows);
    var useRange = false;
    if (firstRow && (firstRow.unit || firstRow.start || firstRow.end)) {
        useRange = true;
        if (_.isString(firstRow.unit)) {
            result = mergeResultByUnit(result, firstRow);
        } else {
            result = mergeResultByRange(result, firstRow);
        }
    }

    // sort
    var sort = (param.sort || 'asc');
    result = _.orderBy(result, function(item) {
        return _.head(item);
    }, [sort]);

    // size (data limit count)
    var size = param.size;
    if (!useRange && size) {
        result = _.take(result, size);
    }

    return result;
}

function getFieldValues(fieldName) {
    var values = _.uniq(_.map(data, function(value) {
        return (value[fieldName]);
    }));
    return values;
}

function mergeResultByUnit(result, firstRow) {
    // 단위 기준으로 값 구하기
    var getCategories = function(result, unit) {
        var timeUnitLength = {
            '1y': 4,
            '1m': 6,
            '1d': 8,
            '1H': 10,
            '1M': 12,
            '1S': 14
        }[unit || '1s'];

        var items = _.map(result, function(row) {
            var time = (_.head(row) + '');
            return time.slice(0, timeUnitLength);
        });

        return _.uniq(items);
    };

    var newResult = [];

    var timeUnit = firstRow.unit;
    var categories = getCategories(result, timeUnit);

    _.forEach(categories, function(category) {
        var rows = _.filter(result, function(row) {
            return _.startsWith((_.head(row) + ''), category);
        });

        var newValue = _.cloneDeep(_.head(rows));
        newValue = _.fill(newValue, 0);
        newValue[0] = _.padEnd(category, 14, 0);

        if ((timeUnit === '1y')) {
            newValue[0] = newValue[0].substring(0, 4) + '0101000000';
        } else if (timeUnit === '1m') {
            newValue[0] = newValue[0].substring(0, 6) + '01000000';
        }

        _.forEach(rows, function(item) {
            for (var i = 1; i < item.length; i++) {
                newValue[i] += item[i];
            }
        });

        newResult.push(newValue);
    });

    return newResult;
}

function mergeResultByRange(result, firstRow) {

    var findIndex = function(arry, findValue, isReverse) {

        if (!findValue) {
            return -1;
        }

        var index = _.findIndex(arry, function(item) {
            return (item === findValue);
        });

        if (index === -1) {
            if (!isReverse) {
                _.forEach(arry, function(item, i) {
                    if (item > findValue) {
                        index = i;
                        return false;
                    }
                });
            } else {
                _.forEachRight(arry, function(item, i) {
                    if (item < findValue) {
                        index = i;
                        return false;
                    }
                });
            }
        }

        return index;
    };

    var mergeValues = function(values, maxValue, size) {

        var category = (maxValue - size);

        var newValue = _.cloneDeep(_.head(values));
        newValue = _.fill(newValue, 0);
        newValue[0] = category;

        _.forEach(values, function(item) {
            for (var i = 1; i < item.length; i++) {
                newValue[i] += item[i];
            }
        });

        return newValue;
    };

    // sort by first value
    result = _.orderBy(result, function(item) {
        return _.head(item);
    }, ['asc']);

    // get categories
    var categories = _.map(result, function(item) {
        return _.head(item);
    });

    var start = firstRow.start;
    var end = firstRow.end;

    // check out of value range
    if (_.isNumber(start) && (start > _.max(categories))) {
        return [];
    }

    if (_.isNumber(end) && (end < _.min(categories))) {
        return [];
    }

    if (_.isNumber(start) && _.isNumber(end) && end < start) {
        return [];
    }

    // slice data by range options
    var startIndex = findIndex(categories, start, false);
    var endIndex = findIndex(categories, end, true);

    if (startIndex === -1) {
        startIndex = 0;
    }

    if (endIndex === -1) {
        endIndex = result.length;
    } else {
        endIndex += 1;
    }

    result = _.slice(result, startIndex, endIndex);

    // merge data by range options
    var size = firstRow.unit;
    if (size > 1) {

        var newResult = [];
        var values = [];
        var newValue = [];
        var maxValue = ((start) ? (start + size) : size);

        _.forEach(result, function(item, index) {

            values.push(item);

            var nextValueIndex = (index + 1);
            var nextCategory = _.head(result[nextValueIndex]);

            var isOutOfIndex = (nextValueIndex >= result.length);
            var isOutOfCategory = (nextCategory >= maxValue);

            if (isOutOfIndex || isOutOfCategory) {

                newValue = mergeValues(values, maxValue, size);
                newResult.push(newValue);

                maxValue += size;
                values = [];
            }
        });

        result = newResult;
    }

    return result;
}
/**
 *   exports
 */
module.exports = router;
