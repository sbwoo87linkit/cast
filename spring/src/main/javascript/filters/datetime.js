'use strict';
/**
 * 사용방법은 veiws/sample1/sample1.ejs를 참고한다.
 */
var _ = require('lodash');
var moment = require('moment');
/**
*
*/
msec2str.$inject = ['FORMAT'];
function msec2str(FORMAT) {
    return function(millisec, key) {
        var dt = moment(millisec);

        if (!dt.isValid()) {
            return 'Invalid Date';
        }

        key = (key || 'datetime').toUpperCase();
        return dt.format(FORMAT[key]);
    };
}

str2msec.$inject = ['FORMAT'];
function str2msec(FORMAT) {
    return function(dateStr) {
        var dt = moment(dateStr, [FORMAT.UNPARSED, FORMAT.DATETIME], true);

        if (!dt.isValid()) {
            return NaN;
        }

        return dt.valueOf();
    };
}

// all = 1) null, 2) special keyword, 3) unix timestamp
all2moment.$inject = ['REGEXP'];
function all2moment(REGEXP) {
    return function(date) {
        // is null
        if (_.isNil(date)) {
            return date;
        }

        // special keyword (ex) '-15m', 'now', ...)
        if (_.isString(date)) {
            if (date === 'now') {
                return moment();
            }

            var m = REGEXP.TIME_KEYWORD.exec(date);
            if (m) {
                var num = (m[1] === '-') ? (m[2] * -1) : (m[2] * 1);
                var unit = m[3];

                return moment().add(num, unit).startOf(unit);
            }
        }

        // ex) unix timestamp
        return moment(date);
    };
}

all2unparsed.$inject = ['$filter', 'FORMAT'];
function all2unparsed($filter, FORMAT) {
    var all2moment = $filter('all2moment');

    return function (date) {
        if (_.isNil(date)) {
            return date;
        }
        return all2moment(date).format(FORMAT.UNPARSED);
    };
}

timerange2text.$inject = ['MESSAGE', 'FORMAT'];
function timerange2text(MESSAGE, FORMAT) {
    return function(startMs, endMs) {
        if (_.isNil(startMs) && _.isNil(endMs)) {
            return MESSAGE['datetime_picker.all_time'];
        }

        var startDate = moment(startMs).format(FORMAT.DATETIME);
        var endDate = moment(endMs).format(FORMAT.DATETIME);

        if (_.isNil(startMs)) {
            return [endDate, MESSAGE['time_range.before']].join(' ');
        }
        if (_.isNil(endMs)) {
            return [startDate, MESSAGE['time_range.after']].join(' ');
        }
        return [startDate, '~', endDate].join(' ');
    };
}

fromByTUnit.$inject = ['MESSAGE'];
function fromByTUnit(MESSAGE) {
    return function(unit, suffix) {
        if (unit === 'now') {
            return MESSAGE['datetime_picker.now'];
        }

        // suffix=true 일 경우 suffix 제외 (ex) 15분 전 -> 15분)
        if (suffix) {
            return {
                's': MESSAGE['seconds'],
                'm': MESSAGE['minutes'],
                'h': MESSAGE['hours'],
                'd': MESSAGE['days'],
                'w': MESSAGE['weeks'],
                'M': MESSAGE['months'],
                'Q': MESSAGE['quarters'],
                'y': MESSAGE['years']
            }[unit];
        }
        else {
            return {
                's': MESSAGE['datetime_picker.seconds_ago'],
                'm': MESSAGE['datetime_picker.minutes_ago'],
                'h': MESSAGE['datetime_picker.hours_ago'],
                'd': MESSAGE['datetime_picker.days_ago'],
                'w': MESSAGE['datetime_picker.weeks_ago'],
                'M': MESSAGE['datetime_picker.months_ago'],
                'Q': MESSAGE['datetime_picker.quarters_ago'],
                'y': MESSAGE['datetime_picker.years_ago']
            }[unit];
        }
    };
}

keyword2text.$inject = ['$filter', 'MESSAGE', 'REGEXP'];
function keyword2text($filter, MESSAGE, REGEXP) {
    var fromByTUnit = $filter('fromByTUnit');

    return function (keyword, suffix) {
        if (keyword === 'now') {
            return MESSAGE['datetime_picker.now'];
        }

        var result = REGEXP.TIME_KEYWORD.exec(keyword);
        if (!result) {
            return 'Invalid Keyword';
        }

        var num = +result[2];
        var unit = result[3];

        return (num + ' ' + fromByTUnit(unit, suffix));
    };
}

keyrange2text.$inject = ['$filter', 'MESSAGE'];
function keyrange2text($filter, MESSAGE) {
    var keyword2text = $filter('keyword2text');

    return function(startStr, endStr) {
        if (!startStr && !endStr) {
            return MESSAGE['datetime_picker.all_time'];
        }
        if (startStr === 'now' && endStr === 'now') {
            return MESSAGE['datetime_picker.now'];
        }
        if (endStr[0] === '0' && startStr[0] === '0') {
            return MESSAGE['datetime_picker.now'];
        }

        // 오늘
        if (endStr === 'now' && startStr === '0d') {
            return MESSAGE['datetime_picker.today'];
        }
        // 어제
        if (endStr === '0d' && startStr === '-1d') {
            return MESSAGE['datetime_picker.yesterday'];
        }
        // ex) 이번 주
        if (endStr === 'now' && startStr[0] === '0') {
            return MESSAGE['datetime_picker.this_' + ({
                w: 'week',
                M: 'month',
                Q: 'quarter',
                y: 'year'
            }[startStr.substring(1, 2)])];
        }
        // ex) 이전 년도
        if (endStr[0] === '0' && startStr.substring(0, 2) === '-1') {
            return MESSAGE['datetime_picker.prev_' + ({
                w: 'week',
                M: 'month',
                Q: 'quarter',
                y: 'year'
            }[startStr.substring(2, 3)])];
        }
        // ex) '최근 15 분'
        if (endStr === 'now') {
            return [
                MESSAGE['datetime_picker.last'],
                keyword2text(startStr, true)
            ].join(' ');
        }

        // ex) '15 분 전 ~ 10 분 전'
        return [
            keyword2text(startStr),
            '~',
            keyword2text(endStr)
        ].join(' ');
    };
}

allrange2text.$inject = ['$filter', 'REGEXP'];
function allrange2text($filter, REGEXP) {
    var str2msec = $filter('str2msec');
    var keyrange2text = $filter('keyrange2text');
    var timerange2text = $filter('timerange2text');

    return function(start, end) {
        // special keyword
        if (REGEXP.TIME_KEYWORD.test(start) || REGEXP.TIME_KEYWORD.test(end)) {
            return keyrange2text(start, end);
        }
        // null or UNPARSED
        else if (_.isString(start) || _.isString(end)) {
            start = (start) ? str2msec(start) : start;
            end = (end) ? str2msec(end) : end;
            return timerange2text(start, end);
        }
        // null or unix timestamp
        else {
            return timerange2text(start, end);
        }
    };
}

/**
*   exports
*/
module.exports = {
    msec2str: msec2str,
    str2msec: str2msec,

    all2moment: all2moment,
    all2unparsed: all2unparsed,

    fromByTUnit: fromByTUnit,
    timerange2text: timerange2text,
    keyword2text: keyword2text,
    keyrange2text: keyrange2text,
    allrange2text: allrange2text
};
