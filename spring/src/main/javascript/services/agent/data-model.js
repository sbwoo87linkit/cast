'use strict';
/**
 *
 */
/**
 *  데이터 모델의 조회/추가/수정/삭제를 담당하는 agent
 */
DataModelAgent.$inject = ['$log', '$http', '$filter', 'DEFAULT', 'MESSAGE', 'util'];

function DataModelAgent($log, $http, $filter, DEFAULT, MESSAGE, util) {
    /**
     *  member variable
     */
    var _baseUrl = '/datamodel/datamodel';
    var _dataModelList = [];
    /**
     *  member function
     */
    var _convForView = function(obj) {
        var timeField = _.find(obj.fields, ['classification', 'time']);
        var rawField = _.find(obj.fields, ['classification', 'raw']);

        // 타입 강제 변환
        if (timeField) {
            timeField.type = 'TIMESTAMP';
        }

        var timeFieldName = (timeField) ? timeField.name : null;
        var rawFieldName = (rawField) ? rawField.name : null;

        var dataSet = obj.dataset;
        var isTable = (dataSet.format === DEFAULT.STORAGE_TYPE.TABLE);
        var table = ((isTable) ? dataSet.table : dataSet.path);
        var scope = ((isTable) ? obj.scope : MESSAGE['datamodel.hdfs']);
        // NOTE: 아래 구조는 사용하는 곳이 많으므로 수정시 주의해야 함
        return {
            id: obj.id,
            fields: {
                _time: timeFieldName,
                _raw: rawFieldName,
                selected: obj.fields
            },
            type: dataSet.format,
            table: table,
            name: obj.name,
            desc: obj.description,
            scope: scope,
            owner: obj.userid,
            cdate: $filter('str2msec')(obj.cdate, 'unparsed'),
            mdate: $filter('str2msec')(obj.mdate, 'unparsed'),
            partitionRange: obj.partition_range,
            canFullTextSrch: (rawField !== null)
        };
    };

    var _convForAngora = function(obj) {
        var param = {
            name: obj.name,
            description: obj.desc || '',
            fields: [],
        };

        var type = obj.target.type;
        if (type === DEFAULT.STORAGE_TYPE.TABLE) {
            param.dataset = {
                format: type,
                table: obj.target.table
            };
        } else if (type === DEFAULT.STORAGE_TYPE.HDFS) {
            param.dataset = {
                format: util.getFileFormat(obj.target.hdfs),
                path: obj.target.hdfs
            };
        }

        var _time = obj.fields._time;
        if (_time && _time.name) {
            param.fields.push({
                name: _time.name,
                type: 'TIMESTAMP',
                classification: 'time',
                option: _time.option
            });
        }

        var _raw = obj.fields._raw;
        if (_raw && _raw.name) {
            param.fields.push({
                name: _raw.name,
                type: 'TEXT',
                classification: 'raw'
            });
        }

        var selected = obj.fields.selected;
        if (selected.length) {
            var fields = _.map(selected, function(o) {
                return _.pick(o, ['name', 'type', 'option']);
            });
            param.fields = _.concat(param.fields, fields);
        }

        return param;
    };
    /**
     *  methods
     */
    this.cache = {
        modelList: function() {
            return _dataModelList;
        }
    };

    this.getList = function(successCallback, errorCallback) {
        $http.get(_baseUrl)
            .then(function(res) {
                var list = _.map(res.data.data, _convForView);
                // cache
                _dataModelList = list;
                successCallback(list);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.getOne = function(id, successCallback, errorCallback) {
        var url = [_baseUrl, id].join('/');
        $http.get(url)
            .then(function(res) {
                var obj = _convForView(res.data.data);
                successCallback(obj);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.create = function(params, successCallback, errorCallback) {
        $http.post(_baseUrl, params)
            .then(function(res) {
                var id = res.data.id;
                successCallback(id);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.update = function(id, params, successCallback, errorCallback) {
        var url = [_baseUrl, id].join('/');
        $http.put(url, params)
            .then(function(res) {
                var id = res.data.id;
                successCallback(id);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.delete = function(id, successCallback, errorCallback) {
        var url = [_baseUrl, id].join('/');
        $http.delete(url)
            .then(function(res) {
                var id = res.data.id;
                successCallback(id);
            }, function(res) {
                var msg = res.data;
                $log.error(msg);
                errorCallback(msg);
            });
    };

    this.convForAngora = function(obj) {
        return _convForAngora(obj);
    };

    return this;
}
module.exports = DataModelAgent;
