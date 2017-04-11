'use strict';
/**
 *   constant
 */
// var DATA_PATH = '../data/anomaly';
var DELAY_MS = (500);
/**
 *   modules
 */
// var path = require('path');
var _ = require('lodash');

var express = require('express');
var router = express.Router();
// var _ = require('lodash');
var uuidV1 = require('uuid/v1');
/**
 *   data
 */
// var data = require(path.join(DATA_PATH, 'data.json'));
/**
 *   variables
 */
var MAX_SPLIT_NUM = 5;
var sessions = {};

var dataSum = function(num) {
    return num + Math.floor((Math.random() * 1000) + 100);
};

var makeFieldData = function(sid, fields, key) {
    var session = sessions[sid];
    var data = session.data;

    return _.map(fields, function(value, index) {
        var values = (data && data.fields[key]) ? data.fields[key][index].values : [];
        if (values.length === 0) {
            for (var i = 0, l = 6; i < l; i++) {
                values.push(Math.floor((Math.random() * 2000) + 4000));
            }
        }

        return {
            name: value.name,
            values: _.map(values, dataSum)
        };
    });
};

var makeResult = function(sid) {
    var session = sessions[sid];
    var data = session.data;

    var results = (data && data.results) ? data.results : [];
    if (results.length === 0) {
        for (var i = 0, l = 6; i < l; i++) {
            var tempArr = [];
            for (var n = 0, m = 12; n < m; n++) {
                tempArr.push(Math.floor((Math.random() * 50) + MAX_SPLIT_NUM));
            }
            results.push(tempArr);
        }
    }

    return _.map(results, function(value) {
        return _.map(value, dataSum);
    });
};

var makeData = function(sid, param) {
    var status = {
        current: 1,
        total: Math.floor((Math.random() * 10) + MAX_SPLIT_NUM)
    };

    var stops = [1, 5, 7.5, 15];

    var fields = {};

    if (param.ade.key) {
        fields.key_field = makeFieldData(sid, param.ade.key, 'key_field');
    }
    if (param.ade.value) {
        fields.value_field = makeFieldData(sid, param.ade.value, 'value_field');
    }

    var data = {
        status: status,
        fields: fields,
        stops: stops,
        results: makeResult(sid)
    };

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

    var index = sessions[sid].index;
    var param = sessions[sid].param;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = makeData(sid, param);
    // var getOnce = (param.getOnce) ? param.getOnce : false;
    var noDelay = (param.noDelay) ? param.noDelay : false;

    if (!isEnd) {
        data.status = {
            'current': index,
            'total': MAX_SPLIT_NUM,
        };
        data.isEnd = false;

        sessions[sid].index = (index + 1);
    } else {
        data.status = {
            'current': index,
            'total': (MAX_SPLIT_NUM)
        };
        data.isEnd = true;
    }

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
