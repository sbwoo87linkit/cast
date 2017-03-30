'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
var _ = require('lodash');
var moment = require('moment');
/**
 *
 */
anomalyAgent.$inject = ['$rootScope', '$http', '$filter', '$log', '$q'];
function anomalyAgent($rootScope, $http, $filter, $log, $q) {
    var URI = 'ade/ade/jobs';

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
    /**
     * function
     */
    var setKeyFields = function(keyFields) {
        return _.map(keyFields, function(value) {
            var temp = {
                name: value.field.name,
                size: value.limit_num
            };

            var as = value.label;
            var values = value.values;

            if (as) {
                temp.as = as;
            }

            if (values) {
                temp.values = _.map(values.split(','), _.trim);
            }

            return temp;
        });
    };

    var setValueFields = function(valueFields) {
        return _.map(valueFields, function(value) {
            var temp = {
                name: value.field.name,
                func: value.func
            };
            var max = value.max;
            var min = value.min;
            var exclude = value.excludes;

            if (max) {
                temp.max = max;
            }

            if (min) {
                temp.min = min;
            }

            if (exclude) {
                temp.exclude = _.map(exclude.split(','), _.trim);
            }

            return temp;
        });
    };

    var setParams = function(params) {
        var adeOpt = params.adeOptions;
        var keyFields = setKeyFields(adeOpt.keyFields);
        var valueFields = setValueFields(adeOpt.valFields);
        var comTimeRange = adeOpt.comTimeRange;
        var refTimeRange = adeOpt.refTimeRange;

        var body = {
            q: params.query,
            datamodel_id: params.datamodel_id,
            ade: {
                values: valueFields,
                model: adeOpt.model,
                permisive: adeOpt.includeNewKey,
                null_value: adeOpt.missingValue,
                test_period: {},
                reference_period: {},
                unit: {
                    value: adeOpt.timeUnit,
                    match: adeOpt.isMatchTimezone
                },
                date_classification: adeOpt.dateClassification
            },
            job_time: moment().valueOf().toString()
        };

        // 키 필드
        if (keyFields) {
            body.ade.key = keyFields;
        }

        // 비교 기간
        if (comTimeRange) {
            if (comTimeRange.start) {
                body.ade.test_period.start_date = $filter('all2unparsed')(comTimeRange.start);
            }
            if (comTimeRange.end) {
                body.ade.test_period.end_date = $filter('all2unparsed')(comTimeRange.end);
            }
        }

        // 참조 기간
        if (refTimeRange) {
            // time range, if unix timestamp or special keyword
            if (refTimeRange.start) {
                body.ade.reference_period.start_date = $filter('all2unparsed')(refTimeRange.start);
            }
            if (refTimeRange.end) {
                body.ade.reference_period.end_date = $filter('all2unparsed')(refTimeRange.end);
            }
        }

        return body;
    };

    this.anomaly = function(params) {
        var onData = null;
        var onError = null;

        var sid = '';

        function getSid (callback) {
            var request = createRequest();
            var body = setParams(params);

            $http.post(URI, body, {
                    timeout: request.defer.promise
                })
                .then(function(res) {
                    removeRequest(request.id);

                    sid = res.data.sid;

                    callback(null);
                }, function(res) {
                    removeRequest(request.id);

                    if (res.status === -1) {
                        return;
                    }

                    var err = res.data;

                    $log.error('anomaly SID error:', err);

                    callback(err);
                });
        }

        function fetch () {
            if (!sid) {
                $log.error('Get anomaly data error: already delete anomaly SID');
                return;
            }

            var request = createRequest();
            var url = [URI, sid].join('/');

            $http.get(url, {
                    timeout: request.defer.promise
                })
                .then(function(res) {
                    removeRequest(request.id);

                    var data = res.data;

                    if (onData) {
                        onData(data);
                    }

                    // continue
                    if (!data.isEnd) {
                        fetch();
                    } else {
                        sid = '';
                    }
                }, function(res) {
                    removeRequest(request.id);
                    sid = '';

                    if (res.status === -1) {
                        return;
                    }

                    var err = res.data;

                    $log.error('Get anomaly data error:', err);

                    if (onError) {
                        onError(err);
                    }
                });
        }

        function abort (successCallback, errorCallback) {
            if (!sid) {
                return;
            }

            var request = createRequest();
            var url = [URI, sid, 'close'].join('/');
            sid = '';

            $http.delete(url, {
                    timeout: request.defer.promise
                })
                .then(function() {
                    removeRequest(request.id);

                    if (successCallback) {
                        successCallback();
                    }
                }, function(error) {
                    removeRequest(request.id);

                    var err = error.data;

                    $log.error('Abort anomaly error:', err);

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
                getSid(function (err) {
                    if (err) {
                        onError(err);
                        return;
                    }

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

    this.cancelAllRequest = function() {
        cancelAllRequest();
    };

    return this;
}

module.exports = anomalyAgent;
