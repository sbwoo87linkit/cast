'use strict';
/**
*
*/
pivotPropsFactory.$inject = ['$rootScope', '$filter', 'MESSAGE', 'DEFAULT', 'FNAME', 'util'];
function pivotPropsFactory($rootScope, $filter, MESSAGE, DEFAULT, FNAME, util) {
    /**
    *   constant
    */
    var CELL_INIT_VALUE = {
        field: {
            name: '*',
            // TODO: 추후 타입 제거
            type: '*'
        },
        func: 'count',
        label: null
    };
    /**
    *   define class
    */
    function PivotProps() {
        // EventEmitter.call(this);

        this._query = DEFAULT.QUERY;
        this._modelId = '';

        this._timeRange = {
            start: DEFAULT.TIME_START,
            end: DEFAULT.TIME_END,
            isRelative: function () {
                return util.isRelativeTime(this.start) || util.isRelativeTime(this.end);
            },
            toString: function () {
                return $filter('allrange2text')(this.start, this.end);
            },
            // always convert (date format) ~ (date format)
            toDaterange: function () {
                var start = $filter('all2moment')(this.start);
                var end = $filter('all2moment')(this.end);

                return $filter('timerange2text')(start, end);
            },
            // always convert (humanize text)
            toHumanize: function () {
                if (_.isNumber(this.start) && this.end === null) {
                    return MESSAGE['pivot.after_time_range'];
                } else if (this.start === null && _.isNumber(this.end)) {
                    return MESSAGE['pivot.before_time_range'];
                } else if (_.isNumber(this.start) && _.isNumber(this.end)) {
                    return MESSAGE['pivot.between_time_range'];
                }
                return $filter('keyrange2text')(this.start, this.end);
            }
        };

        // 필터/행/열/값 옵션
        this._filters = this.exArray([], 'filter');
        this._rows = this.exArray([], 'row');
        this._cols = this.exArray([], 'col');
        this._cells = this.exArray([CELL_INIT_VALUE], 'cell');

        // 모든 행/열 옵션
        this._rowOpts = this.exObject({});
        this._colOpts = this.exObject({});

        return this;
    }
    // util.inherits(PivotProps, EventEmitter);
    module.exports = PivotProps;

    // alias
    // PivotProps.prototype.off = PivotProps.prototype.removeListener;
    // PivotProps.prototype.offAll = PivotProps.prototype.removeAllListeners;
    /**
    *
    */
    PivotProps.prototype.get = function () {
        return {
            query: this._query,
            modelId: this._modelId,
            // 보고서 pivotAttribute와 cond를 비교하기 위해 주석처리
            // dataCount: this._dataCount,

            timeRange: this._timeRange,
            filters: this._filters,
            rows: this._rows,
            cols: this._cols,
            cells: this._cells,

            rowOpts: this._rowOpts,
            colOpts: this._colOpts
        };
    };
    PivotProps.prototype.set = function (props, slient) {
        this._query = props.query || DEFAULT.QUERY;
        this._modelId = props.modelId || this._modelId;

        if (props.timeRange) {
            this._timeRange.start = props.timeRange.start;
            this._timeRange.end = props.timeRange.end;
        }
        this.filters(props.filters || [], true);
        this.rows(props.rows || [], true);
        this.cols(props.cols || [], true);
        this.cells(props.cells || [CELL_INIT_VALUE], true);

        this.rowOpts(props.rowOpts || {}, true);
        this.colOpts(props.colOpts || {}, true);

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };
    PivotProps.prototype.setFieldTypes = function (fields) {
        if (!fields) {
            return;
        }

        var fieldMap = convFieldMap(fields);

        _.forEach(this._filters, function (item) {
            item.field.type = fieldMap[item.field.name];
        });
        _.forEach(this._rows, function (item) {
            item.field.type = fieldMap[item.field.name];
        });
        _.forEach(this._cols, function (item) {
            item.field.type = fieldMap[item.field.name];
        });
        _.forEach(this._cells, function (item) {
            item.field.type = fieldMap[item.field.name];

            if (item.field.type === 'TIMESTAMP') {
                if (item.func === 'min') {
                    item.func = 'start';
                }
                else if (item.func === 'max') {
                    item.func = 'end';
                }
            }
        });

        return this;
    };

    PivotProps.prototype.getClone = function () {
        return _.cloneDeep({
            query: this._query,
            modelId: this._modelId,

            timeRange: this._timeRange,
            filters: this._filters,
            rows: this._rows,
            cols: this._cols,
            cells: this._cells,

            rowOpts: this._rowOpts,
            colOpts: this._colOpts
        });
    };
    PivotProps.prototype.getProps = function () {
        return {
            timeRange: this._timeRange,
            filters: this._filters,
            rows: this._rows,
            cols: this._cols,
            cells: this._cells,

            rowOpts: this._rowOpts,
            colOpts: this._colOpts
        };
    };
    // 내부 변수를 완전히 초기화. 용도: $destory, 이벤트 트리거 여부: NO
    PivotProps.prototype.clean = function () {
        this._query = DEFAULT.QUERY;
        this._modelId = null;
        this._timeRange.start = DEFAULT.TIME_START;
        this._timeRange.end = DEFAULT.TIME_END;

        this._filters.removeAll(true);
        this._rows.replaceOne(null, true);
        this._cols.replaceOne(null, true);
        this._cells.replaceOne(CELL_INIT_VALUE, true);

        this._rowOpts.removeAll(true);
        this._colOpts.removeAll(true);

        return this;
    };
    // props만 초기화. 용도: 초기화, 이벤트 트리거 여부: YES
    PivotProps.prototype.cleanProps = function () {
        this._timeRange.start = DEFAULT.TIME_START;
        this._timeRange.end = DEFAULT.TIME_END;

        this._filters.removeAll(true);
        this.replaceProps(null, null, CELL_INIT_VALUE);

        this._rowOpts.removeAll(true);
        this._colOpts.removeAll(true);

        return this;
    };
    // 행/열/값 props을 하나만 남기고 제거. 용도: 차트 -> 테이블 전환, 이벤트 트리거 여부: YES
    PivotProps.prototype.replaceProps = function (row, col, cell) {
        this._rows.replaceOne(row, true);
        this._cols.replaceOne(col, true);
        this._cells.replaceOne(cell, true);

        this._emitChanged();
        return this;
    };

    PivotProps.prototype._emitChanged = function () {
        // this.emit('changed.props', this.getProps());
        $rootScope.$broadcast('pivotProps.changed', this.get());
        return this;
    };
    /**
    *   getter & setter
    */
    PivotProps.prototype.query = function (query, slient) {
        if (!arguments.length) {
            return this._query;
        }
        this._query = query;

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };
    PivotProps.prototype.modelId = function (modelId, slient) {
        if (!arguments.length) {
            return this._modelId;
        }
        this._modelId = modelId;

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };
    PivotProps.prototype.timeRange = function (start, end, slient) {
        if (!arguments.length) {
            return this._timeRange;
        }
        this._timeRange.start = start;
        this._timeRange.end = end;

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };
    PivotProps.prototype.filters = function (filters, slient) {
        if (!arguments.length) {
            return this._filters;
        }
        this._filters.removeAll(true).pushAll(filters);

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };
    PivotProps.prototype.rows = function (rows, slient) {
        if (!arguments.length) {
            return this._rows;
        }
        this._rows.removeAll(true).pushAll(rows);

        // override method
        var pivotProps = this;
        var _removeRow = this._rows.remove.bind(this._rows);
        this._rows.remove = function (index, slient) {
            _removeRow(index, slient);

            if (this.length === 0) {
                pivotProps.rowOpts().removeAll(slient);
            }
            return this;
        };

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };
    PivotProps.prototype.cols = function (cols, slient) {
        if (!arguments.length) {
            return this._cols;
        }
        this._cols.removeAll(true).pushAll(cols);

        // override method
        var pivotProps = this;
        var _removeCol = this._cols.remove.bind(this._cols);
        this._cols.remove = function (index, slient) {
            _removeCol(index, slient);

            if (this.length === 0) {
                pivotProps.colOpts().removeAll(slient);
            }
            return this;
        };

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };
    PivotProps.prototype.cells = function (cells, slient) {
        if (!arguments.length) {
            return this._cells;
        }
        this._cells.removeAll(true).pushAll(cells);

        // override method
        var _removeCell = this._cells.remove.bind(this._cells);
        this._cells.remove = function (index, slient) {
            if (this.length > 1) {
                _removeCell(index, slient);
            }
            else {
                this.replaceOne(CELL_INIT_VALUE, slient);
            }
            return this;
        };

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };

    PivotProps.prototype.rowOpts = function (rowOpts, slient) {
        if (!arguments.length) {
            return this._rowOpts;
        }
        this._rowOpts = this.exObject(rowOpts);

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };
    PivotProps.prototype.colOpts = function (colOpts, slient) {
        if (!arguments.length) {
            return this._colOpts;
        }
        this._colOpts = this.exObject(colOpts);

        if (!slient) {
            this._emitChanged();
        }
        return this;
    };

    //////////////////////////////////////////////////

    PivotProps.prototype.exArray = function (arr, type) {
        var _this = this;

        var fnToString = {
            filter: filterToString,
            row: defToString,
            col: defToString,
            cell: cellToString,
            def: defToString // default
        }[type || 'def'];

        // add method(item)
        _.each(arr, function (item) {
            item.toString = fnToString;
        });

        // add method
        arr.get = function (index) {
            return this[index];
        };
        arr.set = function (index, item, slient) {
            item.toString = fnToString;
            this[index] = item;

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };
        arr.insert = function (index, item, slient) {
            item.toString = fnToString;
            this.splice(index, 0, item);

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };
        arr.remove = function (index, slient) {
            this.splice(index, 1);

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };

        // for init
        arr.pushAll = function (items) {
            for (var i = 0; i < items.length; i++) {
                arr.push(items[i], true);
            }
            return this;
        };
        arr.removeAll = function (slient) {
            this.splice(0, this.length);

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };
        arr.replaceOne = function (item, slient) {
            this.splice(0, this.length);

            if (item) {
                item.toString = fnToString;
                this[0] = item;
            }

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };

        // override method
        var _push = arr.push.bind(arr);
        arr.push = function (item, slient) {
            item.toString = fnToString;
            _push(item);

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };
        return arr;
    };
    PivotProps.prototype.exObject = function (obj/*, type*/) {
        var _this = this;

        // add method
        obj.get = function (key) {
            return this[key];
        };
        obj.set = function (key, value, slient) {
            this[key] = value;

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };
        obj.remove = function (key, slient) {
            delete this[key];

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };

        // for init
        obj.removeAll = function (slient) {
            for (var key in this) {
                if (this.hasOwnProperty(key)) {
                    if (!_.isFunction(this[key])) {
                        delete this[key];
                    }
                }
            }

            if (!slient) {
                _this._emitChanged(); // event emit
            }
            return this;
        };
        return obj;
    };

    //////////////////////////////////////////////////

    /**
    *   toString (from filters/pivot.js)
    */
    function defToString() {
        return $filter('pivot')(this);
    }
    function filterToString() {
        return $filter('pivotFilter')(this);
    }
    function cellToString() {
        return $filter('pivotCell')(this);
    }
    /**
    *
    */
    function convFieldMap(fields) {
        var rst = {};

        // NOTE: 필드 타입 설정이 하드코딩이므로 살짝 위험. 개선하려면?
        rst['*'] = '*';
        // TODO: 이제 필요없어 보임. 확인 후 삭제
        // rst[_time] = 'TIMESTAMP';
        // rst[_raw] = 'TEXT';

        _.forEach(fields, function (field) {
            rst[field.name] = field.type;
        });

        return rst;
    }

    //////////////////////////////////////////////////

    return (new PivotProps());
} // end pivotPropsFactory()
/**
*
*/
module.exports = pivotPropsFactory;
