'use strict';
/**
*
*/
var is = require('is_js');
var moment = require('moment');
/**
*
*/
datetimePicker.$inject = ['$filter', '$timeout', 'MESSAGE', 'FORMAT', 'REGEXP'];
function datetimePicker($filter, $timeout, MESSAGE, FORMAT, REGEXP) {
    /**
    *   angular filters
    */
    var msec2str = $filter('msec2str');
    var str2msec = $filter('str2msec');
    var all2moment = $filter('all2moment');
    /**
    *   directive link
    */
    function link(scope, element, attrs) {
        /**
        *   methods
        */
        var changeDatetime = function () {
            scope.changeDatetime({
                start: scope.start,
                end: scope.end,
            });

            clearRelError();
            clearDateError();
        };
        var initValues = function () {
            scope.start = null;
            scope.end = null;

            initRelValues();
            initDateValues();
        };
        /**
        *   미리 설정
        */
        // 전체 시간
        scope.applyInit = function (slient) {
            initValues();
            if (!slient) {
                changeDatetime();
            }
        };
        // 프리셋
        scope.applyPreset = function (presetWord, slient) {
            var start = null;
            var end = null;

            switch (presetWord) {
                case 'today':
                    end = 'now';
                    start = '0d';
                    break;
                case 'yesterday':
                    end = '0d';
                    start = '-1d';
                    break;
                case 'this_week':
                    end = 'now';
                    start = '0w';
                    break;
                case 'prev_week':
                    end = '0w';
                    start = '-1w';
                    break;
                case 'this_month':
                    end = 'now';
                    start = '0M';
                    break;
                case 'prev_month':
                    end = '0M';
                    start = '-1M';
                    break;
                case 'this_quarter':
                    end = 'now';
                    start = '0Q';
                    break;
                case 'prev_quarter':
                    end = '0Q';
                    start = '-1Q';
                    break;
                case 'this_year':
                    end = 'now';
                    start = '0y';
                    break;
                case 'prev_year':
                    end = '0y';
                    start = '-1y';
                    break;
                default:
                    end = 'now';
                    start = presetWord;
                    break;
            }

            scope.start = start;
            scope.end = end;

            setDatepicker(scope.start, scope.end);

            if (!slient) {
                changeDatetime();
            }
        };
        /**
        *   상대
        */
        // input text
        scope.relval = {
            start: '0',
            end: '0'
        };
        scope.isNowInSelect = true;

        // Select Box
        scope.relStart = {};
        scope.relStartOptions = [
            { text: MESSAGE['datetime_picker.seconds_ago'], value: 's', isSelected: true },
            { text: MESSAGE['datetime_picker.minutes_ago'], value: 'm' },
            { text: MESSAGE['datetime_picker.hours_ago'], value: 'h' },
            { text: MESSAGE['datetime_picker.days_ago'], value: 'd' },
            { text: MESSAGE['datetime_picker.weeks_ago'], value: 'w' },
            { text: MESSAGE['datetime_picker.months_ago'], value: 'M' },
            { text: MESSAGE['datetime_picker.quarters_ago'], value: 'Q' },
            { text: MESSAGE['datetime_picker.years_ago'], value: 'y' }
            // { text: MESSAGE['datetime_picker.now'], value: 'now' }
        ];
        scope.relEnd = {};
        scope.relEndOptions = [
            { text: MESSAGE['datetime_picker.seconds_ago'], value: 's' },
            { text: MESSAGE['datetime_picker.minutes_ago'], value: 'm' },
            { text: MESSAGE['datetime_picker.hours_ago'], value: 'h' },
            { text: MESSAGE['datetime_picker.days_ago'], value: 'd' },
            { text: MESSAGE['datetime_picker.weeks_ago'], value: 'w' },
            { text: MESSAGE['datetime_picker.months_ago'], value: 'M' },
            { text: MESSAGE['datetime_picker.quarters_ago'], value: 'Q' },
            { text: MESSAGE['datetime_picker.years_ago'], value: 'y' },
            { text: MESSAGE['datetime_picker.now'], value: 'now', isSelected: true }
        ];

        // error text
        scope.isRelError = false;
        scope.relErrMsg = '';

        var initRelValues = function () {
            scope.relval.start = '0';
            scope.relval.end = '0';

            scope.relStart = { value: 's' };
            scope.relEnd = { value: 'now' };

            clearRelError();
        };
        var clearRelError = function () {
            scope.isRelError = false;
            scope.relErrMsg = '';
        };

        var setRelStart = function (keyword) {
            var num = 0;
            var unit = 'now';

            if (keyword !== 'now') {
                var mg = REGEXP.TIME_KEYWORD.exec(keyword);
                num = mg[2];
                unit = mg[3];
            }
            scope.relval.start = num;
            scope.relStart = { value: unit };
        };
        var setRelEnd = function (keyword) {
            var num = 0;
            var unit = 'now';

            if (keyword !== 'now') {
                var mg = REGEXP.TIME_KEYWORD.exec(keyword);
                num = mg[2];
                unit = mg[3];
            }
            scope.relval.end = num;
            scope.relEnd = { value: unit };
        };

        // datepicker 유효성 검사
        var isInvalidRel = function(startNum, endNum, startDT, endDT) {
            if (!(startNum + '').trim() || !(endNum + '').trim()) {
                scope.relErrMsg = MESSAGE['datetime_picker.error.empty_value'];
                return true;
            }
            if (_.isNaN(+startNum)) {
                scope.relErrMsg = MESSAGE['datetime_picker.error.not_number_start'];
                return true;
            }
            if (_.isNaN(+endNum)) {
                scope.relErrMsg = MESSAGE['datetime_picker.error.not_number_end'];
                return true;
            }
            if (endDT.isBefore(startDT)) { // end < start
                scope.relErrMsg = MESSAGE['datetime_picker.error.is_before_date'];
                return true;
            }
            return false;
        };

        var convDate = function (num, unit) {
            var dt = moment();
            if (num && unit !== 'now') {
                // NOTE: ~전 이므로 subtract 연산. (ex) 10 분 전)
                dt = dt.subtract(+num, unit).startOf(unit);
            }

            return dt;
        };
        scope.choosedDate = function (num, unit) {
            var dt = convDate(num, unit);
            if (!dt) {
                return '';
            }
            return dt.format(FORMAT.DATETIME);
        };
        // scope.changeRelStart = function (model) {};
        scope.changeRelEnd = function (model) {
            scope.isNowInSelect = (model.value === 'now');
        };
        scope.applyRelative = function (slient) {
            var numStart = scope.relval.start;
            var numEnd = scope.relval.end;
            var unitStart = scope.relStart.value;
            var unitEnd = scope.relEnd.value;

            var dtStart = convDate(numStart, unitStart);
            var dtEnd = convDate(numEnd, unitEnd);

            if (isInvalidRel(numStart, numEnd, dtStart, dtEnd)) {
                scope.isRelError = true;
                return;
            }

            // clear error
            scope.isRelError = false;
            scope.relErrMsg = '';

            // set (relative) special keyword
            // NOTE: ~전 이므로 '-' 기호를 붙인다. (ex) 10 분 전)
            scope.start = ('-' + numStart + unitStart);
            scope.end = (unitEnd === 'now') ? 'now' : ('-' + numEnd + unitEnd);

            setDatepicker(scope.start, scope.end);

            if (!slient) {
                changeDatetime();
            }
        };
        /**
        *   날짜 및 시간 범위
        */
        // Select Box
        scope.rangeDate = {};
        scope.rangeOptions = [
            { text: MESSAGE['time_range.between'], value: 'between', isSelected: true },
            { text: MESSAGE['time_range.before'], value: 'before' },
            { text: MESSAGE['time_range.after'], value: 'after' }
        ];

        // DatePicker
        scope.datetime = {
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: ''
        };

        // error text
        scope.isDateError = false;
        scope.dateErrMsg = '';

        // Datepicker Option
        scope.settings = {
            dateFormat: 'yy/mm/dd',
            // changeMonth: true,
            // changeYear: true
            // showOtherMonths: true,
            // selectOtherMonths: true,
            // minDate: -20,
            // maxDate: '+1M +10D'
        };

        var initDateValues = function () {
            scope.rangeDate = { value: 'between' };

            scope.datetime.startDate = '';
            scope.datetime.startTime = '';
            scope.datetime.endDate = '';
            scope.datetime.endTime = '';

            clearDateError();
        };
        var clearDateError = function () {
            scope.isDateError = false;
            scope.dateErrMsg = '';
        };

        // datepicker 유효성 검사
        // TODO : 유효성 체크부분 나중에 개선 필요
        var isInvalidDate = function(startDate, startTime, endDate, endTime, rangeOpt) {
            var dateFormat = FORMAT.DATE;
            var timeFormat = FORMAT.TIME;

            if (rangeOpt === 'between' || rangeOpt === 'after') {
                if (is.empty(startDate)) {
                    scope.dateErrMsg = MESSAGE['datetime_picker.error.empty_start'];
                    return true;
                }

                if (!moment(startDate, dateFormat, true).isValid()) {
                    scope.dateErrMsg = MESSAGE['datetime_picker.error.invalid_start_date'] + ' ex) 2016/01/01';
                    return true;
                }

                if (!moment(startTime, timeFormat, true).isValid()) {
                    scope.dateErrMsg = MESSAGE['datetime_picker.error.invalid_state_time'] + ' ex) 00:00:00 ~ 23:59:59';
                    return true;
                }
            }

            if (rangeOpt === 'between' || rangeOpt === 'before') {
                if (is.empty(endDate)) {
                    scope.dateErrMsg = MESSAGE['datetime_picker.error.empty_end'];
                    return true;
                }

                if (!moment(endDate, dateFormat, true).isValid()) {
                    scope.dateErrMsg = MESSAGE['datetime_picker.error.invalid_end_date'] + ' ex) 2016/01/01';
                    return true;
                }

                if (!moment(endTime, timeFormat, true).isValid()) {
                    scope.dateErrMsg = MESSAGE['datetime_picker.error.invalid_end_time'] + ' ex) 00:00:00 ~ 23:59:59';
                    return true;
                }
            }

            if (rangeOpt === 'between') {
                var startDateStr = [startDate, startTime].join(' ');
                var endDateStr = [endDate, endTime].join(' ');
                var fullDateFormat = FORMAT.DATETIME;
                var startDT = moment(startDateStr, fullDateFormat);
                var endDT = moment(endDateStr, fullDateFormat);

                if (endDT.isBefore(startDT)) { // end < start
                    scope.dateErrMsg = MESSAGE['datetime_picker.error.is_before_date'];
                    return true;
                }
            }

            return false;
        };

        // unix timestamp(number) -> datepicker(text)
        var setDatepicker = function(startMs, endMs) {
            if (_.isString(startMs)) {
                setRelStart(startMs);
                startMs = all2moment(startMs).valueOf();
            }
            if (_.isString(endMs)) {
                setRelEnd(endMs);
                endMs = all2moment(endMs).valueOf();
            }

            var startDate = (_.isNumber(startMs)) ? msec2str(startMs, 'date') : startMs;
            var startTime = (_.isNumber(startMs)) ? msec2str(startMs, 'time') : startMs;
            var endDate = (_.isNumber(endMs)) ? msec2str(endMs, 'date') : endMs;
            var endTime = (_.isNumber(endMs)) ? msec2str(endMs, 'time') : endMs;

            // change inputbox value
            scope.datetime.startDate = startDate;
            scope.datetime.startTime = (startTime === '00:00:00') ? '': startTime;
            scope.datetime.endDate = endDate;
            scope.datetime.endTime = (endTime === '00:00:00') ? '': endTime;

            // change selectbox value
            if (is.null(startMs) && is.not.null(endMs)) {
                scope.rangeDate = { value: 'before' };
            }
            else if (is.not.null(startMs) && is.null(endMs)) {
                scope.rangeDate = { value: 'after' };
            }
            else {
                scope.rangeDate = { value: 'between' };
            }
        };

        scope.applyCustom = function (slient) {
            scope.isDateError = false;

            var startDate = scope.datetime.startDate;
            var startTime = scope.datetime.startTime || '00:00:00';
            var endDate = scope.datetime.endDate;
            var endTime = scope.datetime.endTime || '00:00:00';
            var rangeOpt = scope.rangeDate.value;

            if (isInvalidDate(startDate, startTime, endDate, endTime, rangeOpt)) {
                scope.isDateError = true;
                return;
            }
            // clear error
            scope.isDateError = false;
            scope.dateErrMsg = '';

            var startFullDate = [startDate, startTime].join(' ');
            var endFullDate = [endDate, endTime].join(' ');

            var startMs = (startFullDate) ? str2msec(startFullDate) : startFullDate;
            var endMs = (endFullDate) ? str2msec(endFullDate) : endFullDate;

            var dateObj = {
                between: {
                    start: startMs,
                    end: endMs
                },
                before: {
                    start: null,
                    end: endMs
                },
                after: {
                    start: startMs,
                    end: null
                }
            }[rangeOpt];

            scope.start = dateObj.start;
            scope.end = dateObj.end;

            setDatepicker(scope.start, scope.end);

            if (!slient) {
                changeDatetime();
            }
        };
        /**
        *   events
        */
        scope.$watch('start', function (start) {
            if (start === undefined) {
                return;
            }
            setDatepicker(start, scope.end);
        });
        scope.$watch('end', function (end) {
            if (end === undefined) {
                return;
            }
            setDatepicker(scope.start, end);
        });

        // 외부에서 apply를 강제로 명령
        scope.$on(attrs.name + '.set', function (evt, start, end, preset, slient) {
            if (preset) {
                scope.applyPreset(preset, slient);
            }
            else if (start || end) {
                setDatepicker(start, end);

                // unix timestamp
                if (_.isNumber(start) || _.isNumber(end)) {
                    scope.applyCustom(slient);
                }
                // special keyword
                else {
                    scope.applyRelative(slient);
                }
            }
            else {
                scope.applyInit(slient); // 전체 시간
            }
        });

        // NOTE: 사용되지 않아 주석 처리
        // if (attrs.initKeyword) {
        //     scope.applyPreset(attrs.initKeyword);
        // }
    }

    return {
        restrict: 'EA',
        templateUrl: '/views/directives/datetime.html',
        scope: {
            // name: '@',
            start: '=',
            end: '=',
            changeDatetime: '&',
            // initKeyword: '@?'
        },
        link: link
    };
}

module.exports = datetimePicker;
