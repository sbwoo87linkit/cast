'use strict';
/**
 *
 */
/**
 *  보고서 구조체 저장 factory
 */
Report.$inject = [];
function Report() {
    /**
    *   fields
    */
    var _id = '';
    var _title = '';
    var _desc = '';
    var _userId = '';

    var _modelId = '';
    var _query = '';
    var _timeRange = {
        start: null,
        end: null
    };

    var _pivotState = false;
    var _pivotType = '';
    var _pivotAttribute = null; // object

    var _cdate = null;
    var _mdate = null;

    /**
    *   method
    */
    this.clean = function () {
        _id = '';
        _title = '';
        _desc = '';
        _userId = '';

        _modelId = '';
        _query = '';
        _timeRange.start = null;
        _timeRange.end = null;

        _pivotState = false;
        _pivotType = '';
        _pivotAttribute = null;

        _cdate = null;
        _mdate = null;

        return this;
    };
    this.get = function () {
        return {
            id: _id,
            title: _title,
            desc: _desc,
            userId: _userId,

            modelId: _modelId,
            query: _query,
            timeRange: {
                start: _timeRange.start,
                end: _timeRange.end
            },

            pivotState: _pivotState,
            pivotType: _pivotType,
            pivotAttribute: _pivotAttribute,

            cdate: _cdate,
            mdate: _mdate
        };
    };
    this.set = function (report) {
        _id = report.id;
        _title = report.title;
        _desc = report.desc;
        _userId = report.userId;

        _modelId = report.modelId;
        _query = report.query;
        if (report.timeRange) {
            _timeRange.start = report.timeRange.start;
            _timeRange.end = report.timeRange.end;
        }

        _pivotState = report.pivotState;
        _pivotType = report.pivotType;
        _pivotAttribute = report.pivotAttribute;

        _cdate = report.cdate;
        _mdate = report.mdate;

        return this;
    };

    this.id = function (id) {
        if (!arguments.length) {
            return _id;
        }
        _id = id;
        return this;
    };
    this.title = function (title) {
        if (!arguments.length) {
            return _title;
        }
        _title = title;
        return this;
    };
    this.desc = function (desc) {
        if (!arguments.length) {
            return _desc;
        }
        _desc = desc;
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

    this.searchConds = function (query, modelId, timeRange) {
        if (!arguments.length) {
            return {
                query: _query,
                modelId: _modelId,
                timeRange: _timeRange
            };
        }
        _query = query;
        _modelId = modelId;
        _timeRange.start = timeRange.start;
        _timeRange.end = timeRange.end;
        return this;
    };

    this.pivotProps = function (pivotType, props) {
        if (!arguments.length) {
            return {
                pivotState: _pivotState,
                pivotType: _pivotType,
                pivotAttribute: _pivotAttribute
            };
        }
        _pivotState = true;
        _pivotType = pivotType;
        _pivotAttribute = props;
        return this;
    };

    return this;
}
/**
*   exports
*/
module.exports = Report;
