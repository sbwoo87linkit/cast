'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
var _ = require('lodash');
var moment = require('moment');
var async = require('async');
/**
 *
 */
searchAgent.$inject = ['$rootScope', '$http', '$q', '$log', '$filter', '$window', 'DEFAULT', 'util'];
function searchAgent($rootScope, $http, $q, $log, $filter, $window, DEFAULT, util) {
    // 검색 요청 params
    var _params = {};
    var _modelInfo = null;

    // 검색, 검색중지 상태
    var isActive = false;
    var isAbort = false;

    // 이벤트 그리드 상태
    var _event = {};

    // 매칭카운트 상태
    var _timeline = {};

    // 필드 통계 상태
    var _stats = {};

    // 통계, 시각화 상태
    var _figures = {};

    // 검색 URI
    var URI = {
        event: '/search/iris-search/jobs',
        timeline: '/search/iris-timeline/jobs',
        stats: '/search/iris-stats/jobs',
        statsDetail: '/search/iris-stats-details/[FIELD]/jobs',
        figures: '/search/iris-figures/jobs'
    };

    // 검색 데이터 초기화
    var initStates = function() {
        _event = {
            sid: null,
            isEnd: false,
            current: 0,
            total: 0
        };

        _timeline = {
            sid: null,
            isEnd: false,
            current: 0,
            total: 0
        };

        _stats = {
            sid: null,
            isEnd: false,
            current: 0,
            total: 0
        };

        _figures = {
            sid: null,
            isEnd: false,
            current: 0,
            total: 0
        };
    };

    /**
     * request 관리
     */
    var _request = [];

    var createRequest = function() {
        var request = {
            id: uuidV1(),
            defer: $q.defer()
        };
        _request.push(request);
        return request;
    };

    var removeRequest = function(id) {
        _request = _.remove(_request, function(reuqest) {
            return (reuqest.id !== id);
        });
    };

    var cancelAllRequest = function() {
        _.forEach(_request, function(reuqest) {
            reuqest.defer.resolve();
        });

        _request = [];
    };

    // 프로그레스바 상태 변경
    var checkEndRequest = function() {
        var isAllEnd = (_event.isEnd && _timeline.isEnd && _stats.isEnd && _figures.isEnd);

        var total = 1;
        var eventCurrent = (_event.total === 0) ? 0 : (_event.current / _event.total / 4);
        var timelineCurrent = (_timeline.total === 0) ? 0 : (_timeline.current / _timeline.total / 4);
        var statsCurrent = (_stats.total === 0) ? 0 : (_stats.current / _stats.total / 4);
        var figuresCurrent = (_figures.total === 0) ? 0 : (_figures.current / _figures.total / 4);
        var current = eventCurrent + timelineCurrent + statsCurrent + figuresCurrent;

        if (isActive) {
            $rootScope.$broadcast('search.state', isAllEnd, current, total);
        }

        if (isAllEnd) {
            isActive = false;
            $rootScope.$broadcast('search.finish');
        }
    };
    /**
    *
    */
    var convFNameAll = function(fields) {
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            field._name = field.name;
            field.name = $filter('columnText')(field.name);
        }
        return fields;
    };
    var convFTypeAll = function (fields) {
        var map = _modelInfo.fields.map;
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (map[field.name]) {
                _.assign(field, map[field.name]);
            }
            else {
                field.type = $filter('convType')(field.type);
            }
        }
        return fields;
    };
    var fixNumberAll = function (data, x) {
        _.forEach(data.results, function (row) {
            _.forEach(data.fields, function (field, i) {
                if (field.type === 'NUMBER' && _.isNumber(row[i])) {
                    row[i] = $filter('autoFixed')(row[i], x);
                }
            });
        });
        return data;
    };
    var fixTimestamp = function (data) {
        var fields = data.fields;
        var timestampIndexes = [];
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            if (field.type === 'TIMESTAMP') {
                timestampIndexes.push(i);
            }
        }

        if (timestampIndexes.length) {
            var results = data.results;
            _.forEach(results, function(row) {
                _.forEach(timestampIndexes, function(fieldIndex) {
                    if (row[fieldIndex]) {
                        var fieldOpt = fields[fieldIndex].option;
                        if (fieldOpt && fieldOpt.format) {
                            row[fieldIndex] = moment(row[fieldIndex], fieldOpt.format).valueOf();
                        }
                        else {
                            row[fieldIndex] = $filter('str2msec')(row[fieldIndex]);
                        }
                    }
                });
            });
        }
        return data;
    };

    /**
     * 다운로드
     */
    var getDownloadSid = function(params, successCallback, errorCallback) {
        var body = _.cloneDeep(params);

        var request = createRequest();

        $http.post(URI.event, body, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);
                var sid = res.data.sid;

                successCallback(sid);
            }, function(res) {
                removeRequest(request.id);

                // 페이지 전환시 status 처리
                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Event Download error:', msg);

                if (errorCallback) {
                    errorCallback();
                } else {
                    $rootScope.$broadcast('search.result.error', msg);
                }
            });
    };

    /**
     * 이벤트 그리드
     */
    // sid 요청
    var getEventSid = function(params, callback) {
        var body = _.cloneDeep(params);
        body.size = DEFAULT.SEARCH_MAX_COUNT;

        var request = createRequest();
        $http.post(URI.event, body, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var sid = res.data.sid;

                _event.sid = sid;
                getEvent(sid, callback);
            }, function(res) {
                removeRequest(request.id);

                // 페이지 전환시 status 처리
                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Event SID error:', msg);
                callback(msg);
            });
    };

    // 데이터 요청
    var getEvent = function(sid, callback) {
        if (isAbort || (_event.sid !== sid)) {
            return;
        }

        var uri = [URI.event, sid].join('/');
        var request = createRequest();
        $http.get(uri, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var data = res.data;

                _event.isEnd = data.isEnd;
                _event.current = data.status.current;
                _event.total = data.status.total;
                checkEndRequest();

                // 타입 매핑(축소)
                convFTypeAll(data.fields);
                // 숫자 소수점 자리 조정
                fixNumberAll(data, DEFAULT.TO_FIXED_NUM);
                // 시간 타입 필드 처리
                fixTimestamp(data);

                $rootScope.$broadcast('search.fields', data.fields);
                $rootScope.$broadcast('search.event.data', data);

                if (!data.isEnd) {
                    getEvent(sid, callback);
                } else {
                    _event.sid = null;
                    callback(null, 'event');
                }
            }, function(res) {
                removeRequest(request.id);

                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Get event data error:', msg);
                callback(msg);
            });
    };

    /**
     * 매칭카운트
     */
    // sid 요청
    var getTimelineSid = function(params, callback) {
        var body = _.cloneDeep(params);
        // NOTE: angora API에서 빼기로 했으나, 만약 안된다면, params에 추가
        // body.field = params._time;
        if (params.start_date && params.end_date) {
            body.unit = util.getTimeUnit(params.start_date, params.end_date);
        }

        var request = createRequest();
        $http.post(URI.timeline, body, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var sid = res.data.sid;

                _timeline.sid = sid;
                getTimeLine(sid, body.unit, callback);
            }, function(res) {
                removeRequest(request.id);

                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Timeline SID error:', msg);
                callback(msg);
            });
    };

    // 데이터 요청
    var getTimeLine = function(sid, unit, callback) {
        if (isAbort || (_timeline.sid !== sid)) {
            return;
        }

        var uri = [URI.timeline, sid].join('/');
        var request = createRequest();
        $http.get(uri, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var data = res.data;
                // 시간 단위, 서버보다 UI 계산값을 우선
                var timeUnit = unit || data.unit;

                _timeline.isEnd = data.isEnd;
                _timeline.current = data.status.current;
                _timeline.total = data.status.total;
                checkEndRequest();

                // event count
                $rootScope.$broadcast('search.event.count', data.total_count);

                // NOTE: 시간 필드가 없는 모델에 대한 결과에는 modes가 없다.
                if (data.modes) {
                    var timeFieldName = _.get(_modelInfo, 'fields._time');
                    var selectedFields = _.get(_modelInfo, 'fields.selected');
                    var timeField = _.find(selectedFields, ['name', timeFieldName]);

                    var format = _.get(timeField, 'option.format');
                    if (format) {
                        // model time format -> unix timestamp
                        _.forEach(data.modes, function(mode) {
                            mode.date = moment(mode.date, format, true).valueOf();
                        });
                    }
                    else {
                        // UNPARSED -> unix timestamp
                        _.forEach(data.modes, function(mode) {
                            mode.date = $filter('str2msec')(mode.date);
                        });
                    }

                    $rootScope.$broadcast('search.timeline.data', data.modes, timeUnit);
                }

                if (!data.isEnd) {
                    getTimeLine(sid, timeUnit, callback);
                } else {
                    _timeline.sid = null;
                    callback(null, 'timeline');
                }
            }, function(res) {
                removeRequest(request.id);

                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Get timeLine data error:', msg);
                callback(msg);
            });
    };

    /**
     * 필드 통계
     */
    // sid 요청
    var getStatsSid = function(params, callback) {
        var body = _.cloneDeep(params);

        var request = createRequest();
        $http.post(URI.stats, body, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var sid = res.data.sid;

                _stats.sid = sid;
                getStats(sid, callback);
            }, function(res) {
                removeRequest(request.id);

                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Stats SID error:', msg);
                callback(msg);
            });
    };

    // 데이터 요청
    var getStats = function(sid, callback) {
        if (isAbort || (_stats.sid !== sid)) {
            return;
        }

        var uri = [URI.stats, sid].join('/');
        var request = createRequest();
        $http.get(uri, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var data = res.data;

                _stats.isEnd = data.isEnd;
                _stats.current = data.status.current;
                _stats.total = data.status.total;
                checkEndRequest();

                // 타입 매핑(축소)
                convFTypeAll(data.fields);

                $rootScope.$broadcast('search.stats.data', data);

                if (!data.isEnd) {
                    getStats(sid, callback);
                } else {
                    _stats.sid = null;
                    callback(null, 'stats');
                }
            }, function(res) {
                removeRequest(request.id);

                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Get stats data error:', msg);
                callback(msg);
            });
    };

    /**
     * 통계, 시각화
     */
    // sid 요청
    var getFiguresSid = function(params, callback) {
        var body = _.cloneDeep(params);
        body.size = DEFAULT.PIVOT_MAX_COUNT;

        var request = createRequest();
        $http.post(URI.figures, body, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var sid = res.data.sid;

                _figures.sid = sid;
                getFigures(sid, callback);
            }, function(res) {
                removeRequest(request.id);

                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Figures SID error:', msg);
                callback(msg);
            });
    };

    // 데이터 요청
    var getFigures = function(sid, callback) {
        if (isAbort || (_figures.sid !== sid)) {
            return;
        }

        var uri = [URI.figures, sid].join('/');
        var request = createRequest();
        $http.get(uri, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var data = res.data;

                _figures.isEnd = data.isEnd;
                _figures.current = data.status.current;
                _figures.total = data.status.total;
                checkEndRequest();

                // 이름 필터링
                convFNameAll(data.fields);
                // 타입 매핑(축소)
                convFTypeAll(data.fields);
                // 숫자 소수점 자리 조정
                fixNumberAll(data, DEFAULT.TO_FIXED_NUM);
                // 시간 타입 필드 처리
                fixTimestamp(data);

                $rootScope.$broadcast('search.figures.data', data);

                if (!data.isEnd) {
                    getFigures(sid, callback);
                } else {
                    _figures.sid = null;
                    callback(null, 'figures');
                }
            }, function(res) {
                removeRequest(request.id);

                if (res.status === -1) {
                    return;
                }

                var msg = res.data;
                $log.error('Get figures data error:', msg);
                callback(msg);
            });
    };

    /**
     * 검색 중지
     */
    var abortAll = function(callback) {
        cancelAllRequest();

        isAbort = true;
        isActive = false;

        var abortTask = [];

        if (_event.sid) {
            abortTask.push(function(callback) {
                abortEvent(callback);
            });
        }

        if (_timeline.sid) {
            abortTask.push(function(callback) {
                abortTimeline(callback);
            });
        }

        if (_stats.sid) {
            abortTask.push(function(callback) {
                abortStats(callback);
            });
        }

        if (_figures.sid) {
            abortTask.push(function(callback) {
                abortFigures(callback);
            });
        }

        async.parallel(abortTask, function(error) {
            initStates();

            if (error) {
                $rootScope.$broadcast('search.stop.fail', error);
                return;
            }

            if (callback) {
                callback(error);
            }
        });
    };

    var abortEvent = function(callback) {
        var uri = [URI.event, _event.sid, 'close'].join('/');
        $http.delete(uri)
            .then(function() {
                callback(null, 'event');
            }, function(error) {
                var msg = error.data;
                $log.error('Abort event error:', msg);
                callback(msg);
            });
    };

    var abortTimeline = function(callback) {
        var uri = [URI.timeline, _timeline.sid, 'close'].join('/');
        $http.delete(uri)
            .then(function() {
                callback(null, 'timeline');
            }, function(error) {
                var msg = error.data;
                $log.error('Abort timeline error:', msg);
                callback(msg);
            });
    };

    var abortStats = function(callback) {
        var uri = [URI.stats, _stats.sid, 'close'].join('/');
        $http.delete(uri)
            .then(function() {
                callback(null, 'stats');
            }, function(error) {
                var msg = error.data;
                $log.error('Abort stats error:', msg);
                callback(msg);
            });
    };

    var abortFigures = function(callback) {
        var uri = [URI.figures, _figures.sid, 'close'].join('/');
        $http.delete(uri)
            .then(function() {
                callback(null, 'figures');
            }, function(error) {
                var msg = error.data;
                $log.error('Abort figures error:', msg);
                callback(msg);
            });
    };

    var setParams = function(params, modelInfo) {
        var searchParams = {
            q: params.query,
            datamodel_id: params.modelId
        };

        if (modelInfo.fields._time && params.timeRange) {
            // NOTE: keyword 일 경우 현재 시간을 기준으로 시간을 계산하여 검색한다.
            // timestamp or keyword를 IRIS timestamp(YYYYMMDDHHmmss)로 변환
            if (params.timeRange.start) {
                searchParams.start_date = $filter('all2unparsed')(params.timeRange.start);
            }
            if (params.timeRange.end) {
                searchParams.end_date = $filter('all2unparsed')(params.timeRange.end);
            }
        }

        // ...
        searchParams.job_time = params.jobTime || (moment().valueOf() + '');

        return searchParams;
    };

    /**
     * methods
     */
    this.search = function(params, modelInfo) {
        if (!params.query) {
            $log.error('call search() - empty param(query)', params.query);
            return;
        }
        if (!params.modelId) {
            $log.error('call search() - empty param(modelId)', params.modelId);
            return;
        }

        var searchParams = setParams(params, modelInfo);

        isActive = true;
        isAbort = false;

        // save
        _params = searchParams;
        _modelInfo = modelInfo;

        // 필드 타입 변환을 위한 map 생성
        _modelInfo.fields.map = {};
        _.forEach(_modelInfo.fields.selected, function (field) {
            _modelInfo.fields.map[field.name] = field;
        });

        $rootScope.$broadcast('search.start', searchParams.job_time, searchParams.q);

        initStates();

        async.parallel([
            function(callback) {
                getEventSid(searchParams, callback);
            },
            function(callback) {
                // NOTE: 시간 필드가 없으면 요청하지 말아야하나, total_count를 얻기 위해 요청
                getTimelineSid(searchParams, callback);
            },
            function(callback) {
                getStatsSid(searchParams, callback);
            },
            function(callback) {
                getFiguresSid(searchParams, callback);
            }
        ], function(error) {
            if (error) {
                abortAll(null);
                $rootScope.$broadcast('search.result.error', error);
            }
        });
    };
    this.download = function(params, modelInfo) {
        var searchParams = setParams(params, modelInfo);
        var type = params.type;
        var fileName = params.fileName;

        if (params.isLimited) {
            searchParams.size = params.size;
        }

        getDownloadSid(searchParams, function(sid) {
            var uri = [URI.event, sid, 'download'].join('/');
            var queryStr = [
                'type=' + type,
                'file_name=' + fileName
            ].join('&');

            $window.location = [uri, queryStr].join('?');
        });
    };

    this.export = function(params, modelInfo, successCallback, errorCallback) {
        // export to hdfs
        var query = params.q;
        var dm_id = modelInfo.id;
        var path = params.path;
        var exportParam = {
            q: query,
            datamodel_id: dm_id,
            dataset: {
                format: DEFAULT.HDFS_FILE_FORMAT,
                path: path
            }
        };

        getDownloadSid(exportParam, function(sid) {
            var uri = [URI.event, sid, 'export'].join('/');
            var request = createRequest();
            $http.get(uri, {
                    timeout: request.defer.promise
                })
                .then(function() {
                    removeRequest(request.id);
                    successCallback();
                }, function(error) {
                    removeRequest(request.id);
                    var msg = error.data;
                    $log.error('Export error:', msg);

                    if (error.status === -1) {
                        return;
                    }

                    if (errorCallback) {
                        errorCallback();
                    }
                });
        }, errorCallback);
    };

    this.statsDetail = function (params, modelInfo, fieldName) {
        if (arguments.length === 1) {
            fieldName = params;
            params = null;
        }
        var body = null;
        var uriPost = URI.statsDetail.replace('[FIELD]', fieldName);
        var uriGet = '';
        var uriDel = '';

        var onData = null;
        var onError = null;

        if (params) {
            body = setParams(params, modelInfo);
        }
        else {
            body = _.cloneDeep(_params);
        }

        function getSid (callback) {
            var request = createRequest();
            $http.post(uriPost, body, {
                    timeout: request.defer.promise
                })
                .then(function(res) {
                    removeRequest(request.id);

                    var sid = res.data.sid;

                    callback(null, sid);
                }, function(res) {
                    removeRequest(request.id);

                    if (res.status === -1) {
                        return;
                    }

                    var err = res.data;
                    $log.error('stats_detail SID error:', err);
                    callback(err);
                });
        }
        function fetch () {
            var request = createRequest();
            $http.get(uriGet, {
                    timeout: request.defer.promise
                })
                .then(function(res) {
                    removeRequest(request.id);

                    var data = res.data;

                    // 형 변환 / 정렬
                    data.modes = _.orderBy(data.modes, 'count', 'desc');

                    if (onData) {
                        onData(data);
                    }

                    // continue
                    if (!data.isEnd) {
                        fetch();
                    }
                }, function(res) {
                    removeRequest(request.id);

                    if (res.status === -1) {
                        return;
                    }

                    var err = res.data;
                    $log.error('Get stats_detail error:', err);
                    if (onError) {
                        onError(err);
                    }
                });
        }
        function abort (successCallback, errorCallback) {
            $http.delete(uriDel)
                .then(function() {
                    if (successCallback) {
                        successCallback();
                    }
                }, function(error) {
                    var err = error.data;
                    $log.error('Abort stats_detail error:', err);
                    if (errorCallback) {
                        errorCallback(err);
                    }
                });
        }

        return {
            success: function (listener) {
                onData = listener;
                return this;
            },
            error: function (listener) {
                onError = listener;
                return this;
            },
            fetch: function () {
                getSid(function (err, sid) {
                    if (err) {
                        onError(err);
                        return;
                    }

                    uriGet = [uriPost, sid].join('/');
                    uriDel = [uriGet, 'close'].join('/');

                    fetch();
                });
                return this;
            },
            abort: function (successCallback, errorCallback) {
                onData = null;
                onError = null;

                abort(successCallback, errorCallback);
                return this;
            }
        };
    };

    this.abort = function(runCallback) {
        abortAll(function(error) {
            if (error) {
                return;
            }

            if (runCallback) {
                runCallback();
            }
        });
    };

    this.cancelAllHttpRequest = function() {
        cancelAllRequest();
    };

    /**
     * Init Call
     */
    initStates();

    return this;
}

module.exports = searchAgent;
