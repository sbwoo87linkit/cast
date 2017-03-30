'use strict';
/**
 *
 */
var _ = require('lodash');
/**
 *
 */
errorHandler.$inject = ['$http', '$log', '$timeout', '$filter', 'popupBox'];
function errorHandler($http, $log, $timeout, $filter, popupBox) {
    /**
    *   put
    */
    var fnAlert = function (text) {
        $timeout(function () {
            popupBox.error(text);
        });
    };
    /**
    *   get
    */
    var _getMessage = function (data) {
        var json = null;

        if (_.isObject(data)) {
            json = data;
        }
        else if (_.isString(data)) {
            try {
                json = JSON.parse(data);
            }
            catch (e) {}
        }

        return (json) ? json.message : data;
    };
    /**
    *   putter
    */
    // val: '' or null or undefined
    var _putEmpty = function (val) {
        $log.error('unknown error:', val);
        fnAlert('unknown error: ' + val);
    };
    // msg: string
    var _putString = function (msg) {
        $log.error('error msg:', msg);
        fnAlert('error: ' + msg);
    };
    // json: object
    var _putJson = function (json) {
        $log.error('error:', json);
        fnAlert('error: ', JSON.stringify(json));
    };
    // err: { code, message }
    var _putError = function (err) {
        $log.error('error:', err);
        fnAlert($filter('errorMsg')(err));
    };
    // http response: object, { status, statusText, data }
    var _putHttpResponse = function (response) {
        $log.error('status:', response.status);
        $log.error('text:', response.statusText);

        var data = response.data;
        var json = null;

        if (_.isObject(data)) {
            json = data;
        }
        else if (_.isString(data)) {
            try {
                json = JSON.parse(data);
            }
            catch (e) {}
        }

        if (json) {
            _putError(json);
        }
        else {
            _putString(data);
        }
    };
    /**
    *   public
    */
    // ex1) var text = errorHandler.message(response);
    // ex2) var text = errorHandler.message(msgObj); // { message }
    // ex1) var text = errorHandler.message(msgStr);
    this.message = function (error) {
        if (!error) {
            return error;
        }

        var json = null;

        if (_.isString(error)) {
            try {
                json = JSON.parse(error);
            }
            catch (e) {}

            // is not json, error string
            if (!json) {
                return error;
            }

            error = json;
        }

        // http response
        if (error.status) {
            return _getMessage(error.data);
        }
        // not error object
        if (!error.message) {
            return JSON.stringify(error);
        }

        return error.message;
    };
    // ex1) errorHandler.handle(response);
    // ex2) errorHandler.handle(msgObj); // { message }
    // ex1) errorHandler.handle(msgStr);
    this.alert = function (error) {
        if (!error) {
            _putEmpty(error);
            return;
        }

        var json = null;

        if (_.isString(error)) {
            try {
                json = JSON.parse(error);
            }
            catch (e) {}

            // is not json string
            if (!json) {
                _putString(error);
                return;
            }

            error = json;
        }

        if (error.status) {
            _putHttpResponse(error);
            return;
        }
        if (!error.message) {
            _putJson(error);
            return;
        }

        _putError(error);
    };
    return this;
}

module.exports = errorHandler;
