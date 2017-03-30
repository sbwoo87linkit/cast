'use strict';
/**
 *
 */
/**
 *  데이터 모델 구조체 저장 factory
 */
DataModel.$inject = [];
function DataModel() {
    /**
    *   fields
    */
    var _id = '';
    var _name = '';
    var _desc = '';

    var _type = '';
    var _table = '';
    var _scope = '';
    var _partitionRange = 0;

    var _fields = {
        _time: null,
        _raw: null,
        selected: []
    };

    var _owner = null;
    var _cdate = null;
    var _mdate = null;
    /**
    *   method
    */
    this.clean = function () {
        _id = '';
        _name = '';
        _desc = '';

        _type = '';
        _table = '';
        _scope = '';
        _partitionRange = 0;

        _fields._time = null;
        _fields._raw = null;
        _fields.selected = [];

        _owner = null;
        _cdate = null;
        _mdate = null;

        return this;
    };
    this.get = function () {
        return {
            id: _id,
            name: _name,
            desc: _desc,

            type: _type,
            table: _table,
            scope: _scope,
            partitionRange: _partitionRange,

            fields: {
                _time: _fields._time,
                _raw: _fields._raw,
                selected: _fields.selected
            },
            canFullTextSrch: !!(_fields._raw),

            owner: _owner,
            cdate: _cdate,
            mdate: _mdate
        };
    };
    this.set = function (model) {
        _id = model.id;
        _name = model.name;
        _desc = model.desc;

        _type = model.type;
        _table = model.table;
        _scope = model.scope;
        _partitionRange = model.partitionRange;

        _fields._time = model.fields._time;
        _fields._raw = model.fields._raw;
        _fields.selected = model.fields.selected;

        _owner = model.owner;
        _cdate = model.cdate;
        _mdate = model.mdate;
        return this;
    };
    /**
    *   getter & setter
    */
    this.id = function (id) {
        if (!arguments.length) {
            return _id;
        }
        _id = id;
        return this;
    };
    this.name = function (name) {
        if (!arguments.length) {
            return _name;
        }
        _name = name;
        return this;
    };
    this.desc = function (desc) {
        if (!arguments.length) {
            return _desc;
        }
        _desc = desc;
        return this;
    };

    this.type = function(type) {
        if(!arguments.length) {
            return _type;
        }
        _type = type;
        return this;
    };
    this.table = function (table) {
        if (!arguments.length) {
            return _table;
        }
        _table = table;
        return this;
    };
    this.scope = function (scope) {
        if (!arguments.length) {
            return _scope;
        }
        _scope = scope;
        return this;
    };
    this.partitionRange = function (partitionRange) {
        if (!arguments.length) {
            return _partitionRange;
        }
        _partitionRange = partitionRange;
        return this;
    };

    this.fields = function (fields) {
        if (!arguments.length) {
            return _fields;
        }
        _fields = fields;
        return this;
    };

    // getter만 존재
    this.existTimeField = function () {
        return !!(_fields._time);
    };
    // getter만 존재
    this.canFullTextSrch = function () {
        return !!(_fields._raw);
    };

    this.owner = function (owner) {
        if (!arguments.length) {
            return _owner;
        }
        _owner = owner;
        return this;
    };
    this.cdate = function (cdate) {
        if (!arguments.length) {
            return _cdate;
        }
        _cdate = cdate;
        return this;
    };
    this.mdate = function (mdate) {
        if (!arguments.length) {
            return _mdate;
        }
        _mdate = mdate;
        return this;
    };

    return this;
}
/**
*   exports
*/
module.exports = DataModel;
