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


    // .controller('anomaly.card.ContainerCtrl', require('./card/container.js'))
    // .controller('anomaly.card.CardCtrl', require('./card/card.js'))
    // .controller('anomaly.card.ResultCtrl', require('./card/result.js'))
    //
    // .controller('anomaly.dialog.DialogCtrl', require('./dialog/dialog.js'))
    // .controller('anomaly.dialog.FormCtrl', require('./dialog/form.js'))
    // .controller('anomaly.dialog.layer.KeyFieldCtrl', require('./dialog/layer/key.js'))
    // .controller('anomaly.dialog.layer.ValueFieldCtrl', require('./dialog/layer/value.js'))
    //
    // .controller('anomaly.dialog.layer.TimeComCtrl', require('./dialog/layer/time_com.js'))
    // .controller('anomaly.dialog.layer.TimeRefCtrl', require('./dialog/layer/time_ref.js'))

    ;
