'use strict';
/**
 *
 */
var uuidV1 = require('uuid/v1');
var _ = require('lodash');
var moment = require('moment');
/**
 *
 */
advAgent.$inject = ['$rootScope', '$http', '$filter', '$log', '$q'];
function advAgent($rootScope, $http, $filter, $log, $q) {


    this.cancelAllRequests = function (requests) {
        _.forEach(requests, function (request) {
            return $http.delete('adv/' + request.service + '/jobs/' + request.id + '/close');
        })
    };

    this.getId = function (service, data) {
        return $http.post('adv/' + service + '/jobs', data);  //returns promise
    };

    this.getData = function (service, sid) {
        return $http.get('adv/' + service + '/jobs/' + sid);
    };

    return this;
}

module.exports = advAgent;
