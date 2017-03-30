'use strict';
/**
 *  module dependencies
 */
var uuidV1 = require('uuid/v1');
/**
 *
 */
commonAgent.$inject = ['$http', '$q', '$log', '$filter', 'DEFAULT'];
function commonAgent($http, $q, $log, $filter, DEFAULT) {
    /**
     *
     */
    var _tableList = [];
    var _fields = {};
    var _getSrchQry = function(tableType, tableName) {
        var qry = '';
        if (tableType === DEFAULT.STORAGE_TYPE.TABLE) {
            // q=iris read BATTING | search *
            qry = [
                'iris read',
                tableName,
                '| search *'
            ].join(' ');
        } else {
            // q=hdfs csv read /abc/abc.csv | search *
            qry = [
                'hdfs',
                tableType,
                'read',
                tableName,
                '| search *'
            ].join(' ');
        }
        return qry;
    };

    // 데이터 요청 이전에 미리 데이터를 보여주기 위한 함수.
    // 실제 서버 데이터와 일치하지 않을 가능성이 있기 때문에 이 데이터만 사용해서는 안된다.
    this.cache = {
        tableList: function() {
            return _tableList;
        },
        fields: function(tableName) {
            return _fields[tableName];
        }
    };

    this.confirmToken = function(successCallback, errorCallback) {
        $http.get('/common/token')
            .then(function(res) {
                successCallback(res.data);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    // 테이블 목록
    this.tableList = function(successCallback, errorCallback) {
        $http.get('/common/table_list')
            .then(function(res) {
                var data = res.data;
                var list = data.data;
                for (var i = 0; i < list.length; i++) {
                    // 타입 캐스팅
                    list[i].partition_range = +list[i].partition_range;
                    // 이름만 출력
                    list[i].columns = _.map(list[i].columns, 'name');
                }

                _tableList = list; // cache

                successCallback(list);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };
    // 필드 목록
    this.fields = function(tableType, tableName, successCallback, errorCallback) {
        if (!tableType || !tableName) {
            $log.error('call fields() - empty arguments:', tableType, tableName);
            return;
        }

        // 요청용 param 생성
        var query = _getSrchQry(tableType, tableName);
        var queryStr = '?' + [
            'q=' + query,
            'size=0'
        ].join('&');

        var url = '/common/fields' + queryStr;
        $http.get(url)
            .then(function(res) {
                var fields = res.data.fields;
                // 타입 매핑(축소)
                for (var i = 0; i < fields.length; i++) {
                    fields[i].type = $filter('convType')(fields[i].type);
                }
                _fields[tableName] = fields; // cache

                successCallback(fields);
            }, function(res) {
                var data = res.data;
                $log.error(data);
                errorCallback(data);
            });
    };
    // 샘플 데이터
    this.getSample = function(tableType, tableName, successCallback, errorCallback) {
        if (!tableType || !tableName) {
            $log.error('call getSample() - empty arguments:', tableType, tableName);
            return;
        }

        // 요청용 param 생성
        var query = _getSrchQry(tableType, tableName);
        var queryStr = '?' + [
            'q=' + query,
            'size=10'
        ].join('&');

        var url = '/common/sample' + queryStr;
        $http.get(url)
            .then(function(res) {
                var sample = res.data;
                successCallback(sample);
            }, function(res) {
                var data = res.data;
                $log.error(data);
                errorCallback(data);
            });
    };
    // 조건에 따른 파티션 개수 계산
    this.getMetadata = function (params, successCallback, errorCallback) {
        var modelId = params.modelId;
        if (!modelId) {
            // $log.error('...');
            return;
        }
        var start_date = $filter('all2unparsed')(params.timeRange.start);
        var end_date = $filter('all2unparsed')(params.timeRange.end);

        var queryStr = '?' + [
            'datamodel_id=' + modelId,
            'start_date=' + start_date,
            'end_date=' + end_date
        ].join('&');

        var request = createRequest('metadata');
        var url = '/common/metadata' + queryStr;
        $http.get(url, {
                timeout: request.defer.promise
            })
            .then(function(res) {
                removeRequest(request.id);

                var data = res.data;
                successCallback(data.data.partition_num);
            }, function(res) {
                removeRequest(request.id);

                if (res.status === -1) {
                    return;
                }

                var data = res.data;
                $log.error(data);
                errorCallback(data);
            });
    };

    // NOTE: 현재는 metadata만 관리. 필요시 수정
    this.cancelAllRequest = function (name) {
        cancelAllRequest(name);
    };
    /**
    *
    */
    var _request = [];

    function createRequest(name) {
        var request = {
            name: name,
            id: uuidV1(),
            defer: $q.defer()
        };
        _request.push(request);
        return request;
    }

    function removeRequest(id) {
        _request = _.remove(_request, function(reuqest) {
            return (reuqest.id !== id);
        });
    }

    function cancelAllRequest(name) {
        var reqs = _request;
        if (name) {
            reqs = _.filter(reqs, ['name', name]);
        }
        _.forEach(reqs, function(req) {
            req.defer.resolve();
        });
        _request = [];
    }
    /**
    *
    */
    return this;
}

module.exports = commonAgent;
