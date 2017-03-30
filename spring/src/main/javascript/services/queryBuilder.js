'use strict';
/**
 *
 */
var _ = require('lodash');
/**
 *
 */
queryBuilder.$inject = ['DEFAULT', 'FORMAT', 'REGEXP', 'util'];

function queryBuilder(DEFAULT, FORMAT, REGEXP, util) {
    /**
     *  constant
     */
    var QUERY_EMPTY = '';
    var QUERY_SEPARATOR = ' ';
    var COMMAND_SEPARATOR_REG = /\s*\|\s*/;
    var COMMAND_SEPARATOR = '|';
    var COMMAND_SORT = 'sort';

    var _props = null;
    var _model = null;
    /**
     *  member function
     */
    var _buildQry = function(field, props, model, term, cmds) {
        _props = props;
        _model = model;

        var newQry = [];

        var newTerm = _buildTerms(field, props, term);
        var newCmds = _buildCmds(field, props, cmds);

        newQry.push(newTerm);
        if (newCmds.length > 0) {
            newQry.push(newCmds);
        }

        return newQry.join(COMMAND_SEPARATOR);
    };

    var _buildTerms = function(field, props, term) {

        var newTerm = [];
        newTerm.push(term);

        var filterTerm = _buildFilterTerm(props.filters);
        if (!_.isEmpty(filterTerm)) {
            newTerm.push(filterTerm);
        }

        var fieldTerm = _buildFieldTerm(field);
        if (!_.isEmpty(fieldTerm)) {
            newTerm.push(fieldTerm);
        }
        if (field.color) {
            newTerm.push(_buildFieldTerm(field.color));
        }

        // _props = props;

        return newTerm.join(QUERY_SEPARATOR);
    };

    var _buildFilterTerm = function(filters) {
        if (_.isNil(filters) || (filters.length <= 0)) {
            return QUERY_EMPTY;
        }

        var newTerm = util.getFilterArr(filters);

        return newTerm.join(QUERY_SEPARATOR);
    };

    var _buildFieldTerm = function(field) {
        if (_.isNil(field)) {
            return QUERY_EMPTY;
        }

        var newTerm = '';

        var name = field.name;
        var value = field.value;

        // TODO: 실 데이터로 테스트 필요
        if ((value + '') === null) {
            value = '\'\'';
        }

        if (name === _model.fields._time) {
            return QUERY_EMPTY;
        }

        var useRange = field.useRange;
        var rangeSize = (field.useRange) ? ((field.range) ? field.range.size : 0) : 0;

        if (useRange && _.isNumber(rangeSize) && (rangeSize > 0)) {
            var start = (name + '>=' + value);
            var end = (name + '<' + (value + rangeSize));
            newTerm = [start, end].join(QUERY_SEPARATOR);
        } else {
            newTerm = _buildQryPiece(field, '=');
        }

        return newTerm;
    };

    var _buildCmds = function(field, props, cmds) {

        var sortCmd = _buildSortCmd(field, props.rowOpts);

        if (!_.isEmpty(sortCmd)) {

            if (props.query.indexOf(COMMAND_SORT) > -1) {
                var index = _.findIndex(cmds, function(cmd) {
                    return (cmd.indexOf(COMMAND_SORT) > -1);
                });
                cmds[index] = sortCmd;
            } else {
                cmds.push(sortCmd);
            }
        }

        return cmds.join(COMMAND_SEPARATOR);
    };

    var _buildSortCmd = function(field, rowOpts) {

        var align = rowOpts.align;

        if (_.isNil(field) || _.isNil(align) || _.isEmpty(align)) {
            return QUERY_EMPTY;
        }

        var sign = {
            asc: '+',
            desc: '-'
        }[align || DEFAULT.ALIGN];

        return ('sort ' + sign + field.name);
    };

    var _buildQryPiece = function(field, oper) {

        var name = field.name;
        var type = field.type;
        var value = field.value;

        if (type === 'TIMESTAMP') {
            value = '\'' + util.parseMoment(value).format(FORMAT.UNPARSED) + '\'';
        } else if (type === 'TEXT') {
            value = '\'' + value + '\'';
        }

        return [name, oper, value].join('');
    };
    /**
     *  function
     */
    this.buildQryPiece = function(field, oper) {
        return _buildQryPiece(field, oper);
    };

    this.buildTimeQry = function(field, time, isExclude) {
        var query = '';
        var query1;
        var query2;

        time.start = util.parseMoment(time.start).format(FORMAT.UNPARSED);
        time.end = util.parseMoment(time.end).format(FORMAT.UNPARSED);

        // "curr" (이 시간에)
        if (time.start === time.end) {
            query = field.name + '=' + time.start;
        } else {
            var startOper = ((isExclude) ? '<' : '>=');
            var endOper = ((isExclude) ? '>' : '<=');

            if (time.start) {
                query1 = field.name + startOper + ('\'' + time.start + '\'');
            }
            if (time.end) {
                query2 = field.name + endOper + ('\'' + time.end + '\'');
            }

            // query = _.compact([query1, query2]).join(' AND ');
            query = _.compact([query1, query2]).join(' ');
        }

        return query;
    };
    /**
     *  field: 차트에서 클릭된 포인트
     *  props: pivotProps
     */
    this.buildQryByProps = function(field, props, model) {
        // 클릭된 행 필드 찾기 (추가 정보)
        var selectedRow = _.find(props.rows, function(row) {
            return (row.field.name === field.xAxis.name);
        });
        // 쿼리를 만들기 위한 객체 생성
        field = {
            name: selectedRow.field.name,
            type: selectedRow.field.type,
            value: field.xAxis.value,
            useRange: selectedRow.useRange,
            range: selectedRow.range,
            color: field.color
        };

        var qry = props.query;

        // NOTE: term, command 분할
        // term: 순수한 쿼리
        // command: term 뒤에 파이프('|')로 연결된 명령어
        var splittedQry = qry.split(COMMAND_SEPARATOR_REG);
        var term = '';
        var cmds = [];

        term = _.head(splittedQry);
        if (splittedQry.length >= 2) {
            cmds = _.slice(splittedQry, 1, splittedQry.length);
        }

        // NOTE: 새로운 쿼리 셋 생성
        return _buildQry(field, props, model, term, cmds);
    };

    this.pickSearchCmd = function(query) {
        // 첫번째 search command만 취한다.
        return _.split(query, COMMAND_SEPARATOR)[0].trim();
    };

    this.insertQryPiece = function(qry, qryPiece) {
        var sp = qry.split(COMMAND_SEPARATOR_REG);
        sp[0] = sp[0] + ' ' + qryPiece;
        return sp.join(COMMAND_SEPARATOR);
    };

    return this;
}

module.exports = queryBuilder;
