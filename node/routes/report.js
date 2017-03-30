'use strict';
/**
 *   constant
 */
var DATA_PATH = '../data';

/**
 *   modules
 */
var path = require('path');
var _ = require('lodash');
var uuidV1 = require('uuid/v1');

var moment = require('moment');
var FORMAT = {
    UNPARSED: 'YYYYMMDDHHmmss'
};

var express = require('express');
var router = express.Router();

var reportList = require(path.join(DATA_PATH, '/report/report.json')).data;
_.each(reportList, function (report) {
    if (report.pivotAttribute) {
        report.pivotAttribute = JSON.stringify(report.pivotAttribute);
    }
});
reportList = _.orderBy(reportList, 'mdate', 'desc');

/**
*
*/
router.get('/', function(req, res) {
    res.send({
        data: reportList
    });
});

router.get('/:id', function(req, res) {
    var report = _.find(reportList, { id: req.params.id });
    if (!report) {
        res.send(404).send({
            message: 'Not Found'
        });
    }

    res.send({
        data: report
    });
});
// 해당 데이터 모델이 사용된 보고서 목록 반환
router.get('/dataset/:id', function(req, res) {
    var id = req.params.id;
    res.send({
        data: _.filter(reportList, {
            modelId: id
        })
    });
});

router.post('/', function(req, res) {
    req.body.id = uuidV1();
    req.body.userId = 'debug';

    req.body.cdate = moment().format(FORMAT.UNPARSED);
    req.body.mdate = moment().format(FORMAT.UNPARSED);

    reportList.push(req.body);

    res.send({
        data: req.body
    });
});

router.put('/:id', function(req, res) {
    var index = _.findIndex(reportList, { id: req.params.id });
    if (index === -1) {
        res.status(404).send({
            message: 'Not Found'
        });
    }

    req.body.id = req.params.id;
    req.body.mdate = moment().format(FORMAT.UNPARSED);
    _.assign(reportList[index], req.body);

    res.send({
        data: reportList[index]
    });
});

router.delete('/:id', function(req, res) {
    var index = _.findIndex(reportList, { id: req.params.id });
    if (index === -1) {
        res.status(404).send({
            message: 'Not Found'
        });
    }

    reportList = _.reject(reportList, req.params);

    res.send({
        id: req.params.id
    });
});

/**
 *   exports
 */
module.exports = router;
