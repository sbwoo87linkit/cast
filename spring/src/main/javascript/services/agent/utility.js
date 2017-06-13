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
utility.$inject = ['$rootScope', '$http', '$filter', '$log', '$q', 'popupLayerStore' ];
function utility($rootScope, $http, $filter, $log, $q, popupLayerStore) {
    //
    //
    // this.cancelAllRequests = function (requests) {
    //     _.forEach(requests, function (request) {
    //         return $http.delete('adv/' + request.service + '/jobs/' + request.id + '/close');
    //     })
    // };
    //
    // this.getId = function (service, data) {
    //     return $http.post('adv/' + service + '/jobs', data);  //returns promise
    // };
    //
    // this.getData = function (service, sid) {
    //     return $http.get('adv/' + service + '/jobs/' + sid);
    // };

    this.strToDate = function (dateString) {
        var year = dateString.substr(0, 4);
        var month = Number(dateString.substr(4, 2)) - 1;
        var day = dateString.substr(6, 2);
        var hour = dateString.substr(8, 2);
        var min = dateString.substr(10, 2);
        var sec = dateString.substr(12, 2);
        return Date.UTC(year, month, day, hour, min, sec);

    }

    this.closeAllLayers = function () {
        popupLayerStore.get('adv.xAxisField.setting').closeEl();
        popupLayerStore.get('adv.yAxisField.setting').closeEl();
        popupLayerStore.get('adv.valueField.setting').closeEl();
    }

    this.openPopupLayer = function (layerId, position, target) {
        console.log(layerId, position, target)
        // var key = 'adv.timeField.setting';
        var layer = popupLayerStore.get(layerId);
        if (!layer) {
            return;
        }
        // var $target = angular.element($event.target);
        layer.placeEl(target, position).openEl();
    }

    return this;
}

module.exports = utility;
