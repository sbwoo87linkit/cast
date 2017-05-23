'use strict';
/**
 *
 */
var _ = require('lodash');
/**
 *
 */
visualOptsFactory.$inject = ['$rootScope', 'MESSAGE'];

function visualOptsFactory($rootScope, MESSAGE) {
    /**
     *   constant
     */
    var DEFAULT_CHART = 'default';
    var CFG_INIT_VALUE = {
        xAxis: { title: {}, labels: { autoRotation: [0] } },
        yAxis: { title: {} },
        legend: {},
        plotOptions: {
            spline: { dataLabels: {}, animation: false },
            area: { dataLabels: {}, animation: false },
            column: { dataLabels: {}, animation: false },
            bar: { dataLabels: {}, animation: false },
            pie: { animation: false },
            series: { dataLabels: {}, marker: { enabled: false } }
        }
    };
    var OPTS_INIT_VALUE = {
        normal: {
            stacking: 'none', // 'none', 'normal', 'percent'
            connectNulls: 'gap', // 'gap', 'show', 'connect'
            splitSeries: false,
            drillDown: true,
            showValue: 'none', // 'none', 'all', 'min.max'
        },
        xAxis: {
            title: {
                text: null, // text or null
                isShow: false,
            },
            labels: {
                rotation: 0, // -45, -90, 0, 45, 90,
                ellipsis: false
            }
        },
        yAxis: {
            title: {
                text: null, // text or null
                isShow: false,
            },
            type: 'linear', // 'linear', 'logarithmic"',
            range: 'same', // 'same', 'each',
            tickInterval: null, // integer or null
            min: null, // integer or null
            max: null // integer or null
        },
        overlay: {
            // fields: [{
            //     name: 'fieldA',
            //     selected: false
            // }]
            fields: [], // array of object
            enabled: false,
            title: {
                text: null, // text or null
                isShow: false,
            },
            type: 'inherit', // 'inherit', 'linear', 'logarithmic',
            tickInterval: null, // integer or null
            min: null, // integer or null
            max: null // integer or null
        },
        legend: {
            align: 'right', // 'none', 'right', 'bottom', 'left', 'top',
            ellipsis: 'end', // 'start', 'middle', 'end'
        },
        size: {
            minSize: 1 // 1~100
        }
    };
    /**
     *  member variable
     */
    var _optGroup = {
        pie: [
            { name: 'normal', useOpts: ['drillDown'], res: MESSAGE['normal'] },
            { name: 'size', res: MESSAGE['size'] }
        ],
        'default': [
            { name: 'normal', res: MESSAGE['normal'] },
            { name: 'xAxis', res: ('X' + MESSAGE['chart.axis']) },
            { name: 'yAxis', res: ('Y' + MESSAGE['chart.axis']) },
            // { name: 'overlay', res: MESSAGE['overlay'] },
            { name: 'legend', res: MESSAGE['chart.legend'] }
        ]
    };
    var _opts = _.cloneDeep(OPTS_INIT_VALUE);
    var _chartType = DEFAULT_CHART;
    /**
     *  member function
     */
    var _getOpts = function() {

        var opts = {};
        var groups = _optGroup[_chartType];
        if (_.isEmpty(groups)) {
            groups = _optGroup[DEFAULT_CHART];
        }

        _.forEach(groups, function(group) {
            var groupOpts = _.cloneDeep(_opts[group.name]);
            if (group.useOpts) {
                groupOpts = _.pick(groupOpts, group.useOpts);
            }

            opts[group.name] = groupOpts;
        });

        return {
            chartType: _.cloneDeep(_chartType),
            groups: groups,
            opts: opts
        };
    };

    var _emitChanged = function() {
        $rootScope.$broadcast('visualOpts.changed', _getOpts());
    };

    this.chartType = function(chartType) {
        if (!arguments.length) {
            return this._chartType;
        }

        _chartType = chartType;
    };

    this.updateOpt = function(optPath, value, silent) {
        // find prop
        var prop = {};
        var pathes = optPath.split('.');
        _.forEach(pathes, function(path, index) {
            if (index === 0) {
                prop = _opts[path];
            } else if (index < (pathes.length - 1)) {
                prop = prop[path];
            }
        });

        // set value
        prop[_.last(pathes)] = value;

        if (!silent) {
            _emitChanged();
        }
    };

    this.updateAllOpts = function(newOpts) {
        _clean();

        _chartType = newOpts.chartType;
        _.merge(_opts, newOpts.opts);
    };

    this.getOpts = function() {
        return _getOpts();
    };

    this.getHighchartsConfig = function(newOpts) {

        var optsSet = (newOpts || _getOpts());
        var chartType = optsSet.chartType;
        var opts = optsSet.opts;
        var config = _.cloneDeep(CFG_INIT_VALUE);

        if (_.isEmpty(chartType) || (chartType === 'default')) {
            return;
        }

        /*일반*/
        // 스택 모드
        if (opts.normal.stacking && (opts.normal.stacking !== 'none')) {
            config.plotOptions[chartType].stacking = opts.normal.stacking;
        }
        // Null 값
        // NOTE: 'gap'에 대한 처리는 따로 구현 해야함
        if (opts.normal.connectNulls) {
            config.plotOptions.series.connectNulls = (opts.normal.connectNulls === 'connect');
        }
        // NOTE: '다중 열 모드'는 따로 구현 해야함
        // NOTE: '드릴 다운'은 따로 구현 해야함
        // 데이터 값 표시
        if (opts.normal.showValue && (opts.normal.showValue !== 'min.max')) {
            config.plotOptions.series.dataLabels.enabled = (opts.normal.showValue === 'all');
        }

        /*X축*/
        if (opts.xAxis) {
            // 제목
            if (opts.xAxis.title && !_.isEmpty(opts.xAxis.title.text) && opts.xAxis.title.isShow) {
                config.xAxis.title.enabled = true;
                config.xAxis.title.text = opts.xAxis.title.text;
            }
            // 레이블 회전
            if (opts.xAxis.labels.rotation) {
                config.xAxis.labels.rotation = opts.xAxis.labels.rotation;
            }
            // NOTE: '레이블 잘라내기'는 따로 구현 해야함
        }

        /*Y축*/
        if (opts.yAxis) {
            // 제목
            if (opts.yAxis.title && !_.isEmpty(opts.yAxis.title.text) && opts.yAxis.title.isShow) {
                config.yAxis.title.enabled = true;
                config.yAxis.title.text = opts.yAxis.title.text;
            }
            // 눈금
            if (opts.yAxis.type && (opts.yAxis.type === 'logarithmic')) {
                config.yAxis.type = opts.yAxis.type;
            }
            // NOTE: '축범위'는 따로 구현 해야함
            // 간격
            if (opts.yAxis.tickInterval && !_.isEmpty(opts.yAxis.tickInterval)) {
                config.yAxis.tickInterval = parseInt(opts.yAxis.tickInterval);
            }
            // 최소값
            if (opts.yAxis.min && !_.isEmpty(opts.yAxis.min)) {
                config.yAxis.min = parseInt(opts.yAxis.min);
            }
            // 최대값
            if (opts.yAxis.max && !_.isEmpty(opts.yAxis.max)) {
                config.yAxis.max = parseInt(opts.yAxis.max);
            }
        }

        /*차트 오버레이*/
        // NOTE: '차트 오버레이'는 따로 구현 해야함

        /*범례*/
        if (opts.legend) {
            // 범례 위치
            if (opts.legend.align) {
                if ((opts.legend.align === 'left') || (opts.legend.align === 'right')) {
                    config.legend.align = opts.legend.align;
                } else if ((opts.legend.align === 'top') || (opts.legend.align === 'bottom')) {
                    config.legend.align = 'center';
                    config.legend.verticalAlign = opts.legend.align;
                    config.legend.layout = 'horizontal';
                } else {
                    config.legend.enabled = false;
                }
            }
            // NOTE: '범례 잘라내기'는 따로 구현 해야함
        }

        /*크기*/
        // NOTE: '크기'는 따로 구현 해야함

        return config;
    };

    this.convertNullToZero = function(series) {
        for (var i = 0; i < series.length; i++) {
            series[i].data = _.map(series[i].data, function(data) {
                return ((data === null) ? 0 : data);
            });
        }
        return series;
    };

    var _clean = function() {
        _opts = OPTS_INIT_VALUE;
        _chartType = DEFAULT_CHART;
    };

    this.clean = function() {
        _clean();
    };

    return this;
}

module.exports = visualOptsFactory;
