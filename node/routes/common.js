'use strict';
/**
 *   constant
 */
var DATA_PATH = '../data/common/ver3';
var DELAY_MS = 500;
/**
 *   modules
 */
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var express = require('express');
var router = express.Router();
/**
 *   data
 */
var dataModelList = require('../data/data-model/data-model.json').data;
var tableList = require(path.join(DATA_PATH, '/table/list.json'));
/**
 *   routing
 */
router.get('/property/locale', function(req, res) {
    res.send({
        locale: 'ko'
    });
});

// ping/pong
router.get('/ping', function(req, res) {
    res.status(200).send({
        data: 'pong'
    });
});

// Angora 인증 토큰 발급 여부
router.get('/token', function(req, res) {
    res.send({
        data: true
    });
});

// 데이터셋(DB table) 목록
router.get('/table_list', function(req, res) {
    res.send(tableList);
});

// 테이블별 필드 목록
router.get('/fields', function(req, res) {
    // 요청 정보
    var query = req.query.q;
    var tableName = query.split(' ')[2];

    var filePath = path.join(__dirname, DATA_PATH, '/field/' + tableName + '.json');

    if (tableName.indexOf('/') > -1 || tableName.indexOf('\\') > -1) {
        filePath = path.join(__dirname, DATA_PATH, '/field/BATTING.json');
    }

    fs.access(filePath, function(err) {
        if (err) {
            res.sendStatus(404);
            return;
        }

        res.send(require(filePath));
    });
});
// 샘플 데이터
router.get('/sample', function(req, res) {
    // 요청 정보
    var query = req.query.q;
    var tableName = query.split(' ')[2];

    var filePath = path.join(__dirname, DATA_PATH, '/table/sample/' + tableName + '.json');

    if (tableName.indexOf('/') > -1 || tableName.indexOf('\\') > -1) {
        filePath = path.join(__dirname, DATA_PATH, '/table/sample/BATTING.json');
    }

    fs.access(filePath, function(err) {
        if (err) {
            res.sendStatus(404);
            return;
        }

        res.send(require(filePath));
    });
});
// 파티션 개수
router.get('/metadata', function (req, res) {
    var query = req.query;
    var modelId = query.datamodel_id;
    var model = _.find(dataModelList, ['id', modelId]);
    if (!model) {
        res.sendStatus(404);
        return;
    }

    setTimeout(function() {
        res.send({
            data: {
                partition_num: (model.name.indexOf('APOLLO_ENB') === -1) ? 0 : 1000
            }
        });
    }, DELAY_MS);
});
/**
 *   exports
 */
module.exports = router;
