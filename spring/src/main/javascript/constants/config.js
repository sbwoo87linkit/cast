'use strict';
/**
 *
 */
var MESSAGE = require('./messages.js');
/**
 *
 */
module.exports = {
    HIGH_CHARTS: {
        // 타임라인 차트 기본 config
        TIME_LINE: {
            chart: {
                type: 'column',
                alignTicks: false,
                events: {},
                zoomType: 'x',
                animation: false
            },
            credits: { enabled: false },
            lang: { noData: MESSAGE['chart.no_data'] },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#303030'
                }
            },
            title: { text: '' },
            legend: { enabled: false },
            xAxis: {
                type: 'datetime',
                title: { text: null },
                labels: {
                    format: null,
                    align: 'left'
                },
                minPadding: 0,
                maxPadding: 0
            },
            yAxis: {
                opposite: true,
                lineWidth: 2,
                offset: 70,
                title: { text: null },
                labels: {
                    align: 'right',
                    x: -3,
                    y: 6
                },
                showLastLabel: true
            },
            plotOptions: {
                column: {
                    color: '',
                    borderWidth: '',
                    animation: false
                },
                series: {
                    pointPadding: 0.1,
                    groupPadding: 0.1
                }
            },
            tooltip: { formatter: null },
            series: [{
                type: 'column',
                name: '',
                data: [],
                cursor: 'pointer',
                maxPointWidth: '',
                point: { events: { click: {} } },
                states: { select: { color: '' } }
            }]
        },
        // X, Y축을 사용 하는 차트 기본 config (COLUMN, BAR, LINE)
        AXIS: {
            chart: {
                type: '',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                zoomType: 'x'
            },
            credits: { enabled: false },
            title: { text: '' },
            legend: {
                enabled: true,
                align: 'right',
                verticalAlign: 'top',
                layout: 'vertical',
                x: 0,
                y: 100
            },
            tooltip: {
                formatter: null,
                useHTML: true,
                pointFormat: {},
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    pointPadding: 0.1,
                    groupPadding: 0.1,
                    marker: { enabled: false },
                    point: { events: { click: {} } }
                },
                column: { borderWidth: '' },
            },
            xAxis: {
                title: {
                    enabled: false,
                    text: ''
                },
                labels: {
                    formatter: null,
                    autoRotation: [0]
                },
                categories: []
            },
            yAxis: {
                title: {
                    enabled: false,
                    text: ''
                },
                showLastLabel: true
            },
            series: [{
                name: '',
                data: [],
                cursor: 'pointer',
                point: {
                    events: { click: {} }
                }
            }]
        },
        AXIS_EMPTY: {
            chart: { type: '' },
            credits: { enabled: false },
            title: { text: '' },
            plotOptions: {
                column: {
                    pointWidth: 0,
                    borderWidth: 0,
                },
                bar: {
                    pointWidth: 0,
                    borderWidth: 0
                },
                line: { marker: { enabled: false } },
                series: {
                    lineWidth: 0,
                    states: { hover: { enabled: false } }
                }
            },
            xAxis: {
                labels: { enabled: false },
                title: { text: '' },
                tickLength: 0,
            },
            yAxis: {
                labels: { enabled: true },
                title: { text: '' },
                tickInterval: 10,
                tickPixelInterval: 10,
                min: 0,
                max: 100
            },
            tooltip: { enabled: false},
            legend: { enabled: false },
            series: [{
                name: '',
                data: [0]
            }]
        },
        // 축이 없는 차트 기본 config (PIE)
        NON_AXIS: {
            chart: {
                type: '',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                zoomType: 'x'
            },
            credits: { enabled: false },
            title: { text: '' },
            tooltip: {
                formatter: null,
                useHTML: true,
                pointFormat: {},
            },
            plotOptions: {
                series: {
                    cursor: 'pointer',
                    pointPadding: 0.1,
                    groupPadding: 0.1,
                    marker: { enabled: false },
                    point: { events: { click: {} } }
                },
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        distance: 20
                    }
                }
            },
            xAxis: {
                title: {
                    enabled: false,
                    text: ''
                },
                labels: { formatter: null },
                categories: []
            },
            yAxis: {
                title: {
                    enabled: false,
                    text: ''
                },
                showLastLabel: true
            },
            series: [{
                name: '',
                data: [],
                cursor: 'pointer',
                showInLegend: false,
                point: {
                    events: { click: {} }
                }
            }]
        },
        NON_AXIS_EMPTY: {
            chart: { type: '', },
            credits: { enabled: false },
            title: {
                text: MESSAGE['chart.no_results'],
                verticalAlign: 'middle',
                floating: true
            },
            plotOptions: {
                pie: {
                    animation: false,
                    colors: ['#CED6E0'],
                    borderWidth: 1,
                    borderColor: '#CED6E0',
                    dataLabels: { enabled: false },
                    states: { hover: { enabled: false } }
                }
            },
            xAxis: {
                labels: { enabled: false },
                title: { text: '' }
            },
            yAxis: {
                labels: { enabled: true },
                title: { text: '' },
                tickInterval: 10,
            },
            tooltip: { enabled: false },
            legend: { enabled: false },
            series: [{
                name: '',
                data: [{
                    name: MESSAGE['chart.no_results'],
                    y: 1
                }]
            }]
        }
    }
};
