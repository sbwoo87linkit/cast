'use strict';
/**
 *
 */
var angular = require('angular');
var async = require('async');
/**
 *
 */
reportAgent.$inject = ['$http', '$log', '$filter', 'REGEXP', 'dataModelAgent'];
function reportAgent($http, $log, $filter, REGEXP, dataModelAgent) {
    /**
     *   private
     */
    var baseUrl = '/report';

    // 보고서 리스트
    var _reportList = [];

    // 데이터 모델 리스트
    var _modelList = [];

    var convParams = function(params) {
        var body = _.pick(params, 'title', 'desc', 'query', 'modelId', 'pivotState', 'pivotType');

        body.pivotAttribute = angular.toJson(params.pivotAttribute);

        var timeRange = params.timeRange;
        if (timeRange) {
            if (_.isNumber(timeRange.start)) {
                body.startDate = $filter('msec2str')(timeRange.start, 'unparsed');
            } else {
                body.startDate = timeRange.start;
            }
            if (_.isNumber(timeRange.end)) {
                body.endDate = $filter('msec2str')(timeRange.end, 'unparsed');
            } else {
                body.endDate = timeRange.end;
            }
        }

        return body;
    };

    var convItem = function(item) {
        // 데이터 모델 이름 추가
        var model = _.find(_modelList, ['id', item.modelId]);
        if (model) {
            item.dataName = model.name;
            item.existTimeField = !!(model.fields._time);
        }

        var startDate = item.startDate;
        if (startDate && REGEXP.UNPARSED.test(startDate)) {
            startDate = $filter('str2msec')(startDate);
        }
        var endDate = item.endDate;
        if (endDate && REGEXP.UNPARSED.test(endDate)) {
            endDate = $filter('str2msec')(endDate);
        }
        item.timeRange = {
            start: startDate,
            end: endDate
        };
        delete item.startDate;
        delete item.endDate;

        if (item.pivotState) {
            item.pivotAttribute = angular.fromJson(item.pivotAttribute);
        }
        item.cdate = $filter('str2msec')(item.cdate);
        item.mdate = $filter('str2msec')(item.mdate);

        return item;
    };

    // 데이터 모델 목록
    var getModelList = function(callback) {
        _modelList = dataModelAgent.cache.modelList();

        dataModelAgent.getList(function(data) {
            _modelList = data; // save

            callback();
        }, callback);
    };

    // 보고서 목록
    var getReportList = function(callback) {
        $http.get(baseUrl)
            .then(function(res) {
                var list = res.data.data;

                for (var i = 0; i < list.length; i++) {
                    convItem(list[i]);
                }

                _reportList = list; // cache

                callback(null, list);
            }, callback);
    };
    /**
     *   methods
     */
    this.cache = {
        reportList: function() {
            return _reportList;
        },
        // WARN: reportAgent에서 modelList 메서드를 제공해서는 안된다.
        modelList: function() {
            return _modelList;
        }
    };

    this.getList = function(successCallback, errorCallback) {
        async.waterfall([
            function(callback) {
                getModelList(callback);
            },
            function(callback) {
                getReportList(callback);
            }
        ], function(errorRes, results) {
            if (errorRes) {
                var msg = errorRes.data;
                $log.error(msg);
                errorCallback(msg);
                return;
            }
            successCallback(results);
        });
    };

    this.getListByDataSet = function(id, successCallback, errorCallback) {
        var uri = [baseUrl, 'dataset', id].join('/');

        $http.get(uri)
            .then(function(res) {
                var list = res.data.data;
                for (var i = 0; i < list.length; i++) {
                    convItem(list[i]);
                }
                successCallback(list);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.getOnce = function(id, successCallback, errorCallback) {
        var uri = [baseUrl, id].join('/');

        $http.get(uri)
            .then(function(res) {
                var data = res.data.data;

                convItem(data);

                successCallback(data);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.create = function(params, successCallback, errorCallback) {
        params = convParams(params);

        $http.post(baseUrl, params)
            .then(function(res) {
                var data = res.data.data;

                convItem(data);

                successCallback(data);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.update = function(params, successCallback, errorCallback) {
        var uri = [baseUrl, params.id].join('/');
        params = convParams(params);

        $http.put(uri, params)
            .then(function(res) {
                var data = res.data.data;

                convItem(data);

                successCallback(data);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.delete = function(id, successCallback, errorCallback) {
        var uri = [baseUrl, id].join('/');

        $http.delete(uri)
            .then(function(res) {
                successCallback(res.data.id);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    return this;
}

module.exports = reportAgent;
