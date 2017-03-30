'use strict';
/**
 *
 */
/**
 *  검색조건 구조체 저장 factory
 */
SearchCond.$inject = ['$rootScope', 'DEFAULT', 'util'];
function SearchCond($rootScope, DEFAULT, util) {
    /**
    *   fields
    */
    var _modelId = '';
    var _query = DEFAULT.QUERY;
    var _timeRange = {
        start: DEFAULT.TIME_START,
        end: DEFAULT.TIME_END,
        isRelative: function () {
            return util.isRelativeTime(this.start) || util.isRelativeTime(this.end);
        }
    };
    /**
    *   method
    */
    this.clean = function () {
        _modelId = '';
        _query = '';
        _timeRange = {
            start: DEFAULT.TIME_START,
            end: DEFAULT.TIME_END
        };

        return this;
    };
    this.get = function () {
        return {
            modelId: _modelId,
            query: _query,
            timeRange: {
                start: _timeRange.start,
                end: _timeRange.end
            }
        };
    };
    this.set = function (cond, slient) {
        _modelId = cond.modelId;
        _query = cond.query || DEFAULT.QUERY;

        if (cond.timeRange) {
            _timeRange.start = cond.timeRange.start;
            _timeRange.end = cond.timeRange.end;
        }

        if (!slient) {
            _emitChanged();
        }
        return this;
    };
    this.getClone = function () {
        return {
            modelId: _modelId,
            query: _query,
            timeRange: _.pick(_timeRange, ['start', 'end'])
        };
    };
    /**
    *   getter/setter
    */
    this.modelId = function (modelId, slient) {
        if (!arguments.length) {
            return _modelId;
        }
        _modelId = modelId;

        if (!slient) {
            _emitChanged();
        }
        return this;
    };
    this.query = function (query, slient) {
        if (!arguments.length) {
            return _query;
        }
        _query = query || DEFAULT.QUERY;

        if (!slient) {
            _emitChanged();
        }
        return this;
    };
    this.timeRange = function (start, end, slient) {
        if (!arguments.length) {
            return _timeRange;
        }
        _timeRange.start = start;
        _timeRange.end = end;

        if (!slient) {
            _emitChanged();
        }
        return this;
    };

    // 수동으로 이벤트 트리거
    this._emitChanged = function () {
        _emitChanged();
        return this;
    };

    var _this = this;
    function _emitChanged () {
        $rootScope.$broadcast('searchCond.changed', _this.get());
    }

    return this;
}
/**
*   exports
*/
module.exports = SearchCond;
