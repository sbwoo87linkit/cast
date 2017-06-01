'use strict';
/**
 *
 */
var angular = require('angular');
/**
*
*/
module.exports = angular.module('sherman.controllers.analysis', [])
    .controller('analysis.ChooseDataCtrl', require('./chooseData.js'))

    .controller('analysis.MainCtrl', require('./main.js'))
    .controller('analysis.TopInfoCtrl', require('./info.js'))

    .controller('analysis.chart.ContainerCtrl', require('./chart/container.js'))

    .controller('analysis.chart.ChartOptionCtrl', require('./chart/chart_option_dlg.js'))

    .controller('analysis.chart.OutlierCtrl', require('./chart/outlier.js'))
    .controller('analysis.chart.LineplotCtrl', require('./chart/lineplot.js'))
    .controller('analysis.chart.ScatterplotCtrl', require('./chart/scatterplot.js'))
    .controller('analysis.chart.MotionCtrl', require('./chart/motion.js'))
    .controller('analysis.chart.HistogramCtrl', require('./chart/histogram.js'))
    .controller('analysis.chart.BarchartCtrl', require('./chart/barchart.js'))
    .controller('analysis.chart.PiechartCtrl', require('./chart/piechart.js'))
    .controller('analysis.chart.SankeyCtrl', require('./chart/sankey.js'))
    .controller('analysis.chart.HeatmapCtrl', require('./chart/heatmap.js'));
