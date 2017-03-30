'use strict';

var express = require('express');
var router = express.Router();

var request = require('request');
var _ = require('lodash');

// TEMP: ...
router.get('/v1', function(req, res) {
    res.send('ok');
});

/* pipe API server */
router.all('/v1/*', function(req, res) {
    var method = req.method.toLowerCase();
    var body = req.body;

    var opts = {
        url: {
            protocol: 'http:',
            hostname: '127.0.0.1',
            port: global.config.api.port,
            pathname: req.path.replace('/v1', ''),
            query: req.url.split('?')[1]
        }
    };

    // HTTP method -> (module)request method
    method = (method === 'delete') ? 'del' : method;

    // if 'GET' then: can not use request body.
    if (method !== 'get') {
        // TODO: content-type에 맞추어 options를 조정해야 한다.
        // ex) Content-type: application/x-www-form-urlencoded
        // ex) Content-type: application/json
        if (_.isObject(body) && !_.isEmpty(body)) {
            opts.body = body;
            opts.json = true;
        }
        // 'text' -> '"text"'
        else if (_.isString(body)) {
            opts.body = JSON.stringify(body);
        }
    }
    // client request -> request instance -> resource server
    // client response <- request instance <- resource server
    req.pipe(request[method](opts))
        // .once('error', function requestError (err) {
        //     res.status(500).send(err);
        // })
        .pipe(res);
});

module.exports = router;
