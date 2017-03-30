'use strict';
/**
 *
 */
var moment = require('moment');
var path = require('path');
/**
 *
 */
util.$inject = ['$filter', '$location', 'LOCALE', 'MESSAGE', 'DEFAULT', 'FORMAT', 'REGEXP', 'CHART'];
function util($filter, $location, LOCALE, MESSAGE, DEFAULT, FORMAT, REGEXP, CHART) {
    return {
        /**
         *   return boolean
         */
        hasSpecialChar: function(str) {
            var reg = /[~!@\#$%^&*\()\-=+_']/gi;
            return reg.test(str);
        },

        isValidScope: function(value, start, end) {
            if (start && !end) {
                return (value >= start);
            } else {
                return ((value >= start) && (value <= end));
            }
        },

        isNumber: function(value) {
            var reg = /^[-|+]?\d+$/;
            return reg.test(value);
        },

        isNumberPositive: function(value) {
            var reg = /^\d+$/;
            return reg.test(value);
        },

        isDoublePositive: function(value) {
            var reg = /^\d+\.?\d*$/;
            return reg.test(value);
        },

        isRelativeTime: function(value) {
            if (!value || !_.isString(value)) {
                return false;
            }
            return REGEXP.TIME_KEYWORD.test(value);
        },

        isTimeField: function(field) {
            if (!field) {
                return false;
            }
            return (field.type === 'TIMESTAMP');
        },
        /**
         *   convert
         */
        convTimeUnit: function(timeUnit) {
            // convert Angora time unit to moment duration shorthand
            // http://momentjs.com/docs/#/durations/creating/
            return {
                'y': 'y', // years
                'm': 'M', // months
                'd': 'd', // days
                'H': 'h', // hours
                'M': 'm', // minutes
                'S': 's' // seconds
            }[timeUnit || 'h'];
        },
        /**
         *   etc
         */
        pickValueFromName: function(fieldName) {
            // check separator
            var separator = '_';
            if (_.isEmpty(fieldName) || fieldName[0] !== separator) {
                return fieldName;
            }

            var value = _.last(fieldName.split(separator));

            return value;
        },

        getTimeUnit: function(start, end) {
            var timeUnit = DEFAULT.TIME_UNIT;

            if (!start || !end) {
                return timeUnit;
            }

            start = this.parseMoment(start);
            end = this.parseMoment(end);

            // 시간 간격 계산
            var timeDiffs = this.getTimeDiffs(start, end);
            if (timeDiffs.m <= 10) {
                timeUnit = '1S';
            } else if (timeDiffs.h <= 12) {
                timeUnit = '1M';
            } else if (timeDiffs.d <= 7) {
                timeUnit = '10M';
            } else if (timeDiffs.M <= 1) {
                timeUnit = '1H';
            } else {
                timeUnit = '1m';
            }

            return timeUnit;
        },

        getMatchFilter: function(item) {
            var fieldName = item.field.name;
            var fieldType = item.field.type;

            var operator = item.match.operator;
            var value = item.match.value;

            switch (operator) {
                case 'isNull':
                    operator = 'IS NULL';
                    break;
                case 'isNotNull':
                    operator = 'IS NOT NULL';
                    break;
                case 'contains':
                    operator = 'LIKE';
                    value = '%' + value + '%';
                    break;
                case 'doesNotContain':
                    operator = 'NOT LIKE';
                    value = '%' + value + '%';
                    break;
                case 'startsWith':
                    operator = 'LIKE';
                    value = '%' + value;
                    break;
                case 'endsWith':
                    operator = 'LIKE';
                    value = value + '%';
                    break;
            }

            if (operator.indexOf('NULL') !== -1) {
                return [fieldName, operator].join(' ');
            }

            if (fieldType === 'TEXT') {
                value = '\'' + value + '\'';
            }

            return [fieldName, operator, value].join(' ');
        },

        getBetweenFilter: function(item) {
            var fieldName = item.field.name;
            var fieldType = item.field.type;

            var bet = item.between;
            var startOper = {
                '<=': '>=',
                '<': '>'
            }[bet.startOper];

            var startValue = ((fieldType === 'TEXT') ? ('\'' + bet.startValue + '\'') : bet.startValue);
            var endValue = ((fieldType === 'TEXT') ? ('\'' + bet.endValue + '\'') : bet.endValue);

            var startFilter = [fieldName, startOper, startValue].join(' ');
            var endFilter = [fieldName, bet.endOper, endValue].join(' ');

            return [startFilter, endFilter];
        },

        getFilterArr: function (arr) {
            var matches = _.filter(arr, { 'type': 'match' });
            var betweens = _.filter(arr, { 'type': 'between' });

            var matcheFilter = _.map(matches, this.getMatchFilter);
            var betweenFilter = [];
            var betweenFunc = this.getBetweenFilter;
            _.forEach(betweens, function(item) {
                betweenFilter = _.concat(betweenFilter, betweenFunc(item));
            });

            return _.concat(matcheFilter, betweenFilter);
        },

        getTimeRangeByTimeUnit: function(date, timeUnit) {
            // NOTE: date is moment object
            return {
                start: date.valueOf(),
                end: date.add(1, timeUnit).startOf(timeUnit).valueOf()
            };
        },

        isFunctionKey: function(evt, passKeys) {

            var keyName = evt.key || '';

            // https://www.w3.org/TR/2006/WD-DOM-Level-3-Events-20060413/keyset.html, A.2 Key identifiers set
            var keyNames = [
                'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
                'Escape', 'CapsLock', 'Shift', 'Control', 'Meta', 'Alt',
                'HangulMode', 'ContextMenu', 'HanjaMode',
                'PrintScreen', 'ScrollLock', 'Pause', 'NumLock',
                'Insert', 'Home', 'PageUp',
                'Delete', 'End', 'PageDown'
            ];

            if (_.isArray(passKeys)) {
                keyNames = _.difference(keyNames, passKeys);
            }

            var index = _.findIndex(keyNames, function(name) {
                return (name === keyName);
            });

            return (index > -1);
        },
        // 시간 차트 데이터 및 tick 생성
        getTimeRst: function(rst, timeUnit, timeFieldIndex) {

            var tickPos = [];

            // 시간 필드가 없을 경우 tick 생성 안함
            if (timeFieldIndex > -1) {
                var startTime = this.parseMoment(_.head(rst)[timeFieldIndex]);
                var endTime = this.parseMoment(_.last(rst)[timeFieldIndex]);

                if (startTime.isValid() && endTime.isValid()) {
                    var timeDiffs = this.getTimeDiffs(startTime, endTime);
                    // tick을 CHART.TICK_MAX_COUNT 개를 표시할 경우의 tick을 표시하는 시간 간격
                    var timeInterval = this.getTimeInterval(timeDiffs, CHART.TICK_MAX_COUNT);
                    // tick을 CHART.TICK_MAX_COUNT 개 표시 할 수 있는 시간 단위를 구함
                    timeUnit = this.getTimeUnitByTimeRange(timeInterval, CHART.TICK_MAX_COUNT);
                    // tick 표시에 실제 사용될 시간 간격을 구함(표시 시간 간격 표준화)
                    var tickInterval = this.getTickInterval(timeUnit, timeInterval[timeUnit]);
                    // tick 시작 시간
                    var tickStartTime = this.getTickStartTime(startTime, timeUnit);
                    // highcharts는 존재하는 데이터에 대해서만 tick 표시 가능
                    // 기존 피벗 결과에 tick이 표시될 데이터를 생성
                    rst = this.getResult(rst, _.cloneDeep(tickStartTime), tickInterval, timeUnit, timeFieldIndex);
                    // tick 시작 시간(tickStartTime) 부터 끝 시간 까지 일정한 간격(tickInterval)으로 tick을 생성
                    tickPos = this.getXAxisTickPos(_.cloneDeep(tickStartTime), endTime, tickInterval, timeUnit);
                }
            }

            return {
                timeUnit: timeUnit,
                results: rst,
                tickPos: tickPos
            };
        },
        // 시작시간과 끝시간의 시간 범위를 시간 단위 별로 반환
        getTimeDiffs: function(startTime, endTime) {
            return {
                y: +(endTime.diff(startTime, 'years')),
                M: +(endTime.diff(startTime, 'months')),
                d: +(endTime.diff(startTime, 'days')),
                h: +(endTime.diff(startTime, 'hours')),
                m: +(endTime.diff(startTime, 'minutes')),
                s: +(endTime.diff(startTime, 'seconds'))
            };
        },
        // 해당 시간 간격에 정해진 tick 개수(maxTickCnt)를 표시할때 시간 간격을 반환
        getTimeInterval: function(timeDiffs, maxTickCnt) {
            return {
                y: Math.round(timeDiffs.y / maxTickCnt),
                M: Math.round(timeDiffs.M / maxTickCnt),
                d: Math.round(timeDiffs.d / maxTickCnt),
                h: Math.round(timeDiffs.h / maxTickCnt),
                m: Math.round(timeDiffs.m / maxTickCnt),
                s: Math.round(timeDiffs.s / maxTickCnt)
            };
        },
        // tick을 표시하기에 적합한 시간 단위를 반환
        getTimeUnitByTimeRange: function(timeInterval) {
            var timeUnits = [];
            _.forEach(timeInterval, function(val, key) {
                if (0 < val) {
                    timeUnits.push(key);
                }
            });

            if (timeUnits.length === 0) {
                timeUnits.push('d');
            }

            return _.head(timeUnits);
        },
        // 실제로 차트에 tick을 표시하는 시간 간격을 시간 단위에 따라 반환
        getTickInterval: function(timeUnit, timeInterval) {
            timeInterval = Math.round(timeInterval);
            var tickInterval = {
                y: [1, 3, 5, 7, 9, 11],
                M: [1, 4, 7, 10],
                d: [1, 7, 14, 21, 28],
                h: [1, 6, 12, 18, 24],
                m: [1, 15, 30, 45, 60],
                s: [1, 15, 30, 45, 60]
            }[timeUnit || 'h'];
            return _.head(_.filter(tickInterval, function(t) {
                return (t >= timeInterval);
            }));
        },
        // 시간 단위별 tick 시작 시간을 반환
        getTickStartTime: function(startTime, timeUnit, tickInterval) {
            if (tickInterval === 1) {
                return startTime;
            }

            var val = startTime.get(timeUnit);
            var startVal = tickInterval;
            while (startVal >= val) {
                startVal = (startVal * startVal);
            }

            startTime.set(timeUnit, startVal);
            return startTime;
        },
        // tick을 표시할 데이터가 생성된 피벗 결과를 반환
        getResult: function(results, tickStartTime, tickInterval, timeUnit, timeFieldIndex) {
            var newResult = [];
            // 시작 시간 지정
            var curResult = tickStartTime;
            var lastResult = this.parseMoment(_.last(results)[timeFieldIndex]);

            var curUTC = curResult.valueOf();
            var lastUTC = lastResult.valueOf();

            // 시작시간 부터 일정한 간격(tickInterval) 으로 tick을 표시할 데이터를 생성
            var newItem = _.fill(_.cloneDeep(_.head(results)), 0);
            while (curUTC <= lastUTC) {
                newItem[0] = curUTC;
                newResult.push(newItem);

                curResult = curResult.add(tickInterval, timeUnit);
                curUTC = curResult.valueOf();
            }
            // 기존 데이터와 합침
            newResult = _
                .chain(results)
                .unionWith(newResult, function(obj1, obj2) {
                    return obj1[timeFieldIndex] === obj2[timeFieldIndex];
                })
                .sortBy(function(o) {
                    return o[timeFieldIndex];
                })
                .value();
            return newResult;
        },
        // 차트에 표시할 tick의 위치를 반환
        getXAxisTickPos: function(tickStartTime, endTime, tickInterval, timeUnit) {
            var tickPositions = [];

            var curTime = tickStartTime;
            var curUTC = 0;
            var endUTC = endTime.valueOf();

            // 초기 시간 설정
            curUTC = curTime.valueOf();
            // tick 위치 생성
            while (curUTC <= endUTC) {
                tickPositions.push(curUTC);
                curTime = curTime.add(tickInterval, timeUnit);
                curUTC = curTime.valueOf();
            }
            return tickPositions;
        },

        getTimeFieldIndex: function(fields) {
            return _.findIndex(fields, function(field) {
                return (field.type === 'TIMESTAMP');
            });
        },

        isDisplayFullDate: function(timeUnit) {
            if (!timeUnit) {
                return false;
            }
            return (timeUnit !== 'y');
        },

        getNewUrl: function(jobType, paramStr) {
            jobType = (jobType || 'search');
            var protocol = $location.protocol();
            var port = $location.port();
            var host = $location.host();
            return [protocol, '://', host, ':', port, '/#!/', jobType, '?', paramStr].join('');
        },

        parseMoment: function(val, format) {
            var date = {};

            if (_.isString(val)) {
                if (format) {
                    date = moment(val, format);
                } else {
                    date = moment(val, FORMAT.UNPARSED);
                }
            } else {
                date = moment(val);
            }

            return date;
        },

        parseColumnText: function (text) {
            var SEPARATOR = '_';
            // ex) 'date_group(FTS_PARTITION_TIME,'1H')'
            var IGNORE_CASE = /\S+\(\S+\,\S+\)/;
            // ex) 'COL_NAME_count(*)'
            var REG_BOTH = /\S+_\S+\(\S+\)/; // not capture
            // ex) 'sum(HR)'
            var REG_FUNC_COL = /(\S+)\((\S+)\)/;

            // is nil
            if (!text) {
                return null;
            }
            // TODO: 임시 조치. 명확한 parse가 가능해지면 수정
            if (IGNORE_CASE.test(text)) {
                return null;
            }

            var valueInCol = null;
            var funcCol = null;
            var isBoth = REG_BOTH.test(text);

            // valueInCol_function(col)
            if (isBoth) {
                var sp = text.split(SEPARATOR);

                valueInCol = sp.shift();
                funcCol = sp.join(SEPARATOR);
            }
            // valueInCol or function(fCol)
            else {
                if (REG_FUNC_COL.test(text)) {
                    funcCol = text;
                }
                else {
                    valueInCol = text;
                }
            }

            // convert valueInCol, function, column
            if (valueInCol && !_.isNaN(+valueInCol)) {
                valueInCol = $filter('autoFixed')(+valueInCol) + '';
            }

            return {
                isBoth: isBoth,
                valueInCol: valueInCol,
                funcCol: funcCol
            };
        },

        getTimeInfo: function(unit) {
            return {
                val: parseInt(unit),
                unit: this.convTimeUnit(_.last(unit))
            };
        },

        // 제목 (2), 제목 (3) ...
        getCopyTitle: function(list, titleKey, title) {
            var copyCount = 2;
            var copyTitle = '';

            do {
                copyTitle = [title, ' (', copyCount++, ')'].join('');
            } while (_.some(list, [titleKey, copyTitle]));

            return copyTitle;
        },

        getFileFormat: function(pathStr) {
            return path.extname(pathStr).replace('.', '');
        },

        getExpiresDate: function() {
            var expiresDate = new Date();
            // add 10 years
            expiresDate.setFullYear(expiresDate.getFullYear() + 10);
            return expiresDate;
        }
    };
}

module.exports = util;
