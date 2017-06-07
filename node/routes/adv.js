'use strict';
/**
 *   constant
 */
var DATA_PATH = '../data/adv';
var DELAY_MS = 500;
/**
 *   modules
 */
var path = require('path');
var _ = require('lodash');
var uuidV1 = require('uuid/v1');

var express = require('express');
var router = express.Router();
/**
 *   data
 */
var _data = {
    bar: require(path.join(DATA_PATH, 'bar.json')),
    heatmap: require(path.join(DATA_PATH, 'heatmap.json')),
    line: require(path.join(DATA_PATH, 'line.json')),
    motion: require(path.join(DATA_PATH, 'motion.json')),
    outlier: require(path.join(DATA_PATH, 'outlier.json')),
    pie: require(path.join(DATA_PATH, 'pie.json')),
    sankey: require(path.join(DATA_PATH, 'sankey.json')),
    scatter: require(path.join(DATA_PATH, 'scatter.json')),
    histogram: require(path.join(DATA_PATH, 'histogram.json')),
    summary: require(path.join(DATA_PATH, 'summary.json'))
};
/**
 *   variables
 */
var MAX_SPLIT_NUM = 5;
var sessions = {};

// histogram
router.post('/adv-:visualType/jobs', function(req, res) {
    // var vType = req.params.visualType;
    var body = req.body;
    if (!body.datamodel_id) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    if (body.target_field && body.target_field.indexOf('RAW') !== -1) {
        return res.status(400).send({
            message: 'unsupported operand type(s) for *: \'int\' and \'NoneType\'',
            type: '<type \'exceptions.TypeError\'>'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-:visualType/jobs/:sid', function(req, res) {
    var vType = req.params.visualType;
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(_data[vType]);
    if (!data) {
        return res.status(404).send({
            message: 'data is not exists: ' + vType
        });
    }

    data.status = {
        current: index,
        total: MAX_SPLIT_NUM
    };
    data.isEnd = isEnd;

    if (!isEnd) {
        sessions[sid].index = (index + 1);
    }

    // var getOnce = (body.getOnce) ? body.getOnce : false;
    var noDelay = (body.noDelay) ? body.noDelay : false;
    var delay = ((noDelay) ? 0 : DELAY_MS);
    setTimeout(function() {
        res.send(data);
    }, delay * 1);
});
router.delete('/adv-:visualType/jobs/:sid/close', function(req, res) {
    // var vType = req.params.visualType;
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});
/**
 *   functions
 */
/**
 *   exports
 */
module.exports = router;
