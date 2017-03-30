'use strict';
/**
 *
 */
var querystring = require('querystring');
var _ = require('lodash');
var moment = require('moment');
/**
 *
 */
paramBuilder.$inject = ['DEFAULT', 'util'];
function paramBuilder(DEFAULT, util) {
    /**
    *
    */
    var REGEXP_SPLIT = /(\S+)(?:\s+AS\s+"?([^"\r\n]+)"?)?(?:\s+UNIT\s+([\d\w]+))?(?:\s+RANGE\s+(.+))?/;
    var REGEXP_RANGE = /(?:max=(-?[\d\.]+))?\s*(?:size=(-?[\d\.]+))?\s*(?:start=(-?[\d\.]+))?\s*(?:end=(-?[\d\.]+))?/;
    var REGEXP_CELL = /([\w_]+)\((\*|[\w_]+)\)(?:\s+AS\s+"?([^"\r\n]+)"?)?/;
    /**
    *
    */
    // NOTE: 변환 목적이 다르므로 util.getFilter와는 달리 연산자 변환을 하지 않는다.
    var _serialize = {
        filter: function (item) {
            var filterType = item.type.toUpperCase();

            var fieldName = item.field.name;
            var fieldType = item.field.type;

            var isTEXT = (fieldType === 'TEXT');

            if (filterType === 'MATCH') {
                var operator = item.match.operator;
                var value = item.match.value;

                if (operator.indexOf('Null') !== -1) {
                    // MATCH TEAM_ID isNull
                    return [filterType, fieldName, operator].join(' ');
                }

                if (isTEXT) {
                    value = '"' + value + '"';
                }
                // MATCH TEAM_ID = *
                return [filterType, fieldName, operator, value].join(' ');
            } else if (filterType === 'BETWEEN') {
                var bet = item.between;
                var startOper = bet.startOper;
                var startValue = ((isTEXT) ? ('"' + bet.startValue + '"') : bet.startValue);
                var endOper = bet.endOper;
                var endValue = ((isTEXT) ? ('"' + bet.endValue + '"') : bet.endValue);

                // BETWENN 1 <= TEAM_ID < 3
                return [filterType, startValue, startOper, fieldName, endOper, endValue].join(' ');
            }
        },
        row: function (item) {
            var rst = [item.field.name];

            if (item.label) {
                rst.push('AS');
                rst.push(JSON.stringify(item.label));
            }
            if (item.timeUnit) {
                rst.push('UNIT');
                rst.push(item.timeUnit);
            }
            if (item.useRange && !_.isEmpty(item.range)) {
                rst.push('RANGE');

                if (_.isNumber(item.range.max)) {
                    rst.push('max=' + item.range.max);
                }
                if (_.isNumber(item.range.size)) {
                    rst.push('size=' + item.range.size);
                }
                if (_.isNumber(item.range.start)) {
                    rst.push('start=' + item.range.start);
                }
                if (_.isNumber(item.range.end)) {
                    rst.push('end=' + item.range.end);
                }
            }
            return rst.join(' ');
        },
        col: function (item) {
            var rst = [item.field.name];

            // if (item.label) {
            //     rst.push('AS');
            //     rst.push(JSON.stringify(item.label));
            // }
            if (item.timeUnit) {
                rst.push('UNIT');
                rst.push(item.timeUnit);
            }
            if (item.useRange && !_.isEmpty(item.range)) {
                rst.push('RANGE');

                if (_.isNumber(item.range.max)) {
                    rst.push('max=' + item.range.max);
                }
                if (_.isNumber(item.range.size)) {
                    rst.push('size=' + item.range.size);
                }
                if (_.isNumber(item.range.start)) {
                    rst.push('start=' + item.range.start);
                }
                if (_.isNumber(item.range.end)) {
                    rst.push('end=' + item.range.end);
                }
            }
            return rst.join(' ');
        },
        cell: function (item) {
            var rst = [item.func + '(' + item.field.name + ')'];

            if (item.label) {
                rst.push('AS');
                rst.push(JSON.stringify(item.label));
            }
            return rst.join(' ');
        }
    };
    var _parse = {
        filter: function (str) {
            var sp = str.split(/\s+/);
            var filterType = sp[0].toLowerCase();

            if (filterType === 'match') {
                return {
                    field: {
                        name: sp[1]
                    },
                    type: filterType,
                    match: {
                        operator: sp[2],
                        value: (!sp[3]) ? '' : sp[3].replace(/"/g, '')
                    }
                };
            } else if (filterType === 'between') {
                return {
                    field: {
                        name: sp[3]
                    },
                    type: filterType,
                    between: {
                        startOper: sp[2],
                        startValue: (!sp[1]) ? '' : sp[1].replace(/"/g, ''),
                        endOper: sp[4],
                        endValue: (!sp[5]) ? '' : sp[5].replace(/"/g, '')
                    }
                };
            }
        },
        row: function (item) {
            var m = REGEXP_SPLIT.exec(item);
            if (!m) {
                return null;
            }

            var rst = {};

            if (m[1]) {
                rst.field = {
                    name: m[1]
                };
            }
            if (m[2]) {
                rst.label = m[2];
            }
            if (m[3]) {
                rst.timeUnit = m[3];
            }
            if (m[4]) {
                rst.useRange = true;

                var m4 = REGEXP_RANGE.exec(m[4]);

                rst.range = {
                    max: +m4[1],
                    size: +m4[2],
                    start: +m4[3],
                    end: +m4[4]
                };
            }

            return rst;
        },
        col: function (item) {
            var m = REGEXP_SPLIT.exec(item);
            if (!m) {
                return null;
            }

            var rst = {};

            if (m[1]) {
                rst.field = {
                    name: m[1]
                };
            }
            if (m[2]) {
                rst.label = m[2];
            }
            if (m[3]) {
                rst.timeUnit = m[3];
            }
            if (m[4]) {
                rst.useRange = true;

                var m4 = REGEXP_RANGE.exec(m[4]);

                rst.range = {
                    max: +m4[1],
                    size: +m4[2],
                    start: +m4[3],
                    end: +m4[4]
                };
            }

            return rst;
        },
        cell: function (item) {
            var m = REGEXP_CELL.exec(item);
            if (!m) {
                return null;
            }
            return {
                func: m[1],
                field: {
                    name: m[2]
                },
                label: m[3]
            };
        }
    };
    /**
    *   functions
    */
    function serialize(props) {
        // NOTE: $state는 변경하고자 하면 반드시 param을 설정해야 한다.
        // 제거하려면 null로 설정하거나, inherit=false로 설정해야만
        // 해당 param을 제거한다. (설정하지 않으면 이전 값 유지)
        var params = {
            'q': null,
            't.start': null,
            't.end': null,
            'filters': null,
            'rows': null,
            'cols': null,
            'cells': null,
            'sort': null,
            'row_size': null,
            'col_size': null,
            'jt': null
        };

        // required params
        params['q'] = props.query;
        params['d'] = props.modelId;

        if (props.timeRange) {
            params['t.start'] = (_.isNil(props.timeRange.start)) ? 'null' : props.timeRange.start;
            params['t.end'] = (_.isNil(props.timeRange.end)) ? 'null' : props.timeRange.end;
        }

        // optional params
        if (props.filters && props.filters.length) {
            params['filters'] = _.map(props.filters, _serialize.filter).join(',');
        } else {
            params['filters'] = null;
        }

        if (props.rows && props.rows.length) {
            params['rows'] = _.map(props.rows, _serialize.row).join(',');
        }
        if (props.cols && props.cols.length) {
            params['cols'] = _.map(props.cols, _serialize.col).join(',');
        }
        if (props.cells && props.cells.length) {
            params['cells'] = _.map(props.cells, _serialize.cell).join(',');
        }

        if (!_.isEmpty(props.rowOpts)) {
            if (props.rowOpts.align) {
                params['sort'] = props.rowOpts.align;
            }
            params['row_size'] = props.rowOpts.limit_num;
        }
        if (!_.isEmpty(props.colOpts)) {
            params['col_size'] = props.colOpts.limit_num;
        }

        // NOTE: 동작 흐름상으로는 여기서 jobTime을 생성하면 안된다. url history의 불필요한 누적을 막기 위함.
        params['jt'] = props.jobTime || (moment().valueOf() + '');
        // params['display'] = null;

        // return querystring.stringify(params);
        return params;
    }

    function parse(params) {
        if (_.isString(params)) {
            params = querystring.parse(params);
        }

        var props = {};

        // required params
        if (params['q']) {
            props.query = params['q'];
        }
        if (params['d']) {
            props.modelId = params['d'];
        }

        var tStart = params['t.start'];
        var tEnd = params['t.end'];

        if (tStart || tEnd) {
            if (util.isNumber(tStart)) {
                tStart = +tStart;
            }
            if (util.isNumber(tEnd)) {
                tEnd = +tEnd;
            }

            props.timeRange = {
                start: (tStart === 'null') ? null : tStart,
                end: (tEnd === 'null') ? null : tEnd,
            };
        }

        // optional params
        if (params['filters']) {
            props.filters = _.map(params['filters'].split(','), _parse.filter);
        }
        if (params['rows']) {
            props.rows = _.compact(_.map(params['rows'].split(','), _parse.row));
        }
        if (params['cols']) {
            props.cols = _.compact(_.map(params['cols'].split(','), _parse.col));
        }
        if (params['cells']) {
            props.cells = _.compact(_.map(params['cells'].split(','), _parse.cell));
        }

        if (params['sort'] || params['row_size']) {
            props.rowOpts = {
                align: params['sort'],
                limit_num: +params['row_size']
            };
        }
        if (params['col_size']) {
            props.colOpts = {
                limit_num: +params['col_size']
            };
        }

        if (params['jt']) {
            props.jobTime = params['jt'];
        }
        // props.display = null;

        return props;
    }

    function toString(props) {
        var params = serialize(props);
        return querystring.stringify(_.omitBy(params, _.isNil));
    }
    /**
     *   exports
     */
    return {
        serialize: serialize,
        parse: parse,
        toString: toString
    };

}
/**
*
*/
module.exports = paramBuilder;
