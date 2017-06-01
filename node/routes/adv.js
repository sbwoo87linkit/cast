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
var histogram = require(path.join(DATA_PATH, 'histogram.json'));
var scatter = require(path.join(DATA_PATH, 'scatter.json'));
var summary = require(path.join(DATA_PATH, 'summary.json'));
var outlier = require(path.join(DATA_PATH, 'outlier.json'));

var lineplot_dev = require(path.join(DATA_PATH, 'lineplot_dev.json'));
var scatterplot_dev = require(path.join(DATA_PATH, 'scatterplot_dev.json'));
var motion_dev = require(path.join(DATA_PATH, 'motion_dev.json'));
var histogram_dev = require(path.join(DATA_PATH, 'histogram_dev.json'));
var barchart_dev = require(path.join(DATA_PATH, 'barchart_dev.json'));
var piechart_dev = require(path.join(DATA_PATH, 'piechart_dev.json'));
var sankey_dev = require(path.join(DATA_PATH, 'sankey_dev.json'));
var heatmap_dev = require(path.join(DATA_PATH, 'heatmap_dev.json'));




/**
 *   variables
 */
var MAX_SPLIT_NUM = 5;
var sessions = {};

// histogram
router.post('/adv-histogram/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-histogram/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
        // return res.send('sessions not found 404');
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(histogram);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-histogram/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});

// scatter
router.post('/adv-scatter/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-scatter/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(scatter);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-scatter/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});

// summary
router.post('/adv-summary/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-summary/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(summary);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-summary/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});

// outlier
router.post('/adv-outlier/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-outlier/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(outlier);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-outlier/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});


/**
 * TODO:  TEST DATA....
 */

// lineplot_dev
router.post('/adv-lineplot-dev/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-lineplot-dev/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(lineplot_dev);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-lineplot-dev/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});


// scatterplot_dev
router.post('/adv-scatterplot-dev/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-scatterplot-dev/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(scatterplot_dev);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-scatterplot-dev/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});







// motion_dev
router.post('/adv-motion-dev/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-motion-dev/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(motion_dev);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-motion-dev/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});





// histogram_dev
router.post('/adv-histogram-dev/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-histogram-dev/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(histogram_dev);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-histogram-dev/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});

// barchart_dev
router.post('/adv-barchart-dev/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-barchart-dev/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(barchart_dev);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-barchart-dev/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});



// piechart_dev
router.post('/adv-piechart-dev/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-piechart-dev/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(piechart_dev);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-piechart-dev/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});






// sankey_dev
router.post('/adv-sankey-dev/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-sankey-dev/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(sankey_dev);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-sankey-dev/jobs/:sid/close', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    delete sessions[sid];

    res.send({ message: 'OK' });
});







// heatmap_dev
router.post('/adv-heatmap-dev/jobs', function(req, res) {
    var body = req.body;
    if (!body.datamodel_id || !body.target_field) {
        return res.status(400).send({
            type: 'Invalid parameter',
            message: 'This was failed because...'
        });
    }

    var sid = uuidV1();
    sessions[sid] = {
        body: body,
        index: 1 // 1~MAX
    };

    res.send({ sid: sid });
});
router.get('/adv-heatmap-dev/jobs/:sid', function(req, res) {
    var sid = req.params.sid;

    if (!sessions[sid]) {
        return res.sendStatus(404);
    }

    var body = sessions[sid].body;
    var index = sessions[sid].index;
    var isEnd = (index === MAX_SPLIT_NUM);
    var data = _.cloneDeep(heatmap_dev);

    data.status = {
        'current': index,
        'total': MAX_SPLIT_NUM
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
    }, delay);
});
router.delete('/adv-heatmap-dev/jobs/:sid/close', function(req, res) {
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
