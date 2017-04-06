'use strict';
/**
 *   constant
 */
var DATA_SEARCH_PATH = '../data/search/ver3';
var DATA_MODEL_PATH = '../data/data-model';
var DEFAULT = {
    TABLE: 'BATTING',
    UNIT: '1d',
    DATE_FORMAT: 'YYYYMMDDHHmmss'
};
var JOB = {
    FIGURES: 'figures',
    SEARCH: 'search',
    STATS: 'stats',
    STATS_DETAIL: 'stats_detail',
    TIMELINE: 'timeline'
};
var DELAY_MS = (1000 * 0.1);
/**
 *   modules
 */
var path = require('path');
var _ = require('lodash');
var moment = require('moment');
var uuidV1 = require('uuid/v1');

var express = require('express');
var router = express.Router();

/**
 *   data
 */
var historyList = require(path.join(DATA_SEARCH_PATH, 'history.json'));
var dataModelList = require(path.join(DATA_MODEL_PATH, 'data-model.json')).data;
/**
 *   init
 */
/**
 *   variables
 */
var sessions = {
    figures: {},
    search: {},
    timeline: {},
    stats: {},
    stats_detail: {}
};

var CSV_FILE_PATH = __dirname + '/../data/search/ver2/download/search.csv';
var JSON_FILE_PATH = __dirname + '/../data/search/ver2/download/search.json';

/**
 *   routing
 */
// 검색 히스토리 목록
router.get('/history', function(req, res) {
    // 항상 시간 역순 정렬한 결과를 반환
    historyList.data = _.orderBy(historyList.data, 'executeTime', 'desc');
    res.send(historyList);
});
// 추가(저장)
router.post('/history', function(req, res) {
    var body = req.body;

    body.id = uuidV1();
    body.executeTime = moment().format(DEFAULT.DATE_FORMAT);

    historyList.data.push(body);

    res.send(body);
});
// 통계 정보 요청
router.post('/iris-figures/jobs', function(req, res) {
    var sid = createSID();

    var tableName = getTableName(req.body.datamodel_id);
    var figuresData = getData(JOB.FIGURES, tableName).data;

    sessions.figures[sid] = req.body;
    sessions.figures[sid].index = 0;
    sessions.figures[sid].data = figuresData;

    res.send({
        sid: sid
    });
});
// 통계 정보 반환
router.get('/iris-figures/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    // session not found
    var session = sessions.figures[sid];
    if (!session) {
        return res.sendStatus(404);
    }

    // request data by index
    var index = session.index;

    if (!session.data || !session.data[index]) {
        return res.sendStatus(404);
    }
    var data = session.data[index];

    // save index
    session.index = (index + 1);

    setTimeout(function() {
        return res.send(data);
    }, DELAY_MS);
});
// 통계 정보 요청 닫기
router.delete('/iris-figures/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    var session = sessions.figures[sid];
    if (session) {
        delete sessions.figures[sid];
    }

    res.send({
        sid: sid
    });
});
// 검색 정보 요청
router.post('/iris-search/jobs', function(req, res) {
    var sid = createSID();

    var tableName = getTableName(req.body.datamodel_id);
    var searchData = getData(JOB.SEARCH, tableName).data;

    // 요청 정보와 timeline 데이터를 session에 저장해놓는다
    sessions.search[sid] = req.body;
    sessions.search[sid].index = 0;
    sessions.search[sid].data = searchData;

    res.send({
        sid: sid
    });
});
// 검색 정보 반환
router.get('/iris-search/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    // session not found
    var session = sessions.search[sid];
    if (!session) {
        return res.sendStatus(404);
    }

    // request data by index
    var index = session.index;

    if (!session.data || !session.data[index]) {
        return res.sendStatus(404);
    }
    var data = session.data[index];

    // save index
    session.index = (index + 1);

    setTimeout(function() {
        return res.send(data);
    }, DELAY_MS);
});

