'use strict';
/**
 *   constant
 */
var DATA_PATH = '../data/anomaly';
var DELAY_MS = (500);
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
var data_k0_v1 = require(path.join(DATA_PATH, 'data_k0_v1.json'));
var data_k1_v1 = require(path.join(DATA_PATH, 'data_k1_v1.json'));
var data_k1_v2 = require(path.join(DATA_PATH, 'data_k1_v2.json'));
var data_k2_v1 = require(path.join(DATA_PATH, 'data_k2_v1.json'));
var data_large = require(path.join(DATA_PATH, 'data_large.json'));
/**
 *   variables
 */
var MAX_SPLIT_NUM = 5;
var sessions = {};

var makeData = function(sid, param) {
    var data = null;
    var ade = param.ade;
    var keys = ade.key;
    var values = ade.values;

    if (keys.length === 0) {
        data = _.cloneDeep(data_k0_v1);
    }
    else if (keys.length <= 1) {
        if (keys[0].name === 'HR' && _.isEqual(values[0], { name: 'HR', func: 'sum' })) {
            data = _.cloneDeep(data_large);
        }
        else if (values.length === 1) {
            data = _.cloneDeep(data_k1_v1);
        }
        else {
            data = _.cloneDeep(data_k1_v2);
        }
    }
    else {
        // if (values.length === 1) {
            data = _.cloneDeep(data_k2_v1);
        // }
        // else {}
    }

    data.status.current = 1;
    data.status.total = Math.floor((Math.random() * 10) + MAX_SPLIT_NUM);

    sessions[sid].data = data;

    return data;
};

// sid 요청
router.post('/ade/jobs', function(req, res) {
    var reqBody = req.body;

    if (!reqBody.datamodel_id || !reqBody.ade) {
        res.statusCode = 400;
        res.send({
            'type': 'Invalid parameter',
            'message': 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        param: reqBody,
        index: 1 // 1~MAX
    };

    res.send({
        sid: sid
    });
});

// 결과 요청
router.get('/ade/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var param = sessions[sid].param;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);

    var data = makeData(sid, param);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
    };
    data.isEnd = isEnd;

    if (!isEnd) {
        sessions[sid].index = (index + 1);
    }

    // var getOnce = (param.getOnce) ? param.getOnce : false;
    var noDelay = (param.noDelay) ? param.noDelay : false;
    var delay = ((noDelay) ? 0 : DELAY_MS);
    setTimeout(function() {
        res.send(data);
    }, delay);
});

// 요청 중지
router.delete('/ade/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({
        'message': 'OK'
    });
});
/**
 *   functions
 */
/**
 *   exports
 */
module.exports = router;
