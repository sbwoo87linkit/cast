'use strict';
/**
 *  constant
 */
var DATA_PATH = '../data/data-model';
var COMMON_DATA_PATH = '../data/common/ver3';
var RES_ERR_CODE = 500;
var RES_ERR_OBJ = {
    type: 'RuntimeError',
    message: 'This was failed because...'
};
/**
 *  modules
 */
var path = require('path');
var express = require('express');
var _ = require('lodash');
var moment = require('moment');
/**
 *  member variables
 */
var router = express.Router();
var data = require(path.join(DATA_PATH, 'data-model.json')).data;
var tableList = require(path.join(COMMON_DATA_PATH, '/table/list.json')).data;
var uuidV1 = require('uuid/v1');
/**
 *  request
 */
// Data model을 생성합니다.
router.post('/datamodel', function(req, res) {
    // 요청 정보
    var reqBody = req.body;
    // 고유 아이디 생성
    var id = uuidV1();
    reqBody.id = id;
    if (reqBody.dataset.format === 'iris') {
        var table = _.find(tableList, { 'name': reqBody.dataset.table });
        reqBody.scope = ((table) ? table.scope : 'LOCAL');
    }
    reqBody.userid = 'root';
    var date = moment().format('YYYYMMDDHHmmss');
    reqBody.cdate = date;
    reqBody.mdate = date;
    // 디버그 데이터에 추가
    data.push(reqBody);
    // 응답
    res.send({
        'message': 'OK',
        'id': id
    });
});

// 모든 데이터 모델에 대한 정보를 가져옵니다.
router.get('/datamodel', function(req, res) {
    // 응답
    res.send({
        data: data
    });
});

// 해당 데이터 모델에 대한 정보를 가져옵니다.
router.get('/datamodel/:id', function(req, res) {
    // 데이터 모델 고유 아이디
    var id = req.params.id;
    // id로 해당 데이터 모델 찾기
    var resBody = _.find(data, function(o) {
        return (o.id === id);
    });
    // 찾는 모델이 없을 경우 에러 응답
    if (resBody === undefined) {
        res.status(RES_ERR_CODE).send(RES_ERR_OBJ);
    }
    // 응답
    res.send({
        data: resBody
    });
});

// Data model의 정보를 수정합니다. 해당 데이터 모델은 필드명, 테이블 명, 속성 및 구분 을 갖습니다. 해당 속성은 전체를 덮어쓰게 됩니다.
router.put('/datamodel/:id', function(req, res) {
    // 갱신 하려는 데이터 모델 고유 아이디
    var id = req.params.id;
    // 갱신 정보
    var reqBody = req.body;
    // 존재하는지 확인
    var index = _.findIndex(data, function(o) {
        return (o.id === id);
    });

    if (index > -1) {
        // 존재하는 경우 갱신
        reqBody.id = id;
        if (reqBody.dataset.format === 'iris') {
            var table = _.find(tableList, { 'name': reqBody.dataset.table });
            reqBody.scope = ((table) ? table.scope : 'LOCAL');
        }
        reqBody.userid = 'root';
        var date = moment().format('YYYYMMDDHHmmss');
        reqBody.cdate = date;
        reqBody.mdate = date;
        data[index] = reqBody;
        // 응답
        res.send({
            'message': 'OK',
            'id': id
        });
    } else {
        res.status(RES_ERR_CODE).send(RES_ERR_OBJ);
    }
});

// 해당 데이터 모델을 삭제합니다.
router.delete('/datamodel/:id', function(req, res) {
    // 삭제 하려는 데이터 모델 고유 아이디
    var id = req.params.id;
    // 존재하는지 확인
    var index = _.findIndex(data, function(o) {
        return (o.id === id);
    });

    if (index > -1) {
        data = _.remove(data, function(o) {
            return (o.id !== id);
        });
        // 응답
        res.send({
            'message': 'OK',
            'id': id
        });
    } else {
        res.status(RES_ERR_CODE).send(RES_ERR_OBJ);
    }
});
module.exports = router;