router.get('/iris-search/jobs/:sid/download', function(req, res) {
    var sid = req.params.sid;
    var session = sessions.search[sid];

    if (!session) {
        return res.sendStatus(500);
    }

    var type = req.query.type;
    var fileName = [req.query.file_name, '.', type].join('');

    var filePath = '';

    if (type === 'csv') {
        filePath = CSV_FILE_PATH;
    } else {
        filePath = JSON_FILE_PATH;
    }

    return res.download(filePath, fileName);
});
// 검색결과 export
router.get('/iris-search/jobs/:sid/export', function(req, res) {
    var sid = req.params.sid;
    var session = sessions.search[sid];

    if (!session) {
        return res.status(500).send({
            message: 'export failed'
        });
    }

    return res.send({
        message: 'ok'
    });
});
// 검색 정보 요청 닫기
router.delete('/iris-search/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    var session = sessions.search[sid];
    if (session) {
        delete sessions.search[sid];
    }

    res.send({
        sid: sid
    });
});
// 타임라인 데이터 요청
router.post('/iris-timeline/jobs', function(req, res) {
    var sid = createSID();

    var tableName = getTableName(req.body.datamodel_id);
    var timelineData = getData(JOB.TIMELINE, tableName).data;

    // 요청 정보와 timeline 데이터를 session에 저장해놓는다
    sessions.timeline[sid] = req.body;
    sessions.timeline[sid].index = 0;
    var unit = (req.body.unit || DEFAULT.UNIT);
    sessions.timeline[sid].data = timelineData[unit];

    res.send({
        sid: sid
    });
});
// 타임라인 데이터 반환
router.get('/iris-timeline/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    // session not found
    var session = sessions.timeline[sid];
    if (!session) {
        return res.sendStatus(404);
    }

    // request data by index
    var index = session.index;

    if (!session.data || !session.data[index]) {
        return res.sendStatus(404);
    }
    var data = session.data[index];

    // save index
    session.index = (index + 1);

    setTimeout(function() {
        return res.send(data);
    }, DELAY_MS);
});
// 타임라인 종료 요청
router.delete('/iris-timeline/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    var session = sessions.timeline[sid];
    if (session) {
        delete sessions.timeline[sid];
    }

    res.send({
        sid: sid
    });
});
// 필드 통계 정보 요청
router.post('/iris-stats/jobs', function(req, res) {
    var sid = createSID();

    var tableName = getTableName(req.body.datamodel_id);
    var statsDetailData = getData(JOB.STATS, tableName).data;

    sessions.stats[sid] = req.body;
    sessions.stats[sid].index = 0;
    sessions.stats[sid].data = statsDetailData;

    res.send({
        sid: sid
    });
});
// 필드 통계 정보 반환
router.get('/iris-stats/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    // session not found
    var session = sessions.stats[sid];
    if (!session) {
        return res.sendStatus(404);
    }

    var index = (session.index + 1);
    // save index
    session.index = index;

    // request data by index
    var data = sessions.stats[sid].data[index];

    setTimeout(function() {
        return res.send(data);
    }, DELAY_MS);
});
// 필드 통계 정보 요청 닫기
router.delete('/iris-stats/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    var session = sessions.stats[sid];
    if (session) {
        delete sessions.stats[sid];
    }

    res.send({
        sid: sid
    });
});
// 특정 필드 통계 정보 요청
router.post('/iris-stats-details/:field/jobs', function(req, res) {
    var sid = createSID();
    var field = req.params.field;

    var tableName = getTableName(req.body.datamodel_id);
    var statsDetailData = getData(JOB.STATS_DETAIL, tableName);

    sessions.stats_detail[sid] = req.body;
    sessions.stats_detail[sid].index = 0;
    sessions.stats_detail[sid].field = field;
    sessions.stats_detail[sid].data = statsDetailData[field];

    res.send({
        sid: sid
    });
});
// 특정 필드 통계 정보 반환
router.get('/iris-stats-details/:field/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    // session not found
    var session = sessions.stats_detail[sid];
    if (!session) {
        return res.sendStatus(404);
    }

    // request data by index
    var index = session.index;

    if (!session.data || !session.data[index]) {
        return res.sendStatus(404);
    }
    var data = session.data[index];

    // save index
    session.index = (index + 1);

    setTimeout(function() {
        return res.send(data);
    }, DELAY_MS);
});
// 특정 필드 통계 정보 닫기
router.delete('/iris-stats-details/:field/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    var session = sessions.stats_detail[sid];
    if (session) {
        delete sessions.stats_detail[sid];
    }

    res.send({
        sid: sid
    });
});

/**
 *  function
 */
function createSID() {
    return (new Date()).getTime() / 10000;
}

function getTableName(dmID) {
    return _.find(dataModelList, {
        'id': dmID
    }).dataset.table || DEFAULT.TABLE;
}

function getData(job, tableName) {
    var dataPath = path.join(DATA_SEARCH_PATH, '/' + job + '/' + tableName + '.json');
    var data = require(dataPath);

    if (!data) {
        dataPath = path.join(DATA_SEARCH_PATH, '/' + job + '/' + DEFAULT.TABLE + '.json');
        data = require(dataPath);
    }

    return data;
}
/**
 *   exports
 */
module.exports = router;
